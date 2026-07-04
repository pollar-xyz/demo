"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// revoke this device's session server-side + clear local storage
await client.logout();

// sign out of every device for this user
await client.logout({ everywhere: true });

// convenience alias for the line above
await client.logoutEverywhere();`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function LogoutButton() {
  const { logout, isAuthenticated } = usePollar();

  // logout() revokes the current session and clears local state;
  // usePollar()'s isAuthenticated flips to false and the UI re-renders.
  return (
    <button onClick={logout} disabled={!isAuthenticated}>
      Sign out
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function LogoutPage() {
  const { t } = useI18n();
  const { logout, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl">
      <SdkModalTab
        title={t.logout.title}
        desc={t.logout.desc}
        isAuthenticated={isAuthenticated}
        onOpen={logout}
        openLabel={t.logout.open}
        connectLabel={t.logout.alreadyOut}
        disabledLabel={t.logout.alreadyOut}
        modalCall="logout()"
        modalNote={t.logout.note}
        reactDesc={t.logout.reactDesc}
        coreDesc={t.logout.coreDesc}
        coreCode={CORE_CODE}
        reactCode={REACT_CODE}
        core={{
          title: t.logout.coreFnsTitle,
          intro: t.logout.coreFnsIntro,
          fns: t.logout.coreFns,
        }}
        react={{
          title: t.logout.reactFnsTitle,
          intro: t.logout.reactFnsIntro,
          fns: t.logout.reactFns,
        }}
      />
    </div>
  );
}
