"use client";

// LumenWipe tab — a live demo of the public LumenWipe API.
//
//   All credit to the LumenWipe team: https://www.lumenwipe.com/
//   API reference: https://lumenwipe.pollar.dev/llms-api.txt
//
// This page is NOT part of the Pollar SDK. It calls the public, read-only
// LumenWipe endpoints directly (CORS is open) to plan and build the
// transactions that close a Stellar account and merge its balance out.
// XDRs come back UNSIGNED — you decode, verify and sign them yourself.

import { usePollar } from "@pollar/react";
import { useState } from "react";
import { CodePanel } from "@/app/_components/CodePanels";
import { Select } from "@/app/_components/Select";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── API ────────────────────────────────────────────────────────────────────

const API_BASE = "https://lumenwipe.pollar.dev";
const LUMENWIPE_SITE = "https://www.lumenwipe.com/";

type Network = "testnet" | "mainnet";
type MemoType = "text" | "id" | "hash";

type PlanStep = {
  index: number;
  type: string;
  title: string;
  description: string;
  operationCount: number;
  estimatedFeeLumens: string;
  affectedAsset?: string;
};

type PlanResponse = {
  account: string;
  destination: string;
  network: string;
  mediatorRequired: boolean;
  requiresMemo: boolean;
  memoType: string | null;
  executable: boolean;
  blockers: { message: string }[];
  steps: PlanStep[];
};

type StepResponse = {
  stepIndex: number;
  type: string;
  xdr: string;
  operationCount: number;
  networkPassphrase: string;
  requiresMediatorCosign: boolean;
  // client-only: set when the asset had no DEX route and was sent to its issuer
  fallbackToIssuer?: boolean;
};

// ─── reference content (kept in English, like the code samples) ───────────────

const STEP_TYPES: [string, string][] = [
  [
    "NORMALIZE_SIGNERS",
    "Remove extra signers and reset thresholds to single-key.",
  ],
  [
    "REMOVE_DATA_ENTRIES",
    "Delete on-account data entries (batched, 100 ops/tx).",
  ],
  ["CANCEL_OFFERS", "Cancel open DEX offers (batched)."],
  ["CLAIM_BALANCES", "Claim claimable balances."],
  [
    "CONVERT_ASSETS",
    "Swap a non-XLM trustline balance to XLM (one step per asset).",
  ],
  [
    "REMOVE_TRUSTLINES",
    "Remove trustlines to free their base reserves (batched).",
  ],
  [
    "MERGE",
    "AccountMerge: send the XLM to the destination and close the account.",
  ],
];

const LOOP = [
  "POST /plan → get the ordered steps and any blockers.",
  "If executable is false, stop and surface the blockers.",
  "If steps is empty, you're done — the account is already closed.",
  "Take steps[0]; POST /plan/step with its index → the unsigned XDR.",
  "Decode + verify the XDR, sign locally, submit it to the network.",
  "If the step was MERGE you're done; otherwise re-read the plan and repeat.",
];

// ─── shared styles (match the other demo pages) ───────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const lbl = "block text-xs font-mono text-muted mb-1";
const hint = "text-xs text-muted-light mt-0.5";
const btnPrimary =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";
const btnSecondary =
  "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";

// ─── small building blocks ────────────────────────────────────────────────────

function Field({
  label,
  required,
  note,
  tag,
  children,
}: {
  label: string;
  required?: boolean;
  note?: string;
  tag?: React.ReactNode;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-1">
      <label className={`${lbl} flex items-center`}>
        {label}
        {required ? (
          <span className="ml-1 text-muted-light">*</span>
        ) : (
          <span className="ml-1 text-muted-light">{t.common.optional}</span>
        )}
        {tag}
      </label>
      {children}
      {note && <p className={hint}>{note}</p>}
    </div>
  );
}

function WalletTag({ label }: { label: string }) {
  return (
    <span className="ml-2 inline-flex items-center gap-1 rounded bg-primary-light px-1.5 py-0.5 text-[10px] font-medium text-primary">
      <span className="h-1.5 w-1.5 rounded-full bg-primary" />
      {label}
    </span>
  );
}

