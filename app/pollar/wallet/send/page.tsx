"use client";

import { usePollar } from "@pollar/react";
import type { Sep7Request } from "@cosmosapp/pay_sdk/web";
import { useEffect, useState } from "react";
import { CodePanel } from "@/app/_components/CodePanels";
import { Select } from "@/app/_components/Select";
import { Sep7Scanner } from "@/app/_components/Sep7Scanner";
import {
  CoreClientNote,
  FnReference,
  type Sdk,
} from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── shared styles ────────────────────────────────────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const lbl = "block text-xs font-mono text-muted mb-1";
const btn = (variant: "primary" | "secondary") =>
  variant === "primary"
    ? "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
    : "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";

// The send page adds a third tab (QR scan) to the usual core/react split.
type Tab = Sdk | "scan";

// "native" is the special key for XLM; issued assets are keyed "CODE:ISSUER".
const NATIVE_KEY = "native";

type IssuedAsset = {
  type: "credit_alphanum4" | "credit_alphanum12";
  code: string;
  issuer: string;
};
type PaymentAsset = { type: "native" } | IssuedAsset;

// runTx's third argument — only the memo shape this page sets.
type PaymentOptions =
  | {
      memo: { type: "text" | "id"; value: string };
    }
  | undefined;

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

// The scan tab: parse a SEP-7 QR, then run the very same payment.
function scanSnippet(
  destination: string,
  asset: PaymentAsset,
  amount: string,
  memo: string,
): string {
  const memoArg = memo
    ? `,\n  { memo: { type: 'text', value: '${memo}' } }`
    : "";
  return `import { parseSep7, isSep7Uri } from '@cosmosapp/pay_sdk/web';
import { usePollar } from '@pollar/react';

// 1. decode the QR to a string, then parse the SEP-7 'pay' URI
const uri = 'web+stellar:pay?destination=…';
if (!isSep7Uri(uri)) throw new Error('not a Stellar URI');
const req = parseSep7(uri);
// req: { destination, amount, assetCode, assetIssuer, memo, memoType, … }

// 2. build → sign → submit with the connected wallet
const { runTx } = usePollar();
await runTx('payment', {
  destination: '${destination || "G..."}',
  asset: ${assetLiteral(asset)},
  amount: '${amount || "0"}',
}${memoArg});`;
}

// SEP-7 memoType → runTx's memo option. Only text/id map cleanly; hash/return
// aren't expressible through this option, so we drop them (rare for pay URIs).
function memoOption(memo: string, memoType: string): PaymentOptions {
  const value = memo.trim();
  if (!value) return undefined;
  const t = memoType.trim().toUpperCase();
  if (t === "MEMO_ID") return { memo: { type: "id", value } };
  if (t === "MEMO_TEXT" || t === "") return { memo: { type: "text", value } };
  return undefined;
}

