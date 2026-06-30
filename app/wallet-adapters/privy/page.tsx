"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { privyAboutDict } from "./_about";

export default function PrivyAdapterOverviewPage() {
  const { locale } = useI18n();
  const s = privyAboutDict[locale];
  return (
    <AboutPage
      section={s}
      links={[
        { label: s.docsLabel, href: "https://docs.privy.io/" },
        { label: s.siteLabel, href: "https://www.privy.io/" },
      ]}
    />
  );
}
