// Vault math + Pollar invoke_contract argument builders.
//
// No Soroban SDK / RPC here: Pollar's buildTx/runTx does the build, simulate,
// sign and submit. We only assemble the typed ScValArg descriptors and do the
// share↔underlying arithmetic.

export const ASSET_DP = 7; // Neko RWA assets are 7-decimal
export const SHARES_DP = 7; // DeFindex vault shares are 7-decimal
export const PPS_DP = 12; // price-per-share fixed-point decimals

// Subset of Pollar's invoke_contract ScValArg union that we use.
export type ScArg =
  | { type: "bool"; value: boolean }
  | { type: "i128"; value: string }
  | { type: "address"; value: string }
  | { type: "vec"; value: ScArg[] };

// Human decimal string → smallest-unit bigint, without floats.
export function toRaw(amount: string, decimals = ASSET_DP): bigint {
  const [whole, frac = ""] = amount.trim().split(".");
  const fracPadded = (frac + "0".repeat(decimals)).slice(0, decimals);
  return BigInt((whole || "0") + fracPadded);
}

// Shares to burn to withdraw `amount` of the underlying, capped at the balance.
export function sharesForWithdraw(
  amount: string,
  userSharesRaw: string,
  pricePerShareRaw: string,
): bigint {
  const valueRaw = toRaw(amount, ASSET_DP);
  const pps = BigInt(pricePerShareRaw);
  if (pps <= BigInt(0)) return BigInt(0);
  const shares = (valueRaw * BigInt(10) ** BigInt(PPS_DP)) / pps;
  const max = BigInt(userSharesRaw);
  return shares > max ? max : shares;
}

// Approx shares minted for a deposit (for the audit log), if we know the pps.
export function sharesForDeposit(
  amount: string,
  pricePerShareRaw?: string,
): number | null {
  if (!pricePerShareRaw) return null;
  const pps = Number(pricePerShareRaw) / 10 ** PPS_DP;
  if (pps <= 0) return null;
  return Number(amount) / pps;
}

// deposit(amounts_desired: Vec<i128>, amounts_min: Vec<i128>, from: Address, invest: bool)
export function depositArgs(from: string, amountRaw: bigint): ScArg[] {
  return [
    { type: "vec", value: [{ type: "i128", value: amountRaw.toString() }] },
    { type: "vec", value: [{ type: "i128", value: "0" }] }, // amounts_min (demo)
    { type: "address", value: from },
    { type: "bool", value: false }, // invest later, not on deposit
  ];
}

// withdraw(withdraw_shares: i128, min_amounts_out: Vec<i128>, from: Address)
export function withdrawArgs(from: string, shares: bigint): ScArg[] {
  return [
    { type: "i128", value: shares.toString() },
    { type: "vec", value: [{ type: "i128", value: "0" }] }, // min_amounts_out (demo)
    { type: "address", value: from },
  ];
}
