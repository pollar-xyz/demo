// "What is Stellar Wallets Kit" overview copy for the Wallet Adapters → SWK tab.

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
  title: "Stellar Wallets Kit",
  tagline:
    "One adapter per Stellar wallet — Freighter, Albedo, xBull, Lobstr and more.",
  body: [
    "Stellar Wallets Kit (by Creit Tech) is a unified library for connecting Stellar wallets: it exposes one consistent API over Freighter, Albedo, xBull, Lobstr, Hana, Rabet and others.",
    "Pollar's adapter wraps each kit wallet as a WalletAdapter, so the SDK runs the SEP-10 login and signs transactions through any of them. Register them once and the login modal renders a button per wallet.",
    "It's framework-agnostic: use it with @pollar/core on a plain PollarClient, or with @pollar/react on the provider. See the Setup tab for both.",
  ],
  whyPollar: {
    title: "Why Pollar, not just Stellar Wallets Kit?",
    tagline:
      "SWK connects the wallet. That's step zero. Pollar turns that connection into a finished product.",
    points: [
      {
        title: "A connection isn't an app",
        desc: "SWK gets you a signature. Pollar gives you SEP-10 auth sessions, balances, transfers, history, on/off-ramp and KYC — the whole backend, already built.",
      },
      {
        title: "Every wallet AND every login, one modal",
        desc: "Keep all the SWK wallets and add Privy email login, smart accounts and more behind the same login flow. Add an auth method without rewriting your UI.",
      },
      {
        title: "Production UI out of the box",
        desc: "Login modal, wallet button and status components ship with the SDK — instead of hand-building modals around raw kit calls.",
      },
      {
        title: "Backend you never maintain",
        desc: "Indexing, transaction submission and ramp/KYC providers run on Pollar's API. Ship in days, not months — with no infra to babysit.",
      },
    ],
    punch: "Stellar Wallets Kit connects the wallet. Pollar ships the app.",
  },
  featuresTitle: "What you get",
  features: [
    {
      title: "Every major wallet",
      desc: "Freighter, Albedo, xBull, Lobstr, Hana, Rabet… one adapter each.",
    },
    {
      title: "One-line setup",
      desc: "stellarWalletsKitAdapters({ network }) returns the whole array.",
    },
    {
      title: "Grouped login UI",
      desc: "Kit wallets collapse behind a single 'Wallet' gateway button.",
    },
    {
      title: "Core or React",
      desc: "The same adapters work with a plain client or the provider.",
    },
  ],
  resourcesTitle: "Official resources",
  docsLabel: "Stellar Wallets Kit docs",
  repoLabel: "Stellar Wallets Kit on GitHub",
  disclaimer:
    "Summary based on the public Stellar Wallets Kit. Pollar is not affiliated with Creit Tech.",
};

const es: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Stellar Wallets Kit",
  tagline:
    "Un adaptador por wallet de Stellar — Freighter, Albedo, xBull, Lobstr y más.",
  body: [
    "Stellar Wallets Kit (de Creit Tech) es una librería unificada para conectar wallets de Stellar: expone una API consistente sobre Freighter, Albedo, xBull, Lobstr, Hana, Rabet y otras.",
    "El adaptador de Pollar envuelve cada wallet del kit como un WalletAdapter, así el SDK corre el login SEP-10 y firma transacciones con cualquiera de ellas. Registralas una vez y el modal de login renderiza un botón por wallet.",
    "Es agnóstico al framework: usalo con @pollar/core en un PollarClient plano, o con @pollar/react en el provider. Mirá la pestaña Setup para ambos.",
  ],
  whyPollar: {
    title: "¿Por qué Pollar y no solo Stellar Wallets Kit?",
    tagline:
      "SWK conecta la wallet. Eso es el paso cero. Pollar convierte esa conexión en un producto terminado.",
    points: [
      {
        title: "Una conexión no es una app",
        desc: "SWK te consigue una firma. Pollar te da sesiones de auth SEP-10, balances, transferencias, historial, on/off-ramp y KYC — todo el backend, ya construido.",
      },
      {
        title: "Todas las wallets Y todos los logins, un solo modal",
        desc: "Mantené todas las wallets de SWK y sumá login con email de Privy, smart accounts y más detrás del mismo flujo. Agregá un método de auth sin reescribir tu UI.",
      },
      {
        title: "UI de producción lista",
        desc: "Modal de login, botón de wallet y componentes de estado vienen con el SDK — en vez de armar modales a mano sobre llamadas crudas del kit.",
      },
      {
        title: "Backend que nunca mantenés",
        desc: "Indexación, envío de transacciones y proveedores de ramp/KYC corren en la API de Pollar. Lanzá en días, no meses — sin infra que cuidar.",
      },
    ],
    punch: "Stellar Wallets Kit conecta la wallet. Pollar lanza la app.",
  },
  featuresTitle: "Qué obtenés",
  features: [
    {
      title: "Todas las wallets",
      desc: "Freighter, Albedo, xBull, Lobstr, Hana, Rabet… un adaptador para cada una.",
    },
    {
      title: "Setup de una línea",
      desc: "stellarWalletsKitAdapters({ network }) devuelve todo el array.",
    },
    {
      title: "UI de login agrupada",
      desc: "Las wallets del kit se agrupan detrás de un único botón 'Wallet'.",
    },
    {
      title: "Core o React",
      desc: "Los mismos adaptadores funcionan con un cliente plano o el provider.",
    },
  ],
  resourcesTitle: "Recursos oficiales",
  docsLabel: "Docs de Stellar Wallets Kit",
  repoLabel: "Stellar Wallets Kit en GitHub",
  disclaimer:
    "Resumen basado en el Stellar Wallets Kit público. Pollar no está afiliado a Creit Tech.",
};

