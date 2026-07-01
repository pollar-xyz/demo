"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// 1. quote
const quote = await client.getRampsQuote({
  direction: 'onramp',
  amount: '100',
  fiatCurrency: 'MXN',
  country: 'MX',
});

// 2. create the ramp from a chosen quote
const onramp = await client.createOnRamp({ /* quote selection */ });
// onramp.content.paymentInstructions, onramp.content.id

// 3. poll until it settles
const status = await client.pollRampTransaction(onramp.content.id);`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function BuyCryptoButton() {
  const { openRampModal, isAuthenticated } = usePollar();

  // openRampModal renders the whole quote-and-payment flow on top
  // of client.getRampsQuote / createOnRamp / pollRampTransaction.
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
