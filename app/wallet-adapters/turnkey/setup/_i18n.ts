// Self-contained i18n for the Wallet Adapters → Turnkey → Setup tab.

import type { Locale } from "@/app/_i18n/translations";

type SetupStrings = {
  title: string;
  subtitle: string;
  intro: string;
  stepsTitle: string;
  steps: { title: string; desc: string }[];
  notesTitle: string;
  notes: string[];
};

const en: SetupStrings = {
  title: "Turnkey adapter setup",
  subtitle:
    "Connect Turnkey email / Google authentication and an embedded Stellar signer to Pollar.",
  intro:
    "This adapter uses `@turnkey/react-wallet-kit` as its browser runtime. Configure Turnkey first, pass the two public identifiers to `createTurnkeyAdapter`, then give that same instance to `<TurnkeyWalletProvider adapter>` and Pollar's `walletAdapters`.",
  stepsTitle: "Before you run it",
  steps: [
    {
      title: "Configure the Auth Proxy",
      desc: "In Turnkey, enable email OTP and/or Google OAuth. If you use Pollar's current OTP input, configure numeric email codes.",
    },
    {
      title: "Allow the application origin",
      desc: "Add your local and deployed origins to the Turnkey configuration so OAuth can return to the application.",
    },
    {
      title: "Register the interactive adapter",
      desc: "Create the adapter once at module level. Pass that same instance to `<TurnkeyWalletProvider adapter>` and include it in Pollar's `walletAdapters`.",
    },
    {
      title: "Request testnet funds separately",
      desc: "Turnkey creates the Ed25519 signer, but it does not fund or activate the Stellar testnet account.",
    },
  ],
  notesTitle: "Signing notes",
  notes: [
    "The account must use `ADDRESS_FORMAT_XLM` and `CURVE_ED25519`.",
    "For Stellar, parse the XDR with its network passphrase and sign `transaction.hash()` using `signRawPayload`.",
    "Use `HASH_FUNCTION_NOT_APPLICABLE`: Stellar already produced the 32-byte hash, so Turnkey must not hash it again.",
    "Convert Turnkey's `r + s` hexadecimal result into 64 bytes, add it to the transaction, and return the signed XDR.",
    "Never expose or print private keys. The browser sends only authorized signing requests to Turnkey.",
  ],
};

const es: SetupStrings = {
  title: "Setup del adaptador Turnkey",
  subtitle:
    "Conecta la autenticación con email / Google de Turnkey y un firmante Stellar embebido a Pollar.",
  intro:
    "Este adaptador usa `@turnkey/react-wallet-kit` como runtime del navegador. Primero configurá Turnkey, pasá los dos identificadores públicos a `createTurnkeyAdapter` y luego entregá esa misma instancia a `<TurnkeyWalletProvider adapter>` y a los `walletAdapters` de Pollar.",
  stepsTitle: "Antes de ejecutarlo",
  steps: [
    {
      title: "Configurá el Auth Proxy",
      desc: "En Turnkey, habilitá OTP por email y/o Google OAuth. Si usás el input OTP actual de Pollar, configurá códigos numéricos.",
    },
    {
      title: "Permití el origen de la aplicación",
      desc: "Agregá tus orígenes locales y de producción a Turnkey para que OAuth pueda volver a la aplicación.",
    },
    {
      title: "Registrá el adaptador interactivo",
      desc: "Creá el adapter una sola vez a nivel de módulo. Pasá esa misma instancia a `<TurnkeyWalletProvider adapter>` e incluila en los `walletAdapters` de Pollar.",
    },
    {
      title: "Solicitá fondos de testnet aparte",
      desc: "Turnkey crea el firmante Ed25519, pero no fondea ni activa la cuenta de Stellar testnet.",
    },
  ],
  notesTitle: "Notas sobre la firma",
  notes: [
    "La cuenta debe usar `ADDRESS_FORMAT_XLM` y `CURVE_ED25519`.",
    "Para Stellar, parseá el XDR con su network passphrase y firmá `transaction.hash()` usando `signRawPayload`.",
    "Usá `HASH_FUNCTION_NOT_APPLICABLE`: Stellar ya produjo el hash de 32 bytes, así que Turnkey no debe hashearlo otra vez.",
    "Convertí el resultado hexadecimal `r + s` de Turnkey en 64 bytes, agregalo a la transacción y devolvé el XDR firmado.",
    "Nunca expongas ni imprimas llaves privadas. El navegador solo envía solicitudes de firma autorizadas a Turnkey.",
  ],
};

const pt: SetupStrings = {
  title: "Setup do adaptador Turnkey",
  subtitle:
    "Conecte a autenticação por e-mail / Google da Turnkey e um assinante Stellar embutido à Pollar.",
  intro:
    "Este adaptador usa `@turnkey/react-wallet-kit` como runtime do navegador. Primeiro configure a Turnkey, passe os dois identificadores públicos para `createTurnkeyAdapter` e depois entregue essa mesma instância a `<TurnkeyWalletProvider adapter>` e aos `walletAdapters` da Pollar.",
  stepsTitle: "Antes de executar",
  steps: [
    {
      title: "Configure o Auth Proxy",
      desc: "Na Turnkey, habilite OTP por e-mail e/ou Google OAuth. Se usar o input OTP atual da Pollar, configure códigos numéricos.",
    },
    {
      title: "Permita a origem do aplicativo",
      desc: "Adicione suas origens locais e de produção à Turnkey para que o OAuth possa retornar ao aplicativo.",
    },
    {
      title: "Registre o adaptador interativo",
      desc: "Crie o adapter uma vez no nível do módulo. Passe essa mesma instância para `<TurnkeyWalletProvider adapter>` e inclua-a nos `walletAdapters` da Pollar.",
    },
    {
      title: "Solicite fundos de testnet separadamente",
      desc: "A Turnkey cria o assinante Ed25519, mas não financia nem ativa a conta da Stellar testnet.",
    },
  ],
  notesTitle: "Notas sobre assinatura",
  notes: [
    "A conta deve usar `ADDRESS_FORMAT_XLM` e `CURVE_ED25519`.",
    "Para Stellar, interprete o XDR com sua network passphrase e assine `transaction.hash()` usando `signRawPayload`.",
    "Use `HASH_FUNCTION_NOT_APPLICABLE`: a Stellar já produziu o hash de 32 bytes, então a Turnkey não deve aplicar outro hash.",
    "Converta o resultado hexadecimal `r + s` da Turnkey em 64 bytes, adicione-o à transação e retorne o XDR assinado.",
    "Nunca exponha ou imprima chaves privadas. O navegador envia somente solicitações de assinatura autorizadas à Turnkey.",
  ],
};

export const turnkeySetupDict: Record<Locale, SetupStrings> = { en, es, pt };
