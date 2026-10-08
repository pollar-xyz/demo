// ─── "Demo device key" as a Pollar WalletAdapter (testnet only) ──────────────
//
// A hand-written adapter backed by an ed25519 key generated in the browser and
// kept in localStorage. It exists to exercise the sponsored signer rotation
// (app/pollar/signer-rotation): Freighter and the Stellar Wallets Kit wallets
// can only sign with their master key, so disabling it (masterWeight 0) would
// lock the user out of the account. This adapter can switch to the new key.
//
// After a rotation the account keeps its original G... address but a different
// key signs, so the store holds them apart:
//   • accountAddress — fixed, the address `connect()` / `getPublicKey()` return
//   • activeSecret   — the key that signs right now
//   • history        — the keys retired by earlier rotations, oldest first
//   • pending        — a key a rotation was built for but has not landed yet
//
// NOT for real funds: the secret sits in plain localStorage. That is why the
// adapter is only registered on testnet (see _AppWalletProvider).

import { Keypair, Networks, TransactionBuilder } from "@stellar/stellar-sdk";
import type {
  ConnectWalletResponse,
  SignTransactionOptions,
  SignTransactionResponse,
  WalletAdapter,
} from "@pollar/core";

// The login id: `login({ provider: DEMO_DEVICE_KEY_ID })` and the key the login
// modal renders its button under.
export const DEMO_DEVICE_KEY_ID = "demo-device-key";

const STORAGE_KEY = "pollar-demo-device-key";

export type DemoKey = {
  publicKey: string;
  secret: string;
  createdAt: string;
};

export type DemoKeyStore = {
  accountAddress: string;
  activeSecret: string;
  history: DemoKey[];
  pending?: DemoKey;
};

// ─── key store ───────────────────────────────────────────────────────────────

export function newDemoKey(): DemoKey {
  const kp = Keypair.random();
  return {
    publicKey: kp.publicKey(),
    secret: kp.secret(),
    createdAt: new Date().toISOString(),
  };
}

export function readKeyStore(): DemoKeyStore | null {
  if (typeof window === "undefined") return null;
  try {
    const raw = localStorage.getItem(STORAGE_KEY);
    return raw ? (JSON.parse(raw) as DemoKeyStore) : null;
  } catch {
    return null;
  }
}

function writeKeyStore(store: DemoKeyStore): void {
  localStorage.setItem(STORAGE_KEY, JSON.stringify(store));
}

// The account's first key is also its address (the master key).
function ensureKeyStore(): DemoKeyStore {
  const existing = readKeyStore();
  if (existing) return existing;
  const first = newDemoKey();
  const store: DemoKeyStore = {
    accountAddress: first.publicKey,
    activeSecret: first.secret,
    history: [],
  };
  writeKeyStore(store);
  return store;
}

export function activePublicKey(store: DemoKeyStore): string {
  return Keypair.fromSecret(store.activeSecret).publicKey();
}

// Saved BEFORE the rotation is built, so the new key survives a reload while
// the transaction is in flight.
export function setPendingKey(key: DemoKey): void {
  const store = ensureKeyStore();
  writeKeyStore({ ...store, pending: key });
}

// The rotation landed: the pending key signs from now on and the old one moves
// to the history.
export function promotePendingKey(): void {
  const store = readKeyStore();
  if (!store?.pending) return;
  const retired: DemoKey = {
    publicKey: activePublicKey(store),
    secret: store.activeSecret,
    createdAt: new Date().toISOString(),
  };
  writeKeyStore({
    accountAddress: store.accountAddress,
    activeSecret: store.pending.secret,
    history: [...store.history, retired],
  });
}

export function discardPendingKey(): void {
  const store = readKeyStore();
  if (!store?.pending) return;
  writeKeyStore({
    accountAddress: store.accountAddress,
    activeSecret: store.activeSecret,
    history: store.history,
  });
}

// ─── adapter ─────────────────────────────────────────────────────────────────

export class DemoDeviceKeyAdapter implements WalletAdapter {
  readonly type = DEMO_DEVICE_KEY_ID;
  readonly meta = { label: "Demo key" };
  readonly custody = "external" as const;

  // In-memory only, so a reload in the middle of the old-key login test can
  // never leave the persisted store signing with a retired key.
  private temporarySecret: string | null = null;

  async isAvailable(): Promise<boolean> {
    return true;
  }

  // Creates the key on the first login. Always the fixed account address, even
  // after a rotation changed the key that signs.
  async connect(): Promise<ConnectWalletResponse> {
    return { address: ensureKeyStore().accountAddress };
  }

  // Keeps the keys: logging out must not lose control of the account.
  async disconnect(): Promise<void> {}

  async getPublicKey(): Promise<string | null> {
    return readKeyStore()?.accountAddress ?? null;
  }

  async signTransaction(
    xdr: string,
    options?: SignTransactionOptions,
  ): Promise<SignTransactionResponse> {
    const store = readKeyStore();
    if (!store) throw new Error("Demo key: no key on this device");
    if (
      options?.accountToSign &&
      options.accountToSign !== store.accountAddress
    ) {
      throw new Error(
        `Demo key: asked to sign for ${options.accountToSign}, but this wallet is ${store.accountAddress}`,
      );
    }

    // Add a signature to the transaction as it arrived. Do not rebuild it: a
    // sponsored createAccount or rotation already carries the sponsor's
    // signature, and any change invalidates it.
    const tx = TransactionBuilder.fromXDR(
      xdr,
      options?.networkPassphrase ?? Networks.TESTNET,
    );
    tx.sign(Keypair.fromSecret(this.temporarySecret ?? store.activeSecret));
    return { signedTxXdr: tx.toXDR() };
  }

  // Signs with a retired key until `clearTemporaryKey()`, to show that a key
  // the rotation disabled can no longer log in.
  setTemporaryKey(secret: string): void {
    this.temporarySecret = secret;
  }

  clearTemporaryKey(): void {
    this.temporarySecret = null;
  }
}

// One instance for the whole app: registered in `walletAdapters` and used
// directly by the rotation page to sign the sponsor-signed XDR.
export const demoDeviceKeyAdapter = new DemoDeviceKeyAdapter();
