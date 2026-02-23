import { BabyProfile } from '../types';
import { TranslationParams } from '../localization';
import { calculateGestationWeeks } from './milestones';

type TFunction = (key: string, params?: TranslationParams) => string;

/**
 * Format baby age into human-readable string using translations
 * Examples: "5 days", "6 weeks", "8 months", "2 years, 3 months"
 */
export function formatBabyAge(birthdate: string, t: TFunction): string {
  const birth = new Date(birthdate);
  const today = new Date();

  // Calculate total days
  const diffMs = today.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 0-13 days: show in days
  if (diffDays <= 13) {
    return diffDays === 1
      ? t('age.day', { count: 1 })
      : t('age.days', { count: diffDays });
  }

  // Calculate weeks
  const weeks = Math.floor(diffDays / 7);

  // 14 days - 8 weeks (14-56 days): show in weeks
  if (weeks < 8) {
    return weeks === 1
      ? t('age.week', { count: 1 })
      : t('age.weeks', { count: weeks });
  }

  // For 8 weeks and beyond, calculate months using date arithmetic
  let monthCount = 0;
  let currentDate = new Date(birth);

  while (currentDate <= today) {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);

    if (nextMonth <= today) {
      monthCount++;
      currentDate = nextMonth;
    } else {
      break;
    }
  }

  // 8 weeks - 24 months: show in months
  if (monthCount < 24) {
    return monthCount === 1
      ? t('age.month', { count: 1 })
      : t('age.months', { count: monthCount });
  }

  // 24+ months: show in years and months
  const years = Math.floor(monthCount / 12);
  const remainingMonths = monthCount % 12;

  const yearStr = years === 1
    ? t('age.year', { count: 1 })
    : t('age.years', { count: years });

  if (remainingMonths > 0) {
    const monthStr = remainingMonths === 1
      ? t('age.month', { count: 1 })
      : t('age.months', { count: remainingMonths });
    return t('age.yearAndMonth', { years: yearStr, months: monthStr });
  }

  return yearStr;
}

/**
 * Format pregnancy age into human-readable string using translations
 * Examples: "Baby arriving in 8 weeks", "Baby arriving in 2 weeks"
 */
export function formatPregnancyAge(edd: string, t: TFunction): string {
  const dueDate = new Date(edd);
  const today = new Date();

  // If past due date
  if (today > dueDate) {
    const diffMs = today.getTime() - dueDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);

    // Baby is here (or overdue by less than a few days)
    if (weeks === 0 && diffDays < 7) {
      return t('age.babyIsHere');
    }

    // Overdue
    const overdueDays = diffDays % 7;
    if (weeks === 0) {
      return overdueDays === 1
        ? t('age.bornDayAgo', { count: 1 })
        : t('age.bornDaysAgo', { count: overdueDays });
    }
    return weeks === 1
      ? t('age.bornWeekAgo', { count: 1 })
      : t('age.bornWeeksAgo', { count: weeks });
  }

  // Calculate weeks until due date
  const diffMs = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const weeksRemaining = Math.ceil(diffDays / 7);

  return weeksRemaining === 1
    ? t('age.arrivingInWeek', { count: 1 })
    : t('age.arrivingInWeeks', { count: weeksRemaining });
}

/**
 * Format baby profile data for header display using translations
 * Handles both born and pregnant modes
 */
export function formatHeaderTitle(profile: BabyProfile | null | undefined, t?: TFunction): string {
  if (!profile) {
    return '';
  }

  // Born mode
  if (profile.mode === 'born') {
    const name = profile.name?.trim() || '';

    if (!profile.birthdate) {
      return name;
    }

    const age = t ? formatBabyAge(profile.birthdate, t) : formatBabyAgeFallback(profile.birthdate);

    if (!name) {
      return age;
    }

    return t
      ? t('age.nameIsAge', { name, age })
      : `${name} is ${age}`;
  }

  // Pregnant mode
  if (profile.mode === 'pregnant') {
    if (!profile.edd) {
      return profile.name?.trim() || '';
    }

    return t ? formatPregnancyAge(profile.edd, t) : formatPregnancyAgeFallback(profile.edd);
  }

  return '';
}

/**
 * Format current pregnancy week with contextual milestone info using translations
 */
export function formatPregnancyWeekWithContext(edd: string, t?: TFunction): string {
  const currentWeek = calculateGestationWeeks(edd);

  let contextKey = '';
  if (currentWeek === 12) {
    contextKey = 'age.weekContext12';
  } else if (currentWeek === 20) {
    contextKey = 'age.weekContext20';
  } else if (currentWeek === 28) {
    contextKey = 'age.weekContext28';
  } else if (currentWeek === 36) {
    contextKey = 'age.weekContext36';
  } else if (currentWeek === 40) {
    contextKey = 'age.weekContext40';
  } else if (currentWeek > 40) {
    contextKey = 'age.weekContextOverdue';
  }

  if (t) {
    if (contextKey) {
      return t('age.pregnancyWeekWithContext', { week: currentWeek, context: t(contextKey) });
    }
    return t('age.pregnancyWeek', { week: currentWeek });
  }

  // Fallback without translations
  if (contextKey) {
    const contexts: Record<string, string> = {
      'age.weekContext12': 'First trimester complete',
      'age.weekContext20': 'Halfway there',
      'age.weekContext28': 'Third trimester begins',
      'age.weekContext36': 'Full term',
      'age.weekContext40': 'Due date week',
      'age.weekContextOverdue': 'Any day now',
    };
    return `Week ${currentWeek} · ${contexts[contextKey]}`;
  }
  return `Week ${currentWeek}`;
}

// Fallback functions (no translations) for backward compatibility
function formatBabyAgeFallback(birthdate: string): string {
  const birth = new Date(birthdate);
  const today = new Date();
  const diffMs = today.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  if (diffDays <= 13) {
    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  }

  const weeks = Math.floor(diffDays / 7);
  if (weeks < 8) {
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  }

  let monthCount = 0;
  let currentDate = new Date(birth);
  while (currentDate <= today) {
    const nextMonth = new Date(currentDate);
    nextMonth.setMonth(nextMonth.getMonth() + 1);
    if (nextMonth <= today) {
      monthCount++;
      currentDate = nextMonth;
    } else {
      break;
    }
  }

  if (monthCount < 24) {
    return monthCount === 1 ? '1 month' : `${monthCount} months`;
  }

  const years = Math.floor(monthCount / 12);
  const remainingMonths = monthCount % 12;
  let result = years === 1 ? '1 year' : `${years} years`;
  if (remainingMonths > 0) {
    result += remainingMonths === 1 ? ', 1 month' : `, ${remainingMonths} months`;
  }
  return result;
}

function formatPregnancyAgeFallback(edd: string): string {
  const dueDate = new Date(edd);
  const today = new Date();
  if (today > dueDate) {
    const diffMs = today.getTime() - dueDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);
    if (weeks === 0 && diffDays < 7) return 'Baby is here!';
    const overdueDays = diffDays % 7;
    if (weeks === 0) return overdueDays === 1 ? 'Born 1 day ago' : `Born ${overdueDays} days ago`;
    return weeks === 1 ? 'Born 1 week ago' : `Born ${weeks} weeks ago`;
  }
  const diffMs = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const weeksRemaining = Math.ceil(diffDays / 7);
  return weeksRemaining === 1 ? 'Baby arriving in 1 week' : `Baby arriving in ${weeksRemaining} weeks`;
}
