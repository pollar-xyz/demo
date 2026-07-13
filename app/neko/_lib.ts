// Client helpers for the Neko dashboard. These hit the SAME-ORIGIN Next.js
// routes under /api/neko/*, which inject the secret x-server-code server-side
// and forward to the Neko proxy. The browser never sees the secret.

const PREFIX = "/api/neko";

// Carries the proxy's status + `retryAfter` so callers can back off correctly:
// the Neko proxy rate-limits (30/60s and 20/1s) and answers 429 with the number
// of seconds until the window resets.
export class NekoApiError extends Error {
  status: number;
  retryAfter?: number;
  constructor(message: string, status: number, retryAfter?: number) {
    super(message);
    this.name = "NekoApiError";
    this.status = status;
    this.retryAfter = retryAfter;
  }
}

async function unwrap<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    const retryAfter =
      data && typeof data.retryAfter === "number" ? data.retryAfter : undefined;
    throw new NekoApiError(msg, res.status, retryAfter);
  }
  return data as T;
}

export function nekoGet<T>(path: string): Promise<T> {
  return fetch(`${PREFIX}${path}`).then((r) => unwrap<T>(r));
}

export function nekoPost<T>(path: string, body: unknown): Promise<T> {
  return fetch(`${PREFIX}${path}`, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(body),
  }).then((r) => unwrap<T>(r));
}

const sleep = (ms: number) => new Promise((r) => setTimeout(r, ms));

/**
 * POST /v1/audit, retrying transient failures.
 *
 * This call runs AFTER the transaction is already settled on-chain, so dropping
 * it doesn't undo anything — it just leaves Neko's ledger disagreeing with the
 * chain. That is exactly how three vault transactions went unrecorded and made
 * `earnings` (and the Claim button) wrong until they were backfilled. A 429 from
 * the proxy's rate limiter is the most likely cause, so honour its `retryAfter`.
 *
 * Throws if every attempt fails — callers must surface that, never swallow it.
 */
export async function recordAudit(
  body: AuditInput,
  attempts = 4,
): Promise<AuditResult> {
  let last: unknown;
  for (let i = 0; i < attempts; i++) {
    try {
      return await nekoPost<AuditResult>("/v1/audit", body);
    } catch (e) {
      last = e;
      // A rejected payload won't get better by asking again.
      const status = e instanceof NekoApiError ? e.status : 0;
      if (status >= 400 && status < 500 && status !== 429) throw e;
      if (i === attempts - 1) break;
      const backoff =
        e instanceof NekoApiError && e.retryAfter != null
          ? e.retryAfter
          : Math.min(2 ** i, 8);
      await sleep(backoff * 1000);
    }
  }
  throw last instanceof Error ? last : new Error(String(last));
}

// ─── upstream response shapes (the enumerated ones) ───────────────────────────

export type BondYield = {
  symbol: string;
  apy: number;
  currency: string;
  lastUpdated: string;
};

export type TxStatus = {
  status: "SUCCESS" | "FAILED" | "PENDING" | "NOT_FOUND";
  hash: string;
  returnValue?: string;
  error?: { code: string; message?: string };
  traceId?: string;
};

export type PrepareResult = { ok: boolean; hash: string };

// One row from GET /api/audit?wallet=… — an action Neko recorded for a wallet.
export type AuditRecord = {
  id: string;
  created_at: string;
  wallet_address: string;
  action_type: string;
  asset_in: string;
  asset_out: string;
  amount_in: number;
  amount_out: number;
  pool_id: string;
  network: string;
  tx_hash: string;
  token_amount_in: number;
};

// Body for POST /api/audit — what your signed tx actually did. Neko derives
// `amount_in`/`network` server-side, so they aren't sent here.
// Pool actions (lend/borrow/repay) have no "out" side — Neko's own records leave
// asset_out/amount_out null for them — while vault actions always do.
export type AuditInput = {
  wallet_address: string;
  action_type: string;
  asset_in: string;
  token_amount_in: number;
  asset_out: string | null;
  amount_out: number | null;
  pool_id: string;
  tx_hash: string;
};

export type AuditResult = { ok: boolean; isFirstVaultDeposit?: boolean };

