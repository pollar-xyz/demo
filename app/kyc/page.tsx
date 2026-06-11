'use client';

import { usePollar, KycStatus } from '@pollar/react';
import type { KycStatus as KycStatusValue, KycLevel } from '@pollar/core';
import { useState } from 'react';
import { DualCode } from '../_components/CodePanels';

// ─── shared styles ────────────────────────────────────────────────────────────

const inp = 'w-full rounded border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-zinc-400 placeholder:text-zinc-400';
const lbl = 'block text-xs font-mono text-zinc-500 dark:text-zinc-400 mb-1';
const btn = 'rounded bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors';

const LEVELS: KycLevel[] = [ 'basic', 'intermediate', 'enhanced' ];

// ─── page ─────────────────────────────────────────────────────────────────────

export default function KycPage() {
  const { openKycModal, isAuthenticated } = usePollar();

  const [ status, setStatus ] = useState<KycStatusValue>('none');
  const [ country, setCountry ] = useState('MX');
  const [ level, setLevel ] = useState<KycLevel>('basic');

  function handleStart() {
    openKycModal({
      country,
      level,
      onApproved: () => setStatus('approved'),
    });
  }

  // ── live code previews ──────────────────────────────────────────────────────
  const coreCode = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// 1. list providers for a country
const { providers } = await client.getKycProviders('${country || 'MX'}');

// 2. start verification with a provider
const session = await client.startKyc({
  providerId: providers[0].id,
  level: '${level}',
});

// 3. poll until resolved
const status = await client.pollKycStatus(providers[0].id);
// status: 'none' | 'pending' | 'approved' | 'rejected'`;

  const reactCode = `import { usePollar, KycStatus } from '@pollar/react';

const { openKycModal } = usePollar();

// openKycModal wraps getKycProviders / startKyc / pollKycStatus.
openKycModal({
  country: '${country || 'MX'}',
  level: '${level}',
  onApproved: () => {
    // unlock features for verified users
  },
});

// elsewhere — render the badge:
<KycStatus status={kycStatus} />`;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── left: form ─────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div>
            <h1 className="text-sm font-semibold">KYC</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Verify the user&apos;s identity. Pollar renders the entire provider-selection
              and verification flow inside a modal.
            </p>
          </div>

          <div>
            <label className={lbl}>Country (ISO 3166-1 alpha-2)</label>
            <input
              className={inp}
              value={country}
              onChange={e => setCountry(e.target.value.toUpperCase().slice(0, 2))}
              placeholder="MX"
              maxLength={2}
              spellCheck={false}
            />
          </div>

          <div>
            <label className={lbl}>Level</label>
            <div className="flex gap-2 flex-wrap">
              {LEVELS.map(l => (
                <button
                  key={l}
                  type="button"
                  onClick={() => setLevel(l)}
                  className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                    level === l
                      ? 'bg-zinc-900 dark:bg-zinc-50 border-zinc-900 dark:border-zinc-50 text-white dark:text-zinc-900 font-medium'
                      : 'border-zinc-200 dark:border-zinc-700 text-zinc-600 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800'
                  }`}
                >
                  {l}
                </button>
              ))}
            </div>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs font-mono text-zinc-400">current status</span>
            <KycStatus status={status} />
          </div>

          <button
            onClick={handleStart}
            disabled={!isAuthenticated || !country}
            className={`${btn} w-full sm:w-auto`}
          >
            {isAuthenticated ? 'Start KYC' : 'Connect wallet first'}
          </button>
        </div>

        {/* ── right: live code previews (core + react) ──────────────────── */}
        <div className="lg:sticky lg:top-6">
          <DualCode core={coreCode} react={reactCode} />
        </div>

      </div>
    </div>
  );
}
