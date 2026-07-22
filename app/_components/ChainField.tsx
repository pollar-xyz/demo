"use client";

// The SDK's own <ChainSelect> is styled by @pollar/react/dist/index.css, which
// this demo never imports — dropped into these Tailwind pages it renders as a
// bare native select with no border. So the working forms use the demo's own
// Select, which already dresses every other picker on the page; the chains tab
// keeps the real ChainSelect, since documenting it is that page's whole point
// (see the shim in globals.css that gives it a border there).

import type { WalletChain } from "@pollar/core";
import { Select } from "./Select";

// Matches the labels the SDK's own picker shows.
const CHAIN_LABEL: Record<WalletChain, string> = {
  STELLAR: "Stellar",
  SOLANA: "Solana",
  POLYGON: "Polygon",
};

export function ChainField({
  label,
  value,
  options,
  onChange,
}: {
  label: string;
  value: WalletChain | null;
  options: WalletChain[];
  onChange: (chain: WalletChain) => void;
}) {
  // ChainSelect's own rule: one option is not a choice, so a single-chain app
  // renders no picker at all rather than a control that can't do anything.
  if (options.length <= 1) return null;

  return (
    <div>
      <label className="block text-xs font-mono text-muted mb-1">{label}</label>
      <Select
        value={value ?? ""}
        onChange={(next) => onChange(next as WalletChain)}
        options={options.map((chain) => ({
          value: chain,
          label: CHAIN_LABEL[chain],
        }))}
      />
    </div>
  );
}
