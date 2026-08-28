import type {
  ConnectWalletResponse,
  InteractiveAuthAdapter,
  SignTransactionOptions,
  SignTransactionResponse,
} from "@pollar/core";
import { OtpType, TurnkeyClient, type WalletAccount } from "@turnkey/core";
import {
  FeeBumpTransaction,
  type Transaction,
  TransactionBuilder,
} from "@stellar/stellar-sdk";

type TurnkeyLoginMethod = "email";

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
    loginMethods: config.loginMethods ?? ["email"],
    walletName: config.walletName ?? "Pollar Wallet",
  };
  const coreClient = new TurnkeyClient({
    organizationId: resolvedConfig.organizationId,
    authProxyConfigId: resolvedConfig.authProxyConfigId,
  });
  let coreReady: Promise<TurnkeyClient> | undefined;
  let connectedAccount: WalletAccount | undefined;
  let pendingOtp:
    | {
        email: string;
        otpId: string;
        otpEncryptionTargetBundle: string;
      }
    | undefined;

  // Core is browser-only because it initializes secure session storage. Keep
  // construction synchronous, but defer initialization until Pollar actually
  // invokes the adapter on the client.
  const getCoreClient = () => {
    if (typeof window === "undefined") {
      throw new Error("[turnkey] The adapter is only available in a browser.");
    }
    coreReady ??= coreClient.init().then(() => coreClient);
    return coreReady;
  };

  const loadStellarAccount = async () => {
    const client = await getCoreClient();
    let wallets = await client.fetchWallets();
    connectedAccount = findStellarAccount(wallets);

    if (!connectedAccount) {
      await client.createWallet({
        walletName: resolvedConfig.walletName,
        accounts: ["ADDRESS_FORMAT_XLM"],
      });
      wallets = await client.fetchWallets();
      connectedAccount = findStellarAccount(wallets);
    }

    if (!connectedAccount) {
      throw new Error("[turnkey] Could not create an Ed25519 XLM account.");
    }
    return connectedAccount;
  };

  const adapter: TurnkeyAdapter = {
    __turnkeyAdapter: true,
    type: "turnkey",
    meta: { label: config.meta?.label ?? "Turnkey" },
    custody: "external",
    chain: "STELLAR",
    isAvailable: async () => true,
    getAuthOptions: () => resolvedConfig.loginMethods,
    sendEmailCode: async (email) => {
      const client = await getCoreClient();
      const result = await client.initOtp({
        otpType: OtpType.Email,
        contact: email,
      });
      pendingOtp = { email, ...result };
    },
    verifyEmailCode: async (code) => {
      if (!pendingOtp) {
        throw new Error("[turnkey] Request an email code first.");
      }

      const client = await getCoreClient();
      await client.completeOtp({
        otpId: pendingOtp.otpId,
        otpCode: code,
        otpEncryptionTargetBundle: pendingOtp.otpEncryptionTargetBundle,
        contact: pendingOtp.email,
        otpType: OtpType.Email,
      });
      pendingOtp = undefined;
    },
    loginWithOAuth: async () => {
      throw new Error("[turnkey] OAuth is not enabled in this Core-only PoC.");
    },
    connect: async (): Promise<ConnectWalletResponse> => ({
      address: (await loadStellarAccount()).address,
    }),
    disconnect: async () => {
      const client = await getCoreClient();
      connectedAccount = undefined;
      await client.clearSession({});
    },
    getPublicKey: async () => {
      if (connectedAccount) return connectedAccount.address;
      const client = await getCoreClient();
      if (!(await client.getSession())) return null;
      return (await loadStellarAccount()).address;
    },
    signTransaction: async (
      transactionXdr: string,
      options?: SignTransactionOptions,
    ): Promise<SignTransactionResponse> => {
      if (!options?.networkPassphrase) {
        throw new Error("[turnkey] networkPassphrase is required.");
      }

      const client = await getCoreClient();
      const account = connectedAccount ?? (await loadStellarAccount());

      const parsed = TransactionBuilder.fromXDR(
        transactionXdr,
        options.networkPassphrase,
      );
      if (parsed instanceof FeeBumpTransaction) {
        throw new Error("[turnkey] Fee-bump challenges are not supported.");
      }

      const transaction = parsed as Transaction;
      // The React provider creates the authenticated session; from this point
      // the framework-agnostic adapter uses Core directly for signing.
      const response = await client.httpClient.signRawPayload({
        signWith: account.address,
        payload: transaction.hash().toString("hex"),
        encoding: "PAYLOAD_ENCODING_HEXADECIMAL",
        hashFunction: "HASH_FUNCTION_NOT_APPLICABLE",
      });
      const result = response.activity.result.signRawPayloadResult;
      if (!result) throw new Error("[turnkey] No signature returned.");

      const signature = hexToBytes(`${result.r}${result.s}`);
      if (signature.length !== 64) {
        throw new Error("[turnkey] Invalid Ed25519 signature.");
      }

      transaction.addSignature(
        account.address,
        btoa(String.fromCharCode(...signature)),
      );

      return { signedTxXdr: transaction.toEnvelope().toXDR("base64") };
    },
  };

  return adapter;
}
