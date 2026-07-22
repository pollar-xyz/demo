"use client";

import type { WalletChain } from "@pollar/core";
import {
  ChainSelect,
  addressForChain,
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

// ─── shared styles ────────────────────────────────────────────────────────────

const btn = (variant: "primary" | "secondary") =>
  variant === "primary"
    ? "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
    : "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// Since v0.11 the user holds one wallet per chain.
// getWallet() still returns the Stellar one, so older code keeps working.
const stellar = client.getWallet();
const wallets = client.getWallets();

wallets.forEach(w => {
  // a wallet minted before multichain carries no chain: it's Stellar
  console.log(w.chain ?? 'STELLAR', w.address);
});`;

const REACT_CODE = `import {
  usePollar,
  useChains,
  addressForChain,
} from '@pollar/react';

export function Receive() {
  const { wallets, openReceiveModal } = usePollar();
  const { chains, primaryChain } = useChains();

  // the address to show for the app's first configured chain
  const address = addressForChain(wallets, primaryChain);

  return (
    <>
      <code>{address}</code>
      <button onClick={openReceiveModal}>Receive</button>
    </>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ReceivePage() {
  const { t } = useI18n();
  const { openReceiveModal, isAuthenticated, wallets } = usePollar();
  const { chains, primaryChain, ready } = useChains();

  const [sdk, setSdk] = useState<Sdk>("react");
  const [picked, setPicked] = useState<WalletChain | null>(null);
  const [copied, setCopied] = useState<string | null>(null);

  // Falling back to primaryChain rather than to chains[0] matters while /config
  // is still in flight: useChains only reports the app's real order once ready.
  const chain = picked ?? primaryChain;
  const address = addressForChain(wallets, chain);

  async function copy(value: string) {
    await navigator.clipboard.writeText(value);
    setCopied(value);
    window.setTimeout(
      () => setCopied((current) => (current === value ? null : current)),
      1500,
    );
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: toggle + matching action ─────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.receive.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">{t.receive.desc}</p>
          </div>

          <SdkToggle value={sdk} onChange={setSdk} />

          <p className="text-sm text-muted">
            {sdk === "react" ? t.receive.reactDesc : t.receive.coreDesc}
          </p>

          {sdk === "react" ? (
            <div className="space-y-1">
              <button
                onClick={openReceiveModal}
                disabled={!isAuthenticated}
                className={`${btn("primary")} w-full sm:w-auto`}
              >
                {isAuthenticated ? t.receive.open : t.common.connectWalletFirst}
              </button>
              <p className="text-xs font-mono text-muted-light">
                <code className="text-foreground">openReceiveModal()</code>{" "}
                {t.receive.note}
              </p>

              <FnReference
                title={t.receive.reactFnsTitle}
                intro={t.receive.reactFnsIntro}
                fns={t.receive.reactFns}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <p className="text-xs font-mono text-muted-light">
                <code className="text-foreground">session.wallets</code>{" "}
                {t.receive.coreNote}
              </p>

              <FnReference
                title={t.receive.coreFnsTitle}
                intro={t.receive.coreFnsIntro}
                fns={t.receive.coreFns}
              />
              <CoreClientNote />
            </div>
          )}
        </div>

        {/* ── right: matching code panel + the live per-chain addresses ────── */}
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
            <div className="px-4 py-2.5 border-b border-border bg-surface">
              <span className="text-xs font-mono text-muted-light">
                {t.receive.addressesTitle}
              </span>
            </div>

            {!isAuthenticated ? (
              <p className="px-4 py-3 text-xs font-mono text-muted-light">
                {t.receive.noWallets}
              </p>
            ) : (
              <div className="p-4 space-y-4">
                <p className="text-xs text-muted">{t.receive.addressesIntro}</p>

                {/* ChainSelect renders nothing when there is only one option, so
                    a single-chain app simply shows its address with no picker. */}
                <ChainSelect
                  label={t.receive.networkLabel}
                  value={chain}
                  options={chains}
                  onChange={setPicked}
                  disabled={!ready}
                />

                <div className="space-y-1.5">
                  <div className="flex items-center gap-2">
                    <ChainBadge chain={chain ?? undefined} />
                    <span className="text-[10px] font-mono text-muted-light">
                      addressForChain()
                    </span>
                  </div>
                  <div className="flex items-start gap-2">
                    <code className="flex-1 break-all text-xs font-mono text-foreground">
                      {address || "—"}
                    </code>
                    <button
                      onClick={() => copy(address)}
                      disabled={!address}
                      className={`${btn("secondary")} shrink-0`}
                    >
                      {copied === address ? t.receive.copied : t.receive.copy}
                    </button>
                  </div>
                </div>

                {/* The whole set, so "one user, one wallet per network" is
                    visible at once rather than one selection at a time. */}
                {wallets.length > 1 && (
                  <div className="space-y-2 border-t border-border pt-3">
                    {wallets.map((w) => (
                      <div
                        key={`${w.chain ?? "STELLAR"}:${w.address}`}
                        className="flex items-center gap-2"
                      >
                        <ChainBadge chain={w.chain} />
                        <code className="flex-1 truncate text-[10px] font-mono text-muted">
                          {w.address}
                        </code>
                      </div>
                    ))}
                  </div>
                )}

                <p className="text-[10px] font-mono text-muted-light">
                  {t.receive.qrNote}
                </p>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
