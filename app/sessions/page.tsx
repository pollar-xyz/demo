"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "../_components/SdkDocs";
import { useI18n } from "../_i18n/LanguageProvider";

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// one entry per device / refresh-token family
const sessions = await client.listSessions();
// session.familyId, session.deviceLabel, session.current, ...

// revoke a single device
await client.revokeSession(sessions[0].familyId);

// or sign out everywhere
await client.logoutEverywhere();`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function SessionsButton() {
  const { openSessionsModal, isAuthenticated } = usePollar();

  // openSessionsModal renders the list + revoke / sign-out-everywhere
  // actions on top of client.listSessions / revokeSession.
  return (
    <button
      onClick={openSessionsModal}
      disabled={!isAuthenticated}
    >
      Manage sessions
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function SessionsPage() {
  const { t } = useI18n();
  const { openSessionsModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl">
      <SdkModalTab
        title={t.sessions.title}
        desc={t.sessions.desc}
        isAuthenticated={isAuthenticated}
        onOpen={openSessionsModal}
        openLabel={t.sessions.open}
        connectLabel={t.common.connectWalletFirst}
        modalCall="openSessionsModal()"
        modalNote={t.sessions.note}
        reactDesc={t.sessions.reactDesc}
        coreDesc={t.sessions.coreDesc}
        coreCode={CORE_CODE}
        reactCode={REACT_CODE}
        core={{
          title: t.sessions.coreFnsTitle,
          intro: t.sessions.coreFnsIntro,
          fns: t.sessions.coreFns,
        }}
        react={{
          title: t.sessions.reactFnsTitle,
          intro: t.sessions.reactFnsIntro,
          fns: t.sessions.reactFns,
        }}
      />
    </div>
  );
}
