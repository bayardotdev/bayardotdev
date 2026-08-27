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
  title: 'Terms',
  description:
    'Terms of service for bayar.dev — service description, acceptable use, fair-use limits, platform availability, disclaimers, and liability terms.',
  alternates: { canonical: '/terms' },
  openGraph: {
    title: 'Terms — bayar.dev',
    description:
      'Terms of service covering acceptable use, platform availability, and liability for the bayar.dev platform.',
    url: '/terms',
  },
};

const SECTIONS = [
  { id: 'acceptance', title: 'Acceptance' },
  { id: 'service', title: 'The Service' },
  { id: 'demo-figures', title: 'Demo Figures' },
  { id: 'eligibility', title: 'Eligibility' },
  { id: 'acceptable-use', title: 'Acceptable Use' },
  { id: 'fair-use', title: 'Fair-Use Limits' },
  { id: 'output', title: 'AI Output' },
  { id: 'availability', title: 'Availability' },
  { id: 'ip', title: 'Intellectual Property' },
  { id: 'third-party', title: 'Third Parties' },
  { id: 'warranty', title: 'Disclaimer' },
  { id: 'liability', title: 'Liability' },
  { id: 'indemnity', title: 'Indemnity' },
  { id: 'termination', title: 'Termination' },
  { id: 'changes', title: 'Changes' },
  { id: 'law', title: 'Governing Law' },
  { id: 'contact', title: 'Contact' },
];

