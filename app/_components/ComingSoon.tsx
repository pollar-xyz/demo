"use client";

// Blur-overlay for sections that aren't live yet (locked lab groups, Neko, KYC…).
// The wrapped content stays rendered (blurred + inert) behind a centered
// "Coming soon" card; the page header should be kept OUTSIDE the wrapper so it
// remains readable.
//
// Easter-egg game: pass a `logo` and it drifts DVD-style around the overlay.
// While the cursor is over the moving logo the overlay lifts (content is
// revealed); it drops back the instant the logo slides out from under the
// pointer — so you have to chase it. Hover is hit-tested each frame against the
// logo's live position (not mouseenter/leave), so it reacts even when the logo
// moves under a still cursor.

import Image from "next/image";
import { useEffect, useRef, useState } from "react";
import { useI18n } from "../_i18n/LanguageProvider";

const LOGO_SIZE = 96; // px

export function ComingSoon({
  children,
  logo,
}: {
  children: React.ReactNode;
  logo?: string;
}) {
  const { t } = useI18n();
  const containerRef = useRef<HTMLDivElement>(null);
  const logoRef = useRef<HTMLDivElement>(null);
  const pointerRef = useRef<{ x: number; y: number } | null>(null);
  const overRef = useRef(false);
  const [revealed, setRevealed] = useState(false);

  useEffect(() => {
    if (!logo) return;
    const container = containerRef.current;
    const el = logoRef.current;
    if (!container || !el) return;

    const start = container.getBoundingClientRect();
    let x = Math.random() * Math.max(1, start.width - LOGO_SIZE);
    let y = Math.random() * Math.max(1, start.height - LOGO_SIZE);
    const speed = 1.5;
    const angle = Math.random() * Math.PI * 2;
    let vx = Math.cos(angle) * speed || speed;
    let vy = Math.sin(angle) * speed || speed;

    let raf = 0;
    const tick = () => {
      const rect = container.getBoundingClientRect();
      const maxX = Math.max(0, rect.width - LOGO_SIZE);
      const maxY = Math.max(0, rect.height - LOGO_SIZE);

      x += vx;
      y += vy;
      if (x <= 0) {
        x = 0;
        vx = Math.abs(vx);
      } else if (x >= maxX) {
        x = maxX;
        vx = -Math.abs(vx);
      }
      if (y <= 0) {
        y = 0;
        vy = Math.abs(vy);
      } else if (y >= maxY) {
        y = maxY;
        vy = -Math.abs(vy);
      }
      el.style.transform = `translate(${x}px, ${y}px)`;

      // Hit-test the pointer against the logo's current position each frame, so
      // the reveal tracks the moving logo even under a stationary cursor.
      const p = pointerRef.current;
      const over =
        !!p &&
        p.x >= rect.left + x &&
        p.x <= rect.left + x + LOGO_SIZE &&
        p.y >= rect.top + y &&
        p.y <= rect.top + y + LOGO_SIZE;
      if (over !== overRef.current) {
        overRef.current = over;
        setRevealed(over);
      }

      raf = requestAnimationFrame(tick);
    };
    raf = requestAnimationFrame(tick);

    const onMove = (e: PointerEvent) => {
      pointerRef.current = { x: e.clientX, y: e.clientY };
    };
    window.addEventListener("pointermove", onMove);
    return () => {
      cancelAnimationFrame(raf);
      window.removeEventListener("pointermove", onMove);
    };
  }, [logo]);

  return (
    <div ref={containerRef} className="relative">
      <div
        inert={!revealed}
        className={
          revealed
            ? "transition-[filter,opacity] duration-200"
            : "pointer-events-none select-none blur-[6px] opacity-60 transition-[filter,opacity] duration-200"
        }
        aria-hidden={!revealed}
      >
        {children}
      </div>

      {!revealed && (
        <div className="pointer-events-none absolute inset-0 z-10 flex items-center justify-center">
          <div className="rounded-2xl bg-background border border-border shadow-xl dark:shadow-black/40 px-10 py-8 text-center max-w-sm">
            <h2 className="text-xl font-bold text-foreground">
              {t.common.comingSoon}
            </h2>
            <p className="text-sm text-muted mt-2">{t.common.comingSoonDesc}</p>
          </div>
        </div>
      )}

      {logo && (
        <div
          ref={logoRef}
          style={{ width: LOGO_SIZE, height: LOGO_SIZE, willChange: "transform" }}
          className="absolute left-0 top-0 z-20 cursor-pointer"
        >
          <Image
            src={logo}
            alt=""
            fill
            sizes="96px"
            draggable={false}
            aria-hidden
            className="pointer-events-none select-none rounded-2xl object-contain drop-shadow-lg"
          />
        </div>
      )}
    </div>
  );
}
