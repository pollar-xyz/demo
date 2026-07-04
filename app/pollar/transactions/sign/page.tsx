"use client";

import { usePollar } from "@pollar/react";
import { useState } from "react";
import { CodePanel } from "@/app/_components/CodePanels";
import { FnReference } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── shared styles (mirrors the transactions playground) ──────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const lbl = "block text-xs font-mono text-muted mb-1";
const hint = "text-xs text-muted-light mt-0.5";
const btn = (variant: "primary" | "secondary") =>
  variant === "primary"
    ? "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
    : "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";

// ─── page ─────────────────────────────────────────────────────────────────────

export default function SignXdrPage() {
  const { t } = useI18n();
  const s = t.signXdr;
  const {
    signAndSubmitTx,
    signTx,
    submitTx,
    isAuthenticated,
    tx,
    openTxModal,
  } = usePollar();

  const [xdr, setXdr] = useState("");
  const [signedXdr, setSignedXdr] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [busy, setBusy] = useState<null | "sign" | "submit" | "one">(null);

  const trimmed = xdr.trim();
  const disabled = !isAuthenticated || !trimmed || busy !== null;

  async function handleSignAndSubmit() {
    setError(null);
    setBusy("one");
    try {
      const res = await signAndSubmitTx(trimmed);
      if (res.status === "error")
        setError(res.message ?? res.details ?? t.common.unknownError);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setBusy(null);
    }
  }

  async function handleSign() {
    setError(null);
    setSignedXdr(null);
    setBusy("sign");
    try {
      const res = await signTx(trimmed);
      if (res.status === "signed") setSignedXdr(res.signedXdr);
      else setError(res.message ?? res.details ?? t.common.unknownError);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setBusy(null);
    }
  }

  async function handleSubmit() {
    if (!signedXdr) return;
    setError(null);
    setBusy("submit");
    try {
      const res = await submitTx(signedXdr);
      if (res.status === "error")
        setError(res.message ?? res.details ?? t.common.unknownError);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setBusy(null);
    }
  }

  // ── live code previews reflecting the pasted XDR ────────────────────────────
  const shown = trimmed ? `'${trimmed.slice(0, 48)}…'` : "unsignedXdr";
  const coreCode = `import { PollarClient } from '@pollar/core';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// an unsigned XDR built elsewhere — a backend, a CLI, another app
const unsignedXdr = ${shown};

// one-shot: sign with the logged-in wallet, then submit
await client.signAndSubmitTx(unsignedXdr);

// …or split it (external wallets sign client-side):
const res = await client.signTx(unsignedXdr);
if (res.status === 'signed') await client.submitTx(res.signedXdr);`;

  const reactCode = `const { signAndSubmitTx, signTx, submitTx } = usePollar();

// one-shot — works for custodial and external wallets
await signAndSubmitTx(${shown});

// …or split signing from submission (external wallets only)
const res = await signTx(${shown});
if (res.status === 'signed') await submitTx(res.signedXdr);`;

  return (
    <div className="w-full max-w-5xl">
      <div className="mb-6">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {s.title}
        </h1>
        <p className="text-sm text-muted mt-1.5">{s.desc}</p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: XDR input + actions + state ───────────────────────────── */}
        <div className="space-y-6">
          <div className="space-y-1">
            <label className={lbl}>{s.xdrLabel}</label>
            <textarea
              className={`${inp} resize-y min-h-28`}
              value={xdr}
              onChange={(e) => setXdr(e.target.value)}
              placeholder={s.xdrPlaceholder}
              rows={5}
              spellCheck={false}
            />
            <p className={hint}>{s.xdrNote}</p>
          </div>

          {/* one-shot */}
          <div className="space-y-2">
            <p className="text-xs font-mono text-muted-light">
              {s.oneShotTitle}
            </p>
            <button
              onClick={handleSignAndSubmit}
              disabled={disabled}
              className={`${btn("primary")} w-full sm:w-auto`}
            >
              {!isAuthenticated
                ? t.common.connectWalletToContinue
                : busy === "one"
                  ? s.working
                  : "signAndSubmitTx(xdr)"}
            </button>
          </div>

          {/* split flow */}
          <div className="space-y-2 pt-2 border-t border-border">
            <p className="text-xs font-mono text-muted-light">{s.splitTitle}</p>
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSign}
                disabled={disabled}
                className={`${btn("primary")} w-full sm:w-auto`}
              >
                {busy === "sign" ? s.working : "1. signTx(xdr)"}
              </button>
              {signedXdr && (
                <button
                  onClick={handleSubmit}
                  disabled={busy !== null}
                  className={`${btn("primary")} w-full sm:w-auto`}
                >
                  {busy === "submit" ? s.working : "2. submitTx(signedXdr)"}
                </button>
              )}
            </div>
            {signedXdr && (
              <div className="pt-1">
                <p className={lbl}>{s.signedXdrLabel}</p>
                <p className="text-xs font-mono text-success break-all">
                  {signedXdr.slice(0, 88)}…
                </p>
              </div>
            )}
          </div>

          {error && <p className="text-xs font-mono text-error">{error}</p>}

          {/* transaction state */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-light">
                  {s.stateLabel}
                </span>
                <span
                  className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                    tx.step === "idle"
                      ? "bg-surface text-muted-light"
                      : tx.step === "success" || tx.step === "submitted"
                        ? "bg-success-light text-success"
                        : tx.step === "error"
                          ? "bg-error-light text-error"
                          : "bg-warning-light text-warning animate-pulse"
                  }`}
                >
                  {tx.step}
                </span>
              </div>
              {tx.step !== "idle" && (
                <button onClick={openTxModal} className={btn("secondary")}>
                  {t.common.viewModal}
                </button>
              )}
            </div>

            <div className="p-4 space-y-3 bg-background min-h-16">
              {tx.step === "idle" && (
                <p className="text-xs font-mono text-muted-light">
                  {s.stateIdle}
                </p>
              )}
              {"hash" in tx && tx.hash && (
                <div>
                  <p className="text-xs font-mono text-muted-light mb-1">
                    hash
                  </p>
                  <p className="text-xs font-mono text-success break-all">
                    {tx.hash}
                  </p>
                </div>
              )}
              {tx.step === "error" && tx.details && (
                <p className="text-xs font-mono text-error">
                  {typeof tx.details === "string"
                    ? tx.details
                    : JSON.stringify(tx.details, null, 2)}
                </p>
              )}
            </div>
          </div>
        </div>

        {/* ── right: code previews + SDK reference ────────────────────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <CodePanel
            sdk="@pollar/core"
            note="framework-agnostic"
            code={coreCode}
          />
          <CodePanel
            sdk="@pollar/react"
            note="hooks & components"
            code={reactCode}
          />
          <FnReference
            title={s.reactFnsTitle}
            intro={s.reactFnsIntro}
            fns={s.reactFns}
          />
          <FnReference
            title={s.coreFnsTitle}
            intro={s.coreFnsIntro}
            fns={s.coreFns}
          />
        </div>
      </div>
    </div>
  );
}
