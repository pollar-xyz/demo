// Discover asset registry. Neko's /discover page renders a fixed catalog of
// tokenized real-world assets, then decorates each with a live spot USD price
// (GET /dashboard/prices) and, for the bond-yields tokens, an APY
// (GET /v1/etherfuse/bond-yields). The catalog itself is front-end metadata —
// the proxy only returns prices/yields keyed by symbol.

// Filterable category (drives the tab counts). `badge` is the label shown on the
// card, which can be more specific than the filter bucket (USDY is a stablecoin
// for filtering but reads "Yield Stablecoin").
export type AssetCategory = "stablecoin" | "sovereignBond" | "native";
export type AssetBadge =
  | "stablecoin"
  | "yieldStablecoin"
  | "sovereignBond"
  | "native";

export type DiscoverAsset = {
  symbol: string;
  name: string;
  category: AssetCategory;
  badge: AssetBadge;
  // Currency the underlying price is quoted in (Reflector reports spot USD).
  currency: string;
  // Brand color for the letter-badge avatar.
  color: string;
};

// Order mirrors Neko's /discover grid.
export const DISCOVER_ASSETS: DiscoverAsset[] = [
  {
    symbol: "CETES",
    name: "Mexican Treasury Token",
    category: "sovereignBond",
    badge: "sovereignBond",
    currency: "MXN",
    color: "#16a34a",
  },
  {
    symbol: "USDY",
    name: "US Dollar Yieldcoin",
    category: "stablecoin",
    badge: "yieldStablecoin",
    currency: "USD",
    color: "#0ea5e9",
  },
  {
    symbol: "USDC",
    name: "USD Coin",
    category: "stablecoin",
    badge: "stablecoin",
    currency: "USD",
    color: "#2775ca",
  },
  {
    symbol: "XLM",
    name: "Stellar Lumens",
    category: "native",
    badge: "native",
    currency: "USD",
    color: "#0f172a",
  },
  {
    symbol: "EURC",
    name: "Euro Coin",
    category: "stablecoin",
    badge: "stablecoin",
    currency: "USD",
    color: "#1e40af",
  },
  {
    symbol: "USTRY",
    name: "US Treasury Token",
    category: "sovereignBond",
    badge: "sovereignBond",
    currency: "USD",
    color: "#7c3aed",
  },
  {
    symbol: "TESOURO",
    name: "Brazil Government Bonds",
    category: "sovereignBond",
    badge: "sovereignBond",
    currency: "BRL",
    color: "#059669",
  },
  {
    symbol: "PYUSD",
    name: "PayPal USD",
    category: "stablecoin",
    badge: "stablecoin",
    currency: "USD",
    color: "#3b82f6",
  },
  {
    symbol: "GYEN",
    name: "GMO JPY",
    category: "stablecoin",
    badge: "stablecoin",
    currency: "USD",
    color: "#64748b",
  },
];

export const ASSET_CATEGORIES: AssetCategory[] = [
  "stablecoin",
  "sovereignBond",
  "native",
];

export function countByCategory(cat: AssetCategory): number {
  return DISCOVER_ASSETS.filter((a) => a.category === cat).length;
}

// Stable brand colors for well-known symbols (token badges across pools/vaults
// reuse this so the same asset looks the same everywhere). Falls back to a hash.
const SYMBOL_COLORS: Record<string, string> = Object.fromEntries(
  DISCOVER_ASSETS.map((a) => [a.symbol, a.color]),
);
SYMBOL_COLORS.BLND = "#f97316";
SYMBOL_COLORS.AQUA = "#ec4899";
SYMBOL_COLORS.USDGLO = "#22c55e";
SYMBOL_COLORS.PYUSD = "#3b82f6";

const HASH_PALETTE = [
  "#2775ca",
  "#7c3aed",
  "#16a34a",
  "#ec4899",
  "#f97316",
  "#0ea5e9",
  "#64748b",
];

export function colorForSymbol(symbol: string): string {
  const key = symbol.toUpperCase();
  if (SYMBOL_COLORS[key]) return SYMBOL_COLORS[key];
  let h = 0;
  for (let i = 0; i < key.length; i++) h = (h * 31 + key.charCodeAt(i)) >>> 0;
  return HASH_PALETTE[h % HASH_PALETTE.length];
}
