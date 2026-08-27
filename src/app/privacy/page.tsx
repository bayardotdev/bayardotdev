import {
  Code,
  Note,
  PageHeader,
  PageShell,
  Section,
  SpecTable,
  TableOfContents,
} from '@/components/Prose';
import type { Metadata } from 'next';
import Link from 'next/link';

export const metadata: Metadata = {
  title: 'Privacy',
  description:
    'Privacy policy for bayar.dev — zero-retention data handling, processing boundaries, subprocessors, and edge transit specifications for the public streaming endpoint.',
  alternates: { canonical: '/privacy' },
  openGraph: {
    title: 'Privacy — bayar.dev',
    description:
      'How bayar.dev handles data: what is processed, what is never retained, and where it travels.',
    url: '/privacy',
  },
};

const SECTIONS = [
  { id: 'scope', title: 'Scope' },
  { id: 'retention', title: 'Retention policy' },
  { id: 'processed', title: 'What is processed' },
  { id: 'not-collected', title: 'What is not collected' },
  { id: 'boundaries', title: 'Handling boundaries' },
  { id: 'subprocessors', title: 'Subprocessors' },
  { id: 'transit', title: 'Edge transit' },
  { id: 'private', title: 'Private deployments' },
  { id: 'rights', title: 'Your rights' },
  { id: 'security', title: 'Security' },
  { id: 'children', title: 'Children' },
  { id: 'changes', title: 'Changes' },
  { id: 'contact', title: 'Contact' },
];

