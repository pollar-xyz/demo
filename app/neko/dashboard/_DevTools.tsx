"use client";

// The raw Pollar SDK flow that powers the Neko section, kept as a collapsible
// "Developer tools" panel beneath the product dashboard: paste an unsigned XDR,
// run prepare → sign (Pollar) → submit → poll, then record what the tx did via
// POST /api/audit and see the audit log. Extracted from the original demo page.

import { usePollar } from "@pollar/react";
import { useCallback, useEffect, useState } from "react";
import { CodePanel } from "@/app/_components/CodePanels";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import {
  nekoGet,
  nekoPost,
  type AuditRecord,
  type AuditResult,
  type PrepareResult,
  type TxStatus,
} from "../_lib";
import { useNekoMainnet } from "../_MainnetGate";

const lbl = "block text-xs font-mono text-muted mb-1";
const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const btnPrimary =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";

const FLOW_CODE = `// 1. Prepare on the Neko proxy (via your own same-origin server route,
//    which holds the secret x-server-code header — never the browser).
const { hash } = await fetch('/api/neko/v1/tx/prepare', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ unsignedXdr }),
}).then((r) => r.json());

// 2. Sign locally with the connected Pollar wallet — sign only, no submit.
const { signedXdr } = await getClient().signTx(unsignedXdr);

// 3. Submit the signed XDR back through Neko, then poll until it settles.
let tx = await fetch('/api/neko/v1/tx/submit', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({ signedXdr }),
}).then((r) => r.json());

while (tx.status === 'PENDING') {
  tx = await fetch('/api/neko/v1/tx/' + tx.hash).then((r) => r.json());
}`;

type StepKey = "prepare" | "sign" | "submit" | "poll";
type StepState = "idle" | "running" | "done" | "error";
type Steps = Record<StepKey, StepState>;
const IDLE_STEPS: Steps = {
  prepare: "idle",
  sign: "idle",
  submit: "idle",
  poll: "idle",
};

