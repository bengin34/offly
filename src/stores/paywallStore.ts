import { create } from 'zustand';
import * as FileSystem from 'expo-file-system/legacy';

const PAYWALL_FILE_PATH = `${FileSystem.documentDirectory}paywall_state.json`;

// ============================================================
// PAYWALL TRIGGER CONFIGURATION
// ============================================================

/**
 * Usage-based triggers - show paywall after reaching these thresholds
 */
export const USAGE_TRIGGERS = {
  CHAPTERS: 2,        // After 2nd chapter created
  MEMORIES: 5,        // After 5th memory created
  PHOTOS: 10,         // After 10th photo added
  SEARCHES: 10,       // After 10th search performed
} as const;

/**
 * Feature-gated triggers - show paywall when accessing premium features
 */
export type FeatureGate =
  | 'export'           // JSON/ZIP export
  | 'advanced_search'  // Search filters (importance, memory type, tags)
  | 'insights'         // First visit to insights/stats
  | 'chapter_recap';   // Chapter recap/summary feature

/**
 * Contextual triggers - show paywall at engagement moments
 */
export type ContextualTrigger =
  | 'chapter_completed'  // When marking a chapter as completed (end date in past)
  | 'app_return'         // Returning after 7+ days of inactivity
  | 'weekly_active';     // After 2 weeks of active usage

// ============================================================
// STATE TYPES
// ============================================================

interface PaywallState {
  // Usage counters
  chaptersCreated: number;
  memoriesCreated: number;
  photosAdded: number;
  searchesPerformed: number;

  // Trigger flags (to avoid re-triggering)
  triggeredChapters: boolean;
  triggeredMemories: boolean;
  triggeredPhotos: boolean;
  triggeredSearches: boolean;

  // Feature access tracking
  featureGatesShown: FeatureGate[];

  // Timing
  paywallDismissCount: number;
  lastPaywallShownAt: number | null;
  lastActiveAt: number | null;
  firstActiveAt: number | null;

  // Meta
  isLoaded: boolean;
}

interface PaywallActions {
  // Lifecycle
  loadPaywallState: () => Promise<void>;
  resetPaywallState: () => Promise<void>;

  // Usage increments
  incrementChapters: () => Promise<void>;
  incrementMemories: () => Promise<void>;
  incrementPhotos: (count: number) => Promise<void>;
  incrementSearches: () => Promise<void>;

  // Trigger checks
  shouldShowUsagePaywall: () => { shouldShow: boolean; trigger: keyof typeof USAGE_TRIGGERS | null };
  shouldShowFeaturePaywall: (feature: FeatureGate) => boolean;
  shouldShowContextualPaywall: (context: ContextualTrigger) => boolean;

  // Recording
  recordPaywallShown: () => Promise<void>;
  recordPaywallDismiss: () => Promise<void>;
  recordFeatureGateShown: (feature: FeatureGate) => Promise<void>;
  recordActivity: () => Promise<void>;

  // Helpers
  canShowPaywall: () => boolean;
  getDaysSinceLastActive: () => number | null;
  getWeeksActive: () => number;
}

type PaywallStore = PaywallState & PaywallActions;

// ============================================================
// INITIAL STATE
// ============================================================

const initialState: PaywallState = {
  chaptersCreated: 0,
  memoriesCreated: 0,
  photosAdded: 0,
  searchesPerformed: 0,

  triggeredChapters: false,
  triggeredMemories: false,
  triggeredPhotos: false,
  triggeredSearches: false,

  featureGatesShown: [],

  paywallDismissCount: 0,
  lastPaywallShownAt: null,
  lastActiveAt: null,
  firstActiveAt: null,

  isLoaded: false,
};

// ============================================================
// PERSISTENCE
// ============================================================

const persistState = async (state: Partial<PaywallState>) => {
  try {
    const currentData = await FileSystem.readAsStringAsync(PAYWALL_FILE_PATH).catch(() => '{}');
    const parsed = JSON.parse(currentData);
    const newData = { ...parsed, ...state };
    await FileSystem.writeAsStringAsync(PAYWALL_FILE_PATH, JSON.stringify(newData));
  } catch (error) {
    console.error('Failed to persist paywall state:', error);
  }
};

// ============================================================
// STORE
// ============================================================

