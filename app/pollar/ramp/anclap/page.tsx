"use client";

import { useCallback, useEffect, useState } from "react";
import { usePollar } from "@pollar/react";
import type { RampQuote, RampWorkflowRoutes, RampWorkflowTerms, RampWorkflowView } from "@pollar/core";

type Quote = RampQuote & { terms?: RampWorkflowTerms };
export default function AnclapTestPage() {
  const { getClient, isAuthenticated, verified, openLoginModal, signTx, wallet } = usePollar();
  const [routes, setRoutes] = useState<RampWorkflowRoutes["routes"]>([]);
  const [country, setCountry] = useState("PE");
  const [direction, setDirection] = useState<"onramp" | "offramp">("onramp");
  const [amount, setAmount] = useState("10");
  const [quote, setQuote] = useState<Quote | null>(null);
  const [view, setView] = useState<RampWorkflowView | null>(null);
  const [busy, setBusy] = useState(false);
  const [error, setError] = useState("");
  const currency = country === "PE" ? "PEN" : "ARS";
  const mainnet = getClient().apiKey.startsWith("pub_mainnet_");
  const network = mainnet ? "mainnet" : "testnet";
  const ready = isAuthenticated && verified;
  const storageKey = wallet?.address ? `anclap:${getClient().apiKey}:${wallet.address}` : null;
  const route = routes.find(r => r.country === country && r.direction === direction);
  const running = !!view && !["completed", "failed", "refunded"].includes(view.lifecycleState);
  const button = "rounded-lg bg-foreground px-5 py-3 text-sm font-medium text-background disabled:opacity-40";
  const input = "w-full rounded-lg border border-border bg-background px-3 py-3 text-foreground";
  const run = async (work: () => Promise<void>) => {
    setBusy(true); setError("");
    try { await work(); } catch (e) { setError(e instanceof Error ? e.message : String(e)); }
    finally { setBusy(false); }
  };
  const refresh = useCallback(async () => {
    if (!view) return;
    const result = await getClient().getRampTransaction(view.txId);
    setView(result as unknown as RampWorkflowView);
  }, [getClient, view?.txId]);
  useEffect(() => {
    if (!running || !ready || busy) return;
    const timer = setInterval(() => { void refresh().catch(e => setError(String(e))); }, 10_000);
    return () => clearInterval(timer);
  }, [running, ready, busy, refresh]);
  useEffect(() => {
    if (!ready) { setRoutes([]); setQuote(null); setView(null); return; }
    let cancelled = false;
    getClient().getRampRoutes().then(result => {
      if (!cancelled) setRoutes(result.routes.filter(r => r.provider === "Anclap" && r.asset.network === network));
    }).catch(e => { if (!cancelled) setError(String(e)); });
    const savedId = new URLSearchParams(window.location.search).get("txId") || (storageKey ? sessionStorage.getItem(storageKey) : null);
    if (savedId) getClient().getRampTransaction(savedId).then(result => {
      if (!cancelled) setView(result as unknown as RampWorkflowView);
    }).catch(e => { if (!cancelled) setError(`No se pudo recuperar la operación ${savedId}: ${String(e)}`); });
    return () => { cancelled = true; };
  }, [ready, getClient, storageKey, network]);
  useEffect(() => { if (ready && view && storageKey) sessionStorage.setItem(storageKey, view.txId); }, [ready, view, storageKey]);
  const loadQuote = () => run(async () => {
    if (!Number.isFinite(Number(amount)) || Number(amount) <= 0) throw new Error("Ingresa un monto válido.");
    const result = await getClient().getRampsQuote({ country, currency, direction, amount: Number(amount) });
    const selected = result.quotes.find(q => q.provider === "Anclap");
    if (!selected) throw new Error("Anclap no devolvió una cotización. Revisa límites, rutas y logs de sdk-api.");
    setQuote(selected as Quote);
  });
  const start = () => run(async () => {
    if (!quote) return;
    const body = { quoteId: quote.quoteId, country, currency, amount: Number(quote.terms?.fiatAmount ?? amount) };
    const result = direction === "onramp" ? await getClient().createOnRamp(body) : await getClient().createOffRamp(body);
    const workflow = result as unknown as RampWorkflowView;
    if (!workflow.txId || !workflow.transactionVersion) throw new Error("El backend no devolvió el workflow del adapter.");
    setView(workflow);
  });
  const proceed = () => run(async () => {
    if (!view?.nextAction || view.reconciliationRequired) return;
    const action = view.nextAction;
    let signedPayload: string | undefined;
    if (action.kind === "sign_transaction") {
      if (action.payload.encoding !== "xdr") throw new Error("Formato de firma no soportado.");
      const result = await signTx(action.payload.value);
      if (result.status !== "signed") throw new Error("La wallet no firmó. Puedes volver a intentar.");
      signedPayload = result.signedXdr;
    } else if (action.kind !== "user_ready") return;
    setView(await getClient().continueRampTransaction(view.txId, { actionId: action.actionId, transactionVersion: view.transactionVersion, ...(signedPayload ? { signedPayload } : {}) }));
  });
  const action = view?.nextAction;
  const terms = view?.terms ?? quote?.terms;
  const actionLabel = action?.kind === "sign_transaction"
    ? action.purpose === "authentication" ? "Firmar autenticación de Anclap" : "Firmar el pago de retiro"
    : action?.kind === "user_ready" && action.purpose === "withdrawal_payment" ? "Preparar pago de retiro" : "Continuar";

  return <main className="mx-auto max-w-4xl space-y-7 py-8">
    <header className="border-b border-border pb-6">
      <p className="mb-3 text-xs uppercase tracking-[0.22em] text-muted">Pollar / Stellar {network}</p>
      <h1 className="text-3xl font-semibold tracking-tight">Probar Anclap</h1>
      <p className="mt-3 max-w-2xl text-sm leading-6 text-muted">{mainnet ? "Cotiza, autentica tu wallet y completa el flujo en Anclap. Los depósitos y retiros usan dinero real. Cada firma requiere tu aceptación." : "Prueba el login con tu wallet en Stellar testnet. Para depósitos y retiros de prueba necesitamos un endpoint sandbox de Anclap; su endpoint público anuncia mainnet."}</p>
    </header>
    {!ready && <section className="rounded-xl border border-border p-5">
      <p className="mb-4 text-sm">Conecta una wallet Stellar en {network} y espera la confirmación de tu sesión.</p>
      <button className={button} onClick={openLoginModal}>Conectar wallet</button>
    </section>}
    {ready && !mainnet && routes.length === 0 && <p role="status" className="rounded-xl border border-border p-5 text-sm">Login verificado en testnet. No hay rutas sandbox de Anclap configuradas; las órdenes permanecen deshabilitadas.</p>}
    {error && <div role="alert" className="rounded-lg border border-red-400/40 bg-red-400/10 p-4 text-sm text-red-600">{error}</div>}
    <section className="grid gap-6 md:grid-cols-[1fr_1.1fr]">
      <div className="space-y-5 rounded-xl border border-border p-6">
        <h2 className="font-semibold">1. Cotización</h2>
        <label className="block space-y-2 text-sm"><span>Operación</span><select className={input} disabled={running || busy} value={direction} onChange={e => { setDirection(e.target.value as typeof direction); setQuote(null); }}><option value="onramp">Depositar: fiat → token</option><option value="offramp">Retirar: token → fiat</option></select></label>
        <label className="block space-y-2 text-sm"><span>País</span><select className={input} disabled={running || busy} value={country} onChange={e => { setCountry(e.target.value); setQuote(null); setAmount(e.target.value === "PE" ? "10" : "100"); }}><option value="PE">Perú · PEN</option><option value="AR">Argentina · ARS</option></select></label>
        <label className="block space-y-2 text-sm"><span>{direction === "onramp" ? "Fiat que depositas" : "Fiat neto que quieres recibir"} ({currency})</span><input className={input} type="number" min="0" step="0.01" value={amount} disabled={running || busy} onChange={e => { setAmount(e.target.value); setQuote(null); }} /></label>
        <button className={button} disabled={!ready || !route || busy || running} onClick={loadQuote}>{busy ? "Procesando…" : "Consultar cotización"}</button>
        <p className="text-xs leading-5 text-muted">{ready ? `Rutas disponibles: ${routes.length}/4.` : "Conecta tu wallet para consultar las rutas."} Antes de depositar, agrega la trustline del token en tu wallet.</p>
        {route?.asset.identifier && <details className="text-xs text-muted"><summary className="cursor-pointer">Issuer del token {currency}</summary><p className="mt-2 break-all font-mono">{route.asset.identifier}</p></details>}
      </div>
      <div className="space-y-5 rounded-xl border border-border p-6">
        <h2 className="font-semibold">2. Revisión y operación</h2>
        {terms ? <dl className="space-y-3 text-sm">{[["Fiat", `${terms.fiatAmount} ${terms.fiatCurrency}`], ["Token", `${terms.cryptoAmount} ${terms.assetCode}`], ["Comisión", `${terms.feeAmount} ${terms.feeCurrency}`]].map(([label, value]) => <div key={label} className="flex justify-between gap-4 border-b border-border pb-3"><dt className="text-muted">{label}</dt><dd className="font-medium">{value}</dd></div>)}</dl> : <p className="text-sm text-muted">La cotización mostrará el monto exacto y la comisión antes de crear una orden.</p>}
        {quote && !view && <button className={button} disabled={busy || !ready} onClick={start}>Crear orden de {direction === "onramp" ? "depósito" : "retiro"}</button>}
        {view && <div className="space-y-4">
          <div className="flex items-center justify-between"><span className="rounded-full border border-border px-3 py-1 text-xs">{view.lifecycleState}</span><button className="text-sm underline" disabled={busy} onClick={() => run(refresh)}>Actualizar estado</button></div>
          <p className="break-all font-mono text-xs text-muted">{view.txId}</p>
          {view.reconciliationRequired ? <p className="text-sm">La operación requiere revisión. Conserva este ID y no crees otra orden para reemplazarla.</p> : <>
            {action?.kind === "hosted_redirect" && <a className={`${button} inline-block`} href={action.url} target="_blank" rel="noopener noreferrer">Abrir KYC / instrucciones de Anclap ↗</a>}
            {action?.kind === "sign_transaction" && <p className="text-sm text-muted">{action.purpose === "authentication" ? "Esta firma demuestra que controlas la wallet; no se envía a Stellar." : "Esta firma autoriza enviar el token al destino de Anclap. Revisa los detalles en tu wallet."}</p>}
            {(action?.kind === "user_ready" || action?.kind === "sign_transaction") && <button className={button} disabled={busy || !ready} onClick={proceed}>{actionLabel}</button>}
            {action?.kind === "wait" && <p className="text-sm text-muted">Esperando la comprobación del backend. El estado se consulta cada 10 segundos.</p>}
          </>}
          {view.milestones?.map(m => <p className="text-sm" key={m.kind}>✓ {m.kind}</p>)}
          {view.stellarTxHash && <a className="break-all text-xs underline" target="_blank" rel="noopener noreferrer" href={`https://stellar.expert/explorer/${mainnet ? "public" : "testnet"}/tx/${view.stellarTxHash}`}>Ver pago en Stellar ↗</a>}
          {!running && <button className="text-sm underline" onClick={() => { if (storageKey) sessionStorage.removeItem(storageKey); setView(null); setQuote(null); }}>Nueva prueba</button>}
        </div>}
      </div>
    </section>
  </main>;
}
