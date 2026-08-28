// "What is Turnkey" overview copy for the Wallet Adapters → Turnkey tab.

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
  title: "Turnkey",
  tagline:
    "Email OTP login with an embedded Stellar wallet and enclave-backed Ed25519 signing.",
  body: [
    "Turnkey is non-custodial wallet infrastructure. It creates embedded wallets and authorizes signing through familiar authentication without exposing raw private keys to the application.",
    "Pollar's interactive adapter uses Turnkey Core directly for email OTP authentication and session storage. It then creates or loads the user's Stellar account and completes a Stellar SEP-10 session.",
    "Stellar transactions remain standard XDR transactions. Pollar builds the transaction and Turnkey signs the exact Stellar transaction hash as a raw Ed25519 payload.",
  ],
  whyPollar: {
    title: "Why Pollar with Turnkey?",
    tagline:
      "Turnkey protects and authorizes the key. Pollar supplies the Stellar product layer around it.",
    points: [
      {
        title: "One authentication surface",
        desc: "Offer Turnkey alongside Privy, Freighter and other adapters through Pollar's existing login flow.",
      },
      {
        title: "Stellar-native sessions",
        desc: "The adapter turns the Turnkey Stellar address into a SEP-10 session by signing the server challenge XDR.",
      },
      {
        title: "No private-key plumbing",
        desc: "Raw private keys never enter the frontend; signing requests are authorized and handled by Turnkey.",
      },
      {
        title: "The rest of the wallet",
        desc: "Balances, assets, transfers, history and ramps continue through Pollar's existing Stellar flows.",
      },
    ],
    punch:
      "Turnkey secures the signer. Pollar makes it a Stellar wallet experience.",
  },
  featuresTitle: "What you get",
  features: [
    {
      title: "Email OTP login",
      desc: "Authenticate through Turnkey Core without a provider, browser extension or seed phrase.",
    },
    {
      title: "Embedded Stellar account",
      desc: "Create or load an Ed25519 account with a standard Stellar G address.",
    },
    {
      title: "Enclave-backed signing",
      desc: "Authorize signatures without exposing raw private-key material.",
    },
    {
      title: "Pollar-native SEP-10",
      desc: "Sign the Stellar challenge and continue through Pollar's existing session flow.",
    },
  ],
  resourcesTitle: "Official resources",
  docsLabel: "Turnkey React docs",
  siteLabel: "Turnkey embedded wallets",
  disclaimer:
    "Summary based on Turnkey's public documentation and SDK. Pollar is not affiliated with Turnkey.",
};

const es: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Turnkey",
  tagline:
    "Login con OTP por email, una billetera Stellar embebida y firmas Ed25519 protegidas por enclaves.",
  body: [
    "Turnkey es infraestructura no custodial para billeteras. Crea billeteras embebidas y autoriza firmas mediante métodos de autenticación conocidos, sin exponer las llaves privadas a la aplicación.",
    "El adaptador interactivo de Pollar usa Turnkey Core directamente para el OTP por email y el almacenamiento de la sesión. Luego crea o carga la cuenta Stellar del usuario y completa una sesión SEP-10.",
    "Las transacciones Stellar siguen siendo transacciones XDR estándar. Pollar construye la transacción y Turnkey firma exactamente su hash como un payload Ed25519 raw.",
  ],
  whyPollar: {
    title: "¿Por qué Pollar con Turnkey?",
    tagline:
      "Turnkey protege y autoriza la llave. Pollar aporta la capa de producto Stellar que la rodea.",
    points: [
      {
        title: "Una sola superficie de autenticación",
        desc: "Ofrecé Turnkey junto a Privy, Freighter y otros adaptadores mediante el flujo de login existente de Pollar.",
      },
      {
        title: "Sesiones nativas de Stellar",
        desc: "El adaptador convierte la dirección Stellar de Turnkey en una sesión SEP-10 firmando el challenge XDR del servidor.",
      },
      {
        title: "Sin manejar llaves privadas",
        desc: "Las llaves privadas nunca entran al frontend; Turnkey autoriza y procesa las solicitudes de firma.",
      },
      {
        title: "El resto de la billetera",
        desc: "Balances, activos, transferencias, historial y ramps continúan mediante los flujos Stellar existentes de Pollar.",
      },
    ],
    punch:
      "Turnkey protege al firmante. Pollar lo convierte en una experiencia de billetera Stellar.",
  },
  featuresTitle: "Qué obtenés",
  features: [
    {
      title: "Login con OTP por email",
      desc: "Autenticación mediante Turnkey Core sin provider, extensión del navegador ni frase semilla.",
    },
    {
      title: "Cuenta Stellar embebida",
      desc: "Crea o carga una cuenta Ed25519 con una dirección G estándar de Stellar.",
    },
    {
      title: "Firmas protegidas por enclaves",
      desc: "Autoriza firmas sin exponer el material de la llave privada.",
    },
    {
      title: "SEP-10 nativo de Pollar",
      desc: "Firma el challenge de Stellar y continúa mediante el flujo de sesión existente de Pollar.",
    },
  ],
  resourcesTitle: "Recursos oficiales",
  docsLabel: "Docs de Turnkey para React",
  siteLabel: "Billeteras embebidas de Turnkey",
  disclaimer:
    "Resumen basado en la documentación pública y el SDK de Turnkey. Pollar no está afiliado a Turnkey.",
};

