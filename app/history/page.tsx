"use client";

import { usePollar } from "@pollar/react";
import { useState } from "react";
import { CodePanel } from "../_components/CodePanels";
import { FnReference, SdkToggle, type Sdk } from "../_components/SdkDocs";
import { useI18n } from "../_i18n/LanguageProvider";

// ─── styles (shared with other demo pages) ────────────────────────────────────

const btn =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// imperative fetch
await client.fetchTxHistory({ limit: 20 });
const state = client.getTxHistoryState();
if (state.step === 'loaded') {
  console.log(state.data.records);
}

// …or subscribe to updates
const unsubscribe = client.onTxHistoryStateChange((s) => {
  // s.step: 'idle' | 'loading' | 'loaded' | 'error'
});`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function HistoryButton() {
  const { openTxHistoryModal, txHistory, isAuthenticated } = usePollar();

  // txHistory mirrors client.getTxHistoryState():
  //   'idle' | 'loading' | 'loaded' | 'error'
  // when loaded, txHistory.data.records holds the rows.

  return (
    <button
      onClick={openTxHistoryModal}
      disabled={!isAuthenticated}
    >
      Transaction history
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function HistoryPage() {
  const { t } = useI18n();
  const { openTxHistoryModal, getClient, txHistory, isAuthenticated } =
    usePollar();
  const [sdk, setSdk] = useState<Sdk>("react");

  const recordCount =
    txHistory.step === "loaded" ? (txHistory.data.records?.length ?? 0) : null;

  async function fetchCore() {
    // imperative fetch via the underlying client — drives the same
    // reactive txHistory state the react hook reads.
    await getClient().fetchTxHistory({ limit: 20 });
  }

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: toggle + matching action ─────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.history.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">{t.history.desc}</p>
          </div>

          <SdkToggle value={sdk} onChange={setSdk} />

          {/* what the selected SDK does */}
          <p className="text-sm text-muted">
            {sdk === "react" ? t.history.reactDesc : t.history.coreDesc}
          </p>

          {sdk === "react" ? (
            <div className="space-y-1">
              <button
                onClick={openTxHistoryModal}
                disabled={!isAuthenticated}
                className={`${btn} w-full sm:w-auto`}
              >
                {isAuthenticated ? t.history.open : t.common.connectWalletFirst}
              </button>
              <p className="text-xs font-mono text-muted-light">
                <code className="text-foreground">openTxHistoryModal()</code>{" "}
                {t.history.note}
              </p>

              <FnReference
                title={t.history.reactFnsTitle}
                intro={t.history.reactFnsIntro}
                fns={t.history.reactFns}
              />
            </div>
          ) : (
            <div className="space-y-1">
              <button
                onClick={fetchCore}
                disabled={!isAuthenticated || txHistory.step === "loading"}
                className={`${btn} w-full sm:w-auto`}
              >
                {isAuthenticated
                  ? t.history.coreOpen
                  : t.common.connectWalletFirst}
              </button>
              <p className="text-xs font-mono text-muted-light">
                <code className="text-foreground">fetchTxHistory()</code>{" "}
                {t.history.coreNote}
              </p>

              <FnReference
                title={t.history.coreFnsTitle}
                intro={t.history.coreFnsIntro}
                fns={t.history.coreFns}
              />
            </div>
          )}
        </div>

        {/* ── right: matching code panel + live state ──────────────────── */}
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

          {/* live txHistory state — both paths drive it */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface">
              <span className="text-xs font-mono text-muted-light">
                txHistory.step
              </span>
              <span
                className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                  txHistory.step === "idle"
                    ? "bg-surface text-muted-light"
                    : txHistory.step === "loading"
                      ? "bg-surface text-muted animate-pulse"
                      : txHistory.step === "loaded"
                        ? "bg-success-light text-success"
                        : "bg-error-light text-error"
                }`}
              >
                {txHistory.step}
              </span>
            </div>
            <div className="p-4 text-xs font-mono bg-background min-h-12">
              {txHistory.step === "idle" && (
                <p className="text-muted-light">{t.history.idle}</p>
              )}
              {txHistory.step === "loading" && (
                <p className="text-muted-light">{t.common.loading}</p>
              )}
              {txHistory.step === "loaded" && (
                <p className="text-muted">
                  {t.history.recordsLoaded(recordCount ?? 0)}
                </p>
              )}
              {txHistory.step === "error" && (
                <p className="text-error">{txHistory.message}</p>
              )}
            </div>
          </div>

          {/* raw response — how the data actually arrives from the API */}
          {txHistory.step === "loaded" && (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="flex items-center gap-2 px-4 py-2.5 border-b border-border bg-surface">
                <span className="text-xs font-mono text-muted-light">
                  {t.history.rawResponse}
                </span>
                <span className="text-xs font-mono text-muted-light">
                  txHistory.data
                </span>
              </div>
              <pre className="p-4 text-xs font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre leading-relaxed max-h-80 overflow-y-auto">
                {JSON.stringify(txHistory.data, null, 2)}
              </pre>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}
