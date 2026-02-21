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
      start_date: string;
      cover_image_uri: string | null;
    }>('SELECT id, start_date, cover_image_uri FROM chapters ORDER BY start_date ASC');

    for (let i = 0; i < chapters.length; i++) {
      const chapter = chapters[i];
      const coverPhotoUri = MOCK_BABY_PHOTOS[i % MOCK_BABY_PHOTOS.length];

      // Set cover photo if not already set
      if (!chapter.cover_image_uri) {
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
        const isFirstChapter = i === 0;

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
  } catch (error) {
    // Never crash the app due to mock seeding
    console.warn('[seedMockDatabase] Failed:', error);
  }
}