function Step({ label, state }: { label: string; state: StepState }) {
  const dot =
    state === "done"
      ? "bg-success"
      : state === "running"
        ? "bg-warning animate-pulse"
        : state === "error"
          ? "bg-error"
          : "bg-muted-light";
  return (
    <div className="flex items-center gap-2 text-xs font-mono">
      <span className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`} />
      <span
        className={state === "idle" ? "text-muted-light" : "text-foreground"}
      >
        {label}
      </span>
    </div>
  );
}

function Section({
  title,
  note,
  children,
}: {
  title: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-semibold text-foreground">{title}</h3>
        {note && <p className="text-xs text-muted mt-0.5">{note}</p>}
      </div>
      {children}
    </section>
  );
}

function AuditTable({ rows }: { rows: AuditRecord[] }) {
  const { t } = useI18n();
  return (
    <div className="overflow-x-auto rounded-xl border border-border">
      <table className="w-full text-left text-xs">
        <thead>
          <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-light">
            <th className="px-3 py-2 font-medium">{t.neko.auditAction}</th>
            <th className="px-3 py-2 font-medium">{t.neko.auditFlow}</th>
            <th className="px-3 py-2 font-medium">{t.neko.auditDate}</th>
            <th className="px-3 py-2 font-medium">{t.neko.auditTx}</th>
          </tr>
        </thead>
        <tbody className="font-mono">
          {rows.map((r) => (
            <tr key={r.id} className="border-b border-border/50 last:border-0">
              <td className="px-3 py-2 text-foreground">{r.action_type}</td>
              <td className="px-3 py-2 text-muted">
                <span className="text-foreground">
                  {r.token_amount_in} {r.asset_in}
                </span>
                {" → "}
                <span className="text-success">
                  {r.amount_out} {r.asset_out}
                </span>
              </td>
              <td className="px-3 py-2 text-muted-light whitespace-nowrap">
                {new Date(r.created_at).toLocaleString()}
              </td>
              <td className="px-3 py-2">
                <span className="text-muted-light" title={r.tx_hash}>
                  {r.tx_hash.slice(0, 6)}…{r.tx_hash.slice(-6)}
                </span>
              </td>
            </tr>
          ))}
        </tbody>
      </table>
    </div>
  );
}

export function NekoDevTools({ walletAddress }: { walletAddress: string }) {
  const { t } = useI18n();
  const { getClient } = usePollar();
  const isMainnet = useNekoMainnet();
  const [open, setOpen] = useState(false);

  const [audit, setAudit] = useState<AuditRecord[] | null>(null);
  const loadAudit = useCallback(async () => {
    if (!walletAddress) return;
    await nekoGet<AuditRecord[]>(`/v1/audit?limit=50&wallet=${walletAddress}`)
      .then(setAudit)
      .catch(() => {});
  }, [walletAddress]);

  useEffect(() => {
    // Load the audit log once the panel is expanded.
    if (open) loadAudit();
  }, [open, loadAudit]);

  // ─── transaction flow ───
  const [xdr, setXdr] = useState("");
  const [busy, setBusy] = useState(false);
  const [steps, setSteps] = useState<Steps>(IDLE_STEPS);
  const [result, setResult] = useState<TxStatus | null>(null);
  const [txError, setTxError] = useState<string | null>(null);

  // ─── audit form ───
  const [auditForm, setAuditForm] = useState({
    action_type: "vaults_deposit",
    asset_in: "USDC",
    token_amount_in: "1",
    asset_out: "DeFindex-Vault-Neko USDC",
    amount_out: "0.9939207",
    pool_id: "CCUZC3HC5TH2VCYZFUG57E6IGKPL45YUN2SI3UEYQUBA7RCYHUIZBSFV",
    tx_hash: "",
  });
  const [auditBusy, setAuditBusy] = useState(false);
  const [auditError, setAuditError] = useState<string | null>(null);
  const [auditResult, setAuditResult] = useState<AuditResult | null>(null);
  const setAuditField = (k: keyof typeof auditForm, v: string) =>
    setAuditForm((f) => ({ ...f, [k]: v }));

  async function recordAudit() {
    if (!walletAddress) return;
    if (!auditForm.tx_hash.trim()) {
      setAuditError(t.neko.auditTxRequired);
      return;
    }
    setAuditBusy(true);
    setAuditError(null);
    setAuditResult(null);
    try {
      const res = await nekoPost<AuditResult>("/v1/audit", {
        wallet_address: walletAddress,
        action_type: auditForm.action_type,
        asset_in: auditForm.asset_in,
        token_amount_in: Number(auditForm.token_amount_in),
        asset_out: auditForm.asset_out,
        amount_out: Number(auditForm.amount_out),
        pool_id: auditForm.pool_id,
        tx_hash: auditForm.tx_hash.trim(),
      });
      setAuditResult(res);
      await loadAudit().catch(() => {});
    } catch (e) {
      setAuditError(e instanceof Error ? e.message : String(e));
    } finally {
      setAuditBusy(false);
    }
  }

  async function runFlow() {
    const unsigned = xdr.trim();
    if (!unsigned) {
      setTxError(t.neko.emptyXdr);
      return;
    }
    setBusy(true);
    setTxError(null);
    setResult(null);
    setSteps({ ...IDLE_STEPS, prepare: "running" });
    try {
      const prep = await nekoPost<PrepareResult>("/v1/tx/prepare", {
        unsignedXdr: unsigned,
      });
      setSteps((s) => ({ ...s, prepare: "done", sign: "running" }));

      const signed = await getClient().signTx(unsigned);
      if (signed.status !== "signed") throw new Error(t.neko.signFailed);
      setSteps((s) => ({ ...s, sign: "done", submit: "running" }));

      let status = await nekoPost<TxStatus>("/v1/tx/submit", {
        signedXdr: signed.signedXdr,
      });
      setSteps((s) => ({ ...s, submit: "done" }));

      if (status.status === "PENDING") {
        setSteps((s) => ({ ...s, poll: "running" }));
        const hash = status.hash || prep.hash;
        for (let i = 0; i < 6 && status.status === "PENDING"; i++) {
          await new Promise((r) => setTimeout(r, 1500));
          status = await nekoGet<TxStatus>(`/v1/tx/${hash}`);
        }
        setSteps((s) => ({ ...s, poll: "done" }));
      }
      setResult(status);
      if (status.hash) setAuditField("tx_hash", status.hash);
    } catch (e) {
      setTxError(e instanceof Error ? e.message : String(e));
      setSteps((s) => {
        const next = { ...s };
        (["prepare", "sign", "submit", "poll"] as StepKey[]).forEach((k) => {
          if (next[k] === "running") next[k] = "error";
        });
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  const statusColor =
    result?.status === "SUCCESS"
      ? "text-success"
      : result?.status === "FAILED"
        ? "text-error"
        : "text-warning";

  return (
    <div className="rounded-2xl border border-border">
      <button
        onClick={() => setOpen((o) => !o)}
        className="flex w-full items-center justify-between gap-4 px-5 py-4 text-left"
      >
        <div>
          <p className="text-sm font-semibold text-foreground">
            {t.neko.devTools}
          </p>
          <p className="text-xs text-muted">{t.neko.devToolsSub}</p>
        </div>
        <span className="text-muted-light">{open ? "−" : "+"}</span>
      </button>

      {open && (
        <div className="space-y-8 border-t border-border px-5 py-6">
          <Section title={t.neko.signTitle} note={t.neko.signDesc}>
            <div className="space-y-3">
              <div>
                <label className={lbl}>{t.neko.xdrLabel}</label>
                <textarea
                  value={xdr}
                  onChange={(e) => setXdr(e.target.value)}
                  placeholder={t.neko.xdrPh}
                  rows={4}
                  className={inp + " resize-y"}
                />
              </div>
              <button
                onClick={runFlow}
                disabled={busy || !isMainnet}
                className={btnPrimary}
              >
                {busy ? t.neko.running : t.neko.run}
              </button>

              <div className="flex flex-wrap gap-x-5 gap-y-2 pt-1">
                <Step label={t.neko.stepPrepare} state={steps.prepare} />
                <Step label={t.neko.stepSign} state={steps.sign} />
                <Step label={t.neko.stepSubmit} state={steps.submit} />
                <Step label={t.neko.stepPoll} state={steps.poll} />
              </div>

              {txError && (
                <p className="text-xs font-mono text-error">{txError}</p>
              )}

              {result ? (
                <div className="rounded-xl border border-border bg-surface p-4 space-y-1.5">
                  <p className="text-xs font-mono">
                    <span className="text-muted">{t.neko.statusLabel}: </span>
                    <span className={`font-semibold ${statusColor}`}>
                      {result.status}
                    </span>
                  </p>
                  {result.hash && (
                    <p className="text-[10px] font-mono text-muted-light break-all">
                      {t.neko.hashLabel}: {result.hash}
                    </p>
                  )}
                  {result.error && (
                    <p className="text-[10px] font-mono text-error break-all">
                      {result.error.code}
                      {result.error.message ? ` — ${result.error.message}` : ""}
                    </p>
                  )}
                </div>
              ) : (
                !txError && (
                  <p className="text-xs font-mono text-muted-light">
                    {t.neko.resultIdle}
                  </p>
                )
              )}
            </div>
          </Section>

          <Section title={t.neko.recordTitle} note={t.neko.recordNote}>
            <div className="space-y-3">
              <div className="grid gap-3 sm:grid-cols-2">
                <div>
                  <label className={lbl}>{t.neko.fActionType}</label>
                  <input
                    value={auditForm.action_type}
                    onChange={(e) =>
                      setAuditField("action_type", e.target.value)
                    }
                    className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>{t.neko.fPoolId}</label>
                  <input
                    value={auditForm.pool_id}
                    onChange={(e) => setAuditField("pool_id", e.target.value)}
                    className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>{t.neko.fAssetIn}</label>
                  <input
                    value={auditForm.asset_in}
                    onChange={(e) => setAuditField("asset_in", e.target.value)}
                    className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>{t.neko.fAmountIn}</label>
                  <input
                    value={auditForm.token_amount_in}
                    onChange={(e) =>
                      setAuditField("token_amount_in", e.target.value)
                    }
                    inputMode="decimal"
                    className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>{t.neko.fAssetOut}</label>
                  <input
                    value={auditForm.asset_out}
                    onChange={(e) => setAuditField("asset_out", e.target.value)}
                    className={inp}
                  />
                </div>
                <div>
                  <label className={lbl}>{t.neko.fAmountOut}</label>
                  <input
                    value={auditForm.amount_out}
                    onChange={(e) =>
                      setAuditField("amount_out", e.target.value)
                    }
                    inputMode="decimal"
                    className={inp}
                  />
                </div>
              </div>
              <div>
                <label className={lbl}>{t.neko.fTxHash}</label>
                <input
                  value={auditForm.tx_hash}
                  onChange={(e) => setAuditField("tx_hash", e.target.value)}
                  placeholder="ea5e82…"
                  className={inp}
                />
                {result?.hash && result.hash === auditForm.tx_hash && (
                  <p className="text-[10px] font-mono text-muted-light mt-1">
                    {t.neko.txHashFromFlow}
                  </p>
                )}
              </div>
              <button
                onClick={recordAudit}
                disabled={auditBusy}
                className={btnPrimary}
              >
                {auditBusy ? t.neko.recording : t.neko.record}
              </button>

              {auditError && (
                <p className="text-xs font-mono text-error">{auditError}</p>
              )}
              {auditResult?.ok && (
                <p className="text-xs font-mono text-success">
                  {t.neko.recordOk}
                  {auditResult.isFirstVaultDeposit
                    ? ` ${t.neko.firstDeposit}`
                    : ""}
                </p>
              )}
            </div>
          </Section>

          <Section title={t.neko.auditTitle} note={t.neko.auditNote}>
            {audit && audit.length > 0 ? (
              <AuditTable rows={audit} />
            ) : (
              <p className="text-xs font-mono text-muted-light">
                {t.neko.auditEmpty}
              </p>
            )}
          </Section>

          <Section title={t.neko.flowTitle}>
            <CodePanel
              sdk="@pollar/react"
              note="signTx + Neko proxy"
              code={FLOW_CODE}
            />
          </Section>
        </div>
      )}
    </div>
  );
}
