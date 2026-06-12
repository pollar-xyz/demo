"use client";

// Lightweight i18n: a context that holds the active locale and hands out the
// matching dictionary. The initial locale is resolved server-side (cookie or
// Accept-Language, see locale.ts) so SSR and the client render the same
// language. Switching writes the cookie back so the next request matches too.

import { createContext, useContext, useEffect, useState } from "react";
import {
  DICTIONARIES,
  LOCALE_COOKIE,
  type Dictionary,
  type Locale,
} from "./translations";

type I18nContextValue = {
  locale: Locale;
  setLocale: (locale: Locale) => void;
  t: Dictionary;
};

const I18nContext = createContext<I18nContextValue | null>(null);

export function LanguageProvider({
  initialLocale,
  children,
}: {
  initialLocale: Locale;
  children: React.ReactNode;
}) {
  const [locale, setLocaleState] = useState<Locale>(initialLocale);

  useEffect(() => {
    document.documentElement.lang = locale;
  }, [locale]);

  function setLocale(next: Locale) {
    setLocaleState(next);
    document.cookie = `${LOCALE_COOKIE}=${next}; path=/; max-age=31536000; samesite=lax`;
  }

  return (
    <I18nContext.Provider
      value={{ locale, setLocale, t: DICTIONARIES[locale] }}
    >
      {children}
    </I18nContext.Provider>
  );
}

export function useI18n(): I18nContextValue {
  const ctx = useContext(I18nContext);
  if (!ctx) throw new Error("useI18n must be used within a LanguageProvider");
  return ctx;
}
