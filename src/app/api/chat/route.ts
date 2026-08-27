import { createOpenAI } from '@ai-sdk/openai';
import { convertToModelMessages, streamText, type UIMessage } from 'ai';
import { z } from 'zod';
import { clientIdentifier, rateLimit, type RateLimitWindow } from '@/lib/rate-limit';

export const maxDuration = 30;

/** Per-IP budget. The daily cap is what bounds token spend from a single abuser. */
const RATE_LIMIT_WINDOWS: RateLimitWindow[] = [
    { name: 'min', limit: 10, windowSeconds: 60 },
    { name: 'day', limit: 100, windowSeconds: 86_400 },
];

/**
 * Payloads past these bounds are abuse, not use, and are rejected outright.
 */
const HARD_MAX_MESSAGES = 100;
const HARD_MAX_PARTS_PER_MESSAGE = 32;
const MAX_CHARS_PER_PART = 4_000;
const HARD_MAX_CHARS_TOTAL = 50_000;

/**
 * A normal session grows past these, so the context is trimmed to them rather
 * than rejected — a long conversation should lose old turns, not break.
 */
const CONTEXT_MAX_MESSAGES = 20;
const CONTEXT_MAX_CHARS = 12_000;

/**
 * Part shape is validated loosely: the client legitimately sends parts we don't
 * forward (`step-start` on every assistant message, and `state` on text parts),
 * so anything non-text is filtered out below rather than rejected. Roles are
 * still restricted — a client must not be able to inject a `system` message and
 * rewrite the assistant's instructions.
 */
const requestSchema = z.object({
    messages: z
        .array(
            z.object({
                id: z.string().max(128).optional(),
                role: z.enum(['user', 'assistant']),
                parts: z
                    .array(
                        z.object({
                            type: z.string().max(64),
                            text: z.string().max(MAX_CHARS_PER_PART).optional(),
                        }),
                    )
                    .min(1)
                    .max(HARD_MAX_PARTS_PER_MESSAGE),
            }),
        )
        .min(1)
        .max(HARD_MAX_MESSAGES),
});

type TextOnlyMessage = {
    id?: string;
    role: 'user' | 'assistant';
    parts: { type: 'text'; text: string }[];
};

function messageChars(message: TextOnlyMessage): number {
    return message.parts.reduce((sum, part) => sum + part.text.length, 0);
}

/** Keep the most recent turns that fit inside both context budgets. */
function trimToBudget(messages: TextOnlyMessage[]): TextOnlyMessage[] {
    const trimmed = messages.slice(-CONTEXT_MAX_MESSAGES);

    let total = trimmed.reduce((sum, m) => sum + messageChars(m), 0);
    while (trimmed.length > 1 && total > CONTEXT_MAX_CHARS) {
        total -= messageChars(trimmed.shift()!);
    }

    return trimmed;
}

const foundry = createOpenAI({
    baseURL: `https://${process.env.AZURE_RESOURCE_NAME}.services.ai.azure.com/openai/v1`,
    apiKey: process.env.AZURE_API_KEY,
    headers: {
        'api-key': process.env.AZURE_API_KEY || '',
    },
});

function badRequest(message: string) {
    return Response.json({ error: message }, { status: 400 });
}

export async function POST(req: Request) {
    // Check the budget before reading the body, so a flood costs us as little as possible.
    const limit = await rateLimit(clientIdentifier(req), RATE_LIMIT_WINDOWS, Date.now());
    if (!limit.ok) {
        return Response.json(
            { error: `Rate limit exceeded. Try again in ${limit.retryAfter}s.` },
            {
                status: 429,
                headers: {
                    'Retry-After': String(limit.retryAfter),
                    'X-RateLimit-Limit': String(limit.limit),
                    'X-RateLimit-Remaining': '0',
                },
            },
        );
    }

    let body: unknown;
    try {
        body = await req.json();
    } catch {
        return badRequest('Malformed JSON body.');
    }

    const parsed = requestSchema.safeParse(body);
    if (!parsed.success) {
        return badRequest('Invalid request body.');
    }

    // Drop every non-text part, then any message left with nothing to say.
    const textOnly: TextOnlyMessage[] = parsed.data.messages
        .map((m) => ({
            id: m.id,
            role: m.role,
            parts: m.parts
                .filter((p) => p.type === 'text' && typeof p.text === 'string')
                .map((p) => ({ type: 'text' as const, text: p.text! })),
        }))
        .filter((m) => m.parts.length > 0);

    if (textOnly.length === 0) {
        return badRequest('No text content in request.');
    }

    const totalChars = textOnly.reduce((sum, m) => sum + messageChars(m), 0);
    if (totalChars > HARD_MAX_CHARS_TOTAL) {
        return badRequest('Conversation too long.');
    }

    const messages = trimToBudget(textOnly);

    try {
        const result = streamText({
            model: foundry('gpt-4o'),
            system: `You are the interactive terminal assistant for bayar.dev, an enterprise B2B SaaS platform for AI infrastructure.

You are running a DEMO terminal. Every figure you print is an illustrative benchmark from a reference architecture, not a measurement of a live production deployment. Never present these numbers as audited, certified, or currently measured. When you print metrics or compliance posture, mark them as reference-architecture targets (e.g. a "[demo]" prefix or a "reference architecture target" qualifier). If asked whether the figures are real, say plainly that they are illustrative demo values.

Command Handling:
- If prompt contains "benchmark --latency": Print illustrative reference-architecture targets (P95 <85ms, P99 <120ms, 12.4k req/sec peak throughput, zero dropped tokens).
- If prompt contains "architecture --stack": Print the infrastructure layer (Next.js Edge, Azure Foundry OpenAI endpoints, distributed semantic cache, VNet VPC isolation).
- If prompt contains "security --compliance": Describe the safeguards the reference architecture is DESIGNED to support (zero-retention policies, SOC 2 Type II-aligned controls, role-based access control, dedicated tenant encryption). Frame these as design goals, never as completed audits or held certifications.
- If prompt contains "contact --sales": Invite them to book a pilot at hi@bayar.dev or schedule a tailored infrastructure review.

General Rules:
- Output style: Clean, concise, Unix-CLI formatting.
- Default length: 2–4 lines maximum per response.`,
            messages: await convertToModelMessages(messages as UIMessage[]),
        });

        return result.toUIMessageStreamResponse({
            // streamText resolves before the model responds, so failures during the
            // stream never reach the catch below — they surface here instead.
            onError: (error) => {
                console.error('Chat stream error:', error);
                return 'Upstream model request failed.';
            },
        });
    } catch (error) {
        // Log the detail; return something that can't echo the Azure hostname back.
        console.error('Azure Foundry API error:', error);
        return Response.json({ error: 'Internal Server Error' }, { status: 500 });
    }
}
