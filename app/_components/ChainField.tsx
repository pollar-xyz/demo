"use client";

// The SDK's own <ChainSelect> is a native select whose colors come from
// --pollar-* properties the SDK only sets inside its prebuilt modals, and whose
// scale (44px, 1rem) belongs to those modals too. Even once those are supplied
// (see .pollar-scope in globals.css) it still reads as an OS dropdown next to
// the demo's custom Token picker sitting right below it.
//
// So the working forms use the demo's own Select for a matching pair, and the
// chains tab keeps the real ChainSelect, since documenting it is its point.

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
