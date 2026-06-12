'use client';

import { usePollar } from '@pollar/react';
import { contract, rpc } from '@stellar/stellar-sdk';
import { useState } from 'react';
import { CodePanel } from '../_components/CodePanels';
import { Select } from '../_components/Select';

// ─── types ────────────────────────────────────────────────────────────────────

type Op = 'create_account' | 'payment' | 'path_payment_strict_send' | 'change_trust' | 'invoke_contract';

type IssuedAsset =
  | { type: 'credit_alphanum4'; code: string; issuer: string }
  | { type: 'credit_alphanum12'; code: string; issuer: string };

type Asset = { type: 'native' } | IssuedAsset;

type LiquidityPoolAsset = {
  type: 'liquidity_pool_shares';
  assetA: Asset;
  assetB: Asset;
};

type TrustAsset = IssuedAsset | LiquidityPoolAsset;

type ScArgType =
  'bool'
  | 'i32'
  | 'u32'
  | 'i64'
  | 'u64'
  | 'i128'
  | 'u128'
  | 'i256'
  | 'u256'
  | 'address'
  | 'string'
  | 'symbol'
  | 'bytes'
  | 'vec'
  | 'map'
  | 'void';

type Param = {
  name: string;
  argType: ScArgType;
  kind: 'checkbox' | 'number' | 'bigint' | 'text' | 'json';
  placeholder: string
};
type Method = { name: string; params: Param[] };

// ─── operation config ─────────────────────────────────────────────────────────

const OPS: { value: Op; label: string }[] = [
  { value: 'create_account', label: 'Create Account' },
  { value: 'payment', label: 'Payment' },
  { value: 'path_payment_strict_send', label: 'Path Payment Strict Send' },
  { value: 'change_trust', label: 'Change Trust' },
  { value: 'invoke_contract', label: '[Smart Contract] Invoke Contract Function' },
];

// ─── soroban helpers ──────────────────────────────────────────────────────────

const SOROBAN_RPC = 'https://soroban-testnet.stellar.org';
const DEFAULT_CONTRACT = 'CDKCKHTRKFJXVKLICHPIXAPLIVDRBDQEEGJYDKFOTUV35APVNOGTWZW7';

const SPEC_TYPE_MAP: Record<string, ScArgType> = {
  scSpecTypeBool: 'bool', scSpecTypeVoid: 'void' as ScArgType,
  scSpecTypeU32: 'u32', scSpecTypeI32: 'i32',
  scSpecTypeU64: 'u64', scSpecTypeI64: 'i64',
  scSpecTypeU128: 'u128', scSpecTypeI128: 'i128',
  scSpecTypeU256: 'u256', scSpecTypeI256: 'i256',
  scSpecTypeBytes: 'bytes', scSpecTypeBytesN: 'bytes',
  scSpecTypeString: 'string', scSpecTypeSymbol: 'symbol',
  scSpecTypeAddress: 'address', scSpecTypeVec: 'vec', scSpecTypeMap: 'map',
};
const KIND_MAP: Record<string, Param['kind']> = {
  bool: 'checkbox', u32: 'number', i32: 'number',
  u64: 'bigint', i64: 'bigint', u128: 'bigint', i128: 'bigint', u256: 'bigint', i256: 'bigint',
  string: 'text', symbol: 'text', address: 'text', bytes: 'text', vec: 'json', map: 'json',
};
const PH_MAP: Record<string, string> = {
  address: 'G... or C...', bytes: 'base64',
  u64: '1234567890', i64: '-1234567890', u128: '340282366920938...',
  vec: '["item1","item2"]', map: '[{"key":"k","val":"v"}]',
};

function makeArg(argType: ScArgType, raw: string | boolean): unknown {
  if (argType === 'void') return { type: 'void' };
  if (argType === 'bool') return { type: 'bool', value: raw as boolean };
  if (argType === 'u32' || argType === 'i32') return { type: argType, value: parseInt(raw as string, 10) };
  if ([ 'u64', 'i64', 'u128', 'i128', 'u256', 'i256' ].includes(argType)) return { type: argType, value: raw };
  if (argType === 'vec') return { type: 'vec', value: JSON.parse(raw as string) };
  if (argType === 'map') return { type: 'map', value: JSON.parse(raw as string) };
  return { type: argType, value: raw };
}

