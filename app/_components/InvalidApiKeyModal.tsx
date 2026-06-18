"use client";

import { useI18n } from "../_i18n/LanguageProvider";

// Shown when the Pollar SDK's `/applications/config` request is rejected with
// 401 API_KEY_NOT_FOUND — i.e. the API key in use isn't recognized by the
// backend. Shows the offending key and points the user to the dashboard.

export function InvalidApiKeyModal({
  apiKey,
  onClose,
}: {
  apiKey: string;
  onClose: () => void;
}) {
  const { t } = useI18n();

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
            {t.invalidKeyModal.title}
          </h2>
          <p className="text-xs text-muted mt-1">
            {t.invalidKeyModal.subtitle}
          </p>
        </div>

        <div className="px-5 py-4 space-y-3">
          <div className="space-y-1">
            <label className="block text-xs font-mono text-muted">
              {t.invalidKeyModal.keyLabel}
            </label>
            <code className="block w-full rounded-lg border border-border bg-surface px-3 py-2 text-sm font-mono text-foreground break-all">
              {apiKey}
            </code>
          </div>

          <div className="rounded-lg bg-surface border border-border px-3 py-2.5">
            <p className="text-xs text-muted leading-relaxed">
              {t.invalidKeyModal.instructions1}
              <a
                href="https://dashboard.pollar.xyz/apps"
                target="_blank"
                rel="noreferrer"
                className="font-medium text-primary underline underline-offset-2 hover:text-primary-hover"
              >
                dashboard.pollar.xyz
              </a>
              {t.invalidKeyModal.instructions2}
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            {t.invalidKeyModal.dismiss}
          </button>
          <a
            href="https://dashboard.pollar.xyz/apps"
            target="_blank"
            rel="noreferrer"
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-hover transition-colors"
          >
            {t.invalidKeyModal.openDashboard}
          </a>
        </div>
      </div>
    </div>
  );
}
