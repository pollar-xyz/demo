# Abroad → Pollar: native integration handoff

Everything learned wiring Abroad into the demo (`/pollar/ramp/abroad`), written
so the native implementation in the SDK doesn't have to rediscover any of it.

Self-contained on purpose: paste it whole as context. Nothing here needs the
demo repo open, though file paths are given where a reference implementation
exists.

Status of every claim below is marked:

- **[verified]** — observed against the live API during this integration.
- **[spec]** — read off the OpenAPI document, not exercised.
- **[open]** — unknown, needs someone with Abroad support access.

---

## 1. What Abroad is, and what it is not

Abroad is a **crypto → fiat payout rail** for Colombia and Brazil. You send
USDC/USDT on-chain, the recipient gets COP or BRL in a bank account.

**It is off-ramp only. There is no on-ramp.** [verified]

This trips people up, so state it plainly in whatever UI ships:

|                       | direction         |
| :-------------------- | :---------------- |
| on-ramp               | fiat → crypto     |
| **off-ramp** ← Abroad | **crypto → fiat** |

`POST /quote/reverse` is _not_ the on-ramp. Both quote endpoints are crypto →
fiat; they differ only in which side of the pair you pin:

- `POST /quote` — you name the **fiat the recipient gets**, it returns the crypto to send.
- `POST /quote/reverse` — you name the **crypto you send**, it returns the fiat that lands.

The full non-admin endpoint list (§4) contains nothing that accepts fiat in. A
search across the spec for `onramp`, `payin`, `collect`, `charge`, `deposit`,
`cashin` returns only `depositAddress` (where _you_ send crypto) and
`COLLECTING` (an internal ops reconciliation state). [verified]

**There is no sandbox.** Every call is production and moves real money.
Abroad's own docs say so. Budget real funds for testing and start small.

---

## 2. The authoritative source is the OpenAPI document

```
https://api.abroad.finance/swagger.json     ← machine-readable, correct
https://api.abroad.finance/docs             ← Swagger UI over the same
https://github.com/abroad-finance/abroad/tree/main/docs/docs   ← prose, stale
```

**Do not implement from the markdown guides.** They are wrong in ways that cost
real time and, in one case, a failed payout. Every discrepancy found:

| markdown guide says                           | reality [verified]                                                                |
| :-------------------------------------------- | :-------------------------------------------------------------------------------- |
| `GET /payments/banks` lists banks             | Endpoint does not exist — `Cannot GET /payments/banks`                            |
| Send `bank_code` on `POST /transaction`       | No such field, and `additionalProperties: false` rejects it                       |
| `bank_code` values `9101`=ENT, `9102`=TFY     | Meaningless — the field doesn't exist                                             |
| Accept returns `kycLink`                      | Returns `kycRequired: boolean`; no link anywhere                                  |
| Deposit addresses are dashboard config        | They come back on the accept response in `payment_context`                        |
| `crypto_currency` is `USDC`                   | `USDC` **or** `USDT`                                                              |
| Only `quote_id`, `user_id` required on accept | Also needs one of `account_number` / `qr_code` (runtime check, not in the schema) |

The spec is under active development — it grew ~28 KB in one day mid-integration,
adding `/activity*`, a `Country` enum (`BR` \| `CO`) and structured quote error
codes. Re-fetch it rather than trusting a cached copy.

---

## 3. Auth

`X-API-Key: <partner key>` on every call. `Authorization: Bearer <jwt>` is
accepted for user/wallet-scoped operations. [spec]

**The partner key must never reach a browser.** One key can move money for the
whole workspace. This is the single most important architectural constraint —
see §9.

Keys are created in the partner portal (admin email verified + MFA enabled) and
shown once.

---

## 4. Endpoint surface

Everything outside `/ops/*` and `/partner-portal/*` (those manage the workspace
itself — API keys, team, treasury — and must never be reachable from a client):

