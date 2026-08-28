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
    "Connect Turnkey email OTP and an embedded Stellar signer to Pollar using Core only.",
  intro:
    "Create the adapter with `@turnkey/core` and register it in Pollar's `walletAdapters`. The same instance owns email OTP, session storage, wallet access and Stellar signing; no Turnkey React provider or runtime bridge is required.",
  stepsTitle: "Before you run it",
  steps: [
    {
      title: "Configure the Auth Proxy",
      desc: "In Turnkey, enable email OTP. If you use Pollar's current OTP input, configure numeric email codes.",
    },
    {
      title: "Allow the application origin",
      desc: "Add your local and deployed origins to the Turnkey Auth Proxy configuration.",
    },
    {
      title: "Register the interactive adapter",
      desc: "Create the Core-backed adapter once at module level and include that instance directly in Pollar's `walletAdapters`.",
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
    "Conecta el OTP por email de Turnkey y un firmante Stellar embebido a Pollar usando únicamente Core.",
  intro:
    "Creá el adapter con `@turnkey/core` y registralo en los `walletAdapters` de Pollar. La misma instancia controla el OTP por email, la sesión, las wallets y la firma Stellar; no necesita un provider React de Turnkey ni un runtime bridge.",
  stepsTitle: "Antes de ejecutarlo",
  steps: [
    {
      title: "Configurá el Auth Proxy",
      desc: "En Turnkey, habilitá OTP por email. Si usás el input OTP actual de Pollar, configurá códigos numéricos.",
    },
    {
      title: "Permití el origen de la aplicación",
      desc: "Agregá tus orígenes locales y de producción a la configuración del Auth Proxy de Turnkey.",
    },
    {
      title: "Registrá el adaptador interactivo",
      desc: "Creá una sola vez el adapter basado en Core a nivel de módulo e incluí esa instancia directamente en los `walletAdapters` de Pollar.",
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
    "Conecte o OTP por e-mail da Turnkey e um assinante Stellar embutido à Pollar usando somente Core.",
  intro:
    "Crie o adapter com `@turnkey/core` e registre-o nos `walletAdapters` da Pollar. A mesma instância controla o OTP por e-mail, a sessão, as carteiras e a assinatura Stellar; nenhum provider React da Turnkey ou runtime bridge é necessário.",
  stepsTitle: "Antes de executar",
  steps: [
    {
      title: "Configure o Auth Proxy",
      desc: "Na Turnkey, habilite OTP por e-mail. Se usar o input OTP atual da Pollar, configure códigos numéricos.",
    },
    {
      title: "Permita a origem do aplicativo",
      desc: "Adicione suas origens locais e de produção à configuração do Auth Proxy da Turnkey.",
    },
    {
      title: "Registre o adaptador interativo",
      desc: "Crie uma única vez o adapter baseado em Core no nível do módulo e inclua essa instância diretamente nos `walletAdapters` da Pollar.",
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
