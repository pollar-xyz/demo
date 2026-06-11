'use client';

import { usePollar } from '@pollar/react';
import { DualCode } from '../_components/CodePanels';

// ─── styles (shared with other demo pages) ────────────────────────────────────

const btn = 'rounded bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors';

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// "Send" is a payment operation: build → sign → submit in one call.
const res = await client.runTx('payment', {
  destination: 'G...',
  asset: 'native',   // or 'CODE:ISSUER'
  amount: '10',
});
// res.status: 'success' | 'pending' | 'error'
// res.hash`;

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

// ─── page ─────────────────────────────────────────────────────────────────────

export default function SendPage() {
  const { openSendModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── left: action ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-sm font-semibold">Send</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Transfer assets to another Stellar address. Pollar renders the
              asset picker, amount input, review and signing flow inside a modal.
            </p>
          </div>

          <button
            onClick={openSendModal}
            disabled={!isAuthenticated}
            className={`${btn} w-full sm:w-auto`}
          >
            {isAuthenticated ? 'Open Send modal' : 'Connect wallet first'}
          </button>

          <p className="text-xs font-mono text-zinc-400">
            <code className="text-zinc-700 dark:text-zinc-300">openSendModal()</code>
            {' '}takes no arguments — asset, amount and destination are picked inside the modal.
          </p>
        </div>

        {/* ── right: code previews (core + react) ──────────────────────── */}
        <div className="lg:sticky lg:top-6">
          <DualCode core={CORE_CODE} react={REACT_CODE} />
        </div>

      </div>
    </div>
  );
}
