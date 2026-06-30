// "What is Accesly" overview copy for the Wallet Adapters → Accesly tab.
// (Relocated from the former /accesly partner section.)

import type { Locale } from "@/app/_i18n/translations";

type AboutSection = {
  eyebrow: string;
  title: string;
  tagline: string;
  body: string[];
  featuresTitle: string;
  features: { title: string; desc: string }[];
  resourcesTitle: string;
  reactPkgLabel: string;
  corePkgLabel: string;
  disclaimer: string;
};

const en: AboutSection = {
  eyebrow: "Accesly",
  title: "Non-custodial Stellar wallets with passkeys",
  tagline:
    "Embedded smart-account wallets secured by WebAuthn passkeys and MPC — no seed phrases.",
  body: [
    "Accesly is a non-custodial wallet SDK for Stellar. It deploys a Soroban smart account per user and secures it with a device passkey (Face ID / Touch ID / Windows Hello) plus a Shamir-split key — the private key never exists whole in one place and there is no seed phrase to write down.",
    "The SDK runs the full lifecycle client-side: passkey registration, key derivation, wallet deploy, balance and activity streaming over SSE, transfers, swaps, and email-OTP recovery. Cognito backs the account layer and Stellar testnet is the default network.",
    "Pollar wraps Accesly as a wallet adapter: see the Setup tab to register the Accesly adapter and sign Pollar transactions with an Accesly smart account.",
  ],
  featuresTitle: "What it offers",
  features: [
    {
      title: "Passkey-secured",
      desc: "WebAuthn passkeys gate every signature — no seed phrase, no raw private key on a server.",
    },
    {
      title: "MPC key shares",
      desc: "The signing key is Shamir-split 2-of-3 across device, backend, and recovery.",
    },
    {
      title: "Soroban smart accounts",
      desc: "Each user gets a smart account with per-asset spending rules on-chain.",
    },
    {
      title: "Built-in recovery",
      desc: "Email OTP plus a password rotates the signer onto a new device.",
    },
  ],
  resourcesTitle: "Official resources",
  reactPkgLabel: "@accesly/react on npm",
  corePkgLabel: "@accesly/core on npm",
  disclaimer:
    "Summary based on the public @accesly/react and @accesly/core packages. Pollar is not affiliated with Accesly — all credit to their team.",
};

const es: AboutSection = {
  eyebrow: "Accesly",
  title: "Billeteras Stellar no custodiales con passkeys",
  tagline:
    "Billeteras de smart account embebidas, protegidas con passkeys WebAuthn y MPC — sin frases semilla.",
  body: [
    "Accesly es un SDK de billetera no custodial para Stellar. Despliega una smart account de Soroban por usuario y la protege con un passkey del dispositivo (Face ID / Touch ID / Windows Hello) más una clave dividida con Shamir — la clave privada nunca existe completa en un solo lugar y no hay frase semilla que anotar.",
    "El SDK ejecuta todo el ciclo de vida del lado del cliente: registro del passkey, derivación de claves, despliegue de la billetera, streaming de saldo y actividad por SSE, transferencias, swaps y recuperación por OTP de email. Cognito respalda la capa de cuenta y la red por defecto es Stellar testnet.",
    "Pollar envuelve a Accesly como un wallet adapter: mirá la pestaña Setup para registrar el adaptador de Accesly y firmar transacciones de Pollar con una smart account de Accesly.",
  ],
  featuresTitle: "Qué ofrece",
  features: [
    {
      title: "Protegida con passkeys",
      desc: "Los passkeys WebAuthn autorizan cada firma — sin frase semilla ni clave privada en bruto en un servidor.",
    },
    {
      title: "Fragmentos de clave MPC",
      desc: "La clave de firma se divide 2 de 3 con Shamir entre dispositivo, backend y recuperación.",
    },
    {
      title: "Smart accounts de Soroban",
      desc: "Cada usuario obtiene una smart account con reglas de gasto por activo en cadena.",
    },
    {
      title: "Recuperación integrada",
      desc: "Un OTP de email más una contraseña rota el firmante hacia un nuevo dispositivo.",
    },
  ],
  resourcesTitle: "Recursos oficiales",
  reactPkgLabel: "@accesly/react en npm",
  corePkgLabel: "@accesly/core en npm",
  disclaimer:
    "Resumen basado en los paquetes públicos @accesly/react y @accesly/core. Pollar no está afiliado a Accesly — todo el crédito a su equipo.",
};

const pt: AboutSection = {
  eyebrow: "Accesly",
  title: "Carteiras Stellar não custodiais com passkeys",
  tagline:
    "Carteiras de smart account integradas, protegidas por passkeys WebAuthn e MPC — sem frases-semente.",
  body: [
    "A Accesly é um SDK de carteira não custodial para Stellar. Implanta uma smart account de Soroban por usuário e a protege com um passkey do dispositivo (Face ID / Touch ID / Windows Hello) mais uma chave dividida com Shamir — a chave privada nunca existe inteira em um só lugar e não há frase-semente para anotar.",
    "O SDK roda todo o ciclo de vida no lado do cliente: registro do passkey, derivação de chaves, deploy da carteira, streaming de saldo e atividade por SSE, transferências, swaps e recuperação por OTP de e-mail. O Cognito sustenta a camada de conta e a rede padrão é a Stellar testnet.",
    "A Pollar envolve a Accesly como um wallet adapter: veja a aba Setup para registrar o adaptador da Accesly e assinar transações da Pollar com uma smart account da Accesly.",
  ],
  featuresTitle: "O que oferece",
  features: [
    {
      title: "Protegida por passkeys",
      desc: "Passkeys WebAuthn autorizam cada assinatura — sem frase-semente nem chave privada em texto puro num servidor.",
    },
    {
      title: "Frações de chave MPC",
      desc: "A chave de assinatura é dividida 2 de 3 com Shamir entre dispositivo, backend e recuperação.",
    },
    {
      title: "Smart accounts de Soroban",
      desc: "Cada usuário recebe uma smart account com regras de gasto por ativo na blockchain.",
    },
    {
      title: "Recuperação integrada",
      desc: "Um OTP de e-mail mais uma senha rotaciona o signatário para um novo dispositivo.",
    },
  ],
  resourcesTitle: "Recursos oficiais",
  reactPkgLabel: "@accesly/react no npm",
  corePkgLabel: "@accesly/core no npm",
  disclaimer:
    "Resumo baseado nos pacotes públicos @accesly/react e @accesly/core. A Pollar não é afiliada à Accesly — todo o crédito à equipe deles.",
};

export const acceslyAboutDict: Record<Locale, AboutSection> = { en, es, pt };
