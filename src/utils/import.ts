import * as DocumentPicker from "expo-document-picker";
import { File, Directory, Paths } from "expo-file-system/next";
import { getDatabase, getTimestamp } from "../db/database";
import { generateUUID } from "./uuid";
import { persistPhoto } from "./photos";
import type {
  ExportData,
  ExportChapter,
  ExportMemory,
  ExportVault,
} from "./export";

export interface ImportResult {
  success: boolean;
  chaptersImported: number;
  memoriesImported: number;
  tagsImported: number;
  photosImported: number;
  photosRestored: number;
  skipped: {
    chapters: number;
    memories: number;
    tags: number;
  };
  errors: string[];
}

interface ImportOptions {
  /**
   * How to handle existing data with same IDs
   * - 'skip': Skip items that already exist (default)
   * - 'replace': Replace existing items with imported data
   */
  duplicateHandling?: "skip" | "replace";
}

/**
 * Validates that the data conforms to the export format
 */
function validateExportData(data: unknown): data is ExportData {
  if (!data || typeof data !== "object") return false;

  const d = data as Record<string, unknown>;

  if (typeof d.version !== "string") return false;
  if (typeof d.exportedAt !== "string") return false;
  if (!Array.isArray(d.chapters)) return false;
  if (!Array.isArray(d.tags)) return false;

  return true;
}

/**
 * Strips file:// scheme from a URI to get a raw filesystem path.
 */
function uriToPath(uri: string): string {
  if (uri.startsWith("file://")) {
    return uri.replace("file://", "");
  }
  return uri;
}

/**
 * Opens a file picker for the user to select a JSON or ZIP file
 */
export async function pickImportFile(): Promise<{
  uri: string;
  isZip: boolean;
} | null> {
  try {
    const result = await DocumentPicker.getDocumentAsync({
      type: [
        "application/json",
        "application/zip",
        "application/x-zip-compressed",
        "application/octet-stream",
      ],
      copyToCacheDirectory: true,
    });

    if (result.canceled || !result.assets?.[0]) {
      return null;
    }

    const asset = result.assets[0];
    const isZip =
      asset.mimeType?.includes("zip") ||
      asset.name?.endsWith(".zip") ||
      false;

    return { uri: asset.uri, isZip };
  } catch (error) {
    console.error("Failed to pick file:", error);
    return null;
  }
}

/**
 * Reads and parses a JSON file
 */
async function readJsonFile(uri: string): Promise<ExportData> {
  const file = new File(uri);
  const content = await file.text();
  const data = JSON.parse(content);

  if (!validateExportData(data)) {
    throw new Error("Invalid export file format");
  }

  return data;
}

/**
 * Imports data from parsed ExportData (shared logic for JSON and ZIP import)
 */
