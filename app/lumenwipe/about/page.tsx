"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function LumenWipeAboutPage() {
  const { t } = useI18n();
  const s = t.lwAbout;
  return (
    <AboutPage
      section={s}
      links={[
        { label: s.websiteLabel, href: "https://www.lumenwipe.com" },
        { label: s.docsLabel, href: "https://docs.lumenwipe.com/" },
      ]}
    />
  );
}
