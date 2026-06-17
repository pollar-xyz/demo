// Client helpers for the Neko dashboard. These hit the SAME-ORIGIN Next.js
// routes under /api/neko/*, which inject the secret x-server-code server-side
// and forward to the Neko proxy. The browser never sees the secret.

const PREFIX = "/api/neko";

async function unwrap<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) ||
      `Request failed (${res.status})`;
    throw new Error(msg);
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
export type AuditInput = {
  wallet_address: string;
  action_type: string;
  asset_in: string;
  token_amount_in: number;
  asset_out: string;
  amount_out: number;
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

// GET /dashboard/positions/{wallet}. Entry shapes aren't enumerated upstream,
// so positions are kept loose and rendered defensively.
export type Positions = {
  poolPositions: Record<string, unknown>[];
  vaultPositions: Record<string, unknown>[];
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
