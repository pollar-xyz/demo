import type { Dictionary } from "./_i18n/translations";
import type { LabGroupKey, LabUnlockState } from "./_labGate";

// Tab labels resolve against t.nav[...]; exclude the nested `groups` object.
export type TabLabel = Exclude<keyof Dictionary["nav"], "groups">;

// Sidebar sections — each renders its own header (from `t.shell[section]`) with
// its groups beneath it. Keys must match a label in the `shell` dictionary.
//   • products      — Pollar's own features + first-party integrations (done
//                     with @pollar/core + the default modals).
//   • walletAdapters — plugging external wallets/auth in as Pollar adapters.
//   • adapters      — third-party protocols wired in as Pollar adapters via
//                     createPollarAdapterHook (Trustless Work, Nirium, Cosmos Pay).
//   • builtWith     — demos of using Pollar alongside another technology.
export type SidebarSection =
  | "products"
  | "integrations"
  | "walletAdapters"
  | "adapters"
  | "builtWith";

// Render order of the sidebar section headers.
export const SIDEBAR_SECTIONS: SidebarSection[] = [
  "products",
  "integrations",
  "walletAdapters",
  "adapters",
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
      { href: "/pollar/wallet/chains", label: "chains" },
      { href: "/pollar/wallet/assets", label: "assets" },
      { href: "/pollar/wallet/history", label: "history" },
      { href: "/pollar/wallet/distribution", label: "distribution" },
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
  {
    key: "earn",
    section: "integrations",
    isNew: true,
    tabs: [
      { href: "/pollar/earn", label: "overview" },
      { href: "/pollar/earn/implementation", label: "implementation" },
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
    key: "cosmosWallet",
    section: "walletAdapters",
    isNew: true,
    tabs: [
      { href: "/wallet-adapters/cosmos-wallet", label: "overview" },
      { href: "/wallet-adapters/cosmos-wallet/setup", label: "setup" },
      { href: "/wallet-adapters/cosmos-wallet/test", label: "test" },
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

  // ── Adapters (third-party protocols wired in via createPollarAdapterHook) ──
  {
    key: "trustlessWork",
    section: "adapters",
    tabs: [
      { href: "/adapters/trustless-work", label: "overview" },
      { href: "/adapters/trustless-work/escrow", label: "implementation" },
      { href: "/adapters/trustless-work/adapter", label: "adapter" },
    ],
  },
  {
    key: "nirium",
    section: "adapters",
    lab: true,
    tabs: [
      { href: "/adapters/nirium", label: "overview" },
      { href: "/adapters/nirium/x402", label: "implementation" },
      { href: "/adapters/nirium/adapter", label: "adapter" },
    ],
  },
  {
    key: "cosmosPay",
    section: "adapters",
    lab: true,
    tabs: [
      { href: "/adapters/cosmos-pay", label: "overview" },
      { href: "/adapters/cosmos-pay/pay", label: "implementation" },
      { href: "/adapters/cosmos-pay/adapter", label: "adapter" },
    ],
  },

  // ── Built with Pollar ──
  {
    key: "neko",
    section: "builtWith",
    tabs: [
      { href: "/neko/overview", label: "overview" },
      { href: "/neko/dashboard", label: "dashboard" },
      { href: "/neko/discover", label: "discover" },
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
  {
    key: "hedgepay",
    section: "builtWith",
    soon: true,
    tabs: [{ href: "/built-with-pollar/hedgepay", label: "overview" }],
  },
  {
    key: "vaquita",
    section: "builtWith",
    soon: true,
    tabs: [{ href: "/built-with-pollar/vaquita", label: "overview" }],
  },
  {
    key: "humanWeb",
    section: "builtWith",
    soon: true,
    tabs: [{ href: "/built-with-pollar/human-web", label: "overview" }],
  },
  {
    key: "e4c",
    section: "builtWith",
    soon: true,
    tabs: [{ href: "/built-with-pollar/e4c", label: "overview" }],
  },
];

// The "lab" groups (Cosmos Pay, Accesly, Nirium) are ALWAYS shown; each stays
// behind a "Soon" badge + ComingSoon overlay (only its overview visible) until
// ITS OWN passcode is entered, then flips to a "New" badge. They read their own
// cookie via `labUnlocked`. Neko is the ONE exception: it keeps its own
// passcode/cookie (`nekoUnlocked`) and is hidden from the sidebar entirely
// while locked, only appearing (as a "New" group) once unlocked.
// See app/_labGate.ts + app/neko/_gate.ts + middleware.ts.
// Temporary flag: while true, every group that resolves to a "Soon" state is
// hidden from the sidebar — KYC is the one exception we keep on show. Flip to
// false to bring the full "Soon" list back. Note this also hides the lab groups
// (Cosmos Pay, Nirium, Accesly) while they're locked, since those render as
// "Soon" too; entering their passcode (URL/middleware) still unlocks them.
const HIDE_SOON_GROUPS = true;

export function visibleGroups(
  nekoUnlocked: boolean,
  labUnlocked: LabUnlockState,
): NavGroup[] {
  return ALL_GROUPS.flatMap((g) => {
    if (g.key === "neko") {
      // Hidden completely until its passcode is entered.
      return nekoUnlocked ? [{ ...g, soon: false, isNew: true }] : [];
    }
    if (!g.lab) return [g];
    const unlocked = labUnlocked[g.key as LabGroupKey] ?? false;
    return [{ ...g, soon: !unlocked, isNew: unlocked }];
  }).filter((g) => !HIDE_SOON_GROUPS || !g.soon || g.key === "kyc");
}
