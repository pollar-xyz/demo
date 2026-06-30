import { type AdapterFn } from "@pollar/core";
import { createPollarAdapterHook } from "@pollar/react";

// ─── Trustless Work API ───────────────────────────────────────────────────────

const TW_API = "https://dev.api.trustlesswork.com";

async function tw<T>(
  path: string,
  body: T,
): Promise<{ unsignedTransaction: string }> {
  const res = await fetch(`${TW_API}${path}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(body),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `TrustlessWork error: ${res.status}`);
  }
  return res.json();
}

// ─── param types ─────────────────────────────────────────────────────────────

export type DeployEscrowParams = {
  engagementId: string;
  title: string;
  description: string;
  approver: string;
  serviceProvider: string;
  platformAddress: string;
  amount: string;
  platformFee: string;
  signer: string;
};

export type FundEscrowParams = {
  contractId: string;
  signer: string;
};

export type ApproveMilestoneParams = {
  contractId: string;
  milestoneIndex: string;
  signer: string;
};

export type ReleaseFundsParams = {
  contractId: string;
  signer: string;
};

export type InitiateDisputeParams = {
  contractId: string;
  signer: string;
};

export type ResolveDisputeParams = {
  contractId: string;
  approverFunds: string;
  serviceProviderFunds: string;
  signer: string;
};

// ─── adapter type ─────────────────────────────────────────────────────────────

export type TrustlessWorkAdapter = {
  deployEscrow: AdapterFn<DeployEscrowParams>;
  fundEscrow: AdapterFn<FundEscrowParams>;
  approveMilestone: AdapterFn<ApproveMilestoneParams>;
  releaseFunds: AdapterFn<ReleaseFundsParams>;
  initiateDispute: AdapterFn<InitiateDisputeParams>;
  resolveDispute: AdapterFn<ResolveDisputeParams>;
};

// ─── adapter implementation ───────────────────────────────────────────────────

export const trustlessWorkAdapter: TrustlessWorkAdapter = {
  deployEscrow: (params) => tw("/escrow/initialize-escrow", params),

  fundEscrow: (params) => tw("/escrow/fund-escrow", params),

  approveMilestone: (params) => tw("/escrow/approve-milestone", params),

  releaseFunds: (params) => tw("/escrow/complete-escrow", params),

  initiateDispute: (params) => tw("/escrow/dispute-escrow", params),

  resolveDispute: (params) => tw("/escrow/resolute-dispute", params),
};

// ─── hook ─────────────────────────────────────────────────────────────────────

export const useEscrow =
  createPollarAdapterHook<TrustlessWorkAdapter>("escrow");
