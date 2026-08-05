// Self-contained i18n for the Wallet Adapters → Cosmos Wallet → Test tab.

import type { Locale } from "@/app/_i18n/translations";

type CwTestStrings = {
  title: string;
  subtitle: string;
  installTitle: string;
  installSteps: string[];
  providerTitle: string;
  providerDesc: string;
  detected: string;
  notDetected: string;
  recheck: string;
  pollarTitle: string;
  pollarDesc: string;
  loginBtn: string;
  logoutBtn: string;
  authState: string;
  address: string;
  provider: string;
  verified: string;
  network: string;
  appNetwork: string;
  notLoggedIn: string;
  resultTitle: string;
  empty: string;
  warnTitle: string;
  warns: string[];
};

const en: CwTestStrings = {
  title: "Test Cosmos Wallet",
  subtitle:
    "Probe the raw window.cosmosWallet provider, then run the real Pollar SEP-10 login through the adapter.",
  installTitle: "Before you start",
  installSteps: [
    "Clone github.com/CosmosPay/CosmosPay-Wallet and build the extension.",
    "Load it unpacked in Chrome: open chrome://extensions, turn on Developer mode, click Load unpacked.",
    "Create or import a wallet in the extension. Matching its network to the toggle in this demo's navbar is optional — it only changes what the extension itself displays.",
    "Reload this page so the content script injects the provider.",
  ],
  providerTitle: "1. Raw provider",
  providerDesc:
    "These call window.cosmosWallet directly, with no Pollar involved. getAddress() opens the extension's approval window the first time this origin asks.",
  detected: "window.cosmosWallet detected",
  notDetected: "window.cosmosWallet not found",
  recheck: "Re-check",
  pollarTitle: "2. Login through Pollar",
  pollarDesc:
    "Runs login({ provider: 'cosmos-wallet' }): the adapter connects, Pollar requests a SEP-10 challenge, the wallet counter-signs it and the session is minted. Expect two approval windows the first time.",
  loginBtn: "Log in with Cosmos Wallet",
  logoutBtn: "Log out",
  authState: "Auth state",
  address: "Address",
  provider: "Provider",
  verified: "Verified",
  network: "Wallet network",
  appNetwork: "App network",
  notLoggedIn: "Not logged in",
  resultTitle: "Result",
  empty: "Nothing yet. Run a call above.",
  warnTitle: "Known limits of this wallet",
  warns: [
    "No signAuthEntry: Soroban auth-entry signing is unavailable.",
    "No SEP-53 message signing: the wallet signs raw bytes, so ownership proofs are not wired up.",
    "The extension's network is its own setting. The login works either way — Pollar signs with its own passphrase — but the balances shown inside the extension follow the extension's network.",
    "The provider never rejects on its own: a request whose reply is lost stays pending forever. The adapter bounds every approval and pings the extension to keep its service worker awake.",
  ],
};

