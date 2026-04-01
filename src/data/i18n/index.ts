import { en } from "./en";
import { pt } from "./pt";
import type { Dictionary, Locale } from "./types";

export type { Dictionary, Locale };

export const dictionaries: Record<Locale, Dictionary> = { pt, en };

export function getDictionary(locale: Locale): Dictionary {
  return dictionaries[locale] || dictionaries.pt;
}

export function isValidLocale(locale: string): locale is Locale {
  return locale === "pt" || locale === "en";
}

export function getLocaleFromUrl(url: URL): Locale {
  const path = url.pathname;
  if (path.startsWith("/en")) return "en";
  return "pt";
}

export function localePath(path: string, locale: Locale): string {
  if (locale === "pt") return path;
  return `/en${path === "/" ? "" : path}`;
}

export const defaultLocale: Locale = "pt";
export const locales: Locale[] = ["pt", "en"];
