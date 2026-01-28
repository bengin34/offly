import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';

const BACKUP_FILE_PATH = `${FileSystem.documentDirectory}backup_state.json`;

interface BackupState {
  lastBackupDate: string | null;
  isLoaded: boolean;
}

interface BackupActions {
  loadBackupState: () => Promise<void>;
  setLastBackupDate: (date: string) => Promise<void>;
}

export const useBackupStore = create<BackupState & BackupActions>((set) => ({
  lastBackupDate: null,
  isLoaded: false,

  loadBackupState: async () => {
    try {
      const info = await FileSystem.getInfoAsync(BACKUP_FILE_PATH);
      if (info.exists) {
        const content = await FileSystem.readAsStringAsync(BACKUP_FILE_PATH);
        const data = JSON.parse(content);
        set({ lastBackupDate: data.lastBackupDate ?? null, isLoaded: true });
      } else {
        set({ isLoaded: true });
      }
    } catch {
      set({ isLoaded: true });
    }
  },

  setLastBackupDate: async (date: string) => {
    set({ lastBackupDate: date });
    try {
      await FileSystem.writeAsStringAsync(
        BACKUP_FILE_PATH,
        JSON.stringify({ lastBackupDate: date })
      );
    } catch (error) {
      console.error('Failed to persist backup date:', error);
    }
  },
}));