// ─── code preview serializer ──────────────────────────────────────────────────

function serializeVal(val: unknown, depth = 0): string {
  const pad = '  '.repeat(depth);
  const inner = '  '.repeat(depth + 1);
  if (val === null || val === undefined) return 'undefined';
  if (typeof val === 'boolean') return String(val);
  if (typeof val === 'number') return String(val);
  if (typeof val === 'string') return `'${val}'`;
  if (Array.isArray(val)) {
    if (val.length === 0) return '[]';
    const items = val.map(v => `${inner}${serializeVal(v, depth + 1)}`).join(',\n');
    return `[\n${items},\n${pad}]`;
  }
  if (typeof val === 'object') {
    const entries = Object.entries(val as Record<string, unknown>);
    if (entries.length === 0) return '{}';
    const lines = entries.map(([ k, v ]) => `${inner}${k}: ${serializeVal(v, depth + 1)}`).join(',\n');
    return `{\n${lines},\n${pad}}`;
  }
  return String(val);
}

// ─── shared input styles ──────────────────────────────────────────────────────

const inp = 'w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light';
const lbl = 'block text-xs font-mono text-muted mb-1';
const hint = 'text-xs text-muted-light mt-0.5';
const btn = (variant: 'primary' | 'secondary') =>
  variant === 'primary'
    ? 'rounded-lg bg-primary px-4 py-2 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors'
    : 'rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-foreground hover:bg-surface disabled:opacity-40 transition-colors';

// ─── field wrapper ────────────────────────────────────────────────────────────

function Field({ label, required, note, error, children }: {
  label: string; required?: boolean; note?: string; error?: string; children: React.ReactNode;
}) {
  return (
    <div className="space-y-1">
      <label className={lbl}>
        {label}
        {required && <span className="ml-1 text-muted-light">*</span>}
        {!required && <span className="ml-1 text-muted-light">(optional)</span>}
      </label>
      {children}
      {note && <p className={hint}>{note}</p>}
      {error && <p className="text-xs font-mono text-error">{error}</p>}
    </div>
  );
}

// ─── asset input (native | alphanum4 | alphanum12) ───────────────────────────

function AssetInput({ value, onChange, label, required, note, noNative }: {
  value: Asset; onChange: (v: Asset) => void;
  label: string; required?: boolean; note?: string; noNative?: boolean;
}) {
  const t = value.type;
  const isNative = t === 'native';
  const isA4 = t === 'credit_alphanum4';
  const isA12 = t === 'credit_alphanum12';
  const issued = (isA4 || isA12) ? value as IssuedAsset : { type: 'credit_alphanum4' as const, code: '', issuer: '' };
  const maxLen = isA12 ? 12 : 4;

  function switchType(next: 'native' | 'credit_alphanum4' | 'credit_alphanum12') {
    if (next === 'native') {
      onChange({ type: 'native' });
      return;
    }
    onChange({ type: next, code: issued.code.slice(0, next === 'credit_alphanum4' ? 4 : 12), issuer: issued.issuer });
  }

  return (
    <Field label={label} required={required} note={note}>
      <div className="flex gap-2 mb-2 flex-wrap">
        {!noNative && (
          <button
            type="button"
            onClick={() => switchType('native')}
            className={`${btn(isNative ? 'primary' : 'secondary')} text-xs`}
          >
            XLM (native)
          </button>
        )}
        <button
          type="button"
          onClick={() => switchType('credit_alphanum4')}
          className={`${btn(isA4 ? 'primary' : 'secondary')} text-xs`}
        >
          Alphanumeric 4
        </button>
        <button
          type="button"
          onClick={() => switchType('credit_alphanum12')}
          className={`${btn(isA12 ? 'primary' : 'secondary')} text-xs`}
        >
          Alphanumeric 12
        </button>
      </div>
      {!isNative && (
        <div className="space-y-2">
          <input
            className={inp}
            placeholder={`Asset code (max ${maxLen} chars)`}
            value={issued.code}
            onChange={e => onChange({
              type: issued.type,
              code: e.target.value.toUpperCase().slice(0, maxLen),
              issuer: issued.issuer,
            })}
            maxLength={maxLen}
          />
          <input
            className={inp}
            placeholder="Issuer account ID (G...)"
            value={issued.issuer}
            onChange={e => onChange({ type: issued.type, code: issued.code, issuer: e.target.value })}
          />
        </div>
      )}
    </Field>
  );
}

