import { NextRequest, NextResponse } from "next/server";

// Server-side gateway to the Abroad API (https://api.abroad.finance).
//
// Abroad authenticates with a partner `X-API-Key`, and its docs are explicit
// that the key must never be exposed client-side — one key can move real money
// for the whole workspace. So the browser calls THESE same-origin routes, which
// hold the key (server env) and forward to Abroad 1:1, exactly like the Neko
// gateway in app/api/neko/*.
//
// Only the endpoints the demo actually uses are allow-listed below — this is
// not an open relay. Note what is deliberately absent: everything under /ops
// and /partner-portal (those manage the workspace itself — API keys, team,
// treasury — and must not be reachable from a browser).
//
// The paths here come from the live OpenAPI spec at
// https://api.abroad.finance/swagger.json, which is authoritative. The markdown
// guides in the abroad-finance repo are out of date in places — /payments/banks
// is documented there but does not exist on the API.

const BASE = (
  process.env.ABROAD_BASE_URL ?? "https://api.abroad.finance"
).replace(/\/+$/, "");
const KEY = process.env.ABROAD_API_KEY;
const TIMEOUT_MS = Number(process.env.ABROAD_TIMEOUT_MS ?? "15000");

type Method = "GET" | "POST";

const UUID = "[0-9a-fA-F]{8}(?:-[0-9a-fA-F]{4}){3}-[0-9a-fA-F]{12}";

const ALLOW: { method: Method; re: RegExp }[] = [
  // Quotes: /quote takes the fiat amount to deliver, /quote/reverse the crypto
  // amount to spend.
  { method: "POST", re: /^\/quote$/ },
  { method: "POST", re: /^\/quote\/reverse$/ },
  // Accept a quote (registers the recipient) and read a transaction back.
  { method: "POST", re: /^\/transaction$/ },
  { method: "GET", re: new RegExp(`^/transaction/${UUID}$`) },
  { method: "GET", re: /^\/transactions\/list$/ },
  // Current liquidity for a payment method.
  { method: "GET", re: /^\/payments\/liquidity$/ },
  // Chains without a memo claim the deposit by notifying Abroad of the hash
  // after broadcasting. `payment_context.notify.endpoint` says which to call.
  { method: "POST", re: /^\/payments\/notify$/ },
  { method: "POST", re: /^\/solana\/payments\/notify$/ },
  { method: "POST", re: /^\/celo\/payments\/notify$/ },
  // Whether a user has cleared KYC. Submitting it (POST /kyc) is multipart with
  // a document image and is deliberately not proxied here.
  { method: "GET", re: /^\/kyc\/status$/ },
  // Reads a Pix "copia e cola" payload back into payee + amount. Public
  // upstream (no key), but routed through here so the client has one code path.
  { method: "GET", re: /^\/qr-decoder\/br$/ },
];

async function forward(
  req: NextRequest,
  path: string[],
  method: Method,
): Promise<NextResponse> {
  if (!KEY) {
    return NextResponse.json(
      {
        error: "abroad_not_configured",
        message: "Set ABROAD_API_KEY in your environment.",
      },
      { status: 503 },
    );
  }

  const upstreamPath = "/" + path.join("/");
  if (!ALLOW.some((r) => r.method === method && r.re.test(upstreamPath))) {
    return NextResponse.json(
      { error: "path_not_allowed", path: upstreamPath },
      { status: 403 },
    );
  }

  const headers: Record<string, string> = { "X-API-Key": KEY };
  let body: string | undefined;
  if (method === "POST") {
    body = await req.text();
    headers["content-type"] =
      req.headers.get("content-type") ?? "application/json";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const upstream = await fetch(
      `${BASE}${"/" + path.map(encodeURIComponent).join("/")}${req.nextUrl.search}`,
      { method, headers, body, signal: controller.signal },
    );
    const text = await upstream.text();
    return new NextResponse(text, {
      status: upstream.status,
      headers: {
        "content-type":
          upstream.headers.get("content-type") ?? "application/json",
      },
    });
  } catch (err) {
    const aborted = err instanceof Error && err.name === "AbortError";
    return NextResponse.json(
      { error: aborted ? "upstream_timeout" : "upstream_unreachable" },
      { status: aborted ? 504 : 502 },
    );
  } finally {
    clearTimeout(timer);
  }
}

export async function GET(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forward(req, path, "GET");
}

export async function POST(
  req: NextRequest,
  { params }: { params: Promise<{ path: string[] }> },
) {
  const { path } = await params;
  return forward(req, path, "POST");
}
