import { generateUUID } from '../../utils/uuid';
import { getDatabase, getTimestamp } from '../database';
import type {
  MilestoneInstance,
  MilestoneInstanceWithTemplate,
  MilestoneTemplate,
  MemoryWithRelations,
  MilestoneInstanceStatus,
} from '../../types';
import { getMilestoneTemplateById } from '../../constants/milestoneTemplates';
import { MemoryRepository } from './MemoryRepository';

interface MilestoneInstanceRow {
  id: string;
  baby_id: string;
  chapter_id: string | null;
  milestone_template_id: string;
  associated_memory_id: string | null;
  expected_date: string;
  filled_date: string | null;
  status: MilestoneInstanceStatus;
  created_at: string;
  updated_at: string;
}

function rowToMilestoneInstance(row: MilestoneInstanceRow): MilestoneInstance {
  return {
    id: row.id,
    babyId: row.baby_id,
    chapterId: row.chapter_id ?? undefined,
    milestoneTemplateId: row.milestone_template_id,
    associatedMemoryId: row.associated_memory_id ?? undefined,
    expectedDate: row.expected_date,
    filledDate: row.filled_date ?? undefined,
    status: row.status,
    createdAt: row.created_at,
    updatedAt: row.updated_at,
  };
}

export const MilestoneRepository = {
  /**
   * Create a new milestone instance
   */
  async createInstance(
    babyId: string,
    milestoneTemplateId: string,
    expectedDate: string,
    chapterId?: string
  ): Promise<MilestoneInstance> {
    const db = await getDatabase();
    const id = generateUUID();
    const now = getTimestamp();

    await db.runAsync(
      `INSERT INTO milestone_instances
       (id, baby_id, chapter_id, milestone_template_id, expected_date, status, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?)`,
      [id, babyId, chapterId ?? null, milestoneTemplateId, expectedDate, 'pending', now, now]
    );

    return (await this.getById(id))!;
  },

  /**
   * Get milestone instance by ID
   */
  async getById(id: string): Promise<MilestoneInstance | null> {
    const db = await getDatabase();
    const row = await db.getFirstAsync<MilestoneInstanceRow>(
      'SELECT * FROM milestone_instances WHERE id = ?',
      [id]
    );
    return row ? rowToMilestoneInstance(row) : null;
  },

  /**
   * Get milestone instance with template and memory relations
   */
  async getWithRelations(id: string): Promise<MilestoneInstanceWithTemplate | null> {
    const instance = await this.getById(id);
    if (!instance) return null;

    const template = getMilestoneTemplateById(instance.milestoneTemplateId);
    if (!template) return null;

    let associatedMemory: MemoryWithRelations | undefined;
    if (instance.associatedMemoryId) {
      const memory = await MemoryRepository.getWithRelations(instance.associatedMemoryId);
      if (memory) {
        associatedMemory = memory;
      }
    }

    return {
      ...instance,
      template,
      associatedMemory,
    };
  },

  /**
   * Get all milestone instances for a baby
   */
  async getByBabyId(babyId: string): Promise<MilestoneInstance[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<MilestoneInstanceRow>(
      'SELECT * FROM milestone_instances WHERE baby_id = ? ORDER BY expected_date ASC',
      [babyId]
    );
    return rows.map(rowToMilestoneInstance);
  },

  /**
   * Get all milestone instances for a baby with template and memory relations
   */
  async getByBabyIdWithRelations(babyId: string): Promise<MilestoneInstanceWithTemplate[]> {
    const instances = await this.getByBabyId(babyId);
    const result: MilestoneInstanceWithTemplate[] = [];

    for (const instance of instances) {
      const withRelations = await this.getWithRelations(instance.id);
      if (withRelations) {
        result.push(withRelations);
      }
    }

    return result;
  },

  /**
   * Get milestone instances for a specific chapter
   */
  async getByChapterId(chapterId: string): Promise<MilestoneInstance[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<MilestoneInstanceRow>(
      'SELECT * FROM milestone_instances WHERE chapter_id = ? ORDER BY expected_date ASC',
      [chapterId]
    );
    return rows.map(rowToMilestoneInstance);
  },

  /**
   * Get milestone instances for a chapter with template and memory relations
   */
  async getByChapterIdWithRelations(chapterId: string): Promise<MilestoneInstanceWithTemplate[]> {
    const instances = await this.getByChapterId(chapterId);
    const result: MilestoneInstanceWithTemplate[] = [];
    for (const instance of instances) {
      const withRelations = await this.getWithRelations(instance.id);
      if (withRelations) {
        result.push(withRelations);
      }
    }
    return result;
  },

  /**
   * Count milestones for a chapter by status
   */
  async countByChapterId(chapterId: string): Promise<{ total: number; filled: number; pending: number }> {
    const db = await getDatabase();
    const total = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM milestone_instances WHERE chapter_id = ?',
      [chapterId]
    );
    const filled = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM milestone_instances WHERE chapter_id = ? AND status = ?',
      [chapterId, 'filled']
    );
    return {
      total: total?.count ?? 0,
      filled: filled?.count ?? 0,
      pending: (total?.count ?? 0) - (filled?.count ?? 0),
    };
  },

  /**
   * Get milestone instances by status
   */
  async getByStatus(babyId: string, status: MilestoneInstanceStatus): Promise<MilestoneInstance[]> {
    const db = await getDatabase();
    const rows = await db.getAllAsync<MilestoneInstanceRow>(
      'SELECT * FROM milestone_instances WHERE baby_id = ? AND status = ? ORDER BY expected_date ASC',
      [babyId, status]
    );
    return rows.map(rowToMilestoneInstance);
  },

  /**
   * Get milestone instances with relations by status
   */
  async getByStatusWithRelations(
    babyId: string,
    status: MilestoneInstanceStatus
  ): Promise<MilestoneInstanceWithTemplate[]> {
    const instances = await this.getByStatus(babyId, status);
    const result: MilestoneInstanceWithTemplate[] = [];

    for (const instance of instances) {
      const withRelations = await this.getWithRelations(instance.id);
      if (withRelations) {
        result.push(withRelations);
      }
    }

    return result;
  },

  /**
   * Link a memory to a milestone instance
   */
  async linkMemory(instanceId: string, memoryId: string): Promise<void> {
    const db = await getDatabase();
    const now = getTimestamp();

    await db.runAsync(
      `UPDATE milestone_instances
       SET associated_memory_id = ?, status = ?, filled_date = ?, updated_at = ?
       WHERE id = ?`,
      [memoryId, 'filled', now, now, instanceId]
    );
  },

  /**
   * Unlink a memory from a milestone instance
   */
  async unlinkMemory(instanceId: string): Promise<void> {
    const db = await getDatabase();
    const now = getTimestamp();

    await db.runAsync(
      `UPDATE milestone_instances
       SET associated_memory_id = NULL, status = ?, filled_date = NULL, updated_at = ?
       WHERE id = ?`,
      ['pending', now, instanceId]
    );
  },

  /**
   * Update milestone instance status
   */
  async updateStatus(instanceId: string, status: MilestoneInstanceStatus): Promise<void> {
    const db = await getDatabase();
    const now = getTimestamp();

    await db.runAsync(
      'UPDATE milestone_instances SET status = ?, updated_at = ? WHERE id = ?',
      [status, now, instanceId]
    );
  },

  /**
   * Archive a milestone instance
   */
  async archiveInstance(instanceId: string): Promise<void> {
    await this.updateStatus(instanceId, 'archived');
  },

  /**
   * Auto-generate milestone instances for a chapter
   */
  async autoGenerateForChapter(
    babyId: string,
    chapterId: string,
    templates: MilestoneTemplate[],
    startDate: string,
    endDate?: string
  ): Promise<MilestoneInstance[]> {
    const created: MilestoneInstance[] = [];

    for (const template of templates) {
      // Check if already exists
      const existing = await this.getByBabyId(babyId);
      const alreadyExists = existing.some(
        (inst) => inst.milestoneTemplateId === template.id && inst.status !== 'archived'
      );

      if (!alreadyExists) {
        // Calculate expected date based on template
        // This is simplified; in production, you'd use more sophisticated logic
        const created_instance = await this.createInstance(babyId, template.id, startDate);
        created.push(created_instance);
      }
    }

    return created;
  },

  /**
   * Delete a milestone instance
   */
  async delete(id: string): Promise<boolean> {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM milestone_instances WHERE id = ?', [id]);
    return result.changes > 0;
  },

  /**
   * Delete all milestone instances for a baby
   */
  async deleteByBabyId(babyId: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.runAsync('DELETE FROM milestone_instances WHERE baby_id = ?', [babyId]);
    return result.changes;
  },

  /**
   * Count milestone instances for a baby
   */
  async countByBabyId(babyId: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM milestone_instances WHERE baby_id = ?',
      [babyId]
    );
    return result?.count ?? 0;
  },

  /**
   * Count pending milestone instances for a baby
   */
  async countPendingByBabyId(babyId: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM milestone_instances WHERE baby_id = ? AND status = ?',
      [babyId, 'pending']
    );
    return result?.count ?? 0;
  },

  /**
   * Count filled milestone instances for a baby
   */
  async countFilledByBabyId(babyId: string): Promise<number> {
    const db = await getDatabase();
    const result = await db.getFirstAsync<{ count: number }>(
      'SELECT COUNT(*) as count FROM milestone_instances WHERE baby_id = ? AND status = ?',
      [babyId, 'filled']
    );
    return result?.count ?? 0;
  },
};
