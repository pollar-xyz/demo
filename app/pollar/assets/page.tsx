"use client";

import { usePollar } from "@pollar/react";
import { useState } from "react";
import { CodePanel, DualCode } from "@/app/_components/CodePanels";
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

// trustlines only apply to issued assets — native XLM is implicit.
const TRUST_TYPES = ["credit_alphanum4", "credit_alphanum12"] as const;
type TrustType = (typeof TRUST_TYPES)[number];

// ─── code previews ──────────────────────────────────────────────────────────
// @pollar/react is the prebuilt modal; @pollar/core is the manual refresh whose
// reactive enabledAssets state we render. Both resolve the wallet + network
// from the session — neither takes arguments.

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function AssetsButton() {
  const { openEnabledAssetsModal, isAuthenticated } = usePollar();

  // openEnabledAssetsModal lists every dashboard-enabled asset and
  // whether the connected wallet has a trustline — on top of refreshAssets().
  return (
    <button
      onClick={openEnabledAssetsModal}
      disabled={!isAuthenticated}
    >
      Enabled assets
    </button>
  );
}`;

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// fetch the app's enabled assets + the wallet's trustline state
// (wallet and network come from the session — no arguments)
await client.refreshAssets();

// then read the reactive state
const state = client.getEnabledAssetsState();
if (state.step === 'loaded') {
  state.data.assets.forEach(a => {
    console.log(a.code, a.trustlineEstablished);
  });
}`;

