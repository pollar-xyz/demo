import { NextRequest, NextResponse } from "next/server";

// Same-origin gateway to Neko Protocol's PUBLIC audit endpoint.
//
// Unlike the server-only proxy (see ../[...path]/route.ts), the audit endpoint
// at app.nekoprotocol.xyz/api/audit is public — it carries no `x-server-code`
// secret. We still forward through a same-origin route so the browser isn't
// subject to the Neko app's CORS policy, and so the base URL stays configurable.
//
// This static `audit` segment takes precedence over the sibling `[...path]`
// catch-all for /api/neko/audit, so the two routes never collide.

const APP_BASE = process.env.NEKO_APP_BASE_URL?.replace(/\/+$/, "");
const TIMEOUT_MS = Number(process.env.NEKO_PROXY_TIMEOUT_MS ?? "15000");

type Method = "GET" | "POST";

async function forward(
  req: NextRequest,
  method: Method,
): Promise<NextResponse> {
  if (!APP_BASE) {
    return NextResponse.json(
      {
        error: "neko_not_configured",
        message: "Set NEKO_APP_BASE_URL in your environment.",
      },
      { status: 503 },
    );
  }

  const headers: Record<string, string> = {};
  let body: string | undefined;
  if (method === "POST") {
    body = await req.text();
    headers["content-type"] =
      req.headers.get("content-type") ?? "application/json";
  }

  const controller = new AbortController();
  const timer = setTimeout(() => controller.abort(), TIMEOUT_MS);
  try {
    const upstream = await fetch(`${APP_BASE}/api/audit${req.nextUrl.search}`, {
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

export async function GET(req: NextRequest) {
  return forward(req, "GET");
}

export async function POST(req: NextRequest) {
  return forward(req, "POST");
}
