"use client";

import { type ReactNode } from "react";
import { CodePanel } from "@/app/_components/CodePanels";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import { turnkeySetupDict } from "./_i18n";

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

const INSTALL_CODE = "pnpm add @turnkey/core @stellar/stellar-sdk";

const ENV_CODE = `NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID=your-organization-id
NEXT_PUBLIC_TURNKEY_AUTH_PROXY_CONFIG_ID=your-auth-proxy-config-id`;

const PROVIDER_CODE = `import { PollarProvider } from '@pollar/react';
import { createTurnkeyAdapter } from './wallet-adapters/turnkey/adapter';

// One stable Core-backed instance owns authentication, wallet access and signing.
const turnkey = createTurnkeyAdapter({
  organizationId: process.env.NEXT_PUBLIC_TURNKEY_ORGANIZATION_ID!,
  authProxyConfigId:
    process.env.NEXT_PUBLIC_TURNKEY_AUTH_PROXY_CONFIG_ID!,
  loginMethods: ['email'],
  walletName: 'Pollar Wallet',
});

export function Providers({ children }: { children: React.ReactNode }) {
  return (
    <PollarProvider
      client={{
        apiKey: 'pub_testnet_…',
        stellarNetwork: 'testnet',
        walletAdapters: [turnkey],
      }}
    >
      {children}
    </PollarProvider>
  );
}

// usePollar().login({ provider: 'turnkey' }) opens the interactive
// email OTP flow inside Pollar's login modal.`;

const SIGNING_CODE = `const response = await httpClient.signRawPayload({
  signWith: stellarAddress,
  payload: transaction.hash().toString('hex'),
  encoding: 'PAYLOAD_ENCODING_HEXADECIMAL',
  // Stellar has already hashed the transaction envelope.
  hashFunction: 'HASH_FUNCTION_NOT_APPLICABLE',
});

const result = response.activity.result.signRawPayloadResult;
if (!result) throw new Error('No signature returned');

// An Ed25519 signature is the 64-byte concatenation of r and s.
const signature = hexToBytes(result.r + result.s);
transaction.addSignature(stellarAddress, bytesToBase64(signature));

return { signedTxXdr: transaction.toEnvelope().toXDR('base64') };`;

export default function TurnkeySetupPage() {
  const { locale } = useI18n();
  const tt = turnkeySetupDict[locale];

  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 gap-8 lg:grid-cols-2 lg:items-start">
        <div className="space-y-6">
          <header>
            <h1 className="text-xl font-bold tracking-tight text-foreground sm:text-2xl">
              {tt.title}
            </h1>
            <p className="mt-1.5 text-sm text-muted">{tt.subtitle}</p>
          </header>

          <p className="text-sm leading-relaxed text-muted">{md(tt.intro)}</p>

          <section className="space-y-3">
            <h2 className="text-xs font-medium text-muted">{tt.stepsTitle}</h2>
            <ol className="space-y-4">
              {tt.steps.map((step, index) => (
                <li key={step.title} className="flex gap-3">
                  <span className="flex h-5 w-5 shrink-0 items-center justify-center rounded-full bg-primary-light text-[10px] font-bold text-primary">
                    {index + 1}
                  </span>
                  <div>
                    <p className="text-sm font-semibold text-foreground">
                      {step.title}
                    </p>
                    <p className="mt-0.5 text-xs leading-relaxed text-muted-light">
                      {md(step.desc)}
                    </p>
                  </div>
                </li>
              ))}
            </ol>
          </section>

          <section className="space-y-2 pt-1">
            <h2 className="text-xs font-medium text-muted">{tt.notesTitle}</h2>
            <ul className="space-y-2">
              {tt.notes.map((note) => (
                <li
                  key={note}
                  className="flex gap-2 text-xs leading-relaxed text-muted-light"
                >
                  <span className="mt-1.5 inline-block h-1 w-1 shrink-0 rounded-full bg-primary" />
                  <span>{md(note)}</span>
                </li>
              ))}
            </ul>
          </section>
        </div>

        <div className="space-y-4 lg:sticky lg:top-6">
          <CodePanel sdk="terminal" code={INSTALL_CODE} />
          <CodePanel
            sdk=".env.local"
            note="public identifiers"
            code={ENV_CODE}
          />
          <CodePanel
            sdk="providers.tsx"
            note="register the adapter"
            code={PROVIDER_CODE}
          />
          <CodePanel
            sdk="adapter.tsx"
            note="Stellar signing core"
            code={SIGNING_CODE}
          />
        </div>
      </div>
    </div>
  );
}
