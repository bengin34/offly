import type { BabyStats, PostInstallStats } from '../db/repositories/StatsRepository';

export type BadgeRuleType =
  | 'chapters'
  | 'memories'
  | 'milestones'
  | 'notes'
  | 'tags'
  | 'photos'
  // Tag-based badges for baby domain
  | 'tag_first_time'
  | 'tag_milestone'
  | 'tag_funny'
  | 'tag_sweet'
  | 'tag_growth'
  | 'tag_health'
  | 'tag_feeding'
  | 'tag_sleep'
  | 'tag_play'
  | 'tag_family'
  | 'historicalMemories'
  // Consistency badges
  | 'memoriesWithDescription'
  | 'memoriesWithPhotos'
  | 'memoriesWithTags'
  | 'uniqueTags';

export interface Badge {
  id: string;
  title: string;
  description: string;
  icon: string;
  ruleType: BadgeRuleType;
  threshold: number;
  useTotalStats?: boolean;
}

export interface UnlockedBadge {
  badgeId: string;
  unlockedAt: string;
}

export const BADGES: Badge[] = [
  // Special: Historian badge for logging old memories
  {
    id: 'historian',
    title: 'Memory Keeper',
    description: 'Logged 40 memories from the past',
    icon: 'time',
    ruleType: 'historicalMemories',
    threshold: 40,
    useTotalStats: true,
  },

  // Firsts - use total stats
  {
    id: 'first_chapter',
    title: 'First Chapter',
    description: 'Created your first chapter',
    icon: 'book',
    ruleType: 'chapters',
    threshold: 1,
    useTotalStats: true,
  },
  {
    id: 'first_milestone',
    title: 'First Milestone',
    description: 'Recorded your first milestone',
    icon: 'flag',
    ruleType: 'milestones',
    threshold: 1,
    useTotalStats: true,
  },
  {
    id: 'first_note',
    title: 'First Note',
    description: 'Wrote your first note',
    icon: 'document-text',
    ruleType: 'notes',
    threshold: 1,
    useTotalStats: true,
  },
  {
    id: 'first_tag',
    title: 'First Tag',
    description: 'Created your first tag',
    icon: 'pricetag',
    ruleType: 'tags',
    threshold: 1,
    useTotalStats: true,
  },

  // Chapter milestones
  {
    id: 'chapters_5',
    title: 'Chronicler',
    description: 'Created 5 chapters',
    icon: 'book',
    ruleType: 'chapters',
    threshold: 5,
  },
  {
    id: 'chapters_15',
    title: 'Storyteller',
    description: 'Created 15 chapters',
    icon: 'library',
    ruleType: 'chapters',
    threshold: 15,
  },
  {
    id: 'chapters_30',
    title: 'Legacy Builder',
    description: 'Created 30 chapters',
    icon: 'trophy',
    ruleType: 'chapters',
    threshold: 30,
  },

  // Milestone milestones
  {
    id: 'milestones_15',
    title: 'Milestone Tracker',
    description: 'Recorded 15 milestones',
    icon: 'flag',
    ruleType: 'milestones',
    threshold: 15,
  },
  {
    id: 'milestones_40',
    title: 'Milestone Collector',
    description: 'Recorded 40 milestones',
    icon: 'ribbon',
    ruleType: 'milestones',
    threshold: 40,
  },
  {
    id: 'milestones_150',
    title: 'Milestone Master',
    description: 'Recorded 150 milestones',
    icon: 'medal',
    ruleType: 'milestones',
    threshold: 150,
  },

  // Memory milestones
  {
    id: 'memories_40',
    title: 'Memory Keeper',
    description: 'Created 40 memories',
    icon: 'heart',
    ruleType: 'memories',
    threshold: 40,
  },
  {
    id: 'memories_150',
    title: 'Archivist',
    description: 'Created 150 memories',
    icon: 'albums',
    ruleType: 'memories',
    threshold: 150,
  },

  // Photo milestones
  {
    id: 'photos_25',
    title: 'Shutterbug',
    description: 'Captured 25 photos',
    icon: 'camera',
    ruleType: 'photos',
    threshold: 25,
  },
  {
    id: 'photos_100',
    title: 'Photographer',
    description: 'Captured 100 photos',
    icon: 'images',
    ruleType: 'photos',
    threshold: 100,
  },
  {
    id: 'photos_400',
    title: 'Photo Archivist',
    description: 'Captured 400 photos',
    icon: 'albums',
    ruleType: 'photos',
    threshold: 400,
  },

  // Tag-based badges
  {
    id: 'tag_first_time',
    title: 'First Times',
    description: 'Logged 10 first-time memories',
    icon: 'sparkles',
    ruleType: 'tag_first_time',
    threshold: 10,
    useTotalStats: true,
  },
  {
    id: 'tag_milestone',
    title: 'Milestone Maven',
    description: 'Tagged 15 milestone memories',
    icon: 'flag',
    ruleType: 'tag_milestone',
    threshold: 15,
    useTotalStats: true,
  },
  {
    id: 'tag_funny',
    title: 'Comedy Gold',
    description: 'Logged 12 funny moments',
    icon: 'happy',
    ruleType: 'tag_funny',
    threshold: 12,
    useTotalStats: true,
  },
  {
    id: 'tag_sweet',
    title: 'Sweet Moments',
    description: 'Logged 12 sweet memories',
    icon: 'heart',
    ruleType: 'tag_sweet',
    threshold: 12,
    useTotalStats: true,
  },
  {
    id: 'tag_growth',
    title: 'Growth Tracker',
    description: 'Logged 10 growth entries',
    icon: 'trending-up',
    ruleType: 'tag_growth',
    threshold: 10,
    useTotalStats: true,
  },
  {
    id: 'tag_health',
    title: 'Health Logger',
    description: 'Logged 10 health entries',
    icon: 'medkit',
    ruleType: 'tag_health',
    threshold: 10,
    useTotalStats: true,
  },
  {
    id: 'tag_feeding',
    title: 'Feeding Tracker',
    description: 'Logged 15 feeding entries',
    icon: 'nutrition',
    ruleType: 'tag_feeding',
    threshold: 15,
    useTotalStats: true,
  },
  {
    id: 'tag_sleep',
    title: 'Sleep Monitor',
    description: 'Logged 15 sleep entries',
    icon: 'moon',
    ruleType: 'tag_sleep',
    threshold: 15,
    useTotalStats: true,
  },
  {
    id: 'tag_play',
    title: 'Playtime Pro',
    description: 'Logged 12 play entries',
    icon: 'game-controller',
    ruleType: 'tag_play',
    threshold: 12,
    useTotalStats: true,
  },
  {
    id: 'tag_family',
    title: 'Family Moments',
    description: 'Logged 15 family entries',
    icon: 'people',
    ruleType: 'tag_family',
    threshold: 15,
    useTotalStats: true,
  },

  // Consistency badges
  {
    id: 'note_taker',
    title: 'Note Taker',
    description: 'Added descriptions to 20 memories',
    icon: 'document-text',
    ruleType: 'memoriesWithDescription',
    threshold: 20,
    useTotalStats: true,
  },
  {
    id: 'storyteller_badge',
    title: 'Detailed Chronicler',
    description: 'Added descriptions to 100 memories',
    icon: 'book',
    ruleType: 'memoriesWithDescription',
    threshold: 100,
    useTotalStats: true,
  },
  {
    id: 'visual_logger',
    title: 'Visual Logger',
    description: 'Added photos to 20 memories',
    icon: 'image',
    ruleType: 'memoriesWithPhotos',
    threshold: 20,
    useTotalStats: true,
  },
  {
    id: 'photo_journalist',
    title: 'Photo Journalist',
    description: 'Added photos to 100 memories',
    icon: 'images-outline',
    ruleType: 'memoriesWithPhotos',
    threshold: 100,
    useTotalStats: true,
  },
  {
    id: 'organizer',
    title: 'Organizer',
    description: 'Tagged 20 memories',
    icon: 'pricetags',
    ruleType: 'memoriesWithTags',
    threshold: 20,
    useTotalStats: true,
  },
  {
    id: 'master_organizer',
    title: 'Master Organizer',
    description: 'Tagged 100 memories',
    icon: 'filing',
    ruleType: 'memoriesWithTags',
    threshold: 100,
    useTotalStats: true,
  },
  {
    id: 'tag_creator',
    title: 'Tag Creator',
    description: 'Created 20 unique tags',
    icon: 'color-wand',
    ruleType: 'uniqueTags',
    threshold: 20,
    useTotalStats: true,
  },
  {
    id: 'taxonomy_expert',
    title: 'Taxonomy Expert',
    description: 'Created 40 unique tags',
    icon: 'git-branch',
    ruleType: 'uniqueTags',
    threshold: 40,
    useTotalStats: true,
  },
];

