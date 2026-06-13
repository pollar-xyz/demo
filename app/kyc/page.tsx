"use client";

import { usePollar, KycStatus } from "@pollar/react";
import type { KycStatus as KycStatusValue, KycLevel } from "@pollar/core";
import { useState } from "react";
import { DualCode } from "../_components/CodePanels";
import { ComingSoon } from "../_components/ComingSoon";
import { FnReference } from "../_components/SdkDocs";
import { useI18n } from "../_i18n/LanguageProvider";

// ─── shared styles ────────────────────────────────────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const lbl = "block text-xs font-mono text-muted mb-1";
const btn =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";

const LEVELS: KycLevel[] = ["basic", "intermediate", "enhanced"];

// ─── page ─────────────────────────────────────────────────────────────────────

export default function KycPage() {
  const { t } = useI18n();
  const { openKycModal, isAuthenticated } = usePollar();

  const [status, setStatus] = useState<KycStatusValue>("none");
  const [country, setCountry] = useState("MX");
  const [level, setLevel] = useState<KycLevel>("basic");

  function handleStart() {
    openKycModal({
      country,
      level,
      onApproved: () => setStatus("approved"),
    });
  }

  // ── live code previews ──────────────────────────────────────────────────────
  const coreCode = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// 1. list providers for a country
const { providers } = await client.getKycProviders('${country || "MX"}');

// 2. start verification with a provider
const session = await client.startKyc({
  providerId: providers[0].id,
  level: '${level}',
});

// 3. poll until resolved
const status = await client.pollKycStatus(providers[0].id);
// status: 'none' | 'pending' | 'approved' | 'rejected'`;

  const reactCode = `import { usePollar, KycStatus } from '@pollar/react';

const { openKycModal } = usePollar();

// openKycModal wraps getKycProviders / startKyc / pollKycStatus.
openKycModal({
  country: '${country || "MX"}',
  level: '${level}',
  onApproved: () => {
    // unlock features for verified users
  },
});

// elsewhere — render the badge:
<KycStatus status={kycStatus} />`;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl space-y-5">
      {/* header stays readable above the coming-soon blur */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t.kyc.title}
        </h1>
        <p className="text-sm text-muted mt-1.5">{t.kyc.desc}</p>
      </div>

      <ComingSoon>
        <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
          {/* ── left: form ─────────────────────────────────────────────────── */}
          <div className="space-y-5">
            <div>
              <label className={lbl}>{t.kyc.countryLabel}</label>
              <input
                className={inp}
                value={country}
                onChange={(e) =>
                  setCountry(e.target.value.toUpperCase().slice(0, 2))
                }
                placeholder="MX"
                maxLength={2}
                spellCheck={false}
              />
            </div>

            <div>
              <label className={lbl}>{t.kyc.levelLabel}</label>
              <div className="flex gap-2 flex-wrap">
                {LEVELS.map((l) => (
                  <button
                    key={l}
                    type="button"
                    onClick={() => setLevel(l)}
                    className={`text-xs px-3 py-1.5 rounded border transition-colors ${
                      level === l
                        ? "bg-primary border-primary text-white font-medium"
                        : "border-border text-muted hover:bg-surface"
                    }`}
                  >
                    {l}
                  </button>
                ))}
              </div>
            </div>

            <div className="flex items-center gap-3 pt-1">
              <span className="text-xs font-mono text-muted-light">
                {t.kyc.currentStatus}
              </span>
              <KycStatus status={status} />
            </div>

            <button
              onClick={handleStart}
              disabled={!isAuthenticated || !country}
              className={`${btn} w-full sm:w-auto`}
            >
              {isAuthenticated ? t.kyc.start : t.common.connectWalletFirst}
            </button>

            <FnReference
              title={t.kyc.reactFnsTitle}
              intro={t.kyc.reactFnsIntro}
              fns={t.kyc.reactFns}
            />
            <FnReference
              title={t.kyc.coreFnsTitle}
              intro={t.kyc.coreFnsIntro}
              fns={t.kyc.coreFns}
            />
          </div>

          {/* ── right: live code previews (core + react) ──────────────────── */}
          <div className="lg:sticky lg:top-6">
            <DualCode core={coreCode} react={reactCode} />
          </div>
        </div>
      </ComingSoon>
    </div>
  );
}
