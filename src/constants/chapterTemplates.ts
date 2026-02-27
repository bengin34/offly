export interface ChapterTemplate {
  id: string;
  title: string;
  description: string;
  /** Start week offset from birth date */
  startWeek: number;
  /** End week offset from birth date */
  endWeek: number;
  /** Order in the timeline */
  order: number;
}

type TranslateFn = (key: string, params?: Record<string, string | number>) => string;

/**
 * Pre-defined chapter templates for born mode.
 * Monthly for the first year, yearly after that.
 */
export const BORN_CHAPTER_TEMPLATES: ChapterTemplate[] = [
  {
    id: 'chapter_month_1',
    title: 'Month 1',
    description: 'The first month of life',
    startWeek: 0,
    endWeek: 4,
    order: 1,
  },
  {
    id: 'chapter_month_2',
    title: 'Month 2',
    description: 'Discovering the world',
    startWeek: 4,
    endWeek: 8,
    order: 2,
  },
  {
    id: 'chapter_month_3',
    title: 'Month 3',
    description: 'Growing stronger every day',
    startWeek: 8,
    endWeek: 13,
    order: 3,
  },
  {
    id: 'chapter_month_4',
    title: 'Month 4',
    description: 'New expressions and sounds',
    startWeek: 13,
    endWeek: 17,
    order: 4,
  },
  {
    id: 'chapter_month_5',
    title: 'Month 5',
    description: 'Reaching and grabbing',
    startWeek: 17,
    endWeek: 22,
    order: 5,
  },
  {
    id: 'chapter_month_6',
    title: 'Month 6',
    description: 'Half a year already',
    startWeek: 22,
    endWeek: 26,
    order: 6,
  },
  {
    id: 'chapter_month_7',
    title: 'Month 7',
    description: 'Sitting up and exploring',
    startWeek: 26,
    endWeek: 30,
    order: 7,
  },
  {
    id: 'chapter_month_8',
    title: 'Month 8',
    description: 'On the move',
    startWeek: 30,
    endWeek: 35,
    order: 8,
  },
  {
    id: 'chapter_month_9',
    title: 'Month 9',
    description: 'Crawling and curiosity',
    startWeek: 35,
    endWeek: 39,
    order: 9,
  },
  {
    id: 'chapter_month_10',
    title: 'Month 10',
    description: 'Standing tall',
    startWeek: 39,
    endWeek: 43,
    order: 10,
  },
  {
    id: 'chapter_month_11',
    title: 'Month 11',
    description: 'Almost one year',
    startWeek: 43,
    endWeek: 48,
    order: 11,
  },
  {
    id: 'chapter_month_12',
    title: 'Month 12',
    description: 'First birthday celebrations',
    startWeek: 48,
    endWeek: 52,
    order: 12,
  },
  {
    id: 'chapter_year_2',
    title: 'Year 2',
    description: 'Toddler adventures begin',
    startWeek: 52,
    endWeek: 104,
    order: 13,
  },
  {
    id: 'chapter_year_3',
    title: 'Year 3',
    description: 'Finding their voice',
    startWeek: 104,
    endWeek: 156,
    order: 14,
  },
  {
    id: 'chapter_year_4',
    title: 'Year 4',
    description: 'Imagination takes flight',
    startWeek: 156,
    endWeek: 208,
    order: 15,
  },
  {
    id: 'chapter_year_5',
    title: 'Year 5',
    description: 'Ready for the world',
    startWeek: 208,
    endWeek: 260,
    order: 16,
  },
];

/**
 * Visual placeholder config for chapter cards (icon + background color).
 * Keyed by chapter title since templates may not have IDs stored on chapters.
 */
export interface ChapterPlaceholder {
  icon: string; // Ionicons name
  bgColor: string; // Pastel background
}

