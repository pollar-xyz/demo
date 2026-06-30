"use client";

import { usePollar } from "@pollar/react";
import { createContext, useContext } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// Neko reads live mainnet data (DeFindex vaults, Blend pools) and its on-chain
// actions target Stellar mainnet. On any other Pollar network the section is
// effectively read-only: this shows a banner across every Neko tab, and
// `useNekoMainnet()` lets the wallet buttons disable themselves.
const NekoMainnetContext = createContext(true);

export function useNekoMainnet() {
  return useContext(NekoMainnetContext);
}

export function NekoMainnetGate({ children }: { children: React.ReactNode }) {
  const { network } = usePollar();
  const { t } = useI18n();
  const isMainnet = network === "mainnet";

  return (
    <NekoMainnetContext.Provider value={isMainnet}>
      {!isMainnet && (
        <div className="mb-6 rounded-lg border border-warning-border bg-warning-light px-4 py-3 text-xs text-warning">
          {t.neko.mainnetOnly}
        </div>
      )}
      {children}
    </NekoMainnetContext.Provider>
  );
}
