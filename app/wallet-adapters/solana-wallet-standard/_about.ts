// "What is the Solana Wallet Standard" overview copy for the Wallet Adapters →
// Solana tab.

import type { Locale } from "@/app/_i18n/translations";

type AboutSection = {
  eyebrow: string;
  title: string;
  tagline: string;
  body: string[];
  whyPollar: {
    title: string;
    tagline: string;
    points: { title: string; desc: string }[];
    punch: string;
  };
  featuresTitle: string;
  features: { title: string; desc: string }[];
  resourcesTitle: string;
  docsLabel: string;
  repoLabel: string;
  disclaimer: string;
};

const en: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Solana Wallet Standard",
  tagline:
    "One adapter per installed Solana wallet — Phantom, Solflare, Backpack and more.",
  body: [
    "The Wallet Standard is the headless interface Solana browser wallets implement to announce themselves to dapps. It's the same layer @solana/wallet-adapter is built on, with no wallet SDK to bundle.",
    "Pollar's adapter wraps each discovered wallet as a WalletAdapter with chain SOLANA, so the SDK logs in with SIWS (Sign In With Solana) instead of Stellar's SEP-10, and signs Solana transactions through the wallet.",
    "Stellar and Solana wallets live in the same walletAdapters list: one login modal, one button per chain. See the Setup tab for @pollar/core and @pollar/react.",
  ],
  whyPollar: {
    title: "Why Pollar, not just the Wallet Standard?",
    tagline:
      "The Wallet Standard finds the wallet. Pollar turns that wallet into a signed-in user with a backend behind them.",
    points: [
      {
        title: "Sign-in, not just connect",
        desc: "Pollar issues the SIWS challenge, verifies the signature server-side and hands you a session — no auth server of your own.",
      },
      {
        title: "Two chains, one modal",
        desc: "Solana wallets sit next to Stellar wallets, Privy email login and more behind the same login flow.",
      },
      {
        title: "Payments built in",
        desc: "Send SOL and SPL tokens with app-sponsored fees, and token accounts created for the recipient.",
      },
      {
        title: "Ramps to Solana",
        desc: "Fiat on/off-ramps settle straight to the user's Solana wallet, on Pollar's API.",
      },
    ],
    punch: "The Wallet Standard finds the wallet. Pollar ships the app.",
  },
  featuresTitle: "What you get",
  features: [
    {
      title: "Every installed wallet",
      desc: "Phantom, Solflare, Backpack… one adapter each, discovered at runtime.",
    },
    {
      title: "Zero-config setup",
      desc: "solanaWalletStandardAdapters() returns the whole array.",
    },
    {
      title: "SIWS login",
      desc: "Native solana:signIn, with a signMessage fallback for wallets without it.",
    },
    {
      title: "Grouped login UI",
      desc: "Solana wallets collapse behind their own 'Solana Wallet' button.",
    },
  ],
  resourcesTitle: "Official resources",
  docsLabel: "@pollar/solana-wallet-standard-adapter on npm",
  repoLabel: "Wallet Standard on GitHub",
  disclaimer:
    "Summary based on the public Wallet Standard. Pollar is not affiliated with its maintainers or the wallets listed.",
};