const CHAPTER_PLACEHOLDERS: Record<string, ChapterPlaceholder> = {
  'Month 1': { icon: 'heart-outline', bgColor: '#F0C0D8' },
  'Month 2': { icon: 'eye-outline', bgColor: '#B8D8E8' },
  'Month 3': { icon: 'body-outline', bgColor: '#A3D4B8' },
  'Month 4': { icon: 'musical-notes-outline', bgColor: '#F5D590' },
  'Month 5': { icon: 'hand-left-outline', bgColor: '#D4B8E8' },
  'Month 6': { icon: 'ribbon-outline', bgColor: '#F0C0D8' },
  'Month 7': { icon: 'happy-outline', bgColor: '#B8D8E8' },
  'Month 8': { icon: 'walk-outline', bgColor: '#A3D4B8' },
  'Month 9': { icon: 'footsteps-outline', bgColor: '#F5D590' },
  'Month 10': { icon: 'trending-up-outline', bgColor: '#D4B8E8' },
  'Month 11': { icon: 'time-outline', bgColor: '#F0C0D8' },
  'Month 12': { icon: 'gift-outline', bgColor: '#B8D8E8' },
  'Year 2': { icon: 'footsteps-outline', bgColor: '#A3D4B8' },
  'Year 3': { icon: 'chatbubbles-outline', bgColor: '#F5D590' },
  'Year 4': { icon: 'color-palette-outline', bgColor: '#D4B8E8' },
  'Year 5': { icon: 'school-outline', bgColor: '#F0C0D8' },
};

/** Get the placeholder icon + color for a chapter by title. */
export function getChapterPlaceholder(title: string): ChapterPlaceholder {
  return CHAPTER_PLACEHOLDERS[title] ?? { icon: 'book-outline', bgColor: '#E8E4E0' };
}

/**
 * Calculate chapter start/end dates from a birth date.
 */
export function getChapterDates(
  birthDate: string,
  template: ChapterTemplate
): { startDate: string; endDate: string } {
  const birth = new Date(birthDate);

  const start = new Date(birth);
  start.setDate(start.getDate() + template.startWeek * 7);

  const end = new Date(birth);
  end.setDate(end.getDate() + template.endWeek * 7);

  return {
    startDate: start.toISOString(),
    endDate: end.toISOString(),
  };
}

/** Localize canonical born chapter titles like "Month 2" / "Year 2". */
export function getLocalizedChapterTitle(rawTitle: string, t: TranslateFn): string {
  const weekMatch = rawTitle.match(/^Week\s+(\d+)$/i);
  if (weekMatch) {
    const week = Number.parseInt(weekMatch[1], 10);
    if (Number.isFinite(week)) {
      const translated = t('home.weekLabel', { week });
      return translated === 'home.weekLabel' ? rawTitle : translated;
    }
  }

  const monthMatch = rawTitle.match(/^Month\s+(\d+)$/i);
  if (monthMatch) {
    const count = Number.parseInt(monthMatch[1], 10);
    if (Number.isFinite(count)) {
      const translated = t('home.monthLabel', { count });
      return translated === 'home.monthLabel' ? rawTitle : translated;
    }
  }

  const yearMatch = rawTitle.match(/^Year\s+(\d+)$/i);
  if (yearMatch) {
    const count = Number.parseInt(yearMatch[1], 10);
    if (Number.isFinite(count)) {
      const translated = t('home.yearLabel', { count });
      return translated === 'home.yearLabel' ? rawTitle : translated;
    }
  }

  return rawTitle;
}

/**
 * Localize default born chapter descriptions if they were auto-generated from templates.
 * User-edited/custom descriptions are returned as-is.
 */
export function getLocalizedChapterDescription(
  chapterTitle: string,
  chapterDescription: string | undefined,
  t: TranslateFn
): string | undefined {
  if (!chapterDescription) return chapterDescription;

  const template = BORN_CHAPTER_TEMPLATES.find((item) => item.title === chapterTitle);
  if (!template || template.description !== chapterDescription) {
    return chapterDescription;
  }

  const monthMatch = chapterTitle.match(/^Month\s+(\d+)$/i);
  if (monthMatch) {
    const translated = t('chapterDetail.autoDescriptionMonth');
    return translated === 'chapterDetail.autoDescriptionMonth' ? chapterDescription : translated;
  }

  const yearMatch = chapterTitle.match(/^Year\s+(\d+)$/i);
  if (yearMatch) {
    const translated = t('chapterDetail.autoDescriptionYear');
    return translated === 'chapterDetail.autoDescriptionYear' ? chapterDescription : translated;
  }

  return chapterDescription;
}