| method         | path                                                    | role                                                  |
| :------------- | :------------------------------------------------------ | :---------------------------------------------------- |
| POST           | `/quote`                                                | quote by target fiat amount                           |
| POST           | `/quote/reverse`                                        | quote by source crypto amount                         |
| POST           | `/transaction`                                          | accept a quote, register the recipient                |
| GET            | `/transaction/{transactionId}`                          | status                                                |
| GET            | `/transactions/list`                                    | paginated, `?externalUserId=`                         |
| GET            | `/activity`, `/activity/{id}`, `/activity/{id}/receipt` | consumer-facing activity feed + receipts (new)        |
| GET            | `/payments/liquidity`                                   | `?paymentMethod=BREB\|PIX`                            |
| POST           | `/payments/notify`                                      | claim a deposit by hash                               |
| POST           | `/solana/payments/notify`                               | same, Solana                                          |
| POST           | `/celo/payments/notify`                                 | same, Celo                                            |
| POST           | `/kyc`                                                  | submit KYC — **multipart**, document image            |
| GET            | `/kyc/status`                                           | `?userId=`                                            |
| GET            | `/qr-decoder/br`                                        | `?qrCode=` — decode a Pix payload, **public, no key** |
| GET            | `/public/corridors`                                     | returned empty when tried [verified]                  |
| GET            | `/public/transparency`                                  | not exercised                                         |
| GET/POST/PATCH | `/partner`, `/partnerUser`, `/partnerUser/{userId}`     | partner-user records                                  |
| POST           | `/walletAuth/challenge` `/verify` `/refresh`            | wallet-scoped JWT                                     |

---

## 5. Schemas

Enums:

```ts
type CryptoCurrency = "USDC" | "USDT";
type BlockchainNetwork = "STELLAR" | "SOLANA" | "CELO";
type TargetCurrency = "COP" | "BRL";
type PaymentMethod = "BREB" | "PIX";
type Country = "BR" | "CO";
type ChainFamily = "evm" | "solana" | "stellar";
type TransactionStatus =
  | "AWAITING_PAYMENT" // accepted, waiting for the on-chain deposit
  | "PROCESSING_PAYMENT" // deposit seen, payout in flight
  | "PAYMENT_COMPLETED" // recipient paid
  | "PAYMENT_FAILED" // payout rejected by the provider
  | "PAYMENT_EXPIRED" // quote expired before funds arrived
  | "WRONG_AMOUNT"; // underpaid — Abroad attempts an on-chain refund

// newer, structured quote errors
type QuoteErrorCode =
  | "corridor_unavailable"
  | "maximum"
  | "minimum"
  | "quote_unavailable"
  | "authentication_failed"
  | "invalid_request"
  | "server_error";
// QuoteErrorResponse: { code, reason, retryable }
```

`COP` only settles over `BREB`; `BRL` only over `PIX`. The currency determines
the rail — there is no valid cross pairing, so derive the method rather than
asking for it.

### POST /quote

```ts
// request — all required
{
  amount: number;
  crypto_currency;
  network;
  payment_method;
  target_currency;
}
// POST /quote/reverse is identical but `source_amount` instead of `amount`

// response
{
  quote_id: string;
  value: number;
  expiration_time: number; /* epoch ms */
}
```

`value` is the crypto to send (`/quote`) or the fiat that lands after fees
(`/quote/reverse`). Quotes live up to an hour.

### POST /transaction

```ts
// request — additionalProperties: false, an unknown key is a 400
{
  quote_id: string;        // required
  user_id: string;         // required — your id, echoed on webhooks
  account_number?: string; // one of these two is REQUIRED at runtime
  qr_code?: string;        //   (see gotcha #2)
  tax_id?: string;         // CPF for Pix, etc.
  redirectUrl?: string;
}

// response
{
  id: string | null;
  kycRequired: boolean;
  transaction_reference: string | null;
  payment_context: PaymentContext | null;
}
```

### PaymentContext — the important one

Everything needed to pay comes back here. **Configure none of it locally.**