const pt: AboutSection = {
  eyebrow: "Wallet adapter",
  title: "Turnkey",
  tagline:
    "Login com OTP por e-mail, uma carteira Stellar embutida e assinaturas Ed25519 protegidas por enclaves.",
  body: [
    "A Turnkey é uma infraestrutura não custodial para carteiras. Ela cria carteiras embutidas e autoriza assinaturas por métodos de autenticação conhecidos, sem expor as chaves privadas ao aplicativo.",
    "O adaptador interativo da Pollar usa Turnkey Core diretamente para OTP por e-mail e armazenamento da sessão. Depois, cria ou carrega a conta Stellar do usuário e conclui uma sessão SEP-10.",
    "As transações Stellar continuam sendo transações XDR padrão. A Pollar constrói a transação e a Turnkey assina exatamente o hash dela como um payload Ed25519 raw.",
  ],
  whyPollar: {
    title: "Por que Pollar com Turnkey?",
    tagline:
      "A Turnkey protege e autoriza a chave. A Pollar fornece a camada de produto Stellar ao redor dela.",
    points: [
      {
        title: "Uma única superfície de autenticação",
        desc: "Ofereça Turnkey junto com Privy, Freighter e outros adaptadores pelo fluxo de login existente da Pollar.",
      },
      {
        title: "Sessões nativas da Stellar",
        desc: "O adaptador transforma o endereço Stellar da Turnkey em uma sessão SEP-10 ao assinar o challenge XDR do servidor.",
      },
      {
        title: "Sem gerenciar chaves privadas",
        desc: "As chaves privadas nunca entram no frontend; a Turnkey autoriza e processa as solicitações de assinatura.",
      },
      {
        title: "O restante da carteira",
        desc: "Saldos, ativos, transferências, histórico e ramps continuam pelos fluxos Stellar existentes da Pollar.",
      },
    ],
    punch:
      "A Turnkey protege o assinante. A Pollar transforma isso em uma experiência de carteira Stellar.",
  },
  featuresTitle: "O que você ganha",
  features: [
    {
      title: "Login com OTP por e-mail",
      desc: "Autenticação pelo Turnkey Core sem provider, extensão do navegador ou frase-semente.",
    },
    {
      title: "Conta Stellar embutida",
      desc: "Cria ou carrega uma conta Ed25519 com um endereço G padrão da Stellar.",
    },
    {
      title: "Assinatura protegida por enclaves",
      desc: "Autoriza assinaturas sem expor o material da chave privada.",
    },
    {
      title: "SEP-10 nativo da Pollar",
      desc: "Assina o challenge da Stellar e continua pelo fluxo de sessão existente da Pollar.",
    },
  ],
  resourcesTitle: "Recursos oficiais",
  docsLabel: "Docs da Turnkey para React",
  siteLabel: "Carteiras embutidas da Turnkey",
  disclaimer:
    "Resumo baseado na documentação pública e no SDK da Turnkey. A Pollar não é afiliada à Turnkey.",
};

export const turnkeyAboutDict: Record<Locale, AboutSection> = { en, es, pt };
