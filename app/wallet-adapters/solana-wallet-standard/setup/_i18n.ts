// Self-contained i18n for the Wallet Adapters → Solana Wallet Standard tab.
// Only the sidebar group label lives in the shared dictionary.

import type { Locale } from "@/app/_i18n/translations";

type SolanaStrings = {
  title: string;
  subtitle: string;
  coreDesc: string;
  reactDesc: string;
  notesTitle: string;
  notes: string[];
};

const en: SolanaStrings = {
  title: "Solana Wallet Standard adapter",
  subtitle:
    "Register every installed Solana wallet (Phantom, Solflare, Backpack…) as Pollar wallet adapters.",
  coreDesc:
    "With `@pollar/core`, build the adapters with `solanaWalletStandardAdapters()` and register them on a plain `PollarClient`, next to any Stellar adapters.",
  reactDesc:
    "With `@pollar/react`, pass the same adapter array to `walletAdapters` on `<PollarProvider>`; the built-in login modal renders a “Solana Wallet” gateway with one button per wallet.",
  notesTitle: "Notes",
  notes: [
    "Wallets register in the browser only: the factory returns `[]` during SSR, so build the client on the client render.",
    "Login is SIWS, not SEP-10: the adapter declares `chain: 'SOLANA'`, and a wallet without `solana:signIn` signs the same message through `signMessage`.",
    "No network option: the Solana network follows the API key, like the Stellar one.",
    "Narrow the list with `wallets`, rename buttons with `labels`, and change the gateway label with `groupLabel` (default `'Solana Wallet'`).",
  ],
};

const es: SolanaStrings = {
  title: "Adaptador de Solana Wallet Standard",
  subtitle:
    "Registra cada wallet de Solana instalada (Phantom, Solflare, Backpack…) como adaptadores de wallet de Pollar.",
  coreDesc:
    "Con `@pollar/core`, construí los adaptadores con `solanaWalletStandardAdapters()` y registralos en un `PollarClient` plano, junto a cualquier adaptador de Stellar.",
  reactDesc:
    "Con `@pollar/react`, pasá el mismo array de adaptadores a `walletAdapters` en `<PollarProvider>`; el modal de login integrado renderiza un botón “Solana Wallet” con un botón por wallet.",
  notesTitle: "Notas",
  notes: [
    "Las wallets se registran solo en el navegador: la factory devuelve `[]` durante SSR, así que construí el cliente en el render del cliente.",
    "El login es SIWS, no SEP-10: el adaptador declara `chain: 'SOLANA'`, y una wallet sin `solana:signIn` firma el mismo mensaje con `signMessage`.",
    "No hay opción de red: la red de Solana sigue a la API key, igual que la de Stellar.",
    "Filtrá la lista con `wallets`, renombrá botones con `labels` y cambiá el label del botón agrupador con `groupLabel` (por defecto `'Solana Wallet'`).",
  ],
};

const pt: SolanaStrings = {
  title: "Adaptador do Solana Wallet Standard",
  subtitle:
    "Registre cada carteira Solana instalada (Phantom, Solflare, Backpack…) como adaptadores de carteira do Pollar.",
  coreDesc:
    "Com `@pollar/core`, construa os adaptadores com `solanaWalletStandardAdapters()` e registre-os em um `PollarClient` puro, ao lado de qualquer adaptador Stellar.",
  reactDesc:
    "Com `@pollar/react`, passe o mesmo array de adaptadores para `walletAdapters` no `<PollarProvider>`; o modal de login embutido renderiza um botão “Solana Wallet” com um botão por carteira.",
  notesTitle: "Notas",
  notes: [
    "As carteiras se registram só no navegador: a factory retorna `[]` durante o SSR, então construa o cliente no render do cliente.",
    "O login é SIWS, não SEP-10: o adaptador declara `chain: 'SOLANA'`, e uma carteira sem `solana:signIn` assina a mesma mensagem via `signMessage`.",
    "Não há opção de rede: a rede Solana segue a API key, como a da Stellar.",
    "Filtre a lista com `wallets`, renomeie botões com `labels` e mude o rótulo do botão agrupador com `groupLabel` (padrão `'Solana Wallet'`).",
  ],
};

export const solanaDict: Record<Locale, SolanaStrings> = { en, es, pt };
