import { NextRequest, NextResponse } from "next/server";

// Server-side gateway to the Neko Protocol proxy.
//
// The Neko proxy is server-only: it requires a secret `x-server-code` header and
// must never be called from the browser. So the browser calls THESE same-origin
// routes, which hold the secret (server env) and forward to the proxy 1:1.
//
// Only the endpoints the demo actually uses are allow-listed below — this is not
// an open relay.

const BASE = process.env.NEKO_PROXY_BASE_URL?.replace(/\/+$/, "");
const CODE = process.env.NEKO_SERVER_CODE;
const TIMEOUT_MS = Number(process.env.NEKO_PROXY_TIMEOUT_MS ?? "15000");

type Method = "GET" | "POST";

// Stellar public key: base32 (A-Z, 2-7), 56 chars, starts with G.
const ALLOW: { method: Method; re: RegExp }[] = [
  { method: "GET", re: /^\/v1\/etherfuse\/bond-yields$/ },
  { method: "GET", re: /^\/dashboard\/pool-catalog$/ },
  { method: "GET", re: /^\/dashboard\/prices$/ },
  { method: "GET", re: /^\/dashboard\/positions\/G[A-Z2-7]{55}$/ },
  { method: "GET", re: /^\/v1\/pool-rates\/[A-Za-z0-9._-]+$/ },
  { method: "GET", re: /^\/users$/ },
  { method: "POST", re: /^\/users$/ },
  { method: "POST", re: /^\/v1\/tx\/prepare$/ },
  { method: "POST", re: /^\/v1\/tx\/submit$/ },
  { method: "GET", re: /^\/v1\/tx\/[a-f0-9]{64}$/ },
  { method: "GET", re: /^\/v1\/audit$/ },
  { method: "POST", re: /^\/v1\/audit$/ },
  { method: "GET", re: /^\/v1\/defindex\/vaults$/ },
];

async function forward(
  req: NextRequest,
  path: string[],
  method: Method,
): Promise<NextResponse> {
  if (!BASE || !CODE) {
    return NextResponse.json(
      {
        error: "neko_not_configured",
        message:
          "Set NEKO_PROXY_BASE_URL and NEKO_SERVER_CODE in your environment.",
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

  const headers: Record<string, string> = { "x-server-code": CODE };
  let body: string | undefined;
  if (method === "POST") {
    body = await req.text();
    headers["content-type"] =
      req.headers.get("content-type") ?? "application/json";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const upstream = await fetch(`${BASE}${upstreamPath}${req.nextUrl.search}`, {
      method,
      headers,
      body,
      signal: controller.signal,
    });
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
