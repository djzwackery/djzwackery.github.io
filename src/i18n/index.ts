/**
 * Translation helpers used across the site. Components read
 * `Astro.currentLocale` and pass it to `useTranslations`.
 */
import { ui, defaultLang, type Lang, type UiKey } from "./ui";

/**
 * Coerce an arbitrary locale string to a supported Lang, falling back to the
 * default language when the locale is missing or unknown.
 */
export function getLang(locale: string | undefined): Lang {
  return locale && locale in ui ? (locale as Lang) : defaultLang;
}

/**
 * Return a translate function bound to the given locale. Supports {token}
 * interpolation via the optional vars argument.
 */
export function useTranslations(locale: string | undefined) {
  const lang = getLang(locale);
  return function t(key: UiKey, vars?: Record<string, string>): string {
    let value: string = ui[lang][key] ?? ui[defaultLang][key];
    if (vars) {
      for (const [name, replacement] of Object.entries(vars)) {
        value = value.replaceAll(`{${name}}`, replacement);
      }
    }
    return value;
  };
}

/**
 * Turn [[bracketed]] spans into neon-highlighted markup for use with set:html.
 */
export function highlight(text: string): string {
  return text.replace(/\[\[(.+?)\]\]/g, '<span class="hl">$1</span>');
}
