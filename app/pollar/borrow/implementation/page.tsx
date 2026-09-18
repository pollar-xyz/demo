"use client";

import type { BorrowMarket, BorrowPosition } from "@pollar/core";
import { usePollar } from "@pollar/react";
import { useCallback, useEffect, useMemo, useState } from "react";

type Action = "open" | "deposit" | "borrow" | "repay" | "withdraw";

export default function BorrowImplementationPage() {
  const { getClient, isAuthenticated, verified, wallets } = usePollar();
  const client = getClient();
  const solanaWallet = wallets.find((w) => w.chain === "SOLANA");
  const [markets, setMarkets] = useState<BorrowMarket[]>([]);
  const [positions, setPositions] = useState<BorrowPosition[]>([]);
  const [vaultId, setVaultId] = useState(1);
  const [positionId, setPositionId] = useState(0);
  const [action, setAction] = useState<Action>("open");
  const [amount, setAmount] = useState("");
  const [collateral, setCollateral] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [prepared, setPrepared] = useState<{ nftId: number; unsignedTransaction: string } | null>(null);
  const selected = useMemo(() => markets.find((m) => m.vaultId === vaultId), [markets, vaultId]);

  const load = useCallback(async () => {
    if (!verified || !solanaWallet) return;
    setLoading(true); setError("");
    try {
      const [nextMarkets, nextPositions] = await Promise.all([client.getBorrowMarkets("main"), client.getBorrowPositions("main")]);
      setMarkets(nextMarkets); setPositions(nextPositions);
      if (nextMarkets[0]) setVaultId((v) => nextMarkets.some((m) => m.vaultId === v) ? v : nextMarkets[0]!.vaultId);
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setLoading(false); }
  }, [client, solanaWallet, verified]);
  useEffect(() => { void load(); }, [load]);

  async function build() {
    if (!selected) return;
    setLoading(true); setError(""); setPrepared(null);
    const positive = amount || "0";
    const col = collateral || amount || "0";
    const params = action === "open" ? { positionId: 0, collateralAmount: col, debtAmount: positive }
      : action === "deposit" ? { positionId, collateralAmount: positive, debtAmount: "0" }
      : action === "borrow" ? { positionId, collateralAmount: "0", debtAmount: positive }
      : action === "repay" ? { positionId, collateralAmount: "0", debtAmount: `-${positive}` }
      : { positionId, collateralAmount: `-${positive}`, debtAmount: "0" };
    try {
      const result = await client.borrowBuild({ market: "main", vaultId, ...params });
      setPrepared({ nftId: result.nftId, unsignedTransaction: result.unsignedTransaction });
    } catch (e) { setError(e instanceof Error ? e.message : String(e)); } finally { setLoading(false); }
  }

  return (
    <div className="w-full max-w-6xl space-y-5">
      <div><h1 className="text-2xl font-bold text-foreground">Jupiter Borrow implementation</h1><p className="mt-1 text-sm text-muted">Mainnet transaction construction with explicit wallet signing and submission boundaries.</p></div>
      {!isAuthenticated || !solanaWallet ? <div className="rounded-2xl border border-border bg-surface p-6 text-sm text-muted">Connect and authenticate a Phantom or Backpack Solana wallet first.</div> : null}
      {error ? <div className="rounded-xl border border-red-500/30 bg-red-500/5 p-4 text-sm text-red-600">{error}</div> : null}
      <div className="grid gap-5 lg:grid-cols-[1.35fr_.65fr]">
        <section className="rounded-2xl border border-border bg-surface p-5 space-y-4">
          <div className="flex items-center justify-between"><h2 className="font-semibold text-foreground">Build operation</h2><button onClick={() => void load()} className="text-xs font-semibold text-primary">Refresh</button></div>
          <label className="block text-xs font-medium text-muted">Vault<select value={vaultId} onChange={(e) => setVaultId(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground">{markets.map((m) => <option key={m.vaultId} value={m.vaultId}>{m.collateral.symbol} → {m.debt.symbol} · {m.borrowApy.toFixed(2)}% borrow APY</option>)}</select></label>
          <div className="grid grid-cols-2 gap-2 sm:grid-cols-5">{(["open", "deposit", "borrow", "repay", "withdraw"] as Action[]).map((a) => <button key={a} onClick={() => setAction(a)} className={`rounded-xl border px-3 py-2 text-xs font-semibold capitalize ${action === a ? "border-primary bg-primary text-white" : "border-border text-muted"}`}>{a}</button>)}</div>
          {action !== "open" && <label className="block text-xs font-medium text-muted">Position<select value={positionId} onChange={(e) => setPositionId(Number(e.target.value))} className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground"><option value={0}>Select position</option>{positions.filter((p) => p.vaultId === vaultId).map((p) => <option key={p.positionId} value={p.positionId}>#{p.positionId} · {p.collateralAmount} collateral / {p.debtAmount} debt</option>)}</select></label>}
          {action === "open" && <label className="block text-xs font-medium text-muted">Collateral amount ({selected?.collateral.symbol})<input value={collateral} onChange={(e) => setCollateral(e.target.value)} placeholder="0.03" className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground" /></label>}
          <label className="block text-xs font-medium text-muted">{action === "open" || action === "borrow" ? `Borrow amount (${selected?.debt.symbol ?? ""})` : `${action} amount (${action === "repay" ? selected?.debt.symbol : selected?.collateral.symbol})`}<input value={amount} onChange={(e) => setAmount(e.target.value)} placeholder="0.0" className="mt-2 w-full rounded-xl border border-border bg-background p-3 text-sm text-foreground" /></label>
          {selected?.collateral.mint === "So11111111111111111111111111111111111111112" && <p className="rounded-xl bg-amber-500/10 p-3 text-xs text-muted">This vault uses WSOL. Jupiter does not wrap native SOL automatically; fund a WSOL token account before depositing.</p>}
          <button disabled={loading || !selected || (!amount && !collateral) || (action !== "open" && positionId === 0)} onClick={() => void build()} className="w-full rounded-xl bg-primary px-4 py-3 text-sm font-semibold text-white disabled:opacity-40">{loading ? "Preparing…" : "Prepare unsigned transaction"}</button>
          {prepared && <div className="space-y-2 rounded-xl border border-primary/30 bg-primary/5 p-4"><p className="text-sm font-semibold text-foreground">Prepared · position NFT #{prepared.nftId}</p><textarea readOnly value={prepared.unsignedTransaction} className="h-28 w-full resize-none rounded-lg border border-border bg-background p-3 font-mono text-[10px] text-muted"/><button onClick={() => navigator.clipboard.writeText(prepared.unsignedTransaction)} className="text-xs font-semibold text-primary">Copy base64 transaction</button><p className="text-xs text-muted">Not signed or submitted. Use the connected Solana adapter and RPC in the host application.</p></div>}
        </section>
        <aside className="space-y-4">{selected && <div className="rounded-2xl border border-border bg-surface p-5 space-y-3"><h2 className="font-semibold text-foreground">Risk envelope</h2><Stat label="Max LTV" value={`${selected.collateralFactorPct}%`} /><Stat label="Liquidation" value={`${selected.liquidationThresholdPct}%`} /><Stat label="Penalty" value={`${selected.liquidationPenaltyPct}%`} /><Stat label="Borrow APY" value={`${selected.borrowApy.toFixed(2)}%`} /><Stat label="Available" value={`${selected.borrowable} ${selected.debt.symbol}`} /><p className="pt-2 text-xs leading-relaxed text-muted">Do not treat max LTV as a target. Debt interest and collateral price movement can trigger liquidation.</p></div>}</aside>
      </div>
    </div>
  );
}

function Stat({ label, value }: { label: string; value: string }) { return <div className="flex items-center justify-between border-b border-border pb-2 text-sm"><span className="text-muted">{label}</span><strong className="text-foreground">{value}</strong></div>; }