export async function importFromParsedData(
  data: ExportData,
  options: ImportOptions = {}
): Promise<ImportResult> {
  const { duplicateHandling = "skip" } = options;

  const result: ImportResult = {
    success: false,
    chaptersImported: 0,
    memoriesImported: 0,
    tagsImported: 0,
    photosImported: 0,
    photosRestored: 0,
    skipped: {
      chapters: 0,
      memories: 0,
      tags: 0,
    },
    errors: [],
  };

  try {
    const db = await getDatabase();
    const now = getTimestamp();

    // Track ID mappings (old ID -> new ID) for items that get new IDs
    const tagIdMap = new Map<string, string>();

    // 1. Import tags first
    for (const tag of data.tags) {
      try {
        // Check if tag exists (by name, since tags should be unique by name)
        const existing = await db.getFirstAsync<{ id: string }>(
          "SELECT id FROM tags WHERE name = ?",
          [tag.name]
        );

        if (existing) {
          tagIdMap.set(tag.id, existing.id);
          result.skipped.tags++;
          continue;
        }

        // Check if ID already exists
        const existingById = await db.getFirstAsync<{ id: string }>(
          "SELECT id FROM tags WHERE id = ?",
          [tag.id]
        );

        if (existingById) {
          if (duplicateHandling === "skip") {
            tagIdMap.set(tag.id, existingById.id);
            result.skipped.tags++;
            continue;
          }
          // Replace: update existing
          await db.runAsync("UPDATE tags SET name = ? WHERE id = ?", [
            tag.name,
            tag.id,
          ]);
          tagIdMap.set(tag.id, tag.id);
        } else {
          // Insert new tag
          await db.runAsync("INSERT INTO tags (id, name) VALUES (?, ?)", [
            tag.id,
            tag.name,
          ]);
          tagIdMap.set(tag.id, tag.id);
        }
        result.tagsImported++;
      } catch (error) {
        result.errors.push(`Tag "${tag.name}": ${String(error)}`);
      }
    }

    // 2. Ensure a default baby profile exists for imported chapters
    let babyId: string;
    const existingProfile = await db.getFirstAsync<{ id: string }>(
      "SELECT id FROM baby_profiles WHERE is_default = 1"
    );
    if (existingProfile) {
      babyId = existingProfile.id;
    } else {
      babyId = generateUUID();
      await db.runAsync(
        "INSERT INTO baby_profiles (id, is_default, created_at, updated_at) VALUES (?, 1, ?, ?)",
        [babyId, now, now]
      );
    }

    // 3. Import chapters and their memories
    for (const chapter of data.chapters) {
      try {
        await importChapter(
          db,
          chapter,
          babyId,
          tagIdMap,
          duplicateHandling,
          result,
          now
        );
      } catch (error) {
        result.errors.push(`Chapter "${chapter.title}": ${String(error)}`);
      }
    }

    result.success = result.errors.length === 0;
  } catch (error) {
    result.errors.push(`Import failed: ${String(error)}`);
  }

  return result;
}

/**
 * Imports data from a JSON export file
 */
export async function importFromJson(
  fileUri: string,
  options: ImportOptions = {}
): Promise<ImportResult> {
  const data = await readJsonFile(fileUri);
  return importFromParsedData(data, options);
}

/**
 * Imports data + photos from a ZIP backup file.
 * Extracts photos to the app's persistent photos directory,
 * then rewrites URIs in the data before importing.
 */
