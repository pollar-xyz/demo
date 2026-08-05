import { NextResponse } from "next/server";

// Tells the browser whether this server can talk to Abroad at all, so the UI
// can explain what to set instead of failing on every call. A static segment,
// so it wins over the [...path] catch-all next to it and is never forwarded
// upstream.
//
// Nothing else belongs here: the deposit address, memo, amount and decimals all
// come back from POST /transaction as `payment_context`, so there is no
// per-network configuration for the client to read.

export async function GET() {
  return NextResponse.json({ configured: Boolean(process.env.ABROAD_API_KEY) });
}
