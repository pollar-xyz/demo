"use client";

import { usePollar } from "@pollar/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import {
  nekoGet,
  type AuditRecord,
  type DefindexVaultsResponse,
  type Positions,
  type PriceMap,
  type VaultCatalogEntry,
} from "../_lib";
import { fmtUsd } from "../_format";
import { ASSET_DP } from "../_vault";
import { VaultActionModal, type VaultPositionLite } from "../VaultActionModal";
import { useNekoMainnet } from "../_MainnetGate";
import { Chip, NekoBanner, TokenBadge } from "../_ui";
import {
  computeVaultRows,
  computeVaultSummary,
  iconUrl,
  mapDefindexVaults,
  positionsByVault,
  type VaultPositionRow,
} from "../_vaultData";

type Action = {
  mode: "deposit" | "withdraw" | "claim";
  vault: VaultCatalogEntry;
  position?: VaultPositionLite;
  presetAmount?: string;
};

const fmtAsset = (n: number) =>
  n.toLocaleString(undefined, { maximumFractionDigits: 4 });

// One vault, plus this wallet's position in it when there is one. The position
// block deliberately shows only what the card doesn't already say (the vault's
// name, asset and APY are above it): deposited, current value, earnings, claim.
function VaultCard({
  v,
  row,
  t,
  canAct,
  isMainnet,
  onDeposit,
  onWithdraw,
  onClaim,
}: {
  v: VaultCatalogEntry;
  row?: VaultPositionRow;
  t: ReturnType<typeof useI18n>["t"];
  canAct: boolean;
  isMainnet: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
  onClaim: () => void;
}) {
  const vt = t.nekoVaults;
  const icon = iconUrl(v.supplyAsset.iconSrc);
  const asset = v.supplyAsset.symbol;
  const canClaim = !!row && row.earnings > 0 && isMainnet;

  return (
    <div className="flex flex-col rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start gap-3">
        {icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon}
            alt={asset}
            className="h-10 w-10 rounded-full bg-surface object-contain"
          />
        ) : (
          <TokenBadge symbol={asset} size={40} />
        )}
        <div className="min-w-0 flex-1">
          <p className="truncate text-sm font-bold text-foreground">{v.name}</p>
          <div className="mt-1">
            <Chip tone="primary">{vt.lending}</Chip>
          </div>
        </div>
      </div>

      <div className="mt-4 space-y-1 text-[11px] text-muted">
        <p>
          {vt.supply}{" "}
          <span className="font-semibold text-foreground">{asset}</span> {vt.on}{" "}
          <span className="text-foreground">{vt.stellar}</span>
        </p>
        <p>
          {vt.createdBy} <span className="text-foreground">Neko</span>
        </p>
      </div>

      <div className="mt-3 flex items-end justify-between border-t border-border/60 pt-3">
        <div>
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-light">
            {vt.tvl}
          </p>
          <p className="text-sm font-bold text-foreground">{v.tvl ?? "—"}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-light">
            {vt.apy}
          </p>
          <p className="text-sm font-bold text-success">
            {v.apy7d && v.apy7d !== "-" ? v.apy7d : "—"}
          </p>
        </div>
      </div>

      {row && (
        <div className="mt-3 rounded-xl bg-surface p-3">
          <p className="text-[10px] font-mono uppercase tracking-wider text-muted-light">
            {vt.yourPosition}
          </p>
          <dl className="mt-2 space-y-1.5 text-xs">
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-muted">{vt.deposited}</dt>
              <dd className="font-mono text-foreground">
                {fmtAsset(row.deposited)} {asset}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-muted">{vt.value}</dt>
              <dd className="text-right font-mono text-foreground">
                {fmtAsset(row.value)} {asset}
                {row.price != null && (
                  <span className="ml-1 text-[10px] text-muted-light">
                    ({fmtUsd(row.value * row.price)})
                  </span>
                )}
              </dd>
            </div>
            <div className="flex items-baseline justify-between gap-2">
              <dt className="text-muted">{vt.earnings}</dt>
              <dd
                className={`font-mono ${row.earnings > 0 ? "text-success" : "text-muted"}`}
              >
                {row.earnings > 0 ? "+" : ""}
                {fmtAsset(row.earnings)} {asset}
              </dd>
            </div>
          </dl>
          <button
            onClick={onClaim}
            disabled={!canClaim}
            title={canClaim ? undefined : vt.claimNone}
            className="mt-3 w-full rounded-lg bg-primary px-3 py-1.5 text-xs font-semibold text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-50"
          >
            {canClaim
              ? `${vt.claim} ${fmtAsset(row.earnings)} ${asset}`
              : vt.claim}
          </button>
        </div>
      )}

      <div
        className="mt-4 grid grid-cols-2 gap-2"
        title={canAct ? undefined : vt.connect}
      >
        <button
          onClick={onDeposit}
          disabled={!canAct}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white transition-colors hover:bg-primary-hover disabled:cursor-not-allowed disabled:opacity-40"
        >
          {vt.deposit}
        </button>
        <button
          onClick={onWithdraw}
          disabled={!canAct || !row}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface disabled:cursor-not-allowed disabled:opacity-40"
        >
          {vt.withdraw}
        </button>
      </div>
    </div>
  );
}

