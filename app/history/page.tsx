"use client";

import { usePollar } from "@pollar/react";
import { DualCode } from "../_components/CodePanels";
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
  const { openTxHistoryModal, txHistory, isAuthenticated } = usePollar();

  const recordCount =
    txHistory.step === "loaded" ? (txHistory.data.records?.length ?? 0) : null;

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: action ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.history.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">
              {t.history.descPre}
              <code className="font-mono">usePollar().txHistory</code>
              {t.history.descPost}
            </p>
          </div>

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
        </div>

        {/* ── right: code previews (core + react) + live state ─────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <DualCode core={CORE_CODE} react={REACT_CODE} />

          {/* live txHistory state */}
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
        </div>
      </div>
    </div>
  );
}
