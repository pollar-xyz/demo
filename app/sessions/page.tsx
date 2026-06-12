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
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: action ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.sessions.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">{t.sessions.desc}</p>
          </div>

          <button
            onClick={openSessionsModal}
            disabled={!isAuthenticated}
            className={`${btn} w-full sm:w-auto`}
          >
            {isAuthenticated ? t.sessions.open : t.common.connectWalletFirst}
          </button>

          <p className="text-xs font-mono text-muted-light">
            <code className="text-foreground">openSessionsModal()</code>{" "}
            {t.sessions.note}
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