```ts
type PaymentContext = {
  blockchain: BlockchainNetwork;
  chainFamily: ChainFamily;
  chainId: string; // "stellar:pubnet"
  cryptoCurrency: CryptoCurrency;
  depositAddress: string; // where to send
  amount: number; // exactly how much
  decimals: number | null;
  memo: string | null; // === transaction_reference on Stellar
  memoType: "text" | null;
  mintAddress: string | null; // token address per chain — ON STELLAR, THE ISSUER
  rpcUrl: string | null;
  notify: { required: boolean; endpoint: string | null };
};
```

### GET /transaction/{id}

```ts
{
  id: string;
  user_id: string;
  status: TransactionStatus;
  kycRequired: boolean;
  transaction_reference: string;
  on_chain_tx_hash: string | null;
}
```

### GET /kyc/status?userId=

```ts
{
  hasApproved: boolean;
  status: string | null;
}
```

### GET /qr-decoder/br?qrCode=

```ts
{ decoded: {
    account: string;          // the Pix key
    amount: string | null;    // e.g. "4.00"
    currency: string | null;  // "BRL"
    name: string | null;      // payee legal name
    taxId: string | null;
  } | null }                  // null === the QR no longer resolves
```

### Errors

`{ "reason": string }` with a 4xx. `reason` is sometimes a _stringified JSON
array_ of zod issues, so parse defensively:

```json
{
  "reason": "[\n  {\n    \"code\": \"custom\",\n    \"message\": \"Account number or QR code is required\",\n    \"path\": [\"account_number\"]\n  }\n]"
}
```

---

## 6. The flow

```
POST /quote            → quote_id, value, expiration_time
POST /transaction      → id, transaction_reference, payment_context, kycRequired
send crypto on-chain   → memo = transaction_reference   (Stellar)
                       → POST …/payments/notify          (when notify.required)
GET  /transaction/{id} → poll until it settles
```

Real captured exchange [verified]:

```jsonc
// POST /transaction
{ "quote_id": "1e820887-…", "user_id": "demo-user-01", "account_number": "44345129869" }

// 200
{
  "id": "327ffc24-c6fa-4fc3-8f6c-d85e9c1ec189",
  "kycRequired": false,
  "transaction_reference": "Mn/8JMb6T8OPbNhenB7BiQ==",
  "payment_context": {
    "amount": 2.29,
    "blockchain": "STELLAR",
    "chainFamily": "stellar",
    "chainId": "stellar:pubnet",
    "cryptoCurrency": "USDC",
    "decimals": 7,
    "depositAddress": "GCLMP4CYNFN62DDKPRMFWU4FQZFJBUL4CPTJ3JAGIHM72UNB6IX5HUGK",
    "memo": "Mn/8JMb6T8OPbNhenB7BiQ==",
    "memoType": "text",
    "mintAddress": "GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN",
    "notify": { "endpoint": null, "required": false },
    "rpcUrl": "https://…stellar-mainnet.quiknode.pro/…"
  }
}
```

---

## 7. Gotchas — the expensive ones

### 1. `payment_context.mintAddress` is the Stellar **issuer**

`GA5ZSEJ…K4KZVN` above is Circle's USDC mainnet issuer. On Solana/EVM the same
field carries the token contract. Pollar's `POST /v2/tx/build` has no union
branch for a credit asset without an issuer, so omitting it is a hard 400:

```jsonc
// what fails
"asset": { "type": "credit_alphanum4", "code": "USDC" }
// → VALIDATION_ERROR invalid_union at params.asset:
//   native branch:   type must be "native"
//   alphanum4:       issuer expected string, received undefined   ← the real one
//   alphanum12:      type mismatch + code too_small (min 5)

// what works
"asset": {
  type: cryptoCurrency.length <= 4 ? "credit_alphanum4" : "credit_alphanum12",
  code: cryptoCurrency,
  issuer: paymentContext.mintAddress,
}
```

Both supported assets are 4 characters, but derive the branch from the length
anyway.

