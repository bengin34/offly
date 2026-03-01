import type { ChapterPlaceholder } from './chapterTemplates';
type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

export interface PregnancyChapterTemplate {
  id: string;
  title: string;
  description: string;
  /** Minimum gestation week */
  gestationWeeksMin: number;
  /** Maximum gestation week */
  gestationWeeksMax: number;
  /** Order in the timeline */
  order: number;
  /** Marks monthly milestone weeks (4, 8, 12, 16, 20, 24, 28, 32, 36, 40) */
  isMonthlyMilestone?: boolean;
}

/**
 * Get description for monthly milestone weeks
 */
function getMonthlyDescription(week: number): string {
  const monthlyDescriptions: Record<number, string> = {
    4: 'One month pregnant',
    8: 'Two months pregnant',
    12: 'Three months - first trimester complete',
    16: 'Four months pregnant',
    20: 'Five months - halfway there',
    24: 'Six months pregnant',
    28: 'Seven months - third trimester begins',
    32: 'Eight months pregnant',
    36: 'Nine months - full term',
    40: 'Ten months - due date week',
  };
  return monthlyDescriptions[week] || '';
}

/**
 * Generate 42 weekly pregnancy chapter templates
 */
function generateWeeklyTemplates(): PregnancyChapterTemplate[] {
  const templates: PregnancyChapterTemplate[] = [];
  const monthlyMilestoneWeeks = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];

  for (let week = 1; week <= 42; week++) {
    const isMonthly = monthlyMilestoneWeeks.includes(week);
    templates.push({
      id: `pregnancy_week_${week}`,
      title: `Week ${week}`,
      description: isMonthly ? getMonthlyDescription(week) : '',
      gestationWeeksMin: week,
      gestationWeeksMax: week,
      order: week,
      isMonthlyMilestone: isMonthly,
    });
  }

  return templates;
}

/**
 * Pre-defined chapter templates for pregnancy mode.
 * 42 weekly chapters covering the full pregnancy journey.
 */
export const PREGNANCY_CHAPTER_TEMPLATES: PregnancyChapterTemplate[] = generateWeeklyTemplates();

/**
 * Visual placeholder config for pregnancy chapter cards.
 */
const PREGNANCY_CHAPTER_PLACEHOLDERS: Record<string, ChapterPlaceholder> = {
  // Default placeholder for regular weeks
  default: { icon: 'calendar-outline', bgColor: '#E8E8F0' },
  // Monthly milestone weeks get special star icon and pink highlight
  monthly: { icon: 'star-outline', bgColor: '#F0C0D8' },
};

/** Get the placeholder icon + color for a pregnancy chapter by title. */
export function getPregnancyChapterPlaceholder(title: string): ChapterPlaceholder {
  // Check if this is a monthly milestone week
  const template = PREGNANCY_CHAPTER_TEMPLATES.find((t) => t.title === title);

  if (template?.isMonthlyMilestone) {
    return PREGNANCY_CHAPTER_PLACEHOLDERS.monthly;
  }

  return PREGNANCY_CHAPTER_PLACEHOLDERS.default;
}

/**
 * Get pregnancy chapter template by title
 */
export function getPregnancyChapterTemplateByTitle(
  title: string
): PregnancyChapterTemplate | undefined {
  return PREGNANCY_CHAPTER_TEMPLATES.find((t) => t.title === title);
}

/**
 * Localize auto-generated pregnancy chapter descriptions.
 * User-edited/custom descriptions are returned as-is.
 */
export function getLocalizedPregnancyChapterDescription(
  chapterTitle: string,
  chapterDescription: string | undefined,
  t: TranslateFn
): string | undefined {
  if (!chapterDescription) return chapterDescription;

  const weekMatch = chapterTitle.match(/(\d+)/);
  if (!weekMatch) return chapterDescription;

  const week = Number.parseInt(weekMatch[1], 10);
  if (!Number.isFinite(week)) return chapterDescription;

  const template = PREGNANCY_CHAPTER_TEMPLATES.find(
    (item) => item.gestationWeeksMin === week
  );
  if (!template || template.description !== chapterDescription) {
    return chapterDescription;
  }

  const keyByWeek: Record<number, string> = {
    4: 'chapterDetail.pregnancyAutoDescription4',
    8: 'chapterDetail.pregnancyAutoDescription8',
    12: 'chapterDetail.pregnancyAutoDescription12',
    16: 'chapterDetail.pregnancyAutoDescription16',
    20: 'chapterDetail.pregnancyAutoDescription20',
    24: 'chapterDetail.pregnancyAutoDescription24',
    28: 'chapterDetail.pregnancyAutoDescription28',
    32: 'chapterDetail.pregnancyAutoDescription32',
    36: 'chapterDetail.pregnancyAutoDescription36',
    40: 'chapterDetail.pregnancyAutoDescription40',
  };

  const key = keyByWeek[week];
  if (!key) return chapterDescription;

  const translated = t(key);
  return translated === key ? chapterDescription : translated;
}

/**
 * Calculate pregnancy chapter start/end dates from EDD.
 *
 * Pregnancy is calculated as 40 weeks (280 days) from conception.
 * We work backwards from EDD to determine weekly dates.
 */
export function getPregnancyChapterDates(
  edd: string,
  template: PregnancyChapterTemplate
): { startDate: string; endDate: string } {
  const dueDate = new Date(edd);

  // Calculate conception date (40 weeks before EDD = 280 days)
  const conceptionDate = new Date(dueDate);
  conceptionDate.setDate(conceptionDate.getDate() - 40 * 7);

  // Calculate start date for this week
  const start = new Date(conceptionDate);
  start.setDate(start.getDate() + (template.gestationWeeksMin - 1) * 7);

  // Calculate end date for this week (7 days after start)
  const end = new Date(start);
  end.setDate(end.getDate() + 7);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}
