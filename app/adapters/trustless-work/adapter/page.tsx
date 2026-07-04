"use client";

import { AdapterDoc } from "@/app/_components/AdapterDoc";

// The full Trustless Work adapter — each method POSTs to the Trustless Work API
// and returns the unsigned XDR it hands back.
const SOURCE = `import { type AdapterFn } from '@pollar/core';
import { createPollarAdapterHook } from '@pollar/react';

const TW_API = 'https://dev.api.trustlesswork.com';

async function tw<T>(
  path: string,
  body: T,
): Promise<{ unsignedTransaction: string }> {
  const res = await fetch(\`\${TW_API}\${path}\`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? \`TrustlessWork error: \${res.status}\`);
  }
  return res.json();
}

export type TrustlessWorkAdapter = {
  deployEscrow: AdapterFn<DeployEscrowParams>;
  fundEscrow: AdapterFn<FundEscrowParams>;
  approveMilestone: AdapterFn<ApproveMilestoneParams>;
  releaseFunds: AdapterFn<ReleaseFundsParams>;
  initiateDispute: AdapterFn<InitiateDisputeParams>;
  resolveDispute: AdapterFn<ResolveDisputeParams>;
};

export const trustlessWorkAdapter: TrustlessWorkAdapter = {
  deployEscrow:     (p) => tw('/escrow/initialize-escrow', p),
  fundEscrow:       (p) => tw('/escrow/fund-escrow', p),
  approveMilestone: (p) => tw('/escrow/approve-milestone', p),
  releaseFunds:     (p) => tw('/escrow/complete-escrow', p),
  initiateDispute:  (p) => tw('/escrow/dispute-escrow', p),
  resolveDispute:   (p) => tw('/escrow/resolute-dispute', p),
};`;

const REGISTER = `// 1. register the adapter on the Pollar provider
<PollarProvider
  apiKey={apiKey}
  adapters={{ escrow: trustlessWorkAdapter }}
>
  {children}
</PollarProvider>

// 2. derive a typed hook once, at module scope
export const useEscrow =
  createPollarAdapterHook<TrustlessWorkAdapter>('escrow');`;

export default function TrustlessWorkAdapterPage() {
  return (
    <AdapterDoc name="Trustless Work" source={SOURCE} register={REGISTER} />
  );
}
