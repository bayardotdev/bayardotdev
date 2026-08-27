import type { Metadata } from 'next';
import Link from 'next/link';
import { Code, PageHeader, PageShell, Section, SpecTable } from '@/components/Prose';

export const metadata: Metadata = {
  title: 'About',
  description:
    'bayar.dev is built by Bayar Naran, Founder & Systems Architect — high-throughput AI streaming pipelines, edge routing infrastructure, and enterprise distributed systems.',
  alternates: { canonical: '/about' },
  openGraph: {
    title: 'About — bayar.dev',
    description:
      'Founder profile and verifiable identity links for bayar.dev, built by Bayar Naran.',
    url: '/about',
  },
};

/** Verifiable, third-party-hosted identity links. */
const PROFILES = [
  {
    label: 'LinkedIn',
    handle: 'in/bayardev',
    href: 'https://www.linkedin.com/in/bayardev',
    note: 'Professional profile and work history',
  },
  {
    label: 'GitHub (personal)',
    handle: '@bayarai',
    href: 'https://github.com/bayarai',
    note: 'Individual engineering work and contributions',
  },
  {
    label: 'GitHub (organization)',
    handle: '@bayardotdev',
    href: 'https://github.com/bayardotdev',
    note: 'Organization account behind this platform',
  },
];

const FOCUS_AREAS = [
  {
    eyebrow: '01 // Streaming',
    title: 'High-throughput AI streaming',
    body: 'Token-level streaming pipelines built on server-sent events, with backpressure-aware transports, cancellable inference requests, and bounded context windows that degrade gracefully instead of failing a session.',
  },
  {
    eyebrow: '02 // Routing',
    title: 'Edge routing infrastructure',
    body: 'Request routing at the edge: provider abstraction across foundation models, multi-region failover paths, per-identity rate limiting, and request validation applied before any upstream token spend.',
  },
  {
    eyebrow: '03 // Systems',
    title: 'Enterprise distributed systems',
    body: 'Stateless service design with shared-store coordination, fixed-window counters that survive horizontal scaling, structured failure isolation, and deployment topologies that keep customer data inside customer-controlled networks.',
  },
];

export default function About() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="About"
        title="Bayar Naran"
        intro="Founder & Systems Architect, bayar.dev. Engineering high-throughput AI streaming pipelines, edge routing infrastructure, and enterprise distributed systems."
        meta="Operating entity: bayar.dev · Contact: hi@bayar.dev"
      />

      <Section id="profile" title="Founder profile">
        <p>
          bayar.dev is founded and engineered by Bayar Naran. The work is
          infrastructure-first: the platform layer that sits between an
          application and a foundation model — routing, validation, rate
          limiting, streaming transport, caching, and the deployment topology
          that keeps all of it inside a boundary an enterprise is willing to
          sign off on.
        </p>
        <p>
          The interactive terminal on the{' '}
          <Link href="/" className="text-emerald-400 transition hover:text-emerald-300">
            home page
          </Link>{' '}
          is a live example of that stack rather than a mockup: a real streaming
          endpoint with request validation, per-identity rate limiting, and
          server-side error isolation. The request and response contracts are
          published in full in the{' '}
          <Link
            href="/docs"
            className="text-emerald-400 transition hover:text-emerald-300"
          >
            technical documentation
          </Link>
          .
        </p>
      </Section>

      <Section id="focus" title="Technical focus">
        <div className="grid grid-cols-1 gap-4 md:grid-cols-3">
          {FOCUS_AREAS.map(({ eyebrow, title, body }) => (
            <div
              key={eyebrow}
              className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 transition hover:border-neutral-700"
            >
              <div className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
                {eyebrow}
              </div>
              <h3 className="text-base font-semibold text-neutral-100">{title}</h3>
              <p className="mt-2 text-sm leading-relaxed text-neutral-400">{body}</p>
            </div>
          ))}
        </div>
      </Section>

      <Section id="verification" title="Identity verification">
        <p>
          The following profiles are hosted by independent third parties and can
          be used to verify the identity and engineering history behind this
          domain. Each opens in a new tab.
        </p>

        <ul className="space-y-3">
          {PROFILES.map(({ label, handle, href, note }) => (
            <li key={href}>
              <a
                href={href}
                target="_blank"
                rel="noopener noreferrer"
                className="group flex flex-col gap-1 rounded-xl border border-neutral-800 bg-neutral-950/60 p-4 transition hover:border-emerald-500/40 sm:flex-row sm:items-center sm:justify-between"
              >
                <span className="flex flex-col gap-1">
                  <span className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
                    {label}
                  </span>
                  <span className="text-sm text-neutral-400">{note}</span>
                </span>
                <span className="font-mono text-sm text-neutral-300 transition group-hover:text-emerald-400">
                  {handle}
                  <span aria-hidden="true"> ↗</span>
                </span>
              </a>
            </li>
          ))}
        </ul>

        <SpecTable
          columns={['Attribute', 'Value']}
          rows={[
            ['Domain', 'bayar.dev'],
            ['Founder', 'Bayar Naran — Founder & Systems Architect'],
            [
              'Contact',
              <a
                key="mail"
                href="mailto:hi@bayar.dev"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                hi@bayar.dev
              </a>,
            ],
            [
              'Public API',
              <>
                <Code>POST /api/chat</Code> — documented at{' '}
                <Link
                  href="/docs"
                  className="text-emerald-400 transition hover:text-emerald-300"
                >
                  /docs
                </Link>
              </>,
            ],
            [
              'Policies',
              <>
                <Link
                  href="/privacy"
                  className="text-emerald-400 transition hover:text-emerald-300"
                >
                  Privacy
                </Link>
                {' · '}
                <Link
                  href="/terms"
                  className="text-emerald-400 transition hover:text-emerald-300"
                >
                  Terms
                </Link>
              </>,
            ],
          ]}
        />
      </Section>

      <Section id="contact" title="Contact">
        <p>
          For pilots, infrastructure reviews, security questionnaires, or
          verification requests, email{' '}
          <a
            href="mailto:hi@bayar.dev"
            className="text-emerald-400 transition hover:text-emerald-300"
          >
            hi@bayar.dev
          </a>
          . Messages about compliance review or vendor onboarding are answered
          directly by the founder.
        </p>
      </Section>
    </PageShell>
  );
}