### 2. `account_number` OR `qr_code` is required

The OpenAPI schema marks only `quote_id` and `user_id` required. A **runtime
zod refinement** rejects a body with neither:

```
reason: [{ code: "custom", message: "Account number or QR code is required",
           path: ["account_number"] }]
```

Enforce it client-side. And because `additionalProperties: false`, never send a
key the schema doesn't list — `bank_code` included.

### 3. `account_number` is verified against the live rail, and its format is undocumented

An unrecognized value gets
`"We could not verify the account number provided."` There is no test value and
no sandbox — a demo/QA flow needs a real registered key.

**The format is documented nowhere.** [verified] Searched the whole OpenAPI
document (no `pattern`, no `description` on the field) and every markdown page
including `workflows/accept-transaction.md`, which says only:

> "The recipient's bank account or mobile wallet number."

What the evidence supports, as **inference** rather than fact:

- The method is `BREB`, and BreB routes by **llave** (key) — `@alias`, phone,
  document or email — registered by the recipient, not by account number.
- The only concrete example Abroad publishes is `3001234567`: a Colombian
  mobile shape (10 digits, leading 3). That is a llave.
- An 11-digit value (bank-account shaped, e.g. Bancolombia savings) was
  rejected. [verified]

So for COP, pass a **BreB llave**, most likely the recipient's registered
mobile. Confirm the accepted key types with Abroad support before shipping.

