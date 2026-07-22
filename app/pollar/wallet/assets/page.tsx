"use client";

import { usePollar } from "@pollar/react";
import { useState } from "react";
import { CodePanel, DualCode } from "@/app/_components/CodePanels";
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
  skipSponsorship: boolean,
): string {
  const shortAsset = `{ code: "${code.trim() || "USDC"}", issuer: "${
    issuer.trim() || "G..."
  }" }`;
  const asset = `{ type: "${type}", code: "${code.trim() || "USDC"}", issuer: "${
    issuer.trim() || "G..."
  }" }`;
  // Both opts are optional, so an empty object is worth omitting entirely.
  const opts = [
    limit.trim() ? `limit: "${limit.trim()}"` : "",
    skipSponsorship ? "skipSponsorship: true" : "",
  ].filter(Boolean);
  const enableOpts = opts.length ? `, { ${opts.join(", ")} }` : "";
  const caller = sdk === "react" ? "" : "client.";

  const header =
    sdk === "react"
      ? `import { usePollar } from '@pollar/react';

const { setTrustline, refreshAssets } = usePollar();`
      : `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();`;

  return `${header}

// Sponsorship is decided server-side from the app's dashboard
// config. ${
    skipSponsorship
      ? "skipSponsorship forces the user's own wallet to pay."
      : "Omit skipSponsorship and the app pays when eligible."
  }
await ${caller}setTrustline(${shortAsset}${enableOpts});

// disable — limit "0" removes it (the asset balance must be 0)
await ${caller}setTrustline(${shortAsset}, { limit: '0'${
    skipSponsorship ? ", skipSponsorship: true" : ""
  } });

// setTrustline does not refresh on its own
await ${caller}refreshAssets();

// The manual escape hatch, always self-paid — this is what
// setTrustline falls back to when skipSponsorship is set:
// await ${caller}runTx('change_trust', { asset: ${asset} });`;
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AssetsPage() {
  const { t } = useI18n();
  const {
    enabledAssets,
    refreshAssets,
    openEnabledAssetsModal,
    setTrustline,
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
  // Off by default so the demo shows the sponsored path first — the app pays.
  const [ctSkipSponsorship, setCtSkipSponsorship] = useState(false);
  // tracks which button is mid-flight so only it shows the spinner label.
  const [ctMode, setCtMode] = useState<"enable" | "disable" | null>(null);
  // key (`code:issuer`) of the row whose toggle is in flight, mirroring the modal.
  const [rowBusy, setRowBusy] = useState<string | null>(null);

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

  // setTrustline picks the route by wallet type — custodial goes straight to the
  // server, an external wallet gets an XDR back to co-sign — and each endpoint
  // sponsors or self-pays according to the app's config. Omitting `limit` adds
  // the trustline; "0" removes it. Ticking skipSponsorship opts out of the
  // sponsoring endpoints entirely and falls back to a plain self-paid
  // change_trust via runTx, which is also the only route a custom asset has.
  async function manageTrust(mode: "enable" | "disable") {
    setCtError(null);
    setCtMode(mode);
    const limit = mode === "disable" ? "0" : ctLimit.trim();
    try {
      const outcome = await setTrustline(
        { code: ctCode.trim(), issuer: ctIssuer.trim() },
        {
          ...(limit ? { limit } : {}),
          ...(ctSkipSponsorship ? { skipSponsorship: true } : {}),
        },
      );
      // setTrustline never refreshes on its own, so trustlineEstablished in the
      // table above would otherwise keep showing the pre-call state.
      if (outcome.status === "error") {
        setCtError(outcome.details ?? t.common.unknownError);
      } else {
        await refreshAssets();
      }
    } catch (e) {
      setCtError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setCtMode(null);
    }
  }

  // The same call, driven from a row instead of the form — this is exactly what
  // the prebuilt modal's per-asset toggle does.
  async function toggleRow(code: string, issuer: string, established: boolean) {
    const key = `${code}:${issuer}`;
    setLastError(null);
    setRowBusy(key);
    try {
      const outcome = await setTrustline(
        { code, issuer },
        {
          ...(established ? { limit: "0" } : {}),
          ...(ctSkipSponsorship ? { skipSponsorship: true } : {}),
        },
      );
      if (outcome.status === "error") {
        setLastError(outcome.details ?? t.common.unknownError);
      } else {
        await refreshAssets();
      }
    } catch (e) {
      setLastError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setRowBusy(null);
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
                        {/* the app's own label for the asset, when it set one */}
                        {a.name && (
                          <span className="ml-1.5 text-[10px] text-muted-light">
                            {a.name}
                          </span>
                        )}
                        {a.issuer && (
                          <span className="block text-[10px] text-muted-light truncate max-w-40">
                            {a.issuer}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-muted-light">
                        {a.type}
                        {/* Stellar-only: whether the app covers reserve + fee */}
                        {a.sponsored && (
                          <span className="ml-1.5 rounded bg-primary/10 px-1.5 py-0.5 text-[10px] text-primary">
                            {t.assets.sponsoredTag}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right">
                        <div className="flex items-center justify-end gap-2">
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
                          {/* Native XLM needs no trustline, so it gets no toggle. */}
                          {a.type !== "native" && a.issuer && (
                            <button
                              onClick={() =>
                                toggleRow(
                                  a.code,
                                  a.issuer as string,
                                  !!a.trustlineEstablished,
                                )
                              }
                              disabled={!isAuthenticated || rowBusy !== null}
                              className={`${btn("secondary")} shrink-0`}
                            >
                              {rowBusy === `${a.code}:${a.issuer}`
                                ? t.common.loading
                                : a.trustlineEstablished
                                  ? t.assets.trust.disable
                                  : t.assets.trust.enable}
                            </button>
                          )}
                        </div>
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

            {/* who pays — the opt-out that replaced the old `sponsored` flag */}
            <div className="rounded-lg border border-border bg-surface px-3 py-2.5">
              <label className="flex items-start gap-2 cursor-pointer">
                <input
                  type="checkbox"
                  checked={ctSkipSponsorship}
                  onChange={(e) => setCtSkipSponsorship(e.target.checked)}
                  className="mt-0.5 accent-primary"
                />
                <span>
                  <span className="block text-xs font-mono text-foreground">
                    skipSponsorship
                  </span>
                  <span className="block text-xs text-muted mt-0.5">
                    {ctSkipSponsorship
                      ? t.assets.trust.selfPayOn
                      : t.assets.trust.selfPayOff}
                  </span>
                </span>
              </label>
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
              core={trustSnippet(
                "core",
                ctType,
                ctCode,
                ctIssuer,
                ctLimit,
                ctSkipSponsorship,
              )}
              react={trustSnippet(
                "react",
                ctType,
                ctCode,
                ctIssuer,
                ctLimit,
                ctSkipSponsorship,
              )}
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

                {/* The sponsored endpoints submit server-side and never touch
                    the tx machine — only the self-pay fallback runs through it. */}
                <p className="text-[10px] font-mono text-muted-light">
                  {t.assets.trust.txNote}
                </p>

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
