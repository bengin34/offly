import { BabyProfileRepository } from '../src/db/repositories/BabyProfileRepository';
import { getDatabase, getTimestamp } from '../src/db/database';
import { ChapterRepository } from '../src/db/repositories/ChapterRepository';
import { MilestoneRepository } from '../src/db/repositories/MilestoneRepository';
import { VaultRepository } from '../src/db/repositories/VaultRepository';

jest.mock('../src/db/database', () => ({
  getDatabase: jest.fn(),
  getTimestamp: jest.fn(),
}));

jest.mock('../src/db/repositories/ChapterRepository', () => ({
  ChapterRepository: {
    unarchivePregnancyChapters: jest.fn(),
    delete: jest.fn(),
    getAll: jest.fn(),
  },
}));

jest.mock('../src/db/repositories/MilestoneRepository', () => ({
  MilestoneRepository: {
    unarchiveByPregnancyChapters: jest.fn(),
  },
}));

jest.mock('../src/db/repositories/VaultRepository', () => ({
  VaultRepository: {
    recalculateUnlockDates: jest.fn(),
  },
}));

jest.mock('../src/db/repositories/MemoryRepository', () => ({
  MemoryRepository: {},
}));

type DbMock = {
  getFirstAsync: jest.Mock;
  getAllAsync: jest.Mock;
  runAsync: jest.Mock;
};

const mockedGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;
const mockedGetTimestamp = getTimestamp as jest.MockedFunction<typeof getTimestamp>;
const chapterRepo = ChapterRepository as jest.Mocked<typeof ChapterRepository>;
const milestoneRepo = MilestoneRepository as jest.Mocked<typeof MilestoneRepository>;
const vaultRepo = VaultRepository as jest.Mocked<typeof VaultRepository>;

function makeDbMock(): DbMock {
  return {
    getFirstAsync: jest.fn(),
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
  };
}

function makeProfileRow(overrides: Partial<Record<string, unknown>> = {}) {
  return {
    id: 'baby-1',
    name: 'Elisa',
    avatar: null,
    birthdate: '2026-01-01T00:00:00.000Z',
    edd: '2026-03-01T00:00:00.000Z',
    mode: 'born',
    is_default: 1,
    previous_mode: 'pregnant',
    previous_edd: '2026-03-01T00:00:00.000Z',
    mode_switched_at: '2026-02-01T00:00:00.000Z',
    before_birth_chapter_id: 'before-birth-1',
    show_archived_chapters: 1,
    created_at: '2026-01-01T00:00:00.000Z',
    updated_at: '2026-02-01T00:00:00.000Z',
    ...overrides,
  };
}

describe('settings mode-switch repository flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetTimestamp.mockReturnValue('2026-02-27T12:00:00.000Z');
  });

  it('saveModeSwitchState persists previous mode/edd before switch', async () => {
    const db = makeDbMock();
    mockedGetDatabase.mockResolvedValue(db as any);

    db.getFirstAsync.mockResolvedValueOnce(
      makeProfileRow({
        mode: 'pregnant',
        birthdate: null,
      })
    );

    await BabyProfileRepository.saveModeSwitchState('baby-1');

    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE baby_profiles SET'),
      ['pregnant', '2026-03-01T00:00:00.000Z', '2026-02-27T12:00:00.000Z', '2026-02-27T12:00:00.000Z', 'baby-1']
    );
  });

  it('setShowArchivedChapters updates boolean state as 1/0', async () => {
    const db = makeDbMock();
    mockedGetDatabase.mockResolvedValue(db as any);

    await BabyProfileRepository.setShowArchivedChapters('baby-1', true);
    await BabyProfileRepository.setShowArchivedChapters('baby-1', false);

    expect(db.runAsync).toHaveBeenNthCalledWith(
      1,
      'UPDATE baby_profiles SET show_archived_chapters = ?, updated_at = ? WHERE id = ?',
      [1, '2026-02-27T12:00:00.000Z', 'baby-1']
    );
    expect(db.runAsync).toHaveBeenNthCalledWith(
      2,
      'UPDATE baby_profiles SET show_archived_chapters = ?, updated_at = ? WHERE id = ?',
      [0, '2026-02-27T12:00:00.000Z', 'baby-1']
    );
  });

  it('undoModeSwitchToPregnant returns false when there is no previous mode', async () => {
    const db = makeDbMock();
    mockedGetDatabase.mockResolvedValue(db as any);
    db.getFirstAsync.mockResolvedValueOnce(
      makeProfileRow({
        previous_mode: null,
      })
    );

    const ok = await BabyProfileRepository.undoModeSwitchToPregnant('baby-1');

    expect(ok).toBe(false);
    expect(db.runAsync).not.toHaveBeenCalled();
  });

  it('undoModeSwitchToPregnant restores profile, unarchives data, and removes empty born chapters', async () => {
    const db = makeDbMock();
    mockedGetDatabase.mockResolvedValue(db as any);

    db.getFirstAsync.mockImplementation(async (query: string, params?: unknown[]) => {
      if (query.includes('FROM baby_profiles WHERE id = ?')) {
        return makeProfileRow();
      }
      if (query.includes('SELECT id FROM chapters WHERE id = ? AND baby_id = ?')) {
        return { id: 'before-birth-1' };
      }
      if (query.includes('SELECT COUNT(*) as count FROM memories WHERE chapter_id = ?')) {
        if ((params?.[0] as string) === 'born-empty') return { count: 0 };
        return { count: 2 };
      }
      return null;
    });

    chapterRepo.unarchivePregnancyChapters.mockResolvedValue(8);
    milestoneRepo.unarchiveByPregnancyChapters.mockResolvedValue(10);
    chapterRepo.getAll.mockResolvedValue([
      {
        id: 'born-empty',
        babyId: 'baby-1',
        title: 'Month 2',
        startDate: '2026-01-29T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'week-20',
        babyId: 'baby-1',
        title: 'Week 20',
        startDate: '2026-01-29T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]);
    chapterRepo.delete.mockResolvedValue(true);
    vaultRepo.recalculateUnlockDates.mockResolvedValue();

    const ok = await BabyProfileRepository.undoModeSwitchToPregnant('baby-1');

    expect(ok).toBe(true);
    expect(chapterRepo.unarchivePregnancyChapters).toHaveBeenCalledWith('baby-1');
    expect(milestoneRepo.unarchiveByPregnancyChapters).toHaveBeenCalledWith('baby-1');

    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE baby_profiles SET'),
      ['pregnant', '2026-03-01T00:00:00.000Z', '2026-02-27T12:00:00.000Z', 'baby-1']
    );

    expect(db.runAsync).toHaveBeenCalledWith(
      'UPDATE memories SET is_pregnancy_journal = 1, chapter_id = NULL WHERE chapter_id = ?',
      ['before-birth-1']
    );
    expect(chapterRepo.delete).toHaveBeenCalledWith('before-birth-1');
    expect(chapterRepo.delete).toHaveBeenCalledWith('born-empty');

    expect(vaultRepo.recalculateUnlockDates).toHaveBeenCalledWith(
      'baby-1',
      '2026-03-01T00:00:00.000Z'
    );
  });
});
