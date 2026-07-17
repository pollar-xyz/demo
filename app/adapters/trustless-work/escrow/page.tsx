"use client";

import { useMemo, useState } from "react";
import { usePollar } from "@pollar/react";
import {
  trustlessWorkAdapter,
  sendTransaction,
  getEscrowsBySigner,
  getEscrowsByRole,
  getEscrowByContractIds,
  getMultipleEscrowBalance,
} from "./adapter";
import type {
  TrustlessWorkAdapter,
  SendTransactionResult,
} from "./adapter";
import { DualCode } from "@/app/_components/CodePanels";
import { FnReference } from "@/app/_components/SdkDocs";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── styles ───────────────────────────────────────────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light";
const lbl = "block text-xs font-mono text-muted mb-1";
const btn = (variant: "primary" | "secondary") =>
  variant === "primary"
    ? "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
    : "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";

function Field({
  label,
  required,
  optionalLabel,
  children,
  note,
}: {
  label: string;
  required?: boolean;
  optionalLabel: string;
  note?: string;
  children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className={lbl}>
        {label}
        {required ? (
          <span className="ml-1 text-muted-light">*</span>
        ) : (
          <span className="ml-1 text-muted-light">{optionalLabel}</span>
        )}
      </label>
      {children}
      {note && <p className="text-xs text-muted-light mt-0.5">{note}</p>}
    </div>
  );
}

// ─── value serializer (for the live code preview) ─────────────────────────────

function serializeVal(val: unknown, depth = 0): string {
  const pad = "  ".repeat(depth);
  const inner = "  ".repeat(depth + 1);
  if (val === null || val === undefined) return "undefined";
  if (typeof val === "boolean") return String(val);
  if (typeof val === "number") return String(val);
  if (typeof val === "string") return `'${val}'`;
  if (Array.isArray(val)) {
    if (val.length === 0) return "[]";
    const items = val
      .map((v) => `${inner}${serializeVal(v, depth + 1)}`)
      .join(",\n");
    return `[\n${items},\n${pad}]`;
  }
  if (typeof val === "object") {
    const entries = Object.entries(val as Record<string, unknown>);
    if (entries.length === 0) return "{}";
    const lines = entries
      .map(([k, v]) => `${inner}${k}: ${serializeVal(v, depth + 1)}`)
      .join(",\n");
    return `{\n${lines},\n${pad}}`;
  }
  return String(val);
}

const num = (s: string): number => {
  const n = Number(s);
  return Number.isFinite(n) ? n : 0;
};

// convert a native <input type="date"> value (2025-12-31) to the API's format.
const toApiDate = (s: string): string => s.replaceAll("-", "/");

// ─── defaults ─────────────────────────────────────────────────────────────────

// Testnet USDC trustline used by the Trustless Work dapp.
const DEFAULT_TRUSTLINE_ADDR =
  "GBBD47IF6LWK7P7MDEVSCWR7DPUWV3NY3DTQEVFL4NAT4AQH3ZLLFLA5";

// ─── operation config ─────────────────────────────────────────────────────────

type Family = "single" | "multi";

type FieldDef = {
  key: string;
  label: string;
  type?: "text" | "number" | "textarea" | "date";
  required?: boolean;
  placeholder?: string;
  note?: string;
  wallet?: boolean; // prefill with the connected wallet when left empty
  half?: boolean;
};

type BuildCtx = {
  r: (key: string) => string; // resolved field value (applies wallet fallback)
  wallet: string;
  milestones: MilestoneRow[];
  distributions: DistributionRow[];
};

type OpDef = {
  id: string;
  label: string;
  method: keyof TrustlessWorkAdapter;
  blurb: string;
  fields: FieldDef[];
  milestones?: Family; // render the milestones editor (single = desc only)
  distributions?: boolean; // render the distributions editor
  build: (c: BuildCtx) => Record<string, unknown>;
};

type MilestoneRow = { description: string; receiver: string; amount: string };
type DistributionRow = { address: string; amount: string };

// role fields shared by both deploy forms (multi has no `receiver`).
const roleField = (key: string, label: string): FieldDef => ({
  key: `roles.${key}`,
  label,
  wallet: true,
  placeholder: "G…",
  half: true,
});

const DEPLOY_COMMON: FieldDef[] = [
  { key: "engagementId", label: "engagementId", required: true, placeholder: "ENG-001", half: true },
  { key: "title", label: "title", required: true, placeholder: "Design Landing Page", half: true },
  { key: "description", label: "description", type: "textarea", required: true, placeholder: "Landing for the new product…" },
  { key: "trustline.address", label: "trustline.address", placeholder: DEFAULT_TRUSTLINE_ADDR, half: true },
  { key: "trustline.symbol", label: "trustline.symbol", placeholder: "USDC", half: true },
];

