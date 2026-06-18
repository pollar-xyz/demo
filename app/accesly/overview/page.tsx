"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function AcceslyOverviewPage() {
  const { t } = useI18n();
  const s = t.acceslyAbout;
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
