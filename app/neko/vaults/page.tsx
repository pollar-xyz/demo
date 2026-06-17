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
import { fmtUsd, scaleAmount } from "../_format";
import { ASSET_DP } from "../_vault";
import {
  VaultActionModal,
  type VaultPositionLite,
} from "../VaultActionModal";

const NEKO_APP = "https://app.nekoprotocol.xyz";
const SHARES_DP = 7; // DeFindex vault share decimals
const PPS_DP = 12; // price-per-share fixed-point decimals

// Vault asset icons are served by the Neko app (relative) or a CDN (absolute).
function iconUrl(src?: string): string | null {
  if (!src) return null;
  return src.startsWith("http") ? src : `${NEKO_APP}${src}`;
}

function parseApy(s?: string): number | null {
  if (!s || s === "-") return null;
  const n = Number(s.replace("%", ""));
  return Number.isFinite(n) ? n : null;
}

// The backend proxy returns raw on-chain vault data; the UI wants display-ready
// rows. TVL = total managed funds (underlying units) × USD price — both come
// from the proxy response, with prices keyed by the asset's contract address.
// APY arrives as a bare number, so we stringify it to the "6.78%" form the card
// already renders. Icons/network/category aren't in the raw data (the card
// falls back to the asset-symbol badge).
function mapDefindexVaults(res: DefindexVaultsResponse): VaultCatalogEntry[] {
  const prices = res.prices ?? {};
  return (res.vaults ?? []).map(({ contractId, info }) => {
    const fund = info.totalManagedFunds?.[0];
    const asset = info.assets?.[0];
    const assetAddr = fund?.asset ?? asset?.address;
    const price = assetAddr ? prices[assetAddr] : undefined;
    const underlying = fund ? scaleAmount(fund.total_amount, ASSET_DP) : 0;
    return {
      id: contractId,
      name: info.name,
      supplyAsset: {
        symbol: asset?.symbol ?? info.symbol,
        name: asset?.name,
        contractAddress: asset?.address,
      },
      tvl: price != null ? fmtUsd(underlying * price) : undefined,
      apy7d: info.apy != null ? `${info.apy.toFixed(2)}%` : undefined,
    };
  });
}

type VaultPositionRow = {
  vaultId: string;
  name: string;
  asset: string;
  icon: string | null;
  deposited: number; // asset units
  value: number; // asset units
  earnings: number; // asset units
  apy: number | null;
  price: number | null;
};

function VaultCard({
  v,
  t,
  canAct,
  canWithdraw,
  onDeposit,
  onWithdraw,
}: {
  v: VaultCatalogEntry;
  t: ReturnType<typeof useI18n>["t"];
  canAct: boolean;
  canWithdraw: boolean;
  onDeposit: () => void;
  onWithdraw: () => void;
}) {
  const icon = iconUrl(v.supplyAsset.iconSrc);
  return (
    <div className="rounded-2xl border border-border bg-background p-5 space-y-4">
      <div className="flex items-start gap-3">
        {icon ? (
          // eslint-disable-next-line @next/next/no-img-element
          <img
            src={icon}
            alt={v.supplyAsset.symbol}
            className="h-9 w-9 rounded-full bg-surface object-contain"
          />
        ) : (
          <div className="h-9 w-9 rounded-full bg-surface flex items-center justify-center text-[10px] font-bold text-muted">
            {v.supplyAsset.symbol.slice(0, 3)}
          </div>
        )}
        <div className="min-w-0 flex-1">
          <p className="text-sm font-bold text-foreground truncate">{v.name}</p>
          <div className="mt-0.5 flex items-center gap-2">
            {v.category && (
              <span className="rounded-md bg-primary-light px-1.5 py-0.5 text-[10px] font-semibold text-primary capitalize">
                {v.category}
              </span>
            )}
            <span className="text-[10px] font-mono text-muted-light">
              {v.supplyAsset.symbol}
              {v.supplyAsset.network ? ` · ${v.supplyAsset.network}` : ""}
            </span>
          </div>
        </div>
      </div>

      <div className="flex items-end justify-between">
        <div>
          <p className="text-[10px] font-mono text-muted-light uppercase tracking-wider">
            {t.nekoVaults.tvl}
          </p>
          <p className="text-sm font-bold text-foreground">{v.tvl ?? "—"}</p>
        </div>
        <div className="text-right">
          <p className="text-[10px] font-mono text-muted-light uppercase tracking-wider">
            {t.nekoVaults.apy}
          </p>
          <p className="text-sm font-bold text-success">
            {v.apy7d && v.apy7d !== "-" ? v.apy7d : "—"}
          </p>
        </div>
      </div>

      <div
        className="grid grid-cols-2 gap-2"
        title={canAct ? undefined : t.nekoVaults.connect}
      >
        <button
          onClick={onDeposit}
          disabled={!canAct}
          className="rounded-lg bg-primary px-3 py-1.5 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {t.nekoVaults.deposit}
        </button>
        <button
          onClick={onWithdraw}
          disabled={!canAct || !canWithdraw}
          className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 disabled:cursor-not-allowed transition-colors"
        >
          {t.nekoVaults.withdraw}
        </button>
      </div>

      <p className="text-[10px] font-mono text-muted-light">
        {t.nekoVaults.createdBy} {v.createdBy ?? "—"}
      </p>
    </div>
  );
}

