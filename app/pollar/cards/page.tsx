"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function CardsOverviewPage() {
  const { t } = useI18n();
  const s = t.cardsAbout;
  return (
    <AboutPage
      section={s}
      links={[{ label: s.coralLabel, href: "https://coralfinance.io/" }]}
    />
  );
}
