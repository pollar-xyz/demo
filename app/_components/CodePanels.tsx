// Shared code-preview panels used across the demo tabs.
// Every tab shows the same operation two ways:
//   • @pollar/core  — framework-agnostic, plain TypeScript (works anywhere)
//   • @pollar/react — the hooks + components layer built on top of core
//
// Styled after the landing page terminal: dark panel + traffic-light dots.

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
    <div className={`rounded-xl bg-[#1a1a1a] overflow-hidden ${className ?? ''}`}>
      <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
        <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
        <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
        <span className="ml-2 text-xs font-mono font-medium text-gray-300">{sdk}</span>
        {note && <span className="text-[10px] font-mono text-gray-500">— {note}</span>}
      </div>
      <pre className="p-4 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
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
