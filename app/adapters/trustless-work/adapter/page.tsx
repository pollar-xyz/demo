"use client";

import { AdapterDoc } from "@/app/_components/AdapterDoc";

// The full Trustless Work adapter — each method POSTs to the Trustless Work API
// and returns the unsigned XDR it hands back.
const SOURCE = `import { type AdapterFn } from '@pollar/core';
import { createPollarAdapterHook } from '@pollar/react';

const TW_API = 'https://dev.api.trustlesswork.com';

// Every Trustless Work request needs an x-api-key header.
const TW_API_KEY = process.env.NEXT_PUBLIC_TW_API_KEY ?? '';

async function tw<T>(
  path: string,
  body: T,
): Promise<{ unsignedTransaction: string }> {
  const res = await fetch(\`\${TW_API}\${path}\`, {
    method: 'POST',
    headers: {
      'Content-Type': 'application/json',
      'x-api-key': TW_API_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? \`TrustlessWork error: \${res.status}\`);
  }
  return res.json();
}

export type TrustlessWorkAdapter = {
  // single-release
  deploySingle: AdapterFn<DeploySingleParams>;
  fundSingle: AdapterFn<FundParams>;
  approveMilestoneSingle: AdapterFn<ApproveMilestoneParams>;
  changeStatusSingle: AdapterFn<ChangeMilestoneStatusParams>;
  releaseSingle: AdapterFn<ReleaseFundsParams>;
  disputeSingle: AdapterFn<DisputeEscrowParams>;
  resolveSingle: AdapterFn<ResolveDisputeParams>;
  extendTtlSingle: AdapterFn<ExtendTtlParams>;
  // multi-release
  deployMulti: AdapterFn<DeployMultiParams>;
  fundMulti: AdapterFn<FundParams>;
  approveMilestoneMulti: AdapterFn<ApproveMilestoneParams>;
  changeStatusMulti: AdapterFn<ChangeMilestoneStatusParams>;
  releaseMulti: AdapterFn<ReleaseMilestoneParams>;
  disputeMulti: AdapterFn<DisputeMilestoneParams>;
  resolveMulti: AdapterFn<ResolveMilestoneParams>;
  withdrawMulti: AdapterFn<WithdrawRemainingParams>;
  extendTtlMulti: AdapterFn<ExtendTtlParams>;
};

// Trustless Work splits escrows into two families: single-release (one payout)
// and multi-release (a payout per milestone). Deploys go through /deployer/*.
export const trustlessWorkAdapter: TrustlessWorkAdapter = {
  // single-release
  deploySingle:  (p) => tw('/deployer/single-release', p),
  fundSingle:    (p) => tw('/escrow/single-release/fund-escrow', p),
  approveMilestoneSingle: (p) => tw('/escrow/single-release/approve-milestone', p),
  changeStatusSingle:     (p) => tw('/escrow/single-release/change-milestone-status', p),
  releaseSingle: (p) => tw('/escrow/single-release/release-funds', p),
  disputeSingle: (p) => tw('/escrow/single-release/dispute-escrow', p),
  resolveSingle: (p) => tw('/escrow/single-release/resolve-dispute', p),
  extendTtlSingle: (p) => tw('/escrow/single-release/extend-ttl', p),

  // multi-release
  deployMulti:   (p) => tw('/deployer/multi-release', p),
  fundMulti:     (p) => tw('/escrow/multi-release/fund-escrow', p),
  approveMilestoneMulti: (p) => tw('/escrow/multi-release/approve-milestone', p),
  changeStatusMulti:     (p) => tw('/escrow/multi-release/change-milestone-status', p),
  releaseMulti:  (p) => tw('/escrow/multi-release/release-milestone-funds', p),
  disputeMulti:  (p) => tw('/escrow/multi-release/dispute-milestone', p),
  resolveMulti:  (p) => tw('/escrow/multi-release/resolve-milestone-dispute', p),
  withdrawMulti: (p) => tw('/escrow/multi-release/withdraw-remaining-funds', p),
  extendTtlMulti: (p) => tw('/escrow/multi-release/extend-ttl', p),
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
