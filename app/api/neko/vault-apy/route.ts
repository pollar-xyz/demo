import { NextRequest, NextResponse } from "next/server";

// Same-origin gateway to Neko's PUBLIC vault-APY endpoint
// (app.nekoprotocol.xyz/api/vault/apy). Like the audit route, it carries NO
// x-server-code secret — we forward through here only to dodge the Neko app's
// CORS policy and keep the base URL configurable.
//
// This static `vault-apy` segment takes precedence over the sibling `[...path]`
// catch-all, so the two never collide.

const APP_BASE = (
  process.env.NEKO_APP_BASE_URL ?? "https://app.nekoprotocol.xyz"
).replace(/\/+$/, "");
const TIMEOUT_MS = Number(process.env.NEKO_PROXY_TIMEOUT_MS ?? "15000");

export async function GET(req: NextRequest): Promise<NextResponse> {
  if (!APP_BASE) {
    return NextResponse.json(
      {
        error: "neko_not_configured",
        message: "Set NEKO_APP_BASE_URL in your environment.",
      },
      { status: 503 },
    );
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const upstream = await fetch(
      `${APP_BASE}/api/vault/apy${req.nextUrl.search}`,
      { signal: controller.signal },
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
