import { autoGenerateTimeline, cleanupBornChapters } from '../src/utils/autoGenerate';
import { BORN_CHAPTER_TEMPLATES } from '../src/constants/chapterTemplates';
import { ChapterRepository, MilestoneRepository } from '../src/db/repositories';
import { getMilestoneTemplates } from '../src/constants/milestoneTemplates';
import { getExpectedDate } from '../src/utils/milestones';
import type { BabyProfile } from '../src/types';

jest.mock('../src/db/repositories', () => ({
  ChapterRepository: {
    archivePregnancyChapters: jest.fn(),
    getAll: jest.fn(),
    archive: jest.fn(),
    create: jest.fn(),
  },
  MilestoneRepository: {
    createInstance: jest.fn(),
  },
}));

jest.mock('../src/constants/milestoneTemplates', () => ({
  getMilestoneTemplates: jest.fn(),
}));

jest.mock('../src/utils/milestones', () => ({
  getExpectedDate: jest.fn(),
}));

const chapterRepo = ChapterRepository as jest.Mocked<typeof ChapterRepository>;
const milestoneRepo = MilestoneRepository as jest.Mocked<typeof MilestoneRepository>;
const mockedGetMilestoneTemplates = getMilestoneTemplates as jest.MockedFunction<
  typeof getMilestoneTemplates
>;
const mockedGetExpectedDate = getExpectedDate as jest.MockedFunction<typeof getExpectedDate>;

function makeProfile(overrides: Partial<BabyProfile> = {}): BabyProfile {
  return {
    id: 'baby-1',
    mode: 'born',
    isDefault: true,
    showArchivedChapters: true,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
    ...overrides,
  };
}

describe('auto-generate timeline flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
  });

  it('cleanupBornChapters archives pregnancy chapters and duplicate titles', async () => {
    chapterRepo.archivePregnancyChapters.mockResolvedValue(3);
    chapterRepo.getAll.mockResolvedValue([
      {
        id: 'ch-1',
        babyId: 'baby-1',
        title: 'Month 1',
        startDate: '2026-01-01T00:00:00.000Z',
        createdAt: '2026-01-01T00:00:00.000Z',
        updatedAt: '2026-01-01T00:00:00.000Z',
      },
      {
        id: 'ch-2',
        babyId: 'baby-1',
        title: 'Month 1',
        startDate: '2026-01-02T00:00:00.000Z',
        createdAt: '2026-01-02T00:00:00.000Z',
        updatedAt: '2026-01-02T00:00:00.000Z',
      },
      {
        id: 'ch-3',
        babyId: 'baby-1',
        title: 'Month 2',
        startDate: '2026-01-29T00:00:00.000Z',
        createdAt: '2026-01-29T00:00:00.000Z',
        updatedAt: '2026-01-29T00:00:00.000Z',
      },
    ]);
    chapterRepo.archive.mockResolvedValue(true);

    await cleanupBornChapters('baby-1');

    expect(chapterRepo.archivePregnancyChapters).toHaveBeenCalledWith('baby-1');
    expect(chapterRepo.archive).toHaveBeenCalledTimes(1);
    expect(chapterRepo.archive).toHaveBeenCalledWith('ch-2');
  });

  it('returns early when birthdate is missing', async () => {
    await autoGenerateTimeline(makeProfile({ birthdate: undefined }));

    expect(chapterRepo.archivePregnancyChapters).not.toHaveBeenCalled();
    expect(chapterRepo.create).not.toHaveBeenCalled();
    expect(milestoneRepo.createInstance).not.toHaveBeenCalled();
  });

  it('creates only missing born chapters after dedupe pass', async () => {
    chapterRepo.archivePregnancyChapters.mockResolvedValue(0);
    chapterRepo.getAll
      .mockResolvedValueOnce([
        {
          id: 'dup-1',
          babyId: 'baby-1',
          title: 'Month 1',
          startDate: '2026-01-01T00:00:00.000Z',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
        {
          id: 'dup-2',
          babyId: 'baby-1',
          title: 'Month 1',
          startDate: '2026-01-02T00:00:00.000Z',
          createdAt: '2026-01-02T00:00:00.000Z',
          updatedAt: '2026-01-02T00:00:00.000Z',
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'existing-month-1',
          babyId: 'baby-1',
          title: 'Month 1',
          startDate: '2026-01-01T00:00:00.000Z',
          createdAt: '2026-01-01T00:00:00.000Z',
          updatedAt: '2026-01-01T00:00:00.000Z',
        },
      ]);

    chapterRepo.archive.mockResolvedValue(true);
    chapterRepo.create.mockImplementation(async (input) => ({
      id: `ch-${input.title.replace(/\s+/g, '-')}`,
      babyId: input.babyId,
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }));

    mockedGetMilestoneTemplates.mockReturnValue([]);
    mockedGetExpectedDate.mockReturnValue(null);

    await autoGenerateTimeline(
      makeProfile({ birthdate: '2026-01-01T00:00:00.000Z' })
    );

    expect(chapterRepo.archive).toHaveBeenCalledWith('dup-2');
    expect(chapterRepo.create).toHaveBeenCalledTimes(BORN_CHAPTER_TEMPLATES.length - 1);
    expect(chapterRepo.create).not.toHaveBeenCalledWith(
      expect.objectContaining({ title: 'Month 1' })
    );
  });

  it('links milestone instances only into chapters that contain expected dates', async () => {
    chapterRepo.archivePregnancyChapters.mockResolvedValue(0);
    chapterRepo.getAll.mockResolvedValue([]);
    chapterRepo.archive.mockResolvedValue(true);
    chapterRepo.create.mockImplementation(async (input) => ({
      id: `ch-${input.title.replace(/\s+/g, '-')}`,
      babyId: input.babyId,
      title: input.title,
      startDate: input.startDate,
      endDate: input.endDate,
      description: input.description,
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    }));

    mockedGetMilestoneTemplates.mockReturnValue([
      {
        id: 'm1',
        label: 'Mock Milestone In Month 1',
        category: 'growth',
        ageWeeksMin: 0,
        ageWeeksMax: 1,
      },
      {
        id: 'm2',
        label: 'Ignored Milestone',
        category: 'growth',
        ageWeeksMin: 1,
        ageWeeksMax: 2,
      },
    ]);

    mockedGetExpectedDate.mockImplementation((_profile, template) => {
      if (template.id === 'm1') return '2026-01-10T00:00:00.000Z';
      return null;
    });

    milestoneRepo.createInstance.mockResolvedValue({
      id: 'inst-1',
      babyId: 'baby-1',
      milestoneTemplateId: 'm1',
      chapterId: 'ch-Month-1',
      expectedDate: '2026-01-10T00:00:00.000Z',
      status: 'pending',
      createdAt: '2026-01-01T00:00:00.000Z',
      updatedAt: '2026-01-01T00:00:00.000Z',
    });

    await autoGenerateTimeline(
      makeProfile({ birthdate: '2026-01-01T00:00:00.000Z' })
    );

    expect(milestoneRepo.createInstance).toHaveBeenCalledTimes(1);
    expect(milestoneRepo.createInstance).toHaveBeenCalledWith(
      'baby-1',
      'm1',
      '2026-01-10T00:00:00.000Z',
      'ch-Month-1'
    );
  });
});
