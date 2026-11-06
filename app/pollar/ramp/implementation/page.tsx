"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient, rampQuoteFields } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// 1. quote every route between the fiat and the asset, best first
const { quotes } = await client.quoteRamp({
  direction: 'ONRAMP',
  fiat: { currency: 'MXN', rail: 'SPEI', country: 'MX' },
  asset: { code: 'USDC', identifier: null, chain: 'STELLAR' },
  amount: { value: '100', denomination: 'in' },
});

// 2. turn the chosen quote into an order; payee answers rampQuoteFields(quote)
const order = await client.createRampOrder({ quoteId: quotes[0].quoteId, payee });
// order.pendingAction: FIAT_PAYMENT | SIGNATURE | COSIGN_APPROVAL | KYC

// 3. poll until it settles
const done = await client.pollRampOrder(order.id, { onUpdate: render });`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function BuyCryptoButton() {
  const { openRampModal, isAuthenticated } = usePollar();

  // openRampModal renders the whole quote-and-payment flow on top
  // of client.quoteRamp / createRampOrder / pollRampOrder.
  return (
    <button
      onClick={openRampModal}
      disabled={!isAuthenticated}
    >
      Buy / sell crypto
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function RampPage() {
  const { t } = useI18n();
  const { openRampModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t.ramp.title}
        </h1>
        <p className="text-sm text-muted mt-1.5">{t.ramp.desc}</p>
      </div>

      <SdkModalTab
        isAuthenticated={isAuthenticated}
        onOpen={openRampModal}
        openLabel={t.ramp.open}
        connectLabel={t.common.connectWalletFirst}
        modalCall="openRampModal()"
        modalNote={t.ramp.note}
        reactDesc={t.ramp.reactDesc}
        coreDesc={t.ramp.coreDesc}
        coreCode={CORE_CODE}
        reactCode={REACT_CODE}
        core={{
          title: t.ramp.coreFnsTitle,
          intro: t.ramp.coreFnsIntro,
          fns: t.ramp.coreFns,
        }}
        react={{
          title: t.ramp.reactFnsTitle,
          intro: t.ramp.reactFnsIntro,
          fns: t.ramp.reactFns,
        }}
      />
    </div>
  );
}
