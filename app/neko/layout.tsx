import { notFound } from "next/navigation";
import { clientEnv } from "@/lib/env";

// The whole Neko Protocol section is feature-flagged. When NEXT_PUBLIC_NEKO_ENABLED
// is not "true", every /neko route 404s — this blocks direct URL access even
// though the nav group and landing cards are already hidden in `app/_nav.ts`.
export default function NekoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  if (!clientEnv.NEXT_PUBLIC_NEKO_ENABLED) notFound();
  return children;
}
