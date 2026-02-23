import { generateUUID } from '../../utils/uuid';
import { getDatabase, getTimestamp } from '../database';
import type { BabyProfile, BabyMode, CreateBabyProfileInput, UpdateBabyProfileInput } from '../../types';

interface BabyProfileRow {
  id: string;
  name: string | null;
  birthdate: string | null;
  edd: string | null;
  mode: string;
  is_default: number;
  previous_mode: string | null;
  previous_edd: string | null;
  mode_switched_at: string | null;
  created_at: string;
  updated_at: string;
}

function rowToProfile(row: BabyProfileRow): BabyProfile {
  return {
    id: row.id,
    name: row.name ?? undefined,
    birthdate: row.birthdate ?? undefined,
    edd: row.edd ?? undefined,
    mode: (row.mode as BabyMode) || 'born',
    isDefault: row.is_default === 1,
    previousMode: (row.previous_mode as BabyMode) ?? undefined,
    previousEdd: row.previous_edd ?? undefined,
    modeSwitchedAt: row.mode_switched_at ?? undefined,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const BabyProfileRepository = {
  async getAll(): Promise<BabyProfile[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<BabyProfileRow>(
      'SELECT * FROM baby_profiles ORDER BY is_default DESC, created_at ASC'
    );
    return rows.map(rowToProfile);
  },

  async getById(id: string): Promise<BabyProfile | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<BabyProfileRow>(
      'SELECT * FROM baby_profiles WHERE id = ?',
      [id]
    );
    return row ? rowToProfile(row) : null;
  },

  async getDefault(): Promise<BabyProfile | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<BabyProfileRow>(
      'SELECT * FROM baby_profiles WHERE is_default = 1 LIMIT 1'
    );
    if (row) return rowToProfile(row);

    // Fallback to first profile if no default
    const firstRow = await db.getFirstAsync<BabyProfileRow>(
      'SELECT * FROM baby_profiles ORDER BY created_at ASC LIMIT 1'
    );
    return firstRow ? rowToProfile(firstRow) : null;
  },

  async create(input: CreateBabyProfileInput): Promise<BabyProfile> {
    const db = await getDatabase();
    const id = generateUUID();
    const now = getTimestamp();

    // Check if this is the first profile
    const count = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM baby_profiles'
    );
    const isDefault = (count?.count ?? 0) === 0 ? 1 : 0;

    await db.runAsync(
      `INSERT INTO baby_profiles (id, name, birthdate, edd, mode, is_default, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        id,
        input.name ?? null,
        input.birthdate ?? null,
        input.edd ?? null,
        input.mode ?? 'born',
        isDefault,
        now,
        now,
      ]
    );

    return (await this.getById(id))!;
  },

  async update(input: UpdateBabyProfileInput): Promise<BabyProfile | null> {
    const existing = await this.getById(input.id);
    if (!existing) return null;

    const db = await getDatabase();
    const now = getTimestamp();

    await db.runAsync(
      `UPDATE baby_profiles SET
         name = ?,
         birthdate = ?,
         edd = ?,
         mode = ?,
         updated_at = ?
       WHERE id = ?`,
      [
        input.name !== undefined ? input.name ?? null : existing.name ?? null,
        input.birthdate !== undefined ? input.birthdate ?? null : existing.birthdate ?? null,
        input.edd !== undefined ? input.edd ?? null : existing.edd ?? null,
        input.mode !== undefined ? input.mode : existing.mode,
        now,
        input.id,
      ]
    );

    return this.getById(input.id);
  },

  async setDefault(id: string): Promise<boolean> {
    const profile = await this.getById(id);
    if (!profile) return false;

    const db = await getDatabase();

    // Clear all defaults
    await db.runAsync('UPDATE baby_profiles SET is_default = 0');

    // Set new default
    await db.runAsync('UPDATE baby_profiles SET is_default = 1 WHERE id = ?', [id]);

    return true;
  },

  async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM baby_profiles WHERE id = ?', [id]);
    return result.changes > 0;
  },

  async count(): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM baby_profiles'
    );
    return result?.count ?? 0;
  },

  /**
   * Save undo state before mode switch (pregnant → born)
   */
  async saveModeSwitchState(profileId: string): Promise<void> {
    const profile = await this.getById(profileId);
    if (!profile) return;

    const db = await getDatabase();
    const now = getTimestamp();

    await db.runAsync(
      `UPDATE baby_profiles SET
         previous_mode = ?,
         previous_edd = ?,
         mode_switched_at = ?,
         updated_at = ?
       WHERE id = ?`,
      [profile.mode, profile.edd ?? null, now, now, profileId]
    );
  },

  /**
   * Undo mode switch: revert from born back to pregnant mode
   */
  async undoModeSwitchToPregnant(profileId: string): Promise<boolean> {
    const profile = await this.getById(profileId);
    if (!profile || !profile.previousMode) return false;

    const db = await getDatabase();
    const now = getTimestamp();

    const { ChapterRepository } = await import('./ChapterRepository');
    const { MilestoneRepository } = await import('./MilestoneRepository');
    const { VaultRepository } = await import('./VaultRepository');
    const { MemoryRepository } = await import('./MemoryRepository');

    // 1. Restore profile to pregnant mode
    await db.runAsync(
      `UPDATE baby_profiles SET
         mode = ?,
         birthdate = NULL,
         edd = ?,
         previous_mode = NULL,
         previous_edd = NULL,
         mode_switched_at = NULL,
         updated_at = ?
       WHERE id = ?`,
      [profile.previousMode, profile.previousEdd ?? null, now, profileId]
    );

    // 2. Unarchive pregnancy chapters
    await ChapterRepository.unarchivePregnancyChapters(profileId);

    // 3. Restore milestone statuses
    await MilestoneRepository.unarchiveByPregnancyChapters(profileId);

    // 4. Move "Before you were born" chapter entries back to pregnancy journal
    const beforeBirthChapters = await db.getAllAsync<{ id: string }>(
      `SELECT id FROM chapters WHERE baby_id = ?
       AND (title = 'Before you were born' OR description LIKE '%Pregnancy journal%')
       AND archived_at IS NULL`,
      [profileId]
    );
    for (const ch of beforeBirthChapters) {
      await db.runAsync(
        'UPDATE memories SET is_pregnancy_journal = 1, chapter_id = NULL WHERE chapter_id = ?',
        [ch.id]
      );
      await ChapterRepository.delete(ch.id);
    }

    // 5. Delete empty auto-generated born chapters (no user data)
    const bornChapters = await ChapterRepository.getAll(profileId);
    for (const ch of bornChapters) {
      if (!ch.title.startsWith('Week ') && !ch.title.includes('Trimester')) {
        const memCount = await db.getFirstAsync<{ count: number }>(
          'SELECT COUNT(*) as count FROM memories WHERE chapter_id = ?',
          [ch.id]
        );
        if ((memCount?.count ?? 0) === 0) {
          await ChapterRepository.delete(ch.id);
        }
      }
    }

    // 6. Recalculate vault unlock dates using EDD
    if (profile.previousEdd) {
      await VaultRepository.recalculateUnlockDates(profileId, profile.previousEdd);
    }

    return true;
  },
};
