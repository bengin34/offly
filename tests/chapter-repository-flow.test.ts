import { ChapterRepository } from '../src/db/repositories/ChapterRepository';
import { getDatabase, getTimestamp } from '../src/db/database';
import { BabyProfileRepository } from '../src/db/repositories/BabyProfileRepository';
import {
  getPregnancyChapterDates,
  getPregnancyChapterTemplateByTitle,
} from '../src/constants/pregnancyChapterTemplates';

jest.mock('../src/db/database', () => ({
  getDatabase: jest.fn(),
  getTimestamp: jest.fn(),
}));

jest.mock('../src/db/repositories/BabyProfileRepository', () => ({
  BabyProfileRepository: {
    getById: jest.fn(),
  },
}));

jest.mock('../src/constants/pregnancyChapterTemplates', () => ({
  PREGNANCY_CHAPTER_TEMPLATES: [
    {
      id: 'pregnancy_week_1',
      title: 'Week 1',
      description: 'W1',
      gestationWeeksMin: 1,
      gestationWeeksMax: 1,
      order: 1,
    },
    {
      id: 'pregnancy_week_2',
      title: 'Week 2',
      description: 'W2',
      gestationWeeksMin: 2,
      gestationWeeksMax: 2,
      order: 2,
    },
  ],
  getPregnancyChapterDates: jest.fn((_: string, template: { title: string }) => {
    if (template.title === 'Week 1') {
      return {
        startDate: '2026-01-01T00:00:00.000Z',
        endDate: '2026-01-08T00:00:00.000Z',
      };
    }
    return {
      startDate: '2026-01-08T00:00:00.000Z',
      endDate: '2026-01-15T00:00:00.000Z',
    };
  }),
  getPregnancyChapterTemplateByTitle: jest.fn((title: string) => {
    if (title === 'Week 1') {
      return {
        id: 'pregnancy_week_1',
        title: 'Week 1',
        description: 'W1',
        gestationWeeksMin: 1,
        gestationWeeksMax: 1,
        order: 1,
      };
    }
    if (title === 'Week 2') {
      return {
        id: 'pregnancy_week_2',
        title: 'Week 2',
        description: 'W2',
        gestationWeeksMin: 2,
        gestationWeeksMax: 2,
        order: 2,
      };
    }
    return undefined;
  }),
}));

type DbMock = {
  getAllAsync: jest.Mock;
  getFirstAsync: jest.Mock;
  runAsync: jest.Mock;
};

const mockedGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;
const mockedGetTimestamp = getTimestamp as jest.MockedFunction<typeof getTimestamp>;
const mockedProfileRepo = BabyProfileRepository as jest.Mocked<typeof BabyProfileRepository>;
const mockedGetPregnancyChapterDates = getPregnancyChapterDates as jest.MockedFunction<
  typeof getPregnancyChapterDates
>;
const mockedGetPregnancyTemplateByTitle = getPregnancyChapterTemplateByTitle as jest.MockedFunction<
  typeof getPregnancyChapterTemplateByTitle
>;

function makeDbMock(): DbMock {
  return {
    getAllAsync: jest.fn(),
    getFirstAsync: jest.fn(),
    runAsync: jest.fn(),
  };
}

