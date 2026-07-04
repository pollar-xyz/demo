"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// social / OAuth — opens the hosted popup, resolves the session
client.login({ provider: 'google' });
client.login({ provider: 'github' });

// email OTP — a three-step flow
client.beginEmailLogin();
client.sendEmailCode('user@example.com');
client.verifyEmailCode('123456');

// passkey / smart wallet (WebAuthn)
client.createSmartWallet(); // first-time user — registers a passkey
client.loginSmartWallet();  // returning user — signs in with it

// an external wallet adapter logs in by its type
client.login({ provider: 'freighter' });

// drive your own UI off the auth state machine
const off = client.onAuthStateChange((s) => {
  // 'idle' | 'creating_session' | 'opening_oauth' |
  // 'authenticating' | 'authenticated' | 'error' | ...
  console.log(s.step);
});`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function LoginButton() {
  const { openLoginModal, login, isAuthenticated } = usePollar();

  if (isAuthenticated) return null;

  // openLoginModal renders every provider you configured (social, email,
  // wallet adapters) in Pollar's prebuilt modal — no UI to build.
  return (
    <>
      <button onClick={openLoginModal}>Sign in</button>

      {/* …or skip the modal and enter one provider directly */}
      <button onClick={() => login({ provider: 'google' })}>
        Continue with Google
      </button>
    </>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function LoginPage() {
  const { t } = useI18n();
  const { openLoginModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl">
      <SdkModalTab
        title={t.login.title}
        desc={t.login.desc}
        isAuthenticated={isAuthenticated}
        guestAction
        onOpen={openLoginModal}
        openLabel={t.login.open}
        connectLabel={t.login.alreadyIn}
        disabledLabel={t.login.alreadyIn}
        modalCall="openLoginModal()"
        modalNote={t.login.note}
        reactDesc={t.login.reactDesc}
        coreDesc={t.login.coreDesc}
        coreCode={CORE_CODE}
        reactCode={REACT_CODE}
        core={{
          title: t.login.coreFnsTitle,
          intro: t.login.coreFnsIntro,
          fns: t.login.coreFns,
        }}
        react={{
          title: t.login.reactFnsTitle,
          intro: t.login.reactFnsIntro,
          fns: t.login.reactFns,
        }}
      />
    </div>
  );
}
