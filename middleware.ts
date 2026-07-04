import { NextRequest, NextResponse } from "next/server";
import { NEKO_COOKIE, NEKO_COOKIE_VALUE, NEKO_PARAM } from "@/app/neko/_gate";
import { LAB_GATES, LAB_COOKIE_VALUE } from "@/app/_labGate";

// Each lab group's passcode lives in its own server-only env var. Read them
// statically here (the edge runtime only inlines direct `process.env.X`
// accesses) and key them by the group's URL param.
const LAB_PASSCODES: Record<string, string | undefined> = {
  cosmos: process.env.COSMOS_PAY_PASSCODE,
  accesly: process.env.ACCESLY_PASSCODE,
  nirium: process.env.NIRIUM_PASSCODE,
};

// Unlocks the passcode-gated sections — the Neko Protocol section, and each
// still-in-testing "lab" group (Cosmos Pay, Accesly, Nirium), which each carry
// their OWN independent passcode. When a request carries a passcode param
// matching the server-only env, set that group's unlock cookie and redirect to
// the same URL with the param stripped — so the passcode doesn't linger in the
// address bar, browser history or Referer header. Each passcode is only ever
// compared here, on the server, and is never shipped to the client; the cookies
// are plain boolean markers the nav/landing read to gate a group.
export function middleware(req: NextRequest) {
  const url = req.nextUrl.clone();
  const cookiesToSet: { name: string; value: string }[] = [];
  let handled = false;

  const nekoCode = url.searchParams.get(NEKO_PARAM);
  if (nekoCode !== null) {
    handled = true;
    const passcode = process.env.NEKO_PASSCODE;
    url.searchParams.delete(NEKO_PARAM);
    if (passcode && nekoCode === passcode) {
      cookiesToSet.push({ name: NEKO_COOKIE, value: NEKO_COOKIE_VALUE });
    }
  }

  // Each lab group unlocks independently via its own `?<param>=<passcode>`.
  for (const { param, cookie } of Object.values(LAB_GATES)) {
    const code = url.searchParams.get(param);
    if (code === null) continue;
    handled = true;
    url.searchParams.delete(param);
    const passcode = LAB_PASSCODES[param];
    if (passcode && code === passcode) {
      cookiesToSet.push({ name: cookie, value: LAB_COOKIE_VALUE });
    }
  }

  if (!handled) return NextResponse.next();

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
