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
export async function autoGenerateTimeline(profile: BabyProfile): Promise<void> {
  if (!profile.birthdate) return;

  const templates = getMilestoneTemplates('born');

  for (const chapterTemplate of BORN_CHAPTER_TEMPLATES) {
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
