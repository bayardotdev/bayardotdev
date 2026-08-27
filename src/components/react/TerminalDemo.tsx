import React, { useState } from "react";

export default function TerminalDemo() {
  const [prompt, setPrompt] = useState("");
  const [output, setOutput] = useState("");
  const [loading, setLoading] = useState(false);

  async function handleRun(e: React.FormEvent) {
    e.preventDefault();
    if (!prompt.trim() || loading) return;

    setLoading(true);
    setOutput("Generating response from Cloudflare Workers AI...");

    try {
      const res = await fetch("/api/generate", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ prompt }),
      });

      const data = await res.json();
      setOutput(data.response || data.error || JSON.stringify(data));
    } catch (err: any) {
      setOutput(`Error: ${err.message}`);
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="rounded-lg border border-neutral-800 bg-neutral-950 p-4 font-mono text-sm shadow-xl">
      <div className="mb-3 flex items-center space-x-2 border-b border-neutral-800 pb-2 text-xs text-neutral-400">
        <span className="inline-block h-3 w-3 rounded-full bg-red-500/80" />
        <span className="inline-block h-3 w-3 rounded-full bg-yellow-500/80" />
        <span className="inline-block h-3 w-3 rounded-full bg-green-500/80" />
        <span className="ml-2 font-medium">terminal@bayar.dev:~</span>
      </div>

      <form onSubmit={handleRun} className="flex gap-2">
        <span className="text-emerald-400 select-none">$</span>
        <input
          type="text"
          value={prompt}
          onChange={(e) => setPrompt(e.target.value)}
          placeholder="Enter a prompt for edge AI..."
          className="flex-1 bg-transparent text-neutral-200 outline-none placeholder:text-neutral-600"
        />
        <button
          type="submit"
          disabled={loading}
          className="rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-200 transition hover:bg-neutral-700 disabled:opacity-50"
        >
          {loading ? "Running..." : "Execute"}
        </button>
      </form>

      {output && (
        <div className="mt-4 border-t border-neutral-800/60 pt-3 whitespace-pre-wrap text-neutral-300">
          {output}
        </div>
      )}
    </div>
  );
}
