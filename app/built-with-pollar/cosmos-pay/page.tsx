"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function CosmosPayAboutPage() {
  const { t } = useI18n();
  const s = t.cosmosPayAbout;
  return (
    <AboutPage
      section={s}
      links={[
        {
          label: s.npmLabel,
          href: "https://www.npmjs.com/package/@cosmosapp/pay_sdk",
        },
        { label: s.repoLabel, href: "https://github.com/CosmosPay/CosmosJS_SDK" },
      ]}
    />
  );
}