export default function NekoVaultsPage() {
  const { t } = useI18n();
  const { isAuthenticated, walletAddress } = usePollar();

  const [vaults, setVaults] = useState<VaultCatalogEntry[]>([]);
  const [positions, setPositions] = useState<Positions | null>(null);
  const [audit, setAudit] = useState<AuditRecord[]>([]);
  const [prices, setPrices] = useState<PriceMap | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"vaults" | "positions">("vaults");
  const [action, setAction] = useState<{
    mode: "deposit" | "withdraw";
    vault: VaultCatalogEntry;
    position?: VaultPositionLite;
  } | null>(null);

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
      setPositions(pos.status === "fulfilled" ? pos.value : null);
      setAudit(aud.status === "fulfilled" ? aud.value : []);
      // Prices for the assets of vaults the wallet actually holds.
      const ids = new Set(
        (pos.status === "fulfilled" ? pos.value.vaultPositions : []).map(
          (vp) => String(vp.vaultId),
        ),
      );
      const symbols = Array.from(
        new Set(
          catalog
            .filter((v) => ids.has(v.id))
            .map((v) => v.supplyAsset.symbol),
        ),
      );
      if (symbols.length) {
        await nekoGet<PriceMap>(`/dashboard/prices?symbols=${symbols.join(",")}`)
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

  const posByVault = useMemo(() => {
    const m = new Map<string, VaultPositionLite>();
    for (const vp of positions?.vaultPositions ?? []) {
      m.set(String(vp.vaultId), {
        userShares: String(vp.userShares),
        pricePerShare: String(vp.pricePerShare),
      });
    }
    return m;
  }, [positions]);

  // Join positions ⨯ catalog ⨯ audit ⨯ prices into displayable vault rows.
  const rows: VaultPositionRow[] = useMemo(() => {
    if (!positions) return [];
    const catById = new Map(vaults.map((v) => [v.id, v]));
    const out: VaultPositionRow[] = [];
    for (const vp of positions.vaultPositions) {
      const id = String(vp.vaultId);
      const cat = catById.get(id);
      if (!cat) continue; // only DeFindex catalog vaults belong on this tab
      const shares = Number(vp.userShares);
      const pps = Number(vp.pricePerShare);
      const value = (shares * pps) / 10 ** (SHARES_DP + PPS_DP);
      const deposited = audit
        .filter((a) => a.pool_id === id)
        .reduce((sum, a) => {
          if (a.action_type === "vaults_deposit")
            return sum + (a.token_amount_in || 0);
          if (a.action_type === "vaults_withdraw")
            return sum - (a.token_amount_in || 0);
          return sum;
        }, 0);
      out.push({
        vaultId: id,
        name: cat.name,
        asset: cat.supplyAsset.symbol,
        icon: iconUrl(cat.supplyAsset.iconSrc),
        deposited,
        value,
        earnings: value - deposited,
        apy: parseApy(cat.apy7d),
        price: prices?.prices?.[cat.supplyAsset.symbol]?.price ?? null,
      });
    }
    return out;
  }, [positions, vaults, audit, prices]);

  const summary = useMemo(() => {
    let dep = 0;
    let val = 0;
    let earn = 0;
    let apyWeighted = 0;
    for (const r of rows) {
      const p = r.price ?? 0;
      dep += r.deposited * p;
      val += r.value * p;
      earn += r.earnings * p;
      if (r.apy != null) apyWeighted += r.apy * r.value * p;
    }
    const netApy = val > 0 ? apyWeighted / val : 0;
    return { dep, val, earn, netApy, projected: (val * netApy) / 100 };
  }, [rows]);

  return (
    <div className="w-full space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t.nekoVaults.title}
          </h1>
          <p className="text-sm text-muted max-w-2xl">{t.nekoVaults.desc}</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors"
        >
          {loading ? t.nekoVaults.loading : t.nekoVaults.refresh}
        </button>
      </header>

      <div className="flex items-center gap-2">
        {(["vaults", "positions"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              view === v
                ? "bg-primary text-white"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {v === "vaults" ? t.nekoVaults.tabVaults : t.nekoVaults.tabPositions}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-error/40 bg-error/5 px-4 py-3 text-xs font-mono text-error">
          {error}
        </div>
      )}

      {view === "vaults" ? (
        vaults.length === 0 ? (
          <p className="text-xs font-mono text-muted-light">
            {loading ? t.nekoVaults.loading : t.nekoVaults.noVaults}
          </p>
        ) : (
          <>
            <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
              {vaults.map((v) => (
                <VaultCard
                  key={v.id}
                  v={v}
                  t={t}
                  canAct={isAuthenticated}
                  canWithdraw={posByVault.has(v.id)}
                  onDeposit={() => setAction({ mode: "deposit", vault: v })}
                  onWithdraw={() =>
                    setAction({
                      mode: "withdraw",
                      vault: v,
                      position: posByVault.get(v.id),
                    })
                  }
                />
              ))}
            </div>
          </>
        )
      ) : !isAuthenticated ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
          <p className="text-sm text-muted">{t.nekoVaults.connect}</p>
        </div>
      ) : rows.length === 0 ? (
        <p className="text-xs font-mono text-muted-light">
          {loading ? t.nekoVaults.loading : t.nekoVaults.noPositions}
        </p>
      ) : (
        <div className="space-y-6">
          {/* portfolio summary */}
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-light">
                {t.nekoVaults.portfolioTitle}
              </span>
            </div>
            <div className="grid grid-cols-2 md:grid-cols-4 divide-x divide-border">
              <div className="px-4 py-4">
                <p className="text-xs text-muted mb-1">
                  {t.nekoVaults.totalDeposited}
                </p>
                <p className="text-sm font-bold text-foreground">
                  {fmtUsd(summary.dep)}
                </p>
              </div>
              <div className="px-4 py-4">
                <p className="text-xs text-muted mb-1">
                  {t.nekoVaults.totalEarnings}
                </p>
                <p className="text-sm font-bold text-success">
                  {fmtUsd(summary.earn)}
                </p>
              </div>
              <div className="px-4 py-4">
                <p className="text-xs text-muted mb-1">{t.nekoVaults.netApy}</p>
                <p className="text-sm font-bold text-success">
                  {summary.netApy.toFixed(2)}%
                </p>
              </div>
              <div className="px-4 py-4">
                <p className="text-xs text-muted mb-1">
                  {t.nekoVaults.projectedYield}
                </p>
                <p className="text-sm font-bold text-foreground">
                  {fmtUsd(summary.projected)}
                </p>
              </div>
            </div>
          </div>

          {/* positions table */}
          <div className="rounded-2xl border border-border overflow-hidden">
            <div className="px-4 py-3 border-b border-border">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-light">
                {t.nekoVaults.posTitle}
              </span>
            </div>
            <div className="overflow-x-auto">
              <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-light">
                    <th className="px-4 py-2.5 font-medium">
                      {t.nekoVaults.vaultCol}
                    </th>
                    <th className="px-4 py-2.5 font-medium">
                      {t.nekoVaults.assetCol}
                    </th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      {t.nekoVaults.deposited}
                    </th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      {t.nekoVaults.earnings}
                    </th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      {t.nekoVaults.value}
                    </th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      {t.nekoVaults.apyPos}
                    </th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      {t.nekoVaults.claim}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {rows.map((r) => (
                    <tr
                      key={r.vaultId}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          {r.icon && (
                            // eslint-disable-next-line @next/next/no-img-element
                            <img
                              src={r.icon}
                              alt={r.asset}
                              className="h-6 w-6 rounded-full bg-surface object-contain"
                            />
                          )}
                          <span className="font-medium text-foreground">
                            {r.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 text-muted">{r.asset}</td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">
                        {r.deposited.toFixed(2)} {r.asset}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-success">
                        {r.price != null
                          ? `+${fmtUsd(r.earnings * r.price)}`
                          : `${r.earnings.toFixed(4)} ${r.asset}`}
                      </td>
                      <td className="px-4 py-3 text-right font-mono">
                        <span className="text-success">
                          {r.value.toFixed(2)} {r.asset}
                        </span>
                        {r.price != null && (
                          <span className="block text-[10px] text-muted-light">
                            {fmtUsd(r.value * r.price)}
                          </span>
                        )}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-success">
                        {r.apy != null ? `${r.apy.toFixed(2)}%` : "—"}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          disabled
                          title={t.nekoVaults.actionsSoon}
                          className="rounded-lg bg-primary px-2.5 py-1 text-xs font-semibold text-white opacity-50 cursor-not-allowed"
                        >
                          {t.nekoVaults.claim}
                        </button>
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          </div>
        </div>
      )}

      {action && (
        <VaultActionModal
          mode={action.mode}
          vault={action.vault}
          position={action.position}
          onClose={() => setAction(null)}
          onDone={load}
        />
      )}
    </div>
  );
}