const SINGLE_OPS: OpDef[] = [
  {
    id: "deploy",
    label: "Deploy",
    method: "deploySingle",
    blurb: "POST /deployer/single-release — creates the escrow contract.",
    fields: [
      ...DEPLOY_COMMON,
      { key: "amount", label: "amount", type: "number", required: true, placeholder: "5", half: true },
      { key: "platformFee", label: "platformFee %", type: "number", required: true, placeholder: "5", half: true },
      roleField("approver", "roles.approver"),
      roleField("serviceProvider", "roles.serviceProvider"),
      roleField("platformAddress", "roles.platformAddress"),
      roleField("releaseSigner", "roles.releaseSigner"),
      roleField("disputeResolver", "roles.disputeResolver"),
      roleField("receiver", "roles.receiver"),
    ],
    milestones: "single",
    build: ({ r, wallet, milestones }) => ({
      signer: wallet,
      engagementId: r("engagementId"),
      title: r("title"),
      description: r("description"),
      roles: {
        approver: r("roles.approver"),
        serviceProvider: r("roles.serviceProvider"),
        platformAddress: r("roles.platformAddress"),
        releaseSigner: r("roles.releaseSigner"),
        disputeResolver: r("roles.disputeResolver"),
        receiver: r("roles.receiver"),
      },
      amount: num(r("amount")),
      platformFee: num(r("platformFee")),
      milestones: milestones.map((m) => ({ description: m.description })),
      trustline: {
        address: r("trustline.address") || DEFAULT_TRUSTLINE_ADDR,
        symbol: r("trustline.symbol") || "USDC",
      },
    }),
  },
  {
    id: "fund",
    label: "Fund",
    method: "fundSingle",
    blurb: "POST /escrow/single-release/fund-escrow — deposits the amount.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…" },
      { key: "amount", label: "amount", type: "number", required: true, placeholder: "5" },
    ],
    build: ({ r, wallet }) => ({
      contractId: r("contractId"),
      signer: wallet,
      amount: num(r("amount")),
    }),
  },
  {
    id: "approve",
    label: "Approve milestone",
    method: "approveMilestoneSingle",
    blurb: "POST /escrow/single-release/approve-milestone — approver marks a milestone done.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…", half: true },
      { key: "milestoneIndex", label: "milestoneIndex", required: true, placeholder: "0", half: true },
      { key: "approver", label: "approver", wallet: true, placeholder: "G…" },
    ],
    build: ({ r }) => ({
      contractId: r("contractId"),
      milestoneIndex: r("milestoneIndex"),
      approver: r("approver"),
    }),
  },
  {
    id: "changeStatus",
    label: "Change status",
    method: "changeStatusSingle",
    blurb: "POST /escrow/single-release/change-milestone-status — service provider updates a milestone.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…", half: true },
      { key: "milestoneIndex", label: "milestoneIndex", required: true, placeholder: "0", half: true },
      { key: "newStatus", label: "newStatus", required: true, placeholder: "Completed", half: true },
      { key: "newEvidence", label: "newEvidence", placeholder: "https://…", half: true },
      { key: "serviceProvider", label: "serviceProvider", wallet: true, placeholder: "G…" },
    ],
    build: ({ r }) => ({
      contractId: r("contractId"),
      milestoneIndex: r("milestoneIndex"),
      newStatus: r("newStatus"),
      newEvidence: r("newEvidence"),
      serviceProvider: r("serviceProvider"),
    }),
  },
  {
    id: "release",
    label: "Release funds",
    method: "releaseSingle",
    blurb: "POST /escrow/single-release/release-funds — releases the full amount to the receiver.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…", half: true },
      { key: "releaseSigner", label: "releaseSigner", wallet: true, placeholder: "G…", half: true },
    ],
    build: ({ r }) => ({
      contractId: r("contractId"),
      releaseSigner: r("releaseSigner"),
    }),
  },
  {
    id: "dispute",
    label: "Dispute",
    method: "disputeSingle",
    blurb: "POST /escrow/single-release/dispute-escrow — flags the escrow as disputed.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…" },
    ],
    build: ({ r, wallet }) => ({
      contractId: r("contractId"),
      signer: wallet,
    }),
  },
  {
    id: "resolve",
    label: "Resolve dispute",
    method: "resolveSingle",
    blurb: "POST /escrow/single-release/resolve-dispute — dispute resolver splits the funds.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…", half: true },
      { key: "disputeResolver", label: "disputeResolver", wallet: true, placeholder: "G…", half: true },
    ],
    distributions: true,
    build: ({ r, distributions }) => ({
      contractId: r("contractId"),
      disputeResolver: r("disputeResolver"),
      distributions: distributions.map((d) => ({
        address: d.address,
        amount: num(d.amount),
      })),
    }),
  },
  {
    id: "extendTtl",
    label: "Extend TTL",
    method: "extendTtlSingle",
    blurb: "POST /escrow/single-release/extend-ttl — bumps the contract's rent expiry.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…" },
      { key: "platformAddress", label: "platformAddress", wallet: true, placeholder: "G…" },
      { key: "targetDate", label: "targetDate", type: "date", required: true },
    ],
    build: ({ r }) => ({
      contractId: r("contractId"),
      platformAddress: r("platformAddress"),
      targetDate: toApiDate(r("targetDate")),
    }),
  },
  {
    id: "update",
    label: "Update escrow",
    method: "updateSingle",
    blurb:
      "PUT /escrow/single-release/update-escrow — replaces the escrow's editable properties.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…" },
      ...DEPLOY_COMMON,
      { key: "amount", label: "amount", type: "number", required: true, placeholder: "5", half: true },
      { key: "platformFee", label: "platformFee %", type: "number", required: true, placeholder: "5", half: true },
      roleField("approver", "roles.approver"),
      roleField("serviceProvider", "roles.serviceProvider"),
      roleField("platformAddress", "roles.platformAddress"),
      roleField("releaseSigner", "roles.releaseSigner"),
      roleField("disputeResolver", "roles.disputeResolver"),
      roleField("receiver", "roles.receiver"),
    ],
    milestones: "single",
    build: ({ r, wallet, milestones }) => ({
      signer: wallet,
      contractId: r("contractId"),
      escrow: {
        engagementId: r("engagementId"),
        title: r("title"),
        description: r("description"),
        roles: {
          approver: r("roles.approver"),
          serviceProvider: r("roles.serviceProvider"),
          platformAddress: r("roles.platformAddress"),
          releaseSigner: r("roles.releaseSigner"),
          disputeResolver: r("roles.disputeResolver"),
          receiver: r("roles.receiver"),
        },
        amount: num(r("amount")),
        platformFee: num(r("platformFee")),
        milestones: milestones.map((m) => ({ description: m.description })),
        trustline: {
          address: r("trustline.address") || DEFAULT_TRUSTLINE_ADDR,
          symbol: r("trustline.symbol") || "USDC",
        },
      },
    }),
  },
];

