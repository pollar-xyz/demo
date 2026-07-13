"use client";

import { useCallback, useEffect, useMemo, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { nekoGet, type BondYield, type PriceMap } from "../_lib";
import {
  countByCategory,
  DISCOVER_ASSETS,
  type AssetBadge,
  type AssetCategory,
} from "../_assets";
import { NekoBanner, TabSwitch, TokenBadge } from "../_ui";

const NEKO_APP = "https://app.nekoprotocol.xyz/discover";

type Filter = "all" | AssetCategory;

// Neko's discover prices show a fixed 4 decimals ("$1.0000", "$0.0673").
function fmtSpot(price: number | undefined): string {
  if (price == null || price <= 0) return "—";
  return `$${price.toLocaleString(undefined, {
    minimumFractionDigits: 4,
    maximumFractionDigits: 4,
  })}`;
}

const SYMBOLS = DISCOVER_ASSETS.map((a) => a.symbol).join(",");

export default function NekoDiscoverPage() {
  const { t } = useI18n();
  const d = t.nekoDiscover;

  const [prices, setPrices] = useState<PriceMap | null>(null);
  const [yields, setYields] = useState<BondYield[]>([]);
  const [loading, setLoading] = useState(false);
  const [filter, setFilter] = useState<Filter>("all");
  const [query, setQuery] = useState("");

  const load = useCallback(async () => {
    setLoading(true);
    const [p, y] = await Promise.allSettled([
      nekoGet<PriceMap>(`/dashboard/prices?symbols=${SYMBOLS}`),
      nekoGet<BondYield[]>("/v1/etherfuse/bond-yields"),
    ]);
    setPrices(p.status === "fulfilled" ? p.value : null);
    setYields(y.status === "fulfilled" ? y.value : []);
    setLoading(false);
  }, []);

  useEffect(() => {
    // Sync to the external API on mount.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    load();
  }, [load]);

  const apyBySymbol = useMemo(() => {
    const m = new Map<string, number>();
    for (const y of yields) m.set(y.symbol, y.apy);
    return m;
  }, [yields]);

  const badgeLabel: Record<AssetBadge, string> = {
    stablecoin: d.badgeStablecoin,
    yieldStablecoin: d.badgeYield,
    sovereignBond: d.badgeBond,
    native: d.badgeNative,
  };

  const tabs = [
    { value: "all" as Filter, label: d.tabAll, count: DISCOVER_ASSETS.length },
    {
      value: "stablecoin" as Filter,
      label: d.tabStablecoins,
      count: countByCategory("stablecoin"),
    },
    {
      value: "sovereignBond" as Filter,
      label: d.tabBonds,
      count: countByCategory("sovereignBond"),
    },
    {
      value: "native" as Filter,
      label: d.tabNative,
      count: countByCategory("native"),
    },
  ];

  const filtered = useMemo(() => {
    const q = query.trim().toLowerCase();
    return DISCOVER_ASSETS.filter((a) => {
      if (filter !== "all" && a.category !== filter) return false;
      if (!q) return true;
      return (
        a.symbol.toLowerCase().includes(q) || a.name.toLowerCase().includes(q)
      );
    });
  }, [filter, query]);

  return (
    <div className="w-full space-y-6">
      <NekoBanner eyebrow={d.eyebrow} title={d.title} desc={d.desc} />

      <div className="flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">
        <TabSwitch
          options={tabs}
          value={filter}
          onChange={(v) => setFilter(v as Filter)}
        />
        <div className="relative sm:w-72">
          <span className="pointer-events-none absolute left-3 top-1/2 -translate-y-1/2 text-muted-light">
            <svg
              width="14"
              height="14"
              viewBox="0 0 24 24"
              fill="none"
              stroke="currentColor"
              strokeWidth="2"
            >
              <circle cx="11" cy="11" r="7" />
              <path d="m21 21-4.3-4.3" />
            </svg>
          </span>
          <input
            value={query}
            onChange={(e) => setQuery(e.target.value)}
            placeholder={d.searchPh}
            className="w-full rounded-full border border-border bg-transparent py-2 pl-9 pr-3 text-sm outline-none placeholder:text-muted-light focus:border-primary"
          />
        </div>
      </div>

      {filtered.length === 0 ? (
        <p className="text-xs font-mono text-muted-light">
          {loading ? d.loading : d.noResults}
        </p>
      ) : (
        <div className="grid gap-4 sm:grid-cols-2 lg:grid-cols-3">
          {filtered.map((a) => {
            const price = prices?.prices?.[a.symbol]?.price;
            const apy = apyBySymbol.get(a.symbol);
            return (
              <a
                key={a.symbol}
                href={NEKO_APP}
                target="_blank"
                rel="noreferrer"
                className="group relative rounded-2xl border border-border bg-background p-5 transition-colors hover:border-primary/40"
              >
                <span className="absolute right-4 top-4 text-muted-light transition-colors group-hover:text-primary">
                  <svg
                    width="14"
                    height="14"
                    viewBox="0 0 24 24"
                    fill="none"
                    stroke="currentColor"
                    strokeWidth="2"
                  >
                    <path d="M7 17 17 7M8 7h9v9" />
                  </svg>
                </span>
                <div className="flex items-center gap-3">
                  <TokenBadge symbol={a.symbol} size={36} />
                  <div className="min-w-0">
                    <p className="text-sm font-bold text-foreground">
                      {a.symbol}
                    </p>
                    <p className="truncate text-xs text-muted">{a.name}</p>
                  </div>
                </div>

                <div className="mt-4">
                  <p className="text-[10px] font-mono uppercase tracking-wider text-muted-light">
                    {d.spot}
                  </p>
                  <div className="mt-0.5 flex items-baseline gap-2">
                    <span className="text-2xl font-bold tracking-tight text-foreground">
                      {fmtSpot(price)}
                    </span>
                    {apy != null && (
                      <span className="text-xs font-semibold text-success">
                        ~{apy}% {d.apySuffix}
                      </span>
                    )}
                  </div>
                </div>

                <div className="mt-4">
                  <span
                    className="inline-flex items-center rounded-md px-2 py-0.5 text-[10px] font-semibold"
                    style={{
                      backgroundColor: `${a.color}22`,
                      color: a.color,
                    }}
                  >
                    {badgeLabel[a.badge]}
                  </span>
                </div>
              </a>
            );
          })}
        </div>
      )}
    </div>
  );
}
