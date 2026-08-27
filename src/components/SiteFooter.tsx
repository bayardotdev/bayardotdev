import Link from 'next/link';

const LINKS = [
  { href: '/about', label: 'About' },
  { href: '/docs', label: 'Docs' },
  { href: '/privacy', label: 'Privacy' },
  { href: '/terms', label: 'Terms' },
];

export default function SiteFooter() {
  return (
    <footer className="border-t border-neutral-900">
      <div className="mx-auto flex w-full max-w-5xl flex-col gap-4 px-6 py-8 font-mono text-xs text-neutral-500 sm:flex-row sm:items-center sm:justify-between sm:text-sm">
        <span>© 2026 bayar.dev. All rights reserved.</span>

        <nav aria-label="Footer" className="flex flex-wrap items-center gap-x-4 gap-y-2">
          {LINKS.map(({ href, label }) => (
            <Link key={href} href={href} className="transition hover:text-emerald-400">
              {label}
            </Link>
          ))}
          <a
            href="mailto:hi@bayar.dev"
            className="text-neutral-400 transition hover:text-emerald-400"
          >
            hi@bayar.dev
          </a>
        </nav>
      </div>
    </footer>
  );
}
