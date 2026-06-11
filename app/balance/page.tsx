'use client';

import { usePollar } from '@pollar/react';
import { useState } from 'react';
import { DualCode } from '../_components/CodePanels';

// ─── shared styles ────────────────────────────────────────────────────────────

const inp = 'w-full rounded border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-zinc-400 placeholder:text-zinc-400';
const btn = (variant: 'primary' | 'secondary') =>
  variant === 'primary'
    ? 'rounded bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors'
    : 'rounded border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 disabled:opacity-40 transition-colors';

// ─── page ─────────────────────────────────────────────────────────────────────

export default function BalancePage() {
  const { walletBalance, refreshWalletBalance, getClient, walletAddress, isAuthenticated } = usePollar();

  const [ publicKey, setPublicKey ] = useState('');
  const [ lastError, setLastError ] = useState<string | null>(null);
  const [ inFlight, setInFlight ] = useState(false);

  // ── actions ─────────────────────────────────────────────────────────────────
  async function fetchOwnWallet() {
    setLastError(null);
    setInFlight(true);
    try {
      await refreshWalletBalance();
    } catch (e) {
      setLastError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setInFlight(false);
    }
  }

  async function fetchByPublicKey() {
    setLastError(null);
    setInFlight(true);
    try {
      // for an arbitrary address, drop down to the underlying client.
      // (refreshWalletBalance() always targets the connected wallet.)
      await getClient().refreshBalance(publicKey.trim());
    } catch (e) {
      setLastError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setInFlight(false);
    }
  }

  // ── derived ─────────────────────────────────────────────────────────────────
  const trimmedKey = publicKey.trim();
  const usingCustomKey = trimmedKey.length > 0;
  const balances = walletBalance.step === 'loaded' ? walletBalance.data.balances : null;
  const stateMessage =
    walletBalance.step === 'idle' ? 'Submit a request to load balances.' :
    walletBalance.step === 'loading' ? 'Loading…' :
    walletBalance.step === 'error' ? walletBalance.message :
    null;

  // ── live code previews ──────────────────────────────────────────────────────
  const coreCode = usingCustomKey
    ? `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// fetch any account by public key
await client.refreshBalance('${trimmedKey || 'G...'}');

// then read the reactive state
const state = client.getWalletBalanceState();
if (state.step === 'loaded') {
  state.data.balances.forEach(b => {
    console.log(b.code, b.balance);
  });
}`
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

  const reactCode = usingCustomKey
    ? `import { usePollar } from '@pollar/react';

const { walletBalance, getClient } = usePollar();

// for an arbitrary address, drop down to the underlying client
await getClient().refreshBalance('${trimmedKey || 'G...'}');

// then read the reactive state
if (walletBalance.step === 'loaded') {
  walletBalance.data.balances.forEach(b => {
    console.log(b.code, b.balance);
  });
}`
    : `import { usePollar } from '@pollar/react';

const { walletBalance, refreshWalletBalance } = usePollar();

// fetch the connected wallet's balances
await refreshWalletBalance();

// then read the reactive state
if (walletBalance.step === 'loaded') {
  walletBalance.data.balances.forEach(b => {
    console.log(b.code, b.balance);
  });
}`;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── left: form + result ───────────────────────────────────────── */}
        <div className="space-y-5">
          <div>
            <h1 className="text-sm font-semibold">Balance</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Read Stellar balances reactively from <code className="font-mono">walletBalance</code>.
              Use <code className="font-mono">refreshWalletBalance()</code> for the connected wallet,
              or <code className="font-mono">getClient().refreshBalance(pk)</code> for any address.
            </p>
          </div>

          {/* lookup any address */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400">Look up any address</label>
            <div className="flex gap-2">
              <input
                className={inp}
                value={publicKey}
                onChange={e => setPublicKey(e.target.value)}
                placeholder="G..."
                spellCheck={false}
              />
              <button
                onClick={fetchByPublicKey}
                disabled={inFlight || !usingCustomKey}
                className={`${btn('primary')} shrink-0`}
              >
                {inFlight && usingCustomKey ? 'Loading…' : 'Fetch'}
              </button>
            </div>
          </div>

          {/* own wallet shortcut */}
          {isAuthenticated && (
            <div className="space-y-1">
              <button
                onClick={fetchOwnWallet}
                disabled={inFlight}
                className={btn('secondary')}
              >
                {inFlight && !usingCustomKey ? 'Loading…' : 'Use my wallet'}
              </button>
              {walletAddress && (
                <p className="text-[10px] font-mono text-zinc-400 truncate">{walletAddress}</p>
              )}
            </div>
          )}

          {/* error from our wrapper */}
          {lastError && (
            <p className="text-xs font-mono text-red-500">{lastError}</p>
          )}

          {/* reactive state */}
          <div className="rounded-lg border border-zinc-200 dark:border-zinc-800 overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-zinc-200 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
              <span className="text-xs font-mono text-zinc-400">walletBalance.step</span>
              <span
                className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                  walletBalance.step === 'idle' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-400' :
                  walletBalance.step === 'loading' ? 'bg-zinc-100 dark:bg-zinc-800 text-zinc-500 animate-pulse' :
                  walletBalance.step === 'loaded' ? 'bg-green-50 dark:bg-green-950 text-green-600 dark:text-green-400' :
                  'bg-red-50 dark:bg-red-950 text-red-600 dark:text-red-400'
                }`}
              >
                {walletBalance.step}
              </span>
            </div>

            {stateMessage && (
              <p className="px-4 py-3 text-xs font-mono text-zinc-400">{stateMessage}</p>
            )}

            {balances && balances.length === 0 && (
              <p className="px-4 py-3 text-xs font-mono text-zinc-400">No balances found.</p>
            )}

            {balances && balances.length > 0 && (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-zinc-100 dark:border-zinc-800 bg-zinc-50 dark:bg-zinc-900/60">
                    <th className="text-left px-4 py-2 text-zinc-400 font-medium">Asset</th>
                    <th className="text-right px-4 py-2 text-zinc-400 font-medium">Balance</th>
                    <th className="text-right px-4 py-2 text-zinc-400 font-medium">Available</th>
                  </tr>
                </thead>
                <tbody>
                  {balances.map((b, i) => (
                    <tr key={i} className="border-b border-zinc-100 dark:border-zinc-800 last:border-0">
                      <td className="px-4 py-2.5 text-zinc-700 dark:text-zinc-300">
                        {b.type === 'native' ? 'XLM' : b.code}
                        {'issuer' in b && b.issuer && (
                          <span className="block text-[10px] text-zinc-400 truncate max-w-40">{b.issuer}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-zinc-700 dark:text-zinc-300">{b.balance}</td>
                      <td className="px-4 py-2.5 text-right text-zinc-400">{b.available}</td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>
        </div>

        {/* ── right: live code previews (core + react) ──────────────────── */}
        <div className="lg:sticky lg:top-6">
          <DualCode core={coreCode} react={reactCode} />
        </div>

      </div>
    </div>
  );
}
