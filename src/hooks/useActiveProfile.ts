import { useCallback } from 'react';
import { useFocusEffect } from 'expo-router';
import { useProfileStore } from '../stores/profileStore';

/**
 * Hook for accessing and managing the active baby profile.
 * Auto-loads the profile on first mount if not yet loaded.
 */
export function useActiveProfile() {
  const { activeBaby, isLoaded, loadActiveProfile, setActiveBaby, refreshActiveBaby } =
    useProfileStore();

  useFocusEffect(
    useCallback(() => {
      if (!isLoaded) {
        loadActiveProfile();
      } else {
        refreshActiveBaby();
      }
    }, [isLoaded, loadActiveProfile, refreshActiveBaby])
  );

  return {
    activeBaby,
    isLoaded,
    setActiveBaby,
    refreshActiveBaby,
  };
}
