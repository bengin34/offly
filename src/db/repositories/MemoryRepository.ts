import { generateUUID } from '../../utils/uuid';
import { persistPhotos, deletePhotoFile, deletePhotoFiles } from '../../utils/photos';
import { getDatabase, getTimestamp } from '../database';
import type {
  Memory,
  MemoryWithRelations,
  Tag,
  MemoryPhoto,
  CreateMemoryInput,
  UpdateMemoryInput,
  MemoryType,
} from '../../types';

interface MemoryRow {
  id: string;
  chapter_id: string;
  vault_id: string | null;
  is_pregnancy_journal: number;
  memory_type: MemoryType;
  title: string;
  description: string | null;
  date: string;
  location_name: string | null;
  latitude: number | null;
  longitude: number | null;
  map_url: string | null;
  milestone_template_id: string | null;
  is_custom_milestone: number | null;
  created_at: string;
  updated_at: string;
}

interface PhotoRow {
  id: string;
  memory_id: string;
  uri: string;
  order_index: number;
}

function rowToMemory(row: MemoryRow): Memory {
  return {
    id: row.id,
    chapterId: row.chapter_id,
    vaultId: row.vault_id ?? undefined,
    isPregnancyJournal: row.is_pregnancy_journal === 1,
    memoryType: row.memory_type,
    title: row.title,
    description: row.description ?? undefined,
    date: row.date,
    locationName: row.location_name ?? undefined,
    latitude: row.latitude ?? undefined,
    longitude: row.longitude ?? undefined,
    mapUrl: row.map_url ?? undefined,
    milestoneTemplateId: row.milestone_template_id ?? undefined,
    isCustomMilestone: row.is_custom_milestone === 1 ? true : undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

function rowToPhoto(row: PhotoRow): MemoryPhoto {
  return {
    id: row.id,
    memoryId: row.memory_id,
    uri: row.uri,
    orderIndex: row.order_index,
  };
}

export const MemoryRepository = {
  async getByChapterId(chapterId: string): Promise<Memory[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<MemoryRow>(
      'SELECT * FROM memories WHERE chapter_id = ? ORDER BY date ASC, created_at ASC',
      [chapterId]
    );
    return rows.map(rowToMemory);
  },

  async getById(id: string): Promise<Memory | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<MemoryRow>(
      'SELECT * FROM memories WHERE id = ?',
      [id]
    );
    return row ? rowToMemory(row) : null;
  },

  async getWithRelations(id: string): Promise<MemoryWithRelations | null> {
    const memory = await this.getById(id);
    if (!memory) return null;

    const db = await getDatabase();

    const tags = await db.getAllAsync<Tag>(
      `SELECT t.* FROM tags t
       INNER JOIN memory_tags mt ON t.id = mt.tag_id
       WHERE mt.memory_id = ?`,
      [id]
    );

    const photoRows = await db.getAllAsync<PhotoRow>(
      'SELECT * FROM memory_photos WHERE memory_id = ? ORDER BY order_index ASC',
      [id]
    );

    return {
      ...memory,
      tags,
      photos: photoRows.map(rowToPhoto),
    };
  },

  async getByChapterIdWithRelations(chapterId: string): Promise<MemoryWithRelations[]> {
    const memories = await this.getByChapterId(chapterId);
    const result: MemoryWithRelations[] = [];

    for (const memory of memories) {
      const withRelations = await this.getWithRelations(memory.id);
      if (withRelations) {
        result.push(withRelations);
      }
    }

    return result;
  },

  async create(input: CreateMemoryInput): Promise<Memory> {
    const db = await getDatabase();
    const id = generateUUID();
    const now = getTimestamp();

    await db.runAsync(
      `INSERT INTO memories (id, chapter_id, vault_id, baby_id, is_pregnancy_journal, memory_type, title, description, date, location_name, latitude, longitude, map_url, milestone_template_id, is_custom_milestone, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.chapterId || null,
        input.vaultId ?? null,
        input.babyId ?? null,
        input.isPregnancyJournal ? 1 : 0,
        input.memoryType,
        input.title,
        input.description ?? null,
        input.date,
        input.locationName ?? null,
        input.latitude ?? null,
        input.longitude ?? null,
        input.mapUrl ?? null,
        input.milestoneTemplateId ?? null,
        input.isCustomMilestone ? 1 : 0,
        now,
        now,
      ]
    );

    // Add tags if provided
    if (input.tagIds?.length) {
      for (const tagId of input.tagIds) {
        await db.runAsync(
          'INSERT INTO memory_tags (memory_id, tag_id) VALUES (?, ?)',
          [id, tagId]
        );
      }
    }

    // Add photos if provided - persist to document directory first
    if (input.photoUris?.length) {
      const persistedUris = await persistPhotos(input.photoUris);
      for (let i = 0; i < persistedUris.length; i++) {
        const photoId = generateUUID();
        await db.runAsync(
          'INSERT INTO memory_photos (id, memory_id, uri, order_index) VALUES (?, ?, ?, ?)',
          [photoId, id, persistedUris[i], i]
        );
      }
    }

    return (await this.getById(id))!;
  },

  async update(input: UpdateMemoryInput): Promise<Memory | null> {
    const existing = await this.getById(input.id);
    if (!existing) return null;

    const db = await getDatabase();
    const now = getTimestamp();

    await db.runAsync(
      `UPDATE memories SET
         memory_type = ?,
         title = ?,
         description = ?,
         date = ?,
         location_name = ?,
         latitude = ?,
         longitude = ?,
         map_url = ?,
         updated_at = ?
       WHERE id = ?`,
      [
        input.memoryType ?? existing.memoryType,
        input.title ?? existing.title,
        input.description !== undefined ? input.description ?? null : existing.description ?? null,
        input.date ?? existing.date,
        input.locationName !== undefined ? input.locationName ?? null : existing.locationName ?? null,
        input.latitude !== undefined ? input.latitude ?? null : existing.latitude ?? null,
        input.longitude !== undefined ? input.longitude ?? null : existing.longitude ?? null,
        input.mapUrl !== undefined ? input.mapUrl ?? null : existing.mapUrl ?? null,
        now,
        input.id,
      ]
    );

    // Update tags if provided
    if (input.tagIds !== undefined) {
      await db.runAsync('DELETE FROM memory_tags WHERE memory_id = ?', [input.id]);
      for (const tagId of input.tagIds) {
        await db.runAsync(
          'INSERT INTO memory_tags (memory_id, tag_id) VALUES (?, ?)',
          [input.id, tagId]
        );
      }
    }

    // Update photos if provided
    if (input.photoUris !== undefined) {
      // Get existing photos to clean up removed ones
      const existingPhotos = await db.getAllAsync<PhotoRow>(
        'SELECT * FROM memory_photos WHERE memory_id = ?',
        [input.id]
      );
      const existingUris = existingPhotos.map((p) => p.uri);

      // Persist new photos
      const persistedUris = await persistPhotos(input.photoUris);

      // Find photos that were removed and delete their files
      const removedUris = existingUris.filter((uri) => !persistedUris.includes(uri));
      await deletePhotoFiles(removedUris);

      // Update database
      await db.runAsync('DELETE FROM memory_photos WHERE memory_id = ?', [input.id]);
      for (let i = 0; i < persistedUris.length; i++) {
        const photoId = generateUUID();
        await db.runAsync(
          'INSERT INTO memory_photos (id, memory_id, uri, order_index) VALUES (?, ?, ?, ?)',
          [photoId, input.id, persistedUris[i], i]
        );
      }
    }

    return this.getById(input.id);
  },

  async delete(id: string): Promise<boolean> {
    const db = await getDatabase();

    // Get photo URIs before deleting memory
    const photos = await db.getAllAsync<PhotoRow>(
      'SELECT * FROM memory_photos WHERE memory_id = ?',
      [id]
    );

    // Revert any linked milestone instances to pending
    await db.runAsync(
      `UPDATE milestone_instances SET associated_memory_id = NULL, status = 'pending', filled_date = NULL, updated_at = ?
       WHERE associated_memory_id = ?`,
      [getTimestamp(), id]
    );

    const result = await db.runAsync('DELETE FROM memories WHERE id = ?', [id]);

    // Delete photo files if memory was deleted
    if (result.changes > 0) {
      await deletePhotoFiles(photos.map((p) => p.uri));
    }

    return result.changes > 0;
  },

  async deletePhoto(photoId: string): Promise<boolean> {
    const db = await getDatabase();

    // Get photo URI before deleting
    const photo = await db.getFirstAsync<PhotoRow>(
      'SELECT * FROM memory_photos WHERE id = ?',
      [photoId]
    );

    const result = await db.runAsync('DELETE FROM memory_photos WHERE id = ?', [photoId]);

    // Delete file if record was deleted
    if (result.changes > 0 && photo) {
      await deletePhotoFile(photo.uri);
    }

    return result.changes > 0;
  },

  async search(query: string): Promise<Memory[]> {
    const db = await getDatabase();
    const searchPattern = `%${query}%`;
    const rows = await db.getAllAsync<MemoryRow>(
      `SELECT * FROM memories
       WHERE title LIKE ? OR description LIKE ?
       ORDER BY date DESC`,
      [searchPattern, searchPattern]
    );
    return rows.map(rowToMemory);
  },

  async count(chapterId?: string): Promise<number> {
    const db = await getDatabase();

    if (chapterId) {
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM memories WHERE chapter_id = ?',
        [chapterId]
      );
      return result?.count ?? 0;
    }

    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM memories'
    );
    return result?.count ?? 0;
  },

  // Vault entries
  async getByVaultId(vaultId: string): Promise<Memory[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<MemoryRow>(
      'SELECT * FROM memories WHERE vault_id = ? ORDER BY date ASC, created_at ASC',
      [vaultId]
    );
    return rows.map(rowToMemory);
  },

  async getByVaultIdWithRelations(vaultId: string): Promise<MemoryWithRelations[]> {
    const memories = await this.getByVaultId(vaultId);
    const result: MemoryWithRelations[] = [];
    for (const memory of memories) {
      const withRelations = await this.getWithRelations(memory.id);
      if (withRelations) result.push(withRelations);
    }
    return result;
  },

  async countByVaultId(vaultId: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM memories WHERE vault_id = ?',
      [vaultId]
    );
    return result?.count ?? 0;
  },

  async countAgeLockedLetters(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      "SELECT COUNT(*) as count FROM memories WHERE vault_id IS NOT NULL AND memory_type = 'letter'"
    );
    return result?.count ?? 0;
  },

  // Pregnancy journal entries
  async getPregnancyJournalEntries(babyId?: string): Promise<Memory[]> {
    const db = await getDatabase();
    if (babyId) {
      const rows = await db.getAllAsync<MemoryRow>(
        'SELECT * FROM memories WHERE is_pregnancy_journal = 1 AND baby_id = ? ORDER BY date ASC, created_at ASC',
        [babyId]
      );
      return rows.map(rowToMemory);
    }
    const rows = await db.getAllAsync<MemoryRow>(
      'SELECT * FROM memories WHERE is_pregnancy_journal = 1 ORDER BY date ASC, created_at ASC'
    );
    return rows.map(rowToMemory);
  },

  async getPregnancyJournalEntriesWithRelations(babyId?: string): Promise<MemoryWithRelations[]> {
    const memories = await this.getPregnancyJournalEntries(babyId);
    const result: MemoryWithRelations[] = [];
    for (const memory of memories) {
      const withRelations = await this.getWithRelations(memory.id);
      if (withRelations) result.push(withRelations);
    }
    return result;
  },

  async countPregnancyJournal(babyId?: string): Promise<number> {
    const db = await getDatabase();
    if (babyId) {
      const result = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM memories WHERE is_pregnancy_journal = 1 AND baby_id = ?',
        [babyId]
      );
      return result?.count ?? 0;
    }
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM memories WHERE is_pregnancy_journal = 1'
    );
    return result?.count ?? 0;
  },

  // Move pregnancy journal entries to a chapter (for mode switch)
  async movePregnancyJournalToChapter(chapterId: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync(
      'UPDATE memories SET chapter_id = ?, is_pregnancy_journal = 0 WHERE is_pregnancy_journal = 1',
      [chapterId]
    );
    return result.changes;
  },
};
