"use client";

import { usePollar } from "@pollar/react";
import { useEffect, useState } from "react";
import { CodePanel } from "@/app/_components/CodePanels";
import { Select } from "@/app/_components/Select";
import { FnReference, SdkToggle, type Sdk } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── shared styles ────────────────────────────────────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const lbl = "block text-xs font-mono text-muted mb-1";
const btn = (variant: "primary" | "secondary") =>
  variant === "primary"
    ? "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
    : "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";

// "native" is the special key for XLM; issued assets are keyed "CODE:ISSUER".
const NATIVE_KEY = "native";

type PaymentAsset =
  | { type: "native" }
  | {
      type: "credit_alphanum4" | "credit_alphanum12";
      code: string;
      issuer: string;
    };

// ─── code previews ──────────────────────────────────────────────────────────

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function SendButton() {
  const { openSendModal, isAuthenticated } = usePollar();

  // openSendModal renders the asset picker, amount, review
  // and signing flow — built on top of client.runTx('payment').
  return (
    <button
      onClick={openSendModal}
      disabled={!isAuthenticated}
    >
      Send
    </button>
  );
}`;

function assetLiteral(asset: PaymentAsset): string {
  return asset.type === "native"
    ? "{ type: 'native' }"
    : `{ type: '${asset.type}', code: '${asset.code}', issuer: '${asset.issuer}' }`;
}

function coreSnippet(
  destination: string,
  asset: PaymentAsset,
  amount: string,
): string {
  return `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// "Send" is a payment operation: build → sign → submit in one call.
