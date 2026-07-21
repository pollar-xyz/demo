"use client";

import { usePollar } from "@pollar/react";
import type { WalletBalanceContent } from "@pollar/core";
import { useState } from "react";
import { CodePanel } from "@/app/_components/CodePanels";
import {
  CoreClientNote,
  FnReference,
  SdkToggle,
  type Sdk,
} from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── shared styles ────────────────────────────────────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const btn = (variant: "primary" | "secondary") =>
  variant === "primary"
    ? "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
    : "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";

// ─── code previews ────────────────────────────────────────────────────────────
// @pollar/react is the prebuilt modal; @pollar/core is the manual fetch whose
// raw response we render. The core snippet varies by whether a public key is
// entered (arbitrary address → getWalletBalance; otherwise → refreshBalance).

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function BalanceButton() {
  const { openWalletBalanceModal, isAuthenticated } = usePollar();

  // openWalletBalanceModal renders the connected wallet's
  // balances inside a modal — built on top of client.refreshBalance().
  return (
    <button
      onClick={openWalletBalanceModal}
      disabled={!isAuthenticated}
    >
      Balance
    </button>
  );
}`;

function coreSnippet(trimmedKey: string, usingCustomKey: boolean): string {
  return usingCustomKey
    ? `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// fetch any account by public key — returns the data directly
const { balances } = await client.getWalletBalance('${trimmedKey || "G..."}');

balances.forEach(b => {
  console.log(b.code, b.balance);
});`
    : `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// fetch the connected wallet's balances (no public key)
await client.refreshBalance();