// ─── pools & vaults (read-only dashboards) ────────────────────────────────────

export type PoolToken = {
  address: string;
  code: string;
  name: string;
  decimals: number;
};

// One entry from GET /dashboard/pool-catalog. `tvl`/`totalLiabilities` are
// strings in the asset's smallest units; `apy`/`supplyApy`/`borrowApy` are
// already percentages (2.04 = 2.04%).
export type PoolEntry = {
  id: string;
  type: "blend" | "aqua" | "soroswap";
  name: string;
  tokens: PoolToken[];
  tvl: string;
  apy: number;
  state: string;
  supportedActions: string[];
  metadata?: {
    poolName?: string;
    supplyApy?: number;
    borrowApy?: number;
    totalLiabilities?: string;
    utilization?: number;
    [k: string]: unknown;
  };
};

export type PoolCatalog = {
  blend?: PoolEntry[];
  aqua?: PoolEntry[];
  soroswap?: PoolEntry[];
  fetchedAt?: number;
};

export type PriceMap = {
  prices: Record<string, { price: number; source?: string }>;
  fetchedAt?: number;
};

// GET /v1/pool-rates/{poolId} — APY history for the pool detail chart, oldest
// first. `borrow_apy` is null for AMM pools (Aqua has no borrow side).
export type PoolRatePoint = {
  supply_apy: number | null;
  borrow_apy: number | null;
  recorded_at: string;
};

// GET /v1/contract-activity/{poolId} — the pool's recent on-chain events.
export type ContractActivityEvent = {
  id: string;
  type: string;
  user: string;
  asset: string;
  amount: number;
  ts: number; // unix seconds
};

export type ContractActivity = { events: ContractActivityEvent[] };

// GET /dashboard/positions/{wallet}. Each pool position embeds the full pool
// entry plus the wallet's stake; vault positions carry raw shares + price.
export type PoolPosition = {
  pool: PoolEntry;
  position: {
    poolId: string;
    deposited: string; // raw units (token decimals)
    depositedFormatted: string; // human-readable amount
    rewards: string;
    rewardsFormatted: string;
    metadata?: Record<string, unknown>;
  };
};

export type VaultPosition = {
  vaultId: string;
  userShares: string; // raw (SHARES_DP decimals)
  pricePerShare: string; // raw fixed-point (PPS_DP decimals)
};

export type Positions = {
  poolPositions: PoolPosition[];
  vaultPositions: VaultPosition[];
  fetchedAt?: number;
};

// GET /api/vault/apy (Neko's PUBLIC app route, no secret).
export type VaultApy = {
  vaultApy: number | null;
  strategies?: { name: string; apy: number | null; weight: number }[];
  note?: string;
};

// GET /api/defindex/vaults (Neko's PUBLIC app route). `tvl`/`apy7d` arrive
// pre-formatted as display strings (e.g. "$406.06", "6.72%", or "-").
export type VaultAsset = {
  symbol: string;
  name?: string;
  iconSrc?: string;
  network?: string;
  contractAddress?: string;
};

export type VaultCatalogEntry = {
  id: string;
  name: string;
  description?: string;
  category?: string;
  status?: string;
  supplyAsset: VaultAsset;
  createdBy?: string;
  featured?: boolean;
  tvl?: string;
  apy7d?: string;
  utilization?: string;
  totalSupply?: string;
};

export type VaultCatalog = { vaults: VaultCatalogEntry[] };

// Raw shape from GET /v1/defindex/vaults (the backend proxy). Unlike the old
// public catalog above, this is on-chain data: `total_amount` is in the asset's
// smallest units, `apy` is a bare number, and `prices` is keyed by asset
// contract address. `mapDefindexVaults` (vaults/page.tsx) turns it into the
// display-ready VaultCatalogEntry[] the UI consumes.
export type DefindexRawVault = {
  contractId: string;
  info: {
    name: string;
    symbol: string;
    assets: { address: string; name: string; symbol: string }[];
    totalManagedFunds: { asset: string; total_amount: string }[];
    apy: number | null;
  };
};

export type DefindexVaultsResponse = {
  vaults: DefindexRawVault[];
  prices: Record<string, number>;
};
