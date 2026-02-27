import { Image } from 'react-native';
import { getDatabase, getTimestamp } from '../db/database';
import { generateUUID } from '../utils/uuid';
import { isMockActive } from './config';
import { forceMockReseed } from '../config/dev';

// Resolve bundled asset URIs at module load time (must be in React Native context)
const MOCK_BABY_PHOTOS = [
  Image.resolveAssetSource(require('../../assets/mocks/baby/1.jpg')).uri,
  Image.resolveAssetSource(require('../../assets/mocks/baby/2.jpg')).uri,
  Image.resolveAssetSource(require('../../assets/mocks/baby/3.jpg')).uri,
];

// Sub-photos for the first chapter's first memory (multi-photo gallery)
const MOCK_BABY_PHOTO_1_1 = Image.resolveAssetSource(require('../../assets/mocks/baby/1.1.jpg')).uri;
const MOCK_BABY_PHOTO_1_2 = Image.resolveAssetSource(require('../../assets/mocks/baby/1.2.jpg')).uri;

const SAMPLE_MEMORIES: {
  title: string;
  description: string;
  type: 'milestone' | 'note';
  dayOffset: number;
  photoIndex: number;
}[] = [
  {
    title: 'First Smile',
    description:
      'That magical moment when they looked up and smiled for the first time. Pure joy.',
    type: 'milestone',
    dayOffset: 5,
    photoIndex: 1,
  },
  {
    title: 'Morning cuddles',
    description:
      'We spent the whole morning just being together. These quiet moments are everything.',
    type: 'note',
    dayOffset: 10,
    photoIndex: 0,
  },
  {
    title: 'Tummy time champion',
    description: 'Held their head up for almost 10 seconds today! Getting so strong.',
    type: 'milestone',
    dayOffset: 18,
    photoIndex: 2,
  },
];

const SAMPLE_AGE_LOCKED_LETTERS: {
  title: string;
  description: string;
  dayOffset: number;
}[] = [
  {
    title: 'For your 18th birthday',
    description: 'A letter from your early days, saved for the moment you step into adulthood.',
    dayOffset: 30,
  },
  {
    title: 'When you read this at 18',
    description: 'We wrote this while you were little, so one day you can remember how this journey started.',
    dayOffset: 120,
  },
];

/**
 * Seeds chapters with mock cover photos and creates sample memories with photos.
 * Only runs in dev/mock mode. Idempotent — skips chapters that already have covers
 * and chapters that already have memories.
 */
