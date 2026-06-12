'use client';

import { usePollar } from '@pollar/react';
import { DualCode } from '../_components/CodePanels';

// ─── styles (shared with other demo pages) ────────────────────────────────────

const btn = 'rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors';

// ─── code previews ────────────────────────────────────────────────────────────

const CORE_CODE = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// rules the user is eligible for
const rules = await client.listDistributionRules();
// rule.id, rule.period, rule.amount, ...

// claim one
const result = await client.claimDistributionRule({
  ruleId: rules[0].id,
});`;

const REACT_CODE = `import { usePollar } from '@pollar/react';

export function DistributionButton() {
  const { openDistributionRulesModal, isAuthenticated } = usePollar();

  // openDistributionRulesModal renders the rule list + claim
  // buttons on top of client.listDistributionRules / claimDistributionRule.
  return (
    <button
      onClick={openDistributionRulesModal}
      disabled={!isAuthenticated}
    >
      Distribution rules
    </button>
  );
}`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function DistributionPage() {
  const { openDistributionRulesModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── left: action ───────────────────────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Distribution</h1>
            <p className="text-sm text-muted mt-1.5">
              List the distribution rules the user is eligible for and claim their
              share. Pollar renders the rule list and claim actions inside a modal.
            </p>
          </div>

          <button
            onClick={openDistributionRulesModal}
            disabled={!isAuthenticated}
            className={`${btn} w-full sm:w-auto`}
          >
            {isAuthenticated ? 'Open Distribution modal' : 'Connect wallet first'}
          </button>

          <p className="text-xs font-mono text-muted-light">
            <code className="text-foreground">openDistributionRulesModal()</code>
            {' '}takes no arguments — it loads the user&apos;s rules and handles claiming.
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