// ─── trust asset input (alphanum4 | alphanum12 | liquidity_pool_shares) ──────

function TrustAssetInput({ value, onChange }: {
  value: TrustAsset; onChange: (v: TrustAsset) => void;
}) {
  const isPool = value.type === 'liquidity_pool_shares';
  const pool = isPool ? value as LiquidityPoolAsset : {
    type: 'liquidity_pool_shares' as const,
    assetA: { type: 'native' as const },
    assetB: { type: 'native' as const },
  };
  const issued = !isPool ? value as IssuedAsset : { type: 'credit_alphanum4' as const, code: '', issuer: '' };

  return (
    <div className="space-y-3">
      <div>
        <label className={lbl}>Asset type *</label>
        <div className="flex gap-2 flex-wrap">
          <button
            type="button"
            onClick={() => onChange(issued)}
            className={`${btn(!isPool ? 'primary' : 'secondary')} text-xs`}
          >
            Alphanumeric 4 / 12
          </button>
          <button
            type="button"
            onClick={() => onChange(pool)}
            className={`${btn(isPool ? 'primary' : 'secondary')} text-xs`}
          >
            Liquidity pool shares
          </button>
        </div>
      </div>

      {!isPool && (
        <AssetInput
          label="Asset"
          required
          noNative
          value={issued as Asset}
          onChange={v => onChange(v as IssuedAsset)}
        />
      )}

      {isPool && (
        <div className="space-y-3 pl-3 border-l border-border">
          <AssetInput
            label="Asset A"
            required
            value={pool.assetA}
            onChange={v => onChange({ ...pool, assetA: v })}
          />
          <AssetInput
            label="Asset B"
            required
            value={pool.assetB}
            onChange={v => onChange({ ...pool, assetB: v })}
          />
        </div>
      )}
    </div>
  );
}

// ─── path assets input (for path_payment_strict_send) ────────────────────────

function PathInput({ value, onChange }: { value: Asset[]; onChange: (v: Asset[]) => void }) {
  const add = () => onChange([ ...value, { type: 'native' } ]);
  const remove = (i: number) => onChange(value.filter((_, idx) => idx !== i));
  const update = (i: number, v: Asset) => onChange(value.map((a, idx) => idx === i ? v : a));

  return (
    <Field label="Intermediate path" note="Assets to route through. Leave empty for direct path.">
      <div className="space-y-3">
        {value.map((asset, i) => (
          <div key={i} className="flex gap-2 items-start">
            <div className="flex-1">
              <AssetInput
                label={`Path asset ${i + 1}`}
                value={asset}
                onChange={v => update(i, v)}
              />
            </div>
            <button
              type="button"
              onClick={() => remove(i)}
              className="mt-5 text-xs text-muted-light hover:text-error"
            >✕
            </button>
          </div>
        ))}
        <button type="button" onClick={add} className={btn('secondary')}>+ Add asset</button>
      </div>
    </Field>
  );
}

// ─── main page ────────────────────────────────────────────────────────────────

