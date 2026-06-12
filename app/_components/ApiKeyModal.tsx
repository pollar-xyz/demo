'use client';

import { useState } from 'react';

// Modal for swapping the publishable API key the demo runs against.
// The key is written to the `?apiKey=` query param (see Shell) so the
// PollarProvider client picks it up — handy for testing your own key.

export function ApiKeyModal({
  currentKey,
  isCustom,
  onClose,
  onSave,
}: {
  currentKey: string;
  isCustom: boolean;
  onClose: () => void;
  onSave: (key: string) => void;
}) {
  const [value, setValue] = useState(isCustom ? currentKey : '');

  const trimmed = value.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div className="absolute inset-0 bg-black/40 backdrop-blur-sm" onClick={onClose} />

      {/* dialog */}
      <div className="relative w-full max-w-md rounded-lg border border-zinc-200 dark:border-zinc-800 bg-white dark:bg-zinc-950 shadow-xl">
        <div className="px-5 py-4 border-b border-zinc-200 dark:border-zinc-800">
          <h2 className="text-sm font-semibold text-zinc-900 dark:text-zinc-50">Use your API key</h2>
          <p className="text-xs text-zinc-500 mt-1">
            Paste your Pollar publishable key to run this demo against your own app.
          </p>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-mono text-zinc-500 dark:text-zinc-400">Publishable key</label>
            <input
              autoFocus
              value={value}
              onChange={e => setValue(e.target.value)}
              onKeyDown={e => {
                if (e.key === 'Enter' && trimmed) onSave(trimmed);
                if (e.key === 'Escape') onClose();
              }}
              placeholder="pub_testnet_..."
              spellCheck={false}
              className="w-full rounded border border-zinc-200 dark:border-zinc-700 bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-zinc-400 placeholder:text-zinc-400"
            />
          </div>

          <p className="text-xs text-zinc-400 leading-relaxed">
            It&apos;s stored only in the URL (<code className="font-mono text-zinc-500 dark:text-zinc-400">?apiKey=…</code>),
            so the SDK client reads it on the next render — nothing is sent anywhere else.
          </p>

          <div className="rounded-md bg-zinc-50 dark:bg-zinc-900/60 border border-zinc-200 dark:border-zinc-800 px-3 py-2.5">
            <p className="text-xs text-zinc-500 dark:text-zinc-400 leading-relaxed">
              Don&apos;t have one? Grab your publishable key from{' '}
              <a
                href="https://dashboard.pollar.xyz"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-zinc-900 dark:text-zinc-100 underline underline-offset-2 hover:text-zinc-600 dark:hover:text-zinc-300"
              >
                dashboard.pollar.xyz
              </a>
              {' '}→ API keys.
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-zinc-200 dark:border-zinc-800 flex items-center justify-between gap-2">
          {isCustom ? (
            <button
              onClick={() => onSave('')}
              className="text-xs font-medium text-zinc-500 hover:text-zinc-900 dark:hover:text-zinc-100 transition-colors"
            >
              Reset to default
            </button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded border border-zinc-200 dark:border-zinc-700 px-3 py-1.5 text-xs font-medium text-zinc-700 dark:text-zinc-300 hover:bg-zinc-50 dark:hover:bg-zinc-800 transition-colors"
            >
              Cancel
            </button>
            <button
              onClick={() => onSave(trimmed)}
              disabled={!trimmed}
              className="rounded bg-zinc-900 dark:bg-zinc-50 px-4 py-1.5 text-xs font-medium text-white dark:text-zinc-900 hover:bg-zinc-700 dark:hover:bg-zinc-200 disabled:opacity-40 transition-colors"
            >
              Save
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
