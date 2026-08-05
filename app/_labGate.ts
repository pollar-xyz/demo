// Runtime gates for the still-in-testing "lab" integrations. Each one has its
// OWN passcode, cookie and URL param, so they can be handed out independently —
// unlocking Cosmos Pay doesn't reveal Accesly or Nirium, and vice-versa.
//
// Unlike the Neko section (hidden entirely until unlocked), a lab group ALWAYS
// appears in the nav — but until its passcode is entered it shows a "Soon" badge
// and its pages sit behind the ComingSoon overlay. Visiting any URL with
// `?<param>=<passcode>` unlocks that one gate: the passcode is validated
// server-side in middleware.ts against its server-only env var, which sets the
// matching cookie. The cookies are plain boolean markers — no passcode ever
// reaches the client. Once unlocked, the group swaps its "Soon" badge for "New"
// and renders its content normally.
//
// A gate key is usually a nav GROUP key, but it can also gate a single TAB
// inside an otherwise-public group (see `tabs[].lab` in app/_nav.ts). Nothing
// uses the per-tab form right now — Abroad, which introduced it, is instead
// simply unlisted (`tabs[].hidden`), with its route left open.
//
//   gate key         URL param   cookie              env var (server-only)
//   ───────────────  ──────────  ──────────────────  ─────────────────────
//   cosmosPay        ?cosmos=    cosmos_unlocked     COSMOS_PAY_PASSCODE
//   acceslyAdapter   ?accesly=   accesly_unlocked    ACCESLY_PASSCODE
//   nirium           ?nirium=    nirium_unlocked     NIRIUM_PASSCODE

export const LAB_GROUP_KEYS = [
  "cosmosPay",
  "acceslyAdapter",
  "nirium",
] as const;

export type LabGroupKey = (typeof LAB_GROUP_KEYS)[number];

export const LAB_GATES = {
  cosmosPay: { param: "cosmos", cookie: "cosmos_unlocked" },
  acceslyAdapter: { param: "accesly", cookie: "accesly_unlocked" },
  nirium: { param: "nirium", cookie: "nirium_unlocked" },
} as const satisfies Record<LabGroupKey, { param: string; cookie: string }>;

export const LAB_COOKIE_VALUE = "1";

// Per-gate unlock state, keyed by nav group key (or tab gate key).
export type LabUnlockState = Record<LabGroupKey, boolean>;

// Everything locked — the default before any cookie is read.
export const LAB_LOCKED: LabUnlockState = LAB_GROUP_KEYS.reduce(
  (acc, key) => ({ ...acc, [key]: false }),
  {} as LabUnlockState,
);
