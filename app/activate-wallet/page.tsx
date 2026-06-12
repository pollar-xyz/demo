"use client";

import { clientEnv } from "@/lib/env";
import { useState } from "react";
import { useI18n } from "../_i18n/LanguageProvider";

type ActivateResult =
  | { ok: true; publicKey: string; amount: number }
  | { ok: false; code: string; status: number };

const input =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary font-mono";

export default function ActivateWalletPage() {
  const { t } = useI18n();
  const [secretKey, setSecretKey] = useState("");
  const [confirmed, setConfirmed] = useState(false);
  const [publicKey, setPublicKey] = useState("");
  const [loading, setLoading] = useState(false);
  const [result, setResult] = useState<ActivateResult | null>(null);

  function handleConfirmKey() {
    const trimmed = secretKey.trim();
    if (!trimmed) return;
    setConfirmed(true);
    setResult(null);
  }

  async function handleActivate() {
    setLoading(true);
    setResult(null);
    try {
      const res = await fetch(
        `${clientEnv.NEXT_PUBLIC_SERVER_API_URL}/v1/wallets/activate`,
        {
          method: "POST",
          headers: {
            "Content-Type": "application/json",
            "x-pollar-api-key": secretKey.trim(),
          },
          body: JSON.stringify({ publicKey: publicKey.trim() }),
        },
      );

      const data = await res.json();

      if (res.ok) {
        setResult({ ok: true, publicKey: data.publicKey, amount: data.amount });
      } else {
        setResult({
          ok: false,
          code: data.error ?? data.code ?? "UNKNOWN_ERROR",
          status: res.status,
        });
      }
    } catch {
      setResult({ ok: false, code: "NETWORK_ERROR", status: 0 });
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="flex min-h-screen items-center justify-center bg-surface font-sans">
      <main className="w-full max-w-lg px-6 py-16">
        {/* header */}
        <div className="mb-8">
          <p className="text-xs font-mono text-muted-light mb-1">
            demo / activate-wallet
          </p>
          <h1 className="text-2xl font-semibold tracking-tight text-foreground">
            {t.activateWallet.title}
          </h1>
          <p className="mt-2 text-sm text-muted">{t.activateWallet.subtitle}</p>
        </div>

        {/* step 1 — secret key */}
        <section className="rounded-lg border border-border bg-background p-5 mb-4">
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-semibold text-muted-light">
              {t.activateWallet.step1}
            </span>
            <span className="text-sm font-medium text-foreground">
              {t.activateWallet.step1Title}
            </span>
          </div>

          <div className="rounded border border-warning-border bg-warning-light px-3 py-2 text-xs text-warning mb-4 leading-relaxed">
            <strong>{t.activateWallet.warnStrong}</strong>
            {t.activateWallet.warnMid}
            <strong>{t.activateWallet.warnNever}</strong>
            {t.activateWallet.warnEnd}
          </div>

          <div className="flex gap-2">
            <input
              className={input}
              type="password"
              placeholder="sec_testnet_xxxx"
              value={secretKey}
              onChange={(e) => {
                setSecretKey(e.target.value);
                if (confirmed) setConfirmed(false);
                setResult(null);
              }}
              disabled={confirmed}
              onKeyDown={(e) => e.key === "Enter" && handleConfirmKey()}
            />
            {confirmed ? (
              <button
                className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs text-muted hover:text-foreground transition-colors"
                onClick={() => {
                  setConfirmed(false);
                  setResult(null);
                }}
              >
                {t.activateWallet.edit}
              </button>
            ) : (
              <button
                className="shrink-0 rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
                onClick={handleConfirmKey}
                disabled={!secretKey.trim()}
              >
                {t.activateWallet.confirm}
              </button>
            )}
          </div>

          {confirmed && (
            <p className="mt-2 text-xs text-success font-mono">
              {t.activateWallet.keySet}
            </p>
          )}
        </section>

        {/* step 2 — activate */}
        <section
          className={`rounded-lg border border-border bg-background p-5 transition-opacity ${
            confirmed
              ? "opacity-100"
              : "opacity-40 pointer-events-none select-none"
          }`}
        >
          <div className="flex items-center gap-2 mb-3">
            <span className="text-xs font-mono font-semibold text-muted-light">
              {t.activateWallet.step2}
            </span>
            <span className="text-sm font-medium text-foreground">
              {t.activateWallet.step2Title}
            </span>
          </div>

          <p className="text-xs text-muted mb-4">
            {t.activateWallet.step2Desc}
          </p>

          <div className="mb-3">
            <label className="block text-xs text-muted mb-1">
              {t.activateWallet.publicKeyLabel}
            </label>
            <input
              className={input}
              placeholder="GABC...XYZ"
              value={publicKey}
              onChange={(e) => {
                setPublicKey(e.target.value);
                setResult(null);
              }}
              onKeyDown={(e) =>
                e.key === "Enter" &&
                !loading &&
                publicKey.trim() &&
                handleActivate()
              }
            />
          </div>

          <button
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover transition-colors disabled:opacity-40"
            onClick={handleActivate}
            disabled={loading || !publicKey.trim()}
          >
            {loading ? t.activateWallet.activating : t.activateWallet.activate}
          </button>

          {/* result */}
          {result && (
            <div
              className={`mt-4 rounded border px-4 py-3 text-xs font-mono ${
                result.ok
                  ? "border-success-border bg-success-light text-success"
                  : "border-error-border bg-error-light text-error"
              }`}
            >
              {result.ok ? (
                <>
                  <p className="font-semibold mb-1">
                    {t.activateWallet.activated}
                  </p>
                  <p>publicKey: {result.publicKey}</p>
                  <p>
                    {t.activateWallet.amountFunded} {result.amount} XLM
                  </p>
                </>
              ) : (
                <>
                  <p className="font-semibold mb-1">
                    ✕ {result.code}
                    {result.status > 0 && (
                      <span className="ml-2 font-normal text-muted-light">
                        HTTP {result.status}
                      </span>
                    )}
                  </p>
                  <p>
                    {t.activateWallet.errors[result.code] ??
                      t.activateWallet.unexpectedError}
                  </p>
                </>
              )}
            </div>
          )}
        </section>

        {/* endpoint reference */}
        <details className="mt-6 text-xs font-mono text-muted-light">
          <summary className="cursor-pointer hover:text-foreground select-none">
            {t.activateWallet.endpointRef}
          </summary>
          <div className="mt-3 rounded border border-border bg-surface p-3 space-y-1 leading-relaxed">
            <p>
              <span className="text-muted">POST</span>
              {clientEnv.NEXT_PUBLIC_SERVER_API_URL}/v1/wallets/activate
            </p>
            <p>
              <span className="text-muted">header:</span>
              x-pollar-api-key: sec_testnet_xxxx
            </p>
            <p>
              <span className="text-muted">body:</span>
              {'{ "publicKey": "G..." }'}
            </p>
            <p className="pt-1 text-muted">200 → {"{ publicKey, amount }"}</p>
            <p className="text-muted">
              409 WALLET_ALREADY_FUNDED · 404 WALLET_NOT_FOUND · 403 FORBIDDEN
            </p>
          </div>
        </details>

        <div className="mt-8 text-xs text-muted-light">
          <a
            href="/"
            className="underline underline-offset-2 hover:text-foreground"
          >
            {t.activateWallet.back}
          </a>
        </div>
      </main>
    </div>
  );
}
