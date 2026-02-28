import { rebaseBornTimelineDates } from '../src/utils/rebaseBornTimeline';
import { getDatabase, getTimestamp } from '../src/db/database';
import { getMilestoneTemplateById } from '../src/constants/milestoneTemplates';
import { getExpectedDate } from '../src/utils/milestones';

jest.mock('../src/db/database', () => ({
  getDatabase: jest.fn(),
  getTimestamp: jest.fn(),
}));

jest.mock('../src/constants/milestoneTemplates', () => ({
  getMilestoneTemplateById: jest.fn(),
}));

jest.mock('../src/utils/milestones', () => ({
  getExpectedDate: jest.fn(),
}));

const mockedGetDatabase = getDatabase as jest.MockedFunction<typeof getDatabase>;
const mockedGetTimestamp = getTimestamp as jest.MockedFunction<typeof getTimestamp>;
const mockedGetMilestoneTemplateById = getMilestoneTemplateById as jest.MockedFunction<
  typeof getMilestoneTemplateById
>;
const mockedGetExpectedDate = getExpectedDate as jest.MockedFunction<typeof getExpectedDate>;

type DbMock = {
  execAsync: jest.Mock;
  getAllAsync: jest.Mock;
  runAsync: jest.Mock;
};

function makeDbMock(): DbMock {
  return {
    execAsync: jest.fn(),
    getAllAsync: jest.fn(),
    runAsync: jest.fn(),
  };
}

describe('rebase born timeline flow', () => {
  beforeEach(() => {
    jest.clearAllMocks();
    mockedGetTimestamp.mockReturnValue('2026-02-27T12:00:00.000Z');
  });

  it('commits with no-op when there are no chapters to rebase', async () => {
    const db = makeDbMock();
    db.getAllAsync.mockResolvedValueOnce([]);
    mockedGetDatabase.mockResolvedValue(db as any);

    const result = await rebaseBornTimelineDates('baby-1', '2026-01-01T00:00:00.000Z');

    expect(result).toEqual({ updatedChapters: 0, updatedMilestones: 0 });
    expect(db.execAsync).toHaveBeenNthCalledWith(1, 'BEGIN TRANSACTION');
    expect(db.execAsync).toHaveBeenLastCalledWith('COMMIT');
    expect(db.runAsync).not.toHaveBeenCalled();
  });

  it('updates matched template chapters and remaps milestone expected dates', async () => {
    const db = makeDbMock();
    db.getAllAsync
      .mockResolvedValueOnce([
        {
          id: 'ch-1',
          title: 'Month 1',
          start_date: '2025-12-01T00:00:00.000Z',
          end_date: '2025-12-29T00:00:00.000Z',
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'mi-1',
          milestone_template_id: 'milestone_1_month',
          expected_date: '2025-12-20T00:00:00.000Z',
          chapter_id: null,
        },
      ]);
    mockedGetDatabase.mockResolvedValue(db as any);

    mockedGetMilestoneTemplateById.mockReturnValue({
      id: 'milestone_1_month',
      label: 'One Month',
      category: 'growth',
      ageWeeksMin: 3,
      ageWeeksMax: 5,
    });
    mockedGetExpectedDate.mockReturnValue('2026-01-20T00:00:00.000Z');

    const result = await rebaseBornTimelineDates('baby-1', '2026-01-01T00:00:00.000Z');

    expect(result).toEqual({ updatedChapters: 1, updatedMilestones: 1 });
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE chapters'),
      expect.arrayContaining([
        expect.stringContaining('2026-'),
        expect.stringContaining('2026-'),
        '2026-02-27T12:00:00.000Z',
        'ch-1',
      ])
    );
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE milestone_instances'),
      [
        '2026-01-20T00:00:00.000Z',
        'ch-1',
        '2026-02-27T12:00:00.000Z',
        'mi-1',
      ]
    );
    expect(db.execAsync).toHaveBeenLastCalledWith('COMMIT');
  });

  it('uses fallback shift when timeline chapters are custom-renamed', async () => {
    const db = makeDbMock();
    db.getAllAsync
      .mockResolvedValueOnce([
        {
          id: 'custom-1',
          title: 'Our Story',
          start_date: '2026-01-01T00:00:00.000Z',
          end_date: '2026-01-08T00:00:00.000Z',
        },
      ])
      .mockResolvedValueOnce([
        {
          id: 'mi-2',
          milestone_template_id: 'milestone_1_month',
          expected_date: '2026-01-05T00:00:00.000Z',
          chapter_id: null,
        },
      ]);
    mockedGetDatabase.mockResolvedValue(db as any);

    mockedGetMilestoneTemplateById.mockReturnValue({
      id: 'milestone_1_month',
      label: 'One Month',
      category: 'growth',
      ageWeeksMin: 3,
      ageWeeksMax: 5,
    });
    mockedGetExpectedDate.mockReturnValue('2026-01-09T00:00:00.000Z');

    const result = await rebaseBornTimelineDates(
      'baby-1',
      '2026-01-08T00:00:00.000Z',
      '2026-01-01T00:00:00.000Z'
    );

    expect(result).toEqual({ updatedChapters: 1, updatedMilestones: 1 });
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE chapters'),
      [
        '2026-01-08T00:00:00.000Z',
        '2026-01-15T00:00:00.000Z',
        '2026-02-27T12:00:00.000Z',
        'custom-1',
      ]
    );
    expect(db.runAsync).toHaveBeenCalledWith(
      expect.stringContaining('UPDATE milestone_instances'),
      [
        '2026-01-09T00:00:00.000Z',
        'custom-1',
        '2026-02-27T12:00:00.000Z',
        'mi-2',
      ]
    );
  });

  it('rolls back transaction if any query fails', async () => {
    const db = makeDbMock();
    db.getAllAsync.mockRejectedValueOnce(new Error('boom'));
    mockedGetDatabase.mockResolvedValue(db as any);

    await expect(
      rebaseBornTimelineDates('baby-1', '2026-01-01T00:00:00.000Z')
    ).rejects.toThrow('boom');

    expect(db.execAsync).toHaveBeenNthCalledWith(1, 'BEGIN TRANSACTION');
    expect(db.execAsync).toHaveBeenLastCalledWith('ROLLBACK');
  });
});
