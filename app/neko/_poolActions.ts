// On-chain action builders for Neko's pools.
//
// The ABIs below were read from the DEPLOYED wasm on mainnet (Soroban RPC
// contract spec) and cross-checked against decoded live transactions — not
// guessed:
//
//   Blend pool
//     submit(from: Address, spender: Address, to: Address, requests: Vec<Request>)
//     claim(from: Address, reserve_token_ids: Vec<u32>, to: Address)
//     Request = { address: Address, amount: i128, request_type: u32 }
//
//   Aqua pool
//     deposit(user: Address, desired_amounts: Vec<u128>, min_shares: u128)
//     withdraw(user: Address, share_amount: u128, min_amounts: Vec<u128>)
//     claim(user: Address)
//
// Note Aqua takes *u128* amounts while Blend takes *i128*.

import type { PoolEntry, Positions } from "./_lib";
import type { ScArg } from "./_vault";

// Blend bundles every position change into one `submit` call, tagged by
// request_type. A borrow, for instance, is a single submit carrying BOTH a
// SupplyCollateral and a Borrow request — that's exactly what live txs show.
export const REQUEST_TYPE = {
  supply: 0,
  withdraw: 1,
  supplyCollateral: 2,
  withdrawCollateral: 3,
  borrow: 4,
  repay: 5,
} as const;

export type BlendRequest = {
  /** Reserve asset (SAC) contract address. */
  asset: string;
  /** Smallest units of that asset. */
  amount: bigint;
  type: number;
};

// A Soroban struct is an ScMap with symbol keys, which must be in sorted order:
// address < amount < request_type.
function blendRequestArg(r: BlendRequest): ScArg {
  return {
    type: "map",
    value: [
      {
        key: { type: "symbol", value: "address" },
        val: { type: "address", value: r.asset },
      },
      {
        key: { type: "symbol", value: "amount" },
        val: { type: "i128", value: r.amount.toString() },
      },
      {
        key: { type: "symbol", value: "request_type" },
        val: { type: "u32", value: r.type },
      },
    ],
  };
}

/** submit(from, spender, to, requests) — from/spender/to are all the user. */
export function blendSubmitArgs(
  user: string,
  requests: BlendRequest[],
): ScArg[] {
  return [
    { type: "address", value: user },
    { type: "address", value: user },
    { type: "address", value: user },
    { type: "vec", value: requests.map(blendRequestArg) },
  ];
}

/** deposit(user, desired_amounts, min_shares) — one amount per pool token. */
export function aquaDepositArgs(
  user: string,
  amounts: bigint[],
  minShares = BigInt(0),
): ScArg[] {
  return [
    { type: "address", value: user },
    {
      type: "vec",
      value: amounts.map((a) => ({
        type: "u128" as const,
        value: a.toString(),
      })),
    },
    { type: "u128", value: minShares.toString() },
  ];
}

/** withdraw(user, share_amount, min_amounts) — one min per pool token. */
export function aquaWithdrawArgs(
  user: string,
  shares: bigint,
  tokenCount: number,
): ScArg[] {
  return [
    { type: "address", value: user },
    { type: "u128", value: shares.toString() },
    {
      type: "vec",
      value: Array.from({ length: tokenCount }, () => ({
        type: "u128" as const,
        value: "0",
      })),
    },
  ];
}

/** claim(user) — Aqua reward claim. */
export function aquaClaimArgs(user: string): ScArg[] {
  return [{ type: "address", value: user }];
}

/**
 * claim(from, reserve_token_ids, to) — Blend reward claim.
 *
 * The ids are per-reserve emission token ids, which the catalog doesn't expose;
 * they come from the wallet's own position (`claimedTokens`), e.g. [3, 5].
 */
export function blendClaimArgs(
  user: string,
  reserveTokenIds: number[],
): ScArg[] {
  return [
    { type: "address", value: user },
    {
      type: "vec",
      value: reserveTokenIds.map((id) => ({
        type: "u32" as const,
        value: id,
      })),
    },
    { type: "address", value: user },
  ];
}

// ─── Blend positions ────────────────────────────────────────────────────────

// Blend tracks a plain supply and a collateralised supply as SEPARATE buckets
// (a wallet can hold one, the other, or both in the same reserve). Which bucket
// the funds sit in decides the request_type a withdrawal must use — draining
// collateral when the balance is a plain supply reverts.
export type BlendPosition = {
  supplied: bigint;
  collateral: bigint;
  liabilities: bigint;
  /** Emission token ids this position can claim — `claim`'s reserve_token_ids. */
  claimTokens: number[];
};

