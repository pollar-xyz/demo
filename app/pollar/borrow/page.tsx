"use client";

import Link from "next/link";

export default function BorrowOverviewPage() {
  return (
    <div className="w-full max-w-5xl space-y-6">
      <div className="space-y-2">
        <p className="text-xs font-semibold uppercase tracking-[0.2em] text-primary">Jupiter Lend · Solana</p>
        <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">Borrow against your collateral</h1>
        <p className="max-w-2xl text-sm leading-relaxed text-muted">Lock one asset as collateral, borrow another, and manage the position NFT without exposing wallet keys to Pollar.</p>
      </div>
      <div className="grid gap-4 md:grid-cols-3">
        {[
          ["1", "Choose a vault", "Each vault fixes the collateral/debt pair and publishes live LTV and liquidation limits."],
          ["2", "Prepare an operation", "Create a position, add collateral, borrow, repay, or withdraw through Jupiter operate."],
          ["3", "Sign explicitly", "Pollar returns an unsigned Solana VersionedTransaction. Nothing is submitted automatically."],
        ].map(([n, title, body]) => <div key={n} className="rounded-2xl border border-border bg-surface p-5"><span className="text-xs font-bold text-primary">0{n}</span><h2 className="mt-3 font-semibold text-foreground">{title}</h2><p className="mt-2 text-sm leading-relaxed text-muted">{body}</p></div>)}
      </div>
      <div className="rounded-2xl border border-amber-500/30 bg-amber-500/5 p-5 text-sm text-muted"><strong className="text-foreground">Liquidation risk:</strong> price changes and accrued interest can push a position over its liquidation threshold. The maximum LTV is a protocol limit, not a recommended target.</div>
      <div className="flex flex-wrap gap-3"><Link href="/pollar/borrow/implementation" className="rounded-xl bg-primary px-5 py-2.5 text-sm font-semibold text-white">Open Borrow demo</Link><a href="https://developers.jup.ag/docs/lend/borrow/api" target="_blank" rel="noreferrer" className="rounded-xl border border-border px-5 py-2.5 text-sm font-semibold text-foreground">Official Jupiter docs</a></div>
    </div>
  );
}
