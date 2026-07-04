"use client";

// Shared building blocks for the demo tabs that contrast @pollar/core vs
// @pollar/react: a segmented control to switch SDK, a function reference list
// (params / returns / tag), and a ready-made layout for modal-action tabs.

import { useState } from "react";
import { CodePanel, highlight } from "./CodePanels";
import { useI18n } from "@/app/_i18n/LanguageProvider";

const actionBtn =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";

// ─── segmented control ────────────────────────────────────────────────────────

export type Sdk = "core" | "react";

export function SdkToggle({
  value,
  onChange,
}: {
  value: Sdk;
  onChange: (v: Sdk) => void;
}) {
  const tab = (v: Sdk, label: string) => (
    <button
      key={v}
      onClick={() => onChange(v)}
      className={`flex-1 rounded-md px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
        value === v
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-light hover:text-muted"
      }`}
    >
      {label}
    </button>
  );
  return (
    <div className="inline-flex gap-1 rounded-lg border border-border bg-surface p-1">
      {tab("core", "@pollar/core")}
      {tab("react", "@pollar/react")}
    </div>
  );
}

// ─── function reference ───────────────────────────────────────────────────────
// Each entry documents one function (or reactive value) with its params, return
// type and a tag (async / sync / hook / reactive value).

export type FnDoc = {
  fn: string;
  tag: string;
  params: string;
  returns: string;
};

function tagClass(tag: string): string {
  switch (tag) {
    case "async":
      return "bg-primary/10 text-primary";
    case "hook":
      return "bg-sky-500/10 text-sky-600 dark:text-sky-300";
    case "reactive value":
      return "bg-violet-500/10 text-violet-600 dark:text-violet-300";
    case "component":
      return "bg-emerald-500/10 text-emerald-600 dark:text-emerald-300";
    case "factory":
      return "bg-amber-500/10 text-amber-600 dark:text-amber-300";
    default: // sync
      return "bg-surface text-muted-light";
  }
}

export function FnReference({
  title,
  intro,
  fns,
}: {
  title: string;
  intro: string;
  fns: readonly FnDoc[];
}) {
  return (
    <div className="space-y-2 pt-3">
      <p className="text-xs font-medium text-muted">{title}</p>
      <p className="text-xs text-muted-light">{intro}</p>
      <ul className="space-y-3 border-l-2 border-border pl-3">
        {fns.map((f) => (
          <li key={f.fn} className="space-y-1 text-xs text-muted-light">
            <div className="flex items-center gap-2">
              <code className="font-mono text-foreground">{f.fn}</code>
              <span
                className={`rounded px-1.5 py-0.5 text-[10px] font-mono ${tagClass(
                  f.tag,
                )}`}
              >
                {f.tag}
              </span>
            </div>
            <p>
              <span className="text-muted">params:</span> {f.params}
            </p>
            <p>
              <span className="text-muted">returns:</span> {f.returns}
            </p>
          </li>
        ))}
      </ul>
    </div>
  );
}

// ─── "use core from react" note ───────────────────────────────────────────────
// Rendered at the bottom of every core-side panel. Reassures readers that
// picking @pollar/react doesn't cost them core: the same PollarClient is one
// getClient() away, reachable two equivalent ways (own the instance / read it
// from the hook). Code stays English on purpose — prose comes from i18n.

const CORE_CLIENT_NOTE_CODE = `// A — build the client, pass the instance to the provider
const client = new PollarClient({ apiKey, baseUrl });
<PollarProvider client={client}>…</PollarProvider>
const c = usePollar().getClient(); // ← same instance

// B — let the provider build it from config
<PollarProvider client={{ apiKey, baseUrl }}>…</PollarProvider>
const c = usePollar().getClient(); // ← same instance`;

