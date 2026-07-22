"use client";

import type { WalletChain } from "@pollar/core";
import { resolveChain } from "@pollar/react";

// A chain reads as a label, not as a color: three neutral chips stay legible in
// both themes and don't borrow the success/warning tokens for something that is
// neither. `resolveChain` is the SDK's own rule that an absent chain means
// Stellar — rows and sessions minted before multichain carry none.
export function ChainBadge({ chain }: { chain?: WalletChain }) {
  return (
    <span className="inline-block rounded border border-border px-1.5 py-0.5 text-[10px] font-mono uppercase tracking-wide text-muted">
      {resolveChain(chain)}
    </span>
  );
}
