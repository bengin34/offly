import { getDatabase } from '../database';

export interface BabyStats {
  totalChapters: number;
  totalMemories: number;
  milestonesCount: number;
  notesCount: number;
  totalPhotos: number;
  totalTags: number;
  firstMemoryDate: string | null;
  // Memory stats
  memoriesWithDescription: number;
  memoriesWithPhotos: number;
  memoriesWithTags: number;
  importantMemories: number;
  uniqueTags: number;
  // Tag group counts for baby-relevant categories
  firstTimeEntries: number;
  milestoneTagEntries: number;
  funnyEntries: number;
  sweetEntries: number;
  growthEntries: number;
  healthEntries: number;
  feedingEntries: number;
  sleepEntries: number;
  playEntries: number;
  familyEntries: number;
}

export interface PostInstallStats {
  chapters: number;
  memories: number;
  milestones: number;
  notes: number;
  photos: number;
  tags: number;
  // For Historian badge - memories with dates before install
  historicalMemories: number;
}

export interface TagCount {
  name: string;
  count: number;
}

type TagRow = {
  memoryId: string;
  name: string;
};

const normalizeTagName = (value: string) =>
  value.toLowerCase().normalize('NFD').replace(/[\u0300-\u036f]/g, '').trim();

const TAG_GROUP_MATCHERS = {
  firstTime: new Set(['first time', 'firsttime', 'first'].map(normalizeTagName)),
  milestone: new Set(['milestone', 'achievement'].map(normalizeTagName)),
  funny: new Set(['funny', 'hilarious', 'laugh'].map(normalizeTagName)),
  sweet: new Set(['sweet', 'cute', 'adorable'].map(normalizeTagName)),
  growth: new Set(['growth', 'growing', 'bigger'].map(normalizeTagName)),
  health: new Set(['health', 'doctor', 'checkup', 'vaccine'].map(normalizeTagName)),
  feeding: new Set(['feeding', 'food', 'eating', 'bottle', 'nursing'].map(normalizeTagName)),
  sleep: new Set(['sleep', 'nap', 'sleeping', 'bedtime'].map(normalizeTagName)),
  play: new Set(['play', 'playing', 'toy', 'game'].map(normalizeTagName)),
  family: new Set(['family', 'grandma', 'grandpa', 'aunt', 'uncle', 'cousin'].map(normalizeTagName)),
};

const buildTagGroupCounts = (rows: TagRow[]) => {
  const groupMemoryIds = {
    firstTime: new Set<string>(),
    milestone: new Set<string>(),
    funny: new Set<string>(),
    sweet: new Set<string>(),
    growth: new Set<string>(),
    health: new Set<string>(),
    feeding: new Set<string>(),
    sleep: new Set<string>(),
    play: new Set<string>(),
    family: new Set<string>(),
  };

  for (const row of rows) {
    const normalized = normalizeTagName(row.name);
    if (TAG_GROUP_MATCHERS.firstTime.has(normalized)) groupMemoryIds.firstTime.add(row.memoryId);
    if (TAG_GROUP_MATCHERS.milestone.has(normalized)) groupMemoryIds.milestone.add(row.memoryId);
    if (TAG_GROUP_MATCHERS.funny.has(normalized)) groupMemoryIds.funny.add(row.memoryId);
    if (TAG_GROUP_MATCHERS.sweet.has(normalized)) groupMemoryIds.sweet.add(row.memoryId);
    if (TAG_GROUP_MATCHERS.growth.has(normalized)) groupMemoryIds.growth.add(row.memoryId);
    if (TAG_GROUP_MATCHERS.health.has(normalized)) groupMemoryIds.health.add(row.memoryId);
    if (TAG_GROUP_MATCHERS.feeding.has(normalized)) groupMemoryIds.feeding.add(row.memoryId);
    if (TAG_GROUP_MATCHERS.sleep.has(normalized)) groupMemoryIds.sleep.add(row.memoryId);
    if (TAG_GROUP_MATCHERS.play.has(normalized)) groupMemoryIds.play.add(row.memoryId);
    if (TAG_GROUP_MATCHERS.family.has(normalized)) groupMemoryIds.family.add(row.memoryId);
  }

  return {
    firstTimeEntries: groupMemoryIds.firstTime.size,
    milestoneTagEntries: groupMemoryIds.milestone.size,
    funnyEntries: groupMemoryIds.funny.size,
    sweetEntries: groupMemoryIds.sweet.size,
    growthEntries: groupMemoryIds.growth.size,
    healthEntries: groupMemoryIds.health.size,
    feedingEntries: groupMemoryIds.feeding.size,
    sleepEntries: groupMemoryIds.sleep.size,
    playEntries: groupMemoryIds.play.size,
    familyEntries: groupMemoryIds.family.size,
  };
};

