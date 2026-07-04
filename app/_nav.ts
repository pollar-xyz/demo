import type { Dictionary } from "./_i18n/translations";
import type { LabGroupKey, LabUnlockState } from "./_labGate";

// Tab labels resolve against t.nav[...]; exclude the nested `groups` object.
export type TabLabel = Exclude<keyof Dictionary["nav"], "groups">;

// Sidebar sections — each renders its own header (from `t.shell[section]`) with
// its groups beneath it. Keys must match a label in the `shell` dictionary.
//   • products      — Pollar's own features + first-party integrations (done
//                     with @pollar/core + the default modals).
//   • walletAdapters — plugging external wallets/auth in as Pollar adapters.
//   • builtWith     — demos of using Pollar alongside another technology.
export type SidebarSection =
  | "products"
  | "integrations"
  | "walletAdapters"
  | "builtWith";

// Render order of the sidebar section headers.
export const SIDEBAR_SECTIONS: SidebarSection[] = [
  "products",
  "integrations",
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
  // Marks the group as recently added: the sidebar shows a "New" badge.
  isNew?: boolean;
  // Gates the group behind its OWN lab passcode (still-in-testing integrations,
  // keyed by group key in app/_labGate.ts). While locked it behaves like
  // `soon: true`; once that group's passcode is entered (see middleware.ts) it
  // flips to `isNew: true` and its content renders normally. `visibleGroups`
  // resolves soon/isNew from the unlock state, so leave those unset on a lab
  // group.
  lab?: boolean;
};

// The sidebar groups. Each group is its own entry; its tabs are the routes
// under it. Selecting a group lands on its first tab. A group is "active" when
// the current path matches one of its tabs (see Shell).
export const ALL_GROUPS: NavGroup[] = [
  // ── Products & integrations ──
  // Authentication comes first: logging in is the entry point every other tab
  // depends on. Login / logout / active-sessions all live here.
  {
    key: "auth",
    section: "products",
    tabs: [
      { href: "/pollar/auth/login", label: "login" },
      { href: "/pollar/auth/logout", label: "logout" },
      { href: "/pollar/auth/sessions", label: "sessions" },
    ],
  },
  {
    key: "pollarWallet",
    section: "products",
    tabs: [
      { href: "/pollar/wallet/send", label: "send" },
      { href: "/pollar/wallet/receive", label: "receive" },
      { href: "/pollar/wallet/balance", label: "balance" },
      { href: "/pollar/wallet/assets", label: "assets" },
      { href: "/pollar/wallet/history", label: "history" },
    ],
  },
  {
    key: "transactions",
    section: "products",
    tabs: [
      { href: "/pollar/transactions", label: "transactions" },
      { href: "/pollar/transactions/sign", label: "signXdr" },
    ],
  },
  {
    key: "distribution",
    section: "products",
    tabs: [{ href: "/pollar/distribution", label: "distribution" }],
  },
  // ── Integrations (its own sidebar section) ──
  {
    key: "kyc",
    section: "integrations",
    soon: true,
    tabs: [{ href: "/pollar/kyc", label: "kyc" }],
  },
  {
    key: "ramp",
    section: "integrations",
    isNew: true,
    tabs: [
      { href: "/pollar/ramp", label: "overview" },
      { href: "/pollar/ramp/implementation", label: "implementation" },
    ],
  },
  {
    key: "swap",
    section: "integrations",
    isNew: true,
    tabs: [
      { href: "/pollar/swap", label: "overview" },
      { href: "/pollar/swap/implementation", label: "implementation" },
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
    isNew: true,
    tabs: [
      { href: "/wallet-adapters/privy", label: "overview" },
      { href: "/wallet-adapters/privy/setup", label: "setup" },
    ],
  },
  {
    key: "acceslyAdapter",
    section: "walletAdapters",
    lab: true,
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
    lab: true,
    tabs: [
      { href: "/built-with-pollar/nirium", label: "overview" },
      { href: "/built-with-pollar/nirium/x402", label: "payments" },
    ],
  },
  {
    key: "cosmosPay",
    section: "builtWith",
    lab: true,
    tabs: [
      { href: "/built-with-pollar/cosmos-pay", label: "overview" },
      { href: "/built-with-pollar/cosmos-pay/pay", label: "payments" },
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
    isNew: true,
    tabs: [
      { href: "/built-with-pollar/lumenwipe", label: "overview" },
      { href: "/built-with-pollar/lumenwipe/wipe", label: "lumenwipe" },
    ],
  },
];

// Every gated group is ALWAYS shown; each stays behind a "Soon" badge +
// ComingSoon overlay (only its overview visible) until ITS OWN passcode is
// entered, then flips to a "New" badge. The "lab" groups (Cosmos Pay, Accesly,
// Nirium) each read their own cookie via `labUnlocked`; Neko keeps its own
// passcode/cookie (`nekoUnlocked`) but now behaves the same way instead of
// hiding entirely. See app/_labGate.ts + app/neko/_gate.ts + middleware.ts.
export function visibleGroups(
  nekoUnlocked: boolean,
  labUnlocked: LabUnlockState,
): NavGroup[] {
  return ALL_GROUPS.map((g) => {
    if (g.key === "neko") {
      return { ...g, soon: !nekoUnlocked, isNew: nekoUnlocked };
    }
    if (!g.lab) return g;
    const unlocked = labUnlocked[g.key as LabGroupKey] ?? false;
    return { ...g, soon: !unlocked, isNew: unlocked };
  });
}
