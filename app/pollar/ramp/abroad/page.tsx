"use client";

// Abroad off-ramp, wired end to end: quote → accept → send USDC → track.
//
// Abroad is a plain REST API (no SDK, no modal), and its key must stay
// server-side, so every call here goes to /api/abroad/* on this origin — the
// route in app/api/abroad/[...path] holds ABROAD_API_KEY and forwards upstream.
// The one thing Pollar does here is step 3: signing and submitting the Stellar
// payment, memo included, with the connected wallet.
//
// Shapes follow the live OpenAPI spec (https://api.abroad.finance/swagger.json),
// not the markdown guides — those are out of date. In particular: there is no
// /payments/banks endpoint and no bank_code field, and accepting a transaction
// answers with `kycRequired` plus a `payment_context` that carries the deposit
// address, memo and exact amount, so none of that is configured locally.

import { usePollar } from "@pollar/react";
import { useCallback, useEffect, useMemo, useState } from "react";
import { CodePanel } from "@/app/_components/CodePanels";
import { QrScanner } from "@/app/_components/QrScanner";
import { Select } from "@/app/_components/Select";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── styles ───────────────────────────────────────────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const lbl = "block text-xs font-mono text-muted mb-1";
const btn =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";
const btnGhost =
  "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";

// ─── domain ───────────────────────────────────────────────────────────────────

type AbroadNetwork = "STELLAR" | "SOLANA" | "CELO";
type CryptoCurrency = "USDC" | "USDT";
type TargetCurrency = "COP" | "BRL";
type PaymentMethod = "BREB" | "PIX";
type QuoteMode = "target" | "source";

// COP only settles over BreB and BRL only over Pix, so the currency picks the
// rail — there's no valid cross pairing to offer.
const METHOD_FOR: Record<TargetCurrency, PaymentMethod> = {
  COP: "BREB",
  BRL: "PIX",
};

type Quote = { quote_id: string; value: number; expiration_time: number };

// Everything needed to pay, straight from Abroad — the address, the memo it
// matches the deposit by, and the exact amount. Nothing here is guessed or
// configured on our side.
type PaymentContext = {
  blockchain: AbroadNetwork;
  chainFamily: "evm" | "solana" | "stellar";
  chainId: string;
  cryptoCurrency: CryptoCurrency;
  depositAddress: string;
  amount: number;
  decimals: number | null;
  memo: string | null;
  memoType: "text" | null;
  mintAddress: string | null;
  rpcUrl: string | null;
  notify: { required: boolean; endpoint: string | null };
};

type AcceptedTx = {
  id: string | null;
  kycRequired: boolean;
  transaction_reference: string | null;
  payment_context?: PaymentContext | null;
};

type TxState = {
  id: string;
  user_id: string;
  status: string;
  kycRequired: boolean;
  transaction_reference: string;
  on_chain_tx_hash: string | null;
};

type KycState = { hasApproved: boolean; status: string | null };

// What GET /qr-decoder/br reads out of a Pix "copia e cola" payload. `decoded`
// comes back null when the code no longer resolves — dynamic Pix QRs carry a
// per-charge id and stop being valid once used or expired.
type PixDecoded = {
  account: string;
  amount: string | null;
  currency: string | null;
  name: string | null;
  taxId: string | null;
};

// What the right-hand panel shows: the last call and whatever came back, error
// bodies included — the point is to make Abroad's actual wire format visible.
type Exchange = { label: string; status: number; body: unknown };

// ─── api ──────────────────────────────────────────────────────────────────────

// Every request is same-origin; the proxy attaches X-API-Key server-side.
async function call(
  path: string,
  init?: RequestInit,
): Promise<{ status: number; body: unknown }> {
  const res = await fetch(`/api/abroad${path}`, init);
  const text = await res.text();
  let body: unknown = text || null;
  try {
    if (text) body = JSON.parse(text);
  } catch {
    // Non-JSON upstream error — keep the raw text so it still shows up.
  }
  return { status: res.status, body };
}

function post(path: string, payload: unknown) {
  return call(path, {
    method: "POST",
    headers: { "content-type": "application/json" },
    body: JSON.stringify(payload),
  });
}