const es: CwTestStrings = {
  title: "Probar Cosmos Wallet",
  subtitle:
    "Probá el proveedor crudo window.cosmosWallet y luego corré el login SEP-10 real de Pollar a través del adaptador.",
  installTitle: "Antes de empezar",
  installSteps: [
    "Cloná github.com/CosmosPay/CosmosPay-Wallet y compilá la extensión.",
    "Cargala sin empaquetar en Chrome: abrí chrome://extensions, activá Modo desarrollador, tocá Cargar descomprimida.",
    "Creá o importá una wallet en la extensión. Poner su red igual que el toggle de la navbar de este demo es opcional: solo cambia lo que muestra la extensión.",
    "Recargá esta página para que el content script inyecte el proveedor.",
  ],
  providerTitle: "1. Proveedor crudo",
  providerDesc:
    "Estos llaman a window.cosmosWallet directo, sin Pollar en el medio. getAddress() abre la ventana de aprobación de la extensión la primera vez que este origin la pide.",
  detected: "window.cosmosWallet detectado",
  notDetected: "window.cosmosWallet no encontrado",
  recheck: "Volver a chequear",
  pollarTitle: "2. Login a través de Pollar",
  pollarDesc:
    "Corre login({ provider: 'cosmos-wallet' }): el adaptador conecta, Pollar pide un challenge SEP-10, la wallet lo contrafirma y se emite la sesión. Esperá dos ventanas de aprobación la primera vez.",
  loginBtn: "Entrar con Cosmos Wallet",
  logoutBtn: "Salir",
  authState: "Estado de auth",
  address: "Dirección",
  provider: "Proveedor",
  verified: "Verificada",
  network: "Red de la wallet",
  appNetwork: "Red de la app",
  notLoggedIn: "Sin sesión",
  resultTitle: "Resultado",
  empty: "Nada todavía. Corré una llamada arriba.",
  warnTitle: "Límites conocidos de esta wallet",
  warns: [
    "Sin signAuthEntry: no hay firma de auth entries de Soroban.",
    "Sin firma de mensajes SEP-53: la wallet firma bytes crudos, así que las pruebas de propiedad no están conectadas.",
    "La red de la extensión es su propia configuración. El login funciona igual — Pollar firma con su propio passphrase — pero los balances que se ven dentro de la extensión siguen la red de la extensión.",
    "El proveedor nunca rechaza por su cuenta: una request que pierde su respuesta queda pendiente para siempre. El adaptador acota cada aprobación y pinguea a la extensión para mantener despierto su service worker.",
  ],
};

const pt: CwTestStrings = {
  title: "Testar a Cosmos Wallet",
  subtitle:
    "Teste o provedor cru window.cosmosWallet e depois rode o login SEP-10 real da Pollar pelo adaptador.",
  installTitle: "Antes de começar",
  installSteps: [
    "Clone github.com/CosmosPay/CosmosPay-Wallet e compile a extensão.",
    "Carregue sem empacotar no Chrome: abra chrome://extensions, ligue o Modo desenvolvedor, clique em Carregar sem compactação.",
    "Crie ou importe uma carteira na extensão. Ajustar a rede dela para bater com o toggle da navbar deste demo é opcional: só muda o que a própria extensão exibe.",
    "Recarregue esta página para o content script injetar o provedor.",
  ],
  providerTitle: "1. Provedor cru",
  providerDesc:
    "Estes chamam window.cosmosWallet direto, sem a Pollar no meio. getAddress() abre a janela de aprovação da extensão na primeira vez que este origin pede.",
  detected: "window.cosmosWallet detectado",
  notDetected: "window.cosmosWallet não encontrado",
  recheck: "Verificar de novo",
  pollarTitle: "2. Login pela Pollar",
  pollarDesc:
    "Roda login({ provider: 'cosmos-wallet' }): o adaptador conecta, a Pollar pede um challenge SEP-10, a carteira contra-assina e a sessão é emitida. Espere duas janelas de aprovação na primeira vez.",
  loginBtn: "Entrar com a Cosmos Wallet",
  logoutBtn: "Sair",
  authState: "Estado de auth",
  address: "Endereço",
  provider: "Provedor",
  verified: "Verificada",
  network: "Rede da carteira",
  appNetwork: "Rede do app",
  notLoggedIn: "Sem sessão",
  resultTitle: "Resultado",
  empty: "Nada ainda. Rode uma chamada acima.",
  warnTitle: "Limites conhecidos desta carteira",
  warns: [
    "Sem signAuthEntry: não há assinatura de auth entries do Soroban.",
    "Sem assinatura de mensagens SEP-53: a carteira assina bytes crus, então as provas de posse não estão ligadas.",
    "A rede da extensão é configuração própria dela. O login funciona de qualquer jeito — a Pollar assina com a própria passphrase — mas os saldos exibidos dentro da extensão seguem a rede da extensão.",
    "O provedor nunca rejeita por conta própria: uma request que perde a resposta fica pendente para sempre. O adaptador limita cada aprovação e faz ping na extensão para manter o service worker acordado.",
  ],
};

export const cosmosWalletTestDict: Record<Locale, CwTestStrings> = {
  en,
  es,
  pt,
};
