import Link from 'next/link';

const PAGES = [
  { href: '/transactions', label: 'Transactions', desc: 'Invoke smart contracts and build Stellar operations.' },
  { href: '/send', label: 'Send', desc: 'Transfer assets to another Stellar address.' },
  { href: '/receive', label: 'Receive', desc: 'Show your address and QR code to receive funds.' },
  { href: '/history', label: 'History', desc: 'List the wallet\'s past transactions.' },
  { href: '/balance', label: 'Balance', desc: 'Fetch Stellar account balances by public key.' },
  { href: '/ramp', label: 'Ramp', desc: 'Buy and sell crypto with local payment methods.' },
  { href: '/kyc', label: 'KYC', desc: 'Verify your identity to unlock higher limits.' },
  { href: '/escrow', label: 'Escrow', desc: 'Trustless Work escrows with automatic XDR signing.' },
  { href: '/sessions', label: 'Sessions', desc: 'Review active sessions and revoke devices.' },
  { href: '/distribution', label: 'Distribution', desc: 'List distribution rules and claim your share.' },
];

export default function Home() {
  return (
    <div className="w-full">
      <div className="mb-8 sm:mb-10 space-y-3">
        <div className="inline-flex items-center gap-2 text-xs sm:text-sm text-primary">
          <svg className="h-4 w-4" fill="currentColor" viewBox="0 0 20 20">
            <path fillRule="evenodd" d="M10 18a8 8 0 100-16 8 8 0 000 16zm3.707-9.293a1 1 0 00-1.414-1.414L9 10.586 7.707 9.293a1 1 0 00-1.414 1.414l2 2a1 1 0 001.414 0l4-4z" clipRule="evenodd" />
          </svg>
          <span className="font-semibold">SDK demo — every feature, live on testnet</span>
        </div>
        <h1 className="text-2xl sm:text-3xl lg:text-4xl font-bold tracking-tight text-foreground">
          Explore the <span className="text-primary">Pollar SDK</span>
        </h1>
        <p className="text-sm sm:text-base text-muted max-w-xl">
          Each tab demonstrates one capability of @pollar/core and @pollar/react,
          with the equivalent code side by side.
        </p>
      </div>

      <div className="grid gap-4 sm:gap-6 sm:grid-cols-2 lg:grid-cols-3">
        {PAGES.map(({ href, label, desc }) => (
          <Link
            key={href}
            href={href}
            className="group block rounded-2xl border border-border bg-background p-5 sm:p-6 hover:border-primary transition-colors"
          >
            <p className="text-sm sm:text-base font-bold text-foreground group-hover:text-primary transition-colors">{label}</p>
            <p className="text-xs sm:text-sm text-muted mt-1.5">{desc}</p>
          </Link>
        ))}
      </div>
    </div>
  );
}
