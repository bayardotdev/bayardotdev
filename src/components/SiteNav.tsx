'use client';

import Link from 'next/link';
import { usePathname } from 'next/navigation';

const LINKS = [
  { href: '/', label: 'home' },
  { href: '/docs', label: 'docs' },
  { href: '/about', label: 'about' },
];

export default function SiteNav() {
  const pathname = usePathname();

  return (
    <header className="sticky top-0 z-50 border-b border-neutral-900 bg-black/80 backdrop-blur">
      <nav
        aria-label="Main"
        className="mx-auto flex w-full max-w-5xl items-center justify-between px-6 py-4"
      >
        <Link
          href="/"
          className="font-mono text-sm font-semibold tracking-tight transition hover:opacity-80"
        >
          bayar<span className="text-emerald-400">.dev</span>
        </Link>

        <ul className="flex items-center gap-1 font-mono text-xs sm:text-sm">
          {LINKS.map(({ href, label }) => {
            // '/' would prefix-match everything, so it's compared exactly.
            const active = href === '/' ? pathname === '/' : pathname.startsWith(href);

            return (
              <li key={href}>
                <Link
                  href={href}
                  aria-current={active ? 'page' : undefined}
                  className={`rounded px-2.5 py-1.5 transition ${
                    active
                      ? 'text-emerald-400'
                      : 'text-neutral-400 hover:text-neutral-100'
                  }`}
                >
                  {label}
                </Link>
              </li>
            );
          })}
        </ul>
      </nav>
    </header>
  );
}
