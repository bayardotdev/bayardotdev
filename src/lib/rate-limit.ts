/**
 * Fixed-window rate limiting for the public chat endpoint.
 *
 * Two stores are supported:
 *  - Upstash Redis, used automatically when UPSTASH_REDIS_REST_URL and
 *    UPSTASH_REDIS_REST_TOKEN are set. Shared across all instances, so this is
 *    the only store that actually holds on serverless.
 *  - An in-process Map, used otherwise. Per-instance only: a platform that runs
 *    N concurrent instances effectively allows N x the limit, and counters reset
 *    on cold start. Fine for local dev and a single long-lived server.
 */

export type RateLimitWindow = {
    /** Identifier used in the storage key, e.g. 'min' or 'day'. */
    name: string;
    limit: number;
    windowSeconds: number;
};

export type RateLimitResult = {
    ok: boolean;
    limit: number;
    remaining: number;
    /** Seconds until the offending window resets. */
    retryAfter: number;
};

const UPSTASH_URL = process.env.UPSTASH_REDIS_REST_URL;
const UPSTASH_TOKEN = process.env.UPSTASH_REDIS_REST_TOKEN;

export const usingSharedStore = Boolean(UPSTASH_URL && UPSTASH_TOKEN);

// ---------------------------------------------------------------- memory store

type Counter = { count: number; resetAt: number };

const counters = new Map<string, Counter>();
/** Sweep expired keys once the map grows past this, to bound memory. */
const SWEEP_THRESHOLD = 10_000;

function hitMemory(key: string, windowSeconds: number, now: number): Counter {
    if (counters.size > SWEEP_THRESHOLD) {
        for (const [k, v] of counters) {
            if (v.resetAt <= now) counters.delete(k);
        }
    }

    const existing = counters.get(key);
    if (!existing || existing.resetAt <= now) {
        const fresh = { count: 1, resetAt: now + windowSeconds * 1000 };
        counters.set(key, fresh);
        return fresh;
    }

    existing.count += 1;
    return existing;
}

// --------------------------------------------------------------- upstash store

/**
 * INCR the key and set its TTL only if absent, so the window starts on the
 * first hit and isn't extended by later ones. Returns null if the store is
 * unreachable, letting the caller fall back to the in-process counter.
 */
async function hitUpstash(
    key: string,
    windowSeconds: number,
): Promise<{ count: number; ttl: number } | null> {
    try {
        const res = await fetch(`${UPSTASH_URL}/pipeline`, {
            method: 'POST',
            headers: {
                Authorization: `Bearer ${UPSTASH_TOKEN}`,
                'Content-Type': 'application/json',
            },
            body: JSON.stringify([
                ['INCR', key],
                ['EXPIRE', key, String(windowSeconds), 'NX'],
                ['TTL', key],
            ]),
            cache: 'no-store',
        });

        if (!res.ok) {
            console.error('Rate limit store returned', res.status);
            return null;
        }

        const payload = (await res.json()) as Array<{ result?: unknown; error?: string }>;
        const count = Number(payload[0]?.result);
        const ttl = Number(payload[2]?.result);
        if (!Number.isFinite(count)) return null;

        return { count, ttl: Number.isFinite(ttl) && ttl > 0 ? ttl : windowSeconds };
    } catch (error) {
        console.error('Rate limit store unreachable:', error);
        return null;
    }
}

// ------------------------------------------------------------------- public API

/**
 * Consume one token from every window. All windows are incremented even when an
 * earlier one already failed, so a client cannot dodge the daily cap by first
 * tripping the per-minute cap.
 */
export async function rateLimit(
    identifier: string,
    windows: RateLimitWindow[],
    now: number,
): Promise<RateLimitResult> {
    let exceeded: RateLimitResult | null = null;
    let tightest: RateLimitResult | null = null;

    for (const window of windows) {
        const key = `ratelimit:${window.name}:${identifier}`;

        let count: number;
        let retryAfter: number;

        const shared = usingSharedStore ? await hitUpstash(key, window.windowSeconds) : null;
        if (shared) {
            count = shared.count;
            retryAfter = shared.ttl;
        } else {
            const counter = hitMemory(key, window.windowSeconds, now);
            count = counter.count;
            retryAfter = Math.max(1, Math.ceil((counter.resetAt - now) / 1000));
        }

        const result: RateLimitResult = {
            ok: count <= window.limit,
            limit: window.limit,
            remaining: Math.max(0, window.limit - count),
            retryAfter,
        };

        if (!result.ok && !exceeded) exceeded = result;
        if (!tightest || result.remaining < tightest.remaining) tightest = result;
    }

    return exceeded ?? tightest!;
}

/**
 * Best-effort client identity. On Vercel and Cloudflare these headers are set by
 * the platform edge and can be trusted; behind an untrusted proxy they are
 * spoofable, which is the ceiling on what IP-based limiting can offer.
 */
export function clientIdentifier(req: Request): string {
    const forwarded = req.headers.get('x-forwarded-for');
    if (forwarded) return forwarded.split(',')[0]!.trim();

    return (
        req.headers.get('cf-connecting-ip') ??
        req.headers.get('x-real-ip') ??
        'unknown'
    );
}
