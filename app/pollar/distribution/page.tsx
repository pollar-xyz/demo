"use client";

import { usePollar } from "@pollar/react";
import { SdkModalTab } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

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
  const { t } = useI18n();
  const { openDistributionRulesModal, isAuthenticated } = usePollar();

  return (
    <div className="w-full max-w-5xl">
      <SdkModalTab
        title={t.distribution.title}
        desc={t.distribution.desc}
        isAuthenticated={isAuthenticated}
        onOpen={openDistributionRulesModal}
        openLabel={t.distribution.open}
        connectLabel={t.common.connectWalletFirst}
        modalCall="openDistributionRulesModal()"
        modalNote={t.distribution.note}
        reactDesc={t.distribution.reactDesc}
        coreDesc={t.distribution.coreDesc}
        coreCode={CORE_CODE}
        reactCode={REACT_CODE}
        core={{
          title: t.distribution.coreFnsTitle,
          intro: t.distribution.coreFnsIntro,
          fns: t.distribution.coreFns,
        }}
        react={{
          title: t.distribution.reactFnsTitle,
          intro: t.distribution.reactFnsIntro,
          fns: t.distribution.reactFns,
        }}
      />
    </div>
  );
}
