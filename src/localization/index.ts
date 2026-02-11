export const supportedLocales = [
  'en',
  'de',
  'it',
  'fr',
  'es',
  'tr',
  'ja',
  'ko',
  'nl',
  'pl',
  'pt',
  'ru',
] as const;
export type Locale = (typeof supportedLocales)[number];

export type TranslationParams = Record<string, string | number>;

type TranslationTree = Record<string, unknown>;

const translations: Record<Locale, TranslationTree> = {
  en: require('./en.json'),
  de: require('./de.json'),
  it: require('./it.json'),
  fr: require('./fr.json'),
  es: require('./es.json'),
  tr: require('./tr.json'),
  ja: require('./ja.json'),
  ko: require('./ko.json'),
  nl: require('./nl.json'),
  pl: require('./pl.json'),
  pt: require('./pt.json'),
  ru: require('./ru.json'),
};

const fallbackLocale: Locale = 'en';

function getNestedValue(source: TranslationTree, path: string): unknown {
  const parts = path.split('.');
  let current: unknown = source;

  for (const part of parts) {
    if (!current || typeof current !== 'object' || Array.isArray(current)) {
      return undefined;
    }
    current = (current as Record<string, unknown>)[part];
  }

  return current;
}

function formatTemplate(value: unknown, params?: TranslationParams): unknown {
  if (typeof value !== 'string' || !params) {
    return value;
  }

  return value.replace(/\{(\w+)\}/g, (match, token) => {
    const replacement = params[token];
    return replacement === undefined ? match : String(replacement);
  });
}

export function translate(
  locale: Locale,
  key: string,
  params?: TranslationParams,
): string {
  const table = translations[locale] || translations[fallbackLocale];
  const fallbackTable = translations[fallbackLocale];

  const raw =
    getNestedValue(table, key) ??
    getNestedValue(fallbackTable, key) ??
    key;

  const formatted = formatTemplate(raw, params);
  return formatted as string;
}

export function normalizeLocale(input?: string): Locale {
  if (!input) return fallbackLocale;

  const normalized = input.toLowerCase().replace('_', '-').split('-')[0];
  return supportedLocales.includes(normalized as Locale)
    ? (normalized as Locale)
    : fallbackLocale;
}

export function getSystemLocale(): Locale {
  try {
    const resolved = Intl.DateTimeFormat().resolvedOptions().locale;
    return normalizeLocale(resolved);
  } catch {
    return fallbackLocale;
  }
}

export function getLocaleLabel(locale: Locale): string {
  const labels: Record<Locale, string> = {
    en: 'English',
    de: 'Deutsch',
    it: 'Italiano',
    fr: 'Français',
    es: 'Español',
    tr: 'Türkçe',
    ja: '日本語',
    ko: '한국어',
    nl: 'Nederlands',
    pl: 'Polski',
    pt: 'Português (Brasil)',
    ru: 'Русский',
  };

  return labels[locale];
}