export async function importFromZip(
  zipUri: string,
  options: ImportOptions = {},
  onProgress?: (progress: number) => void
): Promise<ImportResult> {
  const { unzip, subscribe } = require("react-native-zip-archive") as typeof import("react-native-zip-archive");

  const extractDirName = `Offly_import_${Date.now()}`;
  const extractPath = uriToPath(Paths.cache.uri) + `/${extractDirName}`;

  // Subscribe to unzip progress
  const progressSubscription = subscribe(({ progress }: { progress: number }) => {
    // Unzip phase is 0-30% of total
    onProgress?.(progress * 0.3);
  });

  try {
    // 1. Unzip to cache
    await unzip(uriToPath(zipUri), extractPath);
    progressSubscription.remove();

    // 2. Read data.json from extracted files
    const dataJsonPath = `file://${extractPath}/data.json`;
    const dataJsonFile = new File(dataJsonPath);

    if (!dataJsonFile.exists) {
      throw new Error("Invalid backup: data.json not found in ZIP");
    }

    const jsonContent = await dataJsonFile.text();
    const data = JSON.parse(jsonContent);

    if (!validateExportData(data)) {
      throw new Error("Invalid backup: data.json has wrong format");
    }

    // 3. Restore photos: copy from extracted photos/ to app's persistent photos dir
    const uriRewriteMap = new Map<string, string>();
    const extractedPhotosDir = new Directory(
      `file://${extractPath}`,
      "photos"
    );

    let photosRestored = 0;

    if (extractedPhotosDir.exists) {
      const photoItems = extractedPhotosDir.list();
      const photoFiles = photoItems.filter(
        (item): item is File => item instanceof File
      );

      for (let i = 0; i < photoFiles.length; i++) {
        const photoFile = photoFiles[i];
        try {
          // persistPhoto copies to the app's permanent photos/ directory
          const persistedUri = await persistPhoto(photoFile.uri);
          const filename = photoFile.uri.split("/").pop() || "";
          uriRewriteMap.set(`photos/${filename}`, persistedUri);
          photosRestored++;
        } catch (error) {
          console.warn(`Failed to restore photo ${photoFile.uri}:`, error);
        }
        // Photo restore is 30%-80% of total
        onProgress?.(0.3 + ((i + 1) / photoFiles.length) * 0.5);
      }
    } else {
      onProgress?.(0.8);
    }

    // 4. Rewrite photo URIs in data before importing
    const rewritePhotos = (memory: ExportMemory): ExportMemory => ({
      ...memory,
      photos: memory.photos.map((photo) => ({
        ...photo,
        uri: uriRewriteMap.get(photo.uri) || photo.uri,
      })),
    });

    const rewrittenData: ExportData = {
      ...data,
      chapters: data.chapters.map((ch: ExportChapter) => ({
        ...ch,
        memories: ch.memories.map(rewritePhotos),
      })),
      vaults: (data.vaults || []).map((v: ExportVault) => ({
        ...v,
        entries: v.entries.map(rewritePhotos),
      })),
      pregnancyJournalEntries: (data.pregnancyJournalEntries || []).map(
        rewritePhotos
      ),
    };

    // 5. Import data using shared logic
    onProgress?.(0.8);
    const result = await importFromParsedData(rewrittenData, options);
    result.photosRestored = photosRestored;

    onProgress?.(1);
    return result;
  } finally {
    progressSubscription.remove();

    // Clean up extraction directory
    try {
      const extractDir = new Directory(`file://${extractPath}`);
      if (extractDir.exists) extractDir.delete();
    } catch {
      // Non-fatal cleanup
    }
  }
}

