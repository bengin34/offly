import { useCallback } from 'react';
import { translate, TranslationParams, Locale } from '../localization';
import { useLocaleStore } from '../stores/localeStore';

export function useI18n(): {
  t: (key: string, params?: TranslationParams) => string;
  locale: Locale;
  setLocale: (locale: Locale) => void;
} {
  const { locale, setLocale } = useLocaleStore();
  const t = useCallback(
    (key: string, params?: TranslationParams) => translate(locale, key, params),
    [locale]
  );

  return { t, locale, setLocale };
}