const MULTI_OPS: OpDef[] = [
  {
    id: "deploy",
    label: "Deploy",
    method: "deployMulti",
    blurb: "POST /deployer/multi-release — each milestone carries its own receiver + amount.",
    fields: [
      ...DEPLOY_COMMON,
      { key: "platformFee", label: "platformFee %", type: "number", required: true, placeholder: "5", half: true },
      roleField("approver", "roles.approver"),
      roleField("serviceProvider", "roles.serviceProvider"),
      roleField("platformAddress", "roles.platformAddress"),
      roleField("releaseSigner", "roles.releaseSigner"),
      roleField("disputeResolver", "roles.disputeResolver"),
    ],
    milestones: "multi",
    build: ({ r, wallet, milestones }) => ({
      signer: wallet,
      engagementId: r("engagementId"),
      title: r("title"),
      description: r("description"),
      roles: {
        approver: r("roles.approver"),
        serviceProvider: r("roles.serviceProvider"),
        platformAddress: r("roles.platformAddress"),
        releaseSigner: r("roles.releaseSigner"),
        disputeResolver: r("roles.disputeResolver"),
      },
      platformFee: num(r("platformFee")),
      milestones: milestones.map((m) => ({
        description: m.description,
        receiver: m.receiver || wallet,
        amount: num(m.amount),
      })),
      trustline: {
        address: r("trustline.address") || DEFAULT_TRUSTLINE_ADDR,
        symbol: r("trustline.symbol") || "USDC",
      },
    }),
  },
  {
    id: "fund",
    label: "Fund",
    method: "fundMulti",
    blurb: "POST /escrow/multi-release/fund-escrow — deposits funds into the escrow.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…" },
      { key: "amount", label: "amount", type: "number", required: true, placeholder: "5" },
    ],
    build: ({ r, wallet }) => ({
      contractId: r("contractId"),
      signer: wallet,
      amount: num(r("amount")),
    }),
  },
  {
    id: "approve",
    label: "Approve milestone",
    method: "approveMilestoneMulti",
    blurb: "POST /escrow/multi-release/approve-milestone — approver marks a milestone done.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…", half: true },
      { key: "milestoneIndex", label: "milestoneIndex", required: true, placeholder: "0", half: true },
      { key: "approver", label: "approver", wallet: true, placeholder: "G…" },
    ],
    build: ({ r }) => ({
      contractId: r("contractId"),
      milestoneIndex: r("milestoneIndex"),
      approver: r("approver"),
    }),
  },
  {
    id: "changeStatus",
    label: "Change status",
    method: "changeStatusMulti",
    blurb: "POST /escrow/multi-release/change-milestone-status — service provider updates a milestone.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…", half: true },
      { key: "milestoneIndex", label: "milestoneIndex", required: true, placeholder: "0", half: true },
      { key: "newStatus", label: "newStatus", required: true, placeholder: "Completed", half: true },
      { key: "newEvidence", label: "newEvidence", placeholder: "https://…", half: true },
      { key: "serviceProvider", label: "serviceProvider", wallet: true, placeholder: "G…" },
    ],
    build: ({ r }) => ({
      contractId: r("contractId"),
      milestoneIndex: r("milestoneIndex"),
      newStatus: r("newStatus"),
      newEvidence: r("newEvidence"),
      serviceProvider: r("serviceProvider"),
    }),
  },
  {
    id: "release",
    label: "Release milestone",
    method: "releaseMulti",
    blurb: "POST /escrow/multi-release/release-milestone-funds — releases one milestone's funds.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…", half: true },
      { key: "milestoneIndex", label: "milestoneIndex", required: true, placeholder: "0", half: true },
      { key: "releaseSigner", label: "releaseSigner", wallet: true, placeholder: "G…" },
    ],
    build: ({ r }) => ({
      contractId: r("contractId"),
      releaseSigner: r("releaseSigner"),
      milestoneIndex: r("milestoneIndex"),
    }),
  },
  {
    id: "dispute",
    label: "Dispute milestone",
    method: "disputeMulti",
    blurb: "POST /escrow/multi-release/dispute-milestone — flags one milestone as disputed.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…", half: true },
      { key: "milestoneIndex", label: "milestoneIndex", required: true, placeholder: "0", half: true },
    ],
    build: ({ r, wallet }) => ({
      contractId: r("contractId"),
      milestoneIndex: r("milestoneIndex"),
      signer: wallet,
    }),
  },
  {
    id: "resolve",
    label: "Resolve dispute",
    method: "resolveMulti",
    blurb: "POST /escrow/multi-release/resolve-milestone-dispute — resolver splits a milestone's funds.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…", half: true },
      { key: "milestoneIndex", label: "milestoneIndex", required: true, placeholder: "0", half: true },
      { key: "disputeResolver", label: "disputeResolver", wallet: true, placeholder: "G…" },
    ],
    distributions: true,
    build: ({ r, distributions }) => ({
      contractId: r("contractId"),
      disputeResolver: r("disputeResolver"),
      milestoneIndex: r("milestoneIndex"),
      distributions: distributions.map((d) => ({
        address: d.address,
        amount: num(d.amount),
      })),
    }),
  },
  {
    id: "withdraw",
    label: "Withdraw remaining",
    method: "withdrawMulti",
    blurb: "POST /escrow/multi-release/withdraw-remaining-funds — withdraws leftover funds after resolution.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…", half: true },
      { key: "disputeResolver", label: "disputeResolver", wallet: true, placeholder: "G…", half: true },
    ],
    distributions: true,
    build: ({ r, distributions }) => ({
      contractId: r("contractId"),
      disputeResolver: r("disputeResolver"),
      distributions: distributions.map((d) => ({
        address: d.address,
        amount: num(d.amount),
      })),
    }),
  },
  {
    id: "extendTtl",
    label: "Extend TTL",
    method: "extendTtlMulti",
    blurb: "POST /escrow/multi-release/extend-ttl — bumps the contract's rent expiry.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…" },
      { key: "platformAddress", label: "platformAddress", wallet: true, placeholder: "G…" },
      { key: "targetDate", label: "targetDate", type: "date", required: true },
    ],
    build: ({ r }) => ({
      contractId: r("contractId"),
      platformAddress: r("platformAddress"),
      targetDate: toApiDate(r("targetDate")),
    }),
  },
  {
    id: "update",
    label: "Update escrow",
    method: "updateMulti",
    blurb:
      "PUT /escrow/multi-release/update-escrow — replaces the escrow's editable properties.",
    fields: [
      { key: "contractId", label: "contractId", required: true, placeholder: "C…" },
      ...DEPLOY_COMMON,
      { key: "platformFee", label: "platformFee %", type: "number", required: true, placeholder: "5", half: true },
      roleField("approver", "roles.approver"),
      roleField("serviceProvider", "roles.serviceProvider"),
      roleField("platformAddress", "roles.platformAddress"),
      roleField("releaseSigner", "roles.releaseSigner"),
      roleField("disputeResolver", "roles.disputeResolver"),
    ],
    milestones: "multi",
    build: ({ r, wallet, milestones }) => ({
      signer: wallet,
      contractId: r("contractId"),
      escrow: {
        engagementId: r("engagementId"),
        title: r("title"),
        description: r("description"),
        roles: {
          approver: r("roles.approver"),
          serviceProvider: r("roles.serviceProvider"),
          platformAddress: r("roles.platformAddress"),
          releaseSigner: r("roles.releaseSigner"),
          disputeResolver: r("roles.disputeResolver"),
        },
        platformFee: num(r("platformFee")),
        milestones: milestones.map((m) => ({
          description: m.description,
          receiver: m.receiver || wallet,
          amount: num(m.amount),
        })),
        trustline: {
          address: r("trustline.address") || DEFAULT_TRUSTLINE_ADDR,
          symbol: r("trustline.symbol") || "USDC",
        },
      },
    }),
  },
];

