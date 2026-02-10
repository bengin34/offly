import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';
import type { ThemePalette } from '../constants/colors';

export type ThemeMode = 'light' | 'dark' | 'system';
export type PhotoDisplayMode = 'cover' | 'contain';

interface ThemeState {
  mode: ThemeMode;
  palette: ThemePalette;
  photoDisplayMode: PhotoDisplayMode;
  isLoaded: boolean;
  setMode: (mode: ThemeMode) => void;
  setPalette: (palette: ThemePalette) => void;
  setPhotoDisplayMode: (mode: PhotoDisplayMode) => void;
  loadTheme: () => Promise<void>;
}

const THEME_FILE = FileSystem.documentDirectory + 'theme.json';

const persistThemeState = async (
  mode: ThemeMode,
  palette: ThemePalette,
  photoDisplayMode: PhotoDisplayMode
) => {
  await FileSystem.writeAsStringAsync(
    THEME_FILE,
    JSON.stringify({ mode, palette, photoDisplayMode })
  );
};

export const useThemeStore = create<ThemeState>((set, get) => ({
  mode: 'system',
  palette: 'blush',
  photoDisplayMode: 'cover',
  isLoaded: false,
  setMode: async (mode) => {
    set({ mode });
    try {
      const { palette, photoDisplayMode } = get();
      await persistThemeState(mode, palette, photoDisplayMode);
    } catch (error) {
      console.error('Failed to save theme:', error);
    }
  },
  setPalette: async (palette) => {
    set({ palette });
    try {
      const { mode, photoDisplayMode } = get();
      await persistThemeState(mode, palette, photoDisplayMode);
    } catch (error) {
      console.error('Failed to save palette:', error);
    }
  },
  setPhotoDisplayMode: async (photoDisplayMode) => {
    set({ photoDisplayMode });
    try {
      const { mode, palette } = get();
      await persistThemeState(mode, palette, photoDisplayMode);
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
          palette: data.palette || 'blush',
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
