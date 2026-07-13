"use client";

import { usePollar } from "@pollar/react";
import { useSearchParams } from "next/navigation";
import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import {
  nekoGet,
  type PoolCatalog,
  type PoolEntry,
  type Positions,
  type PriceMap,
} from "../_lib";
import { fmtPct, fmtUsd } from "../_format";
import { NekoBanner, TabSwitch, TokenBadge, TokenBadges } from "../_ui";
import { PoolDetailModal } from "../PoolDetailModal";
import {
  flattenPools,
  poolBorrowApy,
  poolSupplyApy,
  poolTokenCodes,
  poolUsd,
  poolUsdLabel,
  PROTOCOL_LABEL,
} from "../_poolData";

type ProtocolFilter = "all" | "blend" | "aqua" | "soroswap";
type SortKey = "liquidity" | "supplyApy" | "borrowApy";

export default function NekoPoolsPage() {
  const { t } = useI18n();
  const p = t.nekoPools;
  const { isAuthenticated, wallet } = usePollar();
  const walletAddress = wallet?.address ?? "";

  const [pools, setPools] = useState<PoolEntry[]>([]);
  const [prices, setPrices] = useState<PriceMap | null>(null);
  const [positions, setPositions] = useState<Positions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const searchParams = useSearchParams();
  const [view, setView] = useState<"pools" | "positions">(
    searchParams.get("tab") === "positions" ? "positions" : "pools",
  );
  const [selected, setSelected] = useState<PoolEntry | null>(null);
  const [protocol, setProtocol] = useState<ProtocolFilter>("all");
  const [sort, setSort] = useState<SortKey>("liquidity");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cat = await nekoGet<PoolCatalog>("/dashboard/pool-catalog");
      const entries = flattenPools(cat);
      setPools(entries);
      const codes = poolTokenCodes(entries);
      if (codes.length) {
        await nekoGet<PriceMap>(`/dashboard/prices?symbols=${codes.join(",")}`)
          .then(setPrices)
          .catch(() => {});
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : String(e));
    } finally {
      setLoading(false);
    }
    if (walletAddress) {
      await nekoGet<Positions>(`/dashboard/positions/${walletAddress}`)
        .then(setPositions)
        .catch(() => {});
    }
  }, [walletAddress]);

  useEffect(() => {
    // Sync to the external API on mount / when the wallet changes.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const visiblePools = useMemo(() => {
    const q = query.trim().toLowerCase();
    const filtered = pools.filter((pl) => {
      if (protocol !== "all" && pl.type !== protocol) return false;
      if (!q) return true;
      return (
        pl.name.toLowerCase().includes(q) ||
        pl.tokens.some((tk) => tk.code.toLowerCase().includes(q))
      );
    });
    const sorted = [...filtered].sort((a, b) => {
      if (sort === "liquidity") {
        return (
          (poolUsd(b.tvl, b.tokens[0], prices) ?? 0) -
          (poolUsd(a.tvl, a.tokens[0], prices) ?? 0)
        );
      }
      if (sort === "supplyApy") {
        return (poolSupplyApy(b) ?? 0) - (poolSupplyApy(a) ?? 0);
      }
      return (poolBorrowApy(b) ?? 0) - (poolBorrowApy(a) ?? 0);
    });
    return sorted;
  }, [pools, protocol, query, sort, prices]);

  const poolPositions = positions?.poolPositions ?? [];

  const selCls =
    "rounded-lg border border-border bg-transparent px-3 py-1.5 text-xs font-medium text-foreground outline-none focus:border-primary";

  return (
    <div className="w-full space-y-6">
      <NekoBanner eyebrow={p.bannerTag} title={p.title} desc={p.tagline} />

      <div className="flex items-center justify-between gap-3">
        <TabSwitch
          options={[
            { value: "pools", label: p.tabPools },
            { value: "positions", label: p.tabPositions },
          ]}
          value={view}
          onChange={setView}
        />
        <button
          onClick={load}
          disabled={loading}
          className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors"
        >
          {loading ? p.loading : p.refresh}
        </button>
      </div>

      {error && (
        <div className="rounded-lg border border-error/40 bg-error/5 px-4 py-3 text-xs font-mono text-error">
          {error}
        </div>
      )}

      {view === "pools" ? (
        <>
          {/* toolbar */}
          <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
            <div className="flex flex-wrap items-center gap-2">
              <select
                value={protocol}
                onChange={(e) => setProtocol(e.target.value as ProtocolFilter)}
                className={selCls}
              >
                <option value="all">{p.allProtocols}</option>
                <option value="blend">Blend</option>
                <option value="aqua">Aqua</option>
                <option value="soroswap">Soroswap</option>
              </select>
              <select
                value={sort}
                onChange={(e) => setSort(e.target.value as SortKey)}
                className={selCls}
              >
                <option value="liquidity">
                  {p.sortBy}: {p.sortLiquidity}
                </option>
                <option value="supplyApy">
                  {p.sortBy}: {p.sortSupplyApy}
                </option>
                <option value="borrowApy">
                  {p.sortBy}: {p.sortBorrowApy}
                </option>
              </select>
            </div>
            <input
              value={query}
              onChange={(e) => setQuery(e.target.value)}
              placeholder={p.searchPh}
              className="rounded-full border border-border bg-transparent px-4 py-2 text-sm outline-none placeholder:text-muted-light focus:border-primary sm:w-64"
            />
          </div>

          {visiblePools.length === 0 ? (
            <p className="text-xs font-mono text-muted-light">
              {loading ? p.loading : p.noResults}
            </p>
          ) : (
            <div className="overflow-x-auto rounded-2xl border border-border">
              <table className="w-full min-w-[720px] text-left text-xs sm:text-sm">
                <thead>
                  <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-light">
                    <th className="px-4 py-2.5 font-medium">{p.protocol}</th>
                    <th className="px-4 py-2.5 font-medium">{p.pool}</th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      {p.supplyApy}
                    </th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      {p.liquidity}
                    </th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      {p.borrowed}
                    </th>
                    <th className="px-4 py-2.5 font-medium text-right">
                      {p.borrowApy}
                    </th>
                  </tr>
                </thead>
                <tbody>
                  {visiblePools.map((pl) => (
                    <tr
                      key={pl.id}
                      onClick={() => setSelected(pl)}
                      className="cursor-pointer border-b border-border/50 last:border-0 hover:bg-surface/50"
                    >
                      <td className="px-4 py-2.5 text-muted whitespace-nowrap">
                        {PROTOCOL_LABEL[pl.type] ?? pl.type}
                      </td>
                      <td className="px-4 py-2.5">
                        <div className="flex items-center gap-2">
                          <TokenBadges
                            symbols={pl.tokens.map((tk) => tk.code)}
                            size={22}
                          />
                          <span className="font-medium text-foreground">
                            {pl.name}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-success">
                        {fmtPct(poolSupplyApy(pl))}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-foreground">
                        {poolUsdLabel(pl.tvl, pl.tokens[0], prices)}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-muted">
                        {poolUsdLabel(
                          pl.metadata?.totalLiabilities,
                          pl.tokens[0],
                          prices,
                        )}
                      </td>
                      <td className="px-4 py-2.5 text-right font-mono text-muted">
                        {fmtPct(poolBorrowApy(pl))}
                      </td>
                    </tr>
                  ))}
                </tbody>
              </table>
            </div>
          )}
        </>
      ) : !isAuthenticated ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
          <p className="text-sm text-muted">{p.connect}</p>
        </div>
      ) : poolPositions.length === 0 ? (
        <p className="text-xs font-mono text-muted-light">
          {loading ? p.loading : p.noPositions}
        </p>
      ) : (
        <div className="overflow-hidden rounded-2xl border border-border">
          <div className="border-b border-border px-4 py-3">
            <span className="text-[10px] font-mono uppercase tracking-wider text-muted-light">
              {p.posTitle}
            </span>
          </div>
          <div className="overflow-x-auto">
            <table className="w-full min-w-[640px] text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-light">
                  <th className="px-4 py-2.5 font-medium">{p.protocol}</th>
                  <th className="px-4 py-2.5 font-medium">{p.pool}</th>
                  <th className="px-4 py-2.5 font-medium text-right">
                    {p.deposited}
                  </th>
                  <th className="px-4 py-2.5 font-medium text-right">
                    {p.value}
                  </th>
                  <th className="px-4 py-2.5 font-medium text-right">
                    {p.apy}
                  </th>
                  <th className="px-4 py-2.5 font-medium text-right">
                    {p.actions}
                  </th>
                </tr>
              </thead>
              <tbody>
                {poolPositions.map((pp) => {
                  const token = pp.pool.tokens[0];
                  const code = token?.code ?? "—";
                  const depNum = Number(pp.position.depositedFormatted) || 0;
                  const price = prices?.prices?.[code]?.price ?? null;
                  return (
                    <tr
                      key={pp.position.poolId}
                      className="border-b border-border/50 last:border-0"
                    >
                      <td className="px-4 py-3">
                        <div className="flex items-center gap-2">
                          <TokenBadge symbol={code} size={22} />
                          <span className="text-muted">
                            {PROTOCOL_LABEL[pp.pool.type] ?? pp.pool.type}
                          </span>
                        </div>
                      </td>
                      <td className="px-4 py-3 font-medium text-foreground">
                        {pp.pool.name}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">
                        {pp.position.depositedFormatted} {code}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-foreground">
                        {price != null ? fmtUsd(depNum * price) : "—"}
                      </td>
                      <td className="px-4 py-3 text-right font-mono text-success">
                        {fmtPct(poolSupplyApy(pp.pool))}
                      </td>
                      <td className="px-4 py-3 text-right">
                        <button
                          onClick={() => setSelected(pp.pool)}
                          className="text-[11px] font-medium text-primary hover:underline"
                        >
                          {p.manage}
                        </button>
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        </div>
      )}

      {selected && (
        <PoolDetailModal
          pool={selected}
          allPools={pools}
          prices={prices}
          positions={positions}
          onClose={() => setSelected(null)}
          onDone={load}
          onRefresh={load}
        />
      )}
    </div>
  );
}