const ZERO = BigInt(0);

function toBig(v: unknown): bigint {
  try {
    return BigInt(String(v ?? "0"));
  } catch {
    return ZERO;
  }
}

export function blendPositionOf(
  pool: PoolEntry,
  positions: Positions | null,
): BlendPosition {
  const pp = positions?.poolPositions.find(
    (x) => x.position.poolId === pool.id,
  );
  const m = (pp?.position.metadata ?? {}) as Record<string, unknown>;
  return {
    supplied: toBig(m.supplied),
    collateral: toBig(m.collateral),
    liabilities: toBig(m.liabilities),
    claimTokens: Array.isArray(m.claimedTokens)
      ? (m.claimedTokens as unknown[]).map(Number).filter(Number.isFinite)
      : [],
  };
}

/**
 * A lend on Neko creates a PLAIN supply (request_type 0) — collateral is only
 * created by the borrow flow, which posts it explicitly. Confirmed against a
 * live position: a wallet's `lend_deposit` shows up as `supplied`, not
 * `collateral`.
 */
export function blendLendRequests(
  asset: string,
  amount: bigint,
): BlendRequest[] {
  return [{ asset, amount, type: REQUEST_TYPE.supply }];
}

/** Withdraw from the plain supply first, then take the remainder from collateral. */
export function blendWithdrawRequests(
  asset: string,
  amount: bigint,
  pos: BlendPosition,
): BlendRequest[] {
  const out: BlendRequest[] = [];
  let left = amount;

  const fromSupply = left < pos.supplied ? left : pos.supplied;
  if (fromSupply > ZERO) {
    out.push({ asset, amount: fromSupply, type: REQUEST_TYPE.withdraw });
    left -= fromSupply;
  }
  if (left > ZERO && pos.collateral > ZERO) {
    const fromCollateral = left < pos.collateral ? left : pos.collateral;
    out.push({
      asset,
      amount: fromCollateral,
      type: REQUEST_TYPE.withdrawCollateral,
    });
  }
  // Nothing on record (stale positions, say) — let the contract be the judge.
  if (out.length === 0) {
    out.push({ asset, amount, type: REQUEST_TYPE.withdraw });
  }
  return out;
}

// ─── pool shape helpers ─────────────────────────────────────────────────────

/** The contract the action is invoked on (Blend routes through the pool, not the reserve). */
export function poolContractId(p: PoolEntry): string {
  if (p.type === "blend") {
    return (p.metadata?.poolContractId as string) ?? "";
  }
  // Aqua/Soroswap ids are "aqua:C…" — the contract is the id's last segment.
  return p.id.split(":").pop() ?? "";
}

/** The reserve asset (SAC) address a Blend request targets. */
export function blendAssetAddress(p: PoolEntry): string {
  return (p.metadata?.assetAddress as string) ?? p.tokens[0]?.address ?? "";
}

// Every Blend reserve of the SAME pool contract is a candidate collateral, so
// the options for a market are its sibling catalog entries. (Pool ids are
// "blend:<poolContract>:<asset>", which is why they can be grouped this way.)
export function collateralOptions(
  pool: PoolEntry,
  all: PoolEntry[],
): PoolEntry[] {
  if (pool.type !== "blend") return [];
  const contract = poolContractId(pool);
  return all.filter(
    (p) =>
      p.type === "blend" &&
      poolContractId(p) === contract &&
      blendAssetAddress(p) !== blendAssetAddress(pool),
  );
}

/** Actions the UI should offer, derived from the catalog's supportedActions. */
export function poolActions(p: PoolEntry): string[] {
  const supported = new Set(p.supportedActions ?? []);
  const out: string[] = [];
  if (p.type === "blend") {
    if (supported.has("supplyCollateral") || supported.has("deposit"))
      out.push("lend");
    if (supported.has("withdrawCollateral") || supported.has("withdraw"))
      out.push("withdraw");
    if (supported.has("borrow")) out.push("borrow");
    if (supported.has("repay")) out.push("repay");
  } else {
    if (supported.has("deposit")) out.push("deposit");
    if (supported.has("withdraw")) out.push("withdraw");
  }
  // Rewards only exist where the pool actually emits them. `supportedActions`
  // lists claimRewards on every pool, but every Blend market currently reports
  // hasEmissions:false — which is why Neko's own Blend detail shows no Claim
  // tab. Gating on emissions (rather than on protocol) keeps a dead button off
  // the screen today and lights it up on its own if Blend turns emissions on.
  if (supported.has("claimRewards") && p.metadata?.hasEmissions)
    out.push("claim");
  return out;
}