// then read the reactive state
const state = client.getWalletBalanceState();
if (state.step === 'loaded') {
  state.data.balances.forEach(b => {
    console.log(b.code, b.balance);
  });
}`;
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function BalancePage() {
  const { t } = useI18n();
  const {
    walletBalance,
    openWalletBalanceModal,
    getClient,
    wallet,
    isAuthenticated,
  } = usePollar();
  const walletAddress = wallet?.address ?? "";

  const [sdk, setSdk] = useState<Sdk>("react");
  const [publicKey, setPublicKey] = useState("");
  const [lastError, setLastError] = useState<string | null>(null);
  const [inFlight, setInFlight] = useState(false);
  // arbitrary-address lookups return data directly (getWalletBalance), so —
  // unlike the connected wallet — they don't drive reactive state.
  const [customResult, setCustomResult] = useState<WalletBalanceContent | null>(
    null,
  );

  // ── actions ─────────────────────────────────────────────────────────────────
  async function fetchOwnWallet() {
    setLastError(null);
    setCustomResult(null);
    setInFlight(true);
    try {
      // connected wallet → drives the reactive walletBalance state.
      await getClient().refreshBalance();
    } catch (e) {
      setLastError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setInFlight(false);
    }
  }

  async function fetchByPublicKey() {
    setLastError(null);
    setInFlight(true);
    try {
      // arbitrary address → getWalletBalance() returns the content directly
      // (no reactive state), since refreshBalance() only targets the connected wallet.
      const content = await getClient().getWalletBalance(publicKey.trim());
      setCustomResult(content);
    } catch (e) {
      setCustomResult(null);
      setLastError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setInFlight(false);
    }
  }

  // ── derived ─────────────────────────────────────────────────────────────────
  const trimmedKey = publicKey.trim();
  // custom-key lookups only exist in core mode.
  const usingCustomKey = sdk === "core" && trimmedKey.length > 0;

  // custom-address lookups read the directly-returned `customResult`; everything
  // else reads the reactive `walletBalance` (driven by refreshBalance / the modal).
  const step = usingCustomKey
    ? inFlight
      ? "loading"
      : lastError
        ? "error"
        : customResult
          ? "loaded"
          : "idle"
    : walletBalance.step;
  const rawData = usingCustomKey
    ? customResult
    : walletBalance.step === "loaded"
      ? walletBalance.data
      : null;
  const balances = rawData?.balances ?? null;
  const stateMessage =
    step === "idle"
      ? t.balance.idle
      : step === "loading"
        ? t.common.loading
        : step === "error"
          ? usingCustomKey
            ? lastError
            : walletBalance.step === "error"
              ? walletBalance.message
              : null
          : null;

  const coreCode = coreSnippet(trimmedKey, usingCustomKey);

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: toggle + matching action ─────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.balance.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">{t.balance.desc}</p>
          </div>

          <SdkToggle value={sdk} onChange={setSdk} />

          {/* what the selected SDK does */}
          <p className="text-sm text-muted">
            {sdk === "react" ? t.balance.reactDesc : t.balance.coreDesc}
          </p>

          {sdk === "react" ? (
            <div className="space-y-1">
              <button
                onClick={openWalletBalanceModal}
                disabled={!isAuthenticated}
                className={`${btn("primary")} w-full sm:w-auto`}
              >
                {isAuthenticated ? t.balance.open : t.common.connectWalletFirst}
              </button>
              <p className="text-xs font-mono text-muted-light">
                <code className="text-foreground">
                  openWalletBalanceModal()
                </code>{" "}
                {t.balance.modalNote}
              </p>

              <FnReference
                title={t.balance.reactFnsTitle}
                intro={t.balance.reactFnsIntro}
                fns={t.balance.reactFns}
              />
            </div>
          ) : (
            <div className="space-y-3">
              {/* lookup any address */}
              <div className="space-y-2">
                <label className="block text-xs font-mono text-muted">
                  {t.balance.lookupLabel}
                </label>
                <div className="flex gap-2">
                  <input
                    className={inp}
                    value={publicKey}
                    onChange={(e) => setPublicKey(e.target.value)}
                    placeholder="G..."
                    spellCheck={false}
                  />
                  <button
                    onClick={fetchByPublicKey}
                    disabled={inFlight || !usingCustomKey}
                    className={`${btn("primary")} shrink-0`}
                  >
                    {inFlight && usingCustomKey
                      ? t.common.loading
                      : t.balance.fetch}
                  </button>
                </div>
              </div>

              {/* own wallet shortcut */}
              {isAuthenticated && (
                <div className="space-y-1">
                  <button
                    onClick={fetchOwnWallet}
                    disabled={inFlight}
                    className={btn("secondary")}
                  >
                    {inFlight && !usingCustomKey
                      ? t.common.loading
                      : t.balance.useMyWallet}
                  </button>
                  {walletAddress && (
                    <p className="text-[10px] font-mono text-muted-light truncate">
                      {walletAddress}
                    </p>
                  )}
                </div>
              )}

              <p className="text-xs font-mono text-muted-light">
                <code className="text-foreground">getWalletBalance()</code>{" "}
                {t.balance.coreNote}
              </p>

              <FnReference
                title={t.balance.coreFnsTitle}
                intro={t.balance.coreFnsIntro}
                fns={t.balance.coreFns}
              />
              <CoreClientNote />
            </div>
          )}
        </div>

        {/* ── right: matching code panel + live state + raw response ───────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
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
              code={REACT_CODE}
            />
          )}

          {/* live state + rendered table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
              <span className="text-xs font-mono text-muted-light">
                {usingCustomKey ? "getWalletBalance()" : "walletBalance.step"}
              </span>
              <span
                className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                  step === "idle"
                    ? "bg-surface text-muted-light"
                    : step === "loading"
                      ? "bg-surface text-muted animate-pulse"
                      : step === "loaded"
                        ? "bg-success-light text-success"
                        : "bg-error-light text-error"
                }`}
              >
                {step}
              </span>
            </div>

            {lastError && usingCustomKey && (
              <p className="px-4 py-3 text-xs font-mono text-error">
                {lastError}
              </p>
            )}

            {stateMessage && (
              <p className="px-4 py-3 text-xs font-mono text-muted-light">
                {stateMessage}
              </p>
            )}

            {balances && balances.length === 0 && (
              <p className="px-4 py-3 text-xs font-mono text-muted-light">
                {t.balance.noBalances}
              </p>
            )}

            {balances && balances.length > 0 && (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-2 text-muted-light font-medium">
                      {t.balance.assetCol}
                    </th>
                    <th className="text-right px-4 py-2 text-muted-light font-medium">
                      {t.balance.balanceCol}
                    </th>
                    <th className="text-right px-4 py-2 text-muted-light font-medium">
                      {t.balance.availableCol}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {balances.map((b, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-2.5 text-foreground">
                        {b.type === "native" ? "XLM" : b.code}
                        {"issuer" in b && b.issuer && (
                          <span className="block text-[10px] text-muted-light truncate max-w-40">
                            {b.issuer}
                          </span>
                        )}
                      </td>
                      {/* null = the chain couldn't be read, not a zero balance */}
                      <td className="px-4 py-2.5 text-right text-foreground">
                        {b.balance ?? "—"}
                      </td>
                      <td className="px-4 py-2.5 text-right text-muted-light">
                        {b.available ?? "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* raw response — how the data actually arrives from the API */}
          {rawData && (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface">
                <span className="text-xs font-mono text-muted-light">
                  {t.balance.rawResponse}
                </span>
                <span className="text-xs font-mono text-muted-light">
                  {usingCustomKey ? "getWalletBalance()" : "walletBalance.data"}
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre leading-relaxed max-h-80 overflow-y-auto">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
