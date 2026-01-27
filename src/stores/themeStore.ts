import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';

export type ThemeMode = 'light' | 'dark' | 'system';
export type PhotoDisplayMode = 'cover' | 'contain';

interface ThemeState {
  mode: ThemeMode;
  photoDisplayMode: PhotoDisplayMode;
  isLoaded: boolean;
  setMode: (mode: ThemeMode) => void;
  setPhotoDisplayMode: (mode: PhotoDisplayMode) => void;
  loadTheme: () => Promise<void>;
}

const THEME_FILE = FileSystem.documentDirectory + 'theme.json';

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  photoDisplayMode: 'cover',
  isLoaded: false,
  setMode: async (mode) => {
    set({ mode });
    try {
      const { photoDisplayMode } = get();
      await FileSystem.writeAsStringAsync(THEME_FILE, JSON.stringify({ mode, photoDisplayMode }));
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },
  setPhotoDisplayMode: async (photoDisplayMode) => {
    set({ photoDisplayMode });
    try {
      const { mode } = get();
      await FileSystem.writeAsStringAsync(THEME_FILE, JSON.stringify({ mode, photoDisplayMode }));
    } catch (error) {
      console.error('Failed to save photo display mode:', error);
    }
  },
  loadTheme: async () => {
    if (get().isLoaded) return;
    try {
      const info = await FileSystem.getInfoAsync(THEME_FILE);
      if (info.exists) {
        const content = await FileSystem.readAsStringAsync(THEME_FILE);
        const data = JSON.parse(content);
        set({
          mode: data.mode || 'system',
          photoDisplayMode: data.photoDisplayMode || 'cover',
          isLoaded: true
        });
        return;
      }
    } catch (error) {
      console.error('Failed to load theme:', error);
    }
    set({ isLoaded: true });
  },
}));