export function getStatValueFromTotal(stats: BabyStats, ruleType: BadgeRuleType): number {
  switch (ruleType) {
    case 'chapters':
      return stats.totalChapters;
    case 'memories':
      return stats.totalMemories;
    case 'milestones':
      return stats.milestonesCount;
    case 'notes':
      return stats.notesCount;
    case 'tags':
      return stats.totalTags;
    case 'photos':
      return stats.totalPhotos;
    case 'tag_first_time':
      return stats.firstTimeEntries;
    case 'tag_milestone':
      return stats.milestoneTagEntries;
    case 'tag_funny':
      return stats.funnyEntries;
    case 'tag_sweet':
      return stats.sweetEntries;
    case 'tag_growth':
      return stats.growthEntries;
    case 'tag_health':
      return stats.healthEntries;
    case 'tag_feeding':
      return stats.feedingEntries;
    case 'tag_sleep':
      return stats.sleepEntries;
    case 'tag_play':
      return stats.playEntries;
    case 'tag_family':
      return stats.familyEntries;
    case 'historicalMemories':
      return 0; // Handled by post-install stats
    case 'memoriesWithDescription':
      return stats.memoriesWithDescription;
    case 'memoriesWithPhotos':
      return stats.memoriesWithPhotos;
    case 'memoriesWithTags':
      return stats.memoriesWithTags;
    case 'uniqueTags':
      return stats.uniqueTags;
    default:
      return 0;
  }
}

