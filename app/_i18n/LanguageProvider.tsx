'use client';

// Lightweight i18n: a context that holds the active locale and hands out the
// matching dictionary. Persisted in localStorage; falls back to the browser
// language on first visit. State starts as 'en' so SSR and the first client
// render match — the stored locale is applied right after hydration.

import { createContext, useContext, useEffect, useState } from 'react';
import { DICTIONARIES, LOCALES, type Dictionary, type Locale } from './translations';

const STORAGE_KEY = 'pollar-demo-locale';

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

function isLocale(value: string | null): value is Locale {
  return value !== null && (LOCALES as readonly string[]).includes(value);
}

export function LanguageProvider({ children }: { children: React.ReactNode }) {
  const [locale, setLocaleState] = useState<Locale>('en');

  useEffect(() => {
    let stored: string | null = null;
    try {
      stored = localStorage.getItem(STORAGE_KEY);
    } catch {}
    const browser = navigator.language.slice(0, 2).toLowerCase();
    const initial = isLocale(stored) ? stored : isLocale(browser) ? browser : null;
    // setState here is intentional: SSR always renders 'en', and the stored
    // locale can only be applied after hydration without a markup mismatch.
    // eslint-disable-next-line react-hooks/set-state-in-effect
    if (initial && initial !== 'en') setLocaleState(initial);
  }, []);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    try {
      localStorage.setItem(STORAGE_KEY, next);
    } catch {}
  }

  return (
    <I18nContext.Provider value={{ locale, setLocale, t: DICTIONARIES[locale] }}>
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error('useI18n must be used within a LanguageProvider');
  return ctx;
}