const pt: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Stellar Wallets Kit",
  tagline:
    "Um adaptador por carteira da Stellar — Freighter, Albedo, xBull, Lobstr e mais.",
  body: [
    "Stellar Wallets Kit (da Creit Tech) é uma biblioteca unificada para conectar carteiras da Stellar: expõe uma API consistente sobre Freighter, Albedo, xBull, Lobstr, Hana, Rabet e outras.",
    "O adaptador da Pollar envolve cada carteira do kit como um WalletAdapter, então o SDK roda o login SEP-10 e assina transações por qualquer uma delas. Registre-as uma vez e o modal de login renderiza um botão por carteira.",
    "É agnóstico de framework: use com @pollar/core em um PollarClient puro, ou com @pollar/react no provider. Veja a aba Setup para ambos.",
  ],
  whyPollar: {
    title: "Por que Pollar, e não só o Stellar Wallets Kit?",
    tagline:
      "O SWK conecta a carteira. Isso é o passo zero. A Pollar transforma essa conexão em um produto pronto.",
    points: [
      {
        title: "Uma conexão não é um app",
        desc: "O SWK te dá uma assinatura. A Pollar te dá sessões de auth SEP-10, saldos, transferências, histórico, on/off-ramp e KYC — todo o backend, já construído.",
      },
      {
        title: "Todas as carteiras E todos os logins, um só modal",
        desc: "Mantenha todas as carteiras do SWK e adicione login por e-mail da Privy, smart accounts e mais atrás do mesmo fluxo. Acrescente um método de auth sem reescrever sua UI.",
      },
      {
        title: "UI de produção pronta",
        desc: "Modal de login, botão de carteira e componentes de status vêm com o SDK — em vez de montar modais na mão sobre chamadas cruas do kit.",
      },
      {
        title: "Backend que você nunca mantém",
        desc: "Indexação, envio de transações e provedores de ramp/KYC rodam na API da Pollar. Lance em dias, não meses — sem infra para cuidar.",
      },
    ],
    punch: "O Stellar Wallets Kit conecta a carteira. A Pollar lança o app.",
  },
  featuresTitle: "O que você ganha",
  features: [
    {
      title: "Todas as carteiras",
      desc: "Freighter, Albedo, xBull, Lobstr, Hana, Rabet… um adaptador para cada.",
    },
    {
      title: "Setup de uma linha",
      desc: "stellarWalletsKitAdapters({ network }) retorna o array inteiro.",
    },
    {
      title: "UI de login agrupada",
      desc: "As carteiras do kit se agrupam atrás de um único botão 'Wallet'.",
    },
    {
      title: "Core ou React",
      desc: "Os mesmos adaptadores funcionam com um cliente puro ou o provider.",
    },
  ],
  resourcesTitle: "Recursos oficiais",
  docsLabel: "Docs do Stellar Wallets Kit",
  repoLabel: "Stellar Wallets Kit no GitHub",
  disclaimer:
    "Resumo baseado no Stellar Wallets Kit público. A Pollar não é afiliada à Creit Tech.",
};

export const swkAboutDict: Record<Locale, AboutSection> = { en, es, pt };
