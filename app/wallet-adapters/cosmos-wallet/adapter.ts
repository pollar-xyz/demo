// ─── Cosmos Wallet (browser extension) as a Pollar WalletAdapter ─────────────
//
// Cosmos Wallet (https://github.com/CosmosPay/CosmosPay-Wallet) is a
// non-custodial Stellar wallet extension. Its content script injects a
// SEP-43-style provider at `window.cosmosWallet`, so it plugs into Pollar the
// same way Freighter does: Pollar wraps the generic SEP-10 login + tx signing
// around `connect()` and `signTransaction()`.
//
// NOTE: this is a DIFFERENT product from the "Cosmos Pay" adapter under
// app/adapters/cosmos-pay — that one is the SEP-7 payments SDK
// (@cosmosapp/pay_sdk) wired in as a transaction-building adapter. This is the
// wallet extension, wired in as a LOGIN method (`walletAdapters`).
//
// Provider surface we rely on (extension-src/inpage.js):
//   isConnected()               -> boolean  (origin approved, NOT "installed")
//   getAddress()                -> { address }
//   getNetwork()                -> { network, networkPassphrase, networkUrl }
//   signTransaction(xdr, opts)  -> { signedTxXdr, signerAddress }
//
// Deliberately NOT implemented:
//   • signAuthEntry      — the provider doesn't expose it, so no Soroban
//                          auth-entry signing with this wallet.
//   • signStellarMessage — the wallet signs the RAW utf8 message bytes
//                          (src/components/ApprovePopup.tsx), not the SEP-53
//                          digest SHA-256("Stellar Signed Message:\n" || msg)
//                          that Pollar verifies. Implementing it would produce
//                          ownership proofs the backend rejects. Leaving it out
//                          makes Pollar treat the wallet like Albedo (no
//                          message signing), which is correct.
//
// UPSTREAM WORKAROUNDS. The provider never rejects on its own: a request that
// loses its reply stays pending forever (extension-src/inpage.js has no
// timeout, and neither does Pollar's login flow), so a dropped reply means a
// login stuck on `signing_wallet_challenge` with no way out. Two guards below
// exist purely for that — see `keepWorkerAlive` and `withTimeout`. Remove them
// once the extension resolves its own requests reliably.

import type {
  ConnectWalletResponse,
  SignTransactionOptions,
  SignTransactionResponse,
  WalletAdapter,
} from "@pollar/core";

export type StellarNetwork = "testnet" | "mainnet";

// The login id: `login({ provider: COSMOS_WALLET_ID })` and the key the login
// modal renders its button under.
export const COSMOS_WALLET_ID = "cosmos-wallet";

const NETWORK_PASSPHRASE: Record<StellarNetwork, string> = {
  testnet: "Test SDF Network ; September 2015",
  mainnet: "Public Global Stellar Network ; September 2015",
};

// ─── provider ────────────────────────────────────────────────────────────────

type CosmosWalletProvider = {
  isCosmosWallet: true;
  id: string;
  name: string;
  isConnected(): Promise<boolean>;
  getAddress(): Promise<{ address: string }>;
  getNetwork(): Promise<{
    network: string;
    networkPassphrase: string;
    networkUrl: string;
  }>;
  signTransaction(
    xdr: string,
    opts?: { networkPassphrase?: string; address?: string },
  ): Promise<{ signedTxXdr: string; signerAddress: string }>;
  signMessage(
    message: string,
    opts?: { networkPassphrase?: string; address?: string },
  ): Promise<{ signedMessage: string; signerAddress: string }>;
  requestPayment(uri: string): Promise<{ hash: string; signerAddress: string }>;
};

// Deadline for any call that can open the extension's approval window. Generous
// on purpose — the user may be typing a password — but finite, because the
// provider itself never rejects.
const APPROVAL_TIMEOUT_MS = 5 * 60_000;

// Keepalive cadence. Chrome terminates an idle MV3 service worker after ~30s,
// so anything comfortably under that works.
const KEEPALIVE_MS = 15_000;

