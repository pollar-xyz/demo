// Self-contained i18n for the Wallet Adapters → Privy → Setup tab. Kept local
// (keyed by locale) instead of merged into the global Dictionary, since this
// tab is a standalone doc page.

import type { Locale } from "@/app/_i18n/translations";

type WaStrings = {
  title: string;
  subtitle: string;
  // per-SDK descriptions (the toggle switches these + the code panel)
  coreDesc: string;
  reactDesc: string;
  // notes
  notesTitle: string;
  notes: string[];
};

const en: WaStrings = {
  title: "Privy adapter",
  subtitle:
    "Add email / Google login backed by a Privy embedded Stellar wallet as a Pollar wallet adapter.",
  coreDesc:
    "With `@pollar/core`, create the adapter with `createPrivyAdapter({ appId, loginMethods })` and register it on a plain `PollarClient`, then trigger it with `login({ provider: 'privy' })`. The adapter API is framework-agnostic, but Privy itself still needs the React bridge below to run.",
  reactDesc:
    "With `@pollar/react`, mount `<PrivyAdapterProvider>` above `<PollarProvider>` — it wires Privy's hooks into the adapter — and register the same adapter in `walletAdapters`. Pollar's login modal then renders Privy's email/Google sub-modal.",
  notesTitle: "Notes",
  notes: [
    "Privy is React / React Native only — the adapter is inert until `<PrivyAdapterProvider>` (web) or the Expo provider (RN) mounts. There is no headless `@pollar/core` host for it.",
    "`loginMethods` is a narrow subset Pollar drives: `email`, `google`, `github`.",
    "The embedded Stellar wallet is created automatically on first login — no separate create-wallet step.",
    "Use the SAME adapter instance for `<PrivyAdapterProvider adapter>` and the client's `walletAdapters`.",
  ],
};

const es: WaStrings = {
  title: "Adaptador de Privy",
  subtitle:
    "Agrega login con email / Google respaldado por una billetera Stellar embebida de Privy como wallet adapter de Pollar.",
  coreDesc:
    "Con `@pollar/core`, creá el adaptador con `createPrivyAdapter({ appId, loginMethods })` y registralo en un `PollarClient` plano, luego disparalo con `login({ provider: 'privy' })`. La API del adaptador es agnóstica al framework, pero Privy igual necesita el bridge de React de abajo para funcionar.",
  reactDesc:
    "Con `@pollar/react`, montá `<PrivyAdapterProvider>` arriba de `<PollarProvider>` — conecta los hooks de Privy al adaptador — y registrá el mismo adaptador en `walletAdapters`. El modal de login de Pollar renderiza el sub-modal de email/Google de Privy.",
  notesTitle: "Notas",
  notes: [
    "Privy es solo React / React Native — el adaptador está inerte hasta que monta `<PrivyAdapterProvider>` (web) o el provider de Expo (RN). No hay un host headless de `@pollar/core` para él.",
    "`loginMethods` es un subconjunto acotado que Pollar maneja: `email`, `google`, `github`.",
    "La billetera Stellar embebida se crea automáticamente en el primer login — sin un paso aparte de crear wallet.",
    "Usá la MISMA instancia del adaptador para `<PrivyAdapterProvider adapter>` y los `walletAdapters` del cliente.",
  ],
};

const pt: WaStrings = {
  title: "Adaptador da Privy",
  subtitle:
    "Adicione login com e-mail / Google com uma carteira Stellar embutida da Privy como wallet adapter da Pollar.",
  coreDesc:
    "Com `@pollar/core`, crie o adaptador com `createPrivyAdapter({ appId, loginMethods })` e registre-o em um `PollarClient` puro, depois dispare com `login({ provider: 'privy' })`. A API do adaptador é agnóstica de framework, mas a Privy ainda precisa do bridge de React abaixo para funcionar.",
  reactDesc:
    "Com `@pollar/react`, monte `<PrivyAdapterProvider>` acima de `<PollarProvider>` — ele conecta os hooks da Privy ao adaptador — e registre o mesmo adaptador em `walletAdapters`. O modal de login da Pollar então renderiza o sub-modal de e-mail/Google da Privy.",
  notesTitle: "Notas",
  notes: [
    "A Privy é apenas React / React Native — o adaptador fica inerte até `<PrivyAdapterProvider>` (web) ou o provider do Expo (RN) montar. Não há um host headless de `@pollar/core` para ela.",
    "`loginMethods` é um subconjunto restrito que a Pollar conduz: `email`, `google`, `github`.",
    "A carteira Stellar embutida é criada automaticamente no primeiro login — sem um passo separado de criar carteira.",
    "Use a MESMA instância do adaptador para `<PrivyAdapterProvider adapter>` e os `walletAdapters` do cliente.",
  ],
};

export const waDict: Record<Locale, WaStrings> = { en, es, pt };
