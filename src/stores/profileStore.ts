import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';
import { BabyProfileRepository } from '../db/repositories/BabyProfileRepository';
import type { BabyProfile } from '../types';

const ACTIVE_PROFILE_FILE = `${FileSystem.documentDirectory}active_profile.json`;

interface ProfileState {
  activeBaby: BabyProfile | null;
  isLoaded: boolean;
}

interface ProfileActions {
  loadActiveProfile: () => Promise<void>;
  setActiveBaby: (id: string) => Promise<void>;
  refreshActiveBaby: () => Promise<void>;
  clearActiveBaby: () => void;
}

export const useProfileStore = create<ProfileState & ProfileActions>((set, get) => ({
  activeBaby: null,
  isLoaded: false,

  loadActiveProfile: async () => {
    try {
      // Try to read persisted active profile ID
      let savedId: string | null = null;
      const info = await FileSystem.getInfoAsync(ACTIVE_PROFILE_FILE);
      if (info.exists) {
        const content = await FileSystem.readAsStringAsync(ACTIVE_PROFILE_FILE);
        const data = JSON.parse(content);
        savedId = data.activeBabyId ?? null;
      }

      // Try to load the saved profile
      if (savedId) {
        const profile = await BabyProfileRepository.getById(savedId);
        if (profile) {
          const current = get().activeBaby;
          const isSameProfile =
            current?.id === profile.id && current?.updatedAt === profile.updatedAt;
          if (!isSameProfile || !get().isLoaded) {
            set({ activeBaby: profile, isLoaded: true });
          }
          return;
        }
      }

      // Fall back to default profile
      const defaultProfile = await BabyProfileRepository.getDefault();
      if (defaultProfile) {
        await FileSystem.writeAsStringAsync(
          ACTIVE_PROFILE_FILE,
          JSON.stringify({ activeBabyId: defaultProfile.id })
        );
      }
      const current = get().activeBaby;
      const isSameProfile =
        current?.id === defaultProfile?.id && current?.updatedAt === defaultProfile?.updatedAt;
      if (!isSameProfile || !get().isLoaded) {
        set({ activeBaby: defaultProfile, isLoaded: true });
      }
    } catch (error) {
      console.error('Failed to load active profile:', error);
      // Last resort: try default
      try {
        const fallback = await BabyProfileRepository.getDefault();
        const current = get().activeBaby;
        const isSameProfile =
          current?.id === fallback?.id && current?.updatedAt === fallback?.updatedAt;
        if (!isSameProfile || !get().isLoaded) {
          set({ activeBaby: fallback, isLoaded: true });
        }
      } catch {
        set({ isLoaded: true });
      }
    }
  },

  setActiveBaby: async (id: string) => {
    try {
      const profile = await BabyProfileRepository.getById(id);
      if (!profile) return;

      set({ activeBaby: profile });
      await BabyProfileRepository.setDefault(id);
      await FileSystem.writeAsStringAsync(
        ACTIVE_PROFILE_FILE,
        JSON.stringify({ activeBabyId: id })
      );
    } catch (error) {
      console.error('Failed to set active baby:', error);
    }
  },

  refreshActiveBaby: async () => {
    const { activeBaby } = get();
    if (!activeBaby) return;
    try {
      const updated = await BabyProfileRepository.getById(activeBaby.id);
      if (updated) {
        set({ activeBaby: updated });
      }
    } catch (error) {
      console.error('Failed to refresh active baby:', error);
    }
  },

  clearActiveBaby: () => {
    set({ activeBaby: null, isLoaded: false });
  },
}));
