import { BabyProfile, MilestoneTemplate } from '../types';
import { BORN_MODE_MILESTONES, PREGNANCY_MODE_MILESTONES, getMilestoneTemplateById } from '../constants/milestoneTemplates';

/**
 * Calculate age in weeks from birth date to today
 */
export function calculateAgeInWeeks(birthDate: string): number {
  const birth = new Date(birthDate);
  const today = new Date();
  const diffMs = today.getTime() - birth.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  return Math.floor(diffDays / 7);
}

/**
 * Calculate gestation weeks from EDD
 * Assumes standard 40-week pregnancy, working backwards from EDD
 */
export function calculateGestationWeeks(edd: string): number {
  const dueDate = new Date(edd);
  const today = new Date();

  // If past due date, return 40+ weeks
  if (today > dueDate) {
    const diffMs = today.getTime() - new Date(edd).getTime();
    const diffDays = diffMs / (1000 * 60 * 60 * 24);
    return 40 + Math.floor(diffDays / 7);
  }

  // Calculate weeks remaining until due date
  const diffMs = dueDate.getTime() - today.getTime();
  const diffDays = diffMs / (1000 * 60 * 60 * 24);
  const weeksRemaining = Math.ceil(diffDays / 7);

  // 40 weeks total - weeks remaining
  return Math.max(0, 40 - weeksRemaining);
}

/**
 * Get applicable milestone templates based on baby profile and current age/gestation
 */
export function getApplicableTemplates(babyProfile: BabyProfile): MilestoneTemplate[] {
  const templates = babyProfile.mode === 'born' ? BORN_MODE_MILESTONES : PREGNANCY_MODE_MILESTONES;

  if (babyProfile.mode === 'born' && babyProfile.birthdate) {
    const ageWeeks = calculateAgeInWeeks(babyProfile.birthdate);
    // Return all milestones that could apply (not just past ones)
    return templates;
  }

  if (babyProfile.mode === 'pregnant' && babyProfile.edd) {
    const gestationWeeks = calculateGestationWeeks(babyProfile.edd);
    // Return all pregnancy milestones (show all possible ones)
    return templates;
  }

  return templates;
}

/**
 * Get expected date for a milestone based on baby profile and template
 */
export function getExpectedDate(babyProfile: BabyProfile, template: MilestoneTemplate): string | null {
  if (babyProfile.mode === 'born' && babyProfile.birthdate && template.ageWeeksMin !== undefined) {
    const birth = new Date(babyProfile.birthdate);
    // Use midpoint of age window for expected date
    const weeksToAdd = Math.round((template.ageWeeksMin + (template.ageWeeksMax || template.ageWeeksMin)) / 2);
    const expectedDate = new Date(birth);
    expectedDate.setDate(expectedDate.getDate() + weeksToAdd * 7);
    return expectedDate.toISOString();
  }

  if (babyProfile.mode === 'pregnant' && babyProfile.edd && template.gestationWeeksMin !== undefined) {
    const edd = new Date(babyProfile.edd);
    // Standard pregnancy is 40 weeks, work backwards
    const weeksBeforeDue = 40 - (template.gestationWeeksMin || 40);
    const expectedDate = new Date(edd);
    expectedDate.setDate(expectedDate.getDate() - weeksBeforeDue * 7);
    return expectedDate.toISOString();
  }

  return null;
}

/**
 * Get applicable milestones for a specific chapter date range
 * Used when generating milestones for a newly created chapter
 */
export function getMilestonesForChapter(
  babyProfile: BabyProfile,
  chapterStartDate: string,
  chapterEndDate?: string
): MilestoneTemplate[] {
  const applicableTemplates = getApplicableTemplates(babyProfile);

  return applicableTemplates.filter((template) => {
    const expectedDate = getExpectedDate(babyProfile, template);
    if (!expectedDate) return false;

    const expected = new Date(expectedDate).getTime();
    const chapterStart = new Date(chapterStartDate).getTime();
    const chapterEnd = chapterEndDate ? new Date(chapterEndDate).getTime() : new Date().getTime();

    // Include milestone if expected date falls within chapter date range
    return expected >= chapterStart && expected <= chapterEnd;
  });
}

/**
 * Get the template by ID (convenience wrapper)
 */
export function getTemplateById(templateId: string): MilestoneTemplate | null {
  return getMilestoneTemplateById(templateId);
}

/**
 * Format date for display
 */
export function formatMilestoneDate(dateString: string, locale: string = 'en-US'): string {
  try {
    const date = new Date(dateString);
    return date.toLocaleDateString(locale, {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    });
  } catch {
    return dateString;
  }
}

/**
 * Check if a milestone is in the past
 */
export function isMilestoneInPast(expectedDate: string): boolean {
  const expected = new Date(expectedDate);
  const today = new Date();
  today.setHours(0, 0, 0, 0);
  return expected < today;
}

/**
 * Check if a milestone is today
 */
export function isMilestoneToday(expectedDate: string): boolean {
  const expected = new Date(expectedDate);
  const today = new Date();
  return (
    expected.getFullYear() === today.getFullYear() &&
    expected.getMonth() === today.getMonth() &&
    expected.getDate() === today.getDate()
  );
}

/**
 * Get days until milestone (negative if in past)
 */
export function getDaysUntilMilestone(expectedDate: string): number {
  const expected = new Date(expectedDate);
  const today = new Date();
  const diffMs = expected.getTime() - today.getTime();
  const diffDays = Math.ceil(diffMs / (1000 * 60 * 60 * 24));
  return diffDays;
}
