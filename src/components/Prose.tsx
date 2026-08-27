import type { ReactNode } from 'react';

/**
 * Shared page furniture for the non-interactive subpages (about, docs, legal).
 * Keeps one definition of the type scale so the pages can't drift apart.
 */

/** Standard content column. Matches the max-w-5xl of the home page grid. */
export function PageShell({ children }: { children: ReactNode }) {
  return (
    <main className="mx-auto w-full max-w-5xl flex-1 px-6 py-12 sm:py-16">{children}</main>
  );
}

export function PageHeader({
  eyebrow,
  title,
  intro,
  meta,
}: {
  eyebrow: string;
  title: string;
  intro: string;
  /** Small mono line under the intro, e.g. "Last updated: ...". */
  meta?: string;
}) {
  return (
    <div className="border-b border-neutral-900 pb-8">
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
        {eyebrow}
      </p>
      <h1 className="mt-3 font-mono text-3xl font-bold tracking-tight sm:text-4xl">
        {title}
      </h1>
      <p className="mt-4 max-w-2xl text-sm leading-relaxed text-neutral-400 sm:text-base">
        {intro}
      </p>
      {meta && <p className="mt-4 font-mono text-xs text-neutral-600">{meta}</p>}
    </div>
  );
}

export function Section({
  id,
  title,
  children,
}: {
  id: string;
  title: string;
  children: ReactNode;
}) {
  return (
    // scroll-mt clears the sticky nav when an anchor link jumps here.
    <section id={id} className="scroll-mt-24 pt-12">
      <h2 className="font-mono text-lg font-semibold tracking-tight text-neutral-100">
        <a href={`#${id}`} className="transition hover:text-emerald-400">
          {title}
        </a>
      </h2>
      <div className="mt-4 space-y-4 text-sm leading-relaxed text-neutral-400">
        {children}
      </div>
    </section>
  );
}

/** Anchor list rendered as a sticky sidebar on wide screens. */
export function TableOfContents({
  items,
}: {
  items: { id: string; title: string }[];
}) {
  return (
    <nav aria-label="On this page" className="lg:sticky lg:top-24">
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500">
        On this page
      </p>
      <ul className="mt-3 space-y-2 font-mono text-xs">
        {items.map(({ id, title }) => (
          <li key={id}>
            <a
              href={`#${id}`}
              className="text-neutral-500 transition hover:text-emerald-400"
            >
              {title}
            </a>
          </li>
        ))}
      </ul>
    </nav>
  );
}

export function CodeBlock({ label, code }: { label: string; code: string }) {
  return (
    <figure className="overflow-hidden rounded-xl border border-neutral-800 bg-neutral-950">
      <figcaption className="flex items-center justify-between border-b border-neutral-800 bg-neutral-900/50 px-4 py-2 font-mono text-xs text-neutral-400">
        {label}
      </figcaption>
      <pre className="overflow-x-auto p-4 font-mono text-xs leading-relaxed text-neutral-300">
        <code>{code}</code>
      </pre>
    </figure>
  );
}

export function Code({ children }: { children: ReactNode }) {
  return (
    <code className="rounded border border-neutral-800 bg-neutral-900 px-1.5 py-0.5 font-mono text-[0.85em] text-emerald-300">
      {children}
    </code>
  );
}

/** Two-column definition table used for limits, headers and status codes. */
export function SpecTable({
  columns,
  rows,
}: {
  columns: string[];
  rows: ReactNode[][];
}) {
  return (
    <div className="overflow-x-auto rounded-xl border border-neutral-800">
      <table className="w-full border-collapse text-left text-xs">
        <thead>
          <tr className="bg-neutral-900/50">
            {columns.map((column) => (
              <th
                key={column}
                scope="col"
                className="px-4 py-2.5 font-mono text-xs font-semibold uppercase tracking-wider text-neutral-500"
              >
                {column}
              </th>
            ))}
          </tr>
        </thead>
        <tbody>
          {rows.map((row, rowIndex) => (
            <tr key={rowIndex} className="border-t border-neutral-800/80">
              {row.map((cell, cellIndex) => (
                <td
                  key={cellIndex}
                  className={
                    cellIndex === 0
                      ? 'whitespace-nowrap px-4 py-2.5 font-mono text-neutral-200'
                      : 'px-4 py-2.5 leading-relaxed text-neutral-400'
                  }
                >
                  {cell}
                </td>
              ))}
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

/** Callout for statements that must not be mistaken for a live guarantee. */
export function Note({ label, children }: { label: string; children: ReactNode }) {
  return (
    <div className="rounded-xl border border-emerald-900/50 bg-emerald-950/20 p-4">
      <p className="font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
        {label}
      </p>
      <div className="mt-2 text-sm leading-relaxed text-neutral-300">{children}</div>
    </div>
  );
}
