"use client";

import { createContext, useContext } from "react";

// Carries the Accesly unlock state (read from the cookie server-side in the root
// layout) down to the client nav and landing page, so they can show or hide the
// Accesly group without a hydration flash or reading document.cookie themselves.
const AcceslyUnlockedContext = createContext(false);

export function AcceslyGateProvider({
  unlocked,
  children,
}: {
  unlocked: boolean;
  children: React.ReactNode;
}) {
  return (
    <AcceslyUnlockedContext.Provider value={unlocked}>
      {children}
    </AcceslyUnlockedContext.Provider>
  );
}

export function useAcceslyUnlocked() {
  return useContext(AcceslyUnlockedContext);
}
