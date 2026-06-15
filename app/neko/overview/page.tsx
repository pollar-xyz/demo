"use client";

import { AboutPage } from "@/app/_components/AboutPage";
import { useI18n } from "@/app/_i18n/LanguageProvider";

export default function NekoOverviewPage() {
  const { t } = useI18n();
  const s = t.nekoAbout;
  return (
    <AboutPage
      section={s}
      links={[
        { label: s.websiteLabel, href: "https://www.nekoprotocol.xyz/" },
        { label: s.appLabel, href: "https://app.nekoprotocol.xyz/" },
      ]}
    />
  );
}