async function importChapter(
  db: Awaited<ReturnType<typeof getDatabase>>,
  chapter: ExportChapter,
  babyId: string,
  tagIdMap: Map<string, string>,
  duplicateHandling: "skip" | "replace",
  result: ImportResult,
  now: string
): Promise<void> {
  // Check if chapter exists
  const existing = await db.getFirstAsync<{ id: string }>(
    "SELECT id FROM chapters WHERE id = ?",
    [chapter.id]
  );

  const chapterId = chapter.id;

  if (existing) {
    if (duplicateHandling === "skip") {
      result.skipped.chapters++;
      // Still import memories that don't exist
      for (const memory of chapter.memories) {
        await importMemory(
          db,
          memory,
          chapterId,
          tagIdMap,
          duplicateHandling,
          result,
          now
        );
      }
      return;
    }

    // Replace: update existing chapter
    await db.runAsync(
      `UPDATE chapters SET
        baby_id = ?, title = ?, start_date = ?, end_date = ?,
        description = ?, cover_image_uri = ?, updated_at = ?
       WHERE id = ?`,
      [
        babyId,
        chapter.title,
        chapter.startDate,
        chapter.endDate ?? null,
        chapter.description ?? null,
        chapter.coverImageUri ?? null,
        now,
        chapter.id,
      ]
    );
  } else {
    // Insert new chapter
    await db.runAsync(
      `INSERT INTO chapters (id, baby_id, title, start_date, end_date, description, cover_image_uri, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        chapter.id,
        babyId,
        chapter.title,
        chapter.startDate,
        chapter.endDate ?? null,
        chapter.description ?? null,
        chapter.coverImageUri ?? null,
        chapter.createdAt ?? now,
        now,
      ]
    );
  }

  result.chaptersImported++;

  // Import chapter tags
  if (chapter.tags?.length) {
    await db.runAsync("DELETE FROM chapter_tags WHERE chapter_id = ?", [
      chapterId,
    ]);

    for (const tag of chapter.tags) {
      const mappedTagId = tagIdMap.get(tag.id) ?? tag.id;
      try {
        await db.runAsync(
          "INSERT OR IGNORE INTO chapter_tags (chapter_id, tag_id) VALUES (?, ?)",
          [chapterId, mappedTagId]
        );
      } catch {
        // Ignore tag linking errors
      }
    }
  }

  // Import memories
  for (const memory of chapter.memories) {
    await importMemory(
      db,
      memory,
      chapterId,
      tagIdMap,
      duplicateHandling,
      result,
      now
    );
  }
}

async function importMemory(
  db: Awaited<ReturnType<typeof getDatabase>>,
  memory: ExportMemory,
  chapterId: string,
  tagIdMap: Map<string, string>,
  duplicateHandling: "skip" | "replace",
  result: ImportResult,
  now: string
): Promise<void> {
  // Check if memory exists
  const existing = await db.getFirstAsync<{ id: string }>(
    "SELECT id FROM memories WHERE id = ?",
    [memory.id]
  );

  if (existing) {
    if (duplicateHandling === "skip") {
      result.skipped.memories++;
      return;
    }

    // Replace: update existing memory
    await db.runAsync(
      `UPDATE memories SET
        chapter_id = ?, memory_type = ?, title = ?,
        description = ?, date = ?,
        location_name = ?, latitude = ?, longitude = ?, map_url = ?,
        updated_at = ?
       WHERE id = ?`,
      [
        chapterId,
        memory.memoryType,
        memory.title,
        memory.description ?? null,
        memory.date,
        memory.locationName ?? null,
        memory.latitude ?? null,
        memory.longitude ?? null,
        memory.mapUrl ?? null,
        now,
        memory.id,
      ]
    );
  } else {
    // Insert new memory
    await db.runAsync(
      `INSERT INTO memories (id, chapter_id, memory_type, title, description, date, location_name, latitude, longitude, map_url, created_at, updated_at)
       VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)`,
      [
        memory.id,
        chapterId,
        memory.memoryType,
        memory.title,
        memory.description ?? null,
        memory.date,
        memory.locationName ?? null,
        memory.latitude ?? null,
        memory.longitude ?? null,
        memory.mapUrl ?? null,
        memory.createdAt ?? now,
        now,
      ]
    );
  }

  result.memoriesImported++;

  // Update memory tags
  if (memory.tags?.length) {
    await db.runAsync("DELETE FROM memory_tags WHERE memory_id = ?", [
      memory.id,
    ]);

    for (const tag of memory.tags) {
      const mappedTagId = tagIdMap.get(tag.id) ?? tag.id;
      try {
        await db.runAsync(
          "INSERT OR IGNORE INTO memory_tags (memory_id, tag_id) VALUES (?, ?)",
          [memory.id, mappedTagId]
        );
      } catch {
        // Ignore tag linking errors
      }
    }
  }

  // Update photos
  if (memory.photos?.length) {
    await db.runAsync("DELETE FROM memory_photos WHERE memory_id = ?", [
      memory.id,
    ]);

    for (const photo of memory.photos) {
      const photoId = photo.id || generateUUID();
      try {
        await db.runAsync(
          "INSERT INTO memory_photos (id, memory_id, uri, order_index) VALUES (?, ?, ?, ?)",
          [photoId, memory.id, photo.uri, photo.orderIndex]
        );
        result.photosImported++;
      } catch {
        // Ignore photo insertion errors
      }
    }
  }
}

/**
 * Full import flow: pick file and import (handles both JSON and ZIP)
 */
export async function pickAndImport(
  options: ImportOptions = {},
  onProgress?: (progress: number) => void
): Promise<ImportResult | null> {
  const picked = await pickImportFile();
  if (!picked) {
    return null; // User cancelled
  }

  if (picked.isZip) {
    return importFromZip(picked.uri, options, onProgress);
  } else {
    return importFromJson(picked.uri, options);
  }
}
