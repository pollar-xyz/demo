"use client";

// Custom dropdown that renders its own listbox (instead of the native OS
// popup) so it matches the demo palette in both light and dark mode.

import { useEffect, useRef, useState } from "react";

export type SelectOption = { value: string; label: string };

export function Select({
  value,
  onChange,
  options,
  placeholder = "Select…",
  className,
}: {
  value: string;
  onChange: (value: string) => void;
  options: SelectOption[];
  placeholder?: string;
  className?: string;
}) {
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape") setOpen(false);
    };
    document.addEventListener("mousedown", onPointerDown);
    document.addEventListener("keydown", onKeyDown);
    return () => {
      document.removeEventListener("mousedown", onPointerDown);
      document.removeEventListener("keydown", onKeyDown);
    };
  }, [open]);

  const selected = options.find((o) => o.value === value);

  return (
    <div ref={ref} className={`relative ${className ?? ""}`}>
      <button
        type="button"
        onClick={() => setOpen((o) => !o)}
        aria-haspopup="listbox"
        aria-expanded={open}
        className={`w-full flex items-center justify-between gap-2 rounded-lg border bg-background px-3 py-2 text-sm font-mono text-foreground outline-none transition-colors ${
          open ? "border-primary" : "border-border focus:border-primary"
        }`}
      >
        <span
          className={`truncate text-left ${selected ? "" : "text-muted-light"}`}
        >
          {selected?.label ?? placeholder}
        </span>
        <svg
          className={`h-4 w-4 shrink-0 text-muted-light transition-transform ${open ? "rotate-180" : ""}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M19 9l-7 7-7-7"
          />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          className="absolute z-30 mt-1.5 w-full max-h-64 overflow-y-auto rounded-lg border border-border bg-background p-1 shadow-lg shadow-black/10"
        >
          {options.map((o) => {
            const isSelected = o.value === value;
            return (
              <li key={o.value} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => {
                    onChange(o.value);
                    setOpen(false);
                  }}
                  className={`w-full flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm font-mono transition-colors ${
                    isSelected
                      ? "bg-primary-light text-primary font-medium"
                      : "text-foreground hover:bg-surface"
                  }`}
                >
                  <span className="truncate">{o.label}</span>
                  {isSelected && (
                    <svg
                      className="h-4 w-4 shrink-0"
                      fill="currentColor"
                      viewBox="0 0 20 20"
                    >
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
