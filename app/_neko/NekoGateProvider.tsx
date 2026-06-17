"use client";

import { createContext, useContext } from "react";

// Carries the Neko unlock state (read from the cookie server-side in the root
// layout) down to the client nav and landing page, so they can show or hide the
// Neko group without a hydration flash or reading document.cookie themselves.
const NekoUnlockedContext = createContext(false);

export function NekoGateProvider({
  unlocked,
  children,
}: {
  unlocked: boolean;
  children: React.ReactNode;
}) {
  return (
    <NekoUnlockedContext.Provider value={unlocked}>
      {children}
    </NekoUnlockedContext.Provider>
  );
}

export function useNekoUnlocked() {
  return useContext(NekoUnlockedContext);
}