export async function seedMockDatabase(): Promise<void> {
  if (!isMockActive()) return;

  try {
    const db = await getDatabase();

    const chapters = await db.getAllAsync<{
      id: string;
      baby_id: string;
      title: string;
      mode: string;
      birthdate: string | null;
      start_date: string;
      cover_image_uri: string | null;
    }>(
      `SELECT c.id, c.baby_id, c.title, c.start_date, c.cover_image_uri, bp.mode, bp.birthdate
       FROM chapters c
       LEFT JOIN baby_profiles bp ON bp.id = c.baby_id
       ORDER BY c.start_date ASC`
    );

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const isBornChapter = chapter.mode === 'born';

      // Only process born mode chapters
      if (!isBornChapter) {
        continue;
      }

      // Calculate cover photo index based on weeks since birth
      let coverIndex = i;
      if (chapter.birthdate) {
        const MS_PER_WEEK = 1000 * 60 * 60 * 24 * 7;
        const startMs = new Date(chapter.start_date).getTime();
        const birthMs = new Date(chapter.birthdate).getTime();
        coverIndex = Math.max(0, Math.floor((startMs - birthMs) / MS_PER_WEEK));
      }

      const coverPhotoUri = MOCK_BABY_PHOTOS[coverIndex % MOCK_BABY_PHOTOS.length];

      // In mock mode, keep timeline covers deterministic by chronological week order.
      if (!chapter.cover_image_uri || chapter.cover_image_uri !== coverPhotoUri) {
        await db.runAsync(
          'UPDATE chapters SET cover_image_uri = ?, updated_at = ? WHERE id = ?',
          [coverPhotoUri, getTimestamp(), chapter.id]
        );
      }

      // In dev mode with forceMockReseed: wipe existing mock memories so they re-seed fresh
      if (forceMockReseed) {
        const existingMemories = await db.getAllAsync<{ id: string }>(
          'SELECT id FROM memories WHERE chapter_id = ?',
          [chapter.id]
        );
        for (const m of existingMemories) {
          await db.runAsync('DELETE FROM memory_photos WHERE memory_id = ?', [m.id]);
        }
        await db.runAsync('DELETE FROM memories WHERE chapter_id = ?', [chapter.id]);
      }

      // Only seed memories if the chapter has none
      const memCount = await db.getFirstAsync<{ count: number }>(
        'SELECT COUNT(*) as count FROM memories WHERE chapter_id = ?',
        [chapter.id]
      );

      if (!memCount || memCount.count === 0) {
        const startDate = new Date(chapter.start_date);
        const isFirstChapter = isBornChapter && coverIndex === 0;

        for (let j = 0; j < SAMPLE_MEMORIES.length; j++) {
          const mem = SAMPLE_MEMORIES[j];
          const memDate = new Date(startDate);
          memDate.setDate(memDate.getDate() + mem.dayOffset);

          const memId = generateUUID();
          const now = getTimestamp();

          await db.runAsync(
            `INSERT INTO memories
               (id, chapter_id, vault_id, is_pregnancy_journal, memory_type, title, description, date, created_at, updated_at)
             VALUES (?, ?, NULL, 0, ?, ?, ?, ?, ?, ?)`,
            [memId, chapter.id, mem.type, mem.title, mem.description, memDate.toISOString(), now, now]
          );

          // For the first chapter (Month 1), use 1.1.jpg and 1.2.jpg as primary photos
          let primaryPhoto: string;
          if (isFirstChapter && j === 0) {
            primaryPhoto = MOCK_BABY_PHOTO_1_1;
          } else if (isFirstChapter && j === 1) {
            primaryPhoto = MOCK_BABY_PHOTO_1_2;
          } else {
            primaryPhoto = MOCK_BABY_PHOTOS[mem.photoIndex];
          }

          await db.runAsync(
            'INSERT INTO memory_photos (id, memory_id, uri, order_index) VALUES (?, ?, ?, 0)',
            [generateUUID(), memId, primaryPhoto]
          );
        }
      }
    }

    const bornProfiles = await db.getAllAsync<{
      id: string;
      birthdate: string | null;
    }>(
      `SELECT id, birthdate
       FROM baby_profiles
       WHERE mode = 'born'`
    );

    for (const profile of bornProfiles) {
      const existingVault = await db.getFirstAsync<{
        id: string;
      }>(
        `SELECT id
         FROM vaults
         WHERE baby_id = ? AND target_age_years = 18
         LIMIT 1`,
        [profile.id]
      );

      let eighteenYearVaultId = existingVault?.id;
      if (!eighteenYearVaultId) {
        eighteenYearVaultId = generateUUID();
        const now = getTimestamp();
        const unlockDate = profile.birthdate ? new Date(profile.birthdate) : new Date();
        unlockDate.setFullYear(unlockDate.getFullYear() + 18);

        await db.runAsync(
          `INSERT INTO vaults
             (id, baby_id, target_age_years, unlock_date, status, created_at, updated_at)
           VALUES (?, ?, 18, ?, ?, ?, ?)`,
          [
            eighteenYearVaultId,
            profile.id,
            unlockDate.toISOString(),
            new Date() >= unlockDate ? 'unlocked' : 'locked',
            now,
            now,
          ]
        );
      }

      if (forceMockReseed) {
        await db.runAsync(
          `DELETE FROM memory_photos
          WHERE memory_id IN (
             SELECT id
             FROM memories
             WHERE vault_id = ?
               AND memory_type = 'letter'
               AND title IN (?, ?)
           )`,
          [
            eighteenYearVaultId,
            SAMPLE_AGE_LOCKED_LETTERS[0].title,
            SAMPLE_AGE_LOCKED_LETTERS[1].title,
          ]
        );

        await db.runAsync(
          `DELETE FROM memories
           WHERE vault_id = ?
             AND memory_type = 'letter'
             AND title IN (?, ?)`,
          [
            eighteenYearVaultId,
            SAMPLE_AGE_LOCKED_LETTERS[0].title,
            SAMPLE_AGE_LOCKED_LETTERS[1].title,
          ]
        );
      }

      const letterCount = await db.getFirstAsync<{ count: number }>(
        `SELECT COUNT(*) as count
         FROM memories
         WHERE vault_id = ? AND memory_type = 'letter'`,
        [eighteenYearVaultId]
      );

      if (!letterCount || letterCount.count === 0) {
        const baseDate = profile.birthdate ? new Date(profile.birthdate) : new Date();

        for (const letter of SAMPLE_AGE_LOCKED_LETTERS) {
          const letterDate = new Date(baseDate);
          letterDate.setDate(letterDate.getDate() + letter.dayOffset);

          const memoryId = generateUUID();
          const now = getTimestamp();

          await db.runAsync(
            `INSERT INTO memories
              (id, chapter_id, vault_id, baby_id, is_pregnancy_journal, memory_type, title, description, date, created_at, updated_at)
             VALUES (?, NULL, ?, ?, 0, 'letter', ?, ?, ?, ?, ?)`,
            [
              memoryId,
              eighteenYearVaultId,
              profile.id,
              letter.title,
              letter.description,
              letterDate.toISOString(),
              now,
              now,
            ]
          );
        }
      }
    }
  } catch (error) {
    // Never crash the app due to mock seeding
    console.warn('[seedMockDatabase] Failed:', error);
  }
}
