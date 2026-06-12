"use client";

import { usePollar } from "@pollar/react";
import { DualCode } from "../_components/CodePanels";
import { useI18n } from "../_i18n/LanguageProvider";

// ─── styles (shared with other demo pages) ────────────────────────────────────

const btn =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// "Send" is a payment operation: build → sign → submit in one call.
const res = await client.runTx('payment', {
  destination: 'G...',
  asset: 'native',   // or 'CODE:ISSUER'
  amount: '10',
});
// res.status: 'success' | 'pending' | 'error'
// res.hash`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function SendButton() {
  const { openSendModal, isAuthenticated } = usePollar();

  // openSendModal renders the asset picker, amount, review
  // and signing flow — built on top of client.runTx('payment').
  return (
    <button
      onClick={openSendModal}
      disabled={!isAuthenticated}
    >
      Send
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function SendPage() {
  const { t } = useI18n();
  const { openSendModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: action ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.send.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">{t.send.desc}</p>
          </div>

          <button
            onClick={openSendModal}
            disabled={!isAuthenticated}
            className={`${btn} w-full sm:w-auto`}
          >
            {isAuthenticated ? t.send.open : t.common.connectWalletFirst}
          </button>

          <p className="text-xs font-mono text-muted-light">
            <code className="text-foreground">openSendModal()</code>{" "}
            {t.send.note}
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