function Badge({ on, label }: { on: boolean; label: string }) {
  return (
    <span
      className={`text-xs font-mono px-1.5 py-0.5 rounded ${
        on ? "bg-primary-light text-primary" : "bg-surface text-muted-light"
      }`}
    >
      {label}
    </span>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function LumenWipePage() {
  const { t } = useI18n();
  const lw = t.lumenwipe;

  // Pollar wallet — used to fill the G-address fields and, when the account
  // being closed IS the connected wallet, to sign + submit each step's XDR.
  const {
    wallet,
    isAuthenticated,
    network: pollarNetwork,
    signAndSubmitTx,
  } = usePollar();
  const walletAddress = wallet?.address ?? "";
  const hasWallet = isAuthenticated && walletAddress.startsWith("G");

  const [network, setNetwork] = useState<Network>("testnet");
  const [account, setAccount] = useState("");
  const [destination, setDestination] = useState("");
  const [memo, setMemo] = useState("");
  const [memoType, setMemoType] = useState<MemoType>("id");

  const [plan, setPlan] = useState<PlanResponse | null>(null);
  const [planLoading, setPlanLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  // built XDR + per-step loading, keyed by step index.
  const [steps, setSteps] = useState<Record<number, StepResponse>>({});
  const [stepLoading, setStepLoading] = useState<number | null>(null);
  const [copied, setCopied] = useState<number | null>(null);

  // Pollar signing, keyed by step index.
  const [signingStep, setSigningStep] = useState<number | null>(null);
  const [signResult, setSignResult] = useState<
    Record<number, { status: string; hash?: string; details?: string }>
  >({});

  // The connected wallet is the account being closed → we can sign with it.
  const isOwnAccount =
    hasWallet && account.trim() === walletAddress && account.trim().length > 0;
  const isOwnDestination = hasWallet && destination.trim() === walletAddress;
  // The XDR is built for `network`; the wallet signs on `pollarNetwork`.
  const networkMatches = network === pollarNetwork;
  const canSign = isOwnAccount && networkMatches;

  function requestBody(extra?: Record<string, unknown>) {
    return {
      account: account.trim(),
      destination: destination.trim(),
      ...(memo.trim() ? { memo: memo.trim(), memoType } : {}),
      ...extra,
    };
  }

  async function getPlan() {
    if (!account.trim() || !destination.trim()) {
      setError(lw.emptyFields);
      return;
    }
    setPlanLoading(true);
    setError(null);
    setPlan(null);
    setSteps({});
    try {
      const res = await fetch(`${API_BASE}/api/v1/${network}/plan`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody()),
      });
      const data = await res.json();
      if (!res.ok) {
        setError(data?.error ?? lw.requestFailed);
        return;
      }
      setPlan(data as PlanResponse);
    } catch {
      setError(lw.requestFailed);
    } finally {
      setPlanLoading(false);
    }
  }

  async function buildStep(index: number) {
    setStepLoading(index);
    setError(null);
    try {
      let res = await fetch(`${API_BASE}/api/v1/${network}/plan/step`, {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(requestBody({ stepIndex: index })),
      });
      let data = await res.json();

      // No DEX route for this asset: the API asks us to retry the same step
      // sending the balance back to its issuer instead of swapping to XLM.
      let fallbackToIssuer = false;
      if (
        !res.ok &&
        data?.error === "no_conversion_path" &&
        data?.retryWithFallback
      ) {
        fallbackToIssuer = true;
        res = await fetch(`${API_BASE}/api/v1/${network}/plan/step`, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify(
            requestBody({ stepIndex: index, fallbackToIssuer: true }),
          ),
        });
        data = await res.json();
      }

      if (!res.ok) {
        setError(data?.error ?? lw.requestFailed);
        return;
      }
      setSteps((s) => ({
        ...s,
        [index]: { ...(data as StepResponse), fallbackToIssuer },
      }));
    } catch {
      setError(lw.requestFailed);
    } finally {
      setStepLoading(null);
    }
  }

  async function copyXdr(index: number, xdr: string) {
    try {
      await navigator.clipboard.writeText(xdr);
      setCopied(index);
      window.setTimeout(() => setCopied((c) => (c === index ? null : c)), 1500);
    } catch {
      /* clipboard unavailable — ignore */
    }
  }

  // Sign + submit a step's unsigned XDR with the connected Pollar wallet, then
  // re-read the plan — every step confirmed on-chain shrinks the wind-down plan.
  async function signStep(index: number, xdr: string) {
    setSigningStep(index);
    setError(null);
    try {
      const outcome = await signAndSubmitTx(xdr);
      setSignResult((r) => ({
        ...r,
        [index]: {
          status: outcome.status,
          hash: "hash" in outcome ? outcome.hash : undefined,
          details: "details" in outcome ? outcome.details : undefined,
        },
      }));
      if (outcome.status === "success" || outcome.status === "pending") {
        await getPlan();
      }
    } catch (e) {
      setSignResult((r) => ({
        ...r,
        [index]: {
          status: "error",
          details: e instanceof Error ? e.message : lw.requestFailed,
        },
      }));
    } finally {
      setSigningStep(null);
    }
  }

  // ── live request preview ──────────────────────────────────────────────────
  const previewBody = JSON.stringify(
    {
      account: account.trim() || "GSOURCE…",
      destination: destination.trim() || "GDEST…",
      ...(memo.trim() ? { memo: memo.trim(), memoType } : {}),
    },
    null,
    2,
  );
  const planCurl = `curl -X POST ${API_BASE}/api/v1/${network}/plan \\
  -H 'Content-Type: application/json' \\
  -d '${previewBody}'`;
  const stepCurl = `curl -X POST ${API_BASE}/api/v1/${network}/plan/step \\
  -H 'Content-Type: application/json' \\
  -d '${JSON.stringify(
    {
      account: account.trim() || "GSOURCE…",
      destination: destination.trim() || "GDEST…",
      ...(memo.trim() ? { memo: memo.trim(), memoType } : {}),
      stepIndex: 0,
    },
    null,
    2,
  )}'`;

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl space-y-6">
      {/* header + credit */}
      <div className="space-y-2">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {lw.title}
        </h1>
        <p className="text-sm text-muted max-w-2xl">{lw.intro}</p>
      </div>

      <div className="rounded-xl border border-primary/30 bg-primary-light/40 px-4 py-3 text-xs text-foreground">
        {lw.creditPre}
        <a
          href={`${API_BASE}/llms-api.txt`}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary hover:underline"
        >
          {lw.creditApi}
        </a>
        {lw.creditMid}
        <a
          href={LUMENWIPE_SITE}
          target="_blank"
          rel="noreferrer"
          className="font-semibold text-primary hover:underline"
        >
          lumenwipe.com
        </a>
        {lw.creditPost}
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: form ──────────────────────────────────────────────────── */}
        <div className="space-y-5">
          {/* network */}
          <div>
            <label className={lbl}>{lw.network}</label>
            <div className="flex gap-2">
              {(["testnet", "mainnet"] as const).map((n) => (
                <button
                  key={n}
                  type="button"
                  onClick={() => setNetwork(n)}
                  className={`${
                    network === n ? btnPrimary : btnSecondary
                  } text-xs`}
                >
                  {n}
                </button>
              ))}
            </div>
          </div>

          <Field
            label={lw.account}
            required
            note={lw.accountNote}
            tag={isOwnAccount ? <WalletTag label={lw.myWallet} /> : undefined}
          >
            <div className="flex gap-2">
              <input
                className={inp}
                value={account}
                onChange={(e) => setAccount(e.target.value)}
                placeholder="G…"
                spellCheck={false}
              />
              {hasWallet && (
                <button
                  type="button"
                  onClick={() => {
                    setAccount(walletAddress);
                    // can't merge an account into itself — free the other field
                    if (destination === walletAddress) setDestination("");
                  }}
                  className={`${btnSecondary} shrink-0`}
                >
                  {lw.useMyWallet}
                </button>
              )}
            </div>
          </Field>

          {/* swap account ↔ destination */}
          <div className="flex justify-center -my-1">
            <button
              type="button"
              onClick={() => {
                setAccount(destination);
                setDestination(account);
              }}
              disabled={!account.trim() && !destination.trim()}
              title={lw.swap}
              aria-label={lw.swap}
              className={`${btnSecondary} inline-flex items-center gap-1.5`}
            >
              <svg
                className="h-3.5 w-3.5"
                fill="none"
                viewBox="0 0 24 24"
                stroke="currentColor"
                strokeWidth="2"
              >
                <path
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  d="M7 16V4m0 0L3 8m4-4 4 4m6 0v12m0 0 4-4m-4 4-4-4"
                />
              </svg>
              {lw.swap}
            </button>
          </div>

          <Field
            label={lw.destination}
            required
            note={lw.destinationNote}
            tag={
              isOwnDestination ? <WalletTag label={lw.myWallet} /> : undefined
            }
          >
            <div className="flex gap-2">
              <input
                className={inp}
                value={destination}
                onChange={(e) => setDestination(e.target.value)}
                placeholder="G…"
                spellCheck={false}
              />
              {hasWallet && (
                <button
                  type="button"
                  onClick={() => {
                    setDestination(walletAddress);
                    // can't merge an account into itself — free the other field
                    if (account === walletAddress) setAccount("");
                  }}
                  className={`${btnSecondary} shrink-0`}
                >
                  {lw.useMyWallet}
                </button>
              )}
            </div>
          </Field>

          <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
            <Field label={lw.memo} note={lw.memoNote}>
              <input
                className={inp}
                value={memo}
                onChange={(e) => setMemo(e.target.value)}
                placeholder="12345"
                spellCheck={false}
              />
            </Field>
            <Field label={lw.memoType}>
              <Select
                value={memoType}
                onChange={(v) => setMemoType(v as MemoType)}
                options={(["text", "id", "hash"] as const).map((value) => ({
                  value,
                  label: value,
                }))}
              />
            </Field>
          </div>

          <div className="space-y-2">
            {error && <p className="text-xs font-mono text-error">{error}</p>}
            <button
              onClick={getPlan}
              disabled={planLoading}
              className={`${btnPrimary} w-full sm:w-auto`}
            >
              {planLoading ? lw.gettingPlan : lw.getPlan}
            </button>
          </div>

          {/* safety note */}
          <div className="rounded-lg border border-border bg-surface px-4 py-3 space-y-1.5">
            <p className="text-xs font-semibold text-foreground">
              {lw.safetyTitle}
            </p>
            <p className="text-xs text-muted">{lw.safety1}</p>
            <p className="text-xs text-muted">{lw.safety2}</p>
          </div>
        </div>

        {/* ── right: live request preview ─────────────────────────────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <CodePanel sdk="curl" note="POST /plan" code={planCurl} />
          <CodePanel sdk="curl" note="POST /plan/step" code={stepCurl} />
        </div>
      </div>

      {/* ── plan result ───────────────────────────────────────────────────── */}
      {plan && (
        <div className="rounded-xl border border-border overflow-hidden">
          <div className="flex flex-wrap items-center gap-2 px-4 py-2.5 border-b border-border bg-surface">
            <span className="text-xs font-mono text-muted-light">
              {lw.planTitle}
            </span>
            <Badge
              on={plan.executable}
              label={plan.executable ? lw.executable : lw.notExecutable}
            />
            {plan.mediatorRequired && <Badge on label={lw.mediatorRequired} />}
            {plan.requiresMemo && <Badge on label={lw.requiresMemo} />}
            <span className="text-xs font-mono text-muted-light ml-auto">
              {plan.network}
            </span>
          </div>

          <div className="p-4 space-y-4 bg-background">
            {/* blockers */}
            {plan.blockers.length > 0 && (
              <div className="space-y-1">
                <p className="text-xs font-mono text-error">{lw.blockers}</p>
                {plan.blockers.map((b, i) => (
                  <p key={i} className="text-xs font-mono text-error/80">
                    • {b.message}
                  </p>
                ))}
              </div>
            )}

            {/* steps */}
            {plan.steps.length === 0 ? (
              <p className="text-xs font-mono text-muted-light">{lw.noSteps}</p>
            ) : (
              <div className="space-y-3">
                <div className="flex flex-wrap items-center gap-2">
                  <p className="text-xs font-mono text-muted-light">
                    {lw.steps}
                  </p>
                  {isOwnAccount && (
                    <span className="text-[10px] font-mono px-1.5 py-0.5 rounded bg-primary-light text-primary">
                      {networkMatches ? lw.ownAccountHint : lw.networkMismatch}
                    </span>
                  )}
                </div>
                {plan.steps.map((step) => {
                  const built = steps[step.index];
                  return (
                    <div
                      key={step.index}
                      className="rounded-lg border border-border p-3 space-y-2"
                    >
                      <div className="flex items-start gap-2">
                        <span className="text-[10px] font-mono font-medium bg-primary text-white rounded px-1.5 py-0.5 mt-0.5">
                          {step.index}
                        </span>
                        <div className="min-w-0 flex-1">
                          <p className="text-xs font-mono font-medium text-foreground">
                            {step.type}
                          </p>
                          <p className="text-xs text-muted">
                            {step.description}
                          </p>
                          <p className="text-[10px] font-mono text-muted-light mt-0.5">
                            {step.operationCount} {lw.ops} · {lw.fee}{" "}
                            {step.estimatedFeeLumens} XLM
                            {step.affectedAsset
                              ? ` · ${step.affectedAsset}`
                              : ""}
                          </p>
                        </div>
                        <button
                          onClick={() => buildStep(step.index)}
                          disabled={stepLoading === step.index}
                          className={`${btnSecondary} shrink-0`}
                        >
                          {stepLoading === step.index
                            ? lw.building
                            : lw.buildXdr}
                        </button>
                      </div>

                      {built && (
                        <div className="space-y-1">
                          <div className="flex items-center gap-2">
                            <span className="text-[10px] font-mono text-muted-light">
                              {lw.unsignedXdr}
                            </span>
                            {built.requiresMediatorCosign && (
                              <span className="text-[10px] font-mono text-warning">
                                {lw.cosignNote}
                              </span>
                            )}
                            {built.fallbackToIssuer && (
                              <span className="text-[10px] font-mono text-warning">
                                {lw.fallbackNote}
                              </span>
                            )}
                            <button
                              onClick={() => copyXdr(step.index, built.xdr)}
                              className="ml-auto text-[10px] font-mono text-primary hover:underline"
                            >
                              {copied === step.index ? lw.copied : lw.copy}
                            </button>
                          </div>
                          <pre className="rounded-md bg-surface dark:bg-[#1a1a1a] p-2 text-[10px] font-mono text-slate-700 dark:text-slate-300 overflow-x-auto whitespace-pre-wrap break-all">
                            {built.xdr}
                          </pre>
                          <p className="text-[10px] font-mono text-muted-light">
                            {built.networkPassphrase}
                          </p>

                          {/* sign with the connected wallet, when it's the
                              account being closed and networks line up */}
                          {built.requiresMediatorCosign ? (
                            <p className="text-[10px] font-mono text-warning">
                              {lw.cosignManual}
                            </p>
                          ) : isOwnAccount && !networkMatches ? (
                            <p className="text-[10px] font-mono text-warning">
                              {lw.networkMismatch}
                            </p>
                          ) : canSign ? (
                            <button
                              onClick={() => signStep(step.index, built.xdr)}
                              disabled={signingStep !== null}
                              className={`${btnPrimary} w-full sm:w-auto`}
                            >
                              {signingStep === step.index
                                ? lw.signing
                                : lw.signWithPollar}
                            </button>
                          ) : (
                            // The account being closed isn't the wallet you're
                            // logged in with — you can't sign for it here.
                            <p className="text-[10px] font-mono text-warning">
                              {lw.signNeedsPollarWallet}
                            </p>
                          )}

                          {signResult[step.index] && (
                            <p
                              className={`text-[10px] font-mono break-all ${
                                signResult[step.index].status === "error"
                                  ? "text-error"
                                  : "text-success"
                              }`}
                            >
                              {signResult[step.index].status === "error"
                                ? signResult[step.index].details ||
                                  lw.requestFailed
                                : `${lw.submitted} ${signResult[step.index].hash ?? ""}`}
                            </p>
                          )}
                        </div>
                      )}
                    </div>
                  );
                })}
              </div>
            )}
          </div>
        </div>
      )}

      {/* ── docs: the loop + step types ───────────────────────────────────── */}
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
        <div className="rounded-xl border border-border p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">
            {lw.loopTitle}
          </p>
          <ol className="space-y-1.5">
            {LOOP.map((line, i) => (
              <li
                key={i}
                className="flex gap-2 text-xs text-muted leading-relaxed"
              >
                <span className="text-[10px] font-mono font-medium bg-surface text-muted-light rounded px-1.5 py-0.5 shrink-0">
                  {i + 1}
                </span>
                <span>{line}</span>
              </li>
            ))}
          </ol>
        </div>

        <div className="rounded-xl border border-border p-4 space-y-2">
          <p className="text-sm font-semibold text-foreground">{lw.refTitle}</p>
          <dl className="space-y-1.5">
            {STEP_TYPES.map(([name, desc]) => (
              <div key={name} className="text-xs leading-relaxed">
                <dt className="inline font-mono font-medium text-foreground">
                  {name}
                </dt>
                <dd className="inline text-muted"> — {desc}</dd>
              </div>
            ))}
          </dl>
        </div>
      </div>

      {/* footer credit */}
      <p className="text-xs text-muted-light text-center">
        Powered by{" "}
        <a
          href={LUMENWIPE_SITE}
          target="_blank"
          rel="noreferrer"
          className="text-primary hover:underline"
        >
          LumenWipe
        </a>
        .
      </p>
    </div>
  );
}
