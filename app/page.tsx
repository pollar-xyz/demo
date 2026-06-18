"use client";

import Link from "next/link";
import { visibleGroups, type NavGroup, type TabLabel } from "./_nav";
import { useNekoUnlocked } from "./neko/_GateProvider";
import { useAcceslyUnlocked } from "./accesly/_GateProvider";
import { nekoTabDesc } from "./neko/_cards";
import { useApiKeyHref } from "./_useApiKeyHref";
import { useI18n } from "./_i18n/LanguageProvider";
import type { Dictionary } from "./_i18n/translations";

// Short blurb for each landing card. Native tabs reuse the existing home
// descriptions; the explainer "overview" tabs borrow their about-page tagline.
function tabDesc(t: Dictionary, group: NavGroup, label: TabLabel): string {
  // Neko owns its card copy (app/neko/_cards.ts) so its strings stay with it.
  if (group.key === "nekoProtocol") return nekoTabDesc(t, label);
  if (label === "overview") {
    if (group.key === "trustlessWork") return t.twAbout.tagline;
    if (group.key === "lumenwipe") return t.lwAbout.tagline;
    if (group.key === "accesly") return ""; // TODO: add description if needed
    return "";
  }
  return t.home.descs[label as keyof Dictionary["home"]["descs"]];
}

export default function Home() {
  const { t } = useI18n();
  const withApiKey = useApiKeyHref();
  const GROUPS = visibleGroups(useNekoUnlocked(), useAcceslyUnlocked());

  return (
    <div className="w-full">
      <div className="mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-primary">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path
              fillRule="evenodd"
              d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z"
              clipRule="evenodd"
            />
          </svg>
          <span className="font-semibold">{t.home.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {t.home.titlePre}
          <span className="text-primary">{t.home.titleHighlight}</span>
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-xl">
          {t.home.subtitle}
        </p>
      </div>

      <div className="space-y-10">
        {GROUPS.map((group) => (
          <section key={group.key} className="space-y-4">
            <h2 className="text-sm font-semibold uppercase tracking-wider text-muted">
              {t.nav.groups[group.key]}
            </h2>
            <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
              {group.tabs.map(({ href, label }) => (
                <Link
                  key={href}
                  href={withApiKey(href)}
                  className="group block rounded-2xl border border-border bg-background p-5 sm:p-6 hover:border-primary transition-colors"
                >
                  <p className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">
                    {t.nav[label]}
                  </p>
                  <p className="text-xs sm:text-sm text-muted mt-1.5">
                    {tabDesc(t, group, label)}
                  </p>
                </Link>
              ))}
            </div>
          </section>
        ))}
      </div>
    </div>
  );
}
