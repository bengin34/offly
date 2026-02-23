import { ChapterRepository, MilestoneRepository } from '../db/repositories';
import { BORN_CHAPTER_TEMPLATES, getChapterDates } from '../constants/chapterTemplates';
import { getMilestoneTemplates } from '../constants/milestoneTemplates';
import { getExpectedDate } from './milestones';
import type { BabyProfile, Chapter } from '../types';

/**
 * Auto-generate all chapters and milestones for a baby profile.
 * Called after onboarding when birthdate is set (born mode).
 *
 * Creates 16 chapters (Month 1-12, Year 2-5) and populates each
 * with the relevant milestone instances.
 */
/**
 * One-time cleanup: removes Week/Trimester chapters from born mode profiles
 * and deduplicates any repeated chapter titles.
 * Safe to call on every app launch — it's a no-op if already clean.
 */
export async function cleanupBornChapters(babyId: string): Promise<void> {
  // Archive pregnancy-mode chapters instead of deleting
  await ChapterRepository.archivePregnancyChapters(babyId);

  // Deduplicate born chapters by title (keep earliest, archive extras)
  const remaining = await ChapterRepository.getAll(babyId);
  const seen = new Set<string>();
  for (const chapter of remaining) {
    if (seen.has(chapter.title)) {
      await ChapterRepository.archive(chapter.id);
    } else {
      seen.add(chapter.title);
    }
  }
}

export async function autoGenerateTimeline(profile: BabyProfile): Promise<void> {
  if (!profile.birthdate) return;

  // Archive pregnancy-mode Week/Trimester chapters instead of deleting
  await ChapterRepository.archivePregnancyChapters(profile.id);

  // Deduplicate born chapters (keep first occurrence, archive extras)
  const afterCleanup = await ChapterRepository.getAll(profile.id);
  const seenTitles = new Set<string>();
  for (const chapter of afterCleanup) {
    if (seenTitles.has(chapter.title)) {
      await ChapterRepository.archive(chapter.id);
    } else {
      seenTitles.add(chapter.title);
    }
  }

  // Reload after full cleanup
  const existingBorn = await ChapterRepository.getAll(profile.id);
  const existingTitles = new Set(existingBorn.map((ch) => ch.title));

  const templates = getMilestoneTemplates('born');

  for (const chapterTemplate of BORN_CHAPTER_TEMPLATES) {
    // Skip if already exists (dedup guard)
    if (existingTitles.has(chapterTemplate.title)) continue;

    const { startDate, endDate } = getChapterDates(profile.birthdate, chapterTemplate);

    // Create the chapter
    const chapter = await ChapterRepository.create({
      babyId: profile.id,
      title: chapterTemplate.title,
      startDate,
      endDate,
      description: chapterTemplate.description,
    });

    // Find milestones that fall within this chapter's date range
    const chapterStart = new Date(startDate).getTime();
    const chapterEnd = new Date(endDate).getTime();

    for (const milestone of templates) {
      const expectedDate = getExpectedDate(profile, milestone);
      if (!expectedDate) continue;

      const milestoneTime = new Date(expectedDate).getTime();
      if (milestoneTime >= chapterStart && milestoneTime < chapterEnd) {
        await MilestoneRepository.createInstance(
          profile.id,
          milestone.id,
          expectedDate,
          chapter.id
        );
      }
    }
  }
}
