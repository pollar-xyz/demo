"use client";

// Test bench for the sponsored signer rotation (custom-wallet-adapter guide,
// "Rotate the wallet signer"). The user adds a new key as signer of their
// account and sets the master key to weight 0, keeping the same G... address;
// the app pays the reserve and the fee.
//
// Runs only with the Demo key adapter (app/wallet-adapters/demo-device-key):
// the kit wallets and Freighter can only sign with their master key, so after
// the rotation they would lose the account.

import type { AuthState, PollarClient } from "@pollar/core";
import { usePollar } from "@pollar/react";
import { Networks } from "@stellar/stellar-sdk";
import { useCallback, useEffect, useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";
import {
  activePublicKey,
  DEMO_DEVICE_KEY_ID,
  type DemoKeyStore,
  demoDeviceKeyAdapter,
  discardPendingKey,
  newDemoKey,
  promotePendingKey,
  readKeyStore,
  setPendingKey,
} from "@/app/wallet-adapters/demo-device-key/adapter";

const HORIZON_TESTNET = "https://horizon-testnet.stellar.org";
const LOGIN_TIMEOUT_MS = 60_000;
// POST /wallet/signer/build accepts up to 3 signers to remove.
const MAX_REMOVE_SIGNERS = 3;

type StepKey = "status" | "create" | "rotate" | "newLogin" | "oldLogin";

type HorizonSigner = { key: string; weight: number; type: string };

type AccountInfo =
  | { exists: false }
  | {
      exists: true;
      xlm: string;
      signers: HorizonSigner[];
      thresholds: {
        low_threshold: number;
        med_threshold: number;
        high_threshold: number;
      };
    };

type ApiError = { code?: string; message?: string; details?: unknown };

// TEMPORARY: @pollar/core 0.11.3 has no method for the rotation build, so this
// goes through the client's internal API client, which already signs the DPoP
// proof. Replace with the SDK method once it ships.
type SignerBuildApi = {
  POST(
    path: "/wallet/signer/build",
    init: {
      body: {
        signer: string;
        signerWeight: number;
        masterWeight: number;
        removeSigners: string[];
      };
    },
  ): Promise<{
    data?: {
      content?: { sponsorSignedXdr: string; hash: string; expiresAt: number };
    };
    error?: ApiError;
    response: Response;
  }>;
};

// ─── helpers ─────────────────────────────────────────────────────────────────

async function loadAccount(address: string): Promise<AccountInfo> {
  const res = await fetch(`${HORIZON_TESTNET}/accounts/${address}`);
  if (res.status === 404) return { exists: false };
  if (!res.ok) throw new Error(`Horizon answered ${res.status}`);
  const account = await res.json();
  const native = account.balances.find(
    (b: { asset_type: string }) => b.asset_type === "native",
  );
  return {
    exists: true,
    xlm: native?.balance ?? "0",
    signers: account.signers,
    thresholds: account.thresholds,
  };
}

function hasSigner(account: AccountInfo, key: string): boolean {
  return (
    account.exists && account.signers.some((s) => s.key === key && s.weight > 0)
  );
}

// Reads the key store and the on-chain account. A pending key that is
// already a signer means its rotation landed: promote it.
async function fetchStatus(): Promise<{
  store: DemoKeyStore | null;
  account: AccountInfo | null;
}> {
  const current = readKeyStore();
  if (!current) return { store: null, account: null };
  const account = await loadAccount(current.accountAddress);
  if (current.pending && hasSigner(account, current.pending.publicKey)) {
    promotePendingKey();
  }
  return { store: readKeyStore(), account };
}

function userIdOf(state: AuthState): string | null {
  if (state.step !== "authenticated") return null;
  return state.session.userId ?? state.session.user.id ?? null;
}

function describeAuth(state: AuthState) {
  return state.step === "error"
    ? { step: state.step, errorCode: state.errorCode, message: state.message }
    : { step: state.step, userId: userIdOf(state) };
}

// `login()` is fire-and-forget, so follow the auth state machine until it
// settles. States seen before this login started (a stale `error`, say) are
// ignored.
function loginAndWait(client: PollarClient): Promise<AuthState> {
  return new Promise((resolve, reject) => {
    let started = false;
    const timer = setTimeout(() => {
      unsubscribe();
      reject(new Error("Login did not settle in time"));
    }, LOGIN_TIMEOUT_MS);
    const unsubscribe = client.onAuthStateChange((state) => {
      if (state.step !== "authenticated" && state.step !== "error") {
        started = true;
        return;
      }
      if (!started) return;
      clearTimeout(timer);
      unsubscribe();
      resolve(state);
    });
    client.login({ provider: DEMO_DEVICE_KEY_ID });
  });
}

function format(value: unknown): string {
  return JSON.stringify(value, null, 2);
}

function shortKey(key: string): string {
  return `${key.slice(0, 6)}…${key.slice(-6)}`;
}

// ─── UI pieces ───────────────────────────────────────────────────────────────

function Card({
  title,
  desc,
  children,
}: {
  title: string;
  desc?: string;
  children: React.ReactNode;
}) {
  return (
    <section className="rounded-2xl border border-border bg-background p-5 space-y-4">
      <div className="space-y-1">
        <h2 className="text-sm font-bold text-foreground">{title}</h2>
        {desc && <p className="text-xs text-muted leading-relaxed">{desc}</p>}
      </div>
      {children}
    </section>
  );
}

function Field({ label, value }: { label: string; value: string }) {
  return (
    <div className="flex items-baseline justify-between gap-3 text-xs">
      <span className="text-muted">{label}</span>
      <span className="font-mono text-foreground break-all text-right">
        {value}
      </span>
    </div>
  );
}

function Result({ title, value }: { title: string; value: string | null }) {
  if (value === null) return null;
  return (
    <div className="space-y-1.5">
      <p className="text-xs font-medium text-muted">{title}</p>
      <pre className="rounded-xl border border-border bg-surface p-3 text-[11px] font-mono text-foreground whitespace-pre-wrap break-all">
        {value}
      </pre>
    </div>
  );
}

function Button({
  onClick,
  disabled,
  primary,
  children,
}: {
  onClick: () => void;
  disabled?: boolean;
  primary?: boolean;
  children: React.ReactNode;
}) {
  const look = primary
    ? "bg-primary text-white hover:bg-primary-hover"
    : "border border-border text-foreground hover:bg-surface";
  return (
    <button
      type="button"
      onClick={onClick}
      disabled={disabled}
      className={`rounded-lg px-4 py-2 text-xs font-medium disabled:opacity-40 disabled:cursor-not-allowed transition-colors ${look}`}
    >
      {children}
    </button>
  );
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function SignerRotationPage() {
  const { t } = useI18n();
  const s = t.signerRotation;
  const { login, getClient, network, isAuthenticated } = usePollar();

  const [store, setStore] = useState<DemoKeyStore | null>(null);
  const [account, setAccount] = useState<AccountInfo | null>(null);
  const [results, setResults] = useState<Record<StepKey, string | null>>({
    status: null,
    create: null,
    rotate: null,
    newLogin: null,
    oldLogin: null,
  });
  const [busy, setBusy] = useState<StepKey | null>(null);
  const [oldKey, setOldKey] = useState<string>("");

  // Steps e and f log out on purpose; keep the steps on screen meanwhile
  // instead of flashing the gate.
  const flowRunning = busy === "newLogin" || busy === "oldLogin";

  // `isAuthenticated` re-renders on every login and logout, so the adapter
  // behind the session can be read straight from the client.
  const walletType = isAuthenticated ? getClient().getWalletType() : null;
  const isDemo = walletType === DEMO_DEVICE_KEY_ID;

  const setResult = (step: StepKey, value: unknown) =>
    setResults((prev) => ({
      ...prev,
      [step]: typeof value === "string" ? value : format(value),
    }));

  // Runs one step with its own busy flag and result box; a throw shows up as
  // the step's result instead of disappearing into the console.
  async function runStep(step: StepKey, fn: () => Promise<unknown>) {
    setBusy(step);
    setResult(step, s.running);
    try {
      setResult(step, await fn());
    } catch (err) {
      setResult(step, {
        error: err instanceof Error ? err.message : String(err),
      });
    } finally {
      setBusy(null);
    }
  }

  const applyStatus = useCallback(
    ({ store, account }: Awaited<ReturnType<typeof fetchStatus>>) => {
      setStore(store);
      setAccount(account);
      // Public keys only: the secrets stay out of the result box.
      return store
        ? {
            accountAddress: store.accountAddress,
            activeKey: activePublicKey(store),
            pendingKey: store.pending?.publicKey ?? null,
            retiredKeys: store.history.map((k) => k.publicKey),
            account,
          }
        : { store: null };
    },
    [],
  );

  const refreshStatus = useCallback(
    async () => applyStatus(await fetchStatus()),
    [applyStatus],
  );

  useEffect(() => {
    if (!isDemo) return;
    fetchStatus()
      .then(applyStatus)
      .catch((err) =>
        setResults((prev) => ({
          ...prev,
          status: format({ error: String(err) }),
        })),
      );
  }, [isDemo, applyStatus]);

  // The old-key picker defaults to the most recently retired key.
  const selectedOldKey = store?.history.some((k) => k.publicKey === oldKey)
    ? oldKey
    : (store?.history[store.history.length - 1]?.publicKey ?? "");

  // ── b. create the account ────────────────────────────────────────────────
  const createAccount = () =>
    runStep("create", async () => {
      const outcome = await getClient().createAccount();
      await refreshStatus();
      return outcome;
    });

  // ── d. rotate the signer ─────────────────────────────────────────────────
  const rotate = () =>
    runStep("rotate", async () => {
      const client = getClient();
      const before = readKeyStore();
      if (!before) return { error: s.rotateNoStore };

      const chain = await loadAccount(before.accountAddress);
      if (!chain.exists) return { error: s.rotateNoAccount };

      // A pending key left by an earlier attempt: promote it if it landed,
      // drop it otherwise.
      if (before.pending) {
        if (hasSigner(chain, before.pending.publicKey)) promotePendingKey();
        else discardPendingKey();
      }
      const current = readKeyStore()!;
      const accountAddress = current.accountAddress;

      // Keys from earlier rotations that are still signers, the active one
      // included, so the account does not pile up signers and a retired key
      // cannot log in. Empty on the first rotation: the master key is changed
      // with masterWeight, not removed.
      const ours = new Set([
        ...current.history.map((k) => k.publicKey),
        activePublicKey(current),
      ]);
      const removeSigners = chain.signers
        .map((signer) => signer.key)
        .filter((key) => key !== accountAddress && ours.has(key))
        .slice(0, MAX_REMOVE_SIGNERS);

      const next = newDemoKey();
      setPendingKey(next);

      const api = (client as unknown as { _api: SignerBuildApi })._api;
      const body = {
        signer: next.publicKey,
        signerWeight: 1,
        masterWeight: 0,
        removeSigners,
      };
      const { data, error, response } = await api.POST("/wallet/signer/build", {
        body,
      });
      const built = data?.content;
      if (error || !built?.sponsorSignedXdr) {
        discardPendingKey();
        const code = error?.code as keyof typeof s.errors | undefined;
        return {
          message: (code ? s.errors[code] : undefined) ?? s.unknownError,
          status: response.status,
          error,
        };
      }

      // Sign with the ACTIVE (old) key: Stellar checks the rotation against
      // the signers as they are before it applies.
      const { signedTxXdr } = await demoDeviceKeyAdapter.signTransaction(
        built.sponsorSignedXdr,
        { networkPassphrase: Networks.TESTNET, accountToSign: accountAddress },
      );
      const outcome = await client.submitTx(signedTxXdr);

      // Decide on what the ledger says, not only on the outcome: dropping a
      // key that did land would lock the account. A `pending` submit gets a
      // short wait for Horizon to catch up.
      let after = await loadAccount(accountAddress);
      for (
        let i = 0;
        i < 10 &&
        outcome.status === "pending" &&
        !hasSigner(after, next.publicKey);
        i++
      ) {
        await new Promise((r) => setTimeout(r, 2000));
        after = await loadAccount(accountAddress);
      }
      const landed = hasSigner(after, next.publicKey);
      if (landed) promotePendingKey();
      else if (outcome.status !== "pending") discardPendingKey();

      await refreshStatus();
      return {
        build: { request: body, hash: built.hash, expiresAt: built.expiresAt },
        submit: outcome,
        landed,
        signers: after.exists ? after.signers : [],
      };
    });

  // ── e. log in with the new key ───────────────────────────────────────────
  const loginWithNewKey = () =>
    runStep("newLogin", async () => {
      const client = getClient();
      const userBefore = userIdOf(client.getAuthState());
      await client.logout();
      const state = await loginAndWait(client);
      const current = readKeyStore();
      return {
        signedWith: current ? activePublicKey(current) : null,
        login: describeAuth(state),
        userBefore,
        sameUser: userBefore !== null && userIdOf(state) === userBefore,
      };
    });

  // ── f. try an old key ────────────────────────────────────────────────────
  const loginWithOldKey = () =>
    runStep("oldLogin", async () => {
      const client = getClient();
      const retired = readKeyStore()?.history.find(
        (k) => k.publicKey === selectedOldKey,
      );
      if (!retired) return { error: s.oldLoginNoHistory };
      const userBefore = userIdOf(client.getAuthState());

      await client.logout();
      demoDeviceKeyAdapter.setTemporaryKey(retired.secret);
      let attempt: AuthState;
      try {
        attempt = await loginAndWait(client);
      } finally {
        demoDeviceKeyAdapter.clearTemporaryKey();
      }
      // Not expected — but never stay logged in on a retired key's session.
      if (attempt.step === "authenticated") await client.logout();

      const restored = await loginAndWait(client);
      return {
        oldKey: retired.publicKey,
        oldKeyLogin: describeAuth(attempt),
        expectedFailure: attempt.step === "error",
        restoredLogin: describeAuth(restored),
        sameUser: userBefore !== null && userIdOf(restored) === userBefore,
      };
    });

  // ── render ───────────────────────────────────────────────────────────────

  const header = (
    <header className="space-y-1.5">
      <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">
        {s.title}
      </h1>
      <p className="text-sm text-muted">{s.subtitle}</p>
    </header>
  );

  if (network !== "testnet") {
    return (
      <div className="w-full max-w-3xl space-y-6">
        {header}
        <Card title={s.testnetOnlyTitle} desc={s.testnetOnlyBody}>
          {null}
        </Card>
      </div>
    );
  }

  if (!isDemo && !flowRunning) {
    return (
      <div className="w-full max-w-3xl space-y-6">
        {header}
        <Card title={s.gateTitle} desc={s.gateBody}>
          <Button
            primary
            onClick={() => login({ provider: DEMO_DEVICE_KEY_ID })}
          >
            {s.gateLogin}
          </Button>
          <Result title={s.resultTitle} value={results.newLogin} />
          <Result title={s.resultTitle} value={results.oldLogin} />
        </Card>
      </div>
    );
  }

  const accountAddress = store?.accountAddress ?? "-";
  const activeKey = store ? activePublicKey(store) : null;
  const retiredKeys = new Set(store?.history.map((k) => k.publicKey));

  return (
    <div className="w-full max-w-3xl space-y-6">
      {header}

      {/* ── a. status ──────────────────────────────────────────────────── */}
      <Card title={s.statusTitle} desc={s.statusDesc}>
        <div className="space-y-1.5 rounded-xl border border-border bg-surface p-3">
          <Field label={s.accountAddress} value={accountAddress} />
          <Field label={s.activeKey} value={activeKey ?? "-"} />
          {store?.pending && (
            <Field label={s.pendingKey} value={store.pending.publicKey} />
          )}
          <Field
            label={s.retiredKeys}
            value={String(store?.history.length ?? 0)}
          />
          {account?.exists && (
            <>
              <Field label={s.xlm} value={account.xlm} />
              <Field
                label={s.thresholds}
                value={`${account.thresholds.low_threshold} / ${account.thresholds.med_threshold} / ${account.thresholds.high_threshold}`}
              />
            </>
          )}
        </div>

        {account && !account.exists && (
          <p className="text-xs text-warning">{s.notCreated}</p>
        )}

        {account?.exists && (
          <div className="space-y-1.5">
            <p className="text-xs font-medium text-muted">{s.signers}</p>
            <ul className="space-y-1 rounded-xl border border-border bg-surface p-3">
              {account.signers.map((signer) => {
                const tags = [
                  signer.key === accountAddress && s.master,
                  signer.key === activeKey && s.active,
                  retiredKeys.has(signer.key) && s.retired,
                ].filter(Boolean);
                return (
                  <li
                    key={signer.key}
                    className="flex items-baseline justify-between gap-3 text-xs"
                  >
                    <span className="font-mono text-foreground break-all">
                      {signer.key}
                      {tags.length > 0 && (
                        <span className="ml-2 text-muted">
                          ({tags.join(", ")})
                        </span>
                      )}
                    </span>
                    <span className="font-mono text-foreground">
                      weight {signer.weight}
                    </span>
                  </li>
                );
              })}
            </ul>
          </div>
        )}

        <Button
          disabled={busy !== null}
          onClick={() => runStep("status", refreshStatus)}
        >
          {s.refresh}
        </Button>
        <Result title={s.resultTitle} value={results.status} />
      </Card>

      {/* ── b. create the account ──────────────────────────────────────── */}
      <Card title={s.createTitle} desc={s.createDesc}>
        <Button
          primary
          disabled={busy !== null || account?.exists === true}
          onClick={createAccount}
        >
          {s.createBtn}
        </Button>
        <Result title={s.resultTitle} value={results.create} />
      </Card>

      {/* ── c. grant ───────────────────────────────────────────────────── */}
      <section className="rounded-2xl border border-border bg-surface p-5 space-y-2">
        <h2 className="text-sm font-bold text-foreground">{s.grantTitle}</h2>
        <ol className="space-y-1.5">
          {s.grantSteps.map((step, i) => (
            <li
              key={i}
              className="flex gap-2 text-xs text-muted leading-relaxed"
            >
              <span className="font-mono text-muted-light">{i + 1}.</span>
              <span>{step}</span>
            </li>
          ))}
        </ol>
        <p className="text-xs text-warning leading-relaxed">{s.grantNote}</p>
      </section>

      {/* ── d. rotate ──────────────────────────────────────────────────── */}
      <Card title={s.rotateTitle} desc={s.rotateDesc}>
        <Button
          primary
          disabled={busy !== null || !account?.exists}
          onClick={rotate}
        >
          {s.rotateBtn}
        </Button>
        <Result title={s.resultTitle} value={results.rotate} />
      </Card>

      {/* ── e. log in with the new key ─────────────────────────────────── */}
      <Card title={s.newLoginTitle} desc={s.newLoginDesc}>
        <Button disabled={busy !== null} onClick={loginWithNewKey}>
          {s.newLoginBtn}
        </Button>
        <Result title={s.resultTitle} value={results.newLogin} />
      </Card>

      {/* ── f. try an old key ──────────────────────────────────────────── */}
      <Card title={s.oldLoginTitle} desc={s.oldLoginDesc}>
        {store && store.history.length > 0 ? (
          <label className="flex flex-col gap-1.5 text-xs text-muted">
            {s.oldLoginKey}
            <select
              value={selectedOldKey}
              onChange={(e) => setOldKey(e.target.value)}
              className="rounded-lg border border-border bg-background px-3 py-2 font-mono text-xs text-foreground"
            >
              {store.history.map((k) => (
                <option key={k.publicKey} value={k.publicKey}>
                  {shortKey(k.publicKey)}
                  {k.publicKey === store.accountAddress ? ` (${s.master})` : ""}
                </option>
              ))}
            </select>
          </label>
        ) : (
          <p className="text-xs text-muted">{s.oldLoginNoHistory}</p>
        )}
        <Button
          disabled={busy !== null || !store?.history.length}
          onClick={loginWithOldKey}
        >
          {s.oldLoginBtn}
        </Button>
        <Result title={s.resultTitle} value={results.oldLogin} />
      </Card>
    </div>
  );
}
