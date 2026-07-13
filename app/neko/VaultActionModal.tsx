"use client";

import { usePollar } from "@pollar/react";
import { useEffect, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { recordAudit, type VaultCatalogEntry } from "./_lib";
import { useNekoMainnet } from "./_MainnetGate";
import {
  depositArgs,
  sharesForDeposit,
  sharesForWithdraw,
  toRaw,
  withdrawArgs,
  ASSET_DP,
  PPS_DP,
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
  presetAmount,
  onClose,
  onDone,
}: {
  mode: "deposit" | "withdraw" | "claim";
  vault: VaultCatalogEntry;
  position?: VaultPositionLite;
  presetAmount?: string;
  onClose: () => void;
  onDone: () => void;
}) {
  const { t } = useI18n();
  const {
    wallet,
    getClient,
    openTxModal,
    enabledAssets,
    refreshAssets,
    setTrustline,
    walletBalance,
    refreshWalletBalance,
  } = usePollar();
  const walletAddress = wallet?.address ?? "";
  const isMainnet = useNekoMainnet();
  // "claim" is a withdraw of just the accrued yield: same on-chain `withdraw`
  // call, with the amount locked to the position's earnings.
  const isClaim = mode === "claim";
  const isWithdraw = mode === "withdraw" || isClaim;
  const [amount, setAmount] = useState(presetAmount ?? "");
  const [busy, setBusy] = useState(false);
  const [steps, setSteps] = useState<Steps>(IDLE);
  const [result, setResult] = useState<Result | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [tlBusy, setTlBusy] = useState(false);
  const [tlError, setTlError] = useState<string | null>(null);
  const [refreshing, setRefreshing] = useState(false);

  // The modal's own live data: the spendable balance and the trustline state.
  async function refreshAll() {
    setRefreshing(true);
    await Promise.allSettled([refreshWalletBalance(), refreshAssets()]);
    setRefreshing(false);
  }

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

  // Load the wallet's balances so a deposit can show what's actually spendable.
  useEffect(() => {
    if (walletBalance.step === "idle") refreshWalletBalance().catch(() => {});
  }, [walletBalance.step, refreshWalletBalance]);

  // Spendable balance of the vault's underlying asset (deposit ceiling).
  const balanceRecord =
    walletBalance.step === "loaded"
      ? walletBalance.data.balances.find((b) => b.code === asset)
      : undefined;
  const balanceLoading =
    walletBalance.step === "idle" || walletBalance.step === "loading";
  const available = balanceRecord ? Number(balanceRecord.balance) : null;

  // Everything the position is currently worth in the underlying asset — the
  // most this wallet could pull out (withdraw ceiling).
  const maxWithdraw = position
    ? (Number(position.userShares) * Number(position.pricePerShare)) /
      10 ** (SHARES_DP + PPS_DP)
    : 0;

  // The ceiling that applies to the field currently on screen.
  const maxAmount = isWithdraw ? maxWithdraw : available;

  // Compare at the asset's precision so a "MAX" fill never trips its own check.
  const overMax =
    maxAmount != null &&
    !!amount.trim() &&
    Number(amount) - maxAmount > 1 / 10 ** ASSET_DP;

  const fmtAmount = (n: number) =>
    n.toLocaleString(undefined, { maximumFractionDigits: ASSET_DP });

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
    if (overMax) {
      setError(
        isWithdraw ? t.nekoVaults.exceedsPosition : t.nekoVaults.exceedsBalance,
      );
      return;
    }
    setBusy(true);
    setError(null);
    setResult(null);
    setSteps(IDLE);
    try {
      // 1. Build + sign + submit with Pollar in one call (invoke_contract).
      // Opening the Pollar transaction modal surfaces the build → sign → submit
      // flow the SDK already drives via runTx.
      let sharesBurned = BigInt(0);
      let args;
      if (isWithdraw) {
        sharesBurned = sharesForWithdraw(
          amount,
          position?.userShares ?? "0",
          position?.pricePerShare ?? "0",
        );
        args = withdrawArgs(walletAddress, sharesBurned);
      } else {
        args = depositArgs(walletAddress, toRaw(amount));
      }

      mark("submit", "running");
      openTxModal();
      const outcome = await getClient().runTx("invoke_contract", {
        contractId: vault.id,
        method: isWithdraw ? "withdraw" : "deposit",
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
        const tokenIn = isWithdraw
          ? Number(sharesBurned) / 10 ** SHARES_DP
          : Number(amount);
        const amountOut = isWithdraw
          ? Number(amount)
          : (sharesForDeposit(amount, position?.pricePerShare) ??
            Number(amount));
        try {
          await recordAudit({
            wallet_address: walletAddress,
            action_type: isWithdraw ? "vaults_withdraw" : "vaults_deposit",
            asset_in: isWithdraw ? vault.name : asset,
            token_amount_in: tokenIn,
            asset_out: isWithdraw ? asset : vault.name,
            amount_out: amountOut,
            pool_id: vault.id,
            tx_hash: outcome.hash ?? "",
          });
          mark("audit", "done");
        } catch (e) {
          // The transaction IS on-chain — only the bookkeeping failed. Say so
          // loudly and hand over the hash, because a dropped audit silently
          // corrupts the deposited/earnings figures until someone backfills it.
          mark("audit", "error");
          setError(
            `${t.nekoVaults.auditFailed} ${
              e instanceof Error ? e.message : String(e)
            } — tx ${outcome.hash ?? "?"}`,
          );
        }
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
              {isClaim
                ? t.nekoVaults.claimTitle
                : mode === "deposit"
                  ? t.nekoVaults.deposit
                  : t.nekoVaults.withdraw}
            </h2>
            <p className="text-xs text-muted mt-0.5">{vault.name}</p>
          </div>
          <div className="flex items-center gap-2">
            <button
              onClick={refreshAll}
              disabled={refreshing || busy}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface disabled:opacity-40"
            >
              {refreshing ? t.nekoVaults.loading : t.nekoVaults.refresh}
            </button>
            <button
              onClick={onClose}
              className="text-muted hover:text-foreground text-sm"
            >
              ✕
            </button>
          </div>
        </div>

        <div>
          <div className="mb-1 flex items-baseline justify-between gap-2">
            <label className="block text-xs font-mono text-muted">
              {t.nekoVaults.amountLabel} ({asset})
            </label>
            {/* Deposit shows the spendable wallet balance; withdraw shows the
                position's full value. Claim's amount is fixed, so neither applies. */}
            {!isClaim && (
              <span className="text-[11px] font-mono text-muted-light">
                {isWithdraw ? (
                  <>
                    {t.nekoVaults.maxWithdraw}:{" "}
                    <span className="text-foreground">
                      {fmtAmount(maxWithdraw)} {asset}
                    </span>
                  </>
                ) : balanceLoading ? (
                  t.nekoVaults.loading
                ) : available == null ? (
                  t.nekoVaults.noBalance
                ) : (
                  <>
                    {t.nekoVaults.available}:{" "}
                    <span className="text-foreground">
                      {fmtAmount(available)} {asset}
                    </span>
                  </>
                )}
              </span>
            )}
          </div>
          <div className="relative">
            <input
              value={amount}
              onChange={(e) => setAmount(e.target.value)}
              inputMode="decimal"
              placeholder="0.0"
              disabled={busy || isClaim}
              readOnly={isClaim}
              className={`w-full rounded-lg border bg-transparent px-3 py-2 pr-14 text-sm font-mono outline-none placeholder:text-muted-light disabled:opacity-70 ${
                overMax
                  ? "border-error focus:border-error"
                  : "border-border focus:border-primary"
              }`}
            />
            {!isClaim && maxAmount != null && maxAmount > 0 && (
              <button
                type="button"
                onClick={() => setAmount(String(maxAmount))}
                disabled={busy}
                className="absolute right-2 top-1/2 -translate-y-1/2 rounded-md bg-surface px-2 py-1 text-[10px] font-semibold text-primary hover:bg-primary-light disabled:opacity-40 transition-colors"
              >
                {t.nekoVaults.maxBtn}
              </button>
            )}
          </div>
          {overMax && (
            <p className="mt-1 text-[11px] font-mono text-error">
              {isWithdraw
                ? t.nekoVaults.exceedsPosition
                : t.nekoVaults.exceedsBalance}
            </p>
          )}
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
            disabled={busy || !isMainnet || overMax}
            className="w-full rounded-lg bg-primary px-4 py-2 text-sm font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
          >
            {busy
              ? t.nekoVaults.working
              : isClaim
                ? t.nekoVaults.claim
                : t.nekoVaults.run}
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
