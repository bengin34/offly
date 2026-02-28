import {
  PREGNANCY_CHAPTER_TEMPLATES,
  getPregnancyChapterPlaceholder,
  getPregnancyChapterTemplateByTitle,
  getPregnancyChapterDates,
} from '../src/constants/pregnancyChapterTemplates';

describe('pregnancy chapter template integrity', () => {
  it('contains exactly 42 unique weekly templates', () => {
    expect(PREGNANCY_CHAPTER_TEMPLATES).toHaveLength(42);

    const ids = new Set(PREGNANCY_CHAPTER_TEMPLATES.map((t) => t.id));
    const titles = new Set(PREGNANCY_CHAPTER_TEMPLATES.map((t) => t.title));
    const orders = new Set(PREGNANCY_CHAPTER_TEMPLATES.map((t) => t.order));

    expect(ids.size).toBe(42);
    expect(titles.size).toBe(42);
    expect(orders.size).toBe(42);
  });

  it('keeps week metadata aligned with title/order/index', () => {
    for (let week = 1; week <= 42; week++) {
      const template = PREGNANCY_CHAPTER_TEMPLATES[week - 1];
      expect(template.id).toBe(`pregnancy_week_${week}`);
      expect(template.title).toBe(`Week ${week}`);
      expect(template.gestationWeeksMin).toBe(week);
      expect(template.gestationWeeksMax).toBe(week);
      expect(template.order).toBe(week);
    }
  });

  it('marks only monthly milestone weeks as special placeholders', () => {
    const expectedMonthlyWeeks = [4, 8, 12, 16, 20, 24, 28, 32, 36, 40];

    const actualMonthlyWeeks = PREGNANCY_CHAPTER_TEMPLATES
      .filter((t) => t.isMonthlyMilestone)
      .map((t) => t.gestationWeeksMin);

    expect(actualMonthlyWeeks).toEqual(expectedMonthlyWeeks);

    expect(getPregnancyChapterPlaceholder('Week 20').icon).toBe('star-outline');
    expect(getPregnancyChapterPlaceholder('Week 21').icon).toBe('calendar-outline');
  });

  it('returns a template by title and computes contiguous weekly date ranges', () => {
    const week20 = getPregnancyChapterTemplateByTitle('Week 20');
    const week21 = getPregnancyChapterTemplateByTitle('Week 21');
    expect(week20).toBeTruthy();
    expect(week21).toBeTruthy();

    const edd = '2026-03-01T12:00:00.000Z';
    const range20 = getPregnancyChapterDates(edd, week20!);
    const range21 = getPregnancyChapterDates(edd, week21!);

    const start20 = new Date(range20.startDate).getTime();
    const end20 = new Date(range20.endDate).getTime();
    const start21 = new Date(range21.startDate).getTime();

    // Week ranges should be contiguous.
    expect(new Date(range20.endDate).toISOString()).toBe(new Date(range21.startDate).toISOString());

    // Each chapter should represent one week (7 days) even across DST.
    const daysInWeek20 = Math.round((end20 - start20) / (1000 * 60 * 60 * 24));
    expect(daysInWeek20).toBe(7);

    expect(start21).toBe(end20);
  });
});
