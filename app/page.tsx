'use client';

import Link from 'next/link';
import { useI18n } from './_i18n/LanguageProvider';
import type { Dictionary } from './_i18n/translations';

const PAGES: { href: string; key: keyof Dictionary['nav'] }[] = [
  { href: '/transactions', key: 'transactions' },
  { href: '/send', key: 'send' },
  { href: '/receive', key: 'receive' },
  { href: '/history', key: 'history' },
  { href: '/balance', key: 'balance' },
  { href: '/ramp', key: 'ramp' },
  { href: '/kyc', key: 'kyc' },
  { href: '/escrow', key: 'escrow' },
  { href: '/sessions', key: 'sessions' },
  { href: '/distribution', key: 'distribution' },
];

export default function Home() {
  const { t } = useI18n();

  return (
    <div className="w-full">
      <div className="mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-primary">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">{t.home.badge}</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          {t.home.titlePre}<span className="text-primary">{t.home.titleHighlight}</span>
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-xl">
          {t.home.subtitle}
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map(({ href, key }) => (
          <Link
            key={href}
            href={href}
            className="group block rounded-2xl border border-border bg-background p-5 sm:p-6 hover:border-primary transition-colors"
          >
            <p className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">{t.nav[key]}</p>
            <p className="text-xs sm:text-sm text-muted mt-1.5">{t.home.descs[key]}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
