"use client";

import { type ReactNode, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { CodePanel } from "@/app/_components/CodePanels";
import { SdkToggle, type Sdk } from "@/app/_components/SdkDocs";
import { solanaDict } from "./_i18n";

function md(text: string): ReactNode[] {
  return text.split(/(`[^`]+`)/g).map((part, i) =>
    part.startsWith("`") && part.endsWith("`") ? (
      <code
        key={i}
        className="rounded bg-surface px-1 py-0.5 font-mono text-[0.85em] text-foreground"
      >
        {part.slice(1, -1)}
      </code>
    ) : (
      part
    ),
  );
}

const INSTALL_CODE = "pnpm add @pollar/solana-wallet-standard-adapter";

const CORE_CODE = `import { PollarClient } from '@pollar/core';
import { solanaWalletStandardAdapters } from '@pollar/solana-wallet-standard-adapter';

// One adapter per installed Solana wallet (Phantom, Solflare, Backpack, …).
// Returns [] on the server: build the client in the browser.
const walletAdapters = solanaWalletStandardAdapters();

const client = new PollarClient({
  apiKey: 'pub_testnet_…',
  walletAdapters,
});

// Start a SIWS login for a specific wallet (id === adapter.type):
client.login({ provider: walletAdapters[0].type });`;

const REACT_CODE = `import { PollarProvider } from '@pollar/react';
import { solanaWalletStandardAdapters } from '@pollar/solana-wallet-standard-adapter';
import { stellarWalletsKitAdapters } from '@pollar/stellar-wallets-kit-adapter';
import { Networks } from '@creit.tech/stellar-wallets-kit';
import { useMemo } from 'react';

export function Providers({ children }: { children: React.ReactNode }) {
  // Stellar and Solana wallets share one flat list.
  const walletAdapters = useMemo(
    () => [
      ...stellarWalletsKitAdapters({ network: Networks.TESTNET }),
      ...solanaWalletStandardAdapters(),
    ],
    [],
  );

  return (
    <PollarProvider client={{ apiKey: 'pub_testnet_…', walletAdapters }}>
      {children}
    </PollarProvider>
  );
}

// The built-in LoginModal shows a "Solana Wallet" gateway next to the Stellar one.`;

export default function SolanaWalletStandardPage() {
  const { locale } = useI18n();
  const tt = solanaDict[locale];

  const [sdk, setSdk] = useState<Sdk>("react");

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">
        {/* ── left: toggle + matching docs ───────────────────────────────── */}
        <div className="space-y-4">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
              {tt.title}
            </h1>
            <p className="text-sm text-muted mt-1.5">{tt.subtitle}</p>
          </div>

          <SdkToggle value={sdk} onChange={setSdk} />

          <p className="text-sm text-muted leading-relaxed">
            {md(sdk === "react" ? tt.reactDesc : tt.coreDesc)}
          </p>

          <div className="space-y-2 pt-1">
            <p className="text-xs font-medium text-muted">{tt.notesTitle}</p>
            <ul className="space-y-2">
              {tt.notes.map((note, i) => (
                <li
                  key={i}
                  className="flex gap-2 text-xs text-muted-light leading-relaxed"
                >
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{md(note)}</span>
                </li>
              ))}
            </ul>
          </div>
        </div>

        {/* ── right: install + matching code panel ────────────────────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">
          <CodePanel sdk="terminal" code={INSTALL_CODE} />
          {sdk === "core" ? (
            <CodePanel
              sdk="@pollar/core"
              note="framework-agnostic"
              code={CORE_CODE}
            />
          ) : (
            <CodePanel
              sdk="@pollar/react"
              note="hooks & components"
              code={REACT_CODE}
            />
          )}
        </div>
      </div>
    </div>
  );
}
