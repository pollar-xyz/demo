// "What is Stellar Wallets Kit" overview copy for the Wallet Adapters → SWK tab.

import type { Locale } from "@/app/_i18n/translations";

type AboutSection = {
  eyebrow: string;
  title: string;
  tagline: string;
  body: string[];
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
