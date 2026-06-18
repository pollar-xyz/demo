"use client";

import {
  useAccesly,
  useBalance,
  useWalletActivity,
  useWalletStatus,
  type WalletActivityItem,
  type WalletStatusValue,
} from "@accesly/react";
import { useState } from "react";
import { useI18n } from "@/app/_i18n/LanguageProvider";

// ─── shared styles (match the other demo pages) ──────────────────────────────

const inp =
  "w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm outline-none focus:border-primary placeholder:text-muted-light";
const lbl = "block text-xs font-medium text-muted mb-1";
const btnPrimary =
  "rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors";
const btnSecondary =
  "rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors";
const card = "rounded-2xl border border-border bg-background p-4 sm:p-5";
const cardTitle = "text-sm font-semibold text-foreground";

// ─── helpers ─────────────────────────────────────────────────────────────────

// XLM/USDC share 7 decimals (1 unit = 1e7 stroops). Convert via string math so
// large amounts don't lose precision through a float.
function toStroops(amount: string): string | null {
  const trimmed = amount.trim();
  if (!/^\d+(\.\d+)?$/.test(trimmed)) return null;
  const [whole, frac = ""] = trimmed.split(".");
  const fracPadded = (frac + "0000000").slice(0, 7);
  const combined = `${whole}${fracPadded}`.replace(/^0+(?=\d)/, "");
  if (combined === "" || combined === "0") return null;
  return combined;
}

function shorten(addr: string): string {
  return addr.length > 14 ? `${addr.slice(0, 8)}…${addr.slice(-6)}` : addr;
}

function errMessage(e: unknown): string {
  return e instanceof Error ? e.message : String(e);
}

// ─── page ────────────────────────────────────────────────────────────────────

