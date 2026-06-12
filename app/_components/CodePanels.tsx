// Shared code-preview panels used across the demo tabs.
// Every tab shows the same operation two ways:
//   • @pollar/core  — framework-agnostic, plain TypeScript (works anywhere)
//   • @pollar/react — the hooks + components layer built on top of core
//
// Styled after the landing page terminal: dark panel + traffic-light dots.

import type { ReactNode } from 'react';

// Lightweight TS/JS tokenizer — good enough for the short demo snippets,
// avoids pulling in a full syntax-highlighting dependency.
const TOKEN =
  /(\/\/.*)|('(?:[^'\\]|\\.)*'|"(?:[^"\\]|\\.)*"|`(?:[^`\\]|\\.)*`)|\b(import|export|from|const|let|var|await|async|new|return|if|else|for|of|in|function|type|interface|true|false|null|undefined)\b|(=>)|(\b\d+(?:\.\d+)?\b)|(\b[A-Z][\w$]*\b)|([a-zA-Z_$][\w$]*(?=\())/g;

function highlight(code: string): ReactNode[] {
  const out: ReactNode[] = [];
  let last = 0;
  for (const m of code.matchAll(TOKEN)) {
    const i = m.index;
    if (i > last) out.push(code.slice(last, i));
    const cls = m[1]
      ? 'text-gray-400 italic dark:text-gray-500' // comment
      : m[2]
        ? 'text-emerald-600 dark:text-emerald-300' // string
        : m[3] || m[4]
          ? 'text-violet-600 dark:text-violet-400' // keyword / arrow
          : m[5]
            ? 'text-amber-600 dark:text-amber-300' // number
            : m[6]
              ? 'text-sky-600 dark:text-sky-300' // class / type name
              : 'text-blue-600 dark:text-blue-300'; // function call
    out.push(
      <span key={i} className={cls}>
        {m[0]}
      </span>
    );
    last = i + m[0].length;
  }
  if (last < code.length) out.push(code.slice(last));
  return out;
}

export function CodePanel({
  sdk,
  note,
  code,
  className,
}: {
  sdk: string;
  note?: string;
  code: string;
  className?: string;
}) {
  return (
    <div
      className={`rounded-xl bg-surface border border-border dark:bg-[#1a1a1a] dark:border-transparent overflow-hidden ${className ?? ''}`}
    >
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border dark:border-white/10">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="ml-2 text-xs font-mono font-medium text-gray-600 dark:text-gray-300">{sdk}</span>
        {note && <span className="text-[10px] font-mono text-muted-light">— {note}</span>}
      </div>
      <pre className="p-4 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
        {highlight(code)}
      </pre>
    </div>
  );
}

export function DualCode({ core, react }: { core: string; react: string }) {
  return (
    <div className="space-y-4">
      <CodePanel sdk="@pollar/core" note="framework-agnostic" code={core} />
      <CodePanel sdk="@pollar/react" note="hooks & components" code={react} />
    </div>
  );
}
