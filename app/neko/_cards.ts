import type { Dictionary } from "@/app/_i18n/translations";
import type { TabLabel } from "@/app/_nav";

// Landing-card descriptions for the Neko tabs, kept with the section's own code
// instead of hardcoded in the shared landing page (app/page.tsx).
export function nekoTabDesc(t: Dictionary, label: TabLabel): string {
  if (label === "overview") return t.nekoAbout.tagline;
  if (label === "dashboard") return t.neko.cardDesc;
  if (label === "pools") return t.nekoPools.cardDesc;
  if (label === "vaults") return t.nekoVaults.cardDesc;
  return "";
}
