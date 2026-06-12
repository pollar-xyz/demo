'use client';

import { PollarProvider, WalletButton } from '@pollar/react';
import Image from 'next/image';
import Link from 'next/link';
import { usePathname, useSearchParams } from 'next/navigation';
import { useEffect, useState } from 'react';
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

function ThemeToggle() {
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains('dark'));
  }, []);

  function toggle() {
    const next = !dark;
    setDark(next);
    document.documentElement.classList.toggle('dark', next);
    try {
      localStorage.setItem('pollar-demo-theme', next ? 'dark' : 'light');
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? 'Switch to light mode' : 'Switch to dark mode'}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted hover:text-foreground hover:bg-surface transition-colors"
    >
      {dark ? (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M12 3v1.5m0 15V21m9-9h-1.5m-15 0H3m15.36 6.36l-1.06-1.06M6.7 6.7 5.64 5.64m12.72 0-1.06 1.06M6.7 17.3l-1.06 1.06M16 12a4 4 0 11-8 0 4 4 0 018 0z" />
        </svg>
      ) : (
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path strokeLinecap="round" strokeLinejoin="round" d="M21.752 15.002A9.718 9.718 0 0118 15.75 9.75 9.75 0 018.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25 9.75 9.75 0 0012.75 21a9.753 9.753 0 009.002-5.998z" />
        </svg>
      )}
    </button>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const apiKey = searchParams.get('apiKey') ?? DEFAULT_API_KEY;

  return (
    <PollarProvider client={{ apiKey, baseUrl: BASE_URL }} adapters={{ escrow: trustlessWorkAdapter }}>
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* row 1: logo + wallet button */}
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <Image src="/logo.png" alt="Pollar" width={40} height={40} className="w-8 h-8 sm:w-9 sm:h-9" />
              <span className="text-lg sm:text-xl font-bold text-foreground">Pollar</span>
              <span className="hidden sm:inline-block rounded-md bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">Demo</span>
            </Link>
            <div className="flex items-center gap-2 sm:gap-3">
              <ThemeToggle />
              <WalletButton />
            </div>
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
