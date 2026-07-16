import { type AdapterFn } from "@pollar/core";
import { createPollarAdapterHook } from "@pollar/react";

// ─── Trustless Work API ───────────────────────────────────────────────────────
//
// The API is split into two escrow "families":
//   • single-release — the whole amount is released in one shot.
//   • multi-release  — each milestone carries its own receiver + amount and is
//                      funded / released independently.
//
// Deploys go through the /deployer/* routes; every lifecycle action lives under
// /escrow/{single|multi}-release/*. Each call returns an unsigned XDR that
// Pollar signs + submits with the connected wallet.

const TW_API = "https://dev.api.trustlesswork.com";

// The Trustless Work API authenticates every request with an x-api-key header.
// Get one from https://dapp.trustlesswork.com and set NEXT_PUBLIC_TW_API_KEY.
const TW_API_KEY = process.env.NEXT_PUBLIC_TW_API_KEY ?? "";

async function tw<T>(
  path: string,
  body: T,
): Promise<{ unsignedTransaction: string }> {
  const res = await fetch(`${TW_API}${path}`, {
    method: "POST",
    headers: {
      "Content-Type": "application/json",
      "x-api-key": TW_API_KEY,
    },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `TrustlessWork error: ${res.status}`);
  }
  return res.json();
}

// ─── shared value objects ─────────────────────────────────────────────────────

export type Trustline = {
  address: string;
  symbol: string;
};

export type Distribution = {
  address: string;
  amount: number;
};

// single-release funds one receiver; multi-release sets the receiver per role
// on the escrow itself, so its roles object has no top-level receiver.
export type SingleRoles = {
  approver: string;
  serviceProvider: string;
  platformAddress: string;
  releaseSigner: string;
  disputeResolver: string;
  receiver: string;
};

export type MultiRoles = Omit<SingleRoles, "receiver">;

export type SingleMilestone = {
  description: string;
};

export type MultiMilestone = {
  description: string;
  receiver: string;
  amount: number;
};

// ─── deploy params ────────────────────────────────────────────────────────────

export type DeploySingleParams = {
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  roles: SingleRoles;
  amount: number;
  platformFee: number;
  milestones: SingleMilestone[];
  trustline: Trustline;
};

export type DeployMultiParams = {
  signer: string;
  engagementId: string;
  title: string;
  description: string;
  roles: MultiRoles;
  platformFee: number;
  milestones: MultiMilestone[];
  trustline: Trustline;
};

// ─── lifecycle params (shared shapes reused across both families) ─────────────

export type FundParams = {
  contractId: string;
  signer: string;
  amount: number;
};

export type ApproveMilestoneParams = {
  contractId: string;
  milestoneIndex: string;
  approver: string;
};

export type ChangeMilestoneStatusParams = {
  contractId: string;
  milestoneIndex: string;
  newStatus: string;
  newEvidence: string;
  serviceProvider: string;
};

export type ExtendTtlParams = {
  contractId: string;
  platformAddress: string;
  targetDate: string;
};

// ─── single-release lifecycle params ──────────────────────────────────────────

export type ReleaseFundsParams = {
  contractId: string;
  releaseSigner: string;
};

export type DisputeEscrowParams = {
  contractId: string;
  signer: string;
};

export type ResolveDisputeParams = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
};

// ─── multi-release lifecycle params ───────────────────────────────────────────

export type ReleaseMilestoneParams = {
  contractId: string;
  releaseSigner: string;
  milestoneIndex: string;
};

export type DisputeMilestoneParams = {
  contractId: string;
  milestoneIndex: string;
  signer: string;
};

export type ResolveMilestoneParams = {
  contractId: string;
  disputeResolver: string;
  milestoneIndex: string;
  distributions: Distribution[];
};

export type WithdrawRemainingParams = {
  contractId: string;
  disputeResolver: string;
  distributions: Distribution[];
};

// ─── adapter type ─────────────────────────────────────────────────────────────

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

// ─── adapter implementation ───────────────────────────────────────────────────

export const trustlessWorkAdapter: TrustlessWorkAdapter = {
  // single-release ─────────────────────────────────────────────────────────────
  deploySingle: (p) => tw("/deployer/single-release", p),
  fundSingle: (p) => tw("/escrow/single-release/fund-escrow", p),
  approveMilestoneSingle: (p) =>
    tw("/escrow/single-release/approve-milestone", p),
  changeStatusSingle: (p) =>
    tw("/escrow/single-release/change-milestone-status", p),
  releaseSingle: (p) => tw("/escrow/single-release/release-funds", p),
  disputeSingle: (p) => tw("/escrow/single-release/dispute-escrow", p),
  resolveSingle: (p) => tw("/escrow/single-release/resolve-dispute", p),
  extendTtlSingle: (p) => tw("/escrow/single-release/extend-ttl", p),

  // multi-release ──────────────────────────────────────────────────────────────
  deployMulti: (p) => tw("/deployer/multi-release", p),
  fundMulti: (p) => tw("/escrow/multi-release/fund-escrow", p),
  approveMilestoneMulti: (p) =>
    tw("/escrow/multi-release/approve-milestone", p),
  changeStatusMulti: (p) =>
    tw("/escrow/multi-release/change-milestone-status", p),
  releaseMulti: (p) => tw("/escrow/multi-release/release-milestone-funds", p),
  disputeMulti: (p) => tw("/escrow/multi-release/dispute-milestone", p),
  resolveMulti: (p) => tw("/escrow/multi-release/resolve-milestone-dispute", p),
  withdrawMulti: (p) => tw("/escrow/multi-release/withdraw-remaining-funds", p),
  extendTtlMulti: (p) => tw("/escrow/multi-release/extend-ttl", p),
};

// ─── hook ─────────────────────────────────────────────────────────────────────

export const useEscrow =
  createPollarAdapterHook<TrustlessWorkAdapter>("escrow");
