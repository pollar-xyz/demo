"use client";

import type {
  ConnectWalletResponse,
  InteractiveAuthAdapter,
  SignTransactionOptions,
  SignTransactionResponse,
} from "@pollar/core";
import {
  OtpType,
  TurnkeyProvider,
  type TurnkeyProviderConfig,
  type WalletAccount,
  useTurnkey,
} from "@turnkey/react-wallet-kit";
import {
  FeeBumpTransaction,
  type Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { useEffect, useRef } from "react";

type TurnkeyLoginMethod = "email" | "google";

export type TurnkeyAdapterConfig = {
  organizationId: string;
  authProxyConfigId: string;
  loginMethods?: TurnkeyLoginMethod[];
  walletName?: string;
  meta?: { label?: string };
};

export type TurnkeyAdapter = InteractiveAuthAdapter & {
  readonly __turnkeyAdapter: true;
};

type ResolvedConfig = TurnkeyAdapterConfig & {
  loginMethods: TurnkeyLoginMethod[];
  walletName: string;
};

function findStellarAccount(wallets: { accounts: WalletAccount[] }[]) {
  return wallets
    .flatMap((wallet) => wallet.accounts)
    .find(
      (account) =>
        account.addressFormat === "ADDRESS_FORMAT_XLM" &&
        account.curve === "CURVE_ED25519",
    );
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, "");
  return Uint8Array.from(
    clean.match(/.{2}/g)?.map((byte) => Number.parseInt(byte, 16)) ?? [],
  );
}

type TurnkeyRuntime = {
  sendEmailCode(email: string): Promise<void>;
  verifyEmailCode(code: string): Promise<void>;
  loginWithGoogle(): Promise<void>;
  connect(): Promise<string>;
  disconnect(): Promise<void>;
  account(): WalletAccount | undefined;
  sign(hash: string, address: string): Promise<Uint8Array>;
};

const configs = new WeakMap<TurnkeyAdapter, ResolvedConfig>();
const runtimes = new WeakMap<TurnkeyAdapter, TurnkeyRuntime>();

function getRuntime(adapter: TurnkeyAdapter): TurnkeyRuntime {
  const runtime = runtimes.get(adapter);
  if (!runtime) {
    throw new Error("[turnkey] TurnkeyProvider is not mounted.");
  }
  return runtime;
}

export function createTurnkeyAdapter(
  config: TurnkeyAdapterConfig,
): TurnkeyAdapter {
  if (!config.organizationId || !config.authProxyConfigId) {
    throw new Error(
      "[turnkey] organizationId and authProxyConfigId are required.",
    );
  }

  const resolvedConfig: ResolvedConfig = {
    ...config,
    loginMethods: config.loginMethods ?? ["email", "google"],
    walletName: config.walletName ?? "Pollar Wallet",
  };

  const adapter: TurnkeyAdapter = {
    __turnkeyAdapter: true,
    type: "turnkey",
    meta: { label: config.meta?.label ?? "Turnkey" },
    custody: "external",
    chain: "STELLAR",
    isAvailable: async () => true,
    getAuthOptions: () => resolvedConfig.loginMethods,
    sendEmailCode: (email) => getRuntime(adapter).sendEmailCode(email),
    verifyEmailCode: (code) => getRuntime(adapter).verifyEmailCode(code),
    loginWithOAuth: (provider) => {
      if (provider !== "google") {
        throw new Error(`[turnkey] Unsupported OAuth provider: ${provider}`);
      }
      return getRuntime(adapter).loginWithGoogle();
    },
    connect: async (): Promise<ConnectWalletResponse> => ({
      address: await getRuntime(adapter).connect(),
    }),
    disconnect: () => getRuntime(adapter).disconnect(),
    getPublicKey: async () => getRuntime(adapter).account()?.address ?? null,
    signTransaction: async (
      transactionXdr: string,
      options?: SignTransactionOptions,
    ): Promise<SignTransactionResponse> => {
      if (!options?.networkPassphrase) {
        throw new Error("[turnkey] networkPassphrase is required.");
      }

      const runtime = getRuntime(adapter);
      const account = runtime.account();
      if (!account) throw new Error("[turnkey] No Stellar account found.");

      const parsed = TransactionBuilder.fromXDR(
        transactionXdr,
        options.networkPassphrase,
      );
      if (parsed instanceof FeeBumpTransaction) {
        throw new Error("[turnkey] Fee-bump challenges are not supported.");
      }

      const transaction = parsed as Transaction;
      const signature = await runtime.sign(
        transaction.hash().toString("hex"),
        account.address,
      );

      transaction.addSignature(
        account.address,
        btoa(String.fromCharCode(...signature)),
      );

      return { signedTxXdr: transaction.toEnvelope().toXDR("base64") };
    },
  };

  configs.set(adapter, resolvedConfig);
  return adapter;
}

