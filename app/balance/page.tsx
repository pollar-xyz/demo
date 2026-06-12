'use client';

import { usePollar } from '@pollar/react';
import { useState } from 'react';
import { DualCode } from '../_components/CodePanels';
import { useI18n } from '../_i18n/LanguageProvider';

// ─── shared styles ────────────────────────────────────────────────────────────

const inp = 'w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light';
const btn = (variant: 'primary' | 'secondary') =>
  variant === 'primary'
    ? 'rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors'
    : 'rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors';

// ─── page ─────────────────────────────────────────────────────────────────────

export default function BalancePage() {
  const { t } = useI18n();
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
      setLastError(e instanceof Error ? e.message : t.common.unknownError);
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
      setLastError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setInFlight(false);
    }
  }

  // ── derived ─────────────────────────────────────────────────────────────────
  const trimmedKey = publicKey.trim();
  const usingCustomKey = trimmedKey.length > 0;
  const balances = walletBalance.step === 'loaded' ? walletBalance.data.balances : null;
  const stateMessage =
    walletBalance.step === 'idle' ? t.balance.idle :
    walletBalance.step === 'loading' ? t.common.loading :
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
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">{t.balance.title}</h1>
            <p className="text-sm text-muted mt-1.5">
              {t.balance.desc1}<code className="font-mono">walletBalance</code>
              {t.balance.desc2}<code className="font-mono">refreshWalletBalance()</code>
              {t.balance.desc3}<code className="font-mono">getClient().refreshBalance(pk)</code>
              {t.balance.desc4}
            </p>
          </div>

          {/* lookup any address */}
          <div className="space-y-2">
            <label className="block text-xs font-mono text-muted">{t.balance.lookupLabel}</label>
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
                {inFlight && usingCustomKey ? t.common.loading : t.balance.fetch}
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
                {inFlight && !usingCustomKey ? t.common.loading : t.balance.useMyWallet}
              </button>
              {walletAddress && (
                <p className="text-[10px] font-mono text-muted-light truncate">{walletAddress}</p>
              )}
            </div>
          )}

          {/* error from our wrapper */}
          {lastError && (
            <p className="text-xs font-mono text-error">{lastError}</p>
          )}

          {/* reactive state */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
              <span className="text-xs font-mono text-muted-light">walletBalance.step</span>
              <span
                className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                  walletBalance.step === 'idle' ? 'bg-surface text-muted-light' :
                  walletBalance.step === 'loading' ? 'bg-surface text-muted animate-pulse' :
                  walletBalance.step === 'loaded' ? 'bg-success-light text-success' :
                  'bg-error-light text-error'
                }`}
              >
                {walletBalance.step}
              </span>
            </div>

            {stateMessage && (
              <p className="px-4 py-3 text-xs font-mono text-muted-light">{stateMessage}</p>
            )}

            {balances && balances.length === 0 && (
              <p className="px-4 py-3 text-xs font-mono text-muted-light">{t.balance.noBalances}</p>
            )}

            {balances && balances.length > 0 && (
              <table className="w-full text-xs font-mono">
                <thead>
                  <tr className="border-b border-border bg-surface">
                    <th className="text-left px-4 py-2 text-muted-light font-medium">{t.balance.assetCol}</th>
                    <th className="text-right px-4 py-2 text-muted-light font-medium">{t.balance.balanceCol}</th>
                    <th className="text-right px-4 py-2 text-muted-light font-medium">{t.balance.availableCol}</th>
                  </tr>
                </thead>
                <tbody>
                  {balances.map((b, i) => (
                    <tr key={i} className="border-b border-border last:border-0">
                      <td className="px-4 py-2.5 text-foreground">
                        {b.type === 'native' ? 'XLM' : b.code}
                        {'issuer' in b && b.issuer && (
                          <span className="block text-[10px] text-muted-light truncate max-w-40">{b.issuer}</span>
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right text-foreground">{b.balance}</td>
                      <td className="px-4 py-2.5 text-right text-muted-light">{b.available}</td>
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
