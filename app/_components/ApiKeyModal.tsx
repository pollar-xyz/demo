"use client";

import { useState } from "react";
import { useI18n } from "../_i18n/LanguageProvider";

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
  const { t } = useI18n();
  const [value, setValue] = useState(isCustom ? currentKey : "");

  const trimmed = value.trim();

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4">
      {/* backdrop */}
      <div
        className="absolute inset-0 bg-black/40 backdrop-blur-sm"
        onClick={onClose}
      />

      {/* dialog */}
      <div className="relative w-full max-w-md rounded-xl border border-border bg-background shadow-xl">
        <div className="px-5 py-4 border-b border-border">
          <h2 className="text-sm font-semibold text-foreground">
            {t.apiKeyModal.title}
          </h2>
          <p className="text-xs text-muted mt-1">{t.apiKeyModal.subtitle}</p>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-mono text-muted">
              {t.apiKeyModal.keyLabel}
            </label>
            <input
              autoFocus
              value={value}
              onChange={(e) => setValue(e.target.value)}
              onKeyDown={(e) => {
                if (e.key === "Enter" && trimmed) onSave(trimmed);
                if (e.key === "Escape") onClose();
              }}
              placeholder="pub_testnet_..."
              spellCheck={false}
              className="w-full rounded-lg border border-border bg-transparent px-3 py-2 text-sm font-mono outline-none focus:border-primary placeholder:text-muted-light"
            />
          </div>

          <p className="text-xs text-muted-light leading-relaxed">
            {t.apiKeyModal.storedNote1}
            <code className="font-mono text-muted">?apiKey=…</code>
            {t.apiKeyModal.storedNote2}
          </p>

          <div className="rounded-lg bg-surface border border-border px-3 py-2.5">
            <p className="text-xs text-muted leading-relaxed">
              {t.apiKeyModal.noKey1}
              <a
                href="https://dashboard.pollar.xyz"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
              >
                dashboard.pollar.xyz
              </a>
              {t.apiKeyModal.noKey2}
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-between gap-2">
          {isCustom ? (
            <button
              onClick={() => onSave("")}
              className="text-xs font-medium text-muted hover:text-foreground transition-colors"
            >
              {t.apiKeyModal.reset}
            </button>
          ) : (
            <span />
          )}

          <div className="flex gap-2">
            <button
              onClick={onClose}
              className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
            >
              {t.common.cancel}
            </button>
            <button
              onClick={() => onSave(trimmed)}
              disabled={!trimmed}
              className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-hover disabled:opacity-40 transition-colors"
            >
              {t.common.save}
            </button>
          </div>
        </div>
      </div>
    </div>
  );
}
