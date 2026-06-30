"use client";

import { ComingSoon } from "@/app/_components/ComingSoon";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { soroswapDict } from "./_i18n";

export default function SoroswapPage() {
  const { locale } = useI18n();
  const tt = soroswapDict[locale];

  return (
    <div className="w-full max-w-5xl space-y-5">
      {/* header stays readable above the coming-soon blur */}
      <div>
        <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
          {tt.title}
        </h1>
        <p className="text-sm text-muted mt-1.5">{tt.desc}</p>
      </div>

      <ComingSoon>
        <div className="rounded-2xl border border-border bg-background p-6">
          <p className="text-sm text-muted leading-relaxed">{tt.body}</p>
        </div>
      </ComingSoon>
    </div>
  );
}
