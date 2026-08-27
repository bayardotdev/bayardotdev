'use client';

import { useChat } from '@ai-sdk/react';
import { useEffect, useRef, useState } from 'react';

const QUICK_COMMANDS = [
  'benchmark --latency',
  'architecture --stack',
  'security --compliance',
  'contact --sales',
];

/** How close to the bottom (px) still counts as "following the stream". */
const PIN_THRESHOLD = 32;

/**
 * The chat transport sets `error.message` to the raw response body, so a 4xx from
 * our route arrives as a JSON string. Unwrap it to the human-readable message.
 */
function errorText(error: Error): string {
  try {
    const parsed = JSON.parse(error.message) as { error?: unknown };
    if (typeof parsed.error === 'string') return parsed.error;
  } catch {
    // Not JSON — fall through to the raw message.
  }
  return error.message || 'Failed to connect to Azure endpoint.';
}

export default function TerminalDemo() {
  const { messages, sendMessage, status, error, stop } = useChat();
  const [input, setInput] = useState('');
  const scrollRef = useRef<HTMLDivElement>(null);
  const pinnedToBottom = useRef(true);

  const isLoading = status === 'streaming' || status === 'submitted';

  const handleScroll = () => {
    const el = scrollRef.current;
    if (!el) return;
    pinnedToBottom.current =
      el.scrollHeight - el.scrollTop - el.clientHeight < PIN_THRESHOLD;
  };

  useEffect(() => {
    const el = scrollRef.current;
    // Only follow the stream if the user hasn't scrolled up to read earlier output.
    if (el && pinnedToBottom.current) {
      el.scrollTop = el.scrollHeight;
    }
  }, [messages, error]);

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (!input.trim() || isLoading) return;

    pinnedToBottom.current = true;
    sendMessage({ text: input });
    setInput('');
  };

  const handleChipClick = (cmd: string) => {
    if (isLoading) return;
    pinnedToBottom.current = true;
    sendMessage({ text: cmd });
  };

  const statusLabel = isLoading ? 'STREAMING' : error ? 'ERROR' : 'IDLE';
  const statusClass = isLoading
    ? 'text-emerald-400 animate-pulse'
    : error
      ? 'text-red-400'
      : 'text-neutral-500';

  return (
    <div className="w-full rounded-xl border border-neutral-800 bg-neutral-950 font-mono text-sm shadow-2xl overflow-hidden">
      {/* Header Bar */}
      <div className="flex items-center justify-between border-b border-neutral-800 px-4 py-3 bg-neutral-900/50">
        <div className="flex items-center space-x-2">
          <div className="h-3 w-3 rounded-full bg-red-500/80" />
          <div className="h-3 w-3 rounded-full bg-yellow-500/80" />
          <div className="h-3 w-3 rounded-full bg-emerald-500/80" />
          <span className="ml-2 text-xs text-neutral-400">core@bayar.dev:~</span>
        </div>
        <span className={`text-[11px] font-medium ${statusClass}`}>{statusLabel}</span>
      </div>

      {/* Terminal Output */}
      <div
        ref={scrollRef}
        onScroll={handleScroll}
        aria-live="polite"
        aria-label="Terminal output"
        className="h-80 lg:h-96 overflow-y-auto p-4 space-y-4 text-neutral-300"
      >
        {messages.length === 0 ? (
          <p className="text-neutral-600 italic">Click a command below or enter a custom prompt...</p>
        ) : (
          messages.map((m) => (
            <div key={m.id} className="flex gap-2">
              <span className={m.role === 'user' ? 'text-cyan-400 select-none' : 'text-emerald-400 select-none'}>
                {m.role === 'user' ? '>' : 'λ'}
              </span>
              <div className="whitespace-pre-wrap flex-1 leading-relaxed">
                {m.parts.map((part, idx) => (part.type === 'text' ? <span key={idx}>{part.text}</span> : null))}
              </div>
            </div>
          ))
        )}

        {isLoading && messages[messages.length - 1]?.role === 'user' && (
          <div className="flex gap-2 text-neutral-500 animate-pulse">
            <span>λ</span>
            <span>executing...</span>
          </div>
        )}

        {error && (
          <div className="rounded border border-red-900/50 bg-red-950/40 p-2 text-xs text-red-400">
            [error] {errorText(error)}
          </div>
        )}
      </div>

      {/* Interactive Prompt Chips */}
      <div className="flex flex-wrap gap-2 px-4 py-2.5 border-t border-neutral-800/60 bg-neutral-900/20 text-xs">
        {QUICK_COMMANDS.map((cmd) => (
          <button
            key={cmd}
            type="button"
            disabled={isLoading}
            onClick={() => handleChipClick(cmd)}
            className="rounded border border-neutral-800 bg-neutral-900/80 px-2.5 py-1 text-neutral-400 transition hover:border-emerald-500/40 hover:text-emerald-300 disabled:opacity-40"
          >
            ${cmd}
          </button>
        ))}
      </div>

      {/* Input Form */}
      <form onSubmit={handleSubmit} className="flex items-center border-t border-neutral-800 bg-neutral-900/40 px-4 py-3">
        <span className="mr-2 text-emerald-400 select-none" aria-hidden="true">$</span>
        <input
          value={input}
          onChange={(e) => setInput(e.target.value)}
          placeholder="Enter custom prompt..."
          aria-label="Terminal prompt"
          autoComplete="off"
          spellCheck={false}
          className="flex-1 bg-transparent text-neutral-100 outline-none placeholder:text-neutral-600 text-sm"
        />
        {isLoading ? (
          <button
            type="button"
            onClick={stop}
            className="rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-300 transition hover:bg-neutral-700"
          >
            Stop
          </button>
        ) : (
          <button
            type="submit"
            disabled={!input.trim()}
            className="rounded bg-neutral-800 px-3 py-1 text-xs text-neutral-300 transition hover:bg-neutral-700 disabled:opacity-40"
          >
            Send
          </button>
        )}
      </form>
    </div>
  );
}
