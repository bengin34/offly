import { generateUUID } from '../../utils/uuid';
import { getDatabase } from '../database';
import type { Tag } from '../../types';

export const TagRepository = {
  async getAll(): Promise<Tag[]> {
    const db = await getDatabase();
    return db.getAllAsync<Tag>('SELECT * FROM tags ORDER BY name ASC');
  },

  async getById(id: string): Promise<Tag | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Tag>('SELECT * FROM tags WHERE id = ?', [id]);
  },

  async getByName(name: string): Promise<Tag | null> {
    const db = await getDatabase();
    return db.getFirstAsync<Tag>('SELECT * FROM tags WHERE name = ?', [name]);
  },

  async create(name: string): Promise<Tag> {
    const db = await getDatabase();
    const id = generateUUID();

    await db.runAsync('INSERT INTO tags (id, name) VALUES (?, ?)', [id, name]);

    return { id, name };
  },

  async getOrCreate(name: string): Promise<Tag> {
    const existing = await this.getByName(name);
    if (existing) return existing;
    return this.create(name);
  },

  async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM tags WHERE id = ?', [id]);
    return result.changes > 0;
  },

  async search(query: string): Promise<Tag[]> {
    const db = await getDatabase();
    const searchPattern = `%${query}%`;
    return db.getAllAsync<Tag>(
      'SELECT * FROM tags WHERE name LIKE ? ORDER BY name ASC',
      [searchPattern]
    );
  },

  async getForMemory(memoryId: string): Promise<Tag[]> {
    const db = await getDatabase();
    return db.getAllAsync<Tag>(
      `SELECT t.* FROM tags t
       INNER JOIN memory_tags mt ON t.id = mt.tag_id
       WHERE mt.memory_id = ?
       ORDER BY t.name ASC`,
      [memoryId]
    );
  },

  async getForChapter(chapterId: string): Promise<Tag[]> {
    const db = await getDatabase();
    return db.getAllAsync<Tag>(
      `SELECT t.* FROM tags t
       INNER JOIN chapter_tags ct ON t.id = ct.tag_id
       WHERE ct.chapter_id = ?
       ORDER BY t.name ASC`,
      [chapterId]
    );
  },
};
