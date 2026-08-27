import type { Metadata } from 'next';
import Link from 'next/link';
import {
  Code,
  CodeBlock,
  Note,
  PageHeader,
  PageShell,
  Section,
  SpecTable,
  TableOfContents,
} from '@/components/Prose';

export const metadata: Metadata = {
  title: 'Docs',
  description:
    'API reference for POST /api/chat — request schema, SSE streaming protocol, header specification, rate limits, error codes, and the edge caching and private VPC/BYOK deployment architecture.',
  alternates: { canonical: '/docs' },
  openGraph: {
    title: 'Docs — bayar.dev',
    description:
      'API reference and infrastructure architecture guide for the bayar.dev streaming endpoint.',
    url: '/docs',
  },
};

const SECTIONS = [
  { id: 'overview', title: 'Overview' },
  { id: 'endpoint', title: 'Endpoint' },
  { id: 'headers', title: 'Headers' },
  { id: 'request', title: 'Request Body' },
  { id: 'limits', title: 'Limits' },
  { id: 'streaming', title: 'SSE Streaming' },
  { id: 'client', title: 'Client Usage' },
  { id: 'errors', title: 'Errors' },
  { id: 'architecture', title: 'Live Architecture' },
  { id: 'edge-cache', title: 'Edge Caching' },
  { id: 'private-cloud', title: 'VPC & BYOK' },
];

const REQUEST_EXAMPLE = `POST /api/chat HTTP/1.1
Host: bayar.dev
Content-Type: application/json

{
  "messages": [
    {
      "id": "msg_1",
      "role": "user",
      "parts": [{ "type": "text", "text": "benchmark --latency" }]
    },
    {
      "id": "msg_2",
      "role": "assistant",
      "parts": [{ "type": "text", "text": "[demo] P95 <85ms ..." }]
    },
    {
      "id": "msg_3",
      "role": "user",
      "parts": [{ "type": "text", "text": "architecture --stack" }]
    }
  ]
}`;

const SCHEMA_EXAMPLE = `type ChatRequest = {
  messages: {
    // Optional client-side id, echoed nowhere. Max 128 chars.
    id?: string;

    // 'system' is rejected: instructions cannot be injected by a client.
    role: 'user' | 'assistant';

    // 1-32 parts per message. Parts whose type is not 'text' are
    // discarded server-side rather than rejected, so SDK-emitted
    // parts such as 'step-start' are safe to send back verbatim.
    parts: {
      type: string;   // max 64 chars
      text?: string;  // max 4,000 chars
    }[];
  }[];  // 1-100 messages per request
};`;

const STREAM_EXAMPLE = `HTTP/1.1 200 OK
content-type: text/event-stream
cache-control: no-cache
x-accel-buffering: no
x-vercel-ai-ui-message-stream: v1
transfer-encoding: chunked

data: {"type":"start"}

data: {"type":"start-step"}

data: {"type":"text-start","id":"msg_0b19..."}

data: {"type":"text-delta","id":"msg_0b19...","delta":"P95"}

data: {"type":"text-delta","id":"msg_0b19...","delta":" <85ms"}

data: {"type":"text-end","id":"msg_0b19..."}

data: {"type":"finish-step"}

data: {"type":"finish","finishReason":"stop"}

data: [DONE]`;

const CURL_EXAMPLE = `curl -N -X POST https://bayar.dev/api/chat \\
  -H 'Content-Type: application/json' \\
  -d '{
    "messages": [
      {
        "role": "user",
        "parts": [{ "type": "text", "text": "architecture --stack" }]
      }
    ]
  }'`;

const CLIENT_EXAMPLE = `'use client';

import { useChat } from '@ai-sdk/react';

export function Terminal() {
  // Defaults to POST /api/chat and accumulates the full history client-side.
  const { messages, sendMessage, status, error, stop } = useChat();

  const streaming = status === 'streaming' || status === 'submitted';

  return (
    <>
      {messages.map((m) => (
        <p key={m.id}>
          {m.parts
            .filter((p) => p.type === 'text')
            .map((p) => p.text)
            .join('')}
        </p>
      ))}

      <button onClick={() => sendMessage({ text: 'benchmark --latency' })}>
        run
      </button>

      {/* Aborts the fetch and closes the stream mid-response. */}
      {streaming && <button onClick={stop}>stop</button>}

      {/* 4xx bodies arrive as JSON in error.message. */}
      {error && <p role="alert">{error.message}</p>}
    </>
  );
}`;

