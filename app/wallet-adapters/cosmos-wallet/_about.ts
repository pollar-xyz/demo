// "What is Cosmos Wallet" overview copy for the Wallet Adapters → Cosmos Wallet
// tab. This is the CosmosPay browser EXTENSION (window.cosmosWallet), not the
// Cosmos Pay payments SDK that lives under Adapters → Cosmos Pay.

import type { Locale } from "@/app/_i18n/translations";

type AboutSection = {
  eyebrow: string;
  title: string;
  tagline: string;
  body: string[];
  featuresTitle: string;
  features: { title: string; desc: string }[];
  resourcesTitle: string;
  repoLabel: string;
  demoLabel: string;
  disclaimer: string;
};

const en: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Cosmos Wallet",
  tagline:
    "The CosmosPay browser extension as a Pollar login, in about 60 lines of adapter.",
  body: [
    "Cosmos Wallet is a non-custodial Stellar wallet shipped as a Chrome/Edge/Firefox extension (plus mobile and web builds). Its content script injects a SEP-43-style provider at window.cosmosWallet, so a dapp can ask it for an address and for signatures.",
    "That is exactly the surface a Pollar WalletAdapter needs. This tab wires it in by hand: isAvailable, connect, getPublicKey and signTransaction map one-to-one onto the provider, and Pollar wraps the SEP-10 challenge login and transaction signing around them. No new backend, no new package.",
    "Once registered in walletAdapters, Cosmos Wallet renders its own button in the login modal and the rest of the demo (balances, send, history, ramp) works against it like any other external wallet.",
  ],
  featuresTitle: "What the adapter maps",
  features: [
    {
      title: "connect()",
      desc: "cosmosWallet.getAddress() — opens the extension's approval window the first time this origin asks.",
    },
    {
      title: "signTransaction()",
      desc: "cosmosWallet.signTransaction(xdr, { networkPassphrase }) — used for the SEP-10 challenge and every later transfer.",
    },
    {
      title: "isAvailable()",
      desc: "Presence of window.cosmosWallet. NOT isConnected(), which means 'origin already approved'.",
    },
    {
      title: "Network guard",
      desc: "The extension keeps its own network. connect() compares passphrases and fails with a readable message.",
    },
  ],
  resourcesTitle: "Official resources",
  repoLabel: "Cosmos Wallet on GitHub",
  demoLabel: "Its own dapp demo page",
  disclaimer:
    "Summary based on the public CosmosPay-Wallet repository. Pollar is not affiliated with CosmosPay.",
};

const es: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Cosmos Wallet",
  tagline:
    "La extensión de navegador de CosmosPay como login de Pollar, en unas 60 líneas de adaptador.",
  body: [
    "Cosmos Wallet es una billetera Stellar no custodial distribuida como extensión de Chrome/Edge/Firefox (más builds mobile y web). Su content script inyecta un proveedor estilo SEP-43 en window.cosmosWallet, así una dapp puede pedirle una dirección y firmas.",
    "Esa es justo la superficie que necesita un WalletAdapter de Pollar. Esta pestaña lo conecta a mano: isAvailable, connect, getPublicKey y signTransaction mapean uno a uno contra el proveedor, y Pollar envuelve el login SEP-10 y la firma de transacciones alrededor. Sin backend nuevo, sin paquete nuevo.",
    "Una vez registrada en walletAdapters, Cosmos Wallet renderiza su propio botón en el modal de login y el resto del demo (balances, envíos, historial, ramp) funciona con ella como con cualquier otra wallet externa.",
  ],
  featuresTitle: "Qué mapea el adaptador",
  features: [
    {
      title: "connect()",
      desc: "cosmosWallet.getAddress() — abre la ventana de aprobación de la extensión la primera vez que este origin la pide.",
    },
    {
      title: "signTransaction()",
      desc: "cosmosWallet.signTransaction(xdr, { networkPassphrase }) — se usa para el challenge SEP-10 y para cada transferencia posterior.",
    },
    {
      title: "isAvailable()",
      desc: "La presencia de window.cosmosWallet. NO isConnected(), que significa 'origin ya aprobado'.",
    },
    {
      title: "Chequeo de red",
      desc: "La extensión tiene su propia red. connect() compara passphrases y falla con un mensaje legible.",
    },
  ],
  resourcesTitle: "Recursos oficiales",
  repoLabel: "Cosmos Wallet en GitHub",
  demoLabel: "Su propia página de demo para dapps",
  disclaimer:
    "Resumen basado en el repositorio público CosmosPay-Wallet. Pollar no está afiliado a CosmosPay.",
};

const pt: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Cosmos Wallet",
  tagline:
    "A extensão de navegador da CosmosPay como login da Pollar, em cerca de 60 linhas de adaptador.",
  body: [
    "Cosmos Wallet é uma carteira Stellar não custodial distribuída como extensão de Chrome/Edge/Firefox (além de builds mobile e web). Seu content script injeta um provedor no estilo SEP-43 em window.cosmosWallet, então uma dapp pode pedir um endereço e assinaturas.",
    "Essa é exatamente a superfície de que um WalletAdapter da Pollar precisa. Esta aba conecta tudo à mão: isAvailable, connect, getPublicKey e signTransaction mapeiam um a um no provedor, e a Pollar envolve o login SEP-10 e a assinatura de transações em volta deles. Sem backend novo, sem pacote novo.",
    "Uma vez registrada em walletAdapters, a Cosmos Wallet renderiza o próprio botão no modal de login e o resto do demo (saldos, envios, histórico, ramp) funciona com ela como com qualquer outra carteira externa.",
  ],
  featuresTitle: "O que o adaptador mapeia",
  features: [
    {
      title: "connect()",
      desc: "cosmosWallet.getAddress() — abre a janela de aprovação da extensão na primeira vez que este origin pede.",
    },
    {
      title: "signTransaction()",
      desc: "cosmosWallet.signTransaction(xdr, { networkPassphrase }) — usado no challenge SEP-10 e em cada transferência depois.",
    },
    {
      title: "isAvailable()",
      desc: "A presença de window.cosmosWallet. NÃO isConnected(), que significa 'origin já aprovado'.",
    },
    {
      title: "Checagem de rede",
      desc: "A extensão tem a própria rede. connect() compara as passphrases e falha com uma mensagem legível.",
    },
  ],
  resourcesTitle: "Recursos oficiais",
  repoLabel: "Cosmos Wallet no GitHub",
  demoLabel: "A própria página de demo para dapps",
  disclaimer:
    "Resumo baseado no repositório público CosmosPay-Wallet. A Pollar não é afiliada à CosmosPay.",
};

export const cosmosWalletAboutDict: Record<Locale, AboutSection> = {
  en,
  es,
  pt,
};
