"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function NiriumAboutPage() {
  const { t } = useI18n();
  const s = t.niriumAbout;
  return (
    <AboutPage
      section={s}
      links={[
        { label: s.websiteLabel, href: "https://nirium.xyz/developers" },
        { label: s.repoLabel, href: "https://github.com/Eras256/nirium-sdk" },
      ]}
    />
  );
}