// A failed build is a normal outcome here (expired quote, no trustline, not
// enough balance), and we render it in the page. But the SDK also reports it
// with console.error, and Next's dev overlay promotes any console.error to a
// full-screen "Console Error" — which reads as if the app crashed when it
// didn't. There's no config to opt out (devIndicators only moves the badge), so
// for the duration of the call we downgrade just the SDK's own http lines to
// console.warn. They stay in the console; they just stop hijacking the screen.
// Anything else logged meanwhile passes through untouched.
async function withoutSdkErrorOverlay<T>(fn: () => Promise<T>): Promise<T> {
  const original = console.error;
  console.error = (...args: unknown[]) => {
    if (typeof args[0] === "string" && args[0].startsWith("[PollarClient")) {
      console.warn(...args);
      return;
    }
    original(...args);
  };
  try {
    return await fn();
  } finally {
    console.error = original;
  }
}

// Abroad reports failures as `{ reason }`; fall back to the other shapes the
// proxy itself can emit.
function errorMessage(body: unknown, fallback: string): string {
  if (body && typeof body === "object") {
    const o = body as Record<string, unknown>;
    for (const k of ["reason", "message", "error"]) {
      if (typeof o[k] === "string" && o[k]) return o[k] as string;
    }
  }
  if (typeof body === "string" && body) return body;
  return fallback;
}

// ─── bits ─────────────────────────────────────────────────────────────────────

function Field({
  label,
  note,
  optional,
  suffix,
  children,
}: {
  label: string;
  note?: string;
  optional?: boolean;
  // Overrides the "(optional)" tag — for a field that's conditionally required,
  // like account_number / qr_code where the API wants exactly one of the pair.
  suffix?: string;
  children: React.ReactNode;
}) {
  const { t } = useI18n();
  return (
    <div className="space-y-1">
      <label className={lbl}>
        {label}
        {(suffix || optional) && (
          <span className="ml-1 text-muted-light">
            {suffix ?? t.common.optional}
          </span>
        )}
      </label>
      {children}
      {note && <p className="text-xs text-muted-light mt-0.5">{note}</p>}
    </div>
  );
}

function Step({
  n,
  title,
  done,
  children,
}: {
  n: number;
  title: string;
  done?: boolean;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-xl border border-border p-4 sm:p-5 space-y-3">
      <div className="flex items-center gap-2.5">
        <span
          className={`flex h-6 w-6 shrink-0 items-center justify-center rounded-full text-[11px] font-semibold ${
            done
              ? "bg-success-light text-success"
              : "bg-surface text-muted-light"
          }`}
        >
          {done ? "✓" : n}
        </span>
        <h2 className="text-sm font-semibold text-foreground">{title}</h2>
      </div>
      {children}
    </section>
  );
}

function Readout({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <p className="text-[11px] font-mono text-muted-light">{label}</p>
      <p className="text-xs font-mono text-foreground break-all">{value}</p>
    </div>
  );
}

