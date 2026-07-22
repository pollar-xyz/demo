"use client";

import type { WalletChain } from "@pollar/core";
import {
  ChainSelect,
  addressForChain,
  chainsOf,
  resolveChain,
  useChains,
  usePollar,
} from "@pollar/react";
import { useState } from "react";
import { ChainBadge } from "@/app/_components/ChainBadge";
import { CodePanel } from "@/app/_components/CodePanels";
import {
  CoreClientNote,
  FnReference,
  SdkToggle,
  type Sdk,
} from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── code previews ────────────────────────────────────────────────────────────

const REACT_CODE = `import { useState } from 'react';
import { useChains, ChainSelect } from '@pollar/react';

export function NetworkPicker() {
  const { chains, primaryChain, ready } = useChains();
  const [picked, setPicked] = useState(null);

  // chains is [] until /config lands — gate on \`ready\` so the
  // picker never renders a list it has to reorder a moment later.
  return (
    <ChainSelect
      value={picked ?? primaryChain}
      options={chains}
      onChange={setPicked}
      disabled={!ready}
    />
  );
}`;

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// core hands you the wallets; it does not rank them.
const wallets = client.getWallets();

// The order/filter rules live in @pollar/react (chainsOf,
// useChains) because they need /applications/config, which
// the PollarProvider fetches on mount.
wallets.forEach(w => {
  console.log(w.chain ?? 'STELLAR', w.address);
});`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ChainsPage() {
  const { t } = useI18n();
  const { wallets, isAuthenticated } = usePollar();
  const { chains, primaryChain, primaryAddress, ready } = useChains();

  const [sdk, setSdk] = useState<Sdk>("react");
  const [picked, setPicked] = useState<WalletChain | null>(null);

  const selected = picked ?? primaryChain;

  // Without the app's order, chainsOf falls back to the order the session
  // listed the wallets in — showing both side by side is the whole lesson:
  // /config doesn't just sort the list, it decides who is on it.
  const sessionOrder = chainsOf(wallets);
  const appOrder = chainsOf(wallets, chains);
  const filteredOut = sessionOrder.filter((c) => !appOrder.includes(c));

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: toggle + reference ────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.chains.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">{t.chains.desc}</p>
          </div>

          <SdkToggle value={sdk} onChange={setSdk} />

          <p className="text-sm text-muted">
            {sdk === "react" ? t.chains.reactDesc : t.chains.coreDesc}
          </p>

          {/* The one rule worth reading twice, so it sits outside both tabs. */}
          <div className="rounded-lg border border-border bg-surface px-4 py-3">
            <p className="text-xs font-medium text-foreground">
              {t.chains.orderFilterTitle}
            </p>
            <p className="text-xs text-muted mt-1.5 leading-relaxed">
              {t.chains.orderFilterBody}
            </p>
          </div>

          {sdk === "react" ? (
            <FnReference
              title={t.chains.reactFnsTitle}
              intro={t.chains.reactFnsIntro}
              fns={t.chains.reactFns}
            />
          ) : (
            <div className="space-y-3">
              <FnReference
                title={t.chains.coreFnsTitle}
                intro={t.chains.coreFnsIntro}
                fns={t.chains.coreFns}
              />
              <CoreClientNote />
            </div>
          )}
        </div>

        {/* ── right: code panel + live resolution ─────────────────────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          {sdk === "core" ? (
            <CodePanel
              sdk="@pollar/core"
              note="framework-agnostic"
              code={CORE_CODE}
            />
          ) : (
            <CodePanel
              sdk="@pollar/react"
              note="hooks & components"
              code={REACT_CODE}
            />
          )}

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
              <span className="text-xs font-mono text-muted-light">
                useChains()
              </span>
              <span
                className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                  ready
                    ? "bg-success-light text-success"
                    : "bg-surface text-muted animate-pulse"
                }`}
              >
                {ready ? "ready" : "loading"}
              </span>
            </div>

            {!isAuthenticated ? (
              <p className="px-4 py-3 text-xs font-mono text-muted-light">
                {t.chains.connectFirst}
              </p>
            ) : (
              <div className="p-4 space-y-4">
                {/* resolved values */}
                <dl className="space-y-2 text-xs font-mono">
                  <div className="flex items-center gap-2">
                    <dt className="text-muted-light w-28 shrink-0">chains</dt>
                    <dd className="flex flex-wrap gap-1">
                      {appOrder.length === 0 ? (
                        <span className="text-muted-light">[]</span>
                      ) : (
                        appOrder.map((c) => <ChainBadge key={c} chain={c} />)
                      )}
                    </dd>
                  </div>
                  <div className="flex items-center gap-2">
                    <dt className="text-muted-light w-28 shrink-0">
                      primaryChain
                    </dt>
                    <dd className="text-foreground">
                      {primaryChain ?? "null"}
                    </dd>
                  </div>
                  <div className="flex items-start gap-2">
                    <dt className="text-muted-light w-28 shrink-0">
                      primaryAddress
                    </dt>
                    <dd className="text-foreground break-all">
                      {primaryAddress || "—"}
                    </dd>
                  </div>
                </dl>

                {/* a working picker, driven by the values above */}
                <div className="border-t border-border pt-3 space-y-2">
                  {/* The real SDK component, not the demo's Select — documenting
                      it is this page's point. pollar-scope lends it the demo's
                      tokens, which the SDK otherwise only sets inside a modal. */}
                  <div className="pollar-scope">
                    <ChainSelect
                      label={t.chains.pickerLabel}
                      value={selected}
                      options={chains}
                      onChange={setPicked}
                      disabled={!ready}
                    />
                  </div>
                  <p className="text-xs font-mono text-muted">
                    addressForChain() ={" "}
                    <span className="text-foreground break-all">
                      {addressForChain(wallets, selected) || "—"}
                    </span>
                  </p>
                  {chains.length <= 1 && (
                    <p className="text-[10px] font-mono text-muted-light">
                      {t.chains.singleChainNote}
                    </p>
                  )}
                </div>

                {/* every wallet the session carries, filtered or not */}
                <div className="border-t border-border pt-3 space-y-2">
                  <p className="text-[10px] font-mono uppercase tracking-wide text-muted-light">
                    {t.chains.walletsTitle}
                  </p>
                  {wallets.map((w) => {
                    const chain = resolveChain(w.chain);
                    const served = appOrder.includes(chain);
                    return (
                      <div
                        key={`${chain}:${w.address}`}
                        className="flex items-center gap-2"
                      >
                        <ChainBadge chain={w.chain} />
                        <code className="flex-1 truncate text-[10px] font-mono text-muted">
                          {w.address}
                        </code>
                        <span
                          className={`text-[10px] font-mono px-1.5 py-0.5 rounded ${
                            served
                              ? "bg-success-light text-success"
                              : "bg-surface text-muted-light"
                          }`}
                        >
                          {served ? t.chains.served : t.chains.filtered}
                        </span>
                      </div>
                    );
                  })}
                </div>

                {/* only worth saying once the app actually dropped one */}
                {filteredOut.length > 0 && (
                  <p className="border-t border-border pt-3 text-[10px] font-mono text-muted-light leading-relaxed">
                    {t.chains.filteredNote(filteredOut.join(", "))}
                  </p>
                )}
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
