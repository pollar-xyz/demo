"use client";

import { useSearchParams } from "next/navigation";
import { useCallback } from "react";

// Keeps the `apiKey` query param attached when navigating between routes and
// tabs. The nav hrefs are bare paths, so without this a custom key set via the
// URL is dropped on the first click; `Shell` reads `apiKey` straight from the
// search params, so it has to survive every internal link.
export function useApiKeyHref() {
  const searchParams = useSearchParams();
  const apiKey = searchParams.get("apiKey");

  return useCallback(
    (href: string) => {
      if (!apiKey) return href;
      const [path, hash] = href.split("#");
      const sep = path.includes("?") ? "&" : "?";
      const withKey = `${path}${sep}apiKey=${encodeURIComponent(apiKey)}`;
      return hash ? `${withKey}#${hash}` : withKey;
    },
    [apiKey],
  );
}