'use client';

import { useState } from 'react';
import { usePollar } from '@pollar/react';
import { useEscrow } from './adapter';
import { DualCode } from '../_components/CodePanels';

// ─── styles ───────────────────────────────────────────────────────────────────

const inp = 'w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light';
const lbl = 'block text-xs font-mono text-muted mb-1';
const btn = (variant: 'primary' | 'secondary') =>
  variant === 'primary'
    ? 'rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors'
    : 'rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors';

function Field({ label, required, children, note }: { label: string; required?: boolean; note?: string; children: React.ReactNode }) {
  return (
    <div className="space-y-1">
      <label className={lbl}>
        {label}
        {required && <span className="ml-1 text-muted-light">*</span>}
        {!required && <span className="ml-1 text-muted-light">(optional)</span>}
      </label>
      {children}
      {note && <p className="text-xs text-muted-light mt-0.5">{note}</p>}
    </div>
  );
}

// ─── code preview serializer ──────────────────────────────────────────────────

function serializeVal(val: unknown, depth = 0): string {
  const pad = '  '.repeat(depth);
  const inner = '  '.repeat(depth + 1);
  if (val === null || val === undefined) return 'undefined';
  if (typeof val === 'boolean') return String(val);
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return `'${val}'`;
  if (typeof val === 'object') {
    const entries = Object.entries(val as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    const lines = entries.map(([ k, v ]) => `${inner}${k}: ${serializeVal(v, depth + 1)}`).join(',\n');
    return `{\n${lines},\n${pad}}`;
  }
  return String(val);
}

// ─── operation tabs ───────────────────────────────────────────────────────────

type Tab = 'deploy' | 'fund' | 'milestone' | 'dispute';
const TABS: { value: Tab; label: string }[] = [
  { value: 'deploy', label: 'Deploy'    },
  { value: 'fund', label: 'Fund'      },
  { value: 'milestone', label: 'Milestone' },
  { value: 'dispute', label: 'Dispute'   },
];

const SETUP_NOTE = `// adapter.ts — register once in your app
export const trustlessWorkAdapter: TrustlessWorkAdapter = {
  deployEscrow:     (p) => tw('/escrow/initialize-escrow', p),
  fundEscrow:       (p) => tw('/escrow/fund-escrow', p),
  approveMilestone: (p) => tw('/escrow/approve-milestone', p),
  releaseFunds:     (p) => tw('/escrow/complete-escrow', p),
  initiateDispute:  (p) => tw('/escrow/dispute-escrow', p),
  resolveDispute:   (p) => tw('/escrow/resolute-dispute', p),
};

// each adapter fn must return { unsignedTransaction: string }.
// Pollar then signs + submits with the user's wallet automatically.

export const useEscrow =
  createPollarAdapterHook<TrustlessWorkAdapter>('escrow');`;

// ─── page ─────────────────────────────────────────────────────────────────────

export default function EscrowPage() {
  const { walletAddress, isAuthenticated, tx, openTxModal } = usePollar();
  const escrow = useEscrow();

  const [ tab, setTab ] = useState<Tab>('deploy');
  const [ error, setError ] = useState<string | null>(null);
  const [ inFlight, setInFlight ] = useState<string | null>(null);

  // deploy fields
  const [ engagementId, setEngagementId ] = useState('');
  const [ title, setTitle ] = useState('');
  const [ description, setDescription ] = useState('');
  const [ approver, setApprover ] = useState('');
  const [ serviceProvider, setServiceProvider ] = useState('');
  const [ platformAddress, setPlatformAddress ] = useState('');
  const [ amount, setAmount ] = useState('');
  const [ platformFee, setPlatformFee ] = useState('0');

  // fund / milestone / dispute fields
  const [ contractId, setContractId ] = useState('');
  const [ milestoneIndex, setMilestoneIndex ] = useState('0');
  const [ approverFunds, setApproverFunds ] = useState('');
  const [ serviceProviderFunds, setServiceProviderFunds ] = useState('');

  // ── run wrapper — tracks per-button in-flight + surfaces errors ────────────
  async function run(label: string, fn: () => Promise<unknown>) {
    setError(null);
    setInFlight(label);
    try {
      await fn();
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Unknown error');
    } finally {
      setInFlight(null);
    }
  }

  // ── handlers ────────────────────────────────────────────────────────────────
  function handleDeploy() {
    run('deploy', () => escrow.deployEscrow({
      engagementId: engagementId.trim(),
      title: title.trim(),
      description: description.trim(),
      approver: approver.trim() || walletAddress,
      serviceProvider: serviceProvider.trim(),
      platformAddress: platformAddress.trim(),
      amount: amount.trim(),
      platformFee: platformFee.trim(),
      signer: walletAddress,
    }));
  }
  function handleFund() {
    run('fund', () => escrow.fundEscrow({ contractId: contractId.trim(), signer: walletAddress }));
  }
  function handleApproveMilestone() {
    run('approve', () => escrow.approveMilestone({
      contractId: contractId.trim(),
      milestoneIndex: milestoneIndex.trim(),
      signer: walletAddress,
    }));
  }
  function handleReleaseFunds() {
    run('release', () => escrow.releaseFunds({ contractId: contractId.trim(), signer: walletAddress }));
  }
  function handleInitiateDispute() {
    run('dispute', () => escrow.initiateDispute({ contractId: contractId.trim(), signer: walletAddress }));
  }
  function handleResolveDispute() {
    run('resolve', () => escrow.resolveDispute({
      contractId: contractId.trim(),
      approverFunds: approverFunds.trim(),
      serviceProviderFunds: serviceProviderFunds.trim(),
      signer: walletAddress,
    }));
  }

  // ── live code preview per tab ───────────────────────────────────────────────
  function buildPreviewCode(): { react: string; core: string } {
    const fnFor: Record<Tab, string> = {
      deploy:    'deployEscrow',
      fund:      'fundEscrow',
      milestone: 'approveMilestone',
      dispute:   'initiateDispute',
    };

    let params: Record<string, unknown> = {};
    switch (tab) {
      case 'deploy':
        params = {
          engagementId: engagementId || 'unique-id-001',
          title: title           || 'Web development contract',
          description: description     || '...',
          approver: approver        || walletAddress || 'G...',
          serviceProvider: serviceProvider || 'G...',
          platformAddress: platformAddress || 'G...',
          amount: amount          || '100',
          platformFee: platformFee     || '0',
          signer: walletAddress   || 'G...',
        };
        break;
      case 'fund':
        params = { contractId: contractId || 'C...', signer: walletAddress || 'G...' };
        break;
      case 'milestone':
        params = {
          contractId: contractId     || 'C...',
          milestoneIndex: milestoneIndex || '0',
          signer: walletAddress  || 'G...',
        };
        break;
      case 'dispute':
        params = { contractId: contractId || 'C...', signer: walletAddress || 'G...' };
        break;
    }

    const fn = fnFor[tab];
    const p = serializeVal(params, 0);

    const react = `const { ${fn} } = useEscrow();

// adapter calls Trustless Work → returns unsigned XDR.
// Pollar signs + submits with the user's wallet automatically.
await ${fn}(${p});`;

    const core = `import { PollarClient } from '@pollar/core';
import { trustlessWorkAdapter } from './adapter';

const client = new PollarClient({ apiKey, baseUrl });
await client.ready();

// the adapter hits Trustless Work → returns an unsigned XDR
const { unsignedTransaction } =
  await trustlessWorkAdapter.${fn}(${p});

// Pollar signs + submits with the connected wallet
await client.signAndSubmitTx(unsignedTransaction);`;

    return { react, core };
  }

  const preview = buildPreviewCode();

  // ── render ──────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── left: form ────────────────────────────────────────────────── */}
        <div className="space-y-5">
          <div>
            <h1 className="text-xl sm:text-2xl font-bold tracking-tight text-foreground">Escrow</h1>
            <p className="text-sm text-muted mt-1.5">
              Trustless Work adapter — the SDK signs and submits the unsigned XDR with the
              connected wallet, so your code only deals with business params.
            </p>
          </div>

          {/* tabs */}
          <div className="flex gap-1 border-b border-border">
            {TABS.map(t => (
              <button
                key={t.value}
                onClick={() => { setTab(t.value); setError(null); }}
                className={`text-xs px-3 py-2 border-b-2 transition-colors ${
                  tab === t.value
                    ? 'border-primary text-primary font-semibold'
                    : 'border-transparent text-muted-light hover:text-foreground'
                }`}
              >
                {t.label}
              </button>
            ))}
          </div>

          {/* ── deploy ────────────────────────────────────────────────────── */}
          {tab === 'deploy' && (
            <div className="space-y-3">
              <Field label="Engagement ID" required>
                <input className={inp} value={engagementId} onChange={e => setEngagementId(e.target.value)} placeholder="unique-id-001" spellCheck={false} />
              </Field>
              <Field label="Title" required>
                <input className={inp} value={title} onChange={e => setTitle(e.target.value)} placeholder="Web development contract" />
              </Field>
              <Field label="Description">
                <input className={inp} value={description} onChange={e => setDescription(e.target.value)} placeholder="Full-stack web app..." />
              </Field>
              <Field label="Approver" required note="Defaults to your wallet address.">
                <input className={inp} value={approver} onChange={e => setApprover(e.target.value)} placeholder={walletAddress || 'G...'} spellCheck={false} />
              </Field>
              <Field label="Service provider" required>
                <input className={inp} value={serviceProvider} onChange={e => setServiceProvider(e.target.value)} placeholder="G..." spellCheck={false} />
              </Field>
              <Field label="Platform address" required>
                <input className={inp} value={platformAddress} onChange={e => setPlatformAddress(e.target.value)} placeholder="G..." spellCheck={false} />
              </Field>
              <div className="grid grid-cols-2 gap-3">
                <Field label="Amount (USDC)" required>
                  <input className={inp} value={amount} onChange={e => setAmount(e.target.value)} placeholder="100" />
                </Field>
                <Field label="Platform fee %" required>
                  <input className={inp} value={platformFee} onChange={e => setPlatformFee(e.target.value)} placeholder="0" />
                </Field>
              </div>
            </div>
          )}

          {/* ── fund ──────────────────────────────────────────────────────── */}
          {tab === 'fund' && (
            <div className="space-y-3">
              <Field label="Contract ID" required note="The escrow contract address returned after deployment.">
                <input className={inp} value={contractId} onChange={e => setContractId(e.target.value)} placeholder="C..." spellCheck={false} />
              </Field>
            </div>
          )}

          {/* ── milestone ─────────────────────────────────────────────────── */}
          {tab === 'milestone' && (
            <div className="space-y-3">
              <Field label="Contract ID" required>
                <input className={inp} value={contractId} onChange={e => setContractId(e.target.value)} placeholder="C..." spellCheck={false} />
              </Field>
              <Field label="Milestone index" required>
                <input className={inp} type="number" value={milestoneIndex} onChange={e => setMilestoneIndex(e.target.value)} placeholder="0" min={0} />
              </Field>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleApproveMilestone}
                  disabled={!isAuthenticated || inFlight !== null}
                  className={btn('secondary')}
                >
                  {inFlight === 'approve' ? 'Signing…' : 'Approve milestone'}
                </button>
                <button
                  onClick={handleReleaseFunds}
                  disabled={!isAuthenticated || inFlight !== null}
                  className={btn('secondary')}
                >
                  {inFlight === 'release' ? 'Signing…' : 'Release funds'}
                </button>
              </div>
            </div>
          )}

          {/* ── dispute ───────────────────────────────────────────────────── */}
          {tab === 'dispute' && (
            <div className="space-y-3">
              <Field label="Contract ID" required>
                <input className={inp} value={contractId} onChange={e => setContractId(e.target.value)} placeholder="C..." spellCheck={false} />
              </Field>
              <div className="flex gap-2 pt-1">
                <button
                  onClick={handleInitiateDispute}
                  disabled={!isAuthenticated || inFlight !== null}
                  className={btn('secondary')}
                >
                  {inFlight === 'dispute' ? 'Signing…' : 'Initiate dispute'}
                </button>
              </div>
              <div className="pt-2 border-t border-border space-y-3">
                <p className="text-xs font-mono text-muted-light">Resolve dispute</p>
                <div className="grid grid-cols-2 gap-3">
                  <Field label="Approver funds" required>
                    <input className={inp} value={approverFunds} onChange={e => setApproverFunds(e.target.value)} placeholder="50" />
                  </Field>
                  <Field label="Service provider funds" required>
                    <input className={inp} value={serviceProviderFunds} onChange={e => setServiceProviderFunds(e.target.value)} placeholder="50" />
                  </Field>
                </div>
                <button
                  onClick={handleResolveDispute}
                  disabled={!isAuthenticated || inFlight !== null}
                  className={`${btn('primary')} w-full sm:w-auto`}
                >
                  {inFlight === 'resolve' ? 'Signing…' : 'Resolve dispute'}
                </button>
              </div>
            </div>
          )}

          {/* submit (only for deploy/fund — milestone/dispute have inline buttons) */}
          <div className="space-y-2 pt-1">
            {error && <p className="text-xs font-mono text-error">{error}</p>}
            {(tab === 'deploy' || tab === 'fund') && (
              <button
                onClick={tab === 'deploy' ? handleDeploy : handleFund}
                disabled={!isAuthenticated || inFlight !== null}
                className={`${btn('primary')} w-full sm:w-auto`}
              >
                {!isAuthenticated
                  ? 'Connect wallet to continue'
                  : inFlight === 'deploy' ? 'Signing…'
                  : inFlight === 'fund' ? 'Signing…'
                  : tab === 'deploy' ? 'Deploy escrow' : 'Fund escrow'}
              </button>
            )}
          </div>
        </div>

        {/* ── right: live code preview + tx state ───────────────────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">

          {/* setup hint */}
          <details className="rounded-lg border border-border overflow-hidden text-xs">
            <summary className="cursor-pointer px-4 py-2.5 bg-surface border-b border-border font-mono text-muted-light select-none">
              one-time adapter setup
            </summary>
            <pre className="p-4 font-mono text-foreground overflow-x-auto whitespace-pre leading-relaxed bg-white">
              {SETUP_NOTE}
            </pre>
          </details>

          {/* current tab call — core + react */}
          <DualCode core={preview.core} react={preview.react} />

          {/* tx state (from usePollar) — shows the auto-sign-and-submit progress */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-light">tx.step</span>
                <span
                  className={`text-xs font-mono px-1.5 py-0.5 rounded ${
                    tx.step === 'idle' ? 'bg-surface text-muted-light' :
                    tx.step === 'building' ? 'bg-surface text-muted animate-pulse' :
                    tx.step === 'built' ? 'bg-primary-light text-primary' :
                    tx.step === 'signing' ? 'bg-warning-light text-warning animate-pulse' :
                    tx.step === 'success' ? 'bg-success-light text-success' :
                    'bg-error-light text-error'
                  }`}
                >
                  {tx.step}
                </span>
              </div>
              {tx.step !== 'idle' && (
                <button onClick={openTxModal} className={btn('secondary')}>
                  View modal
                </button>
              )}
            </div>
            <div className="p-4 text-xs font-mono bg-white min-h-12">
              {tx.step === 'idle' && (
                <p className="text-muted-light">Trigger an operation to see signing progress.</p>
              )}
              {'hash' in tx && tx.hash && (
                <div>
                  <p className="text-muted-light mb-1">hash</p>
                  <p className="text-success break-all">{tx.hash}</p>
                </div>
              )}
              {tx.step === 'error' && tx.details && (
                <p className="text-error">
                  {typeof tx.details === 'string' ? tx.details : JSON.stringify(tx.details, null, 2)}
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