export default function Terms() {
  return (
    <PageShell>
      <PageHeader
        eyebrow="Legal"
        title="Terms of Service"
        intro="These terms govern your use of the bayar.dev website and its public API. They cover what the service is, how it may be used, what is guaranteed, and what is not."
        meta="Last updated: August 27, 2026 · Effective: August 27, 2026"
      />

      <div className="mt-4 gap-12 lg:grid lg:grid-cols-[1fr_200px]">
        <div className="min-w-0">
          <Section id="acceptance" title="1. Acceptance of Terms">
            <p>
              These terms form an agreement between you and Namchinbayar Naran,
              doing business as BAYAR DEV (&ldquo;bayar.dev&rdquo;), located in
              Walnut Creek, California.
            </p>
            <p>
              By accessing bayar.dev or sending a request to its API you agree to
              these terms. If you do not agree, do not use the service. If you
              are using it for an organisation, you confirm you are authorised to
              accept these terms on its behalf.
            </p>
            <p>
              Where a signed agreement exists between you and bayar.dev for a
              paid or private deployment, that agreement prevails over these
              terms for the scope it covers.
            </p>
          </Section>

          <Section id="service" title="2. Description of the Service">
            <p>
              bayar.dev publishes information about AI infrastructure and
              provides a public, unauthenticated demonstration endpoint (
              <Code>POST /api/chat</Code>) that streams responses from a
              third-party language model. It is provided free of charge for
              evaluation and demonstration purposes.
            </p>
            <p>
              The public endpoint is not a production service. It carries no
              service level agreement, no uptime commitment, and no support
              commitment, and it may change or be withdrawn at any time. The
              technical contract as currently deployed is published in the{' '}
              <Link
                href="/docs"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                documentation
              </Link>
              .
            </p>
          </Section>

          <Section id="demo-figures" title="3. Demonstration Figures and Architecture Claims">
            <Note label="Read this before quoting any number from this site">
              Performance figures, throughput numbers, and compliance postures
              shown in the demo terminal or described as a reference architecture
              are illustrative design targets. They are not measurements of a
              live production deployment, and they are not audit results,
              certifications, or attestations. Nothing on this site should be
              read as a claim to hold a certification unless a specific
              certification is named as held, with its scope and date.
            </Note>
            <p>
              Sections of the documentation labelled &ldquo;reference
              architecture&rdquo; describe an intended design, not a deployed
              system. Deliverables, scope, and any commitments for a real
              engagement are set in a written agreement, not by this website.
            </p>
          </Section>

          <Section id="eligibility" title="4. Eligibility">
            <p>
              You must be at least 16 years old and legally able to enter a
              contract. You must not use the service if you are barred from doing
              so under applicable law or sanctions, or from using the underlying
              model provider&apos;s services.
            </p>
          </Section>

          <Section id="acceptable-use" title="5. Acceptable Use">
            <p>You agree not to:</p>
            <ul className="list-disc space-y-2 pl-5">
              <li>
                Use the service for anything unlawful, or to generate content
                that is illegal, defamatory, harassing, or infringing.
              </li>
              <li>
                Attempt to circumvent rate limits, quotas, request validation, or
                any other technical control — including through distributed or
                rotated addresses, or automated scripting of the demo endpoint.
              </li>
              <li>
                Resell, proxy, white-label, or expose the public endpoint as part
                of your own product or as a substitute for a licensed model API.
              </li>
              <li>
                Probe, scan, or stress-test the service, or attempt to gain
                unauthorised access to it or to any connected system, other than
                good-faith vulnerability research reported to us promptly.
              </li>
              <li>
                Submit confidential, regulated, special-category, or
                personally identifying data into the public demo terminal.
              </li>
              <li>
                Attempt to extract system prompts, credentials, or internal
                configuration, or to induce the model to bypass its instructions.
              </li>
              <li>
                Use the service to develop a competing model or to generate
                training data for one.
              </li>
              <li>
                Interfere with other users&apos; access, or impose an
                unreasonable load on the infrastructure.
              </li>
            </ul>
            <p>
              You are also bound by the acceptable use policy of the underlying
              model provider. We may block requests, restrict access, or withdraw
              the endpoint in response to abuse, without notice.
            </p>
          </Section>

          <Section id="fair-use" title="6. Fair-Use Limits">
            <p>
              The public endpoint is rate limited per identity. Current limits
              are published and enforced as follows:
            </p>
            <SpecTable
              columns={['Limit', 'Value', 'Response when exceeded']}
              rows={[
                ['Requests per minute', '10 per IP address', '429 with Retry-After'],
                ['Requests per day', '100 per IP address', '429 with Retry-After'],
                ['Characters per request', '50,000', '400'],
                ['Request duration', '30 seconds', 'Request is terminated'],
              ]}
            />
            <p>
              These values may change without notice as capacity and abuse
              patterns change. Automated retry logic must respect{' '}
              <Code>Retry-After</Code> and must not busy-loop against a{' '}
              <Code>429</Code>.
            </p>
          </Section>

          <Section id="output" title="7. AI-Generated Output">
            <p>
              Responses are generated by a language model and may be inaccurate,
              incomplete, or misleading. Output is not professional, legal,
              financial, security, or medical advice, and must not be relied on
              as a statement of fact about bayar.dev, its performance, or its
              compliance posture. You are responsible for reviewing any output
              before acting on it or reusing it.
            </p>
            <p>
              We claim no ownership over the prompts you submit or the responses
              generated for you. Rights in model output are subject to the model
              provider&apos;s terms, and identical or similar output may be
              generated for other users.
            </p>
          </Section>

          <Section id="availability" title="8. Platform Availability">
            <p>
              The service is provided on an as-available basis. We do not
              guarantee that it will be uninterrupted, timely, secure, or
              error-free, and we may suspend, limit, modify, or discontinue any
              part of it — including the public endpoint — at any time and
              without notice or liability.
            </p>
            <p>
              Availability depends on third parties, including our hosting
              provider and the model provider. An outage or a change in a
              provider&apos;s policy may degrade or disable the service. No
              uptime target, credit, or remedy applies to the free public
              endpoint. Availability commitments for a paid engagement, if any,
              are set out in that engagement&apos;s agreement.
            </p>
          </Section>

          <Section id="ip" title="9. Intellectual Property">
            <p>
              The site, its content, its design, and the software behind it are
              owned by Namchinbayar Naran, doing business as BAYAR DEV
              (&ldquo;bayar.dev&rdquo;), located in Walnut Creek, California, and
              are protected by intellectual property law. These terms grant you no licence to
              copy, modify, distribute, reverse engineer, or create derivative
              works from them, other than the ordinary use of the site in a
              browser and the documented use of the API. The bayar.dev name and
              branding may not be used without written permission.
            </p>
          </Section>

          <Section id="third-party" title="10. Third-Party Services">
            <p>
              The service integrates third-party providers, including a hosting
              provider and a language model provider. Their terms and policies
              apply to their part of the processing, and we are not responsible
              for their acts or omissions. External links, including third-party
              profile links on the{' '}
              <Link
                href="/about"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                About
              </Link>{' '}
              page, are provided for reference and are not endorsements. Data
              handling is described in the{' '}
              <Link
                href="/privacy"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                privacy policy
              </Link>
              .
            </p>
          </Section>

          <Section id="warranty" title="11. Disclaimer of Warranties">
            <p>
              To the fullest extent permitted by law, the service is provided
              &ldquo;as is&rdquo; and &ldquo;as available&rdquo; without
              warranties of any kind, whether express, implied, or statutory,
              including any implied warranty of merchantability, fitness for a
              particular purpose, non-infringement, accuracy, or uninterrupted
              operation. Some jurisdictions do not allow the exclusion of certain
              warranties, so parts of this section may not apply to you.
            </p>
          </Section>

          <Section id="liability" title="12. Limitation of Liability">
            <p>
              To the fullest extent permitted by law, bayar.dev will not be
              liable for any indirect, incidental, special, consequential, or
              punitive damages, or for any loss of profits, revenue, data,
              goodwill, or business opportunity, arising out of or relating to
              your use of the service — including reliance on model output or on
              any figure presented as a demonstration value.
            </p>
            <p>
              Our total aggregate liability arising out of or relating to the free
              public service will not exceed USD 100. Nothing in these terms
              excludes liability that cannot be excluded by law, including for
              fraud or for death or personal injury caused by negligence.
            </p>
          </Section>

          <Section id="indemnity" title="13. Indemnity">
            <p>
              You agree to indemnify and hold harmless bayar.dev against claims,
              damages, losses, and reasonable costs arising from your use of the
              service in breach of these terms or of applicable law.
            </p>
          </Section>

          <Section id="termination" title="14. Termination">
            <p>
              We may block access or terminate your use of the service at any
              time, with or without notice, including for breach of these terms
              or for conduct that risks the service or other users. You may stop
              using the service at any time. Sections on intellectual property,
              disclaimers, liability, and indemnity survive termination.
            </p>
          </Section>

          <Section id="changes" title="15. Changes to These Terms">
            <p>
              We may update these terms. Material changes are reflected in the
              &ldquo;Last updated&rdquo; date above, and continued use after a
              change constitutes acceptance. If you do not accept a change, stop
              using the service.
            </p>
          </Section>

          <Section id="law" title="16. Governing Law">
            <p>
              These terms are governed by the laws of the State of California,
              United States, without regard to its conflict-of-laws rules. You
              and bayar.dev agree that any dispute arising out of or relating to
              these terms or the service will be brought exclusively in the state
              courts located in Contra Costa County, California, or in the
              federal courts of the Northern District of California, and both
              parties consent to the personal jurisdiction and venue of those
              courts — except where
              mandatory consumer protection law in your country of residence
              gives you the right to bring proceedings locally. The United
              Nations Convention on Contracts for the International Sale of Goods
              does not apply.
            </p>
            <p>
              If any provision of these terms is held unenforceable, the rest
              remains in force. Our failure to enforce a provision is not a
              waiver of it.
            </p>
          </Section>

          <Section id="contact" title="17. Contact">
            <p>
              Questions about these terms:{' '}
              <a
                href="mailto:hi@bayar.dev"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                hi@bayar.dev
              </a>
              . The operator is Namchinbayar Naran, doing business as BAYAR DEV
              (&ldquo;bayar.dev&rdquo;), located in Walnut Creek, California.
              Verification details are on the{' '}
              <Link
                href="/about"
                className="text-emerald-400 transition hover:text-emerald-300"
              >
                About
              </Link>{' '}
              page.
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
