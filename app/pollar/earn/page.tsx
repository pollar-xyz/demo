"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function EarnOverviewPage() {
  const { t } = useI18n();
  const s = t.earnAbout;
  return (
    <AboutPage
      section={s}
      links={[
        { label: s.defindexLabel, href: "https://defindex.io/" },
        { label: s.blendLabel, href: "https://blend.capital/" },
        { label: "Jupiter Lend", href: "https://jup.ag/lend/earn" },
      ]}
    />
  );
}
