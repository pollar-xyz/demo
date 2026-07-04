"use client";

import { createContext, useContext } from "react";
import { LAB_LOCKED, type LabUnlockState } from "./_labGate";

// Carries the per-group lab-unlock state (read from the cookies server-side in
// the root layout) down to the client nav and landing page, so each gated group
// (Cosmos Pay, Accesly, Nirium) can swap its "Soon"/"New" badge and reveal its
// content without a hydration flash or reading document.cookie itself.
const LabUnlockedContext = createContext<LabUnlockState>(LAB_LOCKED);

export function LabGateProvider({
  unlocked,
  children,
}: {
  unlocked: LabUnlockState;
  children: React.ReactNode;
}) {
  return (
    <LabUnlockedContext.Provider value={unlocked}>
      {children}
    </LabUnlockedContext.Provider>
  );
}

export function useLabUnlocked() {
  return useContext(LabUnlockedContext);
}
