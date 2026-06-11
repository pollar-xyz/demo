// Shared code-preview panels used across the demo tabs.
// Every tab shows the same operation two ways:
//   • @pollar/core  — framework-agnostic, plain TypeScript (works anywhere)
//   • @pollar/react — the hooks + components layer built on top of core

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
    <div className={`rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden ${className ?? ''}`}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
        <span className="text-xs font-mono font-medium text-zinc-700 dark:text-zinc-200">{sdk}</span>
        {note && <span className="text-[10px] font-mono text-zinc-400">— {note}</span>}
      </div>
      <pre className="p-4 text-xs font-mono text-zinc-700 dark:text-zinc-300 overflow-x-auto whitespace-pre leading-relaxed bg-white dark:bg-zinc-950">
        {code}
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
