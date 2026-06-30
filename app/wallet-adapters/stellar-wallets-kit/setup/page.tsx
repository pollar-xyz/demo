"use client";

import { type ReactNode, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { CodePanel } from "@/app/_components/CodePanels";
import { SdkToggle, type Sdk } from "@/app/_components/SdkDocs";
import { kitDict } from "./_i18n";

// Minimal inline-code renderer: turns `code` spans in the localized prose into
// <code> elements, so docs strings can reference identifiers inline.
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

const INSTALL_CODE =
  "pnpm add @pollar/stellar-wallets-kit-adapter @creit.tech/stellar-wallets-kit";

const CORE_CODE = `import { PollarClient } from '@pollar/core';
import { stellarWalletsKitAdapters } from '@pollar/stellar-wallets-kit-adapter';
import { Networks } from '@creit.tech/stellar-wallets-kit';

// One adapter per kit wallet (Freighter, Albedo, xBull, Lobstr, …).
const walletAdapters = stellarWalletsKitAdapters({
  network: Networks.TESTNET,
});

const client = new PollarClient({
  apiKey: 'pub_testnet_…',
  stellarNetwork: 'testnet',
  walletAdapters,
});

// Start a login for a specific wallet (id === adapter.type):
client.login({ provider: 'freighter' });`;

const REACT_CODE = `import { PollarProvider } from '@pollar/react';
import { stellarWalletsKitAdapters } from '@pollar/stellar-wallets-kit-adapter';
import { Networks } from '@creit.tech/stellar-wallets-kit';

const walletAdapters = stellarWalletsKitAdapters({
  network: Networks.TESTNET,
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PollarProvider
      client={{
        apiKey: 'pub_testnet_…',
        stellarNetwork: 'testnet',
        walletAdapters,
      }}
    >
      {children}
    </PollarProvider>
  );
}

// The built-in LoginModal auto-renders one button per adapter (from its meta).`;

export default function StellarWalletsKitPage() {
  const { locale } = useI18n();
  const tt = kitDict[locale];

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
