import {
  formatBabyAge,
  formatPregnancyAge,
  formatHeaderTitle,
  formatPregnancyWeekWithContext,
} from '../src/utils/ageFormatter';
import type { BabyProfile } from '../src/types';

const fixedNow = new Date('2026-02-27T12:00:00.000Z');

function shiftDays(base: Date, deltaDays: number): string {
  const d = new Date(base);
  d.setUTCDate(d.getUTCDate() + deltaDays);
  return d.toISOString();
}

const dict: Record<string, string> = {
  'age.day': '{count} day',
  'age.days': '{count} days',
  'age.week': '{count} week',
  'age.weeks': '{count} weeks',
  'age.month': '{count} month',
  'age.months': '{count} months',
  'age.year': '{count} year',
  'age.years': '{count} years',
  'age.yearAndMonth': '{years}, {months}',
  'age.babyIsHere': 'Baby is here!',
  'age.bornDayAgo': 'Born {count} day ago',
  'age.bornDaysAgo': 'Born {count} days ago',
  'age.bornWeekAgo': 'Born {count} week ago',
  'age.bornWeeksAgo': 'Born {count} weeks ago',
  'age.arrivingInWeek': 'Baby arriving in {count} week',
  'age.arrivingInWeeks': 'Baby arriving in {count} weeks',
  'age.nameIsAge': '{name} is {age}',
  'age.weekContext20': 'Halfway there',
  'age.pregnancyWeekWithContext': 'Week {week} · {context}',
  'age.pregnancyWeek': 'Week {week}',
};

const t = (key: string, params?: Record<string, string | number>): string => {
  const template = dict[key] ?? key;
  return template.replace(/\{(\w+)\}/g, (_, token) => String(params?.[token] ?? `{${token}}`));
};

function makeProfile(overrides: Partial<BabyProfile>): BabyProfile {
  return {
    id: 'baby-1',
    mode: 'born',
    isDefault: true,
    showArchivedChapters: true,
    createdAt: fixedNow.toISOString(),
    updatedAt: fixedNow.toISOString(),
    ...overrides,
  };
}

describe('age formatter regression', () => {
  beforeAll(() => {
    jest.useFakeTimers();
    jest.setSystemTime(fixedNow);
  });

  afterAll(() => {
    jest.useRealTimers();
  });

  it('handles day/week boundary for newborn age', () => {
    expect(formatBabyAge(shiftDays(fixedNow, -13), t)).toBe('13 days');
    expect(formatBabyAge(shiftDays(fixedNow, -14), t)).toBe('2 weeks');
  });

  it('formats pregnancy remaining/overdue states', () => {
    expect(formatPregnancyAge(shiftDays(fixedNow, 14), t)).toBe('Baby arriving in 2 weeks');
    expect(formatPregnancyAge(shiftDays(fixedNow, -3), t)).toBe('Baby is here!');
    expect(formatPregnancyAge(shiftDays(fixedNow, -10), t)).toBe('Born 1 week ago');
  });

  it('formats header title for born and pregnant profiles', () => {
    const born = makeProfile({
      mode: 'born',
      name: 'Elisa',
      birthdate: shiftDays(fixedNow, -14),
    });
    expect(formatHeaderTitle(born, t)).toBe('Elisa is 2 weeks');

    const pregnant = makeProfile({
      mode: 'pregnant',
      edd: shiftDays(fixedNow, 14),
    });
    expect(formatHeaderTitle(pregnant, t)).toBe('Baby arriving in 2 weeks');
  });

  it('adds pregnancy context for milestone weeks and plain text otherwise', () => {
    // 20 weeks remaining -> gestation week 20
    expect(formatPregnancyWeekWithContext(shiftDays(fixedNow, 140), t)).toBe(
      'Week 20 · Halfway there'
    );

    // 19 weeks remaining -> gestation week 21 (no special context)
    expect(formatPregnancyWeekWithContext(shiftDays(fixedNow, 133), t)).toBe('Week 21');
  });
});
