import * as StellarSdk from "@stellar/stellar-sdk";
import { type AdapterFn } from "@pollar/core";
import { createPollarAdapterHook } from "@pollar/react";
import { WebClient, type Sep7Request } from "@cosmosapp/pay_sdk/web";

// ─── Cosmos Pay (SEP-7 payment intents) ───────────────────────────────────────
//
// Cosmos Pay is a two-halves SDK: the server half (`@cosmosapp/pay_sdk`) *creates*
// SEP-7 payment intents with a secret key, and the browser half
// (`@cosmosapp/pay_sdk/web`) *completes* them. Out of the box the web client
// detects its own wallet (Freighter, xBull, Rabet…), signs and submits.
//
// Here we swap that last step for Pollar. The web client's `buildTransaction`
// *adapts* a `pay` intent into a concrete, unsigned payment XDR — building from
// whatever `source` we pass instead of connecting a wallet — and we hand that
// XDR straight to Pollar. Pollar then signs + submits with the user's connected
// wallet. Cosmos Pay assembles the payment; Pollar owns the signature.
//
// No secret key and no API key ever touch the frontend: creating the intent
// server-side is optional — for the demo we assemble the SEP-7 `pay` request
// locally and let the real web client turn it into the XDR.

type StellarNetwork = "testnet" | "mainnet";

// Cosmos Pay labels mainnet `public` (the Stellar convention), while Pollar
// calls it `mainnet` — translate on the way in. The label drives which Horizon
// and which passphrase the client builds the XDR against.
const COSMOS_NETWORK: Record<StellarNetwork, "public" | "testnet"> = {
  testnet: "testnet",
  mainnet: "public",
};

// ─── params ───────────────────────────────────────────────────────────────────

export type PayParams = {
  destination: string;
  amount: string;
  // "XLM" (or empty) for the native asset, otherwise "CODE:ISSUER".
  asset: string;
  // Free-text note attached to the payment as a MEMO_TEXT (≤ 28 bytes).
  memo?: string;
  // Human-readable message the SEP-7 intent carries (shown to the payer).
  msg?: string;
  signer: string;
};

// Split the single "asset" field into the SEP-7 assetCode / assetIssuer pair.
// Native XLM carries neither — Cosmos Pay reads that as the native asset.
function assetFields(asset: string): Pick<Sep7Request, "assetCode" | "assetIssuer"> {
  const a = asset.trim();
  if (!a || a.toUpperCase() === "XLM" || a.toLowerCase() === "native") {
    return {};
  }
  const [code, issuer] = a.split(":");
  if (!code || !issuer) {
    throw new Error("Asset must be 'XLM' or 'CODE:ISSUER'.");
  }
  return { assetCode: code.trim(), assetIssuer: issuer.trim() };
}

// ─── adapter type ─────────────────────────────────────────────────────────────

export type CosmosPayAdapter = {
  pay: AdapterFn<PayParams>;
};

// ─── adapter implementation ───────────────────────────────────────────────────

// Built per network by the caller (see Shell), since the network is only known
// once the API key resolves. One web client per adapter: the Stellar SDK is
// injected (it's already a dependency).
export function createCosmosPayAdapter(
  network: StellarNetwork,
): CosmosPayAdapter {
  const webClient = new WebClient({
    stellarSdk: StellarSdk as never,
    network: COSMOS_NETWORK[network],
  });

  return {
    // Assemble the SEP-7 `pay` intent → let Cosmos Pay build the unsigned XDR
    // from the connected account as source. Pollar signs + submits.
    pay: async ({ destination, amount, asset, memo, msg, signer }) => {
      const intent: Sep7Request = {
        operation: "pay",
        destination: destination.trim(),
        amount: amount.trim(),
        ...assetFields(asset),
        // Stellar text memos are capped at 28 bytes — keep the note short.
        ...(memo?.trim()
          ? { memo: memo.trim().slice(0, 28), memoType: "MEMO_TEXT" }
          : {}),
        ...(msg?.trim() ? { msg: msg.trim() } : {}),
      };

      // `source` short-circuits the web client's wallet detection: it builds the
      // payment from `signer` and returns the unsigned XDR without ever asking a
      // Cosmos Pay wallet to sign.
      const { xdr } = await webClient.buildTransaction(intent, {
        source: signer.trim(),
        amount: amount.trim(),
      });

      return { unsignedTransaction: xdr };
    },
  };
}

// ─── hook ─────────────────────────────────────────────────────────────────────

export const useCosmosPay =
  createPollarAdapterHook<CosmosPayAdapter>("cosmosPay");
