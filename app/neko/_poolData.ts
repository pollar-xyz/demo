// Shared pool-catalog helpers used by the pools page and the product dashboard.

import { fmtUsd, scaleAmount } from "./_format";
import type { PoolCatalog, PoolEntry, PriceMap } from "./_lib";

export const PROTOCOL_LABEL: Record<string, string> = {
  blend: "Blend",
  aqua: "Aqua",
  soroswap: "Soroswap",
};

export function flattenPools(cat: PoolCatalog): PoolEntry[] {
  return [...(cat.blend ?? []), ...(cat.aqua ?? []), ...(cat.soroswap ?? [])];
}

// Blend pools carry supply/borrow APY in metadata; Aqua/Soroswap expose a
// single `apy` (the LP yield) and no borrow side.
export function poolSupplyApy(p: PoolEntry): number | null | undefined {
  return p.type === "blend" ? p.metadata?.supplyApy : p.apy;
}

export function poolBorrowApy(p: PoolEntry): number | null | undefined {
  return p.type === "blend" ? p.metadata?.borrowApy : undefined;
}

// USD value of a raw token amount using the first token's price. Returns null
// when the amount is empty/zero or the price is unknown.
export function poolUsd(
  raw: string | undefined,
  token: PoolEntry["tokens"][number] | undefined,
  prices: PriceMap | null,
): number | null {
  if (!raw || !token) return null;
  const amt = scaleAmount(raw, token.decimals);
  if (amt <= 0) return null;
  const price = prices?.prices?.[token.code]?.price;
  return price != null ? amt * price : null;
}

// Display label: USD when priced, otherwise the token amount, otherwise "—".
export function poolUsdLabel(
  raw: string | undefined,
  token: PoolEntry["tokens"][number] | undefined,
  prices: PriceMap | null,
): string {
  if (!raw || !token) return "—";
  const amt = scaleAmount(raw, token.decimals);
  if (amt <= 0) return "—";
  const price = prices?.prices?.[token.code]?.price;
  return price != null
    ? fmtUsd(amt * price)
    : `${amt.toLocaleString(undefined, { maximumFractionDigits: 2 })} ${token.code}`;
}

// All distinct token codes referenced by a set of pools (for a price fetch).
export function poolTokenCodes(pools: PoolEntry[]): string[] {
  const s = new Set<string>();
  for (const p of pools) for (const tk of p.tokens) if (tk.code) s.add(tk.code);
  return [...s];
}
