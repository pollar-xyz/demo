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

async function twRequest<T>(
  path: string,
  init: { method: string; body?: unknown },
): Promise<T> {
  const res = await fetch(`${TW_API}${path}`, {
    method: init.method,
    headers: {
      "Content-Type": "application/json",
      "x-api-key": TW_API_KEY,
    },
    ...(init.body !== undefined && { body: JSON.stringify(init.body) }),
  });
  if (!res.ok) {
    const err = await res.json().catch(() => ({}));
    throw new Error(err?.message ?? `TrustlessWork error: ${res.status}`);
  }
  return res.json();
}

// Every deployer/escrow route builds an unsigned XDR the caller then signs.
function tw<T>(path: string, body: T): Promise<{ unsignedTransaction: string }> {
  return twRequest(path, { method: "POST", body });
}

// PUT variant — only /escrow/{single,multi}-release/update-escrow use it.
function twPut<T>(
  path: string,
  body: T,
): Promise<{ unsignedTransaction: string }> {
  return twRequest(path, { method: "PUT", body });
}

// GET helper for the read-only /helper/* endpoints. TW takes array params in a
// bracketed CSV form (e.g. contractIds=[C…,C…]); scalars are passed verbatim.
function twGet<T>(
  path: string,
  query: Record<string, string | number | boolean | string[] | undefined>,
): Promise<T> {
  const qs = new URLSearchParams();
  for (const [k, v] of Object.entries(query)) {
    if (v === undefined || v === "") continue;
    qs.set(k, Array.isArray(v) ? `[${v.join(",")}]` : String(v));
  }
  const suffix = qs.toString() ? `?${qs}` : "";
  return twRequest(`${path}${suffix}`, { method: "GET" });
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

// ─── update-escrow params ─────────────────────────────────────────────────────
//
// update-escrow (PUT) replaces the escrow's editable properties with a full
// escrow object — the same shape TW returns from send-transaction, carrying the
// lifecycle flags/status the deploy payload doesn't have yet.

export type EscrowFlags = {
  disputed: boolean;
  released: boolean;
  resolved: boolean;
};

export type SingleMilestoneState = {
  description: string;
  status?: string;
  evidence?: string;
  approved?: boolean;
};

export type MultiMilestoneState = MultiMilestone & {
  status?: string;
  evidence?: string;
  approved?: boolean;
  flags?: EscrowFlags;
};

export type SingleEscrowData = {
  engagementId: string;
  title: string;
  description: string;
  roles: SingleRoles;
  amount: number;
  platformFee: number;
  milestones: SingleMilestoneState[];
  flags?: EscrowFlags;
  trustline: Trustline;
  receiverMemo?: number;
  isActive?: boolean;
};

export type MultiEscrowData = Omit<SingleEscrowData, "amount" | "milestones"> & {
  roles: MultiRoles;
  milestones: MultiMilestoneState[];
};

export type UpdateSingleParams = {
  signer: string;
  contractId: string;
  escrow: SingleEscrowData;
};

export type UpdateMultiParams = {
  signer: string;
  contractId: string;
  escrow: MultiEscrowData;
};

// ─── read + submit results (no XDR — plain data) ──────────────────────────────

export type SendTransactionResult = {
  status: string;
  message?: string;
  contractId?: string;
  escrow?: Record<string, unknown>;
};

// Shared filters for the get-escrows-by-{signer,role} indexer queries.
export type EscrowQuery = {
  signer?: string;
  role?: string;
  roleAddress?: string;
  status?: string;
  type?: "single-release" | "multi-release";
  engagementId?: string;
  title?: string;
  isActive?: boolean;
  validateOnChain?: boolean;
  orderBy?: "createdAt" | "updatedAt" | "amount";
  orderDirection?: "asc" | "desc";
  page?: number;
  pageSize?: number;
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
  updateSingle: AdapterFn<UpdateSingleParams>;
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
  updateMulti: AdapterFn<UpdateMultiParams>;
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
  updateSingle: (p) => twPut("/escrow/single-release/update-escrow", p),

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
  updateMulti: (p) => twPut("/escrow/multi-release/update-escrow", p),
};

// ─── helper endpoints (no XDR — called directly, not through the adapter hook) ─
//
// These return plain data rather than an unsigned XDR, so they can't live on
// trustlessWorkAdapter (the useEscrow() wrapper would try to sign + submit their
// result). Deploy/lifecycle now route through sendTransaction: the adapter fn
// builds the XDR, Pollar's signTx signs it, and this posts the signed XDR so TW
// broadcasts AND indexes the escrow — which is what makes it show in the dashboard.

export function sendTransaction(
  signedXdr: string,
): Promise<SendTransactionResult> {
  return twRequest("/helper/send-transaction", {
    method: "POST",
    body: { signedXdr },
  });
}

// Indexer query powering the "my escrows" views — filter by the wallet's signer.
export function getEscrowsBySigner<T = unknown>(query: EscrowQuery): Promise<T> {
  return twGet("/helper/get-escrows-by-signer", query);
}

// Same filters, but matches on a role address rather than the tx signer.
export function getEscrowsByRole<T = unknown>(query: EscrowQuery): Promise<T> {
  return twGet("/helper/get-escrows-by-role", query);
}

export function getEscrowByContractIds<T = unknown>(
  contractIds: string[],
  opts?: { isActive?: boolean; validateOnChain?: boolean },
): Promise<T> {
  return twGet("/helper/get-escrow-by-contract-ids", {
    contractIds,
    ...opts,
  });
}

export function getMultipleEscrowBalance<T = unknown>(
  addresses: string[],
): Promise<T> {
  return twGet("/helper/get-multiple-escrow-balance", { addresses });
}

// ─── hook ─────────────────────────────────────────────────────────────────────

export const useEscrow =
  createPollarAdapterHook<TrustlessWorkAdapter>("escrow");
