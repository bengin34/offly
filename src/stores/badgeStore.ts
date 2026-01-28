import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';
import type { UnlockedBadge, Badge } from '../utils/badges';
import { evaluateBadges } from '../utils/badges';
import type { BabyStats, PostInstallStats } from '../db/repositories/StatsRepository';

interface BadgeState {
  unlockedBadges: UnlockedBadge[];
  appInstalledAt: string | null;
  isLoaded: boolean;
  pendingToast: Badge | null;
  loadBadges: () => Promise<void>;
  checkAndUnlockBadges: (stats: BabyStats, postInstallStats: PostInstallStats) => Promise<Badge[]>;
  getAppInstalledAt: () => string | null;
  clearPendingToast: () => void;
  triggerBadgeUnlock: (badge: Badge) => Promise<void>;
}

const BADGES_FILE = FileSystem.documentDirectory + 'badges.json';

export const useBadgeStore = create<BadgeState>((set, get) => ({
  unlockedBadges: [],
  appInstalledAt: null,
  isLoaded: false,
  pendingToast: null,

  loadBadges: async () => {
    if (get().isLoaded) return;
    try {
      const info = await FileSystem.getInfoAsync(BADGES_FILE);
      if (info.exists) {
        const content = await FileSystem.readAsStringAsync(BADGES_FILE);
        const data = JSON.parse(content);
        const unlockedBadges = Array.isArray(data.unlockedBadges) ? data.unlockedBadges : [];
        const appInstalledAt = data.appInstalledAt || null;

        if (appInstalledAt) {
          set({ unlockedBadges, appInstalledAt, isLoaded: true });
          return;
        }
      }
    } catch (error) {
      console.error('Failed to load badges:', error);
    }

    // First time install - set appInstalledAt
    const now = new Date().toISOString();
    set({ appInstalledAt: now, isLoaded: true });

    // Persist the install date
    try {
      await FileSystem.writeAsStringAsync(
        BADGES_FILE,
        JSON.stringify({ unlockedBadges: [], appInstalledAt: now })
      );
    } catch (error) {
      console.error('Failed to save initial badges file:', error);
    }
  },

  getAppInstalledAt: () => {
    return get().appInstalledAt;
  },

  checkAndUnlockBadges: async (stats: BabyStats, postInstallStats: PostInstallStats) => {
    const { unlockedBadges, appInstalledAt } = get();
    const { unlocked, newlyUnlocked } = evaluateBadges(
      stats,
      postInstallStats,
      [...unlockedBadges],
      appInstalledAt
    );

    if (newlyUnlocked.length > 0) {
      set({ unlockedBadges: unlocked });

      // Save to file
      try {
        await FileSystem.writeAsStringAsync(
          BADGES_FILE,
          JSON.stringify({ unlockedBadges: unlocked, appInstalledAt })
        );
      } catch (error) {
        console.error('Failed to save badges:', error);
      }

      // Set the first newly unlocked badge for toast
      set({ pendingToast: newlyUnlocked[0] });
    }

    return newlyUnlocked;
  },

  clearPendingToast: () => {
    set({ pendingToast: null });
  },

  triggerBadgeUnlock: async (badge: Badge) => {
    const { unlockedBadges, appInstalledAt } = get();
    const now = new Date().toISOString();
    const alreadyUnlocked = unlockedBadges.some((u) => u.badgeId === badge.id);
    const updatedBadges = alreadyUnlocked
      ? unlockedBadges
      : [...unlockedBadges, { badgeId: badge.id, unlockedAt: now }];

    set({ unlockedBadges: updatedBadges, pendingToast: badge });

    try {
      await FileSystem.writeAsStringAsync(
        BADGES_FILE,
        JSON.stringify({ unlockedBadges: updatedBadges, appInstalledAt })
      );
    } catch (error) {
      console.error('Failed to save badges:', error);
    }
  },
}));
