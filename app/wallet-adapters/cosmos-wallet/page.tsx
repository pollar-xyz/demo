"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { cosmosWalletAboutDict } from "./_about";

export default function CosmosWalletOverviewPage() {
  const { locale } = useI18n();
  const s = cosmosWalletAboutDict[locale];
  return (
    <AboutPage
      section={s}
      links={[
        {
          label: s.repoLabel,
          href: "https://github.com/CosmosPay/CosmosPay-Wallet",
        },
        {
          label: s.demoLabel,
          href: "https://github.com/CosmosPay/CosmosPay-Wallet/blob/main/demo/dapp-demo.html",
        },
      ]}
    />
  );
}
