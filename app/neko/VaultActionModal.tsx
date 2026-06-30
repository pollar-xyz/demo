"use client";

import { usePollar } from "@pollar/react";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { nekoPost, type VaultCatalogEntry } from "./_lib";
import { useNekoMainnet } from "./_MainnetGate";
import {
  depositArgs,
  sharesForDeposit,
  sharesForWithdraw,
  toRaw,
  withdrawArgs,
  SHARES_DP,
} from "./_vault";

type StepKey = "submit" | "audit";
type StepState = "idle" | "running" | "done" | "error";
type Steps = Record<StepKey, StepState>;
const IDLE: Steps = { submit: "idle", audit: "idle" };

export type VaultPositionLite = {
  userShares: string;
  pricePerShare: string;
};

type Result = {
  status: "SUCCESS" | "FAILED" | "PENDING";
  hash?: string;
  error?: string;
};

export function VaultActionModal({
  mode,
  vault,
  position,
  onClose,
  onDone,
}: {
  mode: "deposit" | "withdraw";
  vault: VaultCatalogEntry;
  position?: VaultPositionLite;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const { wallet, getClient, enabledAssets, refreshAssets, setTrustline } =
    usePollar();
  const walletAddress = wallet?.address ?? "";
  const isMainnet = useNekoMainnet();
  const [amount, setAmount] = useState("");
  const [busy, setBusy] = useState(false);
  const [steps, setSteps] = useState<Steps>(IDLE);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tlBusy, setTlBusy] = useState(false);
  const [tlError, setTlError] = useState<string | null>(null);

  const asset = vault.supplyAsset.symbol;

  // The vault's underlying asset, paired with this wallet's trustline state. We
  // match the app's enabled assets by code (the vault only exposes a symbol +
  // SAC address, not the classic issuer). If it's missing a trustline, the
  // deposit's `transfer` would fail on-chain — so we surface a one-click fix.
  const assetRecord =
    enabledAssets.step === "loaded"
      ? enabledAssets.data.assets.find(
          (a) => a.type !== "native" && a.code === asset,
        )
      : undefined;
  const needsTrustline = !!assetRecord && !assetRecord.trustlineEstablished;

  // Load the enabled-asset / trustline state once when the modal opens.
  useEffect(() => {
    if (enabledAssets.step === "idle") refreshAssets().catch(() => {});
  }, [enabledAssets.step, refreshAssets]);

  async function activateTrustline() {
    if (!assetRecord?.issuer) return;
    setTlBusy(true);
    setTlError(null);
    try {
      const outcome = await setTrustline(
        { code: assetRecord.code, issuer: assetRecord.issuer },
        { sponsored: assetRecord.sponsored },
      );
      if (outcome.status === "error") {
        setTlError(outcome.details ?? t.nekoVaults.signFailed);
      } else {
        await refreshAssets();
      }
    } catch (e) {
      setTlError(e instanceof Error ? e.message : String(e));
    } finally {
      setTlBusy(false);
    }
  }

  const stepList: { key: StepKey; label: string }[] = [
    { key: "submit", label: t.nekoVaults.run },
    { key: "audit", label: t.nekoVaults.sAudit },
  ];

  function mark(k: StepKey, s: StepState) {
    setSteps((prev) => ({ ...prev, [k]: s }));
  }

  async function run() {
    if (!walletAddress) return;
    if (!amount.trim() || Number(amount) <= 0) {
      setError(t.nekoVaults.enterAmount);
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    setSteps(IDLE);
    try {
      // 1. Build + sign + submit with Pollar in one call (invoke_contract).
      let sharesBurned = BigInt(0);
      let args;
      if (mode === "deposit") {
        args = depositArgs(walletAddress, toRaw(amount));
      } else {
        sharesBurned = sharesForWithdraw(
          amount,
          position?.userShares ?? "0",
          position?.pricePerShare ?? "0",
        );
        args = withdrawArgs(walletAddress, sharesBurned);
      }

      mark("submit", "running");
      const outcome = await getClient().runTx("invoke_contract", {
        contractId: vault.id,
        method: mode,
        args,
      } as never);
      const status =
        outcome.status === "success"
          ? "SUCCESS"
          : outcome.status === "pending"
            ? "PENDING"
            : "FAILED";
      mark("submit", status === "FAILED" ? "error" : "done");
      setResult({
        status,
        hash: "hash" in outcome ? outcome.hash : undefined,
        error: "details" in outcome ? outcome.details : undefined,
      });

      // 2. Record the action so Neko can track it (POST /v1/audit).
      if (outcome.status === "success") {
        mark("audit", "running");
        const tokenIn =
          mode === "deposit"
            ? Number(amount)
            : Number(sharesBurned) / 10 ** SHARES_DP;
        const amountOut =
          mode === "deposit"
            ? (sharesForDeposit(amount, position?.pricePerShare) ??
              Number(amount))
            : Number(amount);
        await nekoPost("/v1/audit", {
          wallet_address: walletAddress,
          action_type:
            mode === "deposit" ? "vaults_deposit" : "vaults_withdraw",
          asset_in: mode === "deposit" ? asset : vault.name,
          token_amount_in: tokenIn,
          asset_out: mode === "deposit" ? vault.name : asset,
          amount_out: amountOut,
          pool_id: vault.id,
          tx_hash: outcome.hash,
        }).catch(() => {});
        mark("audit", "done");
        onDone();
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
      setSteps((prev) => {
        const next = { ...prev };
        (Object.keys(next) as StepKey[]).forEach((k) => {
          if (next[k] === "running") next[k] = "error";
        });
        return next;
      });
    } finally {
      setBusy(false);
    }
  }

  return (
    <div
      className="fixed inset-0 z-50 flex items-center justify-center bg-black/50 p-4"
      onClick={onClose}
    >
      <div
        className="w-full max-w-md rounded-2xl border border-border bg-background p-6 space-y-4 shadow-xl"
        onClick={(e) => e.stopPropagation()}
      >
        <div className="flex items-start justify-between gap-4">
          <div>
            <h2 className="text-lg font-bold text-foreground">
              {mode === "deposit"
                ? t.nekoVaults.deposit
                : t.nekoVaults.withdraw}
            </h2>
            <p className="text-xs text-muted mt-0.5">{vault.name}</p>
          </div>
          <button
            onClick={onClose}
            className="text-muted hover:text-foreground text-sm"
          >
            ✕
          </button>
        </div>

        <div>
          <label className="block text-xs font-mono text-muted mb-1">
            {t.nekoVaults.amountLabel} ({asset})
          </label>
          <input
            value={amount}
            onChange={(e) => setAmount(e.target.value)}
            inputMode="decimal"
            placeholder="0.0"
            disabled={busy}
            className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light"
          />
        </div>

        {needsTrustline ? (
          <div className="space-y-2">
            <p className="text-xs text-muted">{t.nekoVaults.needTrustline}</p>
            <button
              onClick={activateTrustline}
              disabled={tlBusy || !assetRecord?.issuer || !isMainnet}
              className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
            >
              {tlBusy
                ? t.nekoVaults.activatingTrustline
                : `${t.nekoVaults.activateTrustline} (${asset})`}
            </button>
            {tlError && (
              <p className="text-xs font-mono text-error break-all">
                {tlError}
              </p>
            )}
          </div>
        ) : (
          <button
            onClick={run}
            disabled={busy || !isMainnet}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
          >
            {busy ? t.nekoVaults.working : t.nekoVaults.run}
          </button>
        )}

        <div className="flex flex-wrap gap-x-4 gap-y-1.5">
          {stepList.map(({ key, label }) => {
            const s = steps[key];
            const dot =
              s === "done"
                ? "bg-success"
                : s === "running"
                  ? "bg-warning animate-pulse"
                  : s === "error"
                    ? "bg-error"
                    : "bg-muted-light";
            return (
              <div
                key={key}
                className="flex items-center gap-1.5 text-[11px] font-mono"
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${dot}`}
                />
                <span
                  className={
                    s === "idle" ? "text-muted-light" : "text-foreground"
                  }
                >
                  {label}
                </span>
              </div>
            );
          })}
        </div>

        {error && (
          <p className="text-xs font-mono text-error break-all">{error}</p>
        )}

        {result && (
          <div className="rounded-lg border border-border bg-surface p-3 space-y-1">
            <p className="text-xs font-mono">
              <span className="text-muted">{t.nekoVaults.statusCol}: </span>
              <span
                className={`font-semibold ${
                  result.status === "SUCCESS"
                    ? "text-success"
                    : result.status === "FAILED"
                      ? "text-error"
                      : "text-warning"
                }`}
              >
                {result.status}
              </span>
            </p>
            {result.hash && (
              <p className="text-[10px] font-mono text-muted-light break-all">
                {t.nekoVaults.txLabel}: {result.hash}
              </p>
            )}
            {result.error && (
              <p className="text-[10px] font-mono text-error break-all">
                {result.error}
              </p>
            )}
          </div>
        )}
      </div>
    </div>
  );
}
