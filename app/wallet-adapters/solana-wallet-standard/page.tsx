"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { solanaAboutDict } from "./_about";

export default function SolanaWalletStandardOverviewPage() {
  const { locale } = useI18n();
  const s = solanaAboutDict[locale];
  return (
    <AboutPage
      section={s}
      links={[
        {
          label: s.docsLabel,
          href: "https://www.npmjs.com/package/@pollar/solana-wallet-standard-adapter",
        },
        {
          label: s.repoLabel,
          href: "https://github.com/wallet-standard/wallet-standard",
        },
      ]}
    />
  );
}
