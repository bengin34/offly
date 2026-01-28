import { getDatabase } from '../database';
import type { SearchResult, MemoryType, SearchFilters } from '../../types';

interface ChapterSearchRow {
  id: string;
  title: string;
  description: string | null;
}

interface MemorySearchRow {
  id: string;
  chapter_id: string | null;
  vault_id: string | null;
  is_pregnancy_journal: number;
  memory_type: MemoryType;
  title: string;
  description: string | null;
  importance: number | null;
  chapter_title: string | null;
}

interface TagSearchRow {
  memory_id: string | null;
  chapter_id: string | null;
  tag_name: string;
  memory_title: string | null;
  chapter_title: string;
}

export const SearchRepository = {
  async search(query: string, filters?: SearchFilters): Promise<SearchResult[]> {
    if (!query.trim()) return [];

    const db = await getDatabase();
    const searchPattern = `%${query}%`;
    const results: SearchResult[] = [];
    const showChapters = !filters?.resultType || filters.resultType === 'all' || filters.resultType === 'chapter';
    const showMemories = !filters?.resultType || filters.resultType === 'all' || filters.resultType === 'memory';

    // Search chapters
    if (showChapters) {
      const chapterRows = await db.getAllAsync<ChapterSearchRow>(
        `SELECT id, title, description FROM chapters
         WHERE title LIKE ? OR description LIKE ?`,
        [searchPattern, searchPattern]
      );

      for (const row of chapterRows) {
        let matchedField = 'title';
        let matchedText = row.title;

        if (row.title.toLowerCase().includes(query.toLowerCase())) {
          matchedField = 'title';
          matchedText = row.title;
        } else if (row.description?.toLowerCase().includes(query.toLowerCase())) {
          matchedField = 'description';
          matchedText = row.description;
        }

        results.push({
          type: 'chapter',
          id: row.id,
          title: row.title,
          matchedField,
          matchedText,
        });
      }
    }

    // Search memories (including vault entries and pregnancy journal)
    const showVaults = !filters?.resultType || filters.resultType === 'all' || filters.resultType === 'vault';
    const showPregnancy = !filters?.resultType || filters.resultType === 'all' || filters.resultType === 'pregnancy_journal';

    if (showMemories || showVaults || showPregnancy) {
      // Build dynamic WHERE clause based on filters
      let memoryWhereClause = '(m.title LIKE ? OR m.description LIKE ?)';
      const memoryParams: (string | number)[] = [searchPattern, searchPattern];

      if (filters?.memoryType) {
        memoryWhereClause += ' AND m.memory_type = ?';
        memoryParams.push(filters.memoryType);
      }

      if (filters?.minImportance !== undefined && filters.minImportance > 0) {
        memoryWhereClause += ' AND m.importance >= ?';
        memoryParams.push(filters.minImportance);
      }

      if (filters?.chapterId) {
        memoryWhereClause += ' AND m.chapter_id = ?';
        memoryParams.push(filters.chapterId);
      }

      // Filter by result type
      if (filters?.resultType === 'memory') {
        memoryWhereClause += ' AND m.vault_id IS NULL AND m.is_pregnancy_journal = 0';
      } else if (filters?.resultType === 'vault') {
        memoryWhereClause += ' AND m.vault_id IS NOT NULL';
      } else if (filters?.resultType === 'pregnancy_journal') {
        memoryWhereClause += ' AND m.is_pregnancy_journal = 1';
      }

      const memoryRows = await db.getAllAsync<MemorySearchRow>(
        `SELECT m.id, m.chapter_id, m.vault_id, m.is_pregnancy_journal, m.memory_type, m.title, m.description, m.importance, c.title as chapter_title
         FROM memories m
         LEFT JOIN chapters c ON m.chapter_id = c.id
         WHERE ${memoryWhereClause}`,
        memoryParams
      );

      // Filter by tags if specified
      let filteredRows = memoryRows;
      if (filters?.tagIds && filters.tagIds.length > 0) {
        const memoryIdsWithTags = await db.getAllAsync<{ memory_id: string }>(
          `SELECT DISTINCT memory_id FROM memory_tags WHERE tag_id IN (${filters.tagIds.map(() => '?').join(',')})`,
          filters.tagIds
        );
        const validMemoryIds = new Set(memoryIdsWithTags.map((r) => r.memory_id));
        filteredRows = memoryRows.filter((row) => validMemoryIds.has(row.id));
      }

      for (const row of filteredRows) {
        let matchedField = 'title';
        let matchedText = row.title;

        if (row.title.toLowerCase().includes(query.toLowerCase())) {
          matchedField = 'title';
          matchedText = row.title;
        } else if (row.description?.toLowerCase().includes(query.toLowerCase())) {
          matchedField = 'description';
          matchedText = row.description;
        }

        const resultType = row.vault_id ? 'vault' as const : 'memory' as const;

        results.push({
          type: resultType,
          id: row.id,
          title: row.title,
          matchedField,
          matchedText,
          chapterId: row.chapter_id ?? undefined,
          chapterTitle: row.chapter_title ?? undefined,
          vaultId: row.vault_id ?? undefined,
          memoryType: row.memory_type,
          importance: row.importance ?? undefined,
          isPregnancyJournal: row.is_pregnancy_journal === 1,
        });
      }
    }

    // Search by tags (memories)
    const memoryTagRows = await db.getAllAsync<TagSearchRow>(
      `SELECT m.id as memory_id, NULL as chapter_id, tg.name as tag_name,
              m.title as memory_title, COALESCE(c.title, '') as chapter_title
       FROM tags tg
       INNER JOIN memory_tags mt ON tg.id = mt.tag_id
       INNER JOIN memories m ON mt.memory_id = m.id
       LEFT JOIN chapters c ON m.chapter_id = c.id
       WHERE tg.name LIKE ?`,
      [searchPattern]
    );

    for (const row of memoryTagRows) {
      if (row.memory_id && row.memory_title) {
        results.push({
          type: 'memory',
          id: row.memory_id,
          title: row.memory_title,
          matchedField: 'tag',
          matchedText: row.tag_name,
          chapterTitle: row.chapter_title || undefined,
        });
      }
    }

    // Search by tags (chapters)
    const chapterTagRows = await db.getAllAsync<TagSearchRow>(
      `SELECT NULL as memory_id, c.id as chapter_id, tg.name as tag_name,
              NULL as memory_title, c.title as chapter_title
       FROM tags tg
       INNER JOIN chapter_tags ct ON tg.id = ct.tag_id
       INNER JOIN chapters c ON ct.chapter_id = c.id
       WHERE tg.name LIKE ?`,
      [searchPattern]
    );

    for (const row of chapterTagRows) {
      if (row.chapter_id) {
        results.push({
          type: 'chapter',
          id: row.chapter_id,
          title: row.chapter_title,
          matchedField: 'tag',
          matchedText: row.tag_name,
        });
      }
    }

    // Remove duplicates by id
    const seen = new Set<string>();
    return results.filter((result) => {
      const key = `${result.type}-${result.id}`;
      if (seen.has(key)) return false;
      seen.add(key);
      return true;
    });
  },
};
