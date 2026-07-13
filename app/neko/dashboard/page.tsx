"use client";

import { usePollar } from "@pollar/react";
import Link from "next/link";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import {
  nekoGet,
  type BondYield,
  type AuditRecord,
  type DefindexVaultsResponse,
  type PoolCatalog,
  type PoolEntry,
  type Positions,
  type PriceMap,
  type VaultCatalogEntry,
} from "../_lib";
import { fmtPct, fmtUsd } from "../_format";
import { NekoBanner, StatCard, TokenBadge, TokenBadges } from "../_ui";
import { DISCOVER_ASSETS } from "../_assets";
import {
  flattenPools,
  poolBorrowApy,
  poolSupplyApy,
  poolTokenCodes,
  poolUsd,
  poolUsdLabel,
  PROTOCOL_LABEL,
} from "../_poolData";
import {
  computeVaultRows,
  computeVaultSummary,
  mapDefindexVaults,
  parseApy,
} from "../_vaultData";
import { NekoDevTools } from "./_DevTools";

// icons (inline, currentColor)
const IconDollar = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="M12 1v22M17 5H9.5a3.5 3.5 0 0 0 0 7h5a3.5 3.5 0 0 1 0 7H6" />
  </svg>
);
const IconLayers = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m12 2 9 5-9 5-9-5 9-5ZM3 12l9 5 9-5M3 17l9 5 9-5" />
  </svg>
);
const IconTrend = (
  <svg
    width="14"
    height="14"
    viewBox="0 0 24 24"
    fill="none"
    stroke="currentColor"
    strokeWidth="2"
  >
    <path d="m3 17 6-6 4 4 8-8M21 7v6h-6" />
  </svg>
);

const NEKO_SYMBOLS = DISCOVER_ASSETS.map((a) => a.symbol);