export function getStatValueFromPostInstall(stats: PostInstallStats, ruleType: BadgeRuleType): number {
  switch (ruleType) {
    case 'chapters':
      return stats.chapters;
    case 'memories':
      return stats.memories;
    case 'milestones':
      return stats.milestones;
    case 'notes':
      return stats.notes;
    case 'tags':
      return stats.tags;
    case 'photos':
      return stats.photos;
    case 'historicalMemories':
      return stats.historicalMemories;
    // Tag-based and consistency stats always use total
    default:
      return 0;
  }
}

export function evaluateBadges(
  totalStats: BabyStats,
  postInstallStats: PostInstallStats,
  currentUnlocked: UnlockedBadge[],
  _appInstalledAt: string | null
): { unlocked: UnlockedBadge[]; newlyUnlocked: Badge[] } {
  const unlockedIds = new Set(currentUnlocked.map((u) => u.badgeId));
  const newlyUnlocked: Badge[] = [];
  const now = new Date().toISOString();

  for (const badge of BADGES) {
    if (unlockedIds.has(badge.id)) {
      continue;
    }

    let currentValue: number;
    if (badge.useTotalStats) {
      if (badge.ruleType === 'historicalMemories') {
        currentValue = getStatValueFromPostInstall(postInstallStats, badge.ruleType);
      } else {
        currentValue = getStatValueFromTotal(totalStats, badge.ruleType);
      }
    } else {
      currentValue = getStatValueFromPostInstall(postInstallStats, badge.ruleType);
    }

    if (currentValue >= badge.threshold) {
      currentUnlocked.push({
        badgeId: badge.id,
        unlockedAt: now,
      });
      newlyUnlocked.push(badge);
    }
  }

  return { unlocked: currentUnlocked, newlyUnlocked };
}

export function getBadgeById(id: string): Badge | undefined {
  return BADGES.find((b) => b.id === id);
}

export function getBadgeProgress(
  totalStats: BabyStats,
  postInstallStats: PostInstallStats,
  badge: Badge
): { current: number; target: number; percentage: number } {
  let current: number;
  if (badge.useTotalStats) {
    if (badge.ruleType === 'historicalMemories') {
      current = getStatValueFromPostInstall(postInstallStats, badge.ruleType);
    } else {
      current = getStatValueFromTotal(totalStats, badge.ruleType);
    }
  } else {
    current = getStatValueFromPostInstall(postInstallStats, badge.ruleType);
  }
  const percentage = Math.min(100, Math.round((current / badge.threshold) * 100));
  return {
    current,
    target: badge.threshold,
    percentage,
  };
}
