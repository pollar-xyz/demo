"use client";

// Manual e2e harness for the Cosmos Wallet adapter. Two halves:
//   1. the raw `window.cosmosWallet` provider (no Pollar involved), so a failure
//      here is the extension's, not the adapter's, and
//   2. the real Pollar SEP-10 login driven through the adapter registered in
//      app/_AppWalletProvider.tsx.

import { usePollar } from "@pollar/react";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import {
  COSMOS_WALLET_ID,
  getCosmosWallet,
  waitForCosmosWallet,
} from "../adapter";
import { cosmosWalletTestDict } from "./_i18n";

type Probe = { label: string; run: () => Promise<unknown> };

function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        <p className="text-xs text-muted leading-relaxed">{desc}</p>
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <span className="text-muted">{label}</span>
      <span className="font-mono text-foreground break-all text-right">
        {value}
      </span>
    </div>
  );
}

export default function CosmosWalletTestPage() {
  const { locale } = useI18n();
  const tt = cosmosWalletTestDict[locale];

  const {
    login,
    logout,
    wallet,
    isAuthenticated,
    verified,
    network,
    getClient,
  } = usePollar();

  const [detected, setDetected] = useState<boolean | null>(null);
  const [output, setOutput] = useState<string | null>(null);
  const [authStep, setAuthStep] = useState<string>("idle");
  // Bumped by the Re-check button to re-run the detection effect below.
  const [probeNonce, setProbeNonce] = useState(0);

  // The provider lands via an injected script, so wait on its ready event
  // instead of reading `window` once on mount.
  useEffect(() => {
    let cancelled = false;
    waitForCosmosWallet().then((w) => {
      if (!cancelled) setDetected(w !== null);
    });
    return () => {
      cancelled = true;
    };
  }, [probeNonce]);

  const recheck = useCallback(() => {
    setDetected(null);
    setProbeNonce((n) => n + 1);
  }, []);

  // Mirror the SDK's auth state machine so a failed SEP-10 shows its step and
  // message instead of silently doing nothing.
  useEffect(() => {
    const client = getClient();
    return client.onAuthStateChange((state) => {
      const message = "message" in state ? ` — ${String(state.message)}` : "";
      setAuthStep(`${state.step}${message}`);
    });
  }, [getClient]);

  async function call(probe: Probe) {
    setOutput(`${probe.label}…`);
    try {
      const result = await probe.run();
      setOutput(`${probe.label}\n${JSON.stringify(result, null, 2)}`);
    } catch (err) {
      setOutput(
        `${probe.label}\n${err instanceof Error ? err.message : String(err)}`,
      );
    }
  }

  const probes: Probe[] = [
    {
      label: "getNetwork()",
      run: async () => getCosmosWallet()?.getNetwork(),
    },
    {
      label: "isConnected()",
      run: async () => ({ connected: await getCosmosWallet()?.isConnected() }),
    },
    {
      label: "getAddress()",
      run: async () => getCosmosWallet()?.getAddress(),
    },
  ];

  return (
    <div className="w-full max-w-3xl space-y-6">
      <header className="space-y-1.5">
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {tt.title}
        </h1>
        <p className="text-sm text-muted">{tt.subtitle}</p>
      </header>

      {/* ── prerequisites ─────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-surface p-5 space-y-2">
        <h2 className="text-sm font-bold text-foreground">{tt.installTitle}</h2>
        <ol className="space-y-1.5">
          {tt.installSteps.map((step, i) => (
            <li
              key={i}
              className="flex gap-2 text-xs text-muted leading-relaxed"
            >
              <span className="font-mono text-muted-light">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
      </section>

      {/* ── 1. raw provider ───────────────────────────────────────────────── */}
      <Card title={tt.providerTitle} desc={tt.providerDesc}>
        <div className="flex flex-wrap items-center gap-2">
          <span
            className={`inline-flex items-center gap-1.5 rounded-full px-3 py-1 text-xs font-semibold ${
              detected
                ? "bg-success-light text-success"
                : "bg-warning-light text-warning"
            }`}
          >
            <span
              className={`inline-block h-1.5 w-1.5 rounded-full ${
                detected ? "bg-success" : "bg-warning"
              }`}
            />
            {detected === null ? "…" : detected ? tt.detected : tt.notDetected}
          </span>
          <button
            type="button"
            onClick={recheck}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            {tt.recheck}
          </button>
        </div>

        <div className="flex flex-wrap gap-2">
          {probes.map((probe) => (
            <button
              key={probe.label}
              type="button"
              disabled={!detected}
              onClick={() => call(probe)}
              className="rounded-lg border border-border px-3 py-1.5 font-mono text-xs text-foreground hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
            >
              {probe.label}
            </button>
          ))}
        </div>

        <div className="space-y-1.5">
          <p className="text-xs font-medium text-muted">{tt.resultTitle}</p>
          <pre className="rounded-xl border border-border bg-surface p-3 text-[11px] font-mono text-foreground whitespace-pre-wrap break-all min-h-[3rem]">
            {output ?? tt.empty}
          </pre>
        </div>
      </Card>

      {/* ── 2. the real Pollar login ──────────────────────────────────────── */}
      <Card title={tt.pollarTitle} desc={tt.pollarDesc}>
        <div className="flex flex-wrap gap-2">
          <button
            type="button"
            disabled={!detected || isAuthenticated}
            onClick={() => login({ provider: COSMOS_WALLET_ID })}
            className="rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {tt.loginBtn}
          </button>
          <button
            type="button"
            disabled={!isAuthenticated}
            onClick={() => logout()}
            className="rounded-lg border border-border px-4 py-2 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
          >
            {tt.logoutBtn}
          </button>
        </div>

        <div className="space-y-1.5 rounded-xl border border-border bg-surface p-3">
          <Field label={tt.authState} value={authStep} />
          <Field label={tt.appNetwork} value={network} />
          <Field label={tt.address} value={wallet?.address ?? tt.notLoggedIn} />
          <Field label={tt.provider} value={wallet?.provider ?? "-"} />
          <Field label={tt.verified} value={verified ? "true" : "false"} />
        </div>
      </Card>

      {/* ── known limits ──────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-surface p-5 space-y-2">
        <h2 className="text-sm font-bold text-foreground">{tt.warnTitle}</h2>
        <ul className="space-y-1.5">
          {tt.warns.map((warn, i) => (
            <li
              key={i}
              className="flex gap-2 text-xs text-muted leading-relaxed"
            >
              <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-warning" />
              <span>{warn}</span>
            </li>
          ))}
        </ul>
      </section>
    </div>
  );
}
