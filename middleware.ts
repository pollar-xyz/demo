import { NextRequest, NextResponse } from "next/server";
import { NEKO_COOKIE, NEKO_COOKIE_VALUE, NEKO_PARAM } from "@/app/neko/_gate";
import {
  ACCESLY_COOKIE,
  ACCESLY_COOKIE_VALUE,
  ACCESLY_PARAM,
} from "@/app/accesly/_gate";

// Unlocks gated sections (Neko Protocol, Accesly). When a request carries a
// passcode param matching the server-only env, set the unlock cookie and
// redirect to the same URL with the param stripped — so the passcode doesn't
// linger in the address bar, browser history or Referer header. The passcode is
// only ever compared here, on the server, and is never shipped to the client;
// the cookie is a plain boolean marker the nav/landing read to show the group.
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const nekoCode = url.searchParams.get(NEKO_PARAM);
  const acceslyCode = url.searchParams.get(ACCESLY_PARAM);

  if (nekoCode === null && acceslyCode === null) return NextResponse.next();

  const cookiesToSet: { name: string; value: string }[] = [];

  if (nekoCode !== null) {
    const passcode = process.env.NEKO_PASSCODE;
    url.searchParams.delete(NEKO_PARAM);
    if (passcode && nekoCode === passcode) {
      cookiesToSet.push({ name: NEKO_COOKIE, value: NEKO_COOKIE_VALUE });
    }
  }

  if (acceslyCode !== null) {
    const passcode = process.env.ACCESLY_PASSCODE;
    url.searchParams.delete(ACCESLY_PARAM);
    if (passcode && acceslyCode === passcode) {
      cookiesToSet.push({ name: ACCESLY_COOKIE, value: ACCESLY_COOKIE_VALUE });
    }
  }

  const res = NextResponse.redirect(url);
  for (const cookie of cookiesToSet) {
    res.cookies.set(cookie.name, cookie.value, {
      path: "/",
      sameSite: "lax",
    });
  }
  return res;
}

export const config = {
  // Run on page routes only; skip Next internals, static files and API routes.
  matcher: ["/((?!_next/static|_next/image|favicon.ico|api/).*)"],
};
