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
  // The extension keeps its OWN network setting, so we compare the two on
  // connect and fail with a readable message instead of letting SEP-10 blow up
  // on a challenge signed against the wrong passphrase.
  constructor(private readonly network: StellarNetwork) {}

  // "Installed", not "approved". `cosmosWallet.isConnected()` means the current
  // origin is already approved, which is false before the first login — using
  // it here would send Pollar straight to `wallet_not_installed`.
  async isAvailable(): Promise<boolean> {
    return (await waitForCosmosWallet()) !== null;
  }

  async connect(): Promise<ConnectWalletResponse> {
    const wallet = this.require();
    await this.assertNetwork(wallet);
    // Opens the extension's approval window the first time this origin asks;
    // afterwards it resolves straight from the approved-origins list.
    const { address } = await wallet.getAddress();
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

    const { signedTxXdr } = await wallet.signTransaction(xdr, opts);
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

  private async assertNetwork(wallet: CosmosWalletProvider): Promise<void> {
    const expected = NETWORK_PASSPHRASE[this.network];
    let actual: string;
    try {
      ({ networkPassphrase: actual } = await wallet.getNetwork());
    } catch {
      // The wallet wouldn't report its network — let the login proceed rather
      // than blocking on a diagnostic call.
      return;
    }
    if (actual && actual !== expected) {
      throw new Error(
        `Cosmos Wallet is on a different network than this app (${this.network}). ` +
          `Switch the network inside the extension and try again.`,
      );
    }
  }
}

// Built per network by the caller (see _AppWalletProvider), since the network
// is only known once the API key resolves.
export function createCosmosWalletAdapter(
  network: StellarNetwork,
): CosmosWalletAdapter {
  return new CosmosWalletAdapter(network);
}
