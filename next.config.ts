import type { NextConfig } from "next";

const nextConfig: NextConfig = {
  async redirects() {
    return [
      // Old flat native routes -> the Pollar native group.
      {
        source:
          "/:tab(transactions|send|receive|history|balance|assets|ramp|kyc|sessions|distribution)",
        destination: "/pollar/:tab",
        permanent: false,
      },
      // Old flat escrow route -> Trustless Work group.
      {
        source: "/escrow",
        destination: "/trustless-work/escrow",
        permanent: false,
      },
      // Group bases -> their first tab.
      {
        source: "/pollar",
        destination: "/pollar/transactions",
        permanent: false,
      },
      {
        source: "/trustless-work",
        destination: "/trustless-work/about",
        permanent: false,
      },
      {
        source: "/lumenwipe",
        destination: "/lumenwipe/about",
        permanent: false,
      },
      { source: "/neko", destination: "/neko/overview", permanent: false },
    ];
  },
};

export default nextConfig;
