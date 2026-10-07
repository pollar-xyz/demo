"use client";

import { usePollar, KycStatus } from "@pollar/react";
import type { KycStatus as KycStatusValue } from "@pollar/core";
import { useState } from "react";
import { DualCode } from "@/app/_components/CodePanels";
import { FnReference } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── shared styles ────────────────────────────────────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const lbl = "block text-xs font-mono text-muted mb-1";
const btn =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";

// ─── page ─────────────────────────────────────────────────────────────────────

export default function KycPage() {
  const { t } = useI18n();
  const { openKycModal, isAuthenticated, getClient } = usePollar();

  const [status, setStatus] = useState<KycStatusValue>("none");
  const [statusNote, setStatusNote] = useState<string | null>(null);
  const [checking, setChecking] = useState(false);
  const [country, setCountry] = useState("MX");
  const [corridorId, setCorridorId] = useState("");

  // A status read only: it never opens a vendor session.
  async function handleCheckStatus() {
    setChecking(true);
    setStatusNote(null);
    try {
      const read = await getClient().getKycStatus(
        undefined,
        corridorId.trim() || undefined,
      );
      setStatus(read.status);
      if (read.decisionStatus === "manual_review") {
        setStatusNote(
          read.reviewReason === "DUPLICATE_DOCUMENT"
            ? t.kyc.reviewDuplicate
            : t.kyc.reviewPending,
        );
      } else if (read.status === "expired") {
        setStatusNote(t.kyc.expiredHint);
      }
    } catch {
      setStatusNote(t.kyc.statusError);
    } finally {
      setChecking(false);
    }
  }

  function handleStart() {
    openKycModal({
      country,
      ...(corridorId.trim() ? { corridorId: corridorId.trim() } : {}),
      onApproved: () => {
        setStatus("approved");
        setStatusNote(null);
      },
    });
  }

  // ── live code previews ──────────────────────────────────────────────────────
  const coreCode = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// 1. list providers for a country
const { providers } = await client.getKycProviders('${country || "MX"}'${corridorId.trim() ? ", " + JSON.stringify(corridorId.trim()) : ""});

// 2. start verification with a provider (reuse the key on retries)
const session = await client.startKyc({
  country: '${country || "MX"}',
  providerId: providers[0].id,
${corridorId.trim() ? "  corridorId: " + JSON.stringify(corridorId.trim()) + ",\n" : ""}  idempotencyKey: crypto.randomUUID(),
});

// 3. poll until the decision settles
const decision = await client.pollKycDecision(providers[0].id${corridorId.trim() ? ", { corridorId: " + JSON.stringify(corridorId.trim()) + " }" : ""});
// decision.status: 'none' | 'pending' | 'approved' | 'rejected' | 'expired'
// decision.decisionStatus === 'manual_review' -> held for review (decision.reviewReason)`;

  const reactCode = `import { usePollar, KycStatus } from '@pollar/react';

const { openKycModal } = usePollar();

// openKycModal wraps getKycProviders / startKyc / pollKycStatus.
openKycModal({
  country: '${country || "MX"}',
${corridorId.trim() ? "  corridorId: " + JSON.stringify(corridorId.trim()) + ",\n" : ""}  onApproved: () => {
    // unlock features for verified users
  },
});

// elsewhere — render the badge:
<KycStatus status={kycStatus} />`;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {t.kyc.title}
        </h1>
        <p className="text-sm text-muted mt-1.5">{t.kyc.desc}</p>
      </div>

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
            <label className={lbl}>{t.kyc.corridorLabel}</label>
            <input
              className={inp}
              value={corridorId}
              onChange={(event) => {
                setCorridorId(event.target.value);
                setStatus("none");
                setStatusNote(null);
              }}
              placeholder={t.kyc.corridorPlaceholder}
              spellCheck={false}
            />
            <p className="text-xs text-muted mt-2">{t.kyc.corridorHint}</p>
          </div>

          <div className="flex items-center gap-3 pt-1">
            <span className="text-xs font-mono text-muted-light">
              {t.kyc.currentStatus}
            </span>
            <KycStatus status={status} />
            <button
              onClick={handleCheckStatus}
              disabled={!isAuthenticated || checking}
              className="text-xs font-mono text-primary hover:underline disabled:opacity-40"
            >
              {t.kyc.checkStatus}
            </button>
          </div>
          {statusNote && <p className="text-xs text-muted">{statusNote}</p>}

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
    </div>
  );
}
