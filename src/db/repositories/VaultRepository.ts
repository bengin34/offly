import { generateUUID } from '../../utils/uuid';
import { getDatabase, getTimestamp } from '../database';
import type { Vault, VaultStatus, VaultWithEntryCount, CreateVaultInput } from '../../types';

interface VaultRow {
  id: string;
  baby_id: string;
  target_age_years: number;
  unlock_date: string | null;
  status: string;
  created_at: string;
  updated_at: string;
}

function rowToVault(row: VaultRow): Vault {
  return {
    id: row.id,
    babyId: row.baby_id,
    targetAgeYears: row.target_age_years,
    unlockDate: row.unlock_date ?? undefined,
    status: row.status as VaultStatus,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const VaultRepository = {
  async getAll(babyId: string): Promise<Vault[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<VaultRow>(
      'SELECT * FROM vaults WHERE baby_id = ? ORDER BY target_age_years ASC',
      [babyId]
    );
    return rows.map(rowToVault);
  },

  async getAllWithEntryCounts(babyId: string): Promise<VaultWithEntryCount[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<VaultRow & { entry_count: number; last_saved_at: string | null }>(
      `SELECT v.*,
              COALESCE(counts.cnt, 0) as entry_count,
              counts.last_saved as last_saved_at
       FROM vaults v
       LEFT JOIN (
         SELECT vault_id, COUNT(*) as cnt, MAX(created_at) as last_saved
         FROM memories WHERE vault_id IS NOT NULL
         GROUP BY vault_id
       ) counts ON counts.vault_id = v.id
       WHERE v.baby_id = ?
       ORDER BY v.target_age_years ASC`,
      [babyId]
    );
    return rows.map((row) => ({
      ...rowToVault(row),
      entryCount: row.entry_count,
      lastSavedAt: row.last_saved_at ?? undefined,
    }));
  },

  async getById(id: string): Promise<Vault | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<VaultRow>(
      'SELECT * FROM vaults WHERE id = ?',
      [id]
    );
    return row ? rowToVault(row) : null;
  },

  async create(input: CreateVaultInput): Promise<Vault> {
    const db = await getDatabase();
    const id = generateUUID();
    const now = getTimestamp();

    await db.runAsync(
      `INSERT INTO vaults (id, baby_id, target_age_years, unlock_date, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, 'locked', ?, ?)`,
      [id, input.babyId, input.targetAgeYears, null, now, now]
    );

    return (await this.getById(id))!;
  },

  async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM vaults WHERE id = ?', [id]);
    return result.changes > 0;
  },

  /** Recalculate unlock dates for all vaults of a baby based on a reference date (DOB or EDD). */
  async recalculateUnlockDates(babyId: string, referenceDate: string): Promise<void> {
    const vaults = await this.getAll(babyId);
    const db = await getDatabase();
    const now = getTimestamp();
    const refDate = new Date(referenceDate);

    for (const vault of vaults) {
      const unlockDate = new Date(refDate);
      unlockDate.setFullYear(unlockDate.getFullYear() + vault.targetAgeYears);
      const unlockDateStr = unlockDate.toISOString();

      const isUnlocked = new Date() >= unlockDate;

      await db.runAsync(
        `UPDATE vaults SET unlock_date = ?, status = ?, updated_at = ? WHERE id = ?`,
        [unlockDateStr, isUnlocked ? 'unlocked' : 'locked', now, vault.id]
      );
    }
  },

  /** Check and unlock any vaults whose unlock date has passed. */
  async checkAndUnlock(babyId: string): Promise<string[]> {
    const db = await getDatabase();
    const now = new Date().toISOString();
    const timestamp = getTimestamp();

    const toUnlock = await db.getAllAsync<{ id: string }>(
      `SELECT id FROM vaults
       WHERE baby_id = ? AND status = 'locked' AND unlock_date IS NOT NULL AND unlock_date <= ?`,
      [babyId, now]
    );

    for (const row of toUnlock) {
      await db.runAsync(
        `UPDATE vaults SET status = 'unlocked', updated_at = ? WHERE id = ?`,
        [timestamp, row.id]
      );
    }

    return toUnlock.map((r) => r.id);
  },

  /** Create default vaults (1yr, 5yr, 18yr) for a baby if none exist. */
  async createDefaults(babyId: string, referenceDate?: string): Promise<Vault[]> {
    const existing = await this.getAll(babyId);
    if (existing.length > 0) return existing;

    const defaultAges = [1, 5, 18];
    const vaults: Vault[] = [];

    for (const age of defaultAges) {
      const vault = await this.create({ babyId, targetAgeYears: age });
      vaults.push(vault);
    }

    if (referenceDate) {
      await this.recalculateUnlockDates(babyId, referenceDate);
      return this.getAll(babyId);
    }

    return vaults;
  },

  async count(babyId: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM vaults WHERE baby_id = ?',
      [babyId]
    );
    return result?.count ?? 0;
  },
};
