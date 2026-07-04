"use client";

// Shared "Adapter" documentation tab for the third-party protocol adapters
// (Trustless Work, Nirium, Cosmos Pay). It documents *how the adapter is built*
// — the contract, the full adapter.ts source, and the one-time registration —
// as the counterpart to each group's "Implementation" tab (which drives it live).
//
// Copy that's identical across adapters lives in t.adapterDoc; each page passes
// its own name + source snippets. `{name}` in the translated strings is filled
// in here.

import { CodePanel } from "@/app/_components/CodePanels";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export function AdapterDoc({
  name,
  source,
  register,
}: {
  // The protocol's display name (e.g. "Trustless Work") — proper noun, unlocalized.
  name: string;
  // The full adapter.ts source, shown verbatim.
  source: string;
  // The one-time registration snippet (register on the provider + the hook).
  register: string;
}) {
  const { t } = useI18n();
  const d = t.adapterDoc;
  const fill = (s: string) => s.replace(/\{name\}/g, name);

  return (
    <div className="w-full max-w-3xl space-y-8">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {fill(d.title)}
        </h1>
        <p className="text-sm text-muted mt-1.5">{fill(d.intro)}</p>
      </div>

      {/* the contract every adapter fn honors */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">
          {d.contractTitle}
        </h2>
        <p className="text-sm text-muted">{d.contractDesc}</p>
      </section>

      {/* the full adapter source */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">
          {d.sourceTitle}
        </h2>
        <p className="text-sm text-muted">{d.sourceDesc}</p>
        <CodePanel sdk="adapter.ts" code={source} />
      </section>

      {/* registration */}
      <section className="space-y-2">
        <h2 className="text-sm font-semibold text-foreground">
          {d.registerTitle}
        </h2>
        <p className="text-sm text-muted">{d.registerDesc}</p>
        <CodePanel sdk="app setup" code={register} />
      </section>
    </div>
  );
}
