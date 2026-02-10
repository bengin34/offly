import { getDatabase, getTimestamp } from '../db/database';
import { BORN_CHAPTER_TEMPLATES, getChapterDates } from '../constants/chapterTemplates';
import { getMilestoneTemplateById } from '../constants/milestoneTemplates';
import { getExpectedDate } from './milestones';
import type { BabyProfile } from '../types';

interface ChapterRow {
  id: string;
  title: string;
  start_date: string;
  end_date: string | null;
}

interface MilestoneRow {
  id: string;
  milestone_template_id: string;
  expected_date: string;
  chapter_id: string | null;
}

interface ChapterWindow {
  id: string;
  startMs: number;
  endMs: number;
}

export async function rebaseBornTimelineDates(
  babyId: string,
  birthdateIso: string,
  previousBirthdateIso?: string
): Promise<{ updatedChapters: number; updatedMilestones: number }> {
  const db = await getDatabase();
  const now = getTimestamp();

  await db.execAsync('BEGIN TRANSACTION');
  try {
    const chapterRows = await db.getAllAsync<ChapterRow>(
      'SELECT id, title, start_date, end_date FROM chapters WHERE baby_id = ?',
      [babyId]
    );

    const templateByTitle = new Map(
      BORN_CHAPTER_TEMPLATES.map((template) => [template.title, template])
    );

    const chapterWindows: ChapterWindow[] = [];
    let updatedChapters = 0;
    let matchedTemplateChapters = 0;

    for (const row of chapterRows) {
      const template = templateByTitle.get(row.title);
      if (!template) continue;
      matchedTemplateChapters += 1;

      const { startDate, endDate } = getChapterDates(birthdateIso, template);
      chapterWindows.push({
        id: row.id,
        startMs: new Date(startDate).getTime(),
        endMs: new Date(endDate).getTime(),
      });

      if (row.start_date === startDate && (row.end_date ?? null) === endDate) {
        continue;
      }

      await db.runAsync(
        `UPDATE chapters
         SET start_date = ?, end_date = ?, updated_at = ?
         WHERE id = ?`,
        [startDate, endDate, now, row.id]
      );
      updatedChapters += 1;
    }

    // Fallback for renamed/custom timelines: if no template chapter was detected,
    // shift all chapter windows by DOB delta so current-week positioning still updates.
    if (matchedTemplateChapters === 0 && previousBirthdateIso) {
      const prevMs = new Date(previousBirthdateIso).getTime();
      const nextMs = new Date(birthdateIso).getTime();
      const deltaMs = nextMs - prevMs;

      if (deltaMs !== 0) {
        for (const row of chapterRows) {
          const shiftedStart = new Date(new Date(row.start_date).getTime() + deltaMs).toISOString();
          const shiftedEnd = row.end_date
            ? new Date(new Date(row.end_date).getTime() + deltaMs).toISOString()
            : null;

          chapterWindows.push({
            id: row.id,
            startMs: new Date(shiftedStart).getTime(),
            endMs: shiftedEnd ? new Date(shiftedEnd).getTime() : Number.POSITIVE_INFINITY,
          });

          if (row.start_date === shiftedStart && (row.end_date ?? null) === shiftedEnd) {
            continue;
          }

          await db.runAsync(
            `UPDATE chapters
             SET start_date = ?, end_date = ?, updated_at = ?
             WHERE id = ?`,
            [shiftedStart, shiftedEnd, now, row.id]
          );
          updatedChapters += 1;
        }
      }
    }

    if (chapterWindows.length === 0) {
      await db.execAsync('COMMIT');
      return { updatedChapters, updatedMilestones: 0 };
    }

    chapterWindows.sort((a, b) => a.startMs - b.startMs);

    const milestoneRows = await db.getAllAsync<MilestoneRow>(
      `SELECT id, milestone_template_id, expected_date, chapter_id
       FROM milestone_instances
       WHERE baby_id = ?`,
      [babyId]
    );

    const profileForDateCalc: BabyProfile = {
      id: babyId,
      mode: 'born',
      birthdate: birthdateIso,
      isDefault: true,
      createdAt: now,
      updatedAt: now,
    };

    let updatedMilestones = 0;

    for (const row of milestoneRows) {
      const template = getMilestoneTemplateById(row.milestone_template_id);
      if (!template || template.ageWeeksMin === undefined) continue;

      const expectedDate = getExpectedDate(profileForDateCalc, template);
      if (!expectedDate) continue;

      const expectedMs = new Date(expectedDate).getTime();
      const matchedChapter = chapterWindows.find(
        (window) => expectedMs >= window.startMs && expectedMs < window.endMs
      );

      const nextChapterId = matchedChapter?.id ?? row.chapter_id ?? null;
      const dateChanged = row.expected_date !== expectedDate;
      const chapterChanged = (row.chapter_id ?? null) !== nextChapterId;
      if (!dateChanged && !chapterChanged) continue;

      await db.runAsync(
        `UPDATE milestone_instances
         SET expected_date = ?, chapter_id = ?, updated_at = ?
         WHERE id = ?`,
        [expectedDate, nextChapterId, now, row.id]
      );
      updatedMilestones += 1;
    }

    await db.execAsync('COMMIT');
    return { updatedChapters, updatedMilestones };
  } catch (error) {
    await db.execAsync('ROLLBACK');
    throw error;
  }
}