function RuntimeBridge({ adapter }: { adapter: TurnkeyAdapter }) {
  const client = useTurnkey();
  const clientRef = useRef(client);

  useEffect(() => {
    clientRef.current = client;
  }, [client]);

  useEffect(() => {
    const config = configs.get(adapter);
    if (!config) throw new Error("[turnkey] Invalid adapter instance.");

    let connectedAccount: WalletAccount | undefined;
    let pendingOtp:
      | {
          email: string;
          otpId: string;
          otpEncryptionTargetBundle: string;
        }
      | undefined;

    const runtime: TurnkeyRuntime = {
      sendEmailCode: async (email) => {
        const result = await clientRef.current.initOtp({
          otpType: OtpType.Email,
          contact: email,
        });
        pendingOtp = { email, ...result };
      },
      verifyEmailCode: async (code) => {
        if (!pendingOtp) {
          throw new Error("[turnkey] Request an email code first.");
        }

        await clientRef.current.completeOtp({
          otpId: pendingOtp.otpId,
          otpCode: code,
          otpEncryptionTargetBundle: pendingOtp.otpEncryptionTargetBundle,
          contact: pendingOtp.email,
          otpType: OtpType.Email,
        });
        pendingOtp = undefined;
      },
      loginWithGoogle: () =>
        new Promise<void>((resolve, reject) => {
          clientRef.current
            .handleGoogleOauth({
              onOauthSuccess: async ({
                oidcToken,
                publicKey,
                providerName,
              }) => {
                try {
                  await clientRef.current.completeOauth({
                    oidcToken,
                    publicKey,
                    providerName,
                  });
                  resolve();
                } catch (error) {
                  reject(error);
                }
              },
            })
            .catch(reject);
        }),
      connect: async () => {
        let wallets = await clientRef.current.refreshWallets();
        connectedAccount = findStellarAccount(wallets);

        if (!connectedAccount) {
          await clientRef.current.createWallet({
            walletName: config.walletName,
            accounts: ["ADDRESS_FORMAT_XLM"],
          });
          wallets = await clientRef.current.refreshWallets();
          connectedAccount = findStellarAccount(wallets);
        }

        if (!connectedAccount) {
          throw new Error("[turnkey] Could not create an Ed25519 XLM account.");
        }
        return connectedAccount.address;
      },
      disconnect: () => clientRef.current.clearSession({}),
      account: () =>
        connectedAccount ?? findStellarAccount(clientRef.current.wallets),
      sign: async (hash, address) => {
        const httpClient = clientRef.current.httpClient;
        if (!httpClient) throw new Error("[turnkey] Client is not ready.");

        // Pollar's login challenge is a Stellar XDR. Stellar hashes the
        // envelope first, so Turnkey must sign these exact 32 bytes without
        // applying another hash function.
        const response = await httpClient.signRawPayload({
          signWith: address,
          payload: hash,
          encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
          hashFunction: "HASH_FUNCTION_NOT_APPLICABLE",
        });
        const result = response.activity.result.signRawPayloadResult;
        if (!result) throw new Error("[turnkey] No signature returned.");

        const signature = hexToBytes(`${result.r}${result.s}`);
        if (signature.length !== 64) {
          throw new Error("[turnkey] Invalid Ed25519 signature.");
        }
        return signature;
      },
    };
    runtimes.set(adapter, runtime);

    return () => {
      if (runtimes.get(adapter) === runtime) runtimes.delete(adapter);
    };
  }, [adapter]);

  return null;
}

export function TurnkeyWalletProvider({
  adapter,
}: {
  adapter: TurnkeyAdapter;
}) {
  const adapterConfig = configs.get(adapter);
  if (!adapterConfig) throw new Error("[turnkey] Invalid adapter instance.");

  const config: TurnkeyProviderConfig = {
    organizationId: adapterConfig.organizationId,
    authProxyConfigId: adapterConfig.authProxyConfigId,
  };

  return (
    <TurnkeyProvider
      config={config}
      callbacks={{
        onError: (error) => console.error("Turnkey error:", error),
      }}
    >
      <RuntimeBridge adapter={adapter} />
    </TurnkeyProvider>
  );
}