export const usePaywallStore = create<PaywallStore>((set, get) => ({
  ...initialState,

  // --------------------------------------------------------
  // LIFECYCLE
  // --------------------------------------------------------

  loadPaywallState: async () => {
    if (get().isLoaded) return;

    try {
      const fileInfo = await FileSystem.getInfoAsync(PAYWALL_FILE_PATH);
      if (fileInfo.exists) {
        const data = await FileSystem.readAsStringAsync(PAYWALL_FILE_PATH);
        const parsed = JSON.parse(data);
        set({
          chaptersCreated: parsed.chaptersCreated ?? parsed.tripsCreated ?? 0,
          memoriesCreated: parsed.memoriesCreated ?? parsed.entriesCreated ?? 0,
          photosAdded: parsed.photosAdded ?? 0,
          searchesPerformed: parsed.searchesPerformed ?? 0,

          triggeredChapters: parsed.triggeredChapters ?? parsed.triggeredTrips ?? false,
          triggeredMemories: parsed.triggeredMemories ?? parsed.triggeredEntries ?? false,
          triggeredPhotos: parsed.triggeredPhotos ?? false,
          triggeredSearches: parsed.triggeredSearches ?? false,

          featureGatesShown: parsed.featureGatesShown ?? [],

          paywallDismissCount: parsed.paywallDismissCount ?? 0,
          lastPaywallShownAt: parsed.lastPaywallShownAt ?? null,
          lastActiveAt: parsed.lastActiveAt ?? null,
          firstActiveAt: parsed.firstActiveAt ?? null,

          isLoaded: true,
        });
      } else {
        // First time - record initial activity
        const now = Date.now();
        set({
          isLoaded: true,
          firstActiveAt: now,
          lastActiveAt: now,
        });
        await persistState({ firstActiveAt: now, lastActiveAt: now });
      }
    } catch (error) {
      console.error('Failed to load paywall state:', error);
      set({ isLoaded: true });
    }
  },

  resetPaywallState: async () => {
    set(initialState);
    try {
      await FileSystem.deleteAsync(PAYWALL_FILE_PATH, { idempotent: true });
    } catch (error) {
      console.error('Failed to reset paywall state:', error);
    }
  },

  // --------------------------------------------------------
  // USAGE INCREMENTS
  // --------------------------------------------------------

  incrementChapters: async () => {
    const newCount = get().chaptersCreated + 1;
    set({ chaptersCreated: newCount });
    await persistState({ chaptersCreated: newCount });
  },

  incrementMemories: async () => {
    const newCount = get().memoriesCreated + 1;
    set({ memoriesCreated: newCount });
    await persistState({ memoriesCreated: newCount });
  },

  incrementPhotos: async (count: number) => {
    const newCount = get().photosAdded + count;
    set({ photosAdded: newCount });
    await persistState({ photosAdded: newCount });
  },

  incrementSearches: async () => {
    const newCount = get().searchesPerformed + 1;
    set({ searchesPerformed: newCount });
    await persistState({ searchesPerformed: newCount });
  },

  // --------------------------------------------------------
  // TRIGGER CHECKS
  // --------------------------------------------------------

  /**
   * Check if paywall can be shown (respects cooldowns)
   */
  canShowPaywall: () => {
    const { lastPaywallShownAt, paywallDismissCount } = get();

    // Cooldown: 1 hour minimum between paywalls
    const ONE_HOUR = 60 * 60 * 1000;
    if (lastPaywallShownAt && Date.now() - lastPaywallShownAt < ONE_HOUR) {
      return false;
    }

    // After 3 dismisses, increase cooldown to 24 hours
    const ONE_DAY = 24 * 60 * 60 * 1000;
    if (paywallDismissCount >= 3 && lastPaywallShownAt && Date.now() - lastPaywallShownAt < ONE_DAY) {
      return false;
    }

    // After 5 dismisses, increase cooldown to 3 days
    const THREE_DAYS = 3 * ONE_DAY;
    if (paywallDismissCount >= 5 && lastPaywallShownAt && Date.now() - lastPaywallShownAt < THREE_DAYS) {
      return false;
    }

    return true;
  },

  /**
   * Check if usage-based paywall should be shown
   * Returns the trigger type if paywall should show
   */
  shouldShowUsagePaywall: () => {
    const state = get();

    if (!state.canShowPaywall()) {
      return { shouldShow: false, trigger: null };
    }

    // Check triggers in priority order (each only fires once)
    if (!state.triggeredChapters && state.chaptersCreated >= USAGE_TRIGGERS.CHAPTERS) {
      return { shouldShow: true, trigger: 'CHAPTERS' as keyof typeof USAGE_TRIGGERS };
    }

    if (!state.triggeredMemories && state.memoriesCreated >= USAGE_TRIGGERS.MEMORIES) {
      return { shouldShow: true, trigger: 'MEMORIES' as keyof typeof USAGE_TRIGGERS };
    }

    if (!state.triggeredPhotos && state.photosAdded >= USAGE_TRIGGERS.PHOTOS) {
      return { shouldShow: true, trigger: 'PHOTOS' as keyof typeof USAGE_TRIGGERS };
    }

    if (!state.triggeredSearches && state.searchesPerformed >= USAGE_TRIGGERS.SEARCHES) {
      return { shouldShow: true, trigger: 'SEARCHES' as keyof typeof USAGE_TRIGGERS };
    }

    return { shouldShow: false, trigger: null };
  },

  /**
   * Check if feature-gated paywall should be shown
   * Each feature gate only triggers once
   */
  shouldShowFeaturePaywall: (feature: FeatureGate) => {
    const state = get();

    if (!state.canShowPaywall()) {
      return false;
    }

    // Only show once per feature
    if (state.featureGatesShown.includes(feature)) {
      return false;
    }

    return true;
  },

  /**
   * Check if contextual paywall should be shown
   */
  shouldShowContextualPaywall: (context: ContextualTrigger) => {
    const state = get();

    if (!state.canShowPaywall()) {
      return false;
    }

    switch (context) {
      case 'app_return': {
        // Show paywall if returning after 7+ days
        const daysSinceActive = state.getDaysSinceLastActive();
        return daysSinceActive !== null && daysSinceActive >= 7;
      }

      case 'weekly_active': {
        // Show paywall after 2 weeks of active usage (but only once)
        const weeksActive = state.getWeeksActive();
        return weeksActive >= 2 && state.paywallDismissCount < 2;
      }

      case 'chapter_completed':
        // Show paywall when completing a chapter (limiting to prevent spam)
        return state.chaptersCreated >= 1 && state.paywallDismissCount < 3;

      default:
        return false;
    }
  },

  // --------------------------------------------------------
  // RECORDING
  // --------------------------------------------------------

  recordPaywallShown: async () => {
    const state = get();
    const now = Date.now();

    // Mark the appropriate trigger as used
    const updates: Partial<PaywallState> = { lastPaywallShownAt: now };

    if (!state.triggeredChapters && state.chaptersCreated >= USAGE_TRIGGERS.CHAPTERS) {
      updates.triggeredChapters = true;
    } else if (!state.triggeredMemories && state.memoriesCreated >= USAGE_TRIGGERS.MEMORIES) {
      updates.triggeredMemories = true;
    } else if (!state.triggeredPhotos && state.photosAdded >= USAGE_TRIGGERS.PHOTOS) {
      updates.triggeredPhotos = true;
    } else if (!state.triggeredSearches && state.searchesPerformed >= USAGE_TRIGGERS.SEARCHES) {
      updates.triggeredSearches = true;
    }

    set(updates);
    await persistState(updates);
  },

  recordPaywallDismiss: async () => {
    const newCount = get().paywallDismissCount + 1;
    set({ paywallDismissCount: newCount });
    await persistState({ paywallDismissCount: newCount });
  },

  recordFeatureGateShown: async (feature: FeatureGate) => {
    const current = get().featureGatesShown;
    if (!current.includes(feature)) {
      const updated = [...current, feature];
      set({ featureGatesShown: updated });
      await persistState({ featureGatesShown: updated });
    }
  },

  recordActivity: async () => {
    const now = Date.now();
    const updates: Partial<PaywallState> = { lastActiveAt: now };

    if (!get().firstActiveAt) {
      updates.firstActiveAt = now;
    }

    set(updates);
    await persistState(updates);
  },

  // --------------------------------------------------------
  // HELPERS
  // --------------------------------------------------------

  getDaysSinceLastActive: () => {
    const { lastActiveAt } = get();
    if (!lastActiveAt) return null;

    const msPerDay = 24 * 60 * 60 * 1000;
    return Math.floor((Date.now() - lastActiveAt) / msPerDay);
  },

  getWeeksActive: () => {
    const { firstActiveAt } = get();
    if (!firstActiveAt) return 0;

    const msPerWeek = 7 * 24 * 60 * 60 * 1000;
    return Math.floor((Date.now() - firstActiveAt) / msPerWeek);
  },
}));
