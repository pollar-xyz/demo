// Self-contained i18n for the Wallet Adapters → Accesly tab. Kept local (keyed
// by locale) like the other adapter tabs, since this is a standalone overview
// page. Only the sidebar tab label lives in the shared dictionary.

import type { Locale } from "@/app/_i18n/translations";

type AcceslyStrings = {
  title: string;
  subtitle: string;
  // per-SDK descriptions (the toggle switches these + the code panel)
  coreDesc: string;
  reactDesc: string;
  // notes
  notesTitle: string;
  notes: string[];
};

const en: AcceslyStrings = {
  title: "Accesly adapter",
  subtitle:
    "Sign Pollar transactions with an Accesly Smart Account (passkey + Shamir-MPC), wired as a Pollar wallet adapter.",
  coreDesc:
    "With `@pollar/core`, build the adapter with `createAcceslyAdapter({ address, signXdr })` — you supply the Accesly C-address and a function that signs an XDR — and register it on a plain `PollarClient`.",
  reactDesc:
    "With `@pollar/react`, wire `signXdr` from `@accesly/react`'s `useAccesly()` (unlock → sign) and pass the adapter to `walletAdapters` on `<PollarProvider>`. It must render inside `<AcceslyProvider>`.",
  notesTitle: "Notes",
  notes: [
    "Accesly is a self-custodial **smart wallet** (a C-address Soroban contract), so `custody` is `'smart'`.",
    "Signing happens **client-side** via Accesly's SDK — Pollar never holds the key; the signed XDR is broadcast via RPC, like an external wallet.",
    "Wire `signXdr` from `useAccesly()`: `wallet.unlockForSigning` (passkey → Shamir → ed25519 seed), then `tx.signRawXdr({ transactionXdr, ed25519Seed, expectedPublicKey })`.",
    "Start a login with `login({ provider: 'accesly' })` (`id` === the adapter's `type`).",
  ],
};

const es: AcceslyStrings = {
  title: "Adaptador de Accesly",
  subtitle:
    "Firma transacciones de Pollar con una Smart Account de Accesly (passkey + Shamir-MPC), conectada como wallet adapter de Pollar.",
  coreDesc:
    "Con `@pollar/core`, construí el adaptador con `createAcceslyAdapter({ address, signXdr })` — vos proporcionás la C-address de Accesly y una función que firma un XDR — y registralo en un `PollarClient` plano.",
  reactDesc:
    "Con `@pollar/react`, conectá `signXdr` desde `useAccesly()` de `@accesly/react` (unlock → firma) y pasá el adaptador a `walletAdapters` en `<PollarProvider>`. Debe renderizarse dentro de `<AcceslyProvider>`.",
  notesTitle: "Notas",
  notes: [
    "Accesly es una **smart wallet** auto-custodial (un contrato Soroban con C-address), así que `custody` es `'smart'`.",
    "La firma ocurre **del lado del cliente** vía el SDK de Accesly — Pollar nunca tiene la llave; el XDR firmado se transmite vía RPC, como una wallet externa.",
    "Conectá `signXdr` desde `useAccesly()`: `wallet.unlockForSigning` (passkey → Shamir → semilla ed25519), luego `tx.signRawXdr({ transactionXdr, ed25519Seed, expectedPublicKey })`.",
    "Iniciá el login con `login({ provider: 'accesly' })` (`id` === el `type` del adaptador).",
  ],
};

const pt: AcceslyStrings = {
  title: "Adaptador da Accesly",
  subtitle:
    "Assine transações da Pollar com uma Smart Account da Accesly (passkey + Shamir-MPC), conectada como wallet adapter da Pollar.",
  coreDesc:
    "Com `@pollar/core`, construa o adaptador com `createAcceslyAdapter({ address, signXdr })` — você fornece a C-address da Accesly e uma função que assina um XDR — e registre-o em um `PollarClient` puro.",
  reactDesc:
    "Com `@pollar/react`, conecte `signXdr` a partir do `useAccesly()` do `@accesly/react` (unlock → assinatura) e passe o adaptador para `walletAdapters` no `<PollarProvider>`. Ele precisa renderizar dentro de `<AcceslyProvider>`.",
  notesTitle: "Notas",
  notes: [
    "A Accesly é uma **smart wallet** auto-custodial (um contrato Soroban com C-address), então `custody` é `'smart'`.",
    "A assinatura acontece **no cliente** via SDK da Accesly — a Pollar nunca guarda a chave; o XDR assinado é transmitido via RPC, como uma carteira externa.",
    "Conecte `signXdr` a partir do `useAccesly()`: `wallet.unlockForSigning` (passkey → Shamir → seed ed25519), depois `tx.signRawXdr({ transactionXdr, ed25519Seed, expectedPublicKey })`.",
    "Inicie o login com `login({ provider: 'accesly' })` (`id` === o `type` do adaptador).",
  ],
};

export const acceslyDict: Record<Locale, AcceslyStrings> = { en, es, pt };