const OPS: Record<Family, OpDef[]> = { single: SINGLE_OPS, multi: MULTI_OPS };

const SETUP_NOTE = `// adapter.ts — register once in your app
export const trustlessWorkAdapter: TrustlessWorkAdapter = {
  // single-release
  deploySingle:  (p) => tw('/deployer/single-release', p),
  fundSingle:    (p) => tw('/escrow/single-release/fund-escrow', p),
  releaseSingle: (p) => tw('/escrow/single-release/release-funds', p),
  resolveSingle: (p) => tw('/escrow/single-release/resolve-dispute', p),
  // …approve / change-status / dispute / extend-ttl

  // multi-release
  deployMulti:   (p) => tw('/deployer/multi-release', p),
  releaseMulti:  (p) => tw('/escrow/multi-release/release-milestone-funds', p),
  withdrawMulti: (p) => tw('/escrow/multi-release/withdraw-remaining-funds', p),
  // …fund / approve / change-status / dispute / resolve / extend-ttl
};

// each adapter fn returns { unsignedTransaction: string }.
// Pollar then signs + submits with the user's wallet automatically.

export const useEscrow =
  createPollarAdapterHook<TrustlessWorkAdapter>('escrow');`;

// ─── read-only helpers panel ──────────────────────────────────────────────────
//
// The indexer/helper endpoints return plain data (no XDR to sign), so they're a
// separate panel: pick a query, run it, inspect the JSON. These are what power
// Trustless Work's "my escrows" dashboard views.