export default function TransactionsPage() {
  const { buildTx, signAndSubmitTx, isAuthenticated, tx, openTxModal } = usePollar();

  const [ op, setOp ] = useState<Op>('payment');
  const [ error, setError ] = useState<string | null>(null);

  // ── create_account ─────────────────────────────────────────────────────────
  const [ caDestination, setCaDestination ] = useState('');
  const [ caStartingBalance, setCaStartingBalance ] = useState('');

  // ── payment ────────────────────────────────────────────────────────────────
  const [ pyDestination, setPyDestination ] = useState('');
  const [ pyAsset, setPyAsset ] = useState<Asset>({ type: 'native' });
  const [ pyAmount, setPyAmount ] = useState('');

  // ── path_payment_strict_send ───────────────────────────────────────────────
  const [ ppDestination, setPpDestination ] = useState('');
  const [ ppSendAsset, setPpSendAsset ] = useState<Asset>({ type: 'native' });
  const [ ppSendAmount, setPpSendAmount ] = useState('');
  const [ ppDestAsset, setPpDestAsset ] = useState<Asset>({ type: 'native' });
  const [ ppDestMin, setPpDestMin ] = useState('');
  const [ ppPath, setPpPath ] = useState<Asset[]>([]);

  // ── change_trust ───────────────────────────────────────────────────────────
  const [ ctAsset, setCtAsset ] = useState<TrustAsset>({ type: 'credit_alphanum4', code: '', issuer: '' });
  const [ ctLimit, setCtLimit ] = useState('');

  // ── options ────────────────────────────────────────────────────────────────
  const [ optTimeoutSec, setOptTimeoutSec ] = useState('');
  const [ optMemoType, setOptMemoType ] = useState<'none' | 'text' | 'id'>('none');
  const [ optMemoValue, setOptMemoValue ] = useState('');
  const [ optMaxFeeStroops, setOptMaxFeeStroops ] = useState('');

  // ── invoke_contract ────────────────────────────────────────────────────────
  const [ icContractId, setIcContractId ] = useState(DEFAULT_CONTRACT);
  const [ icMethods, setIcMethods ] = useState<Method[]>([]);
  const [ icMethod, setIcMethod ] = useState('');
  const [ icFields, setIcFields ] = useState<Record<string, string | boolean>>({});
  const [ icFetching, setIcFetching ] = useState(false);
  const [ icFetchError, setIcFetchError ] = useState<string | null>(null);

  const currentMethod = icMethods.find(m => m.name === icMethod);

  // ── fetch contract methods ─────────────────────────────────────────────────
  async function fetchMethods() {
    setIcFetching(true);
    setIcFetchError(null);
    setIcMethods([]);
    setIcMethod('');
    setIcFields({});
    try {
      const server = new rpc.Server(SOROBAN_RPC, { allowHttp: false });
      const wasm = await server.getContractWasmByContractId(icContractId.trim());
      const spec = contract.Spec.fromWasm(wasm);
      const parsed: Method[] = spec.funcs().map(fn => ({
        name: fn.name().toString(),
        params: fn.inputs()
          .map(inp => {
            const argType = (SPEC_TYPE_MAP[inp.type().switch().name ?? ''] ?? 'string') as ScArgType;
            if (argType === ('void' as ScArgType)) return null;
            return {
              name: inp.name().toString(),
              argType,
              kind: KIND_MAP[argType] ?? 'text',
              placeholder: PH_MAP[argType] ?? '',
            } as Param;
          })
          .filter(Boolean) as Param[],
      }));
      setIcMethods(parsed);
      if (parsed.length > 0) setIcMethod(parsed[0].name);
    } catch (e) {
      setIcFetchError(e instanceof Error ? e.message : 'Failed to fetch methods');
    } finally {
      setIcFetching(false);
    }
  }

  // ── options builder ────────────────────────────────────────────────────────
  function buildOptions() {
    const opts: Record<string, unknown> = {};
    if (optTimeoutSec.trim()) opts.timeoutSec = parseInt(optTimeoutSec, 10);
    if (optMaxFeeStroops.trim()) opts.maxFeeStroops = parseInt(optMaxFeeStroops, 10);
    if (optMemoType !== 'none' && optMemoValue.trim()) opts.memo = { type: optMemoType, value: optMemoValue.trim() };
    return Object.keys(opts).length > 0 ? opts : undefined;
  }

  // ── submit ─────────────────────────────────────────────────────────────────
  function handleSubmit() {
    setError(null);
    try {
      switch (op) {
        case 'create_account':
          buildTx('create_account', {
            destination: caDestination.trim(),
            startingBalance: caStartingBalance.trim(),
          }, buildOptions() as never);
          break;
        case 'payment':
          buildTx('payment', {
            destination: pyDestination.trim(),
            asset: pyAsset,
            amount: pyAmount.trim(),
          }, buildOptions() as never);
          break;
        case 'path_payment_strict_send':
          buildTx('path_payment_strict_send', {
            destination: ppDestination.trim(),
            sendAsset: ppSendAsset,
            sendAmount: ppSendAmount.trim(),
            destAsset: ppDestAsset,
            destMin: ppDestMin.trim(),
            ...(ppPath.length > 0 ? { path: ppPath } : {}),
          }, buildOptions() as never);
          break;
        case 'change_trust':
          buildTx('change_trust', { asset: ctAsset as never, ...(ctLimit.trim() ? { limit: ctLimit.trim() } : {}) }, buildOptions() as never);
          break;
        case 'invoke_contract':
          if (!currentMethod) {
            setError('Select a method');
            return;
          }
          buildTx('invoke_contract', {
            contractId: icContractId.trim(),
            method: icMethod,
            args: currentMethod.params.map(p => makeArg(p.argType, icFields[p.name] ?? (p.kind === 'checkbox' ? false : ''))) as never,
          }, buildOptions() as never);
          break;
      }
    } catch (e) {
      setError(e instanceof Error ? e.message : 'Invalid params');
    }
  }

  function switchOp(next: Op) {
    setOp(next);
    setError(null);
  }

  // ── build live code preview ────────────────────────────────────────────────
  function buildPreviewCode(): { react: string; core: string } {
    let params: Record<string, unknown> = {};

    switch (op) {
      case 'create_account':
        params = { destination: caDestination || 'G...', startingBalance: caStartingBalance || '1' };
        break;
      case 'payment':
        params = { destination: pyDestination || 'G...', asset: pyAsset, amount: pyAmount || '0' };
        break;
      case 'path_payment_strict_send':
        params = {
          destination: ppDestination || 'G...',
          sendAsset: ppSendAsset,
          sendAmount: ppSendAmount || '0',
          destAsset: ppDestAsset,
          destMin: ppDestMin || '0',
          ...(ppPath.length > 0 ? { path: ppPath } : {}),
        };
        break;
      case 'change_trust':
        params = { asset: ctAsset, ...(ctLimit.trim() ? { limit: ctLimit.trim() } : {}) };
        break;
      case 'invoke_contract': {
        let args: unknown[] = [];
        if (currentMethod) {
          try {
            args = currentMethod.params.map(p =>
              makeArg(p.argType, icFields[p.name] ?? (p.kind === 'checkbox' ? false : '')),
            );
          } catch {
            args = [];
          }
        }
        params = {
          contractId: icContractId || 'C...',
          method: icMethod || 'method_name',
          args,
        };
        break;
      }
    }

    const paramsStr = serializeVal(params, 1);
    const opts = buildOptions();
    const optsStr = opts ? `, ${serializeVal(opts, 1)}` : '';

    const react = `const { buildTx } = usePollar();\n\nawait buildTx('${op}', ${paramsStr}${optsStr});`;
    const core = `import { PollarClient } from '@pollar/core';\n\nconst client = new PollarClient({ apiKey, baseUrl });\nawait client.ready();\n\n// build → sign → submit in one call\nawait client.runTx('${op}', ${paramsStr}${optsStr});\n\n// …or run the steps yourself (see the React panel split):\n// const built = await client.buildTx('${op}', ${paramsStr}${optsStr});\n// await client.signAndSubmitTx(built.buildData.unsignedXdr);`;
    return { react, core };
  }

  const preview = buildPreviewCode();

  // ── render ─────────────────────────────────────────────────────────────────
  return (
    <div className="w-full max-w-5xl">
      <div className="grid grid-cols-1 lg:grid-cols-2 gap-8 items-start">

        {/* ── left: form ──────────────────────────────────────────────────── */}
        <div className="space-y-6">

          {/* operation selector */}
          <div>
            <label className={lbl}>Operation type</label>
            <Select
              value={op}
              onChange={v => switchOp(v as Op)}
              options={OPS}
            />
          </div>

          {/* ── create_account ────────────────────────────────────────────── */}
          {op === 'create_account' && (
            <div className="space-y-4">
              <Field label="Destination" required>
                <input
                  className={inp}
                  value={caDestination}
                  onChange={e => setCaDestination(e.target.value)}
                  placeholder="G..."
                  spellCheck={false}
                />
              </Field>
              <Field label="Starting balance" required note="Amount of XLM to fund the new account with.">
                <input
                  className={inp}
                  value={caStartingBalance}
                  onChange={e => setCaStartingBalance(e.target.value)}
                  placeholder="1"
                />
              </Field>
            </div>
          )}

          {/* ── payment ───────────────────────────────────────────────────── */}
          {op === 'payment' && (
            <div className="space-y-4">
              <Field label="Destination" required>
                <input
                  className={inp}
                  value={pyDestination}
                  onChange={e => setPyDestination(e.target.value)}
                  placeholder="G..."
                  spellCheck={false}
                />
              </Field>
              <AssetInput label="Asset" required value={pyAsset} onChange={setPyAsset} />
              <Field label="Amount" required>
                <input className={inp} value={pyAmount} onChange={e => setPyAmount(e.target.value)} placeholder="100" />
              </Field>
            </div>
          )}

          {/* ── path_payment_strict_send ──────────────────────────────────── */}
          {op === 'path_payment_strict_send' && (
            <div className="space-y-4">
              <Field label="Destination" required>
                <input
                  className={inp}
                  value={ppDestination}
                  onChange={e => setPpDestination(e.target.value)}
                  placeholder="G..."
                  spellCheck={false}
                />
              </Field>
              <AssetInput
                label="Sending asset"
                required
                value={ppSendAsset}
                onChange={setPpSendAsset}
                note="Asset deducted from sender's account."
              />
              <Field label="Send amount" required>
                <input
                  className={inp}
                  value={ppSendAmount}
                  onChange={e => setPpSendAmount(e.target.value)}
                  placeholder="100"
                />
              </Field>
              <AssetInput
                label="Destination asset"
                required
                value={ppDestAsset}
                onChange={setPpDestAsset}
                note="Asset received by destination account."
              />
              <Field label="Minimum destination amount" required note="Minimum amount destination must receive.">
                <input
                  className={inp}
                  value={ppDestMin}
                  onChange={e => setPpDestMin(e.target.value)}
                  placeholder="0.01"
                />
              </Field>
              <PathInput value={ppPath} onChange={setPpPath} />
            </div>
          )}

          {/* ── change_trust ──────────────────────────────────────────────── */}
          {op === 'change_trust' && (
            <div className="space-y-4">
              <TrustAssetInput value={ctAsset} onChange={setCtAsset} />
              <Field label="Trust limit" note="Leave empty for max int64. Set 0 to remove the trustline.">
                <input
                  className={inp}
                  value={ctLimit}
                  onChange={e => setCtLimit(e.target.value)}
                  placeholder="Leave empty for max"
                />
              </Field>
            </div>
          )}

          {/* ── invoke_contract ───────────────────────────────────────────── */}
          {op === 'invoke_contract' && (
            <div className="space-y-4">
              <Field label="Contract ID" required>
                <div className="flex flex-col gap-2 sm:flex-row">
                  <input
                    className={inp}
                    value={icContractId}
                    onChange={e => setIcContractId(e.target.value)}
                    placeholder="C..."
                    spellCheck={false}
                  />
                  <button
                    onClick={fetchMethods}
                    disabled={icFetching || !icContractId.trim()}
                    className={`${btn('secondary')} shrink-0`}
                  >
                    {icFetching ? 'Fetching…' : 'Fetch methods'}
                  </button>
                </div>
                {icFetchError && <p className="text-xs font-mono text-error mt-1">{icFetchError}</p>}
              </Field>

              {icMethods.length > 0 && (
                <Field label="Select a method" required>
                  <Select
                    value={icMethod}
                    onChange={v => {
                      setIcMethod(v);
                      setIcFields({});
                    }}
                    options={icMethods.map(m => ({
                      value: m.name,
                      label: `${m.name}${m.params.length > 0 ? ` (${m.params.map(p => `${p.name}: ${p.argType}`).join(', ')})` : ' ()'}`,
                    }))}
                  />
                </Field>
              )}

              {currentMethod && currentMethod.params.length > 0 && (
                <div className="space-y-3">
                  {currentMethod.params.map(param => (
                    <Field key={param.name} label={`${param.name}`} required note={param.argType}>
                      {param.kind === 'checkbox' ? (
                        <label className="flex items-center gap-2 cursor-pointer">
                          <input
                            type="checkbox"
                            checked={(icFields[param.name] as boolean) ?? false}
                            onChange={e => setIcFields(f => ({ ...f, [param.name]: e.target.checked }))}
                          />
                          <span className="text-xs font-mono text-muted">{(icFields[param.name] as boolean) ? 'true' : 'false'}</span>
                        </label>
                      ) : param.kind === 'json' ? (
                        <textarea
                          className={`${inp} resize-y min-h-14`}
                          value={(icFields[param.name] as string) ?? ''}
                          onChange={e => setIcFields(f => ({ ...f, [param.name]: e.target.value }))}
                          placeholder={param.placeholder || '[]'}
                          rows={2}
                          spellCheck={false}
                        />
                      ) : (
                        <input
                          type={param.kind === 'number' ? 'number' : 'text'}
                          className={inp}
                          value={(icFields[param.name] as string) ?? ''}
                          onChange={e => setIcFields(f => ({ ...f, [param.name]: e.target.value }))}
                          placeholder={param.placeholder}
                          spellCheck={false}
                        />
                      )}
                    </Field>
                  ))}
                </div>
              )}
            </div>
          )}

          {/* options */}
          <div className="space-y-3 pt-2 border-t border-border">
            <p className="text-xs font-mono text-muted-light">Options</p>
            <Field label="Timeout" note="Transaction timeout in seconds.">
              <input
                className={inp}
                type="number"
                value={optTimeoutSec}
                onChange={e => setOptTimeoutSec(e.target.value)}
                placeholder="30"
                min={1}
              />
            </Field>
            <Field label="Max fee stroops" note="Maximum fee in stroops (1 XLM = 10,000,000 stroops).">
              <input
                className={inp}
                type="number"
                value={optMaxFeeStroops}
                onChange={e => setOptMaxFeeStroops(e.target.value)}
                placeholder="100"
                min={1}
              />
            </Field>
            <div className="space-y-1">
              <label className={lbl}>Memo <span className="ml-1 text-muted-light">(optional)</span></label>
              <div className="flex gap-2 mb-2 flex-wrap">
                {([ 'none', 'text', 'id' ] as const).map(t => (
                  <button
                    key={t}
                    type="button"
                    onClick={() => setOptMemoType(t)}
                    className={`${btn(optMemoType === t ? 'primary' : 'secondary')} text-xs`}
                  >
                    {t}
                  </button>
                ))}
              </div>
              {optMemoType !== 'none' && (
                <input
                  className={inp}
                  value={optMemoValue}
                  onChange={e => setOptMemoValue(e.target.value)}
                  placeholder={optMemoType === 'id' ? 'Numeric ID' : 'Text memo'}
                  spellCheck={false}
                />
              )}
            </div>
          </div>

          {/* submit */}
          <div className="space-y-2 pt-2">
            {error && <p className="text-xs font-mono text-error">{error}</p>}
            <div className="flex flex-wrap gap-2">
              <button
                onClick={handleSubmit}
                disabled={!isAuthenticated || tx.step === 'building' || tx.step === 'signing'}
                className={`${btn('primary')} w-full sm:w-auto`}
              >
                {!isAuthenticated ? 'Connect wallet to continue'
                  : tx.step === 'building' ? 'Building…'
                  : '1. buildTx'}
              </button>
              {tx.step === 'built' && tx.buildData && (
                <button
                  onClick={() => signAndSubmitTx(tx.buildData.unsignedXdr)}
                  className={`${btn('primary')} w-full sm:w-auto`}
                >
                  2. signAndSubmitTx
                </button>
              )}
            </div>
            <p className="text-[10px] font-mono text-muted-light">
              Tip: <code className="text-foreground">openTxModal()</code> opens
              a built-in modal that handles step 2 for you.
            </p>
          </div>

        </div>

        {/* ── right: live code previews (core + react) + tx state ─────────── */}
        <div className="lg:sticky lg:top-6 space-y-4">

          {/* framework-agnostic core */}
          <CodePanel sdk="@pollar/core" note="framework-agnostic" code={preview.core} />

          {/* react code preview (split into build + submit steps) */}
          <div className="rounded-xl bg-[#1a1a1a] overflow-hidden">
            <div className="flex items-center gap-2 px-4 py-2.5 border-b border-white/10">
              <div className="w-2.5 h-2.5 rounded-full bg-red-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-yellow-500" />
              <div className="w-2.5 h-2.5 rounded-full bg-green-500" />
              <span className="ml-2 text-xs font-mono font-medium text-gray-300">@pollar/react</span>
              <span className="text-[10px] font-mono text-gray-500">— hooks &amp; components</span>
            </div>

            {/* step 1 */}
            <div className="border-b border-white/10">
              <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                <span className="text-[10px] font-mono font-medium bg-primary text-white rounded px-1.5 py-0.5">1</span>
                <span className="text-[10px] font-mono text-gray-500">build transaction</span>
              </div>
              <pre className="px-4 pb-4 pt-1 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
                {preview.react}
              </pre>
            </div>

            {/* step 2 */}
            <div className={tx.step === 'idle' || tx.step === 'building' ? 'opacity-40' : ''}>
              <div className="px-4 pt-3 pb-1 flex items-center gap-2">
                <span className="text-[10px] font-mono font-medium bg-primary text-white rounded px-1.5 py-0.5">2</span>
                <span className="text-[10px] font-mono text-gray-500">submit signed transaction</span>
              </div>
              <pre className="px-4 pb-4 pt-1 text-xs font-mono text-slate-300 overflow-x-auto whitespace-pre leading-relaxed">
                {'buildData' in tx && tx.buildData
                  ? `const { signAndSubmitTx } = usePollar();\n\nconst unsignedXdr =\n  '${tx.buildData.unsignedXdr.slice(0, 60)}...';\n\nawait signAndSubmitTx(unsignedXdr);`
                  : `const { signAndSubmitTx } = usePollar();\n\n// available after buildTx resolves\nawait signAndSubmitTx(unsignedXdr);`
                }
              </pre>
            </div>
          </div>

          {/* transaction state */}
          <div className="rounded-lg border border-border overflow-hidden">
            <div className="flex items-center justify-between px-4 py-2.5 border-b border-border bg-surface">
              <div className="flex items-center gap-2">
                <span className="text-xs font-mono text-muted-light">transaction state</span>
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

            <div className="p-4 space-y-3 bg-background min-h-16">
              {tx.step === 'idle' && (
                <p className="text-xs font-mono text-muted-light">Submit a transaction to see its state here.</p>
              )}

              {'buildData' in tx && tx.buildData && (
                <div className="space-y-2">
                  <p className="text-xs font-mono font-medium text-foreground">
                    {tx.buildData.summary.title}
                  </p>
                  <div className="space-y-0.5">
                    {tx.buildData.summary.lines.map((line, i) => (
                      <p key={i} className="text-xs font-mono text-muted">{line}</p>
                    ))}
                  </div>
                  <p className="text-xs font-mono text-muted-light">
                    fee: {tx.buildData.summary.fee} · {tx.buildData.summary.network}
                  </p>
                </div>
              )}

              {'hash' in tx && tx.hash && (
                <div>
                  <p className="text-xs font-mono text-muted-light mb-1">hash</p>
                  <p className="text-xs font-mono text-success break-all">{tx.hash}</p>
                </div>
              )}

              {tx.step === 'error' && tx.details && (
                <p className="text-xs font-mono text-error">
                  {typeof tx.details === 'string'
                    ? tx.details
                    : JSON.stringify(tx.details, null, 2)}
                </p>
              )}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}
