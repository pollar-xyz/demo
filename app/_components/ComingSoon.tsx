'use client';

// Blur-overlay for sections that aren't live yet (Ramp, KYC).
// The wrapped content stays rendered (and blurred) behind a centered
// "Coming soon" card; the page header should be kept OUTSIDE the wrapper
// so it remains readable.

import { useI18n } from '../_i18n/LanguageProvider';

export function ComingSoon({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  return (
    <div className="relative">
      <div inert className="pointer-events-none select-none blur-[6px] opacity-60" aria-hidden>
        {children}
      </div>
      <div className="absolute inset-0 z-10 flex items-center justify-center">
        <div className="rounded-2xl bg-background border border-border shadow-xl dark:shadow-black/40 px-10 py-8 text-center max-w-sm">
          <h2 className="text-xl font-bold text-foreground">{t.common.comingSoon}</h2>
          <p className="text-sm text-muted mt-2">{t.common.comingSoonDesc}</p>
        </div>
      </div>
    </div>
  );
}
