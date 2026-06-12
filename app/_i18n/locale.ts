import { cookies, headers } from "next/headers";
import { LOCALE_COOKIE, LOCALES, type Locale } from "./translations";

function isLocale(value: string | undefined): value is Locale {
  return value !== undefined && (LOCALES as readonly string[]).includes(value);
}

// Server-side locale resolution: explicit cookie first, then the browser's
// Accept-Language header, then 'en'. Keeping this on the server means SSR
// already renders the right language and hydration never mismatches.
export async function resolveLocale(): Promise<Locale> {
  const stored = (await cookies()).get(LOCALE_COOKIE)?.value;
  if (isLocale(stored)) return stored;

  const acceptLanguage = (await headers()).get("accept-language") ?? "";
  for (const part of acceptLanguage.split(",")) {
    const lang = part.split(";")[0]!.trim().slice(0, 2).toLowerCase();
    if (isLocale(lang)) return lang;
  }
  return "en";
}
