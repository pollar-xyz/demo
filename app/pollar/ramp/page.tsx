"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function RampOverviewPage() {
  const { t } = useI18n();
  const s = t.rampAbout;
  return (
    <AboutPage
      section={s}
      links={[
        { label: s.anclapLabel, href: "https://anclap.com/" },
        {
          label: s.docsLabel,
          href: "https://developers.stellar.org/docs/learn/fundamentals/anchors-and-the-sep-standards",
        },
      ]}
    />
  );
}
