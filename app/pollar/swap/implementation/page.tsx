"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// 0. venues enabled from the dashboard (Treasury → Swap).
//    SDK_SWAP_CONFIG → e.g. ['aquarius', 'sdex']; empty = hide swap UI.
const venues = await client.getSwapConfig();

// 1. quote — routes ranked by output, best first (empty = no route)
const quotes = await client.getSwapQuote({
  sellAsset: { type: 'native' },
  buyAsset: { type: 'credit_alphanum4', code: 'USDC', issuer: 'GA5Z…' },
  amount: '100',
  provider: 'auto',   // best of aquarius / soroswap / sdex
  slippageBps: 50,    // 0.5% — sets the on-chain minReceived
});

// 2. execute the best route (adds the buy-asset trustline if needed)
if (quotes.length) {
  const outcome = await client.swap(quotes[0]);
  // outcome.hash — follow progress via onTransactionStateChange
}`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function SwapButton() {
  const { openSwapModal, isAuthenticated } = usePollar();

  // openSwapModal renders the whole quote → swap flow on top of
  // client.getSwapQuote / client.swap (trustline handled for you).
  return (
    <button
      onClick={openSwapModal}
      disabled={!isAuthenticated}
    >
      Swap tokens
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function SwapPage() {
  const { t } = useI18n();
  const { openSwapModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t.swap.title}
        </h1>
        <p className="text-sm text-muted mt-1.5">{t.swap.desc}</p>
      </div>

      {/* Venues come from the operator's dashboard, read at runtime via
          getSwapConfig() (SDK_SWAP_CONFIG) — Soroswap is now one of these
          venues rather than a separate tab. */}
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t.swap.venuesTitle}
          </p>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            {t.swap.venuesBody}
          </p>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 text-xs font-mono text-muted-light">
          {`GET /swap/config →
{
  "content": { "venues": ["aquarius", "sdex"] },
  "code": "SDK_SWAP_CONFIG",
  "success": true
}`}
        </pre>
      </div>

      <SdkModalTab
        isAuthenticated={isAuthenticated}
        onOpen={openSwapModal}
        openLabel={t.swap.open}
        connectLabel={t.common.connectWalletFirst}
        modalCall="openSwapModal()"
        modalNote={t.swap.note}
        reactDesc={t.swap.reactDesc}
        coreDesc={t.swap.coreDesc}
        coreCode={CORE_CODE}
        reactCode={REACT_CODE}
        core={{
          title: t.swap.coreFnsTitle,
          intro: t.swap.coreFnsIntro,
          fns: t.swap.coreFns,
        }}
        react={{
          title: t.swap.reactFnsTitle,
          intro: t.swap.reactFnsIntro,
          fns: t.swap.reactFns,
        }}
      />
    </div>
  );
}
