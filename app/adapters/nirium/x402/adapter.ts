import {
  Asset,
  BASE_FEE,
  Horizon,
  Memo,
  Networks,
  Operation,
  TransactionBuilder,
} from "@stellar/stellar-sdk";
import { type AdapterFn } from "@pollar/core";
import { createPollarAdapterHook } from "@pollar/react";

// ─── Nirium x402 (programmatic payments) ──────────────────────────────────────
//
// NOTE: the published `nirium` package (npm i nirium → import { Agent }) is not
// wired into this repo yet. Until it is, this adapter reproduces what Nirium
// does server-side: it *plans and assembles* the payment and returns the
// unsigned XDR. Pollar then signs + submits with the connected wallet — no
// secret key and no API key ever touch the frontend.
//
// When the package lands, the body becomes a one-liner:
//   const agent = new Agent({ network });
//   pay: (p) => agent.x402.buildPayment(p),   // → { unsignedTransaction }
// The adapter contract ({ unsignedTransaction: string }) stays identical, so
// the page below does not change.

type StellarNetwork = "testnet" | "mainnet";

// Horizon + passphrase both follow the session's network: an XDR built against
// testnet Horizon carries the testnet passphrase and is rejected on pubnet.
const HORIZON: Record<StellarNetwork, string> = {
  testnet: "https://horizon-testnet.stellar.org",
  mainnet: "https://horizon.stellar.org",
};
const PASSPHRASE: Record<StellarNetwork, string> = {
  testnet: Networks.TESTNET,
  mainnet: Networks.PUBLIC,
};

// ─── params ───────────────────────────────────────────────────────────────────

export type X402PaymentParams = {
  to: string;
  amount: string;
  // "XLM" (or "native") for the native asset, otherwise "CODE:ISSUER".
  asset: string;
  // x402 resource / invoice id — recorded as the transaction memo.
  reference?: string;
  signer: string;
};

function parseAsset(asset: string): Asset {
  const a = asset.trim();
  if (!a || a.toUpperCase() === "XLM" || a.toLowerCase() === "native") {
    return Asset.native();
  }
  const [code, issuer] = a.split(":");
  if (!code || !issuer) {
    throw new Error("Asset must be 'XLM' or 'CODE:ISSUER'.");
  }
  return new Asset(code.trim(), issuer.trim());
}

// ─── adapter type ─────────────────────────────────────────────────────────────

export type NiriumAdapter = {
  pay: AdapterFn<X402PaymentParams>;
};

// ─── adapter implementation ───────────────────────────────────────────────────

// Built per network by the caller (see Shell), since the network is only known
// once the API key resolves.
export function createNiriumAdapter(network: StellarNetwork): NiriumAdapter {
  return {
    // Plan the payment → return the unsigned XDR. Pollar signs + submits.
    pay: async ({ to, amount, asset, reference, signer }) => {
      const server = new Horizon.Server(HORIZON[network]);
      const source = await server.loadAccount(signer);

      const builder = new TransactionBuilder(source, {
        fee: BASE_FEE,
        networkPassphrase: PASSPHRASE[network],
      })
        .addOperation(
          Operation.payment({
            destination: to,
            asset: parseAsset(asset),
            amount,
          }),
        )
        .setTimeout(180);

      // Stellar text memos are capped at 28 bytes — keep the reference short.
      if (reference) builder.addMemo(Memo.text(reference.slice(0, 28)));

      const tx = builder.build();
      return { unsignedTransaction: tx.toXDR() };
    },
  };
}

// ─── hook ─────────────────────────────────────────────────────────────────────

export const useNiriumX402 =
  createPollarAdapterHook<NiriumAdapter>("niriumX402");
