import { generateUUID } from '../../utils/uuid';
import { getDatabase, getTimestamp } from '../database';
import type { Chapter, ChapterWithTags, ChapterWithMilestoneProgress, Tag, CreateChapterInput, UpdateChapterInput } from '../../types';

interface ChapterRow {
  id: string;
  baby_id: string;
  title: string;
  start_date: string;
  end_date: string | null;
  description: string | null;
  cover_image_uri: string | null;
  created_at: string;
  updated_at: string;
}

function rowToChapter(row: ChapterRow): Chapter {
  return {
    id: row.id,
    babyId: row.baby_id,
    title: row.title,
    startDate: row.start_date,
    endDate: row.end_date ?? undefined,
    description: row.description ?? undefined,
    coverImageUri: row.cover_image_uri ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const ChapterRepository = {
  async getAll(babyId?: string): Promise<Chapter[]> {
    const db = await getDatabase();

    if (babyId) {
      const rows = await db.getAllAsync<ChapterRow>(
        'SELECT * FROM chapters WHERE baby_id = ? ORDER BY start_date DESC',
        [babyId]
      );
      return rows.map(rowToChapter);
    }

    const rows = await db.getAllAsync<ChapterRow>(
      'SELECT * FROM chapters ORDER BY start_date DESC'
    );
    return rows.map(rowToChapter);
  },

  async count(babyId?: string): Promise<number> {
    const db = await getDatabase();

    if (babyId) {
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM chapters WHERE baby_id = ?',
        [babyId]
      );
      return result?.count ?? 0;
    }

    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM chapters'
    );
    return result?.count ?? 0;
  },

  async getAllWithTags(babyId?: string): Promise<ChapterWithTags[]> {
    const db = await getDatabase();

    let rows: ChapterRow[];
    if (babyId) {
      rows = await db.getAllAsync<ChapterRow>(
        'SELECT * FROM chapters WHERE baby_id = ? ORDER BY start_date DESC',
        [babyId]
      );
    } else {
      rows = await db.getAllAsync<ChapterRow>(
        'SELECT * FROM chapters ORDER BY start_date DESC'
      );
    }

    const chapters: ChapterWithTags[] = [];
    for (const row of rows) {
      const tags = await db.getAllAsync<Tag>(
        `SELECT t.* FROM tags t
         INNER JOIN chapter_tags ct ON t.id = ct.tag_id
         WHERE ct.chapter_id = ?`,
        [row.id]
      );
      chapters.push({ ...rowToChapter(row), tags });
    }
    return chapters;
  },

  async getAllWithProgress(babyId?: string): Promise<ChapterWithMilestoneProgress[]> {
    const db = await getDatabase();
    const rows = babyId
      ? await db.getAllAsync<ChapterRow>(
          'SELECT * FROM chapters WHERE baby_id = ? ORDER BY start_date ASC',
          [babyId]
        )
      : await db.getAllAsync<ChapterRow>('SELECT * FROM chapters ORDER BY start_date ASC');

    const chapters: ChapterWithMilestoneProgress[] = [];
    for (const row of rows) {
      const tags = await db.getAllAsync<Tag>(
        `SELECT t.* FROM tags t
         INNER JOIN chapter_tags ct ON t.id = ct.tag_id
         WHERE ct.chapter_id = ?`,
        [row.id]
      );
      const milestoneTotal = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM milestone_instances WHERE chapter_id = ?',
        [row.id]
      );
      const milestoneFilled = await db.getFirstAsync<{ count: number }>(
        "SELECT COUNT(*) as count FROM milestone_instances WHERE chapter_id = ? AND status = 'filled'",
        [row.id]
      );
      const memoryCount = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM memories WHERE chapter_id = ?',
        [row.id]
      );
      chapters.push({
        ...rowToChapter(row),
        tags,
        milestoneTotal: milestoneTotal?.count ?? 0,
        milestoneFilled: milestoneFilled?.count ?? 0,
        memoryCount: memoryCount?.count ?? 0,
      });
    }
    return chapters;
  },

  async getById(id: string): Promise<Chapter | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<ChapterRow>(
      'SELECT * FROM chapters WHERE id = ?',
      [id]
    );
    return row ? rowToChapter(row) : null;
  },

  async getWithTags(id: string): Promise<ChapterWithTags | null> {
    const chapter = await this.getById(id);
    if (!chapter) return null;

    const db = await getDatabase();
    const tags = await db.getAllAsync<Tag>(
      `SELECT t.* FROM tags t
       INNER JOIN chapter_tags ct ON t.id = ct.tag_id
       WHERE ct.chapter_id = ?`,
      [id]
    );

    return { ...chapter, tags };
  },

  async create(input: CreateChapterInput): Promise<Chapter> {
    const db = await getDatabase();
    const id = generateUUID();
    const now = getTimestamp();

    await db.runAsync(
      `INSERT INTO chapters (id, baby_id, title, start_date, end_date, description, cover_image_uri, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.babyId,
        input.title,
        input.startDate,
        input.endDate ?? null,
        input.description ?? null,
        input.coverImageUri ?? null,
        now,
        now,
      ]
    );

    // Add tags if provided
    if (input.tagIds?.length) {
      for (const tagId of input.tagIds) {
        await db.runAsync(
          'INSERT INTO chapter_tags (chapter_id, tag_id) VALUES (?, ?)',
          [id, tagId]
        );
      }
    }

    return (await this.getById(id))!;
  },

  async update(input: UpdateChapterInput): Promise<Chapter | null> {
    const existing = await this.getById(input.id);
    if (!existing) return null;

    const db = await getDatabase();
    const now = getTimestamp();

    await db.runAsync(
      `UPDATE chapters SET
         title = ?,
         start_date = ?,
         end_date = ?,
         description = ?,
         cover_image_uri = ?,
         updated_at = ?
       WHERE id = ?`,
      [
        input.title ?? existing.title,
        input.startDate ?? existing.startDate,
        input.endDate !== undefined ? input.endDate ?? null : existing.endDate ?? null,
        input.description !== undefined ? input.description ?? null : existing.description ?? null,
        input.coverImageUri !== undefined ? input.coverImageUri ?? null : existing.coverImageUri ?? null,
        now,
        input.id,
      ]
    );

    // Update tags if provided
    if (input.tagIds !== undefined) {
      await db.runAsync('DELETE FROM chapter_tags WHERE chapter_id = ?', [input.id]);
      for (const tagId of input.tagIds) {
        await db.runAsync(
          'INSERT INTO chapter_tags (chapter_id, tag_id) VALUES (?, ?)',
          [input.id, tagId]
        );
      }
    }

    return this.getById(input.id);
  },

  async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM chapters WHERE id = ?', [id]);
    return result.changes > 0;
  },

  async search(query: string): Promise<Chapter[]> {
    const db = await getDatabase();
    const searchPattern = `%${query}%`;
    const rows = await db.getAllAsync<ChapterRow>(
      `SELECT * FROM chapters
       WHERE title LIKE ? OR description LIKE ?
       ORDER BY start_date DESC`,
      [searchPattern, searchPattern]
    );
    return rows.map(rowToChapter);
  },
};
