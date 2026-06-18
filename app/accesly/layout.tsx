import { cookies } from "next/headers";
import { notFound } from "next/navigation";
import { ACCESLY_COOKIE, ACCESLY_COOKIE_VALUE } from "./_gate";
import { AcceslyClientLayout } from "./_ClientLayout";

// The whole Accesly section is gated. It unlocks when a request arrives with
// `?accesly=<passcode>` — middleware.ts validates the passcode server-side and
// sets the unlock cookie. Without the cookie every /accesly route 404s, which
// blocks direct URL access even though the nav group is hidden in `app/_nav.ts`.
export default async function AcceslyLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const unlocked =
    (await cookies()).get(ACCESLY_COOKIE)?.value === ACCESLY_COOKIE_VALUE;
  if (!unlocked) notFound();

  return <AcceslyClientLayout>{children}</AcceslyClientLayout>;
}
