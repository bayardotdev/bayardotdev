import TerminalDemo from '@/components/TerminalDemo';

export default function Home() {
  return (
    // flex-1 lets the shared footer sit at the bottom of the viewport on tall
    // screens; justify-center keeps the block optically centred on large monitors.
    <main className="flex flex-1 flex-col items-center justify-center px-6 py-12">
      {/* Header + Terminal + Cards */}
      <div className="flex flex-col items-center w-full">
        {/* Header */}
        <div className="text-center mb-8 space-y-3">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight font-mono">
            bayar<span className="text-emerald-400">.dev</span>
          </h1>
          <p className="text-neutral-400 text-sm max-w-md mx-auto">
            Enterprise AI infrastructure & automated workflows built for modern software teams.
          </p>
        </div>

        {/* Live Terminal — width is owned by the page so it lines up with the grid below */}
        <div className="w-full max-w-5xl">
          <TerminalDemo />
        </div>

        {/* 3-Card Capability Grid */}
        <section className="mt-16 grid w-full max-w-5xl grid-cols-1 gap-4 md:grid-cols-3">
          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 backdrop-blur transition hover:border-neutral-700">
            <div className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
              01 // Core Edge
            </div>
            <h2 className="text-base font-semibold text-neutral-100">Edge Gateway & Routing</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              Sub-millisecond prompt routing, multi-region failover orchestration, and unified API interfaces across foundation models.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 backdrop-blur transition hover:border-neutral-700">
            <div className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
              02 // Guardrails
            </div>
            <h2 className="text-base font-semibold text-neutral-100">Enterprise Semantic Cache</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              Automated token rate-limiting, zero-retention PII redaction pipelines, and high-performance vector retrieval layers.
            </p>
          </div>

          <div className="rounded-xl border border-neutral-800 bg-neutral-950/60 p-6 backdrop-blur transition hover:border-neutral-700">
            <div className="mb-3 font-mono text-xs font-semibold uppercase tracking-wider text-emerald-400">
              03 // Deployment
            </div>
            <h2 className="text-base font-semibold text-neutral-100">Private VPC & BYOK</h2>
            <p className="mt-2 text-sm leading-relaxed text-neutral-400">
              Self-host directly within enterprise Azure/AWS environments with private endpoint peering and zero external data exposure.
            </p>
          </div>
        </section>
      </div>
    </main>
  );
}