export default function Privacy() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Legal"
        title="Privacy policy"
        intro="bayar.dev operates a zero-retention public endpoint: prompts and completions are processed in memory to answer a request and are not written to any datastore we control. This policy states precisely what is processed, for how long, and which third parties are in the path."
        meta="Last updated: August 27, 2026 · Effective: August 27, 2026"
      />

      <div className="mt-4 gap-12 lg:grid lg:grid-cols-[1fr_200px]">
        <div className="min-w-0">
          <Section id="scope" title="1. Scope">
            <p>
              This policy covers the bayar.dev website and its public API endpoint{' '}
              <Code>POST /api/chat</Code>, operated by Namchinbayar Naran, doing
              business as BAYAR DEV (&ldquo;bayar.dev&rdquo;), located in Walnut
              Creek, California (&ldquo;we&rdquo;). It does not cover private or
              self-hosted deployments running inside a customer&apos;s own cloud
              account, which are governed by the agreement for that engagement —
              see{' '}
              <a
                href="#private"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                Private deployments
              </a>
              .
            </p>
          </Section>

          <Section id="retention" title="2. Zero-retention policy">
            <p>
              We do not retain the content of your interactions. Prompts you
              submit and the responses streamed back exist in server memory only
              for the duration of the request and are discarded when it
              completes. There is no conversation database, no transcript
              archive, and no export of your prompts to any analytics or
              training system operated by us.
            </p>
            <p>
              The conversation you see in the terminal lives in your
              browser&apos;s memory. Reloading the page destroys it permanently —
              we hold no copy to restore. Because the endpoint is stateless, your
              client replays the conversation on each turn; we do not reconstruct
              it from storage.
            </p>
            <p>
              We do not use your prompts or the model&apos;s responses to train
              or fine-tune any model.
            </p>
            <Note label="Boundary of this commitment">
              Zero retention describes systems we control. Inference is performed
              by a third-party model provider (see{' '}
              <a
                href="#subprocessors"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                Subprocessors
              </a>
              ), whose own retention behaviour is governed by that
              provider&apos;s terms and may include short-term abuse monitoring.
              We do not claim, on the provider&apos;s behalf, that nothing is
              retained anywhere. Where contractual zero retention end to end is a
              requirement, it is addressed as part of a private deployment.
            </Note>
          </Section>

          <Section id="processed" title="3. What is processed">
            <SpecTable
              columns={['Data', 'Purpose', 'Lifetime']}
              rows={[
                [
                  'Prompt text',
                  'Forwarded to the model provider to generate a response',
                  'In memory for the request only',
                ],
                [
                  'Recent conversation',
                  'Context for the response; trimmed to the most recent 20 messages',
                  'In memory for the request only',
                ],
                [
                  'IP address',
                  'Derives the per-identity rate-limit counter that protects the endpoint',
                  'Counter key expires after 60 seconds and 24 hours',
                ],
                [
                  'Request metadata',
                  'Standard server logs: timestamp, path, status, user agent',
                  'Short-term operational logs at the hosting provider',
                ],
                [
                  'Error diagnostics',
                  'Server-side logging of failures so they can be fixed',
                  'Short-term operational logs',
                ],
                [
                  'Email content',
                  'Only if you choose to email us — answering your message',
                  'Retained in the mailbox as business correspondence',
                ],
              ]}
            />
            <p>
              Rate-limit counters store a request count against an
              IP-derived key with a short expiry. They contain no prompt
              content, and the counter is deleted when its window elapses.
            </p>
          </Section>

          <Section id="not-collected" title="4. What is not collected">
            <ul className="list-disc space-y-2 pl-5">
              <li>No accounts, passwords, or user profiles — the demo requires no signup.</li>
              <li>No analytics, tracking pixels, session recording, or advertising networks.</li>
              <li>No tracking or advertising cookies, and no cross-site identifiers.</li>
              <li>No third-party client-side scripts loaded into the page.</li>
              <li>No payment or financial data — nothing is sold through this site.</li>
              <li>No sale, rental, or sharing of any data with data brokers.</li>
            </ul>
            <p>
              We do not ask for special-category personal data and ask that you
              do not submit it — or any confidential, regulated, or personally
              identifying information about yourself or others — into the public
              demo terminal. It is a public, unauthenticated endpoint and should
              be treated as such.
            </p>
          </Section>

          <Section id="boundaries" title="5. Data handling boundaries">
            <p>Three boundaries are enforced in the request path:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                <span className="text-neutral-200">Input boundary.</span> Requests
                are validated against a strict schema before any upstream call.
                Only text content is forwarded; message roles are restricted so a
                client cannot inject system instructions.
              </li>
              <li>
                <span className="text-neutral-200">Context boundary.</span> Only
                the most recent portion of a conversation is sent upstream — a
                hard cap of 20 messages and 12,000 characters. Older turns are
                dropped, not stored.
              </li>
              <li>
                <span className="text-neutral-200">Output boundary.</span> Upstream
                errors are logged server-side and replaced with a generic message
                before they reach you, so provider identity, hostnames, and stack
                traces are not exposed on the wire.
              </li>
            </ul>
            <p>
              The technical detail behind each boundary is published in the{' '}
              <Link
                href="/docs"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                API documentation
              </Link>
              .
            </p>
          </Section>

          <Section id="subprocessors" title="6. Subprocessors">
            <SpecTable
              columns={['Provider', 'Role', 'Data in scope']}
              rows={[
                [
                  'Microsoft Azure',
                  'AI Foundry inference — generates the response',
                  'Prompt text and recent conversation context',
                ],
                [
                  'Hosting provider',
                  'Serves the site and runs the API route',
                  'Request metadata and standard access logs',
                ],
                [
                  'Rate-limit store',
                  'Shared counter store, when configured',
                  'Request counts against an IP-derived key; no prompt content',
                ],
                [
                  'Email provider',
                  'Delivers mail sent to hi@bayar.dev',
                  'Whatever you include in your email',
                ],
              ]}
            />
            <p>
              We do not add a subprocessor that receives prompt content without
              updating this page. A current list, including the processing region
              for inference, is available on request for vendor reviews and
              security questionnaires.
            </p>
          </Section>

          <Section id="transit" title="7. Edge transit specifications">
            <ul className="list-disc space-y-2 pl-5">
              <li>
                All traffic is served over HTTPS. Plain HTTP requests are
                redirected; there is no unencrypted path to the API.
              </li>
              <li>
                Transport is TLS 1.2 or higher, terminated at the hosting
                provider&apos;s edge. Traffic between the edge and the origin
                route, and between the route and the model provider, is
                encrypted in transit.
              </li>
              <li>
                Responses stream over server-sent events on the same connection
                as the request. Nothing is written to disk at the edge to
                assemble a response.
              </li>
              <li>
                Prompt content is not cached at the edge. Static assets are
                cached and contain no user data.
              </li>
              <li>
                Requests may transit an edge point of presence near you before
                reaching the origin. Edge nodes see connection metadata and the
                encrypted request; they do not retain the request body.
              </li>
            </ul>
          </Section>

          <Section id="private" title="8. Private and self-hosted deployments">
            <p>
              In a private deployment, the gateway runs inside the
              customer&apos;s own cloud account and reaches a customer-owned
              model deployment over a private endpoint. In that topology prompt
              and completion data does not enter infrastructure operated by
              bayar.dev at all, and encryption keys remain under customer
              control. The topology is documented under{' '}
              <Link
                href="/docs#private-cloud"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                VPC &amp; BYOK
              </Link>
              ; the binding data terms are those in the engagement agreement, not
              this page.
            </p>
          </Section>

          <Section id="rights" title="9. Your rights">
            <p>
              Depending on where you live, you may have rights to access,
              correct, delete, or restrict processing of your personal data, and
              to object to it or lodge a complaint with a supervisory authority.
            </p>
            <p>
              In practice there is very little to exercise them against: we hold
              no account for you and retain no conversation history. Requests
              about server logs or email correspondence can be sent to{' '}
              <a
                href="mailto:hi@bayar.dev"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                hi@bayar.dev
              </a>{' '}
              and are answered within 30 days. We may need to verify your
              identity before acting on a request, and cannot delete data we
              never held.
            </p>
            <p>
              Our basis for processing the limited technical data described above
              is our legitimate interest in operating and protecting a public
              service. Prompt content is processed to perform the action you
              requested.
            </p>
          </Section>

          <Section id="security" title="10. Security">
            <p>
              Credentials for the model provider are held in server-side
              environment variables, are never exposed to the browser, and are
              not included in error responses. The endpoint enforces request
              validation, payload size caps, and per-identity rate limits so a
              single caller cannot exhaust the service. No system is immune to
              compromise; report a suspected vulnerability to{' '}
              <a
                href="mailto:hi@bayar.dev"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                hi@bayar.dev
              </a>{' '}
              and we will respond directly.
            </p>
          </Section>

          <Section id="children" title="11. Children">
            <p>
              This service is intended for business use and is not directed at
              children under 16. We do not knowingly process personal data of
              children.
            </p>
          </Section>

          <Section id="changes" title="12. Changes to this policy">
            <p>
              Material changes are reflected in the &ldquo;Last updated&rdquo;
              date at the top of this page. Continued use of the site after a
              change constitutes acceptance of the updated policy.
            </p>
          </Section>

          <Section id="contact" title="13. Contact">
            <p>
              Privacy questions, data requests, and vendor security reviews:{' '}
              <a
                href="mailto:hi@bayar.dev"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                hi@bayar.dev
              </a>
              . The controller for the processing described here is Namchinbayar
              Naran, doing business as BAYAR DEV (&ldquo;bayar.dev&rdquo;),
              located in Walnut Creek, California; see{' '}
              <Link
                href="/about"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                About
              </Link>{' '}
              for verified identity details.
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
