'use client';

import { usePollar } from '@pollar/react';
import { DualCode } from '../_components/CodePanels';

// ─── styles (shared with other demo pages) ────────────────────────────────────

const btn = 'rounded bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors';

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
  const { openTxHistoryModal, txHistory, isAuthenticated } = usePollar();

  const recordCount =
    txHistory.step === 'loaded' ? txHistory.data.records?.length ?? 0 : null;

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── left: action ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-sm font-semibold">History</h1>
            <p className="text-xs text-zinc-500 mt-1">
              List the connected wallet&apos;s past transactions with pagination.
              Pollar renders the list inside a modal, and also exposes the loading
              state through <code className="font-mono">usePollar().txHistory</code>.
            </p>
          </div>

          <button
            onClick={openTxHistoryModal}
            disabled={!isAuthenticated}
            className={`${btn} w-full sm:w-auto`}
          >
            {isAuthenticated ? 'Open History modal' : 'Connect wallet first'}
          </button>

          <p className="text-xs font-mono text-zinc-400">
            <code className="text-zinc-700 dark:text-zinc-300">openTxHistoryModal()</code>
            {' '}takes no arguments — pagination is handled inside the modal.
          </p>
        </div>

        {/* ── right: code previews (core + react) + live state ─────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <DualCode core={CORE_CODE} react={REACT_CODE} />

          {/* live txHistory state */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
              <span className="text-xs font-mono text-zinc-400">txHistory.step</span>
              <span
                className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                  txHistory.step === 'idle' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' :
                  txHistory.step === 'loading' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 animate-pulse' :
                  txHistory.step === 'loaded' ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400' :
                  'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
                }`}
              >
                {txHistory.step}
              </span>
            </div>
            <div className="p-4 text-xs font-mono bg-white dark:bg-zinc-950 min-h-12">
              {txHistory.step === 'idle' && (
                <p className="text-zinc-400">Open the modal to load history.</p>
              )}
              {txHistory.step === 'loading' && (
                <p className="text-zinc-400">Loading…</p>
              )}
              {txHistory.step === 'loaded' && (
                <p className="text-zinc-600 dark:text-zinc-300">
                  {recordCount} record{recordCount === 1 ? '' : 's'} loaded.
                </p>
              )}
              {txHistory.step === 'error' && (
                <p className="text-red-500">{txHistory.message}</p>
              )}
            </div>
          </div>
        </div>

      </div>
    </div>
  );
}
