import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';
import { Locale, normalizeLocale, getSystemLocale } from '../localization';

interface LocaleState {
  locale: Locale;
  isLoaded: boolean;
  setLocale: (locale: Locale) => void;
  loadLocale: () => Promise<void>;
}

const LOCALE_FILE = FileSystem.documentDirectory + 'locale.json';

export const useLocaleStore = create<LocaleState>((set, get) => ({
  locale: 'en',
  isLoaded: false,
  setLocale: async (locale) => {
    const normalized = normalizeLocale(locale);
    set({ locale: normalized });
    try {
      await FileSystem.writeAsStringAsync(LOCALE_FILE, JSON.stringify({ locale: normalized }));
    } catch (error) {
      console.error('Failed to save locale:', error);
    }
  },
  loadLocale: async () => {
    if (get().isLoaded) return;
    try {
      const info = await FileSystem.getInfoAsync(LOCALE_FILE);
      if (info.exists) {
        const content = await FileSystem.readAsStringAsync(LOCALE_FILE);
        const data = JSON.parse(content);
        if (typeof data.locale === 'string') {
          set({ locale: normalizeLocale(data.locale), isLoaded: true });
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load locale:', error);
    }
    set({ locale: getSystemLocale(), isLoaded: true });
  },
}));