// Live change_trust example reflecting the form inputs. A trustline is just a
// change_trust operation: a (positive) limit adds it, limit "0" removes it.
function trustSnippet(
  sdk: Sdk,
  type: TrustType,
  code: string,
  issuer: string,
  limit: string,
): string {
  const asset = `{ type: "${type}", code: "${code.trim() || "USDC"}", issuer: "${
    issuer.trim() || "G..."
  }" }`;
  const enableLimit = limit.trim() ? `, limit: "${limit.trim()}"` : "";

  if (sdk === "react") {
    return `import { usePollar } from '@pollar/react';

const { runTx, refreshAssets } = usePollar();
const asset = ${asset};

// enable — add the trustline (omit limit for the max, or cap it)
await runTx('change_trust', { asset${enableLimit} });

// disable — send "0" to remove it (the asset balance must be 0)
await runTx('change_trust', { asset, limit: '0' });

await refreshAssets(); // refresh trustlineEstablished below`;
  }

  return `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();
const asset = ${asset};

// enable — build → sign → submit in one call
await client.runTx('change_trust', { asset${enableLimit} });

// disable — limit "0" removes the trustline (balance must be 0)
await client.runTx('change_trust', { asset, limit: '0' });

await client.refreshAssets();`;
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AssetsPage() {
  const { t } = useI18n();
  const {
    enabledAssets,
    refreshAssets,
    openEnabledAssetsModal,
    runTx,
    tx,
    openTxModal,
    wallet,
    isAuthenticated,
  } = usePollar();
  const walletAddress = wallet?.address ?? "";

  const [sdk, setSdk] = useState<Sdk>("react");
  const [lastError, setLastError] = useState<string | null>(null);
  const [inFlight, setInFlight] = useState(false);

  // ── change_trust form ─────────────────────────────────────────────────────
  const [ctType, setCtType] = useState<TrustType>("credit_alphanum4");
  const [ctCode, setCtCode] = useState("");
  const [ctIssuer, setCtIssuer] = useState("");
  const [ctLimit, setCtLimit] = useState("");
  const [ctError, setCtError] = useState<string | null>(null);
  // tracks which button is mid-flight so only it shows the spinner label.
  const [ctMode, setCtMode] = useState<"enable" | "disable" | null>(null);

  // ── actions ─────────────────────────────────────────────────────────────────
  async function fetchAssets() {
    setLastError(null);
    setInFlight(true);
    try {
      // drives the reactive enabledAssets state — same source the modal reads.
      await refreshAssets();
    } catch (e) {
      setLastError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setInFlight(false);
    }
  }

  // change_trust: a positive (or omitted) limit enables the trustline; limit
  // "0" removes it. runTx builds → signs → submits in one call and drives the
  // reactive `tx` state below.
  async function manageTrust(mode: "enable" | "disable") {
    setCtError(null);
    setCtMode(mode);
    const limit = mode === "disable" ? "0" : ctLimit.trim();
    const params = {
      asset: { type: ctType, code: ctCode.trim(), issuer: ctIssuer.trim() },
      ...(limit ? { limit } : {}),
    };
    try {
      const outcome = await runTx("change_trust", params as never);
      // refresh the table so trustlineEstablished reflects the new state.
      if (outcome.status === "success" || outcome.status === "pending") {
        await refreshAssets();
      } else if (outcome.status === "error") {
        setCtError(outcome.details ?? t.common.unknownError);
      }
    } catch (e) {
      setCtError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setCtMode(null);
    }
  }

  // ── derived ─────────────────────────────────────────────────────────────────
  const step = enabledAssets.step;
  const assets =
    enabledAssets.step === "loaded" ? enabledAssets.data.assets : null;
  const rawData = enabledAssets.step === "loaded" ? enabledAssets.data : null;
  const stateMessage =
    step === "idle"
      ? t.assets.idle
      : step === "loading"
        ? t.common.loading
        : step === "error"
          ? enabledAssets.message
          : null;

  const trustReady = ctCode.trim().length > 0 && ctIssuer.trim().length > 0;
  const txBusy =
    tx.step === "building" ||
    tx.step === "signing" ||
    tx.step === "signing-submitting" ||
    tx.step === "submitting" ||
    tx.step === "building-signing-submitting";

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl space-y-10">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: toggle + matching action ─────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.assets.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">{t.assets.desc}</p>
          </div>

          <SdkToggle value={sdk} onChange={setSdk} />

          {/* what the selected SDK does */}
          <p className="text-sm text-muted">
            {sdk === "react" ? t.assets.reactDesc : t.assets.coreDesc}
          </p>

          {sdk === "react" ? (
            <div className="space-y-1">
              <button
                onClick={openEnabledAssetsModal}
                disabled={!isAuthenticated}
                className={`${btn("primary")} w-full sm:w-auto`}
              >
                {isAuthenticated ? t.assets.open : t.common.connectWalletFirst}
              </button>
              <p className="text-xs font-mono text-muted-light">
                <code className="text-foreground">
                  openEnabledAssetsModal()
                </code>{" "}
                {t.assets.modalNote}
              </p>

              <FnReference
                title={t.assets.reactFnsTitle}
                intro={t.assets.reactFnsIntro}
                fns={t.assets.reactFns}
              />
            </div>
          ) : (
            <div className="space-y-3">
              <div className="space-y-1">
                <button
                  onClick={fetchAssets}
                  disabled={inFlight || !isAuthenticated}
                  className={`${btn("primary")} w-full sm:w-auto`}
                >
                  {!isAuthenticated
                    ? t.common.connectWalletFirst
                    : inFlight
                      ? t.common.loading
                      : t.assets.refresh}
                </button>
                {walletAddress && (
                  <p className="text-[10px] font-mono text-muted-light truncate">
                    {walletAddress}
                  </p>
                )}
              </div>

              <p className="text-xs font-mono text-muted-light">
                <code className="text-foreground">refreshAssets()</code>{" "}
                {t.assets.coreNote}
              </p>

              <FnReference
                title={t.assets.coreFnsTitle}
                intro={t.assets.coreFnsIntro}
                fns={t.assets.coreFns}
              />
            </div>
          )}
        </div>

        {/* ── right: matching code panel + live state + raw response ───────── */}
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

          {/* live state + rendered table */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
              <span className="text-xs font-mono text-muted-light">
                enabledAssets.step
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

            {stateMessage && (
              <p className="px-4 py-3 text-xs font-mono text-muted-light">
                {stateMessage}
              </p>
            )}

            {lastError && step !== "error" && (
              <p className="px-4 py-3 text-xs font-mono text-error">
                {lastError}
              </p>
            )}

            {assets && assets.length === 0 && (
              <p className="px-4 py-3 text-xs font-mono text-muted-light">
                {t.assets.noAssets}
              </p>
            )}

            {assets && assets.length > 0 && (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-2 text-muted-light font-medium">
                      {t.assets.assetCol}
                    </th>
                    <th className="text-left px-4 py-2 text-muted-light font-medium">
                      {t.assets.typeCol}
                    </th>
                    <th className="text-right px-4 py-2 text-muted-light font-medium">
                      {t.assets.trustlineCol}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {assets.map((a, i) => (
                    <tr
                      key={i}
                      className="border-b border-border last:border-0"
                    >
                      <td className="px-4 py-2.5 text-foreground">
                        {a.type === "native" ? "XLM" : a.code}
                        {a.issuer && (
                          <span className="block text-[10px] text-muted-light truncate max-w-40">
                            {a.issuer}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-muted-light">{a.type}</td>
                      <td className="px-4 py-2.5 text-right">
                        <span
                          className={`rounded px-1.5 py-0.5 text-[10px] ${
                            a.trustlineEstablished
                              ? "bg-success-light text-success"
                              : "bg-surface text-muted-light"
                          }`}
                        >
                          {a.trustlineEstablished
                            ? t.assets.established
                            : t.assets.missing}
                        </span>
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
                  {t.assets.rawResponse}
                </span>
                <span className="text-xs font-mono text-muted-light">
                  enabledAssets.data
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre leading-relaxed max-h-80 overflow-y-auto">
                {JSON.stringify(rawData, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>

      {/* ── enable / disable a trustline (change_trust) ──────────────────────── */}
      <div className="border-t border-border pt-8">
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* left: docs + form */}
          <div className="space-y-4">
            <div>
              <h2 className="text-lg sm:text-xl font-bold tracking-tight text-foreground">
                {t.assets.trust.title}
              </h2>
              <p className="text-sm text-muted mt-1.5">{t.assets.trust.desc}</p>
            </div>

            {/* asset type */}
            <div>
              <label className={lbl}>{t.assets.trust.typeLabel}</label>
              <div className="flex gap-2 flex-wrap">
                {TRUST_TYPES.map((tt) => (
                  <button
                    key={tt}
                    type="button"
                    onClick={() => setCtType(tt)}
                    className={`${btn(ctType === tt ? "primary" : "secondary")} text-xs`}
                  >
                    {tt}
                  </button>
                ))}
              </div>
            </div>

            {/* code */}
            <div>
              <label className={lbl}>{t.assets.trust.codeLabel} *</label>
              <input
                className={inp}
                value={ctCode}
                onChange={(e) => setCtCode(e.target.value)}
                placeholder={t.assets.trust.codePh}
                spellCheck={false}
              />
            </div>

            {/* issuer */}
            <div>
              <label className={lbl}>{t.assets.trust.issuerLabel} *</label>
              <input
                className={inp}
                value={ctIssuer}
                onChange={(e) => setCtIssuer(e.target.value)}
                placeholder={t.assets.trust.issuerPh}
                spellCheck={false}
              />
            </div>

            {/* limit */}
            <div>
              <label className={lbl}>
                {t.assets.trust.limitLabel}{" "}
                <span className="ml-1 text-muted-light">
                  {t.common.optional}
                </span>
              </label>
              <input
                className={inp}
                value={ctLimit}
                onChange={(e) => setCtLimit(e.target.value)}
                placeholder={t.assets.trust.limitPh}
                spellCheck={false}
              />
              <p className="text-xs text-muted-light mt-0.5">
                {t.assets.trust.limitNote}
              </p>
            </div>

            {/* actions */}
            <div className="space-y-2 pt-1">
              {ctError && (
                <p className="text-xs font-mono text-error">{ctError}</p>
              )}
              <div className="flex flex-wrap gap-2">
                <button
                  onClick={() => manageTrust("enable")}
                  disabled={!isAuthenticated || !trustReady || txBusy}
                  className={`${btn("primary")} w-full sm:w-auto`}
                >
                  {!isAuthenticated
                    ? t.common.connectWalletFirst
                    : ctMode === "enable" && txBusy
                      ? t.assets.trust.running
                      : t.assets.trust.enable}
                </button>
                <button
                  onClick={() => manageTrust("disable")}
                  disabled={!isAuthenticated || !trustReady || txBusy}
                  className={`${btn("secondary")} w-full sm:w-auto`}
                >
                  {ctMode === "disable" && txBusy
                    ? t.assets.trust.running
                    : t.assets.trust.disable}
                </button>
              </div>
              <p className="text-[10px] font-mono text-muted-light">
                {t.assets.trust.removedNote}
              </p>
            </div>

            <FnReference
              title={t.assets.trust.fnsTitle}
              intro={t.assets.trust.fnsIntro}
              fns={t.assets.trust.fns}
            />
          </div>

          {/* right: live code example + tx state */}
          <div className="lg:sticky lg:top-6 space-y-4">
            <DualCode
              core={trustSnippet("core", ctType, ctCode, ctIssuer, ctLimit)}
              react={trustSnippet("react", ctType, ctCode, ctIssuer, ctLimit)}
            />

            {/* transaction state (driven by runTx) */}
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
                    {t.assets.trust.stateIdle}
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
          </div>
        </div>
      </div>
    </div>
  );
}
