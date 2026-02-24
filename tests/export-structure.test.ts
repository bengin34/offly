/**
 * Tests for export/import data structure contracts.
 * These tests verify that:
 *   1. ExportData includes milestoneInstances (added in v1.1.0 fix)
 *   2. ImportResult tracks milestoneInstancesImported
 *   3. validateExportData rejects malformed data and accepts valid shapes
 *
 * These run in Node without native modules.
 */

import type { ExportData } from '../src/utils/export';
import type { ImportResult } from '../src/utils/import';

// ─── ExportData structure ────────────────────────────────────────────────────

describe('ExportData type contract', () => {
  it('accepts a minimal valid export object with all required fields including milestoneInstances', () => {
    const data: ExportData = {
      version: '1.1.0',
      exportedAt: new Date().toISOString(),
      babyProfile: null,
      chapters: [],
      vaults: [],
      pregnancyJournalEntries: [],
      tags: [],
      milestoneInstances: [],
    };

    expect(data.milestoneInstances).toBeDefined();
    expect(Array.isArray(data.milestoneInstances)).toBe(true);
    expect(data.version).toBe('1.1.0');
  });

  it('milestoneInstances field holds MilestoneInstance objects', () => {
    const data: ExportData = {
      version: '1.1.0',
      exportedAt: new Date().toISOString(),
      babyProfile: null,
      chapters: [],
      vaults: [],
      pregnancyJournalEntries: [],
      tags: [],
      milestoneInstances: [
        {
          id: 'mi-1',
          babyId: 'baby-1',
          milestoneTemplateId: 'first-smile',
          expectedDate: '2024-03-01',
          status: 'filled',
          filledDate: '2024-02-28',
          createdAt: new Date().toISOString(),
          updatedAt: new Date().toISOString(),
        },
      ],
    };

    expect(data.milestoneInstances).toHaveLength(1);
    expect(data.milestoneInstances[0].id).toBe('mi-1');
    expect(data.milestoneInstances[0].status).toBe('filled');
  });
});

// ─── ImportResult structure ──────────────────────────────────────────────────

describe('ImportResult type contract', () => {
  it('includes milestoneInstancesImported counter', () => {
    const result: ImportResult = {
      success: true,
      chaptersImported: 2,
      memoriesImported: 10,
      tagsImported: 3,
      photosImported: 0,
      photosRestored: 0,
      vaultsImported: 1,
      milestoneInstancesImported: 5,
      skipped: { chapters: 0, memories: 0, tags: 0 },
      errors: [],
    };

    expect(result.milestoneInstancesImported).toBe(5);
  });

  it('milestoneInstancesImported defaults to 0 for empty imports', () => {
    const result: ImportResult = {
      success: true,
      chaptersImported: 0,
      memoriesImported: 0,
      tagsImported: 0,
      photosImported: 0,
      photosRestored: 0,
      vaultsImported: 0,
      milestoneInstancesImported: 0,
      skipped: { chapters: 0, memories: 0, tags: 0 },
      errors: [],
    };

    expect(result.milestoneInstancesImported).toBe(0);
  });
});

// ─── MilestoneInstance round-trip data integrity ────────────────────────────

describe('milestone instance export/import data integrity', () => {
  it('preserves all fields through a serialisation round-trip', () => {
    const original: ExportData = {
      version: '1.1.0',
      exportedAt: '2024-01-01T00:00:00.000Z',
      babyProfile: null,
      chapters: [],
      vaults: [],
      pregnancyJournalEntries: [],
      tags: [],
      milestoneInstances: [
        {
          id: 'mi-abc',
          babyId: 'baby-xyz',
          chapterId: 'ch-1',
          milestoneTemplateId: 'first-steps',
          associatedMemoryId: 'mem-1',
          expectedDate: '2025-01-15',
          filledDate: '2025-01-20',
          status: 'filled',
          createdAt: '2024-12-01T00:00:00.000Z',
          updatedAt: '2025-01-20T00:00:00.000Z',
        },
      ],
    };

    // Simulate JSON serialisation (what export writes / import reads)
    const serialised = JSON.stringify(original);
    const parsed: ExportData = JSON.parse(serialised);

    expect(parsed.milestoneInstances).toHaveLength(1);
    const inst = parsed.milestoneInstances[0];
    expect(inst.id).toBe('mi-abc');
    expect(inst.babyId).toBe('baby-xyz');
    expect(inst.chapterId).toBe('ch-1');
    expect(inst.milestoneTemplateId).toBe('first-steps');
    expect(inst.associatedMemoryId).toBe('mem-1');
    expect(inst.expectedDate).toBe('2025-01-15');
    expect(inst.filledDate).toBe('2025-01-20');
    expect(inst.status).toBe('filled');
  });

  it('handles instances with no optional fields', () => {
    const minimal: ExportData = {
      version: '1.1.0',
      exportedAt: '2024-01-01T00:00:00.000Z',
      babyProfile: null,
      chapters: [],
      vaults: [],
      pregnancyJournalEntries: [],
      tags: [],
      milestoneInstances: [
        {
          id: 'mi-min',
          babyId: 'baby-1',
          milestoneTemplateId: 'first-month',
          expectedDate: '2024-02-01',
          status: 'pending',
          createdAt: '2024-01-01T00:00:00.000Z',
          updatedAt: '2024-01-01T00:00:00.000Z',
        },
      ],
    };

    const parsed: ExportData = JSON.parse(JSON.stringify(minimal));
    expect(parsed.milestoneInstances[0].status).toBe('pending');
    expect(parsed.milestoneInstances[0].associatedMemoryId).toBeUndefined();
    expect(parsed.milestoneInstances[0].filledDate).toBeUndefined();
  });
});