export function CoreClientNote() {
  const { t } = useI18n();
  const n = t.common.coreClientNote;
  return (
    <div className="mt-4 space-y-2 rounded-lg border border-border bg-surface/50 p-3">
      <p className="text-xs font-medium text-foreground">{n.title}</p>
      <p className="text-xs text-muted-light">{n.intro}</p>
      <pre className="overflow-x-auto whitespace-pre rounded-md bg-background/60 p-3 text-[11px] font-mono leading-relaxed text-slate-700 dark:bg-[#1a1a1a] dark:text-slate-300">
        {highlight(CORE_CLIENT_NOTE_CODE)}
      </pre>
      <p className="text-xs text-muted-light">{n.outro}</p>
    </div>
  );
}

// ─── modal-action tab layout ──────────────────────────────────────────────────
// For tabs whose live demo is a single prebuilt modal (send, receive, sessions,
// distribution, ramp). The toggle switches the description, the code panel and
// the function reference. The react path also exposes the live modal button;
// the core path documents the functions you'd call to build it yourself.

export type SdkFnDocs = {
  title: string;
  intro: string;
  fns: readonly FnDoc[];
};

export function SdkModalTab({
  title,
  desc,
  isAuthenticated,
  onOpen,
  openLabel,
  connectLabel,
  disabledLabel,
  guestAction = false,
  modalCall,
  modalNote,
  reactDesc,
  coreDesc,
  coreCode,
  reactCode,
  core,
  react,
}: {
  title?: string;
  desc?: string;
  isAuthenticated: boolean;
  onOpen: () => void;
  openLabel: string;
  connectLabel: string;
  // Overrides the label shown while the action button is disabled. Defaults to
  // connectLabel (the "connect wallet first" copy used by the auth-gated tabs).
  disabledLabel?: string;
  // When true the action is for signed-OUT users (the login tab): the button is
  // enabled while unauthenticated and disabled once a session exists. Defaults
  // to false — the button requires an authenticated session (logout, sessions…).
  guestAction?: boolean;
  modalCall: string;
  modalNote: string;
  reactDesc: string;
  coreDesc: string;
  coreCode: string;
  reactCode: string;
  core: SdkFnDocs;
  react: SdkFnDocs;
}) {
  const [sdk, setSdk] = useState<Sdk>("react");
  return (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* ── left: toggle + matching action / docs ──────────────────────── */}
      <div className="space-y-4">
        {(title || desc) && (
          <div>
            {title && (
              <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
                {title}
              </h1>
            )}
            {desc && <p className="text-sm text-muted mt-1.5">{desc}</p>}
          </div>
        )}

        <SdkToggle value={sdk} onChange={setSdk} />

        <p className="text-sm text-muted">
          {sdk === "react" ? reactDesc : coreDesc}
        </p>

        {sdk === "react" ? (
          <div className="space-y-1">
            {(() => {
              // Auth-gated tabs enable the button once signed in; the login tab
              // (guestAction) inverts that — enabled only while signed out.
              const enabled = guestAction ? !isAuthenticated : isAuthenticated;
              return (
                <button
                  onClick={onOpen}
                  disabled={!enabled}
                  className={`${actionBtn} w-full sm:w-auto`}
                >
                  {enabled ? openLabel : (disabledLabel ?? connectLabel)}
                </button>
              );
            })()}
            <p className="text-xs font-mono text-muted-light">
              <code className="text-foreground">{modalCall}</code> {modalNote}
            </p>
            <FnReference
              title={react.title}
              intro={react.intro}
              fns={react.fns}
            />
          </div>
        ) : (
          <>
            <FnReference title={core.title} intro={core.intro} fns={core.fns} />
            <CoreClientNote />
          </>
        )}
      </div>

      {/* ── right: matching code panel ─────────────────────────────────── */}
      <div className="lg:sticky lg:top-6">
        {sdk === "core" ? (
          <CodePanel
            sdk="@pollar/core"
            note="framework-agnostic"
            code={coreCode}
          />
        ) : (
          <CodePanel
            sdk="@pollar/react"
            note="hooks & components"
            code={reactCode}
          />
        )}
      </div>
    </div>
  );
}
