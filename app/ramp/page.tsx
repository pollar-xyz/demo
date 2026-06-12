"use client";

import { usePollar } from "@pollar/react";
import { DualCode } from "../_components/CodePanels";
import { ComingSoon } from "../_components/ComingSoon";
import { useI18n } from "../_i18n/LanguageProvider";

// ─── styles (shared with other demo pages) ────────────────────────────────────

const btn =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";

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
      {/* header stays readable above the coming-soon blur */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t.ramp.title}
        </h1>
        <p className="text-sm text-muted mt-1.5">{t.ramp.desc}</p>
      </div>

      <ComingSoon>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── left: action ─────────────────────────────────────────────── */}
          <div className="space-y-4">
            <button
              onClick={openRampModal}
              disabled={!isAuthenticated}
              className={`${btn} w-full sm:w-auto`}
            >
              {isAuthenticated ? t.ramp.open : t.common.connectWalletFirst}
            </button>

            <p className="text-xs font-mono text-muted-light">
              <code className="text-foreground">openRampModal()</code>{" "}
              {t.ramp.note}
            </p>
          </div>

          {/* ── right: code previews (core + react) ──────────────────────── */}
          <div className="lg:sticky lg:top-6">
            <DualCode core={CORE_CODE} react={REACT_CODE} />
          </div>
        </div>
      </ComingSoon>
    </div>
  );
}