const LIVE_ARCHITECTURE = `browser  (React client, useChat)
   |
   |  POST /api/chat  ·  full message history  ·  application/json
   v
Next.js route handler  (App Router · maxDuration 30s)
   |
   +-- 1. rate limit   per-identity fixed window · 10/min · 100/day
   |                   checked BEFORE the body is read
   +-- 2. validate     schema check · role allowlist · per-part size caps
   +-- 3. normalise    non-text parts dropped
   |                   context trimmed to 20 messages / 12,000 chars
   +-- 4. stream       Azure AI Foundry · OpenAI-compatible /openai/v1
   |
   v
SSE response to browser
   upstream detail is logged server-side and masked on the wire,
   so provider hostnames and stack traces never reach the client.`;

const EDGE_CACHE = `                          +--------------------------------------+
  request  ---->  edge PoP |  1. static assets   (immutable, CDN)  |
                           |  2. semantic cache  (normalised key)  |
                           +------------------+-------------------+
                              hit |           | miss
                                  v           v
                       replayed stream    origin route handler
                                                  |
                                                  v
                                            model provider
                                                  |
                            write-through <-------+

  key      = hash(tenant, model, normalised prompt embedding bucket)
  scope    = per-tenant namespace; never shared across tenants
  ttl      = short by default; invalidated on system-prompt change
  bypass   = requests marked non-deterministic, or tenant opt-out`;

const PRIVATE_CLOUD = `customer cloud account  (Azure or AWS)
  |
  +-- private subnet
  |     +-- bayar.dev gateway        container image, customer-operated
  |     +-- private endpoint  ---->  customer's own model deployment
  |
  +-- Key Vault / KMS               customer-managed keys (BYOK)
  |     +-- encryption at rest and in transit under customer keys
  |     +-- key rotation and revocation stay with the customer
  |
  +-- observability                 logs and metrics stay in-account
  |
  +-- egress                        no data path to a bayar.dev control
                                    plane; licence and image pulls only`;

