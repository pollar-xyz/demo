'use client';

import { PollarProvider, WalletButton } from '@pollar/react';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import '@pollar/react/styles.css';
import { trustlessWorkAdapter } from './escrow/adapter';

const DEFAULT_API_KEY = 'pub_testnet_703470595eb6cb72c18651b1455fdc34';
const BASE_URL = 'https://sdk.api.pollar.xyz';

const NAV_LINKS = [
  { href: '/transactions', label: 'Transactions' },
  { href: '/send', label: 'Send' },
  { href: '/receive', label: 'Receive' },
  { href: '/history', label: 'History' },
  { href: '/balance', label: 'Balance' },
  { href: '/ramp', label: 'Ramp' },
  { href: '/kyc', label: 'KYC' },
  { href: '/escrow', label: 'Escrow' },
  { href: '/sessions', label: 'Sessions' },
  { href: '/distribution', label: 'Distribution' },
];

export function Shell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const apiKey = searchParams.get('apiKey') ?? DEFAULT_API_KEY;

  return (
    <PollarProvider client={{ apiKey, baseUrl: BASE_URL }} adapters={{ escrow: trustlessWorkAdapter }}>
      <nav className="border-b border-zinc-200 dark:border-zinc-800 px-4 sm:px-6">
        {/* row 1: logo + wallet button */}
        <div className="flex items-center justify-between py-3">
          <Link href="/" className="text-sm font-semibold">Pollar</Link>
          <WalletButton />
        </div>
        {/* row 2 (mobile) / inline (desktop) */}
        <div className="flex items-center gap-4 pb-3 sm:hidden">
          {NAV_LINKS.map(({ href, label }) => (
            <Link
              key={href}
              href={href}
              className={`text-sm transition-colors ${pathname === href ? 'text-zinc-900 dark:text-zinc-100 font-semibold underline underline-offset-4' : 'text-zinc-400 hover:text-zinc-900 dark:hover:text-zinc-100'}`}
            >
              {label}
            </Link>
          ))}
        </div>
      </nav>
      {/* desktop: single row nav */}
      <div className="hidden sm:flex items-center gap-6 border-b border-zinc-200 dark:border-zinc-800 px-6">
        {NAV_LINKS.map(({ href, label }) => (
          <Link
            key={href}
            href={href}
            className={`text-xs py-2.5 border-b-2 transition-colors ${pathname === href ? 'border-zinc-900 dark:border-zinc-100 text-zinc-900 dark:text-zinc-100 font-semibold' : 'border-transparent text-zinc-400 hover:text-zinc-700 dark:hover:text-zinc-300'}`}
          >
            {label}
          </Link>
        ))}
      </div>
      <main className="px-4 py-6 sm:px-6 sm:py-8">
        {children}
      </main>
    </PollarProvider>
  );
}
