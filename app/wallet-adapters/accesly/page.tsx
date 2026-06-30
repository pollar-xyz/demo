"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { acceslyAboutDict } from "./_about";

export default function AcceslyAdapterOverviewPage() {
  const { locale } = useI18n();
  const s = acceslyAboutDict[locale];
  return (
    <AboutPage
      section={s}
      links={[
        {
          label: s.reactPkgLabel,
          href: "https://www.npmjs.com/package/@accesly/react",
        },
        {
          label: s.corePkgLabel,
          href: "https://www.npmjs.com/package/@accesly/core",
        },
      ]}
    />
  );
}
