import { BabyProfile } from '../types';
import { calculateAgeInWeeks, calculateGestationWeeks } from './milestones';

/**
 * Format baby age into human-readable string
 * Examples: "5 days", "6 weeks", "8 months", "2 years, 3 months"
 */
export function formatBabyAge(birthdate: string): string {
  const birth = new Date(birthdate);
  const today = new Date();

  // Calculate total days
  const diffMs = today.getTime() - birth.getTime();
  const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));

  // 0-13 days: show in days
  if (diffDays <= 13) {
    return diffDays === 1 ? '1 day' : `${diffDays} days`;
  }

  // Calculate weeks
  const weeks = Math.floor(diffDays / 7);

  // 14 days - 8 weeks (14-56 days): show in weeks
  if (weeks < 8) {
    return weeks === 1 ? '1 week' : `${weeks} weeks`;
  }

  // For 8 weeks and beyond, calculate months using date arithmetic
  // This properly handles varying month lengths
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
    return monthCount === 1 ? '1 month' : `${monthCount} months`;
  }

  // 24+ months: show in years and months
  const years = Math.floor(monthCount / 12);
  const remainingMonths = monthCount % 12;

  let result = years === 1 ? '1 year' : `${years} years`;

  if (remainingMonths > 0) {
    result += remainingMonths === 1 ? ', 1 month' : `, ${remainingMonths} months`;
  }

  return result;
}

/**
 * Format pregnancy age into human-readable string
 * Examples: "Baby arriving in 8 weeks", "Baby arriving in 2 weeks"
 */
export function formatPregnancyAge(edd: string): string {
  const dueDate = new Date(edd);
  const today = new Date();

  // If past due date
  if (today > dueDate) {
    const diffMs = today.getTime() - dueDate.getTime();
    const diffDays = Math.floor(diffMs / (1000 * 60 * 60 * 24));
    const weeks = Math.floor(diffDays / 7);

    // Baby is here (or overdue by less than a few days)
    if (weeks === 0 && diffDays < 7) {
      return 'Baby is here!';
    }

    // Overdue
    const overdueDays = diffDays % 7;
    if (weeks === 0) {
      return overdueDays === 1 ? 'Born 1 day ago' : `Born ${overdueDays} days ago`;
    }
    return weeks === 1 ? 'Born 1 week ago' : `Born ${weeks} weeks ago`;
  }

  // Calculate weeks until due date
  const diffMs = dueDate.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  const weeksRemaining = Math.ceil(diffDays / 7);

  return weeksRemaining === 1 ? 'Baby arriving in 1 week' : `Baby arriving in ${weeksRemaining} weeks`;
}

/**
 * Format baby profile data for header display
 * Handles both born and pregnant modes
 * Examples:
 * - Born mode: "Elisa is 3 months"
 * - Pregnant mode: "Baby arriving in 8 weeks"
 * - No birthdate: "Elisa"
 * - No name: ""
 */
export function formatHeaderTitle(profile: BabyProfile | null | undefined): string {
  if (!profile) {
    return '';
  }

  // Born mode
  if (profile.mode === 'born') {
    const name = profile.name?.trim() || '';

    if (!profile.birthdate) {
      return name; // Just return name if no birthdate
    }

    const age = formatBabyAge(profile.birthdate);

    if (!name) {
      return age; // Just return age if no name (edge case)
    }

    return `${name} is ${age}`;
  }

  // Pregnant mode
  if (profile.mode === 'pregnant') {
    if (!profile.edd) {
      // Return name if no EDD
      return profile.name?.trim() || '';
    }

    return formatPregnancyAge(profile.edd);
  }

  return '';
}

/**
 * Format current pregnancy week with contextual milestone info
 * Examples:
 * - "Week 12 · First trimester complete"
 * - "Week 20 · Halfway there"
 * - "Week 28 · Third trimester begins"
 * - "Week 36 · Full term"
 * - "Week 40 · Due date week"
 * - "Week 41 · Any day now"
 */
export function formatPregnancyWeekWithContext(edd: string): string {
  const currentWeek = calculateGestationWeeks(edd);

  let context = '';
  if (currentWeek === 12) {
    context = ' · First trimester complete';
  } else if (currentWeek === 20) {
    context = ' · Halfway there';
  } else if (currentWeek === 28) {
    context = ' · Third trimester begins';
  } else if (currentWeek === 36) {
    context = ' · Full term';
  } else if (currentWeek === 40) {
    context = ' · Due date week';
  } else if (currentWeek > 40) {
    context = ' · Any day now';
  }

  return `Week ${currentWeek}${context}`;
}
