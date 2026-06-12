'use client';

// Compact language dropdown for the header. Same open/close behavior as
// Select, but sized to sit next to the theme toggle.

import { useEffect, useRef, useState } from 'react';
import { useI18n } from '../_i18n/LanguageProvider';
import { DICTIONARIES, LOCALES, type Locale } from '../_i18n/translations';

export function LanguageSwitcher() {
  const { locale, setLocale, t } = useI18n();
  const [open, setOpen] = useState(false);
  const ref = useRef<HTMLDivElement>(null);

  useEffect(() => {
    if (!open) return;
    const onPointerDown = (e: MouseEvent) => {
      if (!ref.current?.contains(e.target as Node)) setOpen(false);
    };
    const onKeyDown = (e: KeyboardEvent) => {
      if (e.key === 'Escape') setOpen(false);
    };
    document.addEventListener('mousedown', onPointerDown);
    document.addEventListener('keydown', onKeyDown);
    return () => {
      document.removeEventListener('mousedown', onPointerDown);
      document.removeEventListener('keydown', onKeyDown);
    };
  }, [open]);

  function pick(next: Locale) {
    setLocale(next);
    setOpen(false);
  }

  return (
    <div ref={ref} className="relative">
      <button
        type="button"
        onClick={() => setOpen(o => !o)}
        aria-label={t.shell.changeLanguage}
        aria-haspopup="listbox"
        aria-expanded={open}
        className="flex h-9 items-center gap-1.5 rounded-lg border border-border px-2.5 text-xs font-medium text-muted hover:text-foreground hover:bg-surface transition-colors"
      >
        <svg className="h-4 w-4" fill="none" viewBox="0 0 24 24" stroke="currentColor" strokeWidth="2">
          <path
            strokeLinecap="round"
            strokeLinejoin="round"
            d="M12 21a9 9 0 100-18 9 9 0 000 18zm0 0c2.485 0 4.5-4.03 4.5-9S14.485 3 12 3 7.5 7.03 7.5 12s2.015 9 4.5 9zM3.6 9h16.8M3.6 15h16.8"
          />
        </svg>
        <span className="uppercase">{locale}</span>
        <svg
          className={`h-3 w-3 transition-transform ${open ? 'rotate-180' : ''}`}
          fill="none"
          viewBox="0 0 24 24"
          stroke="currentColor"
          strokeWidth="2"
        >
          <path strokeLinecap="round" strokeLinejoin="round" d="M19 9l-7 7-7-7" />
        </svg>
      </button>

      {open && (
        <ul
          role="listbox"
          aria-label={t.shell.changeLanguage}
          className="absolute right-0 z-50 mt-1.5 w-36 rounded-lg border border-border bg-background p-1 shadow-lg shadow-black/10"
        >
          {LOCALES.map(l => {
            const isSelected = l === locale;
            return (
              <li key={l} role="option" aria-selected={isSelected}>
                <button
                  type="button"
                  onClick={() => pick(l)}
                  className={`w-full flex items-center justify-between gap-2 rounded-md px-2.5 py-2 text-left text-sm transition-colors ${
                    isSelected
                      ? 'bg-primary-light text-primary font-medium'
                      : 'text-foreground hover:bg-surface'
                  }`}
                >
                  <span>{DICTIONARIES[l].langName}</span>
                  {isSelected && (
                    <svg className="h-4 w-4 shrink-0" fill="currentColor" viewBox="0 0 20 20">
                      <path
                        fillRule="evenodd"
                        d="M16.704 4.153a.75.75 0 01.143 1.052l-8 10.5a.75.75 0 01-1.127.075l-4.5-4.5a.75.75 0 011.06-1.06l3.894 3.893 7.48-9.817a.75.75 0 011.05-.143z"
                        clipRule="evenodd"
                      />
                    </svg>
                  )}
                </button>
              </li>
            );
          })}
        </ul>
      )}
    </div>
  );
}
