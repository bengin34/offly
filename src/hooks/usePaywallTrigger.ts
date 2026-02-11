import { useCallback } from 'react';
import { useSubscription } from './useSubscriptions';
import {
  usePaywallStore,
  type FeatureGate,
  type ContextualTrigger,
  USAGE_TRIGGERS,
} from '../stores/paywallStore';
import { APP_LIMITS } from '../constants/limits';

/**
 * Unified hook for managing paywall triggers throughout the app.
 * Combines subscription state with paywall trigger logic.
 */
export function usePaywallTrigger() {
  const { isPro, presentPaywall, isLoading: subscriptionLoading } = useSubscription();

  const {
    // Increments
    incrementChapters,
    incrementMemories,
    incrementPhotos,
    incrementSearches,

    // Checks
    shouldShowUsagePaywall,
    shouldShowContextualPaywall,

    // Recording
    recordPaywallShown,
    recordPaywallDismiss,
    recordFeatureGateShown,
    recordActivity,
  } = usePaywallStore();

  /**
   * Show paywall and handle the result.
   * Returns true if user purchased, false if dismissed.
   */
  const showPaywall = useCallback(async (): Promise<boolean> => {
    await recordPaywallShown();
    const purchased = await presentPaywall();
    if (!purchased) {
      await recordPaywallDismiss();
    }
    return purchased;
  }, [presentPaywall, recordPaywallShown, recordPaywallDismiss]);

  /**
   * Check and show usage-based paywall if conditions are met.
   * Call this after incrementing usage counters.
   * Returns true if paywall was shown and user purchased.
   */
  const checkUsagePaywall = useCallback(async (): Promise<boolean> => {
    if (isPro) return false;

    const { shouldShow, trigger } = shouldShowUsagePaywall();
    if (shouldShow && trigger) {
      return await showPaywall();
    }
    return false;
  }, [isPro, shouldShowUsagePaywall, showPaywall]);

  /**
   * Check and show feature-gated paywall.
   * Use this before allowing access to premium features.
   * Returns true if user can access the feature (isPro or just purchased).
   */
  const checkFeaturePaywall = useCallback(
    async (feature: FeatureGate): Promise<boolean> => {
      if (isPro) return true;

      await recordFeatureGateShown(feature);
      const purchased = await showPaywall();
      return purchased;
    },
    [isPro, recordFeatureGateShown, showPaywall]
  );

  /**
   * Check and show contextual paywall.
   * Use this for engagement-based triggers.
   * Returns true if paywall was shown and user purchased.
   */
  const checkContextualPaywall = useCallback(
    async (context: ContextualTrigger): Promise<boolean> => {
      if (isPro) return false;

      if (shouldShowContextualPaywall(context)) {
        return await showPaywall();
      }
      return false;
    },
    [isPro, shouldShowContextualPaywall, showPaywall]
  );

  /**
   * Convenience: Increment chapters and check paywall
   */
  const onChapterCreated = useCallback(async (): Promise<boolean> => {
    await incrementChapters();
    return await checkUsagePaywall();
  }, [incrementChapters, checkUsagePaywall]);

  /**
   * Convenience: Increment memories (and photos) and check paywall
   */
  const onMemoryCreated = useCallback(
    async (photoCount: number = 0): Promise<boolean> => {
      await incrementMemories();
      if (photoCount > 0) {
        await incrementPhotos(photoCount);
      }
      return await checkUsagePaywall();
    },
    [incrementMemories, incrementPhotos, checkUsagePaywall]
  );

  /**
   * Convenience: Increment searches and check paywall
   */
  const onSearchPerformed = useCallback(async (): Promise<boolean> => {
    await incrementSearches();
    return await checkUsagePaywall();
  }, [incrementSearches, checkUsagePaywall]);

  /**
   * Check for app return paywall (call on app focus/mount)
   */
  const onAppActive = useCallback(async (): Promise<boolean> => {
    await recordActivity();
    return await checkContextualPaywall('app_return');
  }, [recordActivity, checkContextualPaywall]);

  /**
   * Check if user can create a chapter based on their current chapter count.
   * Free users are limited to APP_LIMITS.FREE_MAX_CHAPTERS chapters.
   */
  const checkChapterLimit = useCallback(
    async (currentChapterCount: number): Promise<{
      canCreate: boolean;
      shouldShowPaywall: boolean;
      currentCount: number;
      limit: number;
    }> => {
      const limit = APP_LIMITS.FREE_MAX_CHAPTERS;

      if (isPro) {
        return { canCreate: true, shouldShowPaywall: false, currentCount: currentChapterCount, limit };
      }

      const atLimit = currentChapterCount >= limit;
      return {
        canCreate: !atLimit,
        shouldShowPaywall: atLimit,
        currentCount: currentChapterCount,
        limit,
      };
    },
    [isPro]
  );

  /**
   * Check if backup reminder should be shown based on chapter count.
   * Shows reminder every APP_LIMITS.BACKUP_REMINDER_CHAPTERS chapters.
   */
  const shouldShowBackupReminder = useCallback(
    (chapterCount: number): boolean => {
      if (chapterCount === 0) return false;
      return chapterCount % APP_LIMITS.BACKUP_REMINDER_CHAPTERS === 0;
    },
    []
  );

  /**
   * Check if user can create an age-locked letter based on current letter count.
   * Free users are limited to APP_LIMITS.FREE_MAX_AGE_LOCKED_LETTERS letters.
   */
  const checkAgeLockedLetterLimit = useCallback(
    async (currentLetterCount: number): Promise<{
      canCreate: boolean;
      shouldShowPaywall: boolean;
      currentCount: number;
      limit: number;
    }> => {
      const limit = APP_LIMITS.FREE_MAX_AGE_LOCKED_LETTERS;

      if (isPro) {
        return { canCreate: true, shouldShowPaywall: false, currentCount: currentLetterCount, limit };
      }

      const atLimit = currentLetterCount >= limit;
      return {
        canCreate: !atLimit,
        shouldShowPaywall: atLimit,
        currentCount: currentLetterCount,
        limit,
      };
    },
    [isPro]
  );

  return {
    // State
    isPro,
    isLoading: subscriptionLoading,

    // Core functions
    showPaywall,
    checkUsagePaywall,
    checkFeaturePaywall,
    checkContextualPaywall,

    // Convenience functions for common actions
    onChapterCreated,
    onMemoryCreated,
    onSearchPerformed,
    onAppActive,

    // Chapter limit checks
    checkChapterLimit,
    checkAgeLockedLetterLimit,
    shouldShowBackupReminder,

    // Re-export config for reference
    USAGE_TRIGGERS,
    APP_LIMITS,
  };
}

export type { FeatureGate, ContextualTrigger };
