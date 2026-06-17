// Small formatting helpers shared by the Neko pool/vault tabs.

export function scaleAmount(raw: string | number, decimals: number): number {
  return Number(raw) / 10 ** decimals;
}

export function fmtUsd(n: number): string {
  return n.toLocaleString(undefined, {
    style: "currency",
    currency: "USD",
    maximumFractionDigits: n > 0 && n < 1 ? 4 : 2,
  });
}

export function fmtPct(n: number | null | undefined): string {
  return n == null ? "—" : `${n.toFixed(2)}%`;
}

export function shortHash(h: string, head = 6, tail = 6): string {
  return h.length > head + tail ? `${h.slice(0, head)}…${h.slice(-tail)}` : h;
}

// Pick the first present string-ish value from a loose object — positions
// shapes aren't enumerated upstream, so we probe common key names.
export function pick(
  obj: Record<string, unknown>,
  keys: string[],
): string | undefined {
  for (const k of keys) {
    const v = obj[k];
    if (v != null && (typeof v === "string" || typeof v === "number")) {
      return String(v);
    }
  }
  return undefined;
}