describe('chapter repository flow with DB mock', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetTimestamp.mockReturnValue('2026-02-27T12:00:00.000Z');
  });

  it('getAll includes archived chapters for born mode when showArchivedChapters=true', async () => {
    const db = makeDbMock();
    mockedGetDatabase.mockResolvedValue(db as any);
    mockedProfileRepo.getById.mockResolvedValue({
      id: 'baby-1',
      mode: 'born',
      showArchivedChapters: true,
      isDefault: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    db.getAllAsync.mockResolvedValue([
      {
        id: 'ch-1',
        baby_id: 'baby-1',
        title: 'Week 20',
        start_date: '2026-01-01T00:00:00.000Z',
        end_date: '2026-01-08T00:00:00.000Z',
        description: null,
        cover_image_uri: null,
        archived_at: '2026-02-01T00:00:00.000Z',
        created_at: '2026-01-01T00:00:00.000Z',
        updated_at: '2026-01-01T00:00:00.000Z',
      },
    ]);

    const rows = await ChapterRepository.getAll('baby-1');

    expect(db.getAllAsync).toHaveBeenCalledWith(
      'SELECT * FROM chapters WHERE baby_id = ? ORDER BY start_date DESC',
      ['baby-1']
    );
    expect(rows[0].archivedAt).toBe('2026-02-01T00:00:00.000Z');
  });

  it('getAll excludes archived chapters for pregnancy mode', async () => {
    const db = makeDbMock();
    mockedGetDatabase.mockResolvedValue(db as any);
    mockedProfileRepo.getById.mockResolvedValue({
      id: 'baby-1',
      mode: 'pregnant',
      showArchivedChapters: false,
      isDefault: true,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });
    db.getAllAsync.mockResolvedValue([]);

    await ChapterRepository.getAll('baby-1');

    expect(db.getAllAsync).toHaveBeenCalledWith(
      'SELECT * FROM chapters WHERE baby_id = ? AND archived_at IS NULL ORDER BY start_date DESC',
      ['baby-1']
    );
  });

  it('archives only pregnancy chapter titles with expected SQL contract', async () => {
    const db = makeDbMock();
    mockedGetDatabase.mockResolvedValue(db as any);
    db.runAsync.mockResolvedValue({ changes: 4 });

    const changes = await ChapterRepository.archivePregnancyChapters('baby-1');

    expect(changes).toBe(4);
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining("title LIKE 'Week %' OR title LIKE '%Trimester%'"),
      ['2026-02-27T12:00:00.000Z', '2026-02-27T12:00:00.000Z', 'baby-1']
    );
  });

  it('ensurePregnancyWeekChapters deduplicates same week and creates only missing weeks', async () => {
    const db = makeDbMock();
    mockedGetDatabase.mockResolvedValue(db as any);
    db.runAsync.mockResolvedValue({ changes: 1 });

    const getAllSpy = jest
      .spyOn(ChapterRepository, 'getAllIncludingArchived')
      .mockResolvedValue([
        {
          id: 'week1-oldest',
          babyId: 'baby-1',
          title: 'Week 1',
          startDate: '2025-12-20T00:00:00.000Z',
          endDate: '2025-12-27T00:00:00.000Z',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'week1-dup',
          babyId: 'baby-1',
          title: 'Week 1',
          startDate: '2025-12-21T00:00:00.000Z',
          endDate: '2025-12-28T00:00:00.000Z',
          createdAt: '2026-01-02T00:00:00.000Z',
          updatedAt: '2026-01-02T00:00:00.000Z',
        },
      ]);
    const archiveSpy = jest.spyOn(ChapterRepository, 'archive').mockResolvedValue(true);
    const createSpy = jest.spyOn(ChapterRepository, 'create').mockImplementation(async (input) => ({
      id: 'created-week-2',
      babyId: input.babyId,
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
      createdAt: '2026-01-03T00:00:00.000Z',
      updatedAt: '2026-01-03T00:00:00.000Z',
    }));

    const created = await ChapterRepository.ensurePregnancyWeekChapters(
      'baby-1',
      '2026-03-01T00:00:00.000Z'
    );

    expect(archiveSpy).toHaveBeenCalledWith('week1-dup');
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE chapters'),
      [
        '2026-01-01T00:00:00.000Z',
        '2026-01-08T00:00:00.000Z',
        'W1',
        '2026-02-27T12:00:00.000Z',
        'week1-oldest',
      ]
    );
    expect(createSpy).toHaveBeenCalledWith({
      babyId: 'baby-1',
      title: 'Week 2',
      startDate: '2026-01-08T00:00:00.000Z',
      endDate: '2026-01-15T00:00:00.000Z',
      description: 'W2',
    });
    expect(created).toEqual([
      expect.objectContaining({ id: 'created-week-2', title: 'Week 2' }),
    ]);

    expect(mockedGetPregnancyChapterDates).toHaveBeenCalledTimes(2);
    getAllSpy.mockRestore();
    archiveSpy.mockRestore();
    createSpy.mockRestore();
  });

  it('autoGeneratePregnancyChapters deletes legacy month/trimester chapters and generates milestones', async () => {
    const getAllSpy = jest.spyOn(ChapterRepository, 'getAllIncludingArchived').mockResolvedValue([
      {
        id: 'old-month',
        babyId: 'baby-1',
        title: 'Month 2',
        startDate: '2026-01-01T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'existing-week',
        babyId: 'baby-1',
        title: 'Week 20',
        startDate: '2026-01-01T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
    ]);
    const deleteSpy = jest.spyOn(ChapterRepository, 'delete').mockResolvedValue(true);
    const ensureSpy = jest
      .spyOn(ChapterRepository, 'ensurePregnancyWeekChapters')
      .mockResolvedValue([
        {
          id: 'week-1-new',
          babyId: 'baby-1',
          title: 'Week 1',
          startDate: '2026-01-01T00:00:00.000Z',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ]);
    const milestonesSpy = jest
      .spyOn(ChapterRepository, 'autoGenerateMilestonesForPregnancyChapter')
      .mockResolvedValue();

    const created = await ChapterRepository.autoGeneratePregnancyChapters(
      'baby-1',
      '2026-03-01T00:00:00.000Z'
    );

    expect(deleteSpy).toHaveBeenCalledWith('old-month');
    expect(deleteSpy).not.toHaveBeenCalledWith('existing-week');
    expect(ensureSpy).toHaveBeenCalledWith('baby-1', '2026-03-01T00:00:00.000Z');
    expect(milestonesSpy).toHaveBeenCalledWith(
      'baby-1',
      'week-1-new',
      expect.objectContaining({ title: 'Week 1' })
    );
    expect(created).toHaveLength(1);
    expect(mockedGetPregnancyTemplateByTitle).toHaveBeenCalledWith('Week 1');

    getAllSpy.mockRestore();
    deleteSpy.mockRestore();
    ensureSpy.mockRestore();
    milestonesSpy.mockRestore();
  });
});