export default function Docs() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Documentation"
        title="API & Architecture Reference"
        intro="The streaming endpoint behind the terminal on this site, documented exactly as deployed — request schema, SSE event protocol, headers, limits, and error contract — followed by the reference architecture for edge caching and private-cloud deployment."
        meta="Last updated: August 27, 2026 · API version: v1"
      />

      <div className="mt-4 gap-12 lg:grid lg:grid-cols-[1fr_200px]">
        <div className="min-w-0">
          <Section id="overview" title="Overview">
            <p>
              bayar.dev exposes a single public endpoint. It is stateless: the
              client holds the conversation and replays the full history on every
              turn, and the server keeps nothing between requests. Responses are
              streamed token by token over server-sent events.
            </p>
            <p>
              Everything under{' '}
              <a
                href="#overview"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                Endpoint
              </a>{' '}
              through{' '}
              <a
                href="#errors"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                Errors
              </a>{' '}
              describes behaviour that is live right now and can be verified with{' '}
              <Code>curl</Code>. The two architecture sections at the end are
              explicitly labelled where they describe a target design rather than
              a deployed system.
            </p>
          </Section>

          <Section id="endpoint" title="Endpoint">
            <SpecTable
              columns={['Property', 'Value']}
              rows={[
                ['Method', 'POST'],
                ['Path', <Code key="p">/api/chat</Code>],
                ['Content type', <Code key="c">application/json</Code>],
                ['Response', <Code key="r">text/event-stream</Code>],
                ['Auth', 'None on the public demo endpoint — rate limited by IP'],
                ['Max duration', '30 seconds per request'],
                ['Idempotency', 'None — every request is a fresh inference call'],
              ]}
            />
          </Section>

          <Section id="headers" title="Header Specification">
            <SpecTable
              columns={['Header', 'Requirement']}
              rows={[
                [
                  'Content-Type',
                  <>
                    Required. Must be <Code>application/json</Code>; any other
                    body encoding fails JSON parsing and returns{' '}
                    <Code>400</Code>.
                  </>,
                ],
                [
                  'Accept',
                  <>
                    Optional. <Code>text/event-stream</Code> is recommended for
                    streaming clients; the response is an event stream
                    regardless.
                  </>,
                ],
                [
                  'Authorization',
                  <>
                    Not used by the public endpoint. Private deployments enforce{' '}
                    <Code>{'Bearer <token>'}</Code> at the gateway — see{' '}
                    <a
                      href="#private-cloud"
                      className="text-emerald-400 transition hover:text-emerald-300"
                    >
                      VPC &amp; BYOK
                    </a>
                    . Sending it against the public endpoint is ignored, never
                    logged, and never forwarded upstream.
                  </>,
                ],
                [
                  'X-Forwarded-For',
                  <>
                    Set by the platform edge, not by callers. First entry is the
                    rate-limit identity; <Code>CF-Connecting-IP</Code> and{' '}
                    <Code>X-Real-IP</Code> are the fallbacks.
                  </>,
                ],
              ]}
            />
            <Note label="On bearer tokens">
              The public demo endpoint is intentionally unauthenticated so the
              terminal works with no signup. It is protected by request
              validation and per-IP rate limits instead. Token-based tenant auth
              is part of the private deployment path, not of this endpoint —
              treat any bearer token you send here as ignored.
            </Note>
          </Section>

          <Section id="request" title="Request Body">
            <p>
              A single <Code>messages</Code> array, ordered oldest to newest. The
              server derives the model context from it and discards it after the
              response completes.
            </p>
            <CodeBlock label="POST /api/chat" code={REQUEST_EXAMPLE} />
            <CodeBlock label="TypeScript — request schema" code={SCHEMA_EXAMPLE} />
            <p>
              Unknown top-level keys are stripped rather than rejected. Parts
              with a type other than <Code>text</Code> are dropped before the
              request reaches the model, which is what makes it safe to echo an
              SDK-generated assistant message straight back.
            </p>
            <CodeBlock label="Shell — minimal streaming request" code={CURL_EXAMPLE} />
          </Section>

          <Section id="limits" title="Limits">
            <p>
              Two different mechanisms apply. Payload caps reject abuse outright.
              Context budgets trim a long-but-legitimate conversation instead of
              failing it, so a session that runs long loses its oldest turns
              rather than breaking.
            </p>
            <SpecTable
              columns={['Limit', 'Value', 'Behaviour past the limit']}
              rows={[
                ['messages per request', '100', 'Rejected — 400'],
                ['parts per message', '32', 'Rejected — 400'],
                ['chars per part', '4,000', 'Rejected — 400'],
                ['chars per request', '50,000', 'Rejected — 400'],
                ['context messages', '20', 'Trimmed to the most recent 20'],
                ['context chars', '12,000', 'Oldest turns dropped until it fits'],
                ['requests per minute', '10 per IP', 'Rejected — 429'],
                ['requests per day', '100 per IP', 'Rejected — 429'],
              ]}
            />
            <p>
              A <Code>429</Code> carries <Code>Retry-After</Code> in seconds
              alongside <Code>X-RateLimit-Limit</Code> and{' '}
              <Code>X-RateLimit-Remaining</Code>. Both windows are consumed on
              every request, so tripping the per-minute limit does not shield the
              daily budget. The limit check runs before the body is read, which
              keeps a flood cheap to reject.
            </p>
          </Section>

          <Section id="streaming" title="SSE Streaming Schema">
            <p>
              The response is a UI message stream: one JSON object per{' '}
              <Code>data:</Code> line, terminated by <Code>data: [DONE]</Code>.
              Each object has a <Code>type</Code> discriminant.
            </p>
            <SpecTable
              columns={['Event type', 'Payload', 'Meaning']}
              rows={[
                ['start', '—', 'Response opened'],
                ['start-step', '—', 'Model step began'],
                ['text-start', 'id', 'A text part opened; id identifies it'],
                ['text-delta', 'id, delta', 'Append delta to the part with that id'],
                ['text-end', 'id', 'That text part is complete'],
                ['finish-step', '—', 'Model step complete'],
                ['finish', 'finishReason', 'Response complete, e.g. "stop"'],
                ['error', 'errorText', 'Failure raised mid-stream after 200 OK'],
                ['[DONE]', '—', 'Stream terminator — not JSON'],
              ]}
            />
            <CodeBlock label="Response — captured stream" code={STREAM_EXAMPLE} />
            <p>
              <Code>text-delta</Code> events are additive: concatenate deltas in
              arrival order, keyed by <Code>id</Code>. A stream may contain more
              than one text part, so do not assume a single buffer.{' '}
              <Code>x-accel-buffering: no</Code> is set to stop intermediate
              proxies from buffering the stream into one chunk.
            </p>
          </Section>

          <Section id="client" title="Client Usage">
            <p>
              The reference client is the AI SDK&apos;s <Code>useChat</Code>,
              which handles history accumulation, incremental parsing, and
              cancellation. This is what the terminal on the home page runs.
            </p>
            <CodeBlock label="React — minimal client" code={CLIENT_EXAMPLE} />
          </Section>

          <Section id="errors" title="Error Contract">
            <p>
              Errors are returned as JSON with an <Code>error</Code> string.
              Messages are deliberately generic: upstream provider identity,
              hostnames, and stack traces are logged server-side and never
              serialised to the client.
            </p>
            <SpecTable
              columns={['Status', 'Body', 'Cause']}
              rows={[
                ['400', '"Malformed JSON body."', 'Body was not valid JSON'],
                [
                  '400',
                  '"Invalid request body."',
                  'Schema violation — bad role, empty array, or a payload cap exceeded',
                ],
                [
                  '400',
                  '"No text content in request."',
                  'Valid shape, but no text part survived filtering',
                ],
                ['400', '"Conversation too long."', 'Total characters over 50,000'],
                [
                  '429',
                  '"Rate limit exceeded. Try again in Ns."',
                  'Per-minute or per-day window exhausted',
                ],
                ['500', '"Internal Server Error"', 'Request failed before the stream opened'],
                [
                  '200 + error event',
                  '"Upstream model request failed."',
                  'Failure after headers were sent — arrives as an in-stream error event',
                ],
              ]}
            />
            <Note label="Handling the split failure model">
              A streaming endpoint can fail after it has already returned{' '}
              <Code>200 OK</Code>. Clients must handle both a non-2xx JSON
              response and an <Code>error</Code> event mid-stream — treating only
              the status code as the success signal will silently swallow
              upstream failures.
            </Note>
          </Section>

          <Section id="architecture" title="Live Architecture">
            <p>
              What actually serves this site today. Every stage below is in the
              request path of the terminal above.
            </p>
            <CodeBlock label="Deployed request path" code={LIVE_ARCHITECTURE} />
            <p>
              Rate-limit counters are held in a shared store when one is
              configured, and in process memory otherwise. In-memory counters are
              per-instance: a platform running N instances effectively allows N
              times the limit, so a shared store is required wherever the limit
              is load-bearing.
            </p>
          </Section>

          <Section id="edge-cache" title="Edge Caching">
            <Note label="Reference architecture">
              The design below is the target topology for a production tenant. It
              is not what serves this public demo, which runs the request path in{' '}
              <a
                href="#architecture"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                Live Architecture
              </a>{' '}
              with no semantic cache layer.
            </Note>
            <CodeBlock label="Edge caching — reference architecture" code={EDGE_CACHE} />
            <p>
              Two tiers with different correctness requirements. Static assets
              are content-hashed and cached immutably at the PoP. Inference
              responses use a semantic cache keyed on a normalised prompt within
              a per-tenant namespace — never a global one, since cross-tenant
              reuse would leak prompt content between customers.
            </p>
            <p>
              Cache entries are scoped to the model and the system prompt, so a
              prompt change invalidates rather than silently serving stale
              answers. Requests marked non-deterministic bypass the cache
              entirely, and tenants can disable it per environment.
            </p>
          </Section>

          <Section id="private-cloud" title="Private VPC & BYOK Deployment">
            <Note label="Reference architecture">
              The deployment model offered for enterprise engagements. Availability
              and scope are agreed per contract — talk to{' '}
              <a
                href="mailto:hi@bayar.dev"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                hi@bayar.dev
              </a>{' '}
              before designing against it.
            </Note>
            <CodeBlock label="Private cloud — reference architecture" code={PRIVATE_CLOUD} />
            <p>
              The gateway runs as a container inside the customer&apos;s own
              account and subnet, reaching the model deployment over a private
              endpoint rather than the public internet. Encryption keys stay in
              the customer&apos;s Key Vault or KMS, so rotation and revocation
              are customer-controlled — that is the substance of BYOK, as opposed
              to a provider-held key labelled as one.
            </p>
            <p>
              In this topology, prompt and completion data never crosses into
              infrastructure operated by bayar.dev. Tenant authentication is
              enforced at the gateway with the bearer token described under{' '}
              <a
                href="#headers"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                Headers
              </a>
              . Data handling for the public endpoint is documented separately in
              the{' '}
              <Link
                href="/privacy"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                privacy policy
              </Link>
              .
            </p>
          </Section>
        </div>

        <aside className="order-first mb-8 hidden lg:order-0 lg:mb-0 lg:block">
          <TableOfContents items={SECTIONS} />
        </aside>
      </div>
    </PageShell>
  );
}
