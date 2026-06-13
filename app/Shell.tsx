"use client";

import { PollarProvider, WalletButton } from "@pollar/react";
import Image from "next/image";
import Link from "next/link";
import { usePathname, useRouter, useSearchParams } from "next/navigation";
import "@pollar/react/styles.css";
import { useEffect, useState } from "react";
import { ApiKeyModal } from "./_components/ApiKeyModal";
import { OriginNotAllowedModal } from "./_components/OriginNotAllowedModal";
import { LanguageSwitcher } from "./_components/LanguageSwitcher";
import { useI18n } from "./_i18n/LanguageProvider";
import type { Dictionary } from "./_i18n/translations";
import { trustlessWorkAdapter } from "./escrow/adapter";

const DEFAULT_API_KEY = "pub_testnet_703470595eb6cb72c18651b1455fdc34";
const BASE_URL = "https://sdk.api.pollar.xyz";

const NAV_LINKS: { href: string; key: keyof Dictionary["nav"] }[] = [
  { href: "/transactions", key: "transactions" },
  { href: "/send", key: "send" },
  { href: "/receive", key: "receive" },
  { href: "/history", key: "history" },
  { href: "/balance", key: "balance" },
  { href: "/ramp", key: "ramp" },
  { href: "/kyc", key: "kyc" },
  { href: "/escrow", key: "escrow" },
  { href: "/sessions", key: "sessions" },
  { href: "/distribution", key: "distribution" },
  { href: "/lumenwipe", key: "lumenwipe" },
];

function ThemeToggle() {
  const { t } = useI18n();
  const [dark, setDark] = useState(false);

  useEffect(() => {
    setDark(document.documentElement.classList.contains("dark"));
  }, []);

  function toggle() {
    // Read from the DOM, not state — two instances render (mobile + desktop)
    // and only the DOM class is shared between them.
    const next = !document.documentElement.classList.contains("dark");
    setDark(next);
    document.documentElement.classList.toggle("dark", next);
    try {
      localStorage.setItem("pollar-demo-theme", next ? "dark" : "light");
    } catch {}
  }

  return (
    <button
      type="button"
      onClick={toggle}
      aria-label={dark ? t.shell.switchToLight : t.shell.switchToDark}
      className="flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted hover:text-foreground hover:bg-surface transition-colors"
    >
      {dark ? (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 3v1.5m0 15V21m9-9h-1.5m-15 0H3m15.36 6.36l-1.06-1.06M6.7 6.7 5.64 5.64m12.72 0-1.06 1.06M6.7 17.3l-1.06 1.06M16 12a4 4 0 11-8 0 4 4 0 018 0z"
          />
        </svg>
      ) : (
        <svg
          className="h-4 w-4"
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M21.752 15.002A9.718 9.718 0 0118 15.75 9.75 9.75 0 018.25 6c0-1.33.266-2.597.748-3.752A9.753 9.753 0 003 11.25 9.75 9.75 0 0012.75 21a9.753 9.753 0 009.002-5.998z"
          />
        </svg>
      )}
    </button>
  );
}