function withTimeout<T>(
  promise: Promise<T>,
  ms: number,
  message: string,
): Promise<T> {
  let timer: ReturnType<typeof setTimeout> | undefined;
  return Promise.race([
    promise.finally(() => clearTimeout(timer)),
    new Promise<never>((_, reject) => {
      timer = setTimeout(() => reject(new Error(message)), ms);
    }),
  ]);
}

// While an approval window is open, ping the extension so its service worker
// stays awake.
//
// Cosmos Wallet's worker holds the reply port for a pending approval in a plain
// in-memory Map (extension-src/sw.js). Chrome kills the worker after ~30s
// without events, and the Map goes with it — the approval result then finds no
// route back and is dropped in silence (sw.js has no `else` for the missing
// entry), leaving `signTransaction` pending forever. Typing a password takes
// longer than 30s often enough that this is the common failure, not the rare
// one.
//
// `getNetwork()` is the right ping: read-only, answered from chrome.storage,
// opens no UI, and every message over the port resets the worker's idle timer.
function keepWorkerAlive(wallet: CosmosWalletProvider): () => void {
  const timer = setInterval(() => {
    void wallet.getNetwork().catch(() => {});
  }, KEEPALIVE_MS);
  return () => clearInterval(timer);
}

export function getCosmosWallet(): CosmosWalletProvider | null {
  if (typeof window === "undefined") return null;
  const injected = (window as unknown as Record<string, unknown>).cosmosWallet;
  return (injected as CosmosWalletProvider | undefined) ?? null;
}

// The content script injects inpage.js at document_start, but a React tree can
// still mount before it lands. Wait for the provider's own ready event (with a
// short deadline) so the first `isAvailable()` doesn't false-negative into
// Pollar's `wallet_not_installed` state.
export function waitForCosmosWallet(
  timeoutMs = 1000,
): Promise<CosmosWalletProvider | null> {
  const present = getCosmosWallet();
  if (present || typeof window === "undefined") {
    return Promise.resolve(present);
  }
  return new Promise((resolve) => {
    let settled = false;
    const done = () => {
      if (settled) return;
      settled = true;
      window.removeEventListener("cosmosWallet#initialized", done);
      clearTimeout(timer);
      resolve(getCosmosWallet());
    };
    const timer = setTimeout(done, timeoutMs);
    window.addEventListener("cosmosWallet#initialized", done);
  });
}

// ─── adapter ─────────────────────────────────────────────────────────────────

export class CosmosWalletAdapter implements WalletAdapter {
  readonly type = COSMOS_WALLET_ID;
  readonly meta = { label: "Cosmos Wallet", iconUrl: "/cosmos.png" };
  readonly custody = "external" as const;

  // The network the Pollar session runs on (derived from the API key prefix).
  // Used only to warn when the extension is showing another network — never to
  // block, see `warnOnNetworkMismatch`.
  constructor(private readonly network: StellarNetwork) {}

  // "Installed", not "approved". `cosmosWallet.isConnected()` means the current
  // origin is already approved, which is false before the first login — using
  // it here would send Pollar straight to `wallet_not_installed`.
  async isAvailable(): Promise<boolean> {
    return (await waitForCosmosWallet()) !== null;
  }

  async connect(): Promise<ConnectWalletResponse> {
    const wallet = this.require();
    // Fire-and-forget: never gates the login. It also warms the service worker
    // right before the approval window opens.
    this.warnOnNetworkMismatch(wallet);
    // Opens the extension's approval window the first time this origin asks;
    // afterwards it resolves straight from the approved-origins list.
    const { address } = await this.approval(wallet, "connection", () =>
      wallet.getAddress(),
    );
    if (!address) {
      throw new Error("Cosmos Wallet returned no address");
    }
    return { address };
  }

  async disconnect(): Promise<void> {
    // Cosmos Wallet exposes no programmatic disconnect (same as Freighter);
    // the user revokes the origin from the extension itself.
  }