export default function NekoDashboardPage() {
  const { t } = useI18n();
  const { isAuthenticated, wallet } = usePollar();
  const walletAddress = wallet?.address ?? "";
  const d = t.neko;

  const [pools, setPools] = useState<PoolEntry[]>([]);
  const [vaults, setVaults] = useState<VaultCatalogEntry[]>([]);
  const [positions, setPositions] = useState<Positions | null>(null);
  const [audit, setAudit] = useState<AuditRecord[]>([]);
  const [yields, setYields] = useState<BondYield[]>([]);
  const [prices, setPrices] = useState<PriceMap | null>(null);
  const [loading, setLoading] = useState(false);

  const load = useCallback(async () => {
    setLoading(true);
    const [cat, vres, by] = await Promise.allSettled([
      nekoGet<PoolCatalog>("/dashboard/pool-catalog"),
      nekoGet<DefindexVaultsResponse>("/v1/defindex/vaults"),
      nekoGet<BondYield[]>("/v1/etherfuse/bond-yields"),
    ]);
    const poolEntries =
      cat.status === "fulfilled" ? flattenPools(cat.value) : [];
    const vaultCatalog =
      vres.status === "fulfilled" ? mapDefindexVaults(vres.value) : [];
    setPools(poolEntries);
    setVaults(vaultCatalog);
    setYields(by.status === "fulfilled" ? by.value : []);

    if (walletAddress) {
      const [pos, aud] = await Promise.allSettled([
        nekoGet<Positions>(`/dashboard/positions/${walletAddress}`),
        nekoGet<AuditRecord[]>(`/v1/audit?limit=50&wallet=${walletAddress}`),
      ]);
      setPositions(pos.status === "fulfilled" ? pos.value : null);
      setAudit(aud.status === "fulfilled" ? aud.value : []);
    }

    // Prices for every symbol we may render (discover assets + pool tokens +
    // vault assets), keyed by symbol.
    const codes = Array.from(
      new Set([
        ...NEKO_SYMBOLS,
        ...poolTokenCodes(poolEntries),
        ...vaultCatalog.map((v) => v.supplyAsset.symbol),
      ]),
    ).filter(Boolean);
    if (codes.length) {
      await nekoGet<PriceMap>(`/dashboard/prices?symbols=${codes.join(",")}`)
        .then(setPrices)
        .catch(() => {});
    }
    setLoading(false);
  }, [walletAddress]);

  useEffect(() => {
    // Sync to the external API on mount / when the wallet changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const vaultRows = useMemo(
    () => computeVaultRows(positions, vaults, audit, prices),
    [positions, vaults, audit, prices],
  );
  const vaultSummary = useMemo(
    () => computeVaultSummary(vaultRows),
    [vaultRows],
  );

  const poolRows = useMemo(() => {
    return (positions?.poolPositions ?? []).map((pp) => {
      const token = pp.pool.tokens[0];
      const depNum = Number(pp.position.depositedFormatted) || 0;
      const price = prices?.prices?.[token?.code ?? ""]?.price ?? null;
      return {
        id: pp.position.poolId,
        name: pp.pool.name,
        code: token?.code ?? "—",
        apy: poolSupplyApy(pp.pool),
        depositedFormatted: pp.position.depositedFormatted,
        valueUsd: price != null ? depNum * price : null,
      };
    });
  }, [positions, prices]);

  const stats = useMemo(() => {
    const poolUsdTotal = poolRows.reduce((s, r) => s + (r.valueUsd ?? 0), 0);
    const portfolio = poolUsdTotal + vaultSummary.val;
    const assetsHeld =
      (positions?.poolPositions.length ?? 0) +
      (positions?.vaultPositions.length ?? 0);
    const highestApy = vaults.reduce<number | null>((max, v) => {
      const a = parseApy(v.apy7d);
      return a != null && (max == null || a > max) ? a : max;
    }, null);
    return { portfolio, assetsHeld, highestApy };
  }, [poolRows, vaultSummary, positions, vaults]);

  const topPools = useMemo(() => {
    return [...pools]
      .map((p) => ({ p, usd: poolUsd(p.tvl, p.tokens[0], prices) ?? 0 }))
      .sort((a, b) => b.usd - a.usd)
      .slice(0, 7)
      .map((x) => x.p);
  }, [pools, prices]);

  const apyBySymbol = useMemo(() => {
    const m = new Map<string, number>();
    for (const y of yields) m.set(y.symbol, y.apy);
    return m;
  }, [yields]);

  const quickActions = [
    { href: "/pollar/swap", title: d.qaSwapTitle, sub: d.qaSwapSub, icon: "⇄" },
    {
      href: "/neko/pools",
      title: d.qaLiquidityTitle,
      sub: d.qaLiquiditySub,
      icon: "💧",
    },
    {
      href: "/neko/vaults",
      title: d.qaVaultTitle,
      sub: d.qaVaultSub,
      icon: "🏦",
    },
    {
      href: "/neko/discover",
      title: d.qaExploreTitle,
      sub: d.qaExploreSub,
      icon: "🔎",
    },
  ];

  return (
    <div className="w-full space-y-6">
      <NekoBanner
        eyebrow={d.eyebrow}
        title={t.nav.dashboard}
        desc={d.overview}
      />

      {/* stat cards */}
      <div className="grid gap-4 sm:grid-cols-3">
        <StatCard
          label={d.statPortfolio}
          value={isAuthenticated ? fmtUsd(stats.portfolio) : "—"}
          icon={IconDollar}
        />
        <StatCard
          label={d.statAssets}
          value={isAuthenticated ? stats.assetsHeld : "—"}
          icon={IconLayers}
        />
        <StatCard
          label={d.statHighestApy}
          value={
            stats.highestApy != null ? `${stats.highestApy.toFixed(2)}%` : "—"
          }
          valueClass="text-success"
          icon={IconTrend}
        />
      </div>

      {/* your positions */}
      {isAuthenticated && (
        <section className="space-y-3">
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {d.yourPositions}
          </h2>

          {/* pool positions */}
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-light">
                {d.poolsLabel}
              </span>
              <Link
                href="/neko/pools"
                className="text-[11px] font-medium text-primary hover:underline"
              >
                {d.manage} →
              </Link>
            </div>
            {poolRows.length === 0 ? (
              <p className="px-4 py-6 text-xs font-mono text-muted-light">
                {loading ? d.loading : d.noPoolPos}
              </p>
            ) : (
              <table className="w-full text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-light">
                    <th className="px-4 py-2 font-medium">{d.colAsset}</th>
                    <th className="px-4 py-2 font-medium">{d.colPosition}</th>
                    <th className="px-4 py-2 font-medium text-right">
                      {d.colDeposited}
                    </th>
                    <th className="px-4 py-2 font-medium text-right">
                      {d.colValue}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {poolRows.map((r) => (
                    <tr
                      key={r.id}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <TokenBadge symbol={r.code} size={26} />
                      </td>
                      <td className="px-4 py-3">
                        <p className="font-medium text-foreground">{r.name}</p>
                        <p className="text-[11px] text-muted">
                          {r.code}{" "}
                          <span className="text-success">
                            {fmtPct(r.apy)} APY
                          </span>
                        </p>
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">
                        {r.depositedFormatted} {r.code}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">
                        {r.valueUsd != null ? fmtUsd(r.valueUsd) : "—"}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            )}
          </div>

          {/* vault positions */}
          <div className="overflow-hidden rounded-2xl border border-border">
            <div className="flex items-center justify-between border-b border-border px-4 py-2.5">
              <span className="text-[10px] font-mono uppercase tracking-wider text-muted-light">
                {d.vaultPositionsLabel}
              </span>
              <Link
                href="/neko/vaults"
                className="text-[11px] font-medium text-primary hover:underline"
              >
                {d.manage} →
              </Link>
            </div>
            {vaultRows.length === 0 ? (
              <p className="px-4 py-6 text-xs font-mono text-muted-light">
                {loading ? d.loading : d.noVaultPos}
              </p>
            ) : (
              <div className="overflow-x-auto">
                <table className="w-full min-w-[680px] text-left text-xs sm:text-sm">
                  <thead>
                    <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-light">
                      <th className="px-4 py-2 font-medium">{d.colVault}</th>
                      <th className="px-4 py-2 font-medium">{d.colAsset}</th>
                      <th className="px-4 py-2 font-medium text-right">
                        {d.colDeposited}
                      </th>
                      <th className="px-4 py-2 font-medium text-right">
                        {d.colEarnings}
                      </th>
                      <th className="px-4 py-2 font-medium text-right">
                        {d.colCurrentValue}
                      </th>
                      <th className="px-4 py-2 font-medium text-right">
                        {d.colApy}
                      </th>
                    </tr>
                  </thead>
                  <tbody>
                    {vaultRows.map((r) => (
                      <tr
                        key={r.vaultId}
                        className="border-b border-border/50 last:border-0"
                      >
                        <td className="px-4 py-3">
                          <div className="flex items-center gap-2">
                            <TokenBadge symbol={r.asset} size={22} />
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
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </section>
      )}

      {/* quick actions */}
      <section className="space-y-3">
        <div>
          <h2 className="text-lg font-bold tracking-tight text-foreground">
            {d.quickActions}
          </h2>
          <p className="text-xs text-muted">{d.quickActionsSub}</p>
        </div>
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-4">
          {quickActions.map((a) => (
            <Link
              key={a.href}
              href={a.href}
              className="rounded-2xl border border-border bg-background p-4 transition-colors hover:border-primary/40"
            >
              <span className="flex h-9 w-9 items-center justify-center rounded-lg bg-surface text-base">
                {a.icon}
              </span>
              <p className="mt-3 text-sm font-semibold text-foreground">
                {a.title}
              </p>
              <p className="text-xs text-muted">{a.sub}</p>
            </Link>
          ))}
        </div>
      </section>

      {/* discover preview */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {d.discoverTitle}
            </h2>
            <p className="text-xs text-muted">{d.discoverSub}</p>
          </div>
          <Link
            href="/neko/discover"
            className="text-[11px] font-medium text-primary hover:underline"
          >
            {d.viewAll} →
          </Link>
        </div>
        <div className="grid gap-4 sm:grid-cols-3">
          {DISCOVER_ASSETS.slice(0, 3).map((a) => {
            const price = prices?.prices?.[a.symbol]?.price;
            const apy = apyBySymbol.get(a.symbol);
            return (
              <div
                key={a.symbol}
                className="rounded-2xl border border-border bg-background p-4"
              >
                <div className="flex items-center gap-3">
                  <TokenBadge symbol={a.symbol} size={32} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">
                      {a.symbol}
                    </p>
                    <p className="truncate text-[11px] text-muted">{a.name}</p>
                  </div>
                </div>
                <div className="mt-3 flex items-baseline gap-2">
                  <span className="text-xl font-bold text-foreground">
                    {price != null && price > 0
                      ? `$${price.toLocaleString(undefined, { minimumFractionDigits: 4, maximumFractionDigits: 4 })}`
                      : "—"}
                  </span>
                  {apy != null && (
                    <span className="text-[11px] font-semibold text-success">
                      ~{apy}% {t.nekoDiscover.apySuffix}
                    </span>
                  )}
                </div>
              </div>
            );
          })}
        </div>
      </section>

      {/* top pools */}
      <section className="space-y-3">
        <div className="flex items-end justify-between">
          <div>
            <h2 className="text-lg font-bold tracking-tight text-foreground">
              {d.topPools}
            </h2>
            <p className="text-xs text-muted">{d.topPoolsSub}</p>
          </div>
          <Link
            href="/neko/pools"
            className="text-[11px] font-medium text-primary hover:underline"
          >
            {d.viewAllPools} →
          </Link>
        </div>
        <div className="overflow-x-auto rounded-2xl border border-border">
          <table className="w-full min-w-[680px] text-left text-xs sm:text-sm">
            <thead>
              <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-light">
                <th className="px-4 py-2.5 font-medium">
                  {t.nekoPools.protocol}
                </th>
                <th className="px-4 py-2.5 font-medium">{t.nekoPools.pool}</th>
                <th className="px-4 py-2.5 font-medium text-right">
                  {t.nekoPools.supplyApy}
                </th>
                <th className="px-4 py-2.5 font-medium text-right">
                  {t.nekoPools.liquidity}
                </th>
                <th className="px-4 py-2.5 font-medium text-right">
                  {t.nekoPools.borrowed}
                </th>
                <th className="px-4 py-2.5 font-medium text-right">
                  {t.nekoPools.borrowApy}
                </th>
              </tr>
            </thead>
            <tbody>
              {topPools.map((p) => (
                <tr
                  key={p.id}
                  className="border-b border-border/50 last:border-0 hover:bg-surface/50"
                >
                  <td className="px-4 py-2.5 text-muted whitespace-nowrap">
                    {PROTOCOL_LABEL[p.type] ?? p.type}
                  </td>
                  <td className="px-4 py-2.5">
                    <div className="flex items-center gap-2">
                      <TokenBadges
                        symbols={p.tokens.map((tk) => tk.code)}
                        size={22}
                      />
                      <span className="font-medium text-foreground">
                        {p.name}
                      </span>
                    </div>
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-success">
                    {fmtPct(poolSupplyApy(p))}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-foreground">
                    {poolUsdLabel(p.tvl, p.tokens[0], prices)}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-muted">
                    {poolUsdLabel(
                      p.metadata?.totalLiabilities,
                      p.tokens[0],
                      prices,
                    )}
                  </td>
                  <td className="px-4 py-2.5 text-right font-mono text-muted">
                    {fmtPct(poolBorrowApy(p))}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </section>

      {/* developer tools (Pollar SDK flow) */}
      {isAuthenticated ? (
        <NekoDevTools walletAddress={walletAddress} />
      ) : (
        <div className="rounded-2xl border border-border bg-surface px-6 py-8 text-center">
          <p className="text-sm text-muted">{d.connect}</p>
        </div>
      )}
    </div>
  );
}
