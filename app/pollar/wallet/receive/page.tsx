"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// The receiving address is the connected wallet's public key.
const auth = client.getAuthState();
const address =
  auth.step === 'authenticated'
    ? auth.session.wallet?.publicKey
    : null;

// render \`address\` as text + a QR code however your platform does.`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function ReceiveButton() {
  const { openReceiveModal, isAuthenticated } = usePollar();

  // openReceiveModal reads the wallet address from context and
  // renders the address + QR for you.
  return (
    <button
      onClick={openReceiveModal}
      disabled={!isAuthenticated}
    >
      Receive
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function ReceivePage() {
  const { t } = useI18n();
  const { openReceiveModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl">
      <SdkModalTab
        title={t.receive.title}
        desc={t.receive.desc}
        isAuthenticated={isAuthenticated}
        onOpen={openReceiveModal}
        openLabel={t.receive.open}
        connectLabel={t.common.connectWalletFirst}
        modalCall="openReceiveModal()"
        modalNote={t.receive.note}
        reactDesc={t.receive.reactDesc}
        coreDesc={t.receive.coreDesc}
        coreCode={CORE_CODE}
        reactCode={REACT_CODE}
        core={{
          title: t.receive.coreFnsTitle,
          intro: t.receive.coreFnsIntro,
          fns: t.receive.coreFns,
        }}
        react={{
          title: t.receive.reactFnsTitle,
          intro: t.receive.reactFnsIntro,
          fns: t.receive.reactFns,
        }}
      />
    </div>
  );
}
