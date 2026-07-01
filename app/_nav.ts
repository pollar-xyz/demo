import type { Dictionary } from "./_i18n/translations";

// Tab labels resolve against t.nav[...]; exclude the nested `groups` object.
export type TabLabel = Exclude<keyof Dictionary["nav"], "groups">;

// Sidebar sections — each renders its own header (from `t.shell[section]`) with
// its groups beneath it. Keys must match a label in the `shell` dictionary.
//   • products      — Pollar's own features + first-party integrations (done
//                     with @pollar/core + the default modals).
//   • walletAdapters — plugging external wallets/auth in as Pollar adapters.
//   • builtWith     — demos of using Pollar alongside another technology.
export type SidebarSection = "products" | "walletAdapters" | "builtWith";

// Render order of the sidebar section headers.
export const SIDEBAR_SECTIONS: SidebarSection[] = [
  "products",
  "walletAdapters",
  "builtWith",
];

export type NavGroup = {
  key: keyof Dictionary["nav"]["groups"];
  section: SidebarSection;
  tabs: { href: string; label: TabLabel }[];
  // Marks the group as not-yet-live: the sidebar shows a "Soon" badge and the
  // pages blur their content behind the ComingSoon overlay.
  soon?: boolean;
};

// The sidebar groups. Each group is its own entry; its tabs are the routes
// under it. Selecting a group lands on its first tab. A group is "active" when
// the current path matches one of its tabs (see Shell).
export const ALL_GROUPS: NavGroup[] = [
  // ── Products & integrations ──
  {
    key: "pollarWallet",
    section: "products",
    tabs: [
      { href: "/pollar/send", label: "send" },
      { href: "/pollar/receive", label: "receive" },
      { href: "/pollar/balance", label: "balance" },
      { href: "/pollar/assets", label: "assets" },
      { href: "/pollar/history", label: "history" },
    ],
  },
  {
    key: "transactions",
    section: "products",
    tabs: [{ href: "/pollar/transactions", label: "transactions" }],
  },
  {
    key: "sessions",
    section: "products",
    tabs: [{ href: "/pollar/sessions", label: "sessions" }],
  },
  {
    key: "distribution",
    section: "products",
    tabs: [{ href: "/pollar/distribution", label: "distribution" }],
  },
  {
    key: "integrations",
    section: "products",
    tabs: [
      { href: "/pollar/kyc", label: "kyc" },
      { href: "/pollar/ramp", label: "ramp" },
      { href: "/pollar/anclap", label: "anclap" },
      { href: "/pollar/swap", label: "swap" },
      { href: "/pollar/soroswap", label: "soroswap" },
    ],
  },

  // ── Wallet adapters ──
  {
    key: "stellarWalletsKit",
    section: "walletAdapters",
    tabs: [
      { href: "/wallet-adapters/stellar-wallets-kit", label: "overview" },
      { href: "/wallet-adapters/stellar-wallets-kit/setup", label: "setup" },
    ],
  },
  {
    key: "privy",
    section: "walletAdapters",
    tabs: [
      { href: "/wallet-adapters/privy", label: "overview" },
      { href: "/wallet-adapters/privy/setup", label: "setup" },
    ],
  },
  {
    key: "acceslyAdapter",
    section: "walletAdapters",
    soon: true,
    tabs: [
      { href: "/wallet-adapters/accesly", label: "overview" },
      { href: "/wallet-adapters/accesly/setup", label: "setup" },
    ],
  },

  // ── Built with Pollar ──
  {
    key: "trustlessWork",
    section: "builtWith",
    tabs: [
      { href: "/built-with-pollar/trustless-work", label: "overview" },
      { href: "/built-with-pollar/trustless-work/escrow", label: "escrow" },
    ],
  },
  {
    key: "nirium",
    section: "builtWith",
    tabs: [
      { href: "/built-with-pollar/nirium", label: "overview" },
      { href: "/built-with-pollar/nirium/x402", label: "payments" },
    ],
  },
  {
    key: "neko",
    section: "builtWith",
    tabs: [
      { href: "/neko/overview", label: "overview" },
      { href: "/neko/dashboard", label: "dashboard" },
      { href: "/neko/pools", label: "pools" },
      { href: "/neko/vaults", label: "vaults" },
    ],
  },
  {
    key: "lumenwipe",
    section: "builtWith",
    tabs: [
      { href: "/built-with-pollar/lumenwipe", label: "overview" },
      { href: "/built-with-pollar/lumenwipe/wipe", label: "lumenwipe" },
    ],
  },
];

// The Neko Protocol group is hidden until the section is unlocked at runtime
// (see app/neko/_gate.ts + middleware.ts); the unlocked state comes from a
// cookie.
export function visibleGroups(nekoUnlocked: boolean): NavGroup[] {
  return ALL_GROUPS.filter((g) => {
    if (g.key === "neko") return nekoUnlocked;
    return true;
  });
}
