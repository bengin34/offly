import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';

interface OnboardingState {
  hasCompletedOnboarding: boolean;
  isLoaded: boolean;
  completeOnboarding: () => Promise<void>;
  loadOnboardingState: () => Promise<void>;
  resetOnboarding: () => Promise<void>;
}

export const ONBOARDING_VERSION = 'onboarding_v2';

const ONBOARDING_FILE = FileSystem.documentDirectory + 'onboarding.json';

export const useOnboardingStore = create<OnboardingState>((set, get) => ({
  hasCompletedOnboarding: false,
  isLoaded: false,

  completeOnboarding: async () => {
    set({ hasCompletedOnboarding: true });
    try {
      await FileSystem.writeAsStringAsync(
        ONBOARDING_FILE,
        JSON.stringify({ hasCompletedOnboarding: true, version: ONBOARDING_VERSION })
      );
    } catch (error) {
      console.error('Failed to save onboarding state:', error);
    }
  },

  loadOnboardingState: async () => {
    if (get().isLoaded) return;
    try {
      const info = await FileSystem.getInfoAsync(ONBOARDING_FILE);
      if (info.exists) {
        const content = await FileSystem.readAsStringAsync(ONBOARDING_FILE);
        const data = JSON.parse(content);
        if (data.hasCompletedOnboarding && data.version === ONBOARDING_VERSION) {
          set({ hasCompletedOnboarding: true, isLoaded: true });
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load onboarding state:', error);
    }
    set({ isLoaded: true });
  },

  resetOnboarding: async () => {
    set({ hasCompletedOnboarding: false });
    try {
      const info = await FileSystem.getInfoAsync(ONBOARDING_FILE);
      if (info.exists) {
        await FileSystem.deleteAsync(ONBOARDING_FILE);
      }
    } catch (error) {
      console.error('Failed to reset onboarding:', error);
    }
  },
}));
