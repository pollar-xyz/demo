"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function VaquitaAboutPage() {
  const { t } = useI18n();
  const s = t.vaquitaAbout;
  return (
    <AboutPage
      section={s}
      links={[{ label: s.websiteLabel, href: "https://vaquita.fi/" }]}
    />
  );
}