const res = await client.runTx('payment', {
  destination: '${destination || "G..."}',
  asset: ${assetLiteral(asset)},
  amount: '${amount || "10"}',
});
// res.status: 'success' | 'pending' | 'error'
// res.hash`;
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function SendPage() {
  const { t } = useI18n();
  const {
    openSendModal,
    isAuthenticated,
    walletBalance,
    refreshWalletBalance,
    runTx,
    tx,
    openTxModal,
  } = usePollar();

  const [sdk, setSdk] = useState<Sdk>("react");

  // ── payment form ──────────────────────────────────────────────────────────
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [assetKey, setAssetKey] = useState(NATIVE_KEY);
  const [coreError, setCoreError] = useState<string | null>(null);

  // Load the connected wallet's balances so the asset select can list what it
  // actually holds. Only fires once on the core tab, when nothing is loaded yet.
  useEffect(() => {
    if (sdk === "core" && isAuthenticated && walletBalance.step === "idle") {
      refreshWalletBalance().catch(() => {});
    }
  }, [sdk, isAuthenticated, walletBalance.step, refreshWalletBalance]);

  const balances =
    walletBalance.step === "loaded" ? walletBalance.data.balances : [];

  // native first, then every issued asset the wallet holds.
  const assetOptions = [
    { value: NATIVE_KEY, label: "XLM (native)" },
    ...balances
      .filter((b) => b.type !== "native")
      .map((b) => ({
        value: `${b.code}:${"issuer" in b ? b.issuer : ""}`,
        label: `${b.code} · ${b.available}`,
      })),
  ];

  function assetFromKey(key: string): PaymentAsset {
    if (key === NATIVE_KEY) return { type: "native" };
    const b = balances.find(
      (x) =>
        x.type !== "native" &&
        `${x.code}:${"issuer" in x ? x.issuer : ""}` === key,
    );
    if (b && b.type !== "native" && "issuer" in b && b.issuer) {
      return { type: b.type, code: b.code, issuer: b.issuer };
    }
    return { type: "native" };
  }

  const selectedAsset = assetFromKey(assetKey);

  // ── action ──────────────────────────────────────────────────────────────────
  async function sendPayment() {
    setCoreError(null);
    try {
      // one-shot build → sign → submit; drives the reactive `tx` state below.
      const outcome = await runTx("payment", {
        destination: destination.trim(),
        asset: selectedAsset,
        amount: amount.trim(),
      } as never);
      if (outcome.status === "error") {
        setCoreError(outcome.details ?? t.common.unknownError);
      }
    } catch (e) {
      setCoreError(e instanceof Error ? e.message : t.common.unknownError);
    }
  }

  // ── derived ─────────────────────────────────────────────────────────────────
  const formReady = destination.trim().length > 0 && amount.trim().length > 0;
  const txBusy =
    tx.step === "building" ||
    tx.step === "signing" ||
    tx.step === "signing-submitting" ||
    tx.step === "submitting" ||
    tx.step === "building-signing-submitting";

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: toggle + matching action ─────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.send.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">{t.send.desc}</p>
          </div>

          <SdkToggle value={sdk} onChange={setSdk} />

          <p className="text-sm text-muted">
            {sdk === "react" ? t.send.reactDesc : t.send.coreDesc}
          </p>

          {sdk === "react" ? (
            <div className="space-y-1">
              <button
                onClick={openSendModal}
                disabled={!isAuthenticated}
                className={`${btn("primary")} w-full sm:w-auto`}
              >
                {isAuthenticated ? t.send.open : t.common.connectWalletFirst}
              </button>
              <p className="text-xs font-mono text-muted-light">
                <code className="text-foreground">openSendModal()</code>{" "}
                {t.send.note}
              </p>

              <FnReference
                title={t.send.reactFnsTitle}
                intro={t.send.reactFnsIntro}
                fns={t.send.reactFns}
              />
            </div>
          ) : (
            <div className="space-y-4">
              {/* destination */}
              <div>
                <label className={lbl}>{t.send.form.destinationLabel} *</label>
                <input
                  className={inp}
                  value={destination}
                  onChange={(e) => setDestination(e.target.value)}
                  placeholder={t.send.form.destinationPh}
                  spellCheck={false}
                />
              </div>

              {/* asset select */}
              <div>
                <label className={lbl}>{t.send.form.assetLabel} *</label>
                <Select
                  value={assetKey}
                  onChange={setAssetKey}
                  options={assetOptions}
                />
                <p className="text-xs text-muted-light mt-0.5">
                  {balances.length > 0
                    ? t.send.form.assetHint
                    : t.send.form.nativeOnly}
                </p>
              </div>

              {/* amount */}
              <div>
                <label className={lbl}>{t.send.form.amountLabel} *</label>
                <input
                  className={inp}
                  type="number"
                  min={0}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder={t.send.form.amountPh}
                />
              </div>

              {/* action */}
              <div className="space-y-2 pt-1">
                {coreError && (
                  <p className="text-xs font-mono text-error">{coreError}</p>
                )}
                <button
                  onClick={sendPayment}
                  disabled={!isAuthenticated || !formReady || txBusy}
                  className={`${btn("primary")} w-full sm:w-auto`}
                >
                  {!isAuthenticated
                    ? t.common.connectWalletFirst
                    : txBusy
                      ? t.send.form.running
                      : t.send.form.run}
                </button>
                <p className="text-xs font-mono text-muted-light">
                  <code className="text-foreground">runTx('payment')</code>
                </p>
              </div>

              <FnReference
                title={t.send.coreFnsTitle}
                intro={t.send.coreFnsIntro}
                fns={t.send.coreFns}
              />
            </div>
          )}
        </div>

        {/* ── right: matching code panel + tx state ──────────────────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          {sdk === "core" ? (
            <CodePanel
              sdk="@pollar/core"
              note="framework-agnostic"
              code={coreSnippet(destination, selectedAsset, amount)}
            />
          ) : (
            <CodePanel
              sdk="@pollar/react"
              note="hooks & components"
              code={REACT_CODE}
            />
          )}

          {/* transaction state (driven by runTx) — only meaningful in core */}
          {sdk === "core" && (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
                <div className="flex items-center gap-2">
                  <span className="text-xs font-mono text-muted-light">
                    tx.step
                  </span>
                  <span
                    className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                      tx.step === "idle"
                        ? "bg-surface text-muted-light"
                        : tx.step === "success"
                          ? "bg-success-light text-success"
                          : tx.step === "error"
                            ? "bg-error-light text-error"
                            : "bg-warning-light text-warning animate-pulse"
                    }`}
                  >
                    {tx.step}
                  </span>
                </div>
                {tx.step !== "idle" && (
                  <button onClick={openTxModal} className={btn("secondary")}>
                    {t.common.viewModal}
                  </button>
                )}
              </div>

              <div className="p-4 space-y-3 bg-background min-h-16">
                {tx.step === "idle" && (
                  <p className="text-xs font-mono text-muted-light">
                    {t.send.form.stateIdle}
                  </p>
                )}

                {"buildData" in tx && tx.buildData && (
                  <div className="space-y-2">
                    <p className="text-xs font-mono font-medium text-foreground">
                      {tx.buildData.summary.title}
                    </p>
                    <div className="space-y-0.5">
                      {tx.buildData.summary.lines.map((line, i) => (
                        <p key={i} className="text-xs font-mono text-muted">
                          {line}
                        </p>
                      ))}
                    </div>
                  </div>
                )}

                {"hash" in tx && tx.hash && (
                  <div>
                    <p className="text-xs font-mono text-muted-light mb-1">
                      hash
                    </p>
                    <p className="text-xs font-mono text-success break-all">
                      {tx.hash}
                    </p>
                  </div>
                )}

                {tx.step === "error" && tx.details && (
                  <p className="text-xs font-mono text-error">
                    {typeof tx.details === "string"
                      ? tx.details
                      : JSON.stringify(tx.details, null, 2)}
                  </p>
                )}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
