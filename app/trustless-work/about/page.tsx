"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function TrustlessWorkAboutPage() {
  const { t } = useI18n();
  const s = t.twAbout;
  return (
    <AboutPage
      section={s}
      links={[
        { label: s.websiteLabel, href: "https://www.trustlesswork.com/" },
        { label: s.dappLabel, href: "https://dapp.trustlesswork.com" },
      ]}
    />
  );
}
