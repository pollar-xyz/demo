import { NekoMainnetGate } from "./_MainnetGate";

// The Neko Protocol section is now ALWAYS reachable, but — like the lab groups —
// it stays behind the ComingSoon overlay (only its overview showing, sub-tabs
// hidden) until it's unlocked with `?neko=<passcode>`. middleware.ts validates
// the passcode server-side and sets the unlock cookie the nav reads; the
// blur/overlay + sub-tab hiding are applied by the Shell. Here we only keep the
// mainnet banner gate that every Neko tab shares.
export default function NekoLayout({
  children,
}: {
  children: React.ReactNode;
}) {
  return <NekoMainnetGate>{children}</NekoMainnetGate>;
}
