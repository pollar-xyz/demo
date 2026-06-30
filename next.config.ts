import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  // Allow the Caddy-proxied dev host (https://demo.local.pollar.xyz) to reach
  // the dev server's internal endpoints (HMR, server actions, etc.).
  allowedDevOrigins: ["demo.local.pollar.xyz"],
  async redirects() {
    return [
      // Old flat native routes -> the Pollar native group.
      {
        source:
          "/:tab(transactions|send|receive|history|balance|assets|ramp|kyc|sessions|distribution)",
        destination: "/pollar/:tab",
        permanent: false,
      },
      // Old "Built with Pollar" routes -> the standardized /built-with-pollar
      // group (overview now lives at each group root, mirroring wallet-adapters).
      // More specific sources must come before their group root.
      {
        source: "/escrow",
        destination: "/built-with-pollar/trustless-work/escrow",
        permanent: false,
      },
      {
        source: "/trustless-work/escrow",
        destination: "/built-with-pollar/trustless-work/escrow",
        permanent: false,
      },
      {
        source: "/trustless-work/about",
        destination: "/built-with-pollar/trustless-work",
        permanent: false,
      },
      {
        source: "/trustless-work",
        destination: "/built-with-pollar/trustless-work",
        permanent: false,
      },
      {
        source: "/lumenwipe/wipe",
        destination: "/built-with-pollar/lumenwipe/wipe",
        permanent: false,
      },
      {
        source: "/lumenwipe/about",
        destination: "/built-with-pollar/lumenwipe",
        permanent: false,
      },
      {
        source: "/lumenwipe",
        destination: "/built-with-pollar/lumenwipe",
        permanent: false,
      },
      {
        source: "/nirium/about",
        destination: "/built-with-pollar/nirium",
        permanent: false,
      },
      {
        source: "/nirium",
        destination: "/built-with-pollar/nirium",
        permanent: false,
      },
      // Group bases -> their first tab.
      {
        source: "/pollar",
        destination: "/pollar/transactions",
        permanent: false,
      },
      { source: "/neko", destination: "/neko/overview", permanent: false },
      {
        source: "/accesly",
        destination: "/accesly/overview",
        permanent: false,
      },
    ];
  },
};

export default nextConfig;