// SEP-7 asset fields → the payment asset. ≤ 4 chars is alphanum4, else alphanum12.
function assetFromSep7(req: Sep7Request): PaymentAsset {
  if (!req.assetCode) return { type: "native" };
  const type =
    req.assetCode.length <= 4 ? "credit_alphanum4" : "credit_alphanum12";
  return { type, code: req.assetCode, issuer: req.assetIssuer ?? "" };
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

  const [tab, setTab] = useState<Tab>("core");

  // ── payment form ──────────────────────────────────────────────────────────
  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [assetKey, setAssetKey] = useState(NATIVE_KEY);
  const [coreError, setCoreError] = useState<string | null>(null);

  // ── scan tab extras ─────────────────────────────────────────────────────────
  // Assets read off a QR the connected wallet may not hold — kept aside so the
  // asset select can still list them.
  const [extraAssets, setExtraAssets] = useState<Record<string, IssuedAsset>>(
    {},
  );
  const [memo, setMemo] = useState("");
  const [memoType, setMemoType] = useState("");
  const [scanned, setScanned] = useState<Sep7Request | null>(null);

  // Load the connected wallet's balances so the asset select can list what it
  // actually holds. Fires on the core/scan tabs, when nothing is loaded yet.
  useEffect(() => {
    if (tab !== "react" && isAuthenticated && walletBalance.step === "idle") {
      refreshWalletBalance().catch(() => {});
    }
  }, [tab, isAuthenticated, walletBalance.step, refreshWalletBalance]);

  const balances =
    walletBalance.step === "loaded" ? walletBalance.data.balances : [];

  const heldKeys = new Set(
    balances
      .filter((b) => b.type !== "native")
      .map((b) => `${b.code}:${"issuer" in b ? b.issuer : ""}`),
  );

  // The wallet's held amount of an issued asset, or null when balances aren't
  // loaded yet (so we don't claim a misleading "0" before the fetch lands).
  function availableFor(asset: IssuedAsset): string | null {
    const match = balances.find(
      (b) =>
        b.type !== "native" &&
        b.code === asset.code &&
        "issuer" in b &&
        b.issuer === asset.issuer,
    );
    if (match) return match.available;
    return walletBalance.step === "loaded" ? "0" : null;
  }

  // native first, then held assets, then any scanned asset the wallet lacks.
  const assetOptions = [
    { value: NATIVE_KEY, label: "XLM (native)" },
    ...balances
      .filter((b) => b.type !== "native")
      .map((b) => ({
        value: `${b.code}:${"issuer" in b ? b.issuer : ""}`,
        label: `${b.code} · ${b.available}`,
      })),
    ...Object.entries(extraAssets)
      .filter(([key]) => !heldKeys.has(key))
      .map(([key, a]) => {
        // Once balances load, show the real (often 0) held amount, matching the
        // held-asset rows; until then fall back to a "from QR" marker.
        const bal = availableFor(a);
        return {
          value: key,
          label:
            bal !== null
              ? `${a.code} · ${bal}`
              : `${a.code} · ${t.send.scan.fromQr}`,
        };
      }),
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
    if (extraAssets[key]) return extraAssets[key];
    return { type: "native" };
  }

  const selectedAsset = assetFromKey(assetKey);

  // Held amount + code of the selected asset, shown above the amount input.
  // Null until balances load, so we never render a stale/guessed number.
  function selectedAvailable(): { code: string; available: string } | null {
    if (walletBalance.step !== "loaded") return null;
    if (selectedAsset.type === "native") {
      const n = balances.find((b) => b.type === "native");
      return { code: "XLM", available: n ? n.available : "0" };
    }
    return {
      code: selectedAsset.code,
      available: availableFor(selectedAsset) ?? "0",
    };
  }

  // ── scan → prefill ──────────────────────────────────────────────────────────
  function handleScan(req: Sep7Request) {
    setDestination(req.destination ?? "");
    setAmount(req.amount ?? "");
    const asset = assetFromSep7(req);
    if (asset.type === "native") {
      setAssetKey(NATIVE_KEY);
    } else {
      const key = `${asset.code}:${asset.issuer}`;
      setExtraAssets((prev) => ({ ...prev, [key]: asset }));
      setAssetKey(key);
    }
    setMemo(req.memo ?? "");
    setMemoType(req.memoType ?? "");
    setScanned(req);
    setCoreError(null);
  }

  // ── action ──────────────────────────────────────────────────────────────────
  async function sendPayment() {
    setCoreError(null);
    try {
      // one-shot build → sign → submit; drives the reactive `tx` state below.
      const options = memoOption(memo, memoType);
      const outcome = await runTx(
        "payment",
        {
          destination: destination.trim(),
          asset: selectedAsset,
          amount: amount.trim(),
        } as never,
        options as never,
      );
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
  const showTxState = tab === "core" || tab === "scan";
  const memoSupported = memoOption(memo, memoType) !== undefined;

  const tabBtn = (value: Tab, label: string) => (
    <button
      key={value}
      onClick={() => setTab(value)}
      className={`rounded-md px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
        tab === value
          ? "bg-background text-foreground shadow-sm"
          : "text-muted-light hover:text-muted"
      }`}
    >
      {label}
    </button>
  );

  // Shared payment fields — used by both the core tab and the scan review.
  const paymentFields = (
    <div className="space-y-4">
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

      <div>
        <label className={lbl}>{t.send.form.assetLabel} *</label>
        <Select
          value={assetKey}
          onChange={setAssetKey}
          options={assetOptions}
        />
        <p className="text-xs text-muted-light mt-0.5">
          {balances.length > 0 ? t.send.form.assetHint : t.send.form.nativeOnly}
        </p>
      </div>

      <div>
        <div className="mb-1 flex items-baseline justify-between gap-2">
          <span className="text-xs font-mono text-muted">
            {t.send.form.amountLabel} *
          </span>
          {(() => {
            const avail = selectedAvailable();
            return avail ? (
              <span className="text-xs font-mono text-muted-light">
                {t.send.form.available}: {avail.available} {avail.code}
              </span>
            ) : null;
          })()}
        </div>
        <input
          className={inp}
          type="number"
          min={0}
          value={amount}
          onChange={(e) => setAmount(e.target.value)}
          placeholder={t.send.form.amountPh}
        />
      </div>
    </div>
  );

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: tabs + matching action ───────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.send.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">{t.send.desc}</p>
          </div>

          <div className="inline-flex flex-wrap gap-1 rounded-lg border border-border bg-surface p-1">
            {tabBtn("core", "@pollar/core")}
            {tabBtn("react", "@pollar/react")}
            {tabBtn("scan", t.send.scan.tabLabel)}
          </div>

          <p className="text-sm text-muted">
            {tab === "react"
              ? t.send.reactDesc
              : tab === "scan"
                ? t.send.scan.desc
                : t.send.coreDesc}
          </p>

          {tab === "react" && (
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
          )}

          {tab === "core" && (
            <div className="space-y-4">
              {paymentFields}

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
                  <code className="text-foreground">{"runTx('payment')"}</code>
                </p>
              </div>

              <FnReference
                title={t.send.coreFnsTitle}
                intro={t.send.coreFnsIntro}
                fns={t.send.coreFns}
              />
              <CoreClientNote />
            </div>
          )}

          {tab === "scan" && (
            <div className="space-y-4">
              {/* the scanner stays mounted so you can re-scan any time */}
              <Sep7Scanner labels={t.send.scan} onScan={handleScan} />

              {scanned && (
                <div className="space-y-4">
                  {/* what the QR carried, beyond the editable fields */}
                  <div className="rounded-lg border border-border bg-surface px-4 py-3 space-y-1.5">
                    <p className="text-xs font-medium text-foreground">
                      {t.send.scan.detectedTitle}
                    </p>
                    {memo && (
                      <p className="text-xs font-mono text-muted">
                        <span className="text-muted-light">
                          {t.send.scan.memoLabel}:
                        </span>{" "}
                        {memo}{" "}
                        <span className="text-muted-light">
                          ({memoType || "MEMO_TEXT"})
                        </span>
                      </p>
                    )}
                    {scanned.msg && (
                      <p className="text-xs font-mono text-muted">
                        <span className="text-muted-light">
                          {t.send.scan.msgLabel}:
                        </span>{" "}
                        {scanned.msg}
                      </p>
                    )}
                    {scanned.originDomain && (
                      <p className="text-xs font-mono text-muted">
                        <span className="text-muted-light">
                          {t.send.scan.originLabel}:
                        </span>{" "}
                        {scanned.originDomain}
                        {scanned.signature
                          ? ` · ${t.send.scan.signaturePresent}`
                          : ""}
                      </p>
                    )}
                    {memo && !memoSupported && (
                      <p className="text-xs font-mono text-warning">
                        {t.send.scan.memoUnsupported}
                      </p>
                    )}
                  </div>

                  <p className="text-xs text-muted-light">
                    {t.send.scan.editHint}
                  </p>

                  {paymentFields}

                  <div className="space-y-2 pt-1">
                    {coreError && (
                      <p className="text-xs font-mono text-error">
                        {coreError}
                      </p>
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
                          : t.send.scan.pay}
                    </button>
                    <p className="text-xs font-mono text-muted-light">
                      <code className="text-foreground">{"parseSep7()"}</code> →{" "}
                      <code className="text-foreground">
                        {"runTx('payment')"}
                      </code>
                    </p>
                  </div>
                </div>
              )}
            </div>
          )}
        </div>

        {/* ── right: matching code panel + tx state ──────────────────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          {tab === "react" && (
            <CodePanel
              sdk="@pollar/react"
              note="hooks & components"
              code={REACT_CODE}
            />
          )}

          {tab === "core" && (
            <CodePanel
              sdk="@pollar/core"
              note="framework-agnostic"
              code={coreSnippet(destination, selectedAsset, amount)}
            />
          )}

          {tab === "scan" && (
            <CodePanel
              sdk="@cosmosapp/pay_sdk + @pollar/react"
              note="SEP-7 → runTx"
              code={scanSnippet(destination, selectedAsset, amount, memo)}
            />
          )}

          {/* transaction state (driven by runTx) — core + scan tabs */}
          {showTxState && (
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
