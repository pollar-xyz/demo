"use client";

import { useI18n } from "../_i18n/LanguageProvider";

// Shown when a custom API key is in use and the user tries to flip the network
// toggle. A key's network is fixed by its prefix (pub_testnet_… / pub_mainnet_…),
// so switching networks means swapping the key — not toggling.

export function NetworkLockedModal({
  onClose,
  onChangeKey,
}: {
  onClose: () => void;
  onChangeKey: () => void;
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
            {t.networkModal.title}
          </h2>
          <p className="text-xs text-muted mt-1">{t.networkModal.subtitle}</p>
        </div>

        <div className="px-5 py-4">
          <div className="rounded-lg bg-surface border border-border px-3 py-2.5">
            <p className="text-xs text-muted leading-relaxed">
              {t.networkModal.body}
            </p>
          </div>
        </div>

        <div className="px-5 py-3 border-t border-border flex items-center justify-end gap-2">
          <button
            onClick={onClose}
            className="rounded-lg border border-border px-3 py-1.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
          >
            {t.networkModal.dismiss}
          </button>
          <button
            onClick={onChangeKey}
            className="rounded-lg bg-primary px-4 py-1.5 text-xs font-medium text-white hover:bg-primary-hover transition-colors"
          >
            {t.networkModal.changeKey}
          </button>
        </div>
      </div>
    </div>
  );
}
