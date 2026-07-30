"use client";

import { AdapterDoc } from "@/app/_components/AdapterDoc";

// The Nirium x402 adapter — Nirium plans the payment and returns the unsigned
// XDR. (Until the `nirium` package lands, the demo assembles the XDR locally;
// the adapter contract stays identical.)
const SOURCE = `import { type AdapterFn } from '@pollar/core';
import { createPollarAdapterHook } from '@pollar/react';
import { Agent } from 'nirium';

export type X402PaymentParams = {
  to: string;
  amount: string;
  asset: string;      // 'XLM'/'native' or 'CODE:ISSUER'
  reference?: string; // x402 invoice id → tx memo
  signer: string;
};

export type NiriumAdapter = {
  pay: AdapterFn<X402PaymentParams>;
};

// The agent targets one network, so build the adapter per session.
export function createNiriumAdapter(
  network: 'testnet' | 'mainnet',
): NiriumAdapter {
  const agent = new Agent({ network });
  return {
    // Nirium plans the x402 payment → returns { unsignedTransaction }.
    pay: (p) => agent.x402.buildPayment(p),
  };
}`;

const REGISTER = `// 1. build it for the session's network, then register it
const { network } = usePollar();
const adapters = useMemo(
  () => ({ niriumX402: createNiriumAdapter(network) }),
  [network],
);

<PollarProvider apiKey={apiKey} adapters={adapters}>
  {children}
</PollarProvider>

// 2. derive a typed hook once, at module scope
export const useNiriumX402 =
  createPollarAdapterHook<NiriumAdapter>('niriumX402');`;

export default function NiriumAdapterPage() {
  return <AdapterDoc name="Nirium" source={SOURCE} register={REGISTER} />;
}
