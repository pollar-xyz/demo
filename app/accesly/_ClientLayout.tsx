"use client";

import { AcceslyProvider } from "@accesly/react";
import { useEffect, useState } from "react";

const ACCESLY_APP_ID = "pollar-demo";

export function AcceslyClientLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  const [mounted, setMounted] = useState(false);
  useEffect(() => setMounted(true), []);

  if (!mounted) {
    return (
      <div className="flex min-h-40 items-center justify-center text-sm text-muted">
        …
      </div>
    );
  }

  return (
    <AcceslyProvider appId={ACCESLY_APP_ID} env="dev">
      {children}
    </AcceslyProvider>
  );
}
