"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "../_components/SdkDocs";
import { useI18n } from "../_i18n/LanguageProvider";

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
      <SdkModalTab
        title={t.send.title}
        desc={t.send.desc}
        isAuthenticated={isAuthenticated}
        onOpen={openSendModal}
        openLabel={t.send.open}
        connectLabel={t.common.connectWalletFirst}
        modalCall="openSendModal()"
        modalNote={t.send.note}
        reactDesc={t.send.reactDesc}
        coreDesc={t.send.coreDesc}
        coreCode={CORE_CODE}
        reactCode={REACT_CODE}
        core={{
          title: t.send.coreFnsTitle,
          intro: t.send.coreFnsIntro,
          fns: t.send.coreFns,
        }}
        react={{
          title: t.send.reactFnsTitle,
          intro: t.send.reactFnsIntro,
          fns: t.send.reactFns,
        }}
      />
    </div>
  );
}
