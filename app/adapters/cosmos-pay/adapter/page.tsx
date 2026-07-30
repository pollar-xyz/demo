"use client";

import { AdapterDoc } from "@/app/_components/AdapterDoc";

// The Cosmos Pay adapter — the web client's buildTransaction turns a SEP-7 `pay`
// intent into an unsigned XDR, built from the connected account as source.
const SOURCE = `import * as StellarSdk from '@stellar/stellar-sdk';
import { type AdapterFn } from '@pollar/core';
import { createPollarAdapterHook } from '@pollar/react';
import { WebClient, type Sep7Request } from '@cosmosapp/pay_sdk/web';

export type PayParams = {
  destination: string;
  amount: string;
  asset: string; // 'XLM'/'native' or 'CODE:ISSUER'
  memo?: string;
  msg?: string;
  signer: string;
};

export type CosmosPayAdapter = {
  pay: AdapterFn<PayParams>;
};

// Stellar SDK injected; the network follows the session — Cosmos Pay labels
// mainnet 'public', Pollar calls it 'mainnet'.
export function createCosmosPayAdapter(
  network: 'testnet' | 'mainnet',
): CosmosPayAdapter {
  const webClient = new WebClient({
    stellarSdk: StellarSdk as never,
    network: network === 'mainnet' ? 'public' : 'testnet',
  });

  return {
    pay: async ({ destination, amount, asset, memo, msg, signer }) => {
      const intent: Sep7Request = {
        operation: 'pay',
        destination: destination.trim(),
        amount: amount.trim(),
        ...assetFields(asset),
        ...(memo?.trim()
          ? { memo: memo.trim().slice(0, 28), memoType: 'MEMO_TEXT' }
          : {}),
        ...(msg?.trim() ? { msg: msg.trim() } : {}),
      };

      // \`source\` short-circuits wallet detection: builds from \`signer\` and
      // returns the unsigned XDR without asking a Cosmos Pay wallet to sign.
      const { xdr } = await webClient.buildTransaction(intent, {
        source: signer.trim(),
        amount: amount.trim(),
      });

      return { unsignedTransaction: xdr };
    },
  };
}`;

const REGISTER = `// 1. build it for the session's network, then register it
const { network } = usePollar();
const adapters = useMemo(
  () => ({ cosmosPay: createCosmosPayAdapter(network) }),
  [network],
);

<PollarProvider apiKey={apiKey} adapters={adapters}>
  {children}
</PollarProvider>

// 2. derive a typed hook once, at module scope
export const useCosmosPay =
  createPollarAdapterHook<CosmosPayAdapter>('cosmosPay');`;

export default function CosmosPayAdapterPage() {
  return <AdapterDoc name="Cosmos Pay" source={SOURCE} register={REGISTER} />;
}
