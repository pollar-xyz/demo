"use client";

import { usePollar } from "@pollar/react";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import {
  nekoGet,
  type PoolCatalog,
  type PoolEntry,
  type Positions,
  type PriceMap,
} from "../_lib";
import { fmtPct, fmtUsd, pick, scaleAmount } from "../_format";

const PROTOCOL_LABEL: Record<string, string> = {
  blend: "Blend",
  aqua: "Aqua",
  soroswap: "Soroswap",
};

function flatten(cat: PoolCatalog): PoolEntry[] {
  return [...(cat.blend ?? []), ...(cat.aqua ?? []), ...(cat.soroswap ?? [])];
}

export default function NekoPoolsPage() {
  const { t } = useI18n();
  const { isAuthenticated, wallet } = usePollar();
  const walletAddress = wallet?.address ?? "";

  const [pools, setPools] = useState<PoolEntry[]>([]);
  const [prices, setPrices] = useState<PriceMap | null>(null);
  const [positions, setPositions] = useState<Positions | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [view, setView] = useState<"pools" | "positions">("pools");

  const load = useCallback(async () => {
    setLoading(true);
    setError(null);
    try {
      const cat = await nekoGet<PoolCatalog>("/dashboard/pool-catalog");
      const entries = flatten(cat);
      setPools(entries);
      const codes = Array.from(
        new Set(entries.map((p) => p.tokens[0]?.code).filter(Boolean)),
      );
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

  function usdOf(raw: string | undefined, token: PoolEntry["tokens"][0]) {
    if (!raw || !token) return "—";
    const amt = scaleAmount(raw, token.decimals);
    if (amt <= 0) return "—";
    const price = prices?.prices?.[token.code]?.price;
    return price != null
      ? fmtUsd(amt * price)
      : `${amt.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${token.code}`;
  }

  const poolPositions = positions?.poolPositions ?? [];

  return (
    <div className="w-full space-y-6">
      <header className="flex items-start justify-between gap-4">
        <div className="space-y-2">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {t.nekoPools.title}
          </h1>
          <p className="text-sm text-muted max-w-2xl">{t.nekoPools.desc}</p>
        </div>
        <button
          onClick={load}
          disabled={loading}
          className="shrink-0 rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors"
        >
          {loading ? t.nekoPools.loading : t.nekoPools.refresh}
        </button>
      </header>

      <div className="flex items-center gap-2">
        {(["pools", "positions"] as const).map((v) => (
          <button
            key={v}
            onClick={() => setView(v)}
            className={`rounded-full px-3 py-1.5 text-xs font-medium transition-colors ${
              view === v
                ? "bg-primary text-white"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {v === "pools" ? t.nekoPools.tabPools : t.nekoPools.tabPositions}
          </button>
        ))}
      </div>

      {error && (
        <div className="rounded-lg border border-error/40 bg-error/5 px-4 py-3 text-xs font-mono text-error">
          {error}
        </div>
      )}

      {view === "pools" ? (
        pools.length === 0 ? (
          <p className="text-xs font-mono text-muted-light">
            {loading ? t.nekoPools.loading : t.nekoPools.noPools}
          </p>
        ) : (
          <div className="overflow-x-auto rounded-xl border border-border">
            <table className="w-full text-left text-xs sm:text-sm">
              <thead>
                <tr className="border-b border-border text-[10px] font-mono uppercase tracking-wider text-muted-light">
                  <th className="px-3 py-2.5 font-medium">
                    {t.nekoPools.protocol}
                  </th>
                  <th className="px-3 py-2.5 font-medium">
                    {t.nekoPools.pool}
                  </th>
                  <th className="px-3 py-2.5 font-medium text-right">
                    {t.nekoPools.supplyApy}
                  </th>
                  <th className="px-3 py-2.5 font-medium text-right">
                    {t.nekoPools.liquidity}
                  </th>
                  <th className="px-3 py-2.5 font-medium text-right">
                    {t.nekoPools.borrowed}
                  </th>
                  <th className="px-3 py-2.5 font-medium text-right">
                    {t.nekoPools.borrowApy}
                  </th>
                </tr>
              </thead>
              <tbody>
                {pools.map((p) => {
                  const supply =
                    p.type === "blend" ? p.metadata?.supplyApy : p.apy;
                  return (
                    <tr
                      key={p.id}
                      className="border-b border-border/50 last:border-0 hover:bg-surface/50"
                    >
                      <td className="px-3 py-2.5 text-muted whitespace-nowrap">
                        {PROTOCOL_LABEL[p.type] ?? p.type}
                      </td>
                      <td className="px-3 py-2.5 font-medium text-foreground">
                        {p.name}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-success">
                        {fmtPct(supply)}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-foreground">
                        {usdOf(p.tvl, p.tokens[0])}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-muted">
                        {usdOf(p.metadata?.totalLiabilities, p.tokens[0])}
                      </td>
                      <td className="px-3 py-2.5 text-right font-mono text-muted">
                        {p.type === "blend"
                          ? fmtPct(p.metadata?.borrowApy)
                          : "—"}
                      </td>
                    </tr>
                  );
                })}
              </tbody>
            </table>
          </div>
        )
      ) : !isAuthenticated ? (
        <div className="rounded-2xl border border-border bg-surface px-6 py-10 text-center">
          <p className="text-sm text-muted">{t.nekoPools.connect}</p>
        </div>
      ) : poolPositions.length === 0 ? (
        <p className="text-xs font-mono text-muted-light">
          {loading ? t.nekoPools.loading : t.nekoPools.noPositions}
        </p>
      ) : (
        <div className="grid gap-3 sm:grid-cols-2">
          {poolPositions.map((pos, i) => (
            <div
              key={pick(pos, ["poolId", "id"]) ?? i}
              className="rounded-2xl border border-border bg-background p-4 space-y-1.5"
            >
              <p className="text-sm font-bold text-foreground break-all">
                {pick(pos, ["poolId", "id", "name"]) ?? "—"}
              </p>
              <p className="text-xs font-mono text-muted">
                {t.nekoPools.deposited}:{" "}
                <span className="text-foreground">
                  {pick(pos, ["depositedFormatted", "deposited"]) ?? "—"}
                </span>
              </p>
              <p className="text-xs font-mono text-muted">
                {t.nekoPools.rewards}:{" "}
                <span className="text-success">
                  {pick(pos, ["rewardsFormatted", "rewards"]) ?? "—"}
                </span>
              </p>
            </div>
          ))}
        </div>
      )}
    </div>
  );
}
