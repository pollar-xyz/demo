// Self-contained i18n for the Wallet Adapters → Stellar Wallets Kit tab. Kept
// local (keyed by locale) like the Privy tab, since this is a standalone
// overview page. Only the sidebar tab label lives in the shared dictionary.

import type { Locale } from "@/app/_i18n/translations";

type KitStrings = {
  title: string;
  subtitle: string;
  // per-SDK descriptions (the toggle switches these + the code panel)
  coreDesc: string;
  reactDesc: string;
  // notes
  notesTitle: string;
  notes: string[];
};

const en: KitStrings = {
  title: "Stellar Wallets Kit adapter",
  subtitle:
    "Register every Stellar Wallets Kit wallet (Freighter, Albedo, xBull, Lobstr…) as Pollar wallet adapters.",
  coreDesc:
    "With `@pollar/core`, build the adapters with `stellarWalletsKitAdapters({ network })` and register them on a plain `PollarClient` — framework-agnostic, works anywhere.",
  reactDesc:
    "With `@pollar/react`, pass the same adapter array to `walletAdapters` on `<PollarProvider>`; the built-in login modal renders a button per wallet from each adapter's `meta`.",
  notesTitle: "Notes",
  notes: [
    "`network` is required — the kit is a global singleton, so it must be told `Networks.TESTNET` or `Networks.PUBLIC` explicitly.",
    "One adapter is registered per wallet; kit wallets share a `meta.group`, so they collapse behind a single “Wallet” gateway in the login UI.",
    "Start a login for a specific wallet with `login({ provider: id })`, where `id` is the wallet's `adapter.type`.",
  ],
};

const es: KitStrings = {
  title: "Adaptador de Stellar Wallets Kit",
  subtitle:
    "Registra cada wallet de Stellar Wallets Kit (Freighter, Albedo, xBull, Lobstr…) como adaptadores de wallet de Pollar.",
  coreDesc:
    "Con `@pollar/core`, construí los adaptadores con `stellarWalletsKitAdapters({ network })` y registralos en un `PollarClient` plano — agnóstico al framework, funciona en cualquier lado.",
  reactDesc:
    "Con `@pollar/react`, pasá el mismo array de adaptadores a `walletAdapters` en `<PollarProvider>`; el modal de login integrado renderiza un botón por wallet a partir del `meta` de cada adaptador.",
  notesTitle: "Notas",
  notes: [
    "`network` es obligatorio — el kit es un singleton global, así que hay que indicarle `Networks.TESTNET` o `Networks.PUBLIC` explícitamente.",
    "Se registra un adaptador por wallet; las wallets del kit comparten un `meta.group`, así que se agrupan detrás de un único botón “Wallet” en la UI de login.",
    "Iniciá el login de una wallet específica con `login({ provider: id })`, donde `id` es el `adapter.type` de la wallet.",
  ],
};

const pt: KitStrings = {
  title: "Adaptador do Stellar Wallets Kit",
  subtitle:
    "Registre cada carteira do Stellar Wallets Kit (Freighter, Albedo, xBull, Lobstr…) como adaptadores de carteira do Pollar.",
  coreDesc:
    "Com `@pollar/core`, construa os adaptadores com `stellarWalletsKitAdapters({ network })` e registre-os em um `PollarClient` puro — agnóstico de framework, funciona em qualquer lugar.",
  reactDesc:
    "Com `@pollar/react`, passe o mesmo array de adaptadores para `walletAdapters` no `<PollarProvider>`; o modal de login embutido renderiza um botão por carteira a partir do `meta` de cada adaptador.",
  notesTitle: "Notas",
  notes: [
    "`network` é obrigatório — o kit é um singleton global, então precisa receber `Networks.TESTNET` ou `Networks.PUBLIC` explicitamente.",
    "Um adaptador é registrado por carteira; as carteiras do kit compartilham um `meta.group`, então elas se agrupam atrás de um único botão “Wallet” na UI de login.",
    "Inicie o login de uma carteira específica com `login({ provider: id })`, onde `id` é o `adapter.type` da carteira.",
  ],
};

export const kitDict: Record<Locale, KitStrings> = { en, es, pt };