function Callout({
  tone,
  title,
  children,
}: {
  tone: "warning" | "error" | "success";
  title?: string;
  children: React.ReactNode;
}) {
  const tones = {
    warning: "border-warning/40 bg-warning-light text-warning",
    error: "border-error/40 bg-error-light text-error",
    success: "border-success/40 bg-success-light text-success",
  };
  return (
    <div className={`rounded-lg border px-3 py-2.5 text-xs ${tones[tone]}`}>
      {title && <p className="font-semibold mb-0.5">{title}</p>}
      <div className="leading-relaxed">{children}</div>
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function AbroadPage() {
  const { t } = useI18n();
  const s = t.abroad;
  const { isAuthenticated, runTx, network: stellarNetwork } = usePollar();

  const [configured, setConfigured] = useState<boolean | null>(null);
  const [last, setLast] = useState<Exchange | null>(null);
  const [error, setError] = useState<string | null>(null);

  // ── step 1: quote ───────────────────────────────────────────────────────────
  const [mode, setMode] = useState<QuoteMode>("target");
  const [amount, setAmount] = useState("");
  const [currency, setCurrency] = useState<TargetCurrency>("COP");
  const [crypto, setCrypto] = useState<CryptoCurrency>("USDC");
  const [network, setNetwork] = useState<AbroadNetwork>("STELLAR");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [quoting, setQuoting] = useState(false);
  const method = METHOD_FOR[currency];

  // ── step 2: accept ──────────────────────────────────────────────────────────
  const [userId, setUserId] = useState("demo-user-01");
  const [accountNumber, setAccountNumber] = useState("");
  const [taxId, setTaxId] = useState("");
  const [qrCode, setQrCode] = useState("");
  const [accepted, setAccepted] = useState<AcceptedTx | null>(null);
  const [accepting, setAccepting] = useState(false);
  const [kyc, setKyc] = useState<KycState | null>(null);
  const [checkingKyc, setCheckingKyc] = useState(false);
  // QR scanner: open state, what the last scan resolved to, and why it didn't.
  const [scannerOpen, setScannerOpen] = useState(false);
  const [decoded, setDecoded] = useState<PixDecoded | null>(null);
  const [decodeError, setDecodeError] = useState<string | null>(null);
  const [decoding, setDecoding] = useState(false);

  // ── step 3: send ────────────────────────────────────────────────────────────
  const [sending, setSending] = useState(false);
  const [sentHash, setSentHash] = useState<string | null>(null);
  const [onChainTx, setOnChainTx] = useState("");
  const [notifying, setNotifying] = useState(false);
  const [notified, setNotified] = useState(false);

  // ── step 4: track ───────────────────────────────────────────────────────────
  const [txState, setTxState] = useState<TxState | null>(null);
  const [checking, setChecking] = useState(false);
  const [autoPoll, setAutoPoll] = useState(true);

  // Clock for the quote countdown, stamped when the quote arrives.
  const [now, setNow] = useState(0);

  // Is the key set at all? Everything else the client needs comes back on the
  // transaction itself.
  useEffect(() => {
    let alive = true;
    fetch("/api/abroad/config")
      .then((r) => r.json())
      .then(
        (c: { configured: boolean }) => alive && setConfigured(c.configured),
      )
      .catch(() => {});
    return () => {
      alive = false;
    };
  }, []);

  // Drives the quote countdown. Only ticks while a quote is on screen; the
  // first reading is stamped by getQuote so the effect body writes no state.
  useEffect(() => {
    if (!quote) return;
    const id = setInterval(() => setNow(Date.now()), 1000);
    return () => clearInterval(id);
  }, [quote]);

  const refreshStatus = useCallback(
    async (id: string) => {
      setChecking(true);
      try {
        const { status, body } = await call(`/transaction/${id}`);
        setLast({ label: `GET /transaction/${id}`, status, body });
        if (status >= 400) {
          setError(errorMessage(body, t.common.unknownError));
          return;
        }
        setTxState(body as TxState);
      } finally {
        setChecking(false);
      }
    },
    [t.common.unknownError],
  );

  // Poll the transaction while it's still in flight; stop once it settles, so a
  // finished demo doesn't keep hitting the API forever.
  useEffect(() => {
    const id = accepted?.id;
    if (!id || !autoPoll) return;
    const settled =
      txState?.status === "PAYMENT_COMPLETED" ||
      txState?.status === "PAYMENT_FAILED" ||
      txState?.status === "PAYMENT_EXPIRED";
    if (settled) return;
    const timer = setInterval(() => {
      refreshStatus(id).catch(() => {});
    }, 5000);
    return () => clearInterval(timer);
  }, [accepted?.id, autoPoll, txState?.status, refreshStatus]);

  // ── derived ─────────────────────────────────────────────────────────────────

  const ctx = accepted?.payment_context ?? null;
  const reference = accepted?.transaction_reference ?? null;

  const secondsLeft = quote
    ? Math.max(0, Math.floor((quote.expiration_time - now) / 1000))
    : 0;
  const quoteExpired = Boolean(quote) && now > 0 && secondsLeft === 0;

  // Abroad decides whether this chain uses a memo, not us.
  const memo = ctx?.memoType === "text" ? ctx.memo : null;
  const canSignHere = ctx?.chainFamily === "stellar";
  const onTestnet = stellarNetwork === "testnet";

  // On Stellar an asset is code + issuer, and Abroad puts the issuer in
  // `mintAddress` — the generic "token address" slot it uses per chain (on
  // Solana/EVM that's the contract). Without it /tx/build rejects the asset:
  // its union has no branch for a credit asset with no issuer.
  const issuer = ctx?.mintAddress ?? null;
  // Both supported assets (USDC, USDT) are 4 characters, but derive it anyway —
  // same rule the send page uses.
  const assetType =
    (ctx?.cryptoCurrency.length ?? 0) <= 4
      ? "credit_alphanum4"
      : "credit_alphanum12";

  // `chainId` is "stellar:pubnet" / "stellar:testnet". Signing a pubnet payment
  // while the session runs on testnet builds against the wrong network and can
  // never settle, so we refuse rather than let it through.
  const ctxNetwork = ctx?.chainId?.endsWith("testnet") ? "testnet" : "mainnet";
  const networkMismatch =
    Boolean(ctx) && canSignHere && ctxNetwork !== stellarNetwork;
  // Why the send button is off, if it is. Null means it's good to go.
  const sendBlockedBy = !ctx
    ? null
    : networkMismatch
      ? s.send.networkMismatch.replace("{ctx}", ctxNetwork)
      : !issuer
        ? s.send.noIssuer
        : null;

  // The OpenAPI schema only marks quote_id and user_id required, but a runtime
  // check rejects a body with neither account_number nor qr_code. Enforce it
  // here so the user sees it before the round trip.
  const canAccept =
    userId.trim().length > 0 &&
    (accountNumber.trim().length > 0 || qrCode.trim().length > 0);

  const quotePath = mode === "target" ? "/quote" : "/quote/reverse";

  const requestCode = useMemo(() => {
    if (!ctx) {
      const preview = {
        [mode === "target" ? "amount" : "source_amount"]:
          Number(amount) || (mode === "target" ? 400000 : 100),
        crypto_currency: crypto,
        network,
        payment_method: method,
        target_currency: currency,
      };
      return `// 1. quote — via /api/abroad/* so the key stays server-side
await fetch('/api/abroad${quotePath}', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify(${JSON.stringify(preview, null, 2).replace(/\n/g, "\n  ")}),
});

// 2. accept — quote_id and user_id are the only required fields
//    (no bank_code: the API rejects unknown properties)`;
    }
    if (canSignHere) {
      return `// 3. pay Abroad on Stellar — every value comes from payment_context
await runTx(
  'payment',
  {
    destination: '${ctx.depositAddress}',
    asset: {
      type: '${assetType}',
      code: '${ctx.cryptoCurrency}',
      // payment_context.mintAddress — the issuer, on Stellar
      issuer: '${issuer ?? "…"}',
    },
    amount: '${ctx.amount}',
  },${
    memo
      ? `
  { memo: { type: 'text', value: '${memo}' } },`
      : ""
  }
);`;
    }
    return `// 3. ${ctx.blockchain} has no memo — broadcast, then claim the deposit
//    payment_context.notify tells you whether and where
await fetch('/api/abroad${ctx.notify.endpoint ?? "/payments/notify"}', {
  method: 'POST',
  headers: { 'content-type': 'application/json' },
  body: JSON.stringify({
    transaction_id: '${accepted?.id ?? "…"}',
    on_chain_tx: '${onChainTx || "…"}',
  }),
});`;
  }, [
    ctx,
    canSignHere,
    memo,
    issuer,
    assetType,
    accepted?.id,
    onChainTx,
    quotePath,
    mode,
    amount,
    crypto,
    network,
    method,
    currency,
  ]);

  // ── actions ─────────────────────────────────────────────────────────────────

  function clearDownstream() {
    setAccepted(null);
    setTxState(null);
    setKyc(null);
    setSentHash(null);
    setOnChainTx("");
    setNotified(false);
  }

  function resetAll() {
    setQuote(null);
    clearDownstream();
    setLast(null);
    setError(null);
  }

  async function getQuote() {
    setError(null);
    setQuoting(true);
    clearDownstream();
    try {
      const payload = {
        [mode === "target" ? "amount" : "source_amount"]: Number(amount),
        crypto_currency: crypto,
        network,
        payment_method: method,
        target_currency: currency,
      };
      const { status, body } = await post(quotePath, payload);
      setLast({ label: `POST ${quotePath}`, status, body });
      if (status >= 400) {
        setError(errorMessage(body, t.common.unknownError));
        return;
      }
      setNow(Date.now());
      setQuote(body as Quote);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setQuoting(false);
    }
  }

  async function acceptTransaction() {
    if (!quote) return;
    setError(null);
    setAccepting(true);
    try {
      // AcceptTransactionRequest sets additionalProperties:false, so only these
      // keys may appear — an extra one (bank_code, say) is a 400.
      const payload = {
        quote_id: quote.quote_id,
        user_id: userId.trim(),
        ...(accountNumber.trim()
          ? { account_number: accountNumber.trim() }
          : {}),
        ...(taxId.trim() ? { tax_id: taxId.trim() } : {}),
        ...(qrCode.trim() ? { qr_code: qrCode.trim() } : {}),
      };
      const { status, body } = await post("/transaction", payload);
      setLast({ label: "POST /transaction", status, body });
      if (status >= 400) {
        setError(errorMessage(body, t.common.unknownError));
        return;
      }
      setAccepted(body as AcceptedTx);
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setAccepting(false);
    }
  }

  // A scanned code goes straight into qr_code, then we ask Abroad to read it
  // back. That's the only way to know it's still live: a dynamic Pix QR is
  // per-charge, so a used or expired one decodes to null and would otherwise
  // fail much later, mid-payout.
  const handleScan = useCallback(
    async (raw: string) => {
      setQrCode(raw);
      setAccountNumber("");
      setDecoded(null);
      setDecodeError(null);
      setDecoding(true);
      try {
        const path = `/qr-decoder/br?qrCode=${encodeURIComponent(raw)}`;
        const { status, body } = await call(path);
        setLast({ label: `GET ${path}`, status, body });
        if (status >= 400) {
          setDecodeError(errorMessage(body, t.common.unknownError));
          return;
        }
        const found = (body as { decoded: PixDecoded | null } | null)?.decoded;
        if (!found) {
          setDecodeError(s.scan.stale);
          return;
        }
        setDecoded(found);
        setScannerOpen(false);
        // The QR names the amount, so quote for exactly that. Switching to BRL
        // also flips the payment method to PIX.
        if (found.amount) {
          setMode("target");
          setCurrency("BRL");
          setAmount(found.amount);
        }
        if (found.taxId) setTaxId(found.taxId);
      } catch (e) {
        setDecodeError(e instanceof Error ? e.message : t.common.unknownError);
      } finally {
        setDecoding(false);
      }
    },
    [t.common.unknownError, s.scan.stale],
  );

  async function checkKyc() {
    setError(null);
    setCheckingKyc(true);
    try {
      const path = `/kyc/status?userId=${encodeURIComponent(userId.trim())}`;
      const { status, body } = await call(path);
      setLast({ label: `GET ${path}`, status, body });
      if (status >= 400) {
        setError(errorMessage(body, t.common.unknownError));
        return;
      }
      setKyc(body as KycState);
    } finally {
      setCheckingKyc(false);
    }
  }

  async function sendFunds() {
    // Refuse locally whenever we already know the build would be rejected —
    // a wrong-network or issuer-less asset is a guaranteed 400, and firing it
    // anyway only buys a red overlay in dev.
    if (!accepted?.id || !ctx || !issuer || sendBlockedBy) return;
    setError(null);
    setSending(true);
    try {
      // The memo is the whole ballgame: without the exact reference Abroad
      // can't tie the deposit to the transaction, and the funds are gone.
      const outcome = await withoutSdkErrorOverlay(() =>
        runTx(
          "payment",
          {
            destination: ctx.depositAddress,
            // issuer included: /tx/build has no union branch for a credit asset
            // without one.
            asset: { type: assetType, code: ctx.cryptoCurrency, issuer },
            amount: String(ctx.amount),
          } as never,
          (memo ? { memo: { type: "text", value: memo } } : undefined) as never,
        ),
      );
      if (outcome.status === "error") {
        setError(outcome.details ?? t.common.unknownError);
        return;
      }
      setSentHash(
        "hash" in outcome ? ((outcome.hash as string) ?? null) : null,
      );
      refreshStatus(accepted.id).catch(() => {});
    } catch (e) {
      // runTx rejects on a failed build/sign/submit. Keep it here: an escaping
      // rejection would tear the page down behind Next's error overlay.
      setError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setSending(false);
    }
  }

  async function notifyPayment() {
    if (!accepted?.id || !ctx || !onChainTx.trim()) return;
    setError(null);
    setNotifying(true);
    try {
      const path = ctx.notify.endpoint ?? "/payments/notify";
      const { status, body } = await post(path, {
        transaction_id: accepted.id,
        on_chain_tx: onChainTx.trim(),
      });
      setLast({ label: `POST ${path}`, status, body });
      if (status >= 400) {
        setError(errorMessage(body, t.common.unknownError));
        return;
      }
      setNotified(true);
      refreshStatus(accepted.id).catch(() => {});
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setNotifying(false);
    }
  }

  // ── render ──────────────────────────────────────────────────────────────────

  const statusNote: Record<string, string> = {
    AWAITING_PAYMENT: s.track.statusAWAITING_PAYMENT,
    PROCESSING_PAYMENT: s.track.statusPROCESSING_PAYMENT,
    PAYMENT_COMPLETED: s.track.statusPAYMENT_COMPLETED,
    PAYMENT_FAILED: s.track.statusPAYMENT_FAILED,
    PAYMENT_EXPIRED: s.track.statusPAYMENT_EXPIRED,
    WRONG_AMOUNT: s.track.statusWRONG_AMOUNT,
  };

  const statusTone = (status: string) =>
    status === "PAYMENT_COMPLETED"
      ? "bg-success-light text-success"
      : status === "PAYMENT_FAILED" ||
          status === "PAYMENT_EXPIRED" ||
          status === "WRONG_AMOUNT"
        ? "bg-error-light text-error"
        : "bg-warning-light text-warning";

  const body = (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
      {/* ── left: the four steps ──────────────────────────────────────────── */}
      <div className="space-y-4">
        {configured === false && (
          <Callout tone="error" title={s.notConfiguredTitle}>
            {s.notConfiguredBody}
          </Callout>
        )}
        {onTestnet && (
          <Callout tone="warning" title={s.productionOnlyTitle}>
            {s.productionOnlyBody}
          </Callout>
        )}

        {/* 1 — quote */}
        <Step n={1} title={s.stepQuote} done={Boolean(quote) && !quoteExpired}>
          <div className="inline-flex rounded-lg bg-surface p-0.5">
            {(["target", "source"] as QuoteMode[]).map((m) => (
              <button
                key={m}
                onClick={() => setMode(m)}
                className={`rounded-md px-3 py-1.5 text-xs font-mono font-medium transition-colors ${
                  mode === m
                    ? "bg-background text-foreground shadow-sm"
                    : "text-muted-light hover:text-muted"
                }`}
              >
                {m === "target" ? s.quote.modeTarget : s.quote.modeSource}
              </button>
            ))}
          </div>
          <p className="text-xs text-muted-light">
            {mode === "target"
              ? s.quote.modeTargetNote
              : s.quote.modeSourceNote}
          </p>

          <div className="grid grid-cols-2 gap-3">
            <Field
              label={`${s.quote.amount} (${mode === "target" ? currency : crypto})`}
            >
              <input
                className={inp}
                inputMode="decimal"
                value={amount}
                onChange={(e) => setAmount(e.target.value)}
                placeholder={mode === "target" ? "400000" : "100"}
              />
            </Field>
            <Field label={s.quote.currency}>
              <Select
                value={currency}
                onChange={(v) => setCurrency(v as TargetCurrency)}
                options={[
                  { value: "COP", label: "COP — Colombia" },
                  { value: "BRL", label: "BRL — Brazil" },
                ]}
              />
            </Field>
            <Field label={s.quote.method} note={s.quote.methodNote}>
              <input className={`${inp} opacity-70`} value={method} readOnly />
            </Field>
            <Field label={s.quote.crypto}>
              <Select
                value={crypto}
                onChange={(v) => setCrypto(v as CryptoCurrency)}
                options={[
                  { value: "USDC", label: "USDC" },
                  { value: "USDT", label: "USDT" },
                ]}
              />
            </Field>
            <Field label={s.quote.network} note={s.quote.networkNote}>
              <Select
                value={network}
                onChange={(v) => setNetwork(v as AbroadNetwork)}
                options={[
                  { value: "STELLAR", label: "STELLAR" },
                  { value: "SOLANA", label: "SOLANA" },
                  { value: "CELO", label: "CELO" },
                ]}
              />
            </Field>
          </div>

          <button
            onClick={getQuote}
            disabled={quoting || !amount.trim() || configured === false}
            className={btn}
          >
            {quoting ? s.quote.busy : s.quote.submit}
          </button>

          {quote && (
            <div className="rounded-lg border border-border p-3 space-y-2">
              <Readout label={s.quote.quoteId} value={quote.quote_id} />
              <Readout
                label={`${s.quote.value} — ${
                  mode === "target"
                    ? s.quote.valueTargetNote
                    : s.quote.valueSourceNote
                }`}
                value={`${quote.value} ${mode === "target" ? crypto : currency}`}
              />
              <p
                className={`text-xs font-mono ${quoteExpired ? "text-error" : "text-muted"}`}
              >
                {quoteExpired
                  ? s.quote.expired
                  : `${s.quote.expires} ${Math.floor(secondsLeft / 60)}m ${secondsLeft % 60}s`}
              </p>
            </div>
          )}
        </Step>

        {/* 2 — accept */}
        <Step n={2} title={s.stepAccept} done={Boolean(accepted?.id)}>
          {!quote ? (
            <p className="text-xs text-muted-light">{s.accept.needsQuote}</p>
          ) : (
            <>
              <p className="text-xs text-muted-light">{s.accept.intro}</p>
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <Field label={s.accept.userId} note={s.accept.userIdNote}>
                  <input
                    className={inp}
                    value={userId}
                    onChange={(e) => setUserId(e.target.value)}
                    spellCheck={false}
                  />
                </Field>
                <Field
                  label={s.accept.accountNumber}
                  note={s.accept.accountNumberNote}
                  suffix={s.accept.oneOf}
                >
                  <input
                    className={inp}
                    value={accountNumber}
                    onChange={(e) => setAccountNumber(e.target.value)}
                    placeholder="3001234567"
                    spellCheck={false}
                  />
                </Field>
                <Field
                  label={s.accept.qrCode}
                  note={s.accept.qrCodeNote}
                  suffix={s.accept.oneOf}
                >
                  <input
                    className={inp}
                    value={qrCode}
                    onChange={(e) => {
                      setQrCode(e.target.value);
                      setDecoded(null);
                      setDecodeError(null);
                    }}
                    spellCheck={false}
                  />
                  <button
                    type="button"
                    onClick={() => setScannerOpen((o) => !o)}
                    className={`${btnGhost} mt-1.5`}
                  >
                    {scannerOpen ? s.scan.close : s.scan.open}
                  </button>
                </Field>
                <Field
                  label={s.accept.taxId}
                  note={s.accept.taxIdNote}
                  optional
                >
                  <input
                    className={inp}
                    value={taxId}
                    onChange={(e) => setTaxId(e.target.value)}
                    spellCheck={false}
                  />
                </Field>
              </div>

              {scannerOpen && (
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <p className="text-xs text-muted-light">{s.scan.intro}</p>
                  <QrScanner labels={s.scan} onDecode={handleScan} />
                </div>
              )}

              {decoding && (
                <p className="text-xs font-mono text-muted">
                  {s.scan.decoding}
                </p>
              )}

              {/* A stale QR is the common case, so say so plainly. */}
              {decodeError && <Callout tone="error">{decodeError}</Callout>}

              {decoded && (
                <Callout tone="success" title={s.scan.decodedTitle}>
                  <p className="font-mono">
                    {decoded.name ?? "—"}
                    {decoded.amount
                      ? ` · ${decoded.amount} ${decoded.currency ?? "BRL"}`
                      : ""}
                  </p>
                  <p className="font-mono opacity-80">{decoded.account}</p>
                  {decoded.amount && <p className="mt-1">{s.scan.requote}</p>}
                </Callout>
              )}

              <button
                onClick={acceptTransaction}
                disabled={accepting || quoteExpired || !canAccept}
                className={btn}
              >
                {accepting ? s.accept.busy : s.accept.submit}
              </button>

              {accepted && (
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <Readout label={s.accept.id} value={accepted.id ?? "—"} />
                  <Readout
                    label={`${s.accept.reference} — ${s.accept.referenceNote}`}
                    value={reference ?? "—"}
                  />
                </div>
              )}

              {accepted?.kycRequired && (
                <Callout tone="warning" title={s.accept.kycTitle}>
                  <p>{s.accept.kycBody}</p>
                  <button
                    onClick={checkKyc}
                    disabled={checkingKyc}
                    className={`${btnGhost} mt-2`}
                  >
                    {checkingKyc ? s.accept.kycBusy : s.accept.kycCheck}
                  </button>
                  {kyc && (
                    <p className="mt-1.5 font-mono">
                      {`hasApproved: ${kyc.hasApproved} · status: ${kyc.status ?? "null"}`}
                    </p>
                  )}
                </Callout>
              )}
            </>
          )}
        </Step>

        {/* 3 — send funds */}
        <Step n={3} title={s.stepSend} done={Boolean(sentHash) || notified}>
          {!accepted ? (
            <p className="text-xs text-muted-light">
              {s.send.needsTransaction}
            </p>
          ) : !ctx ? (
            <Callout tone="warning">{s.send.noContext}</Callout>
          ) : (
            <>
              <p className="text-xs text-muted-light">{s.send.contextNote}</p>
              <div className="rounded-lg border border-border p-3 space-y-2">
                <Readout label={s.send.address} value={ctx.depositAddress} />
                <Readout
                  label={s.send.amount}
                  value={`${ctx.amount} ${ctx.cryptoCurrency}`}
                />
                <Readout
                  label={s.send.chain}
                  value={`${ctx.blockchain} (${ctx.chainFamily}${ctx.chainId ? `, ${ctx.chainId}` : ""})`}
                />
                {memo && <Readout label={s.send.memo} value={memo} />}
                {issuer && (
                  <Readout
                    label={
                      canSignHere
                        ? `${s.send.mint} — ${s.send.mintIsIssuer}`
                        : s.send.mint
                    }
                    value={issuer}
                  />
                )}
              </div>

              {canSignHere ? (
                <>
                  {memo && (
                    <Callout tone="warning">{s.send.memoWarning}</Callout>
                  )}
                  {/* Say why it's off rather than leaving a dead button. */}
                  {sendBlockedBy && (
                    <Callout tone="error">{sendBlockedBy}</Callout>
                  )}
                  <button
                    onClick={sendFunds}
                    disabled={
                      !isAuthenticated || sending || Boolean(sendBlockedBy)
                    }
                    className={btn}
                  >
                    {!isAuthenticated
                      ? t.common.connectWalletToContinue
                      : sending
                        ? s.send.busy
                        : s.send.send}
                  </button>
                  {sentHash && (
                    <Callout tone="success" title={s.send.sent}>
                      <span className="font-mono break-all">{sentHash}</span>
                    </Callout>
                  )}
                </>
              ) : (
                <p className="text-xs text-muted-light">{s.send.manualNote}</p>
              )}

              {ctx.notify.required && (
                <>
                  <p className="text-xs text-muted-light">
                    {s.send.notifyNote}
                  </p>
                  <Field label={s.send.onChainTx}>
                    <input
                      className={inp}
                      value={onChainTx}
                      onChange={(e) => setOnChainTx(e.target.value)}
                      placeholder={s.send.onChainTxPlaceholder}
                      spellCheck={false}
                    />
                  </Field>
                  <button
                    onClick={notifyPayment}
                    disabled={notifying || !onChainTx.trim()}
                    className={btn}
                  >
                    {notifying ? s.send.notifyBusy : s.send.notify}
                  </button>
                  {notified && (
                    <Callout tone="success">{s.send.notified}</Callout>
                  )}
                </>
              )}
            </>
          )}
        </Step>

        {/* 4 — track */}
        <Step
          n={4}
          title={s.stepTrack}
          done={txState?.status === "PAYMENT_COMPLETED"}
        >
          {!accepted?.id ? (
            <p className="text-xs text-muted-light">
              {s.track.needsTransaction}
            </p>
          ) : (
            <>
              <div className="flex flex-wrap items-center gap-3">
                <button
                  onClick={() => refreshStatus(accepted.id!)}
                  disabled={checking}
                  className={btnGhost}
                >
                  {checking ? s.track.busy : s.track.refresh}
                </button>
                <label className="flex items-center gap-1.5 text-xs text-muted">
                  <input
                    type="checkbox"
                    checked={autoPoll}
                    onChange={(e) => setAutoPoll(e.target.checked)}
                    className="accent-[var(--color-primary,#000)]"
                  />
                  {s.track.auto}
                </label>
              </div>

              {txState && (
                <div className="rounded-lg border border-border p-3 space-y-2">
                  <span
                    className={`inline-block rounded px-1.5 py-0.5 text-xs font-mono ${statusTone(txState.status)}`}
                  >
                    {txState.status}
                  </span>
                  <p className="text-xs text-muted">
                    {statusNote[txState.status] ?? ""}
                  </p>
                  {txState.on_chain_tx_hash && (
                    <Readout
                      label={s.track.hash}
                      value={txState.on_chain_tx_hash}
                    />
                  )}
                </div>
              )}
            </>
          )}
        </Step>

        {error && <Callout tone="error">{error}</Callout>}

        <button onClick={resetAll} className={btnGhost}>
          {s.reset}
        </button>
      </div>

      {/* ── right: the wire ───────────────────────────────────────────────── */}
      <div className="lg:sticky lg:top-6 space-y-4">
        <CodePanel sdk={s.requestTitle} note={s.keyNote} code={requestCode} />

        <div className="rounded-lg border border-border overflow-hidden">
          <div className="flex items-center justify-between gap-2 px-4 py-2.5 border-b border-border bg-surface">
            <span className="text-xs font-mono text-muted-light truncate">
              {last ? last.label : s.responseTitle}
            </span>
            {last && (
              <span
                className={`shrink-0 text-xs font-mono px-1.5 py-0.5 rounded ${
                  last.status >= 400
                    ? "bg-error-light text-error"
                    : "bg-success-light text-success"
                }`}
              >
                {last.status}
              </span>
            )}
          </div>
          <pre className="p-4 text-xs font-mono bg-background overflow-x-auto whitespace-pre-wrap break-all min-h-12">
            {last ? JSON.stringify(last.body, null, 2) : s.responseEmpty}
          </pre>
        </div>
      </div>
    </div>
  );

  return (
    <div className="w-full max-w-5xl space-y-5">
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {s.title}
        </h1>
        <p className="text-sm text-muted mt-1.5">{s.desc}</p>
        <a
          href="https://api.abroad.finance/docs"
          target="_blank"
          rel="noopener noreferrer"
          className="mt-1.5 inline-block text-xs font-medium text-primary hover:underline"
        >
          {s.docsLabel} ↗
        </a>
      </div>

      {body}
    </div>
  );
}
