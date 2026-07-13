"use client";

// Shared presentational primitives for the Neko section. They recreate the
// look of the real Neko app (gradient hero banners, stat cards, token badges,
// pill tabs) using the demo's own Tailwind design tokens (primary / surface /
// muted / border …) so the section stays visually consistent with the rest of
// the Pollar demo.

import type { ReactNode } from "react";
import { colorForSymbol } from "./_assets";

// ─── banner ───────────────────────────────────────────────────────────────
export function NekoBanner({
  eyebrow,
  title,
  desc,
}: {
  eyebrow: string;
  title: string;
  desc: string;
}) {
  return (
    <div className="relative overflow-hidden rounded-2xl bg-gradient-to-br from-primary to-primary-hover px-6 py-8 sm:px-8 sm:py-10">
      {/* decorative coin-like rings (CSS only, no external art) */}
      <div className="pointer-events-none absolute -right-6 -top-10 h-52 w-52 rounded-full bg-white/10 blur-xl" />
      <div className="pointer-events-none absolute right-10 -bottom-16 h-44 w-44 rounded-full bg-black/10" />
      <div className="pointer-events-none absolute right-28 top-6 h-24 w-24 rounded-full border border-white/20" />
      <div className="relative space-y-2">
        <span className="inline-flex items-center rounded-full bg-white/15 px-3 py-1 text-[11px] font-semibold text-white backdrop-blur-sm">
          {eyebrow}
        </span>
        <h1 className="text-2xl font-bold tracking-tight text-white sm:text-3xl">
          {title}
        </h1>
        <p className="max-w-xl text-sm text-white/80">{desc}</p>
      </div>
    </div>
  );
}

// ─── stat card ──────────────────────────────────────────────────────────────
export function StatCard({
  label,
  value,
  icon,
  valueClass = "text-foreground",
}: {
  label: string;
  value: ReactNode;
  icon?: ReactNode;
  valueClass?: string;
}) {
  return (
    <div className="rounded-2xl border border-border bg-background p-5">
      <div className="flex items-start justify-between gap-3">
        <p className="text-xs font-medium text-muted">{label}</p>
        {icon && (
          <span className="flex h-7 w-7 items-center justify-center rounded-lg bg-surface text-muted">
            {icon}
          </span>
        )}
      </div>
      <p className={`mt-3 text-2xl font-bold tracking-tight ${valueClass}`}>
        {value}
      </p>
    </div>
  );
}

// ─── token badge ────────────────────────────────────────────────────────────
export function TokenBadge({
  symbol,
  size = 32,
}: {
  symbol: string;
  size?: number;
}) {
  const label = symbol.replace(/[^A-Za-z0-9]/g, "").slice(0, 3) || "?";
  const fontSize = label.length > 2 ? size * 0.3 : size * 0.36;
  return (
    <span
      style={{
        width: size,
        height: size,
        backgroundColor: colorForSymbol(symbol),
        fontSize,
      }}
      className="inline-flex shrink-0 items-center justify-center rounded-full font-bold uppercase leading-none text-white"
      title={symbol}
    >
      {label}
    </span>
  );
}

// A pool/pair shown as up to two overlapping token badges.
export function TokenBadges({
  symbols,
  size = 28,
}: {
  symbols: string[];
  size?: number;
}) {
  const shown = symbols.slice(0, 2);
  return (
    <span className="inline-flex items-center">
      {shown.map((s, i) => (
        <span
          key={s + i}
          style={{ marginLeft: i === 0 ? 0 : -size * 0.35, zIndex: 2 - i }}
          className="rounded-full ring-2 ring-background"
        >
          <TokenBadge symbol={s} size={size} />
        </span>
      ))}
    </span>
  );
}

// ─── pill tabs ──────────────────────────────────────────────────────────────
export function TabSwitch<T extends string>({
  options,
  value,
  onChange,
}: {
  options: { value: T; label: string; count?: number }[];
  value: T;
  onChange: (v: T) => void;
}) {
  return (
    <div className="flex flex-wrap items-center gap-2">
      {options.map((o) => {
        const active = o.value === value;
        return (
          <button
            key={o.value}
            onClick={() => onChange(o.value)}
            className={`inline-flex items-center gap-1.5 rounded-full px-3.5 py-1.5 text-xs font-medium transition-colors ${
              active
                ? "bg-primary text-white"
                : "border border-border text-muted hover:text-foreground"
            }`}
          >
            {o.label}
            {o.count != null && (
              <span
                className={`rounded-full px-1.5 text-[10px] font-semibold ${
                  active ? "bg-white/20 text-white" : "bg-surface text-muted"
                }`}
              >
                {o.count}
              </span>
            )}
          </button>
        );
      })}
    </div>
  );
}

// A small colored category/label chip.
export function Chip({
  children,
  tone = "muted",
}: {
  children: ReactNode;
  tone?: "muted" | "primary" | "success";
}) {
  const cls =
    tone === "primary"
      ? "bg-primary-light text-primary"
      : tone === "success"
        ? "bg-success-light text-success"
        : "bg-surface text-muted";
  return (
    <span
      className={`inline-flex items-center rounded-md px-1.5 py-0.5 text-[10px] font-semibold ${cls}`}
    >
      {children}
    </span>
  );
}
