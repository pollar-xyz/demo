import type { Dictionary } from "./_i18n/translations";

// Tab labels resolve against t.nav[...]; exclude the nested `groups` object.
export type TabLabel = Exclude<keyof Dictionary["nav"], "groups">;

export type NavGroup = {
  key: keyof Dictionary["nav"]["groups"];
  basePath: string;
  tabs: { href: string; label: TabLabel }[];
};

// The sidebar groups. Each group is its own route prefix; its tabs are the
// subroutes under it. Selecting a group lands on its first tab.
export const GROUPS: NavGroup[] = [
  {
    key: "pollarNative",
    basePath: "/pollar",
    tabs: [
      { href: "/pollar/transactions", label: "transactions" },
      { href: "/pollar/send", label: "send" },
      { href: "/pollar/receive", label: "receive" },
      { href: "/pollar/history", label: "history" },
      { href: "/pollar/balance", label: "balance" },
      { href: "/pollar/assets", label: "assets" },
      { href: "/pollar/ramp", label: "ramp" },
      { href: "/pollar/kyc", label: "kyc" },
      { href: "/pollar/sessions", label: "sessions" },
      { href: "/pollar/distribution", label: "distribution" },
    ],
  },
  {
    key: "trustlessWork",
    basePath: "/trustless-work",
    tabs: [
      { href: "/trustless-work/about", label: "overview" },
      { href: "/trustless-work/escrow", label: "escrow" },
    ],
  },
  {
    key: "lumenwipe",
    basePath: "/lumenwipe",
    tabs: [
      { href: "/lumenwipe/about", label: "overview" },
      { href: "/lumenwipe/wipe", label: "lumenwipe" },
    ],
  },
  {
    key: "nekoProtocol",
    basePath: "/neko",
    tabs: [
      { href: "/neko/overview", label: "overview" },
      { href: "/neko/dashboard", label: "dashboard" },
    ],
  },
];
