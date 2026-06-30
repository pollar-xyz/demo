// "What is Privy" overview copy for the Wallet Adapters → Privy tab.

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
  siteLabel: string;
  disclaimer: string;
};

const en: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Privy",
  tagline:
    "Email / Google login with an embedded Stellar wallet, as a Pollar adapter.",
  body: [
    "Privy is an authentication and embedded-wallet provider: users sign in with email or a social account and get a self-custodial wallet — no extension, no seed phrase.",
    "Pollar's adapter wraps Privy as an interactive auth adapter. Pollar's login modal renders Privy's email/Google sub-modal, creates the embedded Stellar wallet, then runs the SEP-10 flow.",
    "Privy is React / React Native only: mount <PrivyAdapterProvider> and register the adapter. See the Setup tab.",
  ],
  whyPollar: {
    title: "Why Pollar, not just Privy?",
    tagline:
      "Privy signs the user in and hands you a key. Pollar makes that wallet actually do things on Stellar.",
    points: [
      {
        title: "Auth is the start, not the product",
        desc: "Privy logs the user in. Pollar adds SEP-10 sessions, balances, transfers, history, on/off-ramp and KYC — the Stellar product the login was for.",
      },
      {
        title: "Stellar-native, zero glue code",
        desc: "The Privy embedded wallet plugs straight into SEP-10 auth, asset balances and transaction submission. No bridging layer to write or maintain.",
      },
      {
        title: "Mix logins without lock-in",
        desc: "Combine Privy email login with Freighter, xBull and smart accounts behind one modal. Users pick their way in; you never rebuild the flow.",
      },
      {
        title: "Skip the backend entirely",
        desc: "Indexing, transaction submission and ramp/KYC providers run on Pollar's API — so you ship a working app, not a pile of infrastructure.",
      },
    ],
    punch: "Privy signs them in. Pollar turns it into a Stellar app.",
  },
  featuresTitle: "What you get",
  features: [
    {
      title: "Email & social login",
      desc: "Sign in with email or Google — no extension, no seed phrase.",
    },
    {
      title: "Embedded Stellar wallet",
      desc: "Created automatically on first login.",
    },
    {
      title: "In-modal flow",
      desc: "The Privy sub-modal lives inside Pollar's own login modal.",
    },
    {
      title: "Drop-in provider",
      desc: "<PrivyAdapterProvider> mounts Privy and the bridge for you.",
    },
  ],
  resourcesTitle: "Official resources",
  docsLabel: "Privy docs",
  siteLabel: "privy.io",
  disclaimer:
    "Summary based on the public Privy SDK. Pollar is not affiliated with Privy.",
};

const es: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Privy",
  tagline:
    "Login con email / Google y una billetera Stellar embebida, como adaptador de Pollar.",
  body: [
    "Privy es un proveedor de autenticación y billetera embebida: los usuarios inician sesión con email o una cuenta social y obtienen una billetera auto-custodial — sin extensión ni frase semilla.",
    "El adaptador de Pollar envuelve a Privy como un adaptador de auth interactivo. El modal de login de Pollar renderiza el sub-modal de email/Google de Privy, crea la billetera Stellar embebida y luego corre el flujo SEP-10.",
    "Privy es solo React / React Native: montá <PrivyAdapterProvider> y registrá el adaptador. Mirá la pestaña Setup.",
  ],
  whyPollar: {
    title: "¿Por qué Pollar y no solo Privy?",
    tagline:
      "Privy inicia sesión al usuario y te entrega una llave. Pollar hace que esa billetera realmente haga cosas en Stellar.",
    points: [
      {
        title: "La auth es el comienzo, no el producto",
        desc: "Privy inicia la sesión. Pollar suma sesiones SEP-10, balances, transferencias, historial, on/off-ramp y KYC — el producto Stellar para el que era ese login.",
      },
      {
        title: "Nativo de Stellar, cero código pegamento",
        desc: "La billetera embebida de Privy se conecta directo al login SEP-10, los balances de activos y el envío de transacciones. Sin capa de bridge que escribir ni mantener.",
      },
      {
        title: "Combiná logins sin lock-in",
        desc: "Mezclá login con email de Privy con Freighter, xBull y smart accounts detrás de un solo modal. El usuario elige cómo entrar; vos nunca rehacés el flujo.",
      },
      {
        title: "Salteate el backend por completo",
        desc: "Indexación, envío de transacciones y proveedores de ramp/KYC corren en la API de Pollar — así lanzás una app que funciona, no una pila de infraestructura.",
      },
    ],
    punch: "Privy inicia la sesión. Pollar lo convierte en una app de Stellar.",
  },
  featuresTitle: "Qué obtenés",
  features: [
    {
      title: "Login con email y social",
      desc: "Iniciá sesión con email o Google — sin extensión ni frase semilla.",
    },
    {
      title: "Billetera Stellar embebida",
      desc: "Se crea automáticamente en el primer login.",
    },
    {
      title: "Flujo en el modal",
      desc: "El sub-modal de Privy vive dentro del modal de login de Pollar.",
    },
    {
      title: "Provider listo para usar",
      desc: "<PrivyAdapterProvider> monta Privy y el bridge por vos.",
    },
  ],
  resourcesTitle: "Recursos oficiales",
  docsLabel: "Docs de Privy",
  siteLabel: "privy.io",
  disclaimer:
    "Resumen basado en el SDK público de Privy. Pollar no está afiliado a Privy.",
};