const es: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Solana Wallet Standard",
  tagline:
    "Un adaptador por wallet de Solana instalada — Phantom, Solflare, Backpack y más.",
  body: [
    "El Wallet Standard es la interfaz headless que implementan las wallets de navegador de Solana para anunciarse a las dapps. Es la misma capa sobre la que está construido @solana/wallet-adapter, sin SDK de wallet que empaquetar.",
    "El adaptador de Pollar envuelve cada wallet descubierta como un WalletAdapter con chain SOLANA, así el SDK hace login con SIWS (Sign In With Solana) en vez del SEP-10 de Stellar, y firma transacciones de Solana con la wallet.",
    "Las wallets de Stellar y de Solana van en la misma lista walletAdapters: un solo modal de login, un botón por cadena. Mirá la pestaña Setup para @pollar/core y @pollar/react.",
  ],
  whyPollar: {
    title: "¿Por qué Pollar y no solo el Wallet Standard?",
    tagline:
      "El Wallet Standard encuentra la wallet. Pollar convierte esa wallet en un usuario logueado con un backend detrás.",
    points: [
      {
        title: "Login, no solo conexión",
        desc: "Pollar emite el challenge SIWS, verifica la firma en el servidor y te da una sesión — sin servidor de auth propio.",
      },
      {
        title: "Dos cadenas, un modal",
        desc: "Las wallets de Solana conviven con las de Stellar, el login por email de Privy y más detrás del mismo flujo.",
      },
      {
        title: "Pagos incluidos",
        desc: "Enviá SOL y tokens SPL con fees patrocinados por la app, y cuentas de token creadas para el destinatario.",
      },
      {
        title: "Ramps a Solana",
        desc: "Los on/off-ramps fiat liquidan directo a la wallet de Solana del usuario, sobre la API de Pollar.",
      },
    ],
    punch: "El Wallet Standard encuentra la wallet. Pollar lanza la app.",
  },
  featuresTitle: "Qué obtenés",
  features: [
    {
      title: "Todas las wallets instaladas",
      desc: "Phantom, Solflare, Backpack… un adaptador para cada una, descubiertas en runtime.",
    },
    {
      title: "Setup sin configuración",
      desc: "solanaWalletStandardAdapters() devuelve todo el array.",
    },
    {
      title: "Login SIWS",
      desc: "solana:signIn nativo, con fallback a signMessage para las wallets que no lo tienen.",
    },
    {
      title: "UI de login agrupada",
      desc: "Las wallets de Solana se agrupan detrás de su propio botón 'Solana Wallet'.",
    },
  ],
  resourcesTitle: "Recursos oficiales",
  docsLabel: "@pollar/solana-wallet-standard-adapter en npm",
  repoLabel: "Wallet Standard en GitHub",
  disclaimer:
    "Resumen basado en el Wallet Standard público. Pollar no está afiliado a sus mantenedores ni a las wallets mencionadas.",
};

const pt: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Solana Wallet Standard",
  tagline:
    "Um adaptador por carteira Solana instalada — Phantom, Solflare, Backpack e mais.",
  body: [
    "O Wallet Standard é a interface headless que as carteiras de navegador da Solana implementam para se anunciar às dapps. É a mesma camada sobre a qual o @solana/wallet-adapter é construído, sem SDK de carteira para empacotar.",
    "O adaptador da Pollar envolve cada carteira descoberta como um WalletAdapter com chain SOLANA, então o SDK faz login com SIWS (Sign In With Solana) em vez do SEP-10 da Stellar, e assina transações Solana pela carteira.",
    "Carteiras Stellar e Solana ficam na mesma lista walletAdapters: um só modal de login, um botão por rede. Veja a aba Setup para @pollar/core e @pollar/react.",
  ],
  whyPollar: {
    title: "Por que Pollar, e não só o Wallet Standard?",
    tagline:
      "O Wallet Standard encontra a carteira. A Pollar transforma essa carteira em um usuário logado com um backend por trás.",
    points: [
      {
        title: "Login, não só conexão",
        desc: "A Pollar emite o challenge SIWS, verifica a assinatura no servidor e te entrega uma sessão — sem servidor de auth próprio.",
      },
      {
        title: "Duas redes, um modal",
        desc: "As carteiras Solana convivem com as da Stellar, o login por e-mail da Privy e mais atrás do mesmo fluxo.",
      },
      {
        title: "Pagamentos incluídos",
        desc: "Envie SOL e tokens SPL com taxas patrocinadas pelo app, e contas de token criadas para o destinatário.",
      },
      {
        title: "Ramps para Solana",
        desc: "Os on/off-ramps fiat liquidam direto na carteira Solana do usuário, pela API da Pollar.",
      },
    ],
    punch: "O Wallet Standard encontra a carteira. A Pollar lança o app.",
  },
  featuresTitle: "O que você ganha",
  features: [
    {
      title: "Todas as carteiras instaladas",
      desc: "Phantom, Solflare, Backpack… um adaptador para cada, descobertas em runtime.",
    },
    {
      title: "Setup sem configuração",
      desc: "solanaWalletStandardAdapters() retorna o array inteiro.",
    },
    {
      title: "Login SIWS",
      desc: "solana:signIn nativo, com fallback para signMessage nas carteiras que não o têm.",
    },
    {
      title: "UI de login agrupada",
      desc: "As carteiras Solana se agrupam atrás do seu próprio botão 'Solana Wallet'.",
    },
  ],
  resourcesTitle: "Recursos oficiais",
  docsLabel: "@pollar/solana-wallet-standard-adapter no npm",
  repoLabel: "Wallet Standard no GitHub",
  disclaimer:
    "Resumo baseado no Wallet Standard público. A Pollar não é afiliada aos seus mantenedores nem às carteiras citadas.",
};

export const solanaAboutDict: Record<Locale, AboutSection> = { en, es, pt };
