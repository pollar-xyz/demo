import { NextRequest, NextResponse } from "next/server";
import { NEKO_COOKIE, NEKO_COOKIE_VALUE, NEKO_PARAM } from "@/lib/neko-gate";

// Unlocks the Neko Protocol section. When a request carries `?neko=<passcode>`
// matching the server-only NEKO_PASSCODE env, set the unlock cookie and
// redirect to the same URL with the param stripped — so the passcode doesn't
// linger in the address bar, browser history or Referer header. The passcode is
// only ever compared here, on the server, and is never shipped to the client;
// the cookie is a plain boolean marker the nav/landing read to show the group.
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const code = url.searchParams.get(NEKO_PARAM);
  if (code === null) return NextResponse.next();

  const passcode = process.env.NEKO_PASSCODE;
  url.searchParams.delete(NEKO_PARAM);
  const res = NextResponse.redirect(url);
  if (passcode && code === passcode) {
    res.cookies.set(NEKO_COOKIE, NEKO_COOKIE_VALUE, {
      path: "/",
      sameSite: "lax",
      // Intentionally not httpOnly: the client nav/landing read this boolean to
      // decide whether to show the Neko group. Only the marker is exposed.
    });
  }
  return res;
}

export const config = {
  // Run on page routes only; skip Next internals, static files and API routes.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