  // Non-prompting: only report an address when this origin is already approved,
  // so session restore never pops the approval window.
  async getPublicKey(): Promise<string | null> {
    const wallet = getCosmosWallet();
    if (!wallet) return null;
    try {
      if (!(await wallet.isConnected())) return null;
      const { address } = await wallet.getAddress();
      return address ?? null;
    } catch {
      return null;
    }
  }

  async signTransaction(
    xdr: string,
    options?: SignTransactionOptions,
  ): Promise<SignTransactionResponse> {
    const wallet = this.require();
    // Map Pollar's `{ networkPassphrase, accountToSign }` onto the provider's
    // `{ networkPassphrase, address }`, omitting undefined keys.
    const opts: { networkPassphrase?: string; address?: string } = {};
    if (options?.networkPassphrase) {
      opts.networkPassphrase = options.networkPassphrase;
    }
    if (options?.accountToSign) opts.address = options.accountToSign;

    const { signedTxXdr } = await this.approval(wallet, "signature", () =>
      wallet.signTransaction(xdr, opts),
    );
    if (!signedTxXdr) {
      throw new Error("Cosmos Wallet returned no signed transaction");
    }
    return { signedTxXdr };
  }

  // ── internals ──────────────────────────────────────────────────────────────

  private require(): CosmosWalletProvider {
    const wallet = getCosmosWallet();
    if (!wallet) {
      throw new Error("Cosmos Wallet is not installed");
    }
    return wallet;
  }

  // Runs a call that can open the approval window, under both upstream
  // workarounds: the worker is kept awake for as long as the window is open,
  // and the wait is bounded so a dropped reply surfaces as a retryable error
  // instead of a login that hangs forever.
  private async approval<T>(
    wallet: CosmosWalletProvider,
    label: string,
    run: () => Promise<T>,
  ): Promise<T> {
    const stopKeepalive = keepWorkerAlive(wallet);
    try {
      return await withTimeout(
        run(),
        APPROVAL_TIMEOUT_MS,
        `Cosmos Wallet never answered the ${label} request. ` +
          `Reopen the extension and try again.`,
      );
    } finally {
      stopKeepalive();
    }
  }

  // The extension keeps its own network setting, but it is NOT authoritative
  // for anything Pollar does, so a mismatch must not block the login:
  //
  //   • Pollar passes its own passphrase down to every signature
  //     (`signTransaction(xdr, { networkPassphrase })`), and the wallet honours
  //     it over its own config — ApprovePopup.tsx picks
  //     `req.params.networkPassphrase` when present. The challenge is therefore
  //     always signed for OUR network.
  //   • A Stellar keypair is the same account on both networks, so the address
  //     SEP-10 authenticates is correct either way.
  //
  // Blocking here was also self-defeating: `getNetwork()` is answered from a
  // mirror in chrome.storage.local that ONLY the approval window writes
  // (ApprovePopup.tsx is the single writer in the whole extension), so it goes
  // stale the moment the user switches networks in the wallet UI — and a fresh
  // profile with no mirror at all reports TESTNET by default. Refusing to
  // connect kept the approval window that would refresh the mirror from ever
  // opening, so the stale value could never heal.
  //
  // What a mismatch does mean is that the balances the user sees INSIDE the
  // extension belong to the other network. That is worth a warning, not a stop.
  private warnOnNetworkMismatch(wallet: CosmosWalletProvider): void {
    const expected = NETWORK_PASSPHRASE[this.network];
    void wallet
      .getNetwork()
      .then(({ networkPassphrase }) => {
        if (!networkPassphrase || networkPassphrase === expected) return;
        console.warn(
          `[cosmos-wallet] The extension reports a different network than this ` +
            `app (${this.network}). Login still works — Pollar signs with its ` +
            `own passphrase — but balances shown inside the extension belong ` +
            `to the other network.`,
        );
      })
      .catch(() => {
        // Diagnostic only; never let it affect the login.
      });
  }
}

// Built per network by the caller (see _AppWalletProvider), since the network
// is only known once the API key resolves.
export function createCosmosWalletAdapter(
  network: StellarNetwork,
): CosmosWalletAdapter {
  return new CosmosWalletAdapter(network);
}
