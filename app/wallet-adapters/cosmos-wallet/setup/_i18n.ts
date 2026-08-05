// Self-contained i18n for the Wallet Adapters → Cosmos Wallet → Setup tab.
// Kept local (keyed by locale) instead of merged into the global Dictionary,
// since this tab is a standalone doc page.

import type { Locale } from "@/app/_i18n/translations";

type CwStrings = {
  title: string;
  subtitle: string;
  coreDesc: string;
  reactDesc: string;
  notesTitle: string;
  notes: string[];
};

const en: CwStrings = {
  title: "Cosmos Wallet adapter",
  subtitle:
    "Add the CosmosPay browser extension as a Pollar login. No package to install: the adapter is ~60 lines of app code.",
  coreDesc:
    "With `@pollar/core`, hand the adapter instance to `walletAdapters` on a plain `PollarClient` and trigger it with `login({ provider: 'cosmos-wallet' })`. Pollar then runs the SEP-10 challenge through `connect()` + `signTransaction()`.",
  reactDesc:
    "With `@pollar/react`, pass the same instance in the client's `walletAdapters`. Because the adapter's `meta` carries no `group`, Cosmos Wallet renders as its own button in the login modal (next to Privy), not behind the shared Wallet gateway.",
  notesTitle: "Notes",
  notes: [
    "`isAvailable()` checks for `window.cosmosWallet`, NOT `cosmosWallet.isConnected()` — in this wallet `isConnected` means 'this origin is already approved', which is false before the first login and would send Pollar straight to `wallet_not_installed`.",
    "The extension keeps its own network setting. The adapter is built per network and `connect()` compares `getNetwork().networkPassphrase` with the app's, failing with a readable message instead of an opaque SEP-10 rejection.",
    '`signStellarMessage` is deliberately NOT implemented: the wallet signs the raw utf8 message bytes, not the SEP-53 digest `SHA-256("Stellar Signed Message:\\n" || msg)` that Pollar verifies, so ownership proofs would be rejected.',
    "`signAuthEntry` is not exposed by the provider, so Soroban auth-entry signing is unavailable with this wallet. Login and classic payments are unaffected.",
    "Expect two approval windows on login: one for `getAddress()` (connect) and one for signing the SEP-10 challenge. After the origin is approved, `getAddress()` stops prompting; signing always prompts.",
  ],
};

const es: CwStrings = {
  title: "Adaptador de Cosmos Wallet",
  subtitle:
    "Agrega la extensión de navegador de CosmosPay como login de Pollar. Sin paquete que instalar: el adaptador son ~60 líneas de código de la app.",
  coreDesc:
    "Con `@pollar/core`, pasá la instancia del adaptador a `walletAdapters` en un `PollarClient` plano y disparalo con `login({ provider: 'cosmos-wallet' })`. Pollar corre el challenge SEP-10 usando `connect()` + `signTransaction()`.",
  reactDesc:
    "Con `@pollar/react`, pasá la misma instancia en los `walletAdapters` del cliente. Como el `meta` del adaptador no lleva `group`, Cosmos Wallet renderiza su propio botón en el modal de login (al lado de Privy), no detrás del gateway compartido de Wallet.",
  notesTitle: "Notas",
  notes: [
    "`isAvailable()` chequea `window.cosmosWallet`, NO `cosmosWallet.isConnected()` — en esta wallet `isConnected` significa 'este origin ya está aprobado', que es falso antes del primer login y mandaría a Pollar directo a `wallet_not_installed`.",
    "La extensión tiene su propia configuración de red. El adaptador se construye por red y `connect()` compara `getNetwork().networkPassphrase` con la de la app, fallando con un mensaje legible en vez de un rechazo opaco de SEP-10.",
    '`signStellarMessage` NO se implementa a propósito: la wallet firma los bytes utf8 crudos del mensaje, no el digest SEP-53 `SHA-256("Stellar Signed Message:\\n" || msg)` que Pollar verifica, así que las pruebas de propiedad serían rechazadas.',
    "El proveedor no expone `signAuthEntry`, así que no hay firma de auth entries de Soroban con esta wallet. El login y los pagos clásicos no se ven afectados.",
    "Esperá dos ventanas de aprobación en el login: una por `getAddress()` (connect) y otra al firmar el challenge SEP-10. Una vez aprobado el origin, `getAddress()` deja de preguntar; firmar siempre pregunta.",
  ],
};

const pt: CwStrings = {
  title: "Adaptador da Cosmos Wallet",
  subtitle:
    "Adicione a extensão de navegador da CosmosPay como login da Pollar. Sem pacote para instalar: o adaptador tem ~60 linhas de código do app.",
  coreDesc:
    "Com `@pollar/core`, passe a instância do adaptador para `walletAdapters` em um `PollarClient` puro e dispare com `login({ provider: 'cosmos-wallet' })`. A Pollar então roda o challenge SEP-10 por `connect()` + `signTransaction()`.",
  reactDesc:
    "Com `@pollar/react`, passe a mesma instância nos `walletAdapters` do cliente. Como o `meta` do adaptador não tem `group`, a Cosmos Wallet renderiza o próprio botão no modal de login (ao lado da Privy), e não atrás do gateway compartilhado de Wallet.",
  notesTitle: "Notas",
  notes: [
    "`isAvailable()` verifica `window.cosmosWallet`, NÃO `cosmosWallet.isConnected()` — nesta carteira `isConnected` significa 'este origin já foi aprovado', que é falso antes do primeiro login e levaria a Pollar direto para `wallet_not_installed`.",
    "A extensão mantém a própria configuração de rede. O adaptador é construído por rede e `connect()` compara `getNetwork().networkPassphrase` com a do app, falhando com uma mensagem legível em vez de uma rejeição opaca do SEP-10.",
    '`signStellarMessage` NÃO é implementado de propósito: a carteira assina os bytes utf8 crus da mensagem, não o digest SEP-53 `SHA-256("Stellar Signed Message:\\n" || msg)` que a Pollar verifica, então as provas de posse seriam rejeitadas.',
    "O provedor não expõe `signAuthEntry`, então não há assinatura de auth entries do Soroban com esta carteira. Login e pagamentos clássicos não são afetados.",
    "Espere duas janelas de aprovação no login: uma para `getAddress()` (connect) e outra ao assinar o challenge SEP-10. Depois que o origin é aprovado, `getAddress()` para de perguntar; assinar sempre pergunta.",
  ],
};

export const cosmosWalletSetupDict: Record<Locale, CwStrings> = { en, es, pt };
