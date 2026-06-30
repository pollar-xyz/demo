import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { NEKO_COOKIE, NEKO_COOKIE_VALUE } from "./_gate";
import { NekoMainnetGate } from "./_MainnetGate";

// The whole Neko Protocol section is gated. It unlocks when a request arrives
// with `?neko=<passcode>` — middleware.ts validates the passcode server-side
// and sets the unlock cookie. Without the cookie every /neko route 404s, which
// blocks direct URL access even though the nav group and landing cards are
// already hidden in `app/_nav.ts`.
export default async function NekoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unlocked =
    (await cookies()).get(NEKO_COOKIE)?.value === NEKO_COOKIE_VALUE;
  if (!unlocked) notFound();
  return <NekoMainnetGate>{children}</NekoMainnetGate>;
}
