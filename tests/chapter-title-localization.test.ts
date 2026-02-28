import { getLocalizedChapterTitle } from '../src/constants/chapterTemplates';

describe('getLocalizedChapterTitle', () => {
  const t = (key: string, params?: Record<string, string | number>): string => {
    if (key === 'home.weekLabel') return `W${params?.week}`;
    if (key === 'home.monthLabel') return `${params?.count}. Ay`;
    if (key === 'home.yearLabel') return `${params?.count}. Yıl`;
    return key;
  };

  it('localizes canonical english titles', () => {
    expect(getLocalizedChapterTitle('Week 22', t)).toBe('W22');
    expect(getLocalizedChapterTitle('Month 2', t)).toBe('2. Ay');
    expect(getLocalizedChapterTitle('Year 3', t)).toBe('3. Yıl');
  });

  it('localizes legacy Turkish title forms to locale output', () => {
    expect(getLocalizedChapterTitle('Ay 4', t)).toBe('4. Ay');
    expect(getLocalizedChapterTitle('Yıl 2', t)).toBe('2. Yıl');
    expect(getLocalizedChapterTitle('Yil 5', t)).toBe('5. Yıl');
  });

  it('returns raw title when no known pattern matches', () => {
    expect(getLocalizedChapterTitle('Trimester 2', t)).toBe('Trimester 2');
  });

  it('returns raw title if translation key is missing', () => {
    const missingT = (key: string) => key;
    expect(getLocalizedChapterTitle('Month 8', missingT)).toBe('Month 8');
  });
});