export default function NekoVaultsPage() {
  const { t } = useI18n();
  const vt = t.nekoVaults;
  const { isAuthenticated, wallet } = usePollar();
  const walletAddress = wallet?.address ?? "";
  const isMainnet = useNekoMainnet();

  const [vaults, setVaults] = useState<VaultCatalogEntry[]>([]);
  const [positions, setPositions] = useState<Positions | null>(null);
  const [audit, setAudit] = useState<AuditRecord[]>([]);
  const [prices, setPrices] = useState<PriceMap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [asset, setAsset] = useState("all");
  const [action, setAction] = useState<Action | null>(null);

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    let catalog: VaultCatalogEntry[] = [];
    try {
      const cat = await nekoGet<DefindexVaultsResponse>("/v1/defindex/vaults");
      catalog = mapDefindexVaults(cat);
      setVaults(catalog);
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    }
    if (walletAddress) {
      const [pos, aud] = await Promise.allSettled([
        nekoGet<Positions>(`/dashboard/positions/${walletAddress}`),
        nekoGet<AuditRecord[]>(`/v1/audit?limit=50&wallet=${walletAddress}`),
      ]);
      const posValue = pos.status === "fulfilled" ? pos.value : null;
      setPositions(posValue);
      setAudit(aud.status === "fulfilled" ? aud.value : []);
      // Prices for the assets of vaults the wallet actually holds.
      const ids = new Set(
        (posValue?.vaultPositions ?? []).map((vp) => String(vp.vaultId)),
      );
      const symbols = Array.from(
        new Set(
          catalog.filter((v) => ids.has(v.id)).map((v) => v.supplyAsset.symbol),
        ),
      );
      if (symbols.length) {
        await nekoGet<PriceMap>(
          `/dashboard/prices?symbols=${symbols.join(",")}`,
        )
          .then(setPrices)
          .catch(() => {});
      }
    }
    setLoading(false);
  }, [walletAddress]);

  useEffect(() => {
    // Sync to the external API on mount / when the wallet changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const posByVault = useMemo(() => positionsByVault(positions), [positions]);

  const rows = useMemo(
    () => computeVaultRows(positions, vaults, audit, prices),
    [positions, vaults, audit, prices],
  );
  const rowByVault = useMemo(
    () => new Map(rows.map((r) => [r.vaultId, r])),
    [rows],
  );
  const summary = useMemo(() => computeVaultSummary(rows), [rows]);

  const assetOptions = useMemo(
    () => Array.from(new Set(vaults.map((v) => v.supplyAsset.symbol))).sort(),
    [vaults],
  );

  // Filter by asset, then float the vaults this wallet is actually in to the
  // top so a position is never buried below vaults the user has no stake in.
  const visibleVaults = useMemo(() => {
    const filtered =
      asset === "all"
        ? vaults
        : vaults.filter((v) => v.supplyAsset.symbol === asset);
    return [...filtered].sort((a, b) => {
      const aHas = rowByVault.has(a.id) ? 1 : 0;
      const bHas = rowByVault.has(b.id) ? 1 : 0;
      return bHas - aHas;
    });
  }, [vaults, asset, rowByVault]);

  return (
    <div className="w-full space-y-6">
      <NekoBanner eyebrow={vt.bannerTag} title={vt.title} desc={vt.tagline} />

      <div className="flex items-center justify-end gap-2">
        {assetOptions.length > 0 && (
          <select
            value={asset}
            onChange={(e) => setAsset(e.target.value)}
            className="rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary"
          >
            <option value="all">{vt.allAssets}</option>
            {assetOptions.map((s) => (
              <option key={s} value={s}>
                {s}
              </option>
            ))}
          </select>
        )}
        <button
          onClick={load}
          disabled={loading}
          className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground transition-colors hover:bg-surface disabled:opacity-40"
        >
          {loading ? vt.loading : vt.refresh}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-error/40 bg-error/5 px-4 py-3 text-xs font-mono text-error">
          {error}
        </div>
      )}

      {/* Portfolio totals across every vault — only meaningful once there's a
          position, and not derivable from any single card. */}
      {rows.length > 0 && (
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="border-b border-border px-4 py-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-light">
              {vt.portfolioTitle}
            </span>
          </div>
          <div className="grid grid-cols-2 divide-x divide-border md:grid-cols-4">
            <div className="px-4 py-4">
              <p className="mb-1 text-xs text-muted">{vt.totalDeposited}</p>
              <p className="text-sm font-bold text-foreground">
                {fmtUsd(summary.dep)}
              </p>
            </div>
            <div className="px-4 py-4">
              <p className="mb-1 text-xs text-muted">{vt.totalEarnings}</p>
              <p className="text-sm font-bold text-success">
                {fmtUsd(summary.earn)}
              </p>
            </div>
            <div className="px-4 py-4">
              <p className="mb-1 text-xs text-muted">{vt.netApy}</p>
              <p className="text-sm font-bold text-success">
                {summary.netApy.toFixed(2)}%
              </p>
            </div>
            <div className="px-4 py-4">
              <p className="mb-1 text-xs text-muted">{vt.projectedYield}</p>
              <p className="text-sm font-bold text-foreground">
                {fmtUsd(summary.projected)}
              </p>
            </div>
          </div>
        </div>
      )}

      {visibleVaults.length === 0 ? (
        <p className="text-xs font-mono text-muted-light">
          {loading ? vt.loading : vt.noVaults}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {visibleVaults.map((v) => {
            const row = rowByVault.get(v.id);
            const pos = posByVault.get(v.id);
            return (
              <VaultCard
                key={v.id}
                v={v}
                row={row}
                t={t}
                canAct={isAuthenticated && isMainnet}
                isMainnet={isMainnet}
                onDeposit={() => setAction({ mode: "deposit", vault: v })}
                onWithdraw={() =>
                  setAction({ mode: "withdraw", vault: v, position: pos })
                }
                // Claim withdraws only the accrued yield (value − deposited),
                // leaving the principal invested — mirrors Neko's "Claim".
                onClaim={() =>
                  row &&
                  setAction({
                    mode: "claim",
                    vault: v,
                    position: pos,
                    presetAmount: row.earnings.toFixed(ASSET_DP),
                  })
                }
              />
            );
          })}
        </div>
      )}

      {action && (
        <VaultActionModal
          mode={action.mode}
          vault={action.vault}
          position={action.position}
          presetAmount={action.presetAmount}
          onClose={() => setAction(null)}
          onDone={load}
        />
      )}
    </div>
  );
}
