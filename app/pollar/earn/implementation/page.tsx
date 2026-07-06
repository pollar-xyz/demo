"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// 0. providers enabled from the dashboard (Treasury → Earn),
//    intersected with server capability — Blend needs a pool
//    address, DeFindex needs an API key. Empty = hide Earn UI.
const providers = await client.getEarnProviders();

// 1. list the vaults (DeFindex) / pools (Blend) with live APY
const opportunities = await client.getEarnOpportunities('defindex');
const best = opportunities[0]; // { id, name, kind, asset, apy, … }

// 2. read the connected wallet's position in that opportunity
const position = await client.getEarnPosition({
  provider: 'defindex',
  opportunity: best.id,
});
// position.withdrawUnit → 'shares' (DeFindex) | 'asset' (Blend)

// 3. deposit the underlying asset (signs + submits the built XDR)
await client.earnDeposit({
  provider: 'defindex',
  opportunity: best.id,
  amount: '100',
});

// 4. withdraw — amount is in position.withdrawUnit
await client.earnWithdraw({
  provider: 'defindex',
  opportunity: best.id,
  amount: position.withdrawable,
});`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function EarnButton() {
  const { openEarnModal, isAuthenticated } = usePollar();

  // openEarnModal renders the whole provider → opportunity →
  // deposit / withdraw flow on top of client.earnDeposit /
  // earnWithdraw (build + sign + submit handled for you).
  return (
    <button
      onClick={openEarnModal}
      disabled={!isAuthenticated}
    >
      Earn yield
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function EarnPage() {
  const { t } = useI18n();
  const { openEarnModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t.earn.title}
        </h1>
        <p className="text-sm text-muted mt-1.5">{t.earn.desc}</p>
      </div>

      {/* Providers come from the operator's dashboard, read at runtime via
          getEarnProviders() (SDK_EARN_PROVIDERS) — a provider only appears
          once it's server-capable (Blend: pool address, DeFindex: API key). */}
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t.earn.providersTitle}
          </p>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            {t.earn.providersBody}
          </p>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 text-xs font-mono text-muted-light">
          {`GET /earn/providers →
{
  "content": { "providers": ["blend", "defindex"] },
  "code": "SDK_EARN_PROVIDERS",
  "success": true
}`}
        </pre>
      </div>

      <SdkModalTab
        isAuthenticated={isAuthenticated}
        onOpen={openEarnModal}
        openLabel={t.earn.open}
        connectLabel={t.common.connectWalletFirst}
        modalCall="openEarnModal()"
        modalNote={t.earn.note}
        reactDesc={t.earn.reactDesc}
        coreDesc={t.earn.coreDesc}
        coreCode={CORE_CODE}
        reactCode={REACT_CODE}
        core={{
          title: t.earn.coreFnsTitle,
          intro: t.earn.coreFnsIntro,
          fns: t.earn.coreFns,
        }}
        react={{
          title: t.earn.reactFnsTitle,
          intro: t.earn.reactFnsIntro,
          fns: t.earn.reactFns,
        }}
      />
    </div>
  );
}