const pt: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Privy",
  tagline:
    "Login com e-mail / Google e uma carteira Stellar embutida, como adaptador da Pollar.",
  body: [
    "A Privy é um provedor de autenticação e carteira embutida: os usuários entram com e-mail ou uma conta social e recebem uma carteira auto-custodial — sem extensão nem frase-semente.",
    "O adaptador da Pollar envolve a Privy como um adaptador de auth interativo. O modal de login da Pollar renderiza o sub-modal de e-mail/Google da Privy, cria a carteira Stellar embutida e então roda o fluxo SEP-10.",
    "A Privy é apenas React / React Native: monte <PrivyAdapterProvider> e registre o adaptador. Veja a aba Setup.",
  ],
  whyPollar: {
    title: "Por que Pollar, e não só a Privy?",
    tagline:
      "A Privy faz o login do usuário e te entrega uma chave. A Pollar faz essa carteira realmente fazer coisas na Stellar.",
    points: [
      {
        title: "Auth é o começo, não o produto",
        desc: "A Privy faz o login. A Pollar adiciona sessões SEP-10, saldos, transferências, histórico, on/off-ramp e KYC — o produto Stellar para o qual o login existia.",
      },
      {
        title: "Nativo da Stellar, zero código de cola",
        desc: "A carteira embutida da Privy se conecta direto ao login SEP-10, aos saldos de ativos e ao envio de transações. Sem camada de bridge para escrever ou manter.",
      },
      {
        title: "Combine logins sem lock-in",
        desc: "Misture login por e-mail da Privy com Freighter, xBull e smart accounts atrás de um só modal. O usuário escolhe como entrar; você nunca refaz o fluxo.",
      },
      {
        title: "Pule o backend por completo",
        desc: "Indexação, envio de transações e provedores de ramp/KYC rodam na API da Pollar — então você lança um app que funciona, não uma pilha de infraestrutura.",
      },
    ],
    punch:
      "A Privy faz o login. A Pollar transforma isso em um app da Stellar.",
  },
  featuresTitle: "O que você ganha",
  features: [
    {
      title: "Login com e-mail e social",
      desc: "Entre com e-mail ou Google — sem extensão nem frase-semente.",
    },
    {
      title: "Carteira Stellar embutida",
      desc: "Criada automaticamente no primeiro login.",
    },
    {
      title: "Fluxo no modal",
      desc: "O sub-modal da Privy vive dentro do modal de login da Pollar.",
    },
    {
      title: "Provider pronto para usar",
      desc: "<PrivyAdapterProvider> monta a Privy e o bridge para você.",
    },
  ],
  resourcesTitle: "Recursos oficiais",
  docsLabel: "Docs da Privy",
  siteLabel: "privy.io",
  disclaimer:
    "Resumo baseado no SDK público da Privy. A Pollar não é afiliada à Privy.",
};

export const privyAboutDict: Record<Locale, AboutSection> = { en, es, pt };
