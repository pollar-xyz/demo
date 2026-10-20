import type { PollarClient, RampSigningHandler } from "@pollar/core";
import {
  FeeBumpTransaction,
  Keypair,
  Networks,
  StellarToml,
  TransactionBuilder,
  WebAuth,
} from "@stellar/stellar-sdk";

type AnchorTrust = {
  signingKey: string;
  homeDomains: string[];
  webAuthDomain: string;
};

async function loadAnclapTrust(): Promise<AnchorTrust> {
  // The trust root is the configured provider domain, never the transaction payload.
  const toml = await StellarToml.Resolver.resolve("api.anclap.com");
  if (
    !toml.SIGNING_KEY ||
    !toml.WEB_AUTH_ENDPOINT ||
    toml.NETWORK_PASSPHRASE !== Networks.PUBLIC
  ) {
    throw new Error("Anclap authentication configuration is unavailable.");
  }
  const endpoint = new URL(toml.WEB_AUTH_ENDPOINT);
  if (
    endpoint.protocol !== "https:" ||
    endpoint.hostname !== "api.anclap.com" ||
    endpoint.username ||
    endpoint.password
  ) {
    throw new Error("Unexpected Anclap authentication endpoint.");
  }
  return {
    signingKey: toml.SIGNING_KEY,
    homeDomains: ["api.anclap.com", "anclap.com"],
    webAuthDomain: endpoint.hostname,
  };
}

/** Signs only after Authorize is clicked; the ramp continuation owns submission. */
export function createStellarRampSigner(
  client: PollarClient,
  loadTrust: () => Promise<AnchorTrust> = loadAnclapTrust,
): RampSigningHandler {
  return async (action) => {
    const wallet = client.getWallet();
    const network = client.getNetwork();
    if (
      !wallet ||
      (wallet.chain && wallet.chain !== "STELLAR") ||
      !wallet.address.startsWith("G")
    ) {
      throw new Error("Connect the Stellar account used for this operation.");
    }
    if (
      action.chain !== "STELLAR" ||
      action.network !== network ||
      action.payload.encoding !== "xdr"
    ) {
      throw new Error("The ramp request does not match the connected network.");
    }
    const checkContext = () => {
      if (
        client.getWallet()?.address !== wallet.address ||
        client.getNetwork() !== network
      ) {
        throw new Error(
          "Your wallet changed. Refresh the operation before signing.",
        );
      }
      if (!(Date.parse(action.expiresAt) > Date.now()))
        throw new Error("This authorization expired. Refresh the operation.");
    };
    checkContext();
    const passphrase =
      network === "mainnet" ? Networks.PUBLIC : Networks.TESTNET;
    const unsigned = TransactionBuilder.fromXDR(
      action.payload.value,
      passphrase,
    );
    if (unsigned instanceof FeeBumpTransaction)
      throw new Error("Unexpected fee-bump transaction.");
    const maxTime = Number(unsigned.timeBounds?.maxTime ?? 0) * 1000;
    const minTime = Number(unsigned.timeBounds?.minTime ?? 0) * 1000;
    if (
      !(maxTime > Date.now()) ||
      minTime > Date.now() ||
      maxTime !== Date.parse(action.expiresAt)
    ) {
      throw new Error(
        "The transaction validity does not match this authorization.",
      );
    }

    let trust: AnchorTrust | undefined;
    if (action.purpose === "authentication") {
      if (network !== "mainnet")
        throw new Error(
          "Anclap authentication is configured for mainnet only.",
        );
      trust = await loadTrust();
      const challenge = WebAuth.readChallengeTx(
        action.payload.value,
        trust.signingKey,
        passphrase,
        trust.homeDomains,
        trust.webAuthDomain,
      );
      if (challenge.clientAccountID !== wallet.address)
        throw new Error("This challenge belongs to another wallet.");
    } else if (action.purpose === "withdrawal_payment") {
      const operation = unsigned.operations[0];
      if (
        unsigned.source !== wallet.address ||
        BigInt(unsigned.sequence) <= BigInt(0) ||
        unsigned.operations.length !== 1 ||
        operation?.type !== "payment" ||
        (operation.source && operation.source !== wallet.address) ||
        Number(operation.amount) <= 0
      ) {
        throw new Error("Unexpected withdrawal transaction for this wallet.");
      }
    } else {
      throw new Error("This Stellar ramp action is not supported by the demo.");
    }
    checkContext();
    const proof = trust
      ? await client.stellar.sep10.sign({
          challengeXdr: action.payload.value,
          homeDomains: trust.homeDomains,
          webAuthDomain: trust.webAuthDomain,
        })
      : await client.signTx(action.payload.value);
    if (proof.status !== "signed")
      throw new Error(
        "details" in proof && proof.details
          ? proof.details
          : "Wallet authorization was not completed.",
      );
    checkContext();
    const signed = TransactionBuilder.fromXDR(proof.signedXdr, passphrase);
    if (
      signed instanceof FeeBumpTransaction ||
      !signed.hash().equals(unsigned.hash())
    ) {
      throw new Error("The wallet returned a different transaction.");
    }
    const account = Keypair.fromPublicKey(wallet.address);
    if (
      !signed.signatures.some((signature) =>
        account.verify(signed.hash(), signature.signature()),
      )
    ) {
      throw new Error(
        "The transaction was not signed by your connected wallet.",
      );
    }
    if (trust)
      WebAuth.verifyChallengeTxSigners(
        proof.signedXdr,
        trust.signingKey,
        passphrase,
        [wallet.address],
        trust.homeDomains,
        trust.webAuthDomain,
      );
    return proof.signedXdr;
  };
}
