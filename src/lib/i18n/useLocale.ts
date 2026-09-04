"use client";

import { useState, useEffect, useCallback } from "react";
import { Locale, COUNTRY_TO_LOCALE, RTL_LOCALES, t as translate } from "./translations";

const STORAGE_KEY = "nur-finance-locale";

function detectBrowserLocale(): Locale {
  if (typeof navigator === "undefined") return "en";
  const lang = navigator.language?.split("-")[0]?.toLowerCase();
  const supported: Locale[] = ["en", "tr", "de", "fr", "es", "pt", "it", "nl", "ar", "zh", "ja", "ko", "ru", "hi", "id", "ms", "th", "vi", "pl", "sv", "no", "da", "fi", "el", "he", "cs", "ro", "hu", "uk", "bg", "hr", "sk", "sl", "sr", "lt", "lv", "et", "sw", "bn", "ur", "fa", "fil", "ta", "te", "ml", "kn", "mr", "gu"];
  return (supported.find((l) => l === lang) as Locale) || "en";
}

async function detectGeoLocale(): Promise<Locale | null> {
  try {
    const res = await fetch("/api/geo", { signal: AbortSignal.timeout(3000) });
    if (!res.ok) return null;
    const data = await res.json();
    const code = data.country as string;
    return COUNTRY_TO_LOCALE[code] || null;
  } catch {
    return null;
  }
}

export function useLocale() {
  const [locale, setLocaleState] = useState<Locale>("en");
  const [loading, setLoading] = useState(true);
  const [country, setCountry] = useState<string | null>(null);

  useEffect(() => {
    async function init() {
      const stored = localStorage.getItem(STORAGE_KEY) as Locale | null;
      if (stored) {
        setLocaleState(stored);
        setLoading(false);
        return;
      }

      const geoLocale = await detectGeoLocale();
      if (geoLocale) {
        setLocaleState(geoLocale);
        localStorage.setItem(STORAGE_KEY, geoLocale);
      } else {
        const browserLocale = detectBrowserLocale();
        setLocaleState(browserLocale);
        localStorage.setItem(STORAGE_KEY, browserLocale);
      }
      setLoading(false);
    }
    init();
  }, []);

  const setLocale = useCallback((newLocale: Locale) => {
    setLocaleState(newLocale);
    localStorage.setItem(STORAGE_KEY, newLocale);
    document.documentElement.dir = RTL_LOCALES.includes(newLocale) ? "rtl" : "ltr";
    document.documentElement.lang = newLocale;
  }, []);

  const switchToEnglish = useCallback(() => setLocale("en"), [setLocale]);

  const t = useCallback(
    (path: string) => translate(locale, path),
    [locale]
  );

  const isRTL = RTL_LOCALES.includes(locale);

  return { locale, setLocale, switchToEnglish, t, isRTL, loading, country };
}