type ReadOp = {
  id: string;
  label: string;
  blurb: string;
  input: "signer" | "contractIds" | "addresses";
  run: (value: string, wallet: string) => Promise<unknown>;
};

const csv = (s: string): string[] =>
  s
    .split(",")
    .map((x) => x.trim())
    .filter(Boolean);

const READ_OPS: ReadOp[] = [
  {
    id: "bySigner",
    label: "By signer",
    blurb: "GET /helper/get-escrows-by-signer — escrows this wallet deployed.",
    input: "signer",
    run: (v, wallet) => getEscrowsBySigner({ signer: v || wallet }),
  },
  {
    id: "byRole",
    label: "By role",
    blurb: "GET /helper/get-escrows-by-role — escrows where an address holds a role.",
    input: "signer",
    run: (v, wallet) => getEscrowsByRole({ roleAddress: v || wallet }),
  },
  {
    id: "byContractIds",
    label: "By contract IDs",
    blurb: "GET /helper/get-escrow-by-contract-ids — look up specific escrows.",
    input: "contractIds",
    run: (v) => getEscrowByContractIds(csv(v)),
  },
  {
    id: "balances",
    label: "Balances",
    blurb: "GET /helper/get-multiple-escrow-balance — on-chain balances by address.",
    input: "addresses",
    run: (v) => getMultipleEscrowBalance(csv(v)),
  },
];

function HelpersPanel({ walletAddress }: { walletAddress: string }) {
  const [readId, setReadId] = useState<string>(READ_OPS[0]!.id);
  const [value, setValue] = useState("");
  const [result, setResult] = useState<unknown>(null);
  const [error, setError] = useState<string | null>(null);
  const [loading, setLoading] = useState(false);

  const readOp = READ_OPS.find((o) => o.id === readId) ?? READ_OPS[0]!;
  const placeholder =
    readOp.input === "signer"
      ? walletAddress || "G…"
      : readOp.input === "contractIds"
        ? "C…, C… (comma-separated)"
        : "C…, C… (comma-separated addresses)";

  async function run() {
    setError(null);
    setResult(null);
    setLoading(true);
    try {
      setResult(await readOp.run(value.trim(), walletAddress));
    } catch (e) {
      setError(e instanceof Error ? e.message : "Request failed");
    } finally {
      setLoading(false);
    }
  }

  return (
    <div className="mt-10 space-y-4 border-t border-border pt-8">
      <div>
        <h2 className="text-lg font-bold tracking-tight text-foreground">
          Indexer &amp; helpers
        </h2>
        <p className="text-sm text-muted mt-1">
          Read-only Trustless Work endpoints — no signing. These back the
          dashboard&apos;s escrow lists and balances.
        </p>
      </div>

      <div className="flex flex-wrap gap-1 border-b border-border">
        {READ_OPS.map((o) => (
          <button
            key={o.id}
            onClick={() => {
              setReadId(o.id);
              setError(null);
              setResult(null);
            }}
            className={`text-xs px-3 py-2 border-b-2 -mb-px transition-colors ${
              readOp.id === o.id
                ? "border-primary text-primary font-semibold"
                : "border-transparent text-muted-light hover:text-foreground"
            }`}
          >
            {o.label}
          </button>
        ))}
      </div>

      <p className="text-xs font-mono text-muted-light">{readOp.blurb}</p>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          className={inp}
          value={value}
          onChange={(e) => setValue(e.target.value)}
          placeholder={placeholder}
          spellCheck={false}
        />
        <button
          onClick={run}
          disabled={loading}
          className={`${btn("primary")} shrink-0`}
        >
          {loading ? "Running…" : "Run"}
        </button>
      </div>

      {error && <p className="text-xs font-mono text-error">{error}</p>}

      {result !== null && (
        <pre className="rounded-lg border border-border bg-background p-4 text-xs font-mono text-foreground overflow-x-auto max-h-96 whitespace-pre-wrap break-all">
          {JSON.stringify(result, null, 2)}
        </pre>
      )}
    </div>
  );
}

