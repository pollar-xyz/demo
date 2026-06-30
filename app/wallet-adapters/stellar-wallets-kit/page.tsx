"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { swkAboutDict } from "./_about";

export default function StellarWalletsKitOverviewPage() {
  const { locale } = useI18n();
  const s = swkAboutDict[locale];
  return (
    <AboutPage
      section={s}
      links={[
        { label: s.docsLabel, href: "https://stellarwalletskit.dev/" },
        {
          label: s.repoLabel,
          href: "https://github.com/Creit-Tech/Stellar-Wallets-Kit",
        },
      ]}
    />
  );
}