export default function AcceslyWalletPage() {
  const { t } = useI18n();
  const a = t.accesly;
  const { auth, wallet, tx } = useAccesly();

  const [email, setEmail] = useState("");
  const [password, setPassword] = useState("");
  const [code, setCode] = useState("");
  const [awaitingConfirm, setAwaitingConfirm] = useState(false);

  const [walletAddress, setWalletAddress] = useState<string | null>(null);
  const [deployStatus, setDeployStatus] = useState<WalletStatusValue | null>(
    null,
  );
  const [copied, setCopied] = useState(false);

  const [destination, setDestination] = useState("");
  const [amount, setAmount] = useState("");
  const [txResult, setTxResult] = useState<{
    txHash: string;
    explorerUrl: string;
  } | null>(null);

  const [busy, setBusy] = useState<string | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);

  const liveStatus = useWalletStatus();
  const balance = useBalance(walletAddress);
  const activity = useWalletActivity(walletAddress, { limit: 10 });

  const isAuthed = auth.status === "authenticated";
  // Prefer the locally-tracked address (from this session's bootstrap), but fall
  // back to whatever the SDK resolved from the device store.
  const address = walletAddress ?? liveStatus.walletAddress;
  const status: WalletStatusValue | null = deployStatus ?? liveStatus.status;

  // Wraps an async action: clears messages, tracks the busy key, surfaces errors.
  async function run(key: string, fn: () => Promise<void>) {
    setBusy(key);
    setError(null);
    setNotice(null);
    try {
      await fn();
    } catch (e) {
      setError(errMessage(e));
    } finally {
      setBusy(null);
    }
  }

  const statusLabel = (s: WalletStatusValue): string =>
    ({
      "on-chain": a.wallet.statusOnChain,
      "pending-deploy": a.wallet.statusPending,
      unknown: a.wallet.statusUnknown,
      "no-wallet": a.wallet.statusNoWallet,
    })[s];

  const activityLabel = (type: WalletActivityItem["type"]): string =>
    ({
      "wallet-created": a.activity.created,
      "signer-rotated": a.activity.signerRotated,
      "transfer-in": a.activity.transferIn,
      "transfer-out": a.activity.transferOut,
    })[type];

  return (
    <div className="w-full max-w-3xl space-y-6">
      <header className="space-y-2">
        <div className="flex flex-wrap items-center gap-3">
          <h1 className="text-2xl sm:text-3xl font-bold tracking-tight text-foreground">
            {a.title}
          </h1>
          <span className="inline-flex items-center gap-1.5 rounded-lg border border-warning-border bg-warning-light px-2.5 py-1 text-xs font-medium text-warning">
            <span className="inline-block h-1.5 w-1.5 rounded-full bg-warning" />
            {a.testnetBadge}
          </span>
        </div>
        <p className="text-sm text-muted">{a.subtitle}</p>
      </header>

      {error && (
        <div className="rounded-lg border border-error-border bg-error-light px-4 py-3 text-xs text-error">
          {a.errorPrefix}: {error}
        </div>
      )}
      {notice && (
        <div className="rounded-lg border border-success-border bg-success-light px-4 py-3 text-xs text-success">
          {notice}
        </div>
      )}

      {/* ── Account ── */}
      <section className={card}>
        <div className="flex items-center justify-between">
          <h2 className={cardTitle}>{a.auth.title}</h2>
          <span className="text-xs text-muted">
            {a.auth.statusLabel}:{" "}
            <span className="font-medium text-foreground">
              {a.status[auth.status]}
            </span>
          </span>
        </div>

        {isAuthed ? (
          <div className="mt-4 flex flex-wrap items-center justify-between gap-3">
            <p className="text-sm text-muted">
              {a.auth.signedInAs}{" "}
              <span className="font-medium text-foreground">
                {auth.username}
              </span>
            </p>
            <button
              type="button"
              className={btnSecondary}
              disabled={busy !== null}
              onClick={() => run("signOut", () => auth.signOut())}
            >
              {a.auth.signOut}
            </button>
          </div>
        ) : (
          <div className="mt-4 space-y-4">
            <div className="grid gap-3 sm:grid-cols-2">
              <div>
                <label className={lbl}>{a.auth.email}</label>
                <input
                  className={inp}
                  type="email"
                  autoComplete="username"
                  placeholder={a.auth.emailPlaceholder}
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                />
              </div>
              <div>
                <label className={lbl}>{a.auth.password}</label>
                <input
                  className={inp}
                  type="password"
                  autoComplete="current-password"
                  placeholder={a.auth.passwordPlaceholder}
                  value={password}
                  onChange={(e) => setPassword(e.target.value)}
                />
              </div>
            </div>

            {awaitingConfirm ? (
              <div className="space-y-3 rounded-lg border border-border bg-surface p-3">
                <div>
                  <p className="text-sm font-medium text-foreground">
                    {a.auth.confirmTitle}
                  </p>
                  <p className="mt-0.5 text-xs text-muted">
                    {a.auth.confirmHint}
                  </p>
                </div>
                <label className={lbl}>{a.auth.code}</label>
                <input
                  className={inp}
                  inputMode="numeric"
                  placeholder={a.auth.codePlaceholder}
                  value={code}
                  onChange={(e) => setCode(e.target.value)}
                />
                <div className="flex flex-wrap gap-2">
                  <button
                    type="button"
                    className={btnPrimary}
                    disabled={busy !== null || !code.trim()}
                    onClick={() =>
                      run("confirm", async () => {
                        await auth.confirmSignUp(email.trim(), code.trim());
                        await auth.signIn(email.trim(), password);
                        setAwaitingConfirm(false);
                        setCode("");
                      })
                    }
                  >
                    {busy === "confirm" ? a.auth.confirming : a.auth.confirm}
                  </button>
                  <button
                    type="button"
                    className={btnSecondary}
                    disabled={busy !== null}
                    onClick={() =>
                      run("resend", () =>
                        auth.resendConfirmation(email.trim()),
                      )
                    }
                  >
                    {a.auth.resend}
                  </button>
                </div>
              </div>
            ) : (
              <div className="flex flex-wrap gap-2">
                <button
                  type="button"
                  className={btnPrimary}
                  disabled={busy !== null || !email.trim() || !password}
                  onClick={() =>
                    run("signIn", () => auth.signIn(email.trim(), password))
                  }
                >
                  {busy === "signIn" ? a.auth.signingIn : a.auth.signIn}
                </button>
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={busy !== null || !email.trim() || !password}
                  onClick={() =>
                    run("signUp", async () => {
                      const r = await auth.signUp(email.trim(), password);
                      if (!r.userConfirmed) setAwaitingConfirm(true);
                    })
                  }
                >
                  {busy === "signUp" ? a.auth.signingUp : a.auth.signUp}
                </button>
              </div>
            )}
          </div>
        )}
      </section>

      {!isAuthed && (
        <p className="text-xs text-muted-light">{a.needSignIn}</p>
      )}

      {isAuthed && (
        <>
          {/* ── Wallet ── */}
          <section className={card}>
            <h2 className={cardTitle}>{a.wallet.title}</h2>
            {address ? (
              <div className="mt-4 space-y-3">
                <div className="rounded-lg border border-border bg-surface px-4 py-3">
                  <p className="text-xs text-muted">{a.wallet.address}</p>
                  <div className="mt-1 flex items-center justify-between gap-2">
                    <span className="font-mono text-sm text-foreground">
                      {shorten(address)}
                    </span>
                    <button
                      type="button"
                      className={btnSecondary}
                      onClick={() => {
                        void navigator.clipboard?.writeText(address);
                        setCopied(true);
                        window.setTimeout(() => setCopied(false), 1500);
                      }}
                    >
                      {copied ? a.wallet.copied : a.wallet.copy}
                    </button>
                  </div>
                  {status && (
                    <p className="mt-2 text-xs text-muted">
                      {a.wallet.statusLabel}:{" "}
                      <span className="font-medium text-foreground">
                        {statusLabel(status)}
                      </span>
                    </p>
                  )}
                </div>
                <button
                  type="button"
                  className={btnSecondary}
                  disabled={busy !== null}
                  onClick={() =>
                    run("fund", async () => {
                      const r = await wallet.fundTestnet(address);
                      setNotice(
                        r.alreadyFunded
                          ? a.wallet.alreadyFunded
                          : a.wallet.funded,
                      );
                      await balance.refresh();
                    })
                  }
                >
                  {busy === "fund" ? a.wallet.funding : a.wallet.fund}
                </button>
              </div>
            ) : (
              <div className="mt-4 space-y-3">
                <p className="text-sm text-muted">{a.wallet.none}</p>
                <button
                  type="button"
                  className={btnPrimary}
                  disabled={busy !== null}
                  onClick={() =>
                    run("create", async () => {
                      const r = await wallet.bootstrap({
                        email: email.trim(),
                        password,
                      });
                      setWalletAddress(r.walletAddress);
                      setDeployStatus(r.status);
                    })
                  }
                >
                  {busy === "create" ? a.wallet.creating : a.wallet.create}
                </button>
              </div>
            )}
          </section>

          {/* ── Balance ── */}
          {address && (
            <section className={card}>
              <div className="flex items-center justify-between">
                <h2 className={cardTitle}>{a.balance.title}</h2>
                <button
                  type="button"
                  className={btnSecondary}
                  onClick={() => void balance.refresh()}
                >
                  {a.balance.refresh}
                </button>
              </div>
              <div className="mt-4 grid gap-3 sm:grid-cols-2">
                <div className="rounded-lg border border-border bg-surface px-4 py-3">
                  <p className="text-xs text-muted">XLM</p>
                  <p className="mt-1 font-mono text-lg text-foreground">
                    {balance.isLoading
                      ? a.balance.loading
                      : (balance.xlm ?? "0")}
                  </p>
                </div>
                <div className="rounded-lg border border-border bg-surface px-4 py-3">
                  <p className="text-xs text-muted">USDC</p>
                  <p className="mt-1 font-mono text-lg text-foreground">
                    {balance.isLoading
                      ? a.balance.loading
                      : (balance.usdc ?? "0")}
                  </p>
                </div>
              </div>
            </section>
          )}

          {/* ── Send ── */}
          {address && (
            <section className={card}>
              <h2 className={cardTitle}>{a.send.title}</h2>
              <div className="mt-4 space-y-3">
                <div>
                  <label className={lbl}>{a.send.destination}</label>
                  <input
                    className={`${inp} font-mono`}
                    placeholder={a.send.destinationPlaceholder}
                    value={destination}
                    onChange={(e) => setDestination(e.target.value)}
                  />
                </div>
                <div>
                  <label className={lbl}>{a.send.amount}</label>
                  <input
                    className={inp}
                    inputMode="decimal"
                    placeholder={a.send.amountPlaceholder}
                    value={amount}
                    onChange={(e) => setAmount(e.target.value)}
                  />
                </div>
                <button
                  type="button"
                  className={btnPrimary}
                  disabled={
                    busy !== null ||
                    !destination.trim() ||
                    toStroops(amount) === null
                  }
                  onClick={() =>
                    run("send", async () => {
                      const stroops = toStroops(amount);
                      if (!stroops) return;
                      setTxResult(null);
                      const mat = await wallet.unlockForSigning(email.trim());
                      const res = await tx.send({
                        destinationAddress: destination.trim(),
                        amountStroops: stroops,
                        fragmentF1Plain: mat.fragmentF1Plain,
                        fragmentF2Key: mat.fragmentF2Key,
                        ownerPubkey: mat.ownerPubkey,
                      });
                      setTxResult({
                        txHash: res.txHash,
                        explorerUrl: res.explorerUrl,
                      });
                      setNotice(a.send.success);
                      setAmount("");
                      setDestination("");
                      await balance.refresh();
                      await activity.refresh();
                    })
                  }
                >
                  {busy === "send" ? a.send.sending : a.send.submit}
                </button>
                {txResult && (
                  <a
                    href={txResult.explorerUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 text-xs font-medium text-primary hover:underline"
                  >
                    {a.send.explorer} · {shorten(txResult.txHash)}
                  </a>
                )}
              </div>
            </section>
          )}

          {/* ── Activity ── */}
          {address && (
            <section className={card}>
              <h2 className={cardTitle}>{a.activity.title}</h2>
              {activity.events.length === 0 ? (
                <p className="mt-4 text-sm text-muted">{a.activity.empty}</p>
              ) : (
                <ul className="mt-4 divide-y divide-border">
                  {activity.events.map((ev) => (
                    <li
                      key={ev.txHash}
                      className="flex items-center justify-between gap-3 py-2.5"
                    >
                      <span className="text-sm text-foreground">
                        {activityLabel(ev.type)}
                      </span>
                      <span className="font-mono text-xs text-muted">
                        {shorten(ev.txHash)}
                      </span>
                    </li>
                  ))}
                </ul>
              )}
            </section>
          )}
        </>
      )}
    </div>
  );
}