// ─── page ─────────────────────────────────────────────────────────────────────

export default function EscrowPage() {
  const { t } = useI18n();
  const { wallet, isAuthenticated, tx, openTxModal, signTx } = usePollar();
  const walletAddress = wallet?.address ?? "";

  const [family, setFamily] = useState<Family>("single");
  const [opId, setOpId] = useState<string>("deploy");
  const [bag, setBag] = useState<Record<string, string>>({});
  const [milestones, setMilestones] = useState<MilestoneRow[]>([
    { description: "Design the wireframe", receiver: "", amount: "" },
  ]);
  const [distributions, setDistributions] = useState<DistributionRow[]>([
    { address: "", amount: "" },
    { address: "", amount: "" },
  ]);
  const [error, setError] = useState<string | null>(null);
  const [inFlight, setInFlight] = useState(false);
  const [result, setResult] = useState<SendTransactionResult | null>(null);

  const ops = OPS[family];
  const op = ops.find((o) => o.id === opId) ?? ops[0]!;

  const set = (key: string, value: string) =>
    setBag((b) => ({ ...b, [key]: value }));

  // resolved field value — applies the wallet fallback for role-style fields.
  const resolve = useMemo(() => {
    return (key: string): string => {
      const raw = (bag[key] ?? "").trim();
      if (raw) return raw;
      const f = op.fields.find((f) => f.key === key);
      return f?.wallet ? walletAddress : "";
    };
  }, [bag, op, walletAddress]);

  const params = op.build({
    r: resolve,
    wallet: walletAddress,
    milestones,
    distributions,
  });

  function switchFamily(f: Family) {
    setFamily(f);
    setOpId("deploy");
    setError(null);
    setResult(null);
  }

  // Client-side guard: surface empty required fields (TW 400s on an empty
  // description) and negative amounts (TW: "must be greater than or equal to 0")
  // before hitting the API.
  function validate(): string | null {
    const missing = op.fields
      .filter((f) => f.required && !resolve(f.key))
      .map((f) => f.label);

    // Numeric fields (amount, platformFee, …) must be ≥ 0 — TW rejects negatives.
    const negative: string[] = [];
    const checkAmount = (label: string, raw: string) => {
      const v = raw.trim();
      if (v && num(v) < 0) negative.push(label);
    };
    op.fields
      .filter((f) => f.type === "number")
      .forEach((f) => checkAmount(f.label, resolve(f.key)));

    if (op.milestones) {
      if (milestones.length === 0) missing.push("at least one milestone");
      milestones.forEach((m, i) => {
        if (!m.description.trim())
          missing.push(`milestone ${i + 1} description`);
        if (op.milestones === "multi" && !m.amount.trim())
          missing.push(`milestone ${i + 1} amount`);
        checkAmount(`milestone ${i + 1} amount`, m.amount);
      });
    }

    if (op.distributions) {
      distributions.forEach((d, i) => {
        if (!d.address.trim()) missing.push(`distribution ${i + 1} address`);
        if (!d.amount.trim()) missing.push(`distribution ${i + 1} amount`);
        checkAmount(`distribution ${i + 1} amount`, d.amount);
      });
    }

    const problems: string[] = [];
    if (missing.length)
      problems.push(
        `Missing required field${missing.length > 1 ? "s" : ""}: ${missing.join(", ")}`,
      );
    if (negative.length)
      problems.push(`Must be ≥ 0: ${negative.join(", ")}`);

    return problems.length ? problems.join(" — ") : null;
  }

  async function submit() {
    setError(null);
    setResult(null);
    const invalid = validate();
    if (invalid) {
      setError(invalid);
      return;
    }
    setInFlight(true);
    try {
      // Match Trustless Work's own dApp: build → sign → send-transaction. We call
      // the raw adapter (not the auto-submitting useEscrow hook) so Pollar only
      // SIGNS, then hand the signed XDR to TW's helper — that endpoint broadcasts
      // AND indexes the escrow, which is what makes it appear in the dashboard.
      const fn = trustlessWorkAdapter[op.method] as (
        p: unknown,
      ) => Promise<{ unsignedTransaction: string }>;
      const { unsignedTransaction } = await fn(params);
      const signed = await signTx(unsignedTransaction);
      if (signed.status !== "signed") {
        throw new Error(
          signed.details ?? signed.message ?? t.common.unknownError,
        );
      }
      setResult(await sendTransaction(signed.signedXdr));
    } catch (e) {
      setError(e instanceof Error ? e.message : t.common.unknownError);
    } finally {
      setInFlight(false);
    }
  }

  // ── live code preview ─────────────────────────────────────────────────────
  const p = serializeVal(params, 0);
  const react = `const { signTx } = usePollar();

// adapter hits Trustless Work → returns the unsigned XDR
const { unsignedTransaction } =
  await trustlessWorkAdapter.${op.method}(${p});

// Pollar signs it (custodial → /tx/sign, external → wallet adapter)
const { signedXdr } = await signTx(unsignedTransaction);

// TW broadcasts AND indexes the escrow → shows in the dashboard
const res = await sendTransaction(signedXdr);`;

  const core = `import { PollarClient } from '@pollar/core';
import { trustlessWorkAdapter, sendTransaction } from './adapter';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// the adapter hits Trustless Work → returns an unsigned XDR
const { unsignedTransaction } =
  await trustlessWorkAdapter.${op.method}(${p});

// Pollar signs only — TW submits + indexes via its helper
const { signedXdr } = await client.signTx(unsignedTransaction);
const res = await sendTransaction(signedXdr);`;

  // ── render ────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: form ────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {t.escrow.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">
              {t.escrow.desc.split("Trustless Work").map((part, i) => (
                <span key={i}>
                  {i > 0 && (
                    <a
                      href="https://www.trustlesswork.com/"
                      target="_blank"
                      rel="noopener noreferrer"
                      className="font-bold text-foreground hover:text-primary hover:underline"
                    >
                      Trustless Work
                    </a>
                  )}
                  {part}
                </span>
              ))}
            </p>
          </div>

          {/* family toggle */}
          <div className="inline-flex rounded-lg border border-border p-0.5">
            {(["single", "multi"] as Family[]).map((f) => (
              <button
                key={f}
                onClick={() => switchFamily(f)}
                className={`rounded-md px-3 py-1.5 text-xs font-medium transition-colors ${
                  family === f
                    ? "bg-primary text-white"
                    : "text-muted-light hover:text-foreground"
                }`}
              >
                {f === "single" ? "Single-Release" : "Multi-Release"}
              </button>
            ))}
          </div>

          {/* operation tabs */}
          <div className="flex flex-wrap gap-1 border-b border-border">
            {ops.map((o) => (
              <button
                key={o.id}
                onClick={() => {
                  setOpId(o.id);
                  setError(null);
                }}
                className={`text-xs px-3 py-2 border-b-2 -mb-px transition-colors ${
                  op.id === o.id
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted-light hover:text-foreground"
                }`}
              >
                {o.label}
              </button>
            ))}
          </div>

          <p className="text-xs font-mono text-muted-light">{op.blurb}</p>

          {/* scalar fields */}
          <div className="grid grid-cols-2 gap-3">
            {op.fields.map((f) => (
              <div key={f.key} className={f.half ? "" : "col-span-2"}>
                <Field
                  label={f.label}
                  required={f.required}
                  optionalLabel={t.common.optional}
                  note={
                    f.wallet
                      ? t.escrow.approverNote
                      : f.key === "contractId"
                        ? t.escrow.contractIdNote
                        : undefined
                  }
                >
                  {f.type === "textarea" ? (
                    <textarea
                      className={inp}
                      rows={2}
                      value={bag[f.key] ?? ""}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.placeholder}
                    />
                  ) : (
                    <input
                      className={inp}
                      type={f.type === "number" ? "number" : f.type === "date" ? "date" : "text"}
                      value={bag[f.key] ?? ""}
                      onChange={(e) => set(f.key, e.target.value)}
                      placeholder={f.wallet ? walletAddress || f.placeholder : f.placeholder}
                      spellCheck={false}
                    />
                  )}
                </Field>
              </div>
            ))}
          </div>

          {/* milestones editor (deploy) */}
          {op.milestones && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={lbl}>milestones</span>
                <button
                  onClick={() =>
                    setMilestones((m) => [
                      ...m,
                      { description: "", receiver: "", amount: "" },
                    ])
                  }
                  className={btn("secondary")}
                >
                  + milestone
                </button>
              </div>
              {milestones.map((m, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-2 items-start rounded-lg border border-border p-2"
                >
                  <input
                    className={`${inp} col-span-12 ${op.milestones === "multi" ? "sm:col-span-6" : "sm:col-span-11"}`}
                    value={m.description}
                    onChange={(e) =>
                      setMilestones((arr) =>
                        arr.map((x, j) =>
                          j === i ? { ...x, description: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="description"
                  />
                  {op.milestones === "multi" && (
                    <>
                      <input
                        className={`${inp} col-span-8 sm:col-span-3`}
                        value={m.receiver}
                        onChange={(e) =>
                          setMilestones((arr) =>
                            arr.map((x, j) =>
                              j === i ? { ...x, receiver: e.target.value } : x,
                            ),
                          )
                        }
                        placeholder="receiver G…"
                        spellCheck={false}
                      />
                      <input
                        className={`${inp} col-span-4 sm:col-span-2`}
                        type="number"
                        value={m.amount}
                        onChange={(e) =>
                          setMilestones((arr) =>
                            arr.map((x, j) =>
                              j === i ? { ...x, amount: e.target.value } : x,
                            ),
                          )
                        }
                        placeholder="amount"
                      />
                    </>
                  )}
                  <button
                    onClick={() =>
                      setMilestones((arr) =>
                        arr.length > 1 ? arr.filter((_, j) => j !== i) : arr,
                      )
                    }
                    className="col-span-12 sm:col-span-1 text-muted-light hover:text-error text-sm"
                    aria-label="remove milestone"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* distributions editor (resolve / withdraw) */}
          {op.distributions && (
            <div className="space-y-2">
              <div className="flex items-center justify-between">
                <span className={lbl}>distributions</span>
                <button
                  onClick={() =>
                    setDistributions((d) => [...d, { address: "", amount: "" }])
                  }
                  className={btn("secondary")}
                >
                  + distribution
                </button>
              </div>
              {distributions.map((d, i) => (
                <div
                  key={i}
                  className="grid grid-cols-12 gap-2 items-center rounded-lg border border-border p-2"
                >
                  <input
                    className={`${inp} col-span-8`}
                    value={d.address}
                    onChange={(e) =>
                      setDistributions((arr) =>
                        arr.map((x, j) =>
                          j === i ? { ...x, address: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="address G…"
                    spellCheck={false}
                  />
                  <input
                    className={`${inp} col-span-3`}
                    type="number"
                    value={d.amount}
                    onChange={(e) =>
                      setDistributions((arr) =>
                        arr.map((x, j) =>
                          j === i ? { ...x, amount: e.target.value } : x,
                        ),
                      )
                    }
                    placeholder="amount"
                  />
                  <button
                    onClick={() =>
                      setDistributions((arr) =>
                        arr.length > 1 ? arr.filter((_, j) => j !== i) : arr,
                      )
                    }
                    className="col-span-1 text-muted-light hover:text-error text-sm"
                    aria-label="remove distribution"
                  >
                    ✕
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* submit */}
          <div className="space-y-2 pt-1">
            {error && <p className="text-xs font-mono text-error">{error}</p>}
            <button
              onClick={submit}
              disabled={!isAuthenticated || inFlight}
              className={`${btn("primary")} w-full sm:w-auto`}
            >
              {!isAuthenticated
                ? t.common.connectWalletToContinue
                : inFlight
                  ? t.escrow.signing
                  : op.label}
            </button>
          </div>
        </div>

        {/* ── right: live code preview + tx state ───────────────────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <details className="rounded-lg border border-border overflow-hidden text-xs">
            <summary className="cursor-pointer px-4 py-2.5 bg-surface border-b border-border font-mono text-muted-light select-none">
              {t.escrow.setupSummary}
            </summary>
            <pre className="p-4 font-mono text-foreground overflow-x-auto whitespace-pre leading-relaxed bg-background">
              {SETUP_NOTE}
            </pre>
          </details>

          <DualCode core={core} react={react} />

          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-light">
                  tx.step
                </span>
                <span
                  className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                    tx.step === "idle"
                      ? "bg-surface text-muted-light"
                      : tx.step === "building"
                        ? "bg-surface text-muted animate-pulse"
                        : tx.step === "built"
                          ? "bg-primary-light text-primary"
                          : tx.step === "signing"
                            ? "bg-warning-light text-warning animate-pulse"
                            : tx.step === "success" || tx.step === "signed"
                              ? "bg-success-light text-success"
                              : "bg-error-light text-error"
                  }`}
                >
                  {tx.step}
                </span>
              </div>
              {tx.step !== "idle" && (
                <button onClick={openTxModal} className={btn("secondary")}>
                  {t.common.viewModal}
                </button>
              )}
            </div>
            <div className="p-4 text-xs font-mono bg-background min-h-12">
              {tx.step === "idle" && (
                <p className="text-muted-light">{t.escrow.txIdle}</p>
              )}
              {"hash" in tx && tx.hash && (
                <div>
                  <p className="text-muted-light mb-1">hash</p>
                  <p className="text-success break-all">{tx.hash}</p>
                </div>
              )}
              {tx.step === "error" && tx.details && (
                <p className="text-error">
                  {typeof tx.details === "string"
                    ? tx.details
                    : JSON.stringify(tx.details, null, 2)}
                </p>
              )}
            </div>
          </div>

          {/* send-transaction response — TW returns the indexed escrow here */}
          {result && (
            <div className="rounded-lg border border-border overflow-hidden">
              <div className="px-4 py-2.5 border-b border-border bg-surface text-xs font-mono text-muted-light">
                send-transaction response
              </div>
              <div className="p-4 text-xs font-mono bg-background overflow-x-auto">
                {result.contractId && (
                  <div className="mb-2">
                    <p className="text-muted-light mb-1">contractId</p>
                    <p className="text-success break-all">
                      {result.contractId}
                    </p>
                  </div>
                )}
                <pre className="whitespace-pre-wrap break-all text-foreground">
                  {JSON.stringify(result, null, 2)}
                </pre>
              </div>
            </div>
          )}

          <FnReference
            title={t.escrow.reactFnsTitle}
            intro={t.escrow.reactFnsIntro}
            fns={t.escrow.reactFns}
          />
          <FnReference
            title={t.escrow.coreFnsTitle}
            intro={t.escrow.coreFnsIntro}
            fns={t.escrow.coreFns}
          />
        </div>
      </div>

      <HelpersPanel walletAddress={walletAddress} />
    </div>
  );
}
