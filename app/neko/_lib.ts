// Client helpers for the Neko dashboard. These hit the SAME-ORIGIN Next.js
// routes under /api/neko/*, which inject the secret x-server-code server-side
// and forward to the Neko proxy. The browser never sees the secret.

const PREFIX = "/api/neko";

async function unwrap<T>(res: Response): Promise<T> {
  const data = await res.json().catch(() => null);
  if (!res.ok) {
    const msg =
      (data && (data.message || data.error)) || `Request failed (${res.status})`;
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
