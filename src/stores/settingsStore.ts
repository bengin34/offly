import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';

const SETTINGS_FILE_PATH = `${FileSystem.documentDirectory}app_settings.json`;

interface SettingsState {
  multiProfileEnabled: boolean;
  isLoaded: boolean;
}

interface SettingsActions {
  loadSettings: () => Promise<void>;
  setMultiProfileEnabled: (value: boolean) => Promise<void>;
}

export const useSettingsStore = create<SettingsState & SettingsActions>((set) => ({
  multiProfileEnabled: false,
  isLoaded: false,

  loadSettings: async () => {
    try {
      const info = await FileSystem.getInfoAsync(SETTINGS_FILE_PATH);
      if (info.exists) {
        const content = await FileSystem.readAsStringAsync(SETTINGS_FILE_PATH);
        const data = JSON.parse(content);
        set({ multiProfileEnabled: data.multiProfileEnabled ?? false, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  setMultiProfileEnabled: async (value: boolean) => {
    set({ multiProfileEnabled: value });
    try {
      await FileSystem.writeAsStringAsync(
        SETTINGS_FILE_PATH,
        JSON.stringify({ multiProfileEnabled: value })
      );
    } catch (error) {
      console.error('Failed to persist settings:', error);
    }
  },
}));
