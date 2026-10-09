"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// 0. providers enabled from the dashboard (Integrations → Cards).
//    Empty = hide the card UI. Each one says what it supports and
//    the first platform step the user still owes it, if any.
const [provider] = await client.getCardProviders();

// 1. the platform's steps before the provider's own onboarding
//    (KYC, forms, registry checks, registration), like a ramp route
const reqs = await client.getCardRequirements({ cardProviderId: provider.id });
// reqs.next → { type: 'KYC' | 'FORM' | 'REGISTRY_CHECK' | 'PROVIDER_REGISTRATION', optionId, ... }
// complete them with resolveKyc(..., cardProviderId), submitRequirementForm,
// submitRegistryCheck and submitCardProviderRegistration(provider.id)

// 2. the user's registration with the provider and its KYC state
const holder = await client.getCardHolder();
// holder.kycStatus → NOT_STARTED | NEEDS_ACTION | APPROVED | ...
// holder.verificationLink → open it so the user finishes at the provider

// 3. issue a virtual card once the provider approved the KYC
const card = await client.issueCard({ nickname: 'Everyday card' });

// 4. balance (USD cents) and movements
const balance = await client.getCardBalance();
const { transactions } = await client.getCardTransactions({ limit: 10 });

// 5. fund the card from the user's Stellar wallet (USDC over CCTP)
const funding = await client.fundCard({ amount: '10' });
// funding.status → CREATED → BURNED → ATTESTED → MINTED → CREDITED

// 6. the full number and CVC, decrypted on this device only
const secrets = await client.revealCardSecrets(card.id);`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function CardButton() {
  const { openCardModal, isAuthenticated } = usePollar();

  // openCardModal renders the whole flow: the platform's steps,
  // the provider sign-up and KYC, the card, its activity, funding
  // and the end-to-end encrypted reveal of the number.
  return (
    <button
      onClick={openCardModal}
      disabled={!isAuthenticated}
    >
      Get a card
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function CardsPage() {
  const { t } = useI18n();
  const { openCardModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t.cards.title}
        </h1>
        <p className="text-sm text-muted mt-1.5">{t.cards.desc}</p>
      </div>

      {/* Providers and their requirement steps come from the dashboard and the
          Pollar admin; the SDK reads them at runtime via getCardProviders() and
          getCardRequirements(). */}
      <div className="rounded-2xl border border-border bg-surface p-5 space-y-3">
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t.cards.providersTitle}
          </p>
          <p className="text-sm text-muted mt-1 leading-relaxed">
            {t.cards.providersBody}
          </p>
        </div>
        <pre className="overflow-x-auto rounded-lg border border-border bg-background p-3 text-xs font-mono text-muted-light">
          {`GET /v2/cards/providers →
{
  "content": {
    "providers": [{
      "id": "…", "name": "Coral Finance", "adapter": "CORAL",
      "cardTypes": ["VIRTUAL"], "fundingAssets": ["USDC"],
      "supports": { "revealSecrets": true, "freeze": false },
      "requirement": { "type": "KYC", "optionId": "…", "status": "none" },
      "available": true
    }]
  },
  "code": "SDK_CARDS_PROVIDERS",
  "success": true
}`}
        </pre>
      </div>

      <SdkModalTab
        isAuthenticated={isAuthenticated}
        onOpen={openCardModal}
        openLabel={t.cards.open}
        connectLabel={t.common.connectWalletFirst}
        modalCall="openCardModal()"
        modalNote={t.cards.note}
        reactDesc={t.cards.reactDesc}
        coreDesc={t.cards.coreDesc}
        coreCode={CORE_CODE}
        reactCode={REACT_CODE}
        core={{
          title: t.cards.coreFnsTitle,
          intro: t.cards.coreFnsIntro,
          fns: t.cards.coreFns,
        }}
        react={{
          title: t.cards.reactFnsTitle,
          intro: t.cards.reactFnsIntro,
          fns: t.cards.reactFns,
        }}
      />
    </div>
  );
}
