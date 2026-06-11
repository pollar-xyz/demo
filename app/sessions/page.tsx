'use client';

import { usePollar } from '@pollar/react';
import { DualCode } from '../_components/CodePanels';

// ─── styles (shared with other demo pages) ────────────────────────────────────

const btn = 'rounded bg-zinc-900 dark:bg-zinc-50 px-4 py-2 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors';

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
  const { openSessionsModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── left: action ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-sm font-semibold">Sessions</h1>
            <p className="text-xs text-zinc-500 mt-1">
              Review the active sessions for the signed-in user, revoke a single
              device, or sign out everywhere. Pollar renders the list and actions
              inside a modal.
            </p>
          </div>

          <button
            onClick={openSessionsModal}
            disabled={!isAuthenticated}
            className={`${btn} w-full sm:w-auto`}
          >
            {isAuthenticated ? 'Open Sessions modal' : 'Connect wallet first'}
          </button>

          <p className="text-xs font-mono text-zinc-400">
            <code className="text-zinc-700 dark:text-zinc-300">openSessionsModal()</code>
            {' '}takes no arguments — it lists the current user&apos;s sessions and handles revocation.
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
