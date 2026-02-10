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
   * Transition from pregnant to born mode
   * - Updates profile with birthdate and mode
   * - Marks pregnancy chapters as archive
   * - Preserves pregnancy milestones and journal entries
   * - Born-mode chapters will be auto-generated on next load
   */
  async transitionToBornMode(profileId: string, birthdate: string): Promise<void> {
    const profile = await this.getById(profileId);
    if (!profile || profile.mode !== 'pregnant') {
      return;
    }

    const db = await getDatabase();
    const now = getTimestamp();

    // Step 1: Update profile to born mode
    await db.runAsync(
      `UPDATE baby_profiles SET
         birthdate = ?,
         mode = ?,
         updated_at = ?
       WHERE id = ?`,
      [birthdate, 'born', now, profileId]
    );

    // Step 2: Mark pregnancy chapters as archived
    // Add "[Before you were born]" to description
    const { ChapterRepository } = await import('./ChapterRepository');
    const pregnancyChapters = await ChapterRepository.getAll(profileId);

    for (const chapter of pregnancyChapters) {
      const updatedDescription = chapter.description
        ? `${chapter.description} [Before you were born]`
        : '[Before you were born]';

      await ChapterRepository.update({
        id: chapter.id,
        description: updatedDescription,
      });
    }

    // Note: Born-mode chapters and milestones will be auto-generated
    // on next home screen load via existing onboarding logic
  },
};
