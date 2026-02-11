import { useMemo } from 'react';
import { Locale } from '../localization';
import { isMockActive } from './config';
import { getLocaleMockData, LocaleMockData } from './mockData';

export function useMockData(
  locale: Locale,
  mode: 'pregnancy' | 'baby' = 'baby'
): LocaleMockData | null {
  return useMemo(
    () => (isMockActive() ? getLocaleMockData(locale, mode) : null),
    [locale, mode]
  );
}
