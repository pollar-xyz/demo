"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function SwapOverviewPage() {
  const { t } = useI18n();
  const s = t.swapAbout;
  return (
    <AboutPage
      section={s}
      links={[
        { label: s.aquariusLabel, href: "https://aqua.network/" },
        { label: s.soroswapLabel, href: "https://soroswap.finance/" },
        { label: "Jupiter Swap", href: "https://jup.ag/swap" },
      ]}
    />
  );
}