export function Shell({ children }: { children: React.ReactNode }) {
  const { t } = useI18n();
  const searchParams = useSearchParams();
  const pathname = usePathname();
  const router = useRouter();

  const customKey = searchParams.get("apiKey");
  const apiKey = customKey ?? DEFAULT_API_KEY;
  const isCustomKey = customKey !== null;

  const [keyModalOpen, setKeyModalOpen] = useState(false);
  const [menuOpen, setMenuOpen] = useState(false);
  const [originBlocked, setOriginBlocked] = useState(false);

  // Close the mobile menu when navigating to another tab.
  useEffect(() => {
    setMenuOpen(false);
  }, [pathname]);

  // The SDK fetches `/applications/config` internally and doesn't surface its
  // error, so when a custom key is in use we probe the same endpoint with the
  // same auth header (`x-pollar-api-key`). A 403 ORIGIN_NOT_ALLOWED means this
  // page's origin isn't registered in the app's allowed domains — prompt the
  // user to add it in the dashboard.
  useEffect(() => {
    if (!isCustomKey) return;
    const controller = new AbortController();
    fetch(`${BASE_URL}/v1/applications/config`, {
      headers: { "x-pollar-api-key": apiKey },
      signal: controller.signal,
    })
      .then(async (res) => {
        if (res.status !== 403) {
          setOriginBlocked(false);
          return;
        }
        const body = await res.json().catch(() => null);
        setOriginBlocked(body?.code === "ORIGIN_NOT_ALLOWED");
      })
      .catch(() => {
        // network/abort errors are unrelated to the origin check — ignore.
      });
    return () => controller.abort();
  }, [apiKey, isCustomKey]);

  // Write the key into the URL so PollarProvider picks it up on remount.
  function applyApiKey(next: string) {
    const params = new URLSearchParams(Array.from(searchParams.entries()));
    const trimmed = next.trim();
    if (trimmed) params.set("apiKey", trimmed);
    else params.delete("apiKey");
    const qs = params.toString();
    router.push(qs ? `${pathname}?${qs}` : pathname);
    setKeyModalOpen(false);
  }

  return (
    // `key` forces a fresh PollarProvider (and a new client) whenever the
    // API key changes — the client is otherwise locked at first render.
    <PollarProvider
      key={apiKey}
      client={{ apiKey, baseUrl: BASE_URL }}
      adapters={{ escrow: trustlessWorkAdapter }}
    >
      <header className="bg-background/80 backdrop-blur-sm sticky top-0 z-50 border-b border-border">
        <div className="mx-auto max-w-6xl px-4 sm:px-6 lg:px-8">
          {/* row 1: logo + api key + theme + wallet button */}
          <div className="flex items-center justify-between py-3">
            <Link href="/" className="flex items-center gap-2 sm:gap-3">
              <Image
                src="/logo.png"
                alt="Pollar"
                width={40}
                height={40}
                className="w-8 h-8 sm:w-9 sm:h-9"
              />
              <span className="text-lg sm:text-xl font-bold text-foreground">
                Pollar
              </span>
              <span className="hidden sm:inline-block rounded-md bg-primary-light px-2 py-0.5 text-[10px] font-semibold text-primary uppercase tracking-wider">
                Demo
              </span>
            </Link>
            {/* desktop controls */}
            <div className="hidden sm:flex items-center gap-3">
              <button
                onClick={() => setKeyModalOpen(true)}
                title={t.shell.apiKeyTitle}
                className="flex items-center gap-1.5 rounded-lg border border-border px-2.5 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
              >
                <span
                  className={`inline-block h-1.5 w-1.5 rounded-full ${
                    isCustomKey ? "bg-success" : "bg-muted-light"
                  }`}
                />
                {t.shell.apiKey}
              </button>
              <LanguageSwitcher />
              <ThemeToggle />
              <WalletButton />
            </div>
            {/* mobile: everything collapses behind the hamburger */}
            <button
              type="button"
              onClick={() => setMenuOpen((o) => !o)}
              aria-label={menuOpen ? t.shell.closeMenu : t.shell.openMenu}
              aria-expanded={menuOpen}
              className="sm:hidden flex h-9 w-9 items-center justify-center rounded-lg border border-border text-muted hover:text-foreground hover:bg-surface transition-colors"
            >
              {menuOpen ? (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M6 18L18 6M6 6l12 12"
                  />
                </svg>
              ) : (
                <svg
                  className="h-4 w-4"
                  fill="none"
                  viewBox="0 0 24 24"
                  stroke="currentColor"
                  strokeWidth="2"
                >
                  <path
                    strokeLinecap="round"
                    strokeLinejoin="round"
                    d="M3.75 6.75h16.5m-16.5 5.25h16.5m-16.5 5.25h16.5"
                  />
                </svg>
              )}
            </button>
          </div>
          {/* mobile menu panel */}
          {menuOpen && (
            <div className="sm:hidden flex flex-col gap-3 border-t border-border py-3">
              <WalletButton />
              <div className="flex items-center gap-2">
                <button
                  onClick={() => {
                    setKeyModalOpen(true);
                    setMenuOpen(false);
                  }}
                  title={t.shell.apiKeyTitle}
                  className="flex flex-1 h-9 items-center justify-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
                >
                  <span
                    className={`inline-block h-1.5 w-1.5 rounded-full ${
                      isCustomKey ? "bg-success" : "bg-muted-light"
                    }`}
                  />
                  {t.shell.apiKey}
                </button>
                <LanguageSwitcher />
                <ThemeToggle />
              </div>
            </div>
          )}
          {/* row 2: feature tabs (scrollable on mobile) */}
          <nav className="flex items-center gap-5 sm:gap-6 overflow-x-auto scrollbar-none [&::-webkit-scrollbar]:hidden">
            {NAV_LINKS.map(({ href, key }) => (
              <Link
                key={href}
                href={href}
                className={`shrink-0 whitespace-nowrap text-xs sm:text-sm font-medium py-2.5 border-b-2 transition-colors ${
                  pathname === href
                    ? "border-primary text-primary font-semibold"
                    : "border-transparent text-muted hover:text-foreground"
                }`}
              >
                {t.nav[key]}
              </Link>
            ))}
          </nav>
        </div>
      </header>
      <main className="mx-auto max-w-6xl px-4 py-6 sm:px-6 sm:py-10 lg:px-8">
        {children}
      </main>

      {keyModalOpen && (
        <ApiKeyModal
          currentKey={apiKey}
          isCustom={isCustomKey}
          onClose={() => setKeyModalOpen(false)}
          onSave={applyApiKey}
        />
      )}

      {originBlocked && isCustomKey && (
        <OriginNotAllowedModal
          origin={typeof window !== "undefined" ? window.location.origin : ""}
          onClose={() => setOriginBlocked(false)}
        />
      )}
    </PollarProvider>
  );
}
