"use client";

import { type ReactNode, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { CodePanel } from "@/app/_components/CodePanels";
import { SdkToggle, type Sdk } from "@/app/_components/SdkDocs";
import { cosmosWalletSetupDict } from "./_i18n";

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

// The adapter itself — the only thing you actually have to write. Trimmed to
// the four methods Pollar calls; the full version (network guard, ready-event
// wait) lives in app/wallet-adapters/cosmos-wallet/adapter.ts.
const ADAPTER_CODE = `import type {
  ConnectWalletResponse,
  SignTransactionOptions,
  SignTransactionResponse,
  WalletAdapter,
} from '@pollar/core';

function getCosmosWallet() {
  if (typeof window === 'undefined') return null;
  return (window as any).cosmosWallet ?? null;
}

export class CosmosWalletAdapter implements WalletAdapter {
  readonly type = 'cosmos-wallet';
  readonly meta = { label: 'Cosmos Wallet', iconUrl: '/cosmos.png' };
  readonly custody = 'external' as const;

  // Presence of the provider — NOT cosmosWallet.isConnected(), which means
  // "this origin is already approved".
  async isAvailable(): Promise<boolean> {
    return getCosmosWallet() !== null;
  }

  async connect(): Promise<ConnectWalletResponse> {
    const wallet = getCosmosWallet();
    if (!wallet) throw new Error('Cosmos Wallet is not installed');
    const { address } = await wallet.getAddress(); // opens the approval window
    if (!address) throw new Error('Cosmos Wallet returned no address');
    return { address };
  }

  async disconnect(): Promise<void> {
    // no programmatic disconnect, same as Freighter
  }

  // Non-prompting: only report an address when the origin is already approved.
  async getPublicKey(): Promise<string | null> {
    const wallet = getCosmosWallet();
    if (!wallet) return null;
    try {
      if (!(await wallet.isConnected())) return null;
      const { address } = await wallet.getAddress();
      return address ?? null;
    } catch {
      return null;
    }
  }

  async signTransaction(
    xdr: string,
    options?: SignTransactionOptions,
  ): Promise<SignTransactionResponse> {
    const wallet = getCosmosWallet();
    if (!wallet) throw new Error('Cosmos Wallet is not installed');
    const opts: { networkPassphrase?: string; address?: string } = {};
    if (options?.networkPassphrase) {
      opts.networkPassphrase = options.networkPassphrase;
    }
    if (options?.accountToSign) opts.address = options.accountToSign;
    const { signedTxXdr } = await wallet.signTransaction(xdr, opts);
    if (!signedTxXdr) throw new Error('Cosmos Wallet returned no signature');
    return { signedTxXdr };
  }
}`;

const CORE_CODE = `import { PollarClient } from '@pollar/core';
import { CosmosWalletAdapter } from './cosmos-wallet-adapter';

const cosmos = new CosmosWalletAdapter();

const client = new PollarClient({
  apiKey: 'pub_testnet_…',
  stellarNetwork: 'testnet',
  walletAdapters: [cosmos],
});

// Trigger the login (id === adapter.type):
client.login({ provider: 'cosmos-wallet' });`;

const REACT_CODE = `import { PollarProvider } from '@pollar/react';
import { CosmosWalletAdapter } from './cosmos-wallet-adapter';

// Stable instance — built once, outside render.
const cosmos = new CosmosWalletAdapter();

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PollarProvider
      client={{
        apiKey: 'pub_testnet_…',
        stellarNetwork: 'testnet',
        walletAdapters: [cosmos],
      }}
    >
      {children}
    </PollarProvider>
  );
}

// usePollar().login({ provider: 'cosmos-wallet' }) — or just click its button
// in the login modal.`;

export default function CosmosWalletSetupPage() {
  const { locale } = useI18n();
  const tt = cosmosWalletSetupDict[locale];

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

        {/* ── right: the adapter + how it's registered ────────────────────── */}
        <div className="space-y-4">
          <CodePanel
            sdk="cosmos-wallet-adapter.ts"
            note="the whole integration"
            code={ADAPTER_CODE}
          />
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
