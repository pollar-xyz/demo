'use client';

import type {
  ConnectWalletResponse,
  InteractiveAuthAdapter,
  SignTransactionOptions,
  SignTransactionResponse,
} from '@pollar/core';
import {
  OtpType,
  TurnkeyProvider,
  type TurnkeyProviderConfig,
  type WalletAccount,
  useTurnkey,
} from '@turnkey/react-wallet-kit';
import {
  FeeBumpTransaction,
  type Transaction,
  TransactionBuilder,
} from '@stellar/stellar-sdk';
import { useEffect, useRef } from 'react';

const ORGANIZATION_ID = process.env.NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID;
const AUTH_PROXY_CONFIG_ID =
  process.env.NEXT_PUBLIC_TURNKEY_AUTH_PROXY_CONFIG_ID;

const configured = Boolean(ORGANIZATION_ID && AUTH_PROXY_CONFIG_ID);

function findStellarAccount(wallets: { accounts: WalletAccount[] }[]) {
  return wallets
    .flatMap((wallet) => wallet.accounts)
    .find(
      (account) =>
        account.addressFormat === 'ADDRESS_FORMAT_XLM' &&
        account.curve === 'CURVE_ED25519',
    );
}

function hexToBytes(hex: string): Uint8Array {
  const clean = hex.replace(/^0x/, '');
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

let runtime: TurnkeyRuntime | null = null;

function getRuntime(): TurnkeyRuntime {
  if (!runtime) {
    throw new Error('[turnkey] TurnkeyProvider is not mounted.');
  }
  return runtime;
}

export const turnkeyAdapter: InteractiveAuthAdapter | null = configured
  ? {
    type: 'turnkey',
    meta: { label: 'Turnkey' },
    custody: 'external',
    chain: 'STELLAR',
    isAvailable: async () => true,
    getAuthOptions: () => [ 'email', 'google' ],
    sendEmailCode: (email) => getRuntime().sendEmailCode(email),
    verifyEmailCode: (code) => getRuntime().verifyEmailCode(code),
    loginWithOAuth: (provider) => {
      if (provider !== 'google') {
        throw new Error(`[turnkey] Unsupported OAuth provider: ${provider}`);
      }
      return getRuntime().loginWithGoogle();
    },
    connect: async (): Promise<ConnectWalletResponse> => ({
      address: await getRuntime().connect(),
    }),
    disconnect: () => getRuntime().disconnect(),
    getPublicKey: async () => getRuntime().account()?.address ?? null,
    signTransaction: async (
      transactionXdr: string,
      options?: SignTransactionOptions,
    ): Promise<SignTransactionResponse> => {
      if (!options?.networkPassphrase) {
        throw new Error('[turnkey] networkPassphrase is required.');
      }

      const account = getRuntime().account();
      if (!account) throw new Error('[turnkey] No Stellar account found.');

      const parsed = TransactionBuilder.fromXDR(
        transactionXdr,
        options.networkPassphrase,
      );
      if (parsed instanceof FeeBumpTransaction) {
        throw new Error('[turnkey] Fee-bump challenges are not supported.');
      }

      const transaction = parsed as Transaction;
      const signature = await getRuntime().sign(
        transaction.hash().toString('hex'),
        account.address,
      );

      transaction.addSignature(
        account.address,
        btoa(String.fromCharCode(...signature)),
      );

      return { signedTxXdr: transaction.toEnvelope().toXDR('base64') };
    },
  }
  : null;

function RuntimeBridge() {
  const client = useTurnkey();
  const clientRef = useRef(client);

  useEffect(() => {
    clientRef.current = client;
  }, [ client ]);

  useEffect(() => {
    let connectedAccount: WalletAccount | undefined;
    let pendingOtp:
      | {
        email: string;
        otpId: string;
        otpEncryptionTargetBundle: string;
      }
      | undefined;

    runtime = {
      sendEmailCode: async (email) => {
        const result = await clientRef.current.initOtp({
          otpType: OtpType.Email,
          contact: email,
        });
        pendingOtp = { email, ...result };
      },
      verifyEmailCode: async (code) => {
        if (!pendingOtp) {
          throw new Error('[turnkey] Request an email code first.');
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
              onOauthSuccess: async ({ oidcToken, publicKey, providerName }) => {
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
            walletName: 'Pollar Wallet',
            accounts: [ 'ADDRESS_FORMAT_XLM' ],
          });
          wallets = await clientRef.current.refreshWallets();
          connectedAccount = findStellarAccount(wallets);
        }

        if (!connectedAccount) {
          throw new Error('[turnkey] Could not create an Ed25519 XLM account.');
        }
        return connectedAccount.address;
      },
      disconnect: () => clientRef.current.clearSession({}),
      account: () =>
        connectedAccount ?? findStellarAccount(clientRef.current.wallets),
      sign: async (hash, address) => {
        const httpClient = clientRef.current.httpClient;
        if (!httpClient) throw new Error('[turnkey] Client is not ready.');

        // Pollar's login challenge is a Stellar XDR. Stellar hashes the
        // envelope first, so Turnkey must sign these exact 32 bytes without
        // applying another hash function.
        const response = await httpClient.signRawPayload({
          signWith: address,
          payload: hash,
          encoding: 'PAYLOAD_ENCODING_HEXADECIMAL',
          hashFunction: 'HASH_FUNCTION_NOT_APPLICABLE',
        });
        const result = response.activity.result.signRawPayloadResult;
        if (!result) throw new Error('[turnkey] No signature returned.');

        const signature = hexToBytes(`${result.r}${result.s}`);
        if (signature.length !== 64) {
          throw new Error('[turnkey] Invalid Ed25519 signature.');
        }
        return signature;
      },
    };

    return () => {
      runtime = null;
    };
  }, []);

  return null;
}

export function TurnkeyWalletProvider() {
  if (!configured) return null;

  const config: TurnkeyProviderConfig = {
    organizationId: ORGANIZATION_ID!,
    authProxyConfigId: AUTH_PROXY_CONFIG_ID!,
  };

  return (
    <TurnkeyProvider
      config={config}
      callbacks={{
        onError: (error) => console.error('Turnkey error:', error),
      }}
    >
      <RuntimeBridge />
    </TurnkeyProvider>
  );
}
