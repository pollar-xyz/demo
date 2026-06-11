'use client';

import { usePollar } from '@pollar/react';
import { DualCode } from '../_components/CodePanels';

// ─── styles (shared with other demo pages) ────────────────────────────────────

const btn = 'rounded bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors';

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// The receiving address is the connected wallet's public key.
const auth = client.getAuthState();
const address =
  auth.step === 'authenticated'
    ? auth.session.wallet?.publicKey
    : null;

// render \`address\` as text + a QR code however your platform does.`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function ReceiveButton() {
  const { openReceiveModal, isAuthenticated } = usePollar();

  // openReceiveModal reads walletAddress from context and
  // renders the address + QR for you.
  return (
    <button
      onClick={openReceiveModal}
      disabled={!isAuthenticated}
    >
      Receive
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ReceivePage() {
  const { openReceiveModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── left: action ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-sm font-semibold">Receive</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Show the connected wallet&apos;s address and QR code so others can send
              funds to it. Pollar renders the whole view inside a modal.
            </p>
          </div>

          <button
            onClick={openReceiveModal}
            disabled={!isAuthenticated}
            className={`${btn} w-full sm:w-auto`}
          >
            {isAuthenticated ? 'Open Receive modal' : 'Connect wallet first'}
          </button>

          <p className="text-xs font-mono text-zinc-400">
            <code className="text-zinc-700 dark:text-zinc-300">openReceiveModal()</code>
            {' '}takes no arguments — it reads the connected wallet address from context.
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
