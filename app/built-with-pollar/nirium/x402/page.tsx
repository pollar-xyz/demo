"use client";

import { useState } from "react";
import { usePollar } from "@pollar/react";
import { useNiriumX402 } from "./adapter";
import { DualCode } from "@/app/_components/CodePanels";
import { FnReference } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── styles ───────────────────────────────────────────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const lbl = "block text-xs font-mono text-muted mb-1";
const btn = (variant: "primary" | "secondary") =>
  variant === "primary"
    ? "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
    : "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";

function Field({
  label,
  required,
  children,
  note,
}: {
  label: string;
  required?: boolean;
  note?: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-1">
      <label className={lbl}>
        {label}
        {required && <span className="ml-1 text-muted-light">*</span>}
        {!required && (
          <span className="ml-1 text-muted-light">{t.common.optional}</span>
        )}
      </label>
      {children}
      {note && <p className="text-xs text-muted-light mt-0.5">{note}</p>}
    </div>
  );
}

// ─── code preview serializer ──────────────────────────────────────────────────

function serializeVal(val: unknown, depth = 0): string {
  const pad = "  ".repeat(depth);
  const inner = "  ".repeat(depth + 1);
  if (val === null || val === undefined) return "undefined";
  if (typeof val === "boolean") return String(val);
  if (typeof val === "number") return String(val);
  if (typeof val === "string") return `'${val}'`;
  if (typeof val === "object") {
    const entries = Object.entries(val as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const lines = entries
      .map(([k, v]) => `${inner}${k}: ${serializeVal(v, depth + 1)}`)
      .join(",\n");
    return `{\n${lines},\n${pad}}`;
  }
  return String(val);
}

const SETUP_NOTE = `// adapter.ts — register once in your app
import { Agent } from 'nirium';
const agent = new Agent({ network: 'testnet' });

export const niriumAdapter: NiriumAdapter = {
  // Nirium plans the x402 payment → unsigned XDR.
  pay: (p) => agent.x402.buildPayment(p),
};

// each adapter fn returns { unsignedTransaction: string }.
// Pollar then signs + submits with the user's wallet automatically.

export const useNiriumX402 =
  createPollarAdapterHook<NiriumAdapter>('niriumX402');`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function NiriumX402Page() {
  const { t } = useI18n();
  const s = t.niriumX402;
  const { wallet, isAuthenticated, tx, openTxModal } = usePollar();
  const walletAddress = wallet?.address ?? "";
  const nirium = useNiriumX402();

  const [to, setTo] = useState("");
  const [amount, setAmount] = useState("");
  const [asset, setAsset] = useState("XLM");
  const [reference, setReference] = useState("");
  const [error, setError] = useState<string | null>(null);
  const [inFlight, setInFlight] = useState(false);

  async function handlePay() {
    setError(null);
    setInFlight(true);
    try {
      await nirium.pay({
        to: to.trim(),
        amount: amount.trim(),
        asset: asset.trim() || "XLM",
        reference: reference.trim() || undefined,
        signer: walletAddress,
      });
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setInFlight(false);
    }
  }

  // ── live code preview ───────────────────────────────────────────────────────
  const params: Record<string, unknown> = {
    to: to || "G… (recipient)",
    amount: amount || "1",
    asset: asset || "XLM",
    ...(reference ? { reference } : {}),
    signer: walletAddress || "G…",
  };
  const p = serializeVal(params, 0);

  const react = `const { pay } = useNiriumX402();

// Nirium plans the x402 payment → unsigned XDR.
// Pollar signs + submits with the connected wallet automatically.
await pay(${p});`;

  const core = `import { PollarClient } from '@pollar/core';
import { niriumAdapter } from './adapter';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// Nirium assembles the payment → returns an unsigned XDR
const { unsignedTransaction } = await niriumAdapter.pay(${p});

// Pollar signs + submits with the connected wallet
await client.signAndSubmitTx(unsignedTransaction);`;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: form ────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {s.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">
              {/* every locale's desc contains the literal "Nirium" — link it */}
              {s.desc.split("Nirium").map((part, i) => (
                <span key={i}>
                  {i > 0 && (
                    <a
                      href="https://nirium.xyz/developers"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-foreground hover:text-primary hover:underline"
                    >
                      Nirium
                    </a>
                  )}
                  {part}
                </span>
              ))}
            </p>
          </div>

          <div className="space-y-3">
            <Field label={s.destination} required note={s.destinationNote}>
              <input
                className={inp}
                value={to}
                onChange={(e) => setTo(e.target.value)}
                placeholder="G..."
                spellCheck={false}
              />
            </Field>
            <div className="grid grid-cols-2 gap-3">
              <Field label={s.amount} required>
                <input
                  className={inp}
                  value={amount}
                  onChange={(e) => setAmount(e.target.value)}
                  placeholder="1"
                />
              </Field>
              <Field label={s.asset} required note={s.assetNote}>
                <input
                  className={inp}
                  value={asset}
                  onChange={(e) => setAsset(e.target.value)}
                  placeholder="XLM"
                  spellCheck={false}
                />
              </Field>
            </div>
            <Field label={s.reference} note={s.referenceNote}>
              <input
                className={inp}
                value={reference}
                onChange={(e) => setReference(e.target.value)}
                placeholder="invoice-x402-001"
                spellCheck={false}
              />
            </Field>
          </div>

          <div className="space-y-2 pt-1">
            {error && <p className="text-xs font-mono text-error">{error}</p>}
            <button
              onClick={handlePay}
              disabled={!isAuthenticated || inFlight}
              className={`${btn("primary")} w-full sm:w-auto`}
            >
              {!isAuthenticated
                ? t.common.connectWalletToContinue
                : inFlight
                  ? s.signing
                  : s.pay}
            </button>
          </div>
        </div>

        {/* ── right: live code preview + tx state ───────────────────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          {/* setup hint */}
          <details className="rounded-lg border border-border overflow-hidden text-xs">
            <summary className="cursor-pointer px-4 py-2.5 bg-surface border-b border-border font-mono text-muted-light select-none">
              {s.setupSummary}
            </summary>
            <pre className="p-4 font-mono text-foreground overflow-x-auto whitespace-pre leading-relaxed bg-background">
              {SETUP_NOTE}
            </pre>
          </details>

          {/* current call — core + react */}
          <DualCode core={core} react={react} />

          {/* tx state (from usePollar) — the auto-sign-and-submit progress */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-light">
                  tx.step
                </span>
                <span
                  className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                    tx.step === "idle"
                      ? "bg-surface text-muted-light"
                      : tx.step === "building"
                        ? "bg-surface text-muted animate-pulse"
                        : tx.step === "built"
                          ? "bg-primary-light text-primary"
                          : tx.step === "signing"
                            ? "bg-warning-light text-warning animate-pulse"
                            : tx.step === "success"
                              ? "bg-success-light text-success"
                              : "bg-error-light text-error"
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
            <div className="p-4 text-xs font-mono bg-background min-h-12">
              {tx.step === "idle" && (
                <p className="text-muted-light">{s.txIdle}</p>
              )}
              {"hash" in tx && tx.hash && (
                <div>
                  <p className="text-muted-light mb-1">hash</p>
                  <p className="text-success break-all">{tx.hash}</p>
                </div>
              )}
              {tx.step === "error" && tx.details && (
                <p className="text-error">
                  {typeof tx.details === "string"
                    ? tx.details
                    : JSON.stringify(tx.details, null, 2)}
                </p>
              )}
            </div>
          </div>

          {/* SDK reference — the functions behind the adapter flow */}
          <FnReference
            title={s.coreFnsTitle}
            intro={s.coreFnsIntro}
            fns={s.coreFns}
          />
          <FnReference
            title={s.reactFnsTitle}
            intro={s.reactFnsIntro}
            fns={s.reactFns}
          />
        </div>
      </div>
    </div>
  );
}
