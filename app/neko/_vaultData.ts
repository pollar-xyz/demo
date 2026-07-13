// Shared DeFindex vault helpers used by both the vaults page and the product
// dashboard: map the raw on-chain proxy response into display-ready catalog
// entries, and join positions × catalog × audit × prices into vault rows.

import { fmtUsd, scaleAmount } from "./_format";
import { ASSET_DP } from "./_vault";
import type {
  AuditRecord,
  DefindexVaultsResponse,
  Positions,
  PriceMap,
  VaultCatalogEntry,
  VaultPosition,
} from "./_lib";

export const NEKO_APP = "https://app.nekoprotocol.xyz";
export const SHARES_DP = 7; // DeFindex vault share decimals
export const PPS_DP = 12; // price-per-share fixed-point decimals

// Vault asset icons are served by the Neko app (relative) or a CDN (absolute).
export function iconUrl(src?: string): string | null {
  if (!src) return null;
  return src.startsWith("http") ? src : `${NEKO_APP}${src}`;
}

export function parseApy(s?: string): number | null {
  if (!s || s === "-") return null;
  const n = Number(s.replace("%", ""));
  return Number.isFinite(n) ? n : null;
}

// The backend proxy returns raw on-chain vault data; the UI wants display-ready
// rows. TVL = total managed funds (underlying units) × USD price — both from the
// proxy response, prices keyed by the asset's contract address. APY arrives as a
// bare number, stringified to the "6.78%" form the card renders.
export function mapDefindexVaults(
  res: DefindexVaultsResponse,
): VaultCatalogEntry[] {
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

export type VaultPositionRow = {
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

// Map the wallet's vault positions to display rows, joining the DeFindex
// catalog (name/asset/apy), audit log (deposited principal) and prices.
export function computeVaultRows(
  positions: Positions | null,
  vaults: VaultCatalogEntry[],
  audit: AuditRecord[],
  prices: PriceMap | null,
): VaultPositionRow[] {
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

    // Net principal from the audit log. The two action types record different
    // units: a deposit's `token_amount_in` is the underlying asset, while a
    // withdrawal's `token_amount_in` is the SHARES burned and its `amount_out`
    // is the underlying paid out. Both sides must be summed in underlying, so
    // withdrawals subtract `amount_out` — subtracting the shares instead
    // under-subtracts (shares < underlying whenever pps > 1) and inflates the
    // principal, which drives `earnings` negative.
    const rows = audit.filter((a) => a.pool_id === id);
    const deposited = rows.reduce((sum, a) => {
      if (a.action_type === "vaults_deposit")
        return sum + (a.token_amount_in || 0);
      if (a.action_type === "vaults_withdraw") return sum - (a.amount_out || 0);
      return sum;
    }, 0);

    // With no audit history we have no principal to compare against, so the
    // whole position would look like yield — and "Claim" would try to withdraw
    // the principal. Report zero earnings instead of an unbacked number.
    const hasBasis = rows.length > 0;

    out.push({
      vaultId: id,
      name: cat.name,
      asset: cat.supplyAsset.symbol,
      icon: iconUrl(cat.supplyAsset.iconSrc),
      deposited,
      value,
      earnings: hasBasis ? value - deposited : 0,
      apy: parseApy(cat.apy7d),
      price: prices?.prices?.[cat.supplyAsset.symbol]?.price ?? null,
    });
  }
  return out;
}

export type VaultSummary = {
  dep: number;
  val: number;
  earn: number;
  netApy: number;
  projected: number;
};

export function computeVaultSummary(rows: VaultPositionRow[]): VaultSummary {
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
}

// Build the shares map used by deposit/withdraw modals.
export function positionsByVault(
  positions: Positions | null,
): Map<string, VaultPosition> {
  const m = new Map<string, VaultPosition>();
  for (const vp of positions?.vaultPositions ?? []) {
    m.set(String(vp.vaultId), {
      vaultId: String(vp.vaultId),
      userShares: String(vp.userShares),
      pricePerShare: String(vp.pricePerShare),
    });
  }
  return m;
}