export const StatsRepository = {
  async getStats(): Promise<BabyStats> {
    const db = await getDatabase();

    // Total chapters
    const chapterCountRow = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM chapters'
    );
    const totalChapters = chapterCountRow?.count ?? 0;

    // Total memories and breakdown by type
    const memoryCountRow = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM memories'
    );
    const totalMemories = memoryCountRow?.count ?? 0;

    const milestonesRow = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM memories WHERE memory_type = 'milestone'"
    );
    const milestonesCount = milestonesRow?.count ?? 0;

    const notesRow = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM memories WHERE memory_type = 'note'"
    );
    const notesCount = notesRow?.count ?? 0;

    // Total photos
    const photoCountRow = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM memory_photos'
    );
    const totalPhotos = photoCountRow?.count ?? 0;

    // Total tags
    const tagCountRow = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM tags'
    );
    const totalTags = tagCountRow?.count ?? 0;

    // First memory date
    const firstMemoryRow = await db.getFirstAsync<{ date: string }>(
      'SELECT date FROM memories ORDER BY date ASC LIMIT 1'
    );
    const firstMemoryDate = firstMemoryRow?.date ?? null;

    // Memories with descriptions
    const memoriesWithDescriptionRow = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM memories WHERE description IS NOT NULL AND description != ''"
    );
    const memoriesWithDescription = memoriesWithDescriptionRow?.count ?? 0;

    // Memories with photos
    const memoriesWithPhotosRow = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(DISTINCT memory_id) as count FROM memory_photos`
    );
    const memoriesWithPhotos = memoriesWithPhotosRow?.count ?? 0;

    // Memories with tags
    const memoriesWithTagsRow = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(DISTINCT memory_id) as count FROM memory_tags`
    );
    const memoriesWithTags = memoriesWithTagsRow?.count ?? 0;

    // Important memories (importance >= 1)
    const importantMemoriesRow = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM memories WHERE importance IS NOT NULL AND importance >= 1'
    );
    const importantMemories = importantMemoriesRow?.count ?? 0;

    // Unique tags used
    const uniqueTagsRow = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(DISTINCT tag_id) as count FROM memory_tags`
    );
    const uniqueTags = uniqueTagsRow?.count ?? 0;

    // Tag group counts
    const tagRows = await db.getAllAsync<TagRow>(
      `SELECT mt.memory_id as memoryId, t.name as name
       FROM memory_tags mt
       INNER JOIN tags t ON t.id = mt.tag_id`
    );
    const tagGroupCounts = buildTagGroupCounts(tagRows);

    return {
      totalChapters,
      totalMemories,
      milestonesCount,
      notesCount,
      totalPhotos,
      totalTags,
      firstMemoryDate,
      memoriesWithDescription,
      memoriesWithPhotos,
      memoriesWithTags,
      importantMemories,
      uniqueTags,
      ...tagGroupCounts,
    };
  },

  async getTopTags(limit: number = 5): Promise<TagCount[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<{ name: string; count: number }>(
      `SELECT t.name, COUNT(mt.memory_id) as count
       FROM tags t
       INNER JOIN memory_tags mt ON t.id = mt.tag_id
       GROUP BY t.id
       ORDER BY count DESC
       LIMIT ?`,
      [limit]
    );
    return rows;
  },

  async getMemoryTypeBreakdown(): Promise<{ milestones: number; notes: number }> {
    const db = await getDatabase();
    const milestonesRow = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM memories WHERE memory_type = 'milestone'"
    );
    const notesRow = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM memories WHERE memory_type = 'note'"
    );
    return {
      milestones: milestonesRow?.count ?? 0,
      notes: notesRow?.count ?? 0,
    };
  },

  /**
   * Get stats for activity created after app install date.
   * Used for milestone badges to prevent gaming by bulk-importing old memories.
   */
  async getPostInstallStats(appInstalledAt: string | null): Promise<PostInstallStats> {
    const db = await getDatabase();

    // If no install date, count everything as post-install (backwards compatibility)
    const installDate = appInstalledAt || '1970-01-01T00:00:00.000Z';

    // Chapters created after install
    const chaptersRow = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM chapters WHERE created_at >= ?',
      [installDate]
    );
    const chapters = chaptersRow?.count ?? 0;

    // Memories created after install
    const memoriesRow = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM memories WHERE created_at >= ?',
      [installDate]
    );
    const memories = memoriesRow?.count ?? 0;

    // Milestones created after install
    const milestonesRow = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM memories WHERE memory_type = 'milestone' AND created_at >= ?",
      [installDate]
    );
    const milestones = milestonesRow?.count ?? 0;

    // Notes created after install
    const notesRow = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM memories WHERE memory_type = 'note' AND created_at >= ?",
      [installDate]
    );
    const notes = notesRow?.count ?? 0;

    // Photos added after install
    const photosRow = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM memory_photos mp
       INNER JOIN memories m ON mp.memory_id = m.id
       WHERE m.created_at >= ?`,
      [installDate]
    );
    const photos = photosRow?.count ?? 0;

    // Tags used in memories created after install
    const tagsRow = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(DISTINCT mt.tag_id) as count FROM memory_tags mt
       INNER JOIN memories m ON mt.memory_id = m.id
       WHERE m.created_at >= ?`,
      [installDate]
    );
    const tags = tagsRow?.count ?? 0;

    // Historical memories: memories where the memory date is before install
    const historicalRow = await db.getFirstAsync<{ count: number }>(
      `SELECT COUNT(*) as count FROM memories
       WHERE date IS NOT NULL AND date < ?`,
      [installDate]
    );
    const historicalMemories = historicalRow?.count ?? 0;

    return {
      chapters,
      memories,
      milestones,
      notes,
      photos,
      tags,
      historicalMemories,
    };
  },
};