For BRL, pass a Pix key — or better, the QR (see #4).

### 4. Dynamic Pix QRs are per-charge and single-use

A payload like

```
00020101021226910014br.gov.bcb.pix2569qrcode.pix.celcoin.com.br/pixqrcode/v2/703b040e…6304443A
```

carries a charge id in the URL. Once used or expired, `/qr-decoder/br` returns
`{"decoded": null}`. Two separate QRs from the same payee went stale within the
session. [verified]

**Paying the bare key instead of the QR fails.** A payout sent to the decoded
`account` (a chave aleatória) with no charge context reached the Pix network —
it got an E2E id — and was rejected by the payee's PSP. So: when the user has a
dynamic QR, send `qr_code`, not `account_number`.

Always decode immediately before quoting, and quote the amount the decoder
returns. `/qr-decoder/br` is public (no API key), which makes it safe to call
from anywhere.

### 5. Stellar memo = `transaction_reference`, exactly

Without it Abroad cannot match the deposit and **the funds are lost**. The
reference is base64, 24 characters for the ones observed, which fits inside
Stellar's 28-byte text memo. Don't truncate, don't re-encode.

Prefer `payment_context.memo` + `memoType` over reading `transaction_reference`
directly — it lets Abroad decide per chain. `notify.required` was `false` for
Stellar; chains without a memo use the notify call instead.

### 6. Mainnet only

`chainId: "stellar:pubnet"`. The deposit address is a mainnet account and the
issuer is mainnet USDC. Signing against testnet builds a transaction that can
never settle. Compare `payment_context.chainId` with the session's network and
refuse the mismatch.

### 7. Failed payouts are refunded on-chain

A failed transaction showed `Refund status: Refunded` with a refund tx hash. So
a failure is not necessarily a loss — surface the refund hash in whatever UI
ships. `WRONG_AMOUNT` behaves the same way (underpayment → refund attempt).

### 8. Check liquidity before offering a corridor

```
GET /payments/liquidity?paymentMethod=BREB
  → {"liquidity": 0, "success": false, "message": "Refresh produced no usable value"}
  → {"liquidity": 0, "success": false, "message": "Request failed with status code 429"}
GET /payments/liquidity?paymentMethod=PIX
  → {"liquidity": 4303.1, "success": true}
```

BreB sat at 0 across two days while Pix stayed healthy. [verified] Gate the
corridor picker on this — a dead corridor wastes the user's time downstream.

Note the failure modes are distinguishable: insufficient liquidity has its own
message ("liquidity for this method is below the requested amount"), so an
account-verification 400 is a key-format problem, not a liquidity problem.

### 9. Quotes expire

`expiration_time` is epoch **ms**. Show a countdown, invalidate everything
downstream when a new quote is fetched, and block accept on an expired one.

### 10. Limits and thresholds that will stop a demo

From `resources/limits.md`: [spec]

|                           | BREB           | PIX    |
| :------------------------ | :------------- | :----- |
| max / transaction         | 5,000,000 COP  | no cap |
| max / user / day          | 25,000,000 COP | no cap |
| max / method / day        | 25,000,000 COP | no cap |
| transactions / user / day | 15             | no cap |

Two more that bite early:

- **Partners without KYB approval: US$100 cumulative** source currency across
  completed transactions. Easy to hit while testing.
- **Users: US$25** source volume rolling 30 days before KYC gating kicks in.

---

## 8. Reference implementation (this demo)

| file                                | what it holds                                     |
| :---------------------------------- | :------------------------------------------------ |
| `app/api/abroad/[...path]/route.ts` | Server proxy holding the key; explicit allow-list |
| `app/api/abroad/config/route.ts`    | Only `{ configured: boolean }`                    |
| `app/pollar/ramp/abroad/page.tsx`   | The four-step flow                                |
| `app/pollar/ramp/abroad/_i18n.ts`   | en/es/pt strings                                  |
| `app/_components/QrScanner.tsx`     | Generic QR input: camera / paste / upload         |

The route is deliberately **unlisted**: `hidden: true` on its `NavTab` in
`app/_nav.ts` keeps it off the Ramp tab bar while `/pollar/ramp/abroad` stays
fully functional for anyone who types it.

The proxy allow-list, verbatim — everything else 403s:

```
POST  /quote
POST  /quote/reverse
POST  /transaction
GET   /transaction/{uuid}
GET   /transactions/list
GET   /payments/liquidity
POST  /payments/notify
POST  /solana/payments/notify
POST  /celo/payments/notify
GET   /kyc/status
GET   /qr-decoder/br
```

`/ops/*` and `/partner-portal/*` are deliberately absent. `POST /kyc` is absent
because it is multipart with a document image.

---

## 9. Recommended native design

### 9.1 The key belongs in `PollarPayBackend`

The demo's proxy is a stand-in for what the platform should do properly. In the
SDK there is no place to hide a partner key: `@pollar/core` runs in the browser
and in React Native.

So: **Abroad's key lives in `PollarPayBackend`**, which exposes Abroad-backed
endpoints under the existing `sdk.api.pollar.xyz` surface, authenticated by the
Pollar app key the SDK already carries. The SDK never sees an Abroad key, the
same way it never sees an anchor's credentials today.

This also gives the platform the seam it needs for per-app enablement, limits,
and its own transaction records — the same shape as the dashboard-toggled
anchors behind `openRampModal()`.

### 9.2 Client surface

Mirror the existing ramp naming so it reads as one product:

```ts
client.getAbroadQuote({ mode, amount, cryptoCurrency, network, paymentMethod, targetCurrency })
client.createAbroadPayout({ quoteId, userId, accountNumber?, qrCode?, taxId? })
client.pollAbroadPayout(id)
client.decodePixQr(qrCode)          // public upstream, no key needed
client.getAbroadLiquidity(method)
client.getAbroadKycStatus(userId)
```

`createAbroadPayout` should return the `payment_context` untouched. Do not
flatten or reinterpret it — it is the contract that keeps the deposit address,
memo and issuer out of client configuration.

### 9.3 One function should do the payment

The single highest-value thing the SDK can own: turn a `payment_context` into a
signed, submitted transaction, so every integrator doesn't re-derive gotchas #1
and #5.

```ts
// resolves chain family, asset branch, issuer/mint, memo, network check
await client.payAbroadPaymentContext(paymentContext);
```

Internally, for `chainFamily === "stellar"`:

```ts
runTx(
  "payment",
  {
    destination: ctx.depositAddress,
    asset: {
      type: assetBranch(ctx.cryptoCurrency),
      code: ctx.cryptoCurrency,
      issuer: ctx.mintAddress,
    },
    amount: String(ctx.amount),
  },
  ctx.memoType === "text" && ctx.memo
    ? { memo: { type: "text", value: ctx.memo } }
    : undefined,
);
```

Then, when `ctx.notify.required`, post the resulting hash to
`ctx.notify.endpoint`. Refuse up front — never let the build fire — when the
issuer is missing or `ctx.chainId` disagrees with the session network.

### 9.4 React

```ts
const { openAbroadPayoutModal, abroadPayout } = usePollar();
```

with `abroadPayout` a reactive state machine mirroring `tx`:
`idle → quoting → quoted → accepting → awaiting-payment → paying → processing → completed | failed | expired | refunded`.

The modal wants: corridor picker (gated on liquidity), amount with live
countdown, recipient input with the Pix-QR scanner, a KYC gate on
`kycRequired`, and a payment screen that shows the memo prominently with the
"funds are lost without it" warning.

`app/_components/QrScanner.tsx` is a working camera/paste/upload QR reader
(native `BarcodeDetector` with a `jsQR` fallback) and is the obvious thing to
lift. It needs a secure context — localhost or https.

### 9.5 Error surface

Unwrap `{ reason }`, and detect the stringified-zod-array case so the user sees
`"Account number or QR code is required"` rather than a JSON blob. Prefer the
newer `QuoteErrorResponse` shape (`code` + `retryable`) where it's returned — it
distinguishes `minimum` / `maximum` / `corridor_unavailable` cleanly. A failed
build is a normal outcome (expired quote, no trustline, no balance) — return it
as state, don't throw past the caller.

---

## 10. Open questions

- **[open]** Which BreB key types `account_number` accepts for COP (see gotcha
  #3). This is the single biggest blocker for the Colombian corridor.
- **[open]** Why BreB liquidity has been 0 for days, and whether it is
  account-specific or global.
- **[open]** A failed Pix payout showed `PIX · CO` as its payout context in the
  partner dashboard — country `CO` on a Brazilian Pix payout. `Failure reason:
Not provided by the payout provider`, so it can't be confirmed from outside
  whether that caused the rejection or is just how the dashboard renders it.
  Worth asking support with transaction `60e71b17-c49c-4516-a82a-7869ab285d06`,
  Pix E2E `E47133056202608031600e75419aznnn`.
- **[open]** Whether `mintAddress` is populated on Solana/Celo the way it is on
  Stellar — only Stellar was exercised.
- **[open]** `/public/corridors` returned empty. If it's meant to advertise live
  corridors, it would be the right thing to drive the corridor picker off.
- **[open]** Webhooks: the markdown mentions an `X-Abroad-Webhook-Secret` header
  and the partner portal has webhook config, but no delivery was observed. The
  dashboard said "No delivery record yet".
- **[open]** Per-corridor minimums. 3–7 BRL quotes were accepted; the new
  `QuoteRequestErrorCode` has a `minimum` code but no documented floor.
- **[open]** `USDT` is in the enum but was never exercised.

---

## 11. Observed values

Useful for sanity-checking an implementation. Rates move; the shapes don't.

```
400,000 COP / BREB / STELLAR  → 125.13–125.28 USDC
      3 BRL / PIX  / STELLAR  →   0.76 USDC
      4 BRL / PIX  / STELLAR  →   0.98 USDC

liquidity  BREB → 0 (success:false), two days running
liquidity  PIX  → ~3,880–4,300

USDC issuer, Stellar mainnet
  GA5ZSEJYB37JRC5AVCIA5MOP4RHTM335X2KGX3IHOJAPP5RE34K4KZVN
transaction_reference shape
  "Mn/8JMb6T8OPbNhenB7BiQ==" — base64, 24 chars, fits a 28-byte text memo
```
