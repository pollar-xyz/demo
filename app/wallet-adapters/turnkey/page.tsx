"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { turnkeyAboutDict } from "./_about";

export default function TurnkeyAdapterOverviewPage() {
  const { locale } = useI18n();
  const s = turnkeyAboutDict[locale];

  return (
    <AboutPage
      section={s}
      links={[
        {
          label: s.docsLabel,
          href: "https://docs.turnkey.com/solutions/embedded-wallets/integration-guide/react/getting-started",
        },
        {
          label: s.siteLabel,
          href: "https://www.turnkey.com/embedded-wallets",
        },
      ]}
    />
  );
}
