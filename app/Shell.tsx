'use client';

import { PollarProvider, WalletButton } from '@pollar/react';
import Image from 'next/image';
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
      <header className="bg-white/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* row 1: logo + wallet button */}
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <Image src="/logo.png" alt="Pollar" width={40} height={40} className="w-8 h-8 sm:w-9 sm:h-9" />
              <span className="text-lg sm:text-xl font-bold text-foreground">Pollar</span>
              <span className="hidden sm:inline-block rounded-md bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">Demo</span>
            </Link>
            <WalletButton />
          </div>
          {/* row 2: feature tabs (scrollable on mobile) */}
          <nav className="flex items-center gap-5 sm:gap-6 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            {NAV_LINKS.map(({ href, label }) => (
              <Link
                key={href}
                href={href}
                className={`shrink-0 whitespace-nowrap text-xs sm:text-sm font-medium py-2.5 border-b-2 transition-colors ${
                  pathname === href
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted hover:text-foreground'
                }`}
              >
                {label}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>
    </PollarProvider>
  );
}
