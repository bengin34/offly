import { File, Directory, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  ChapterRepository,
  MemoryRepository,
  TagRepository,
  VaultRepository,
} from "../db/repositories";
import { BabyProfileRepository } from "../db/repositories/BabyProfileRepository";
import { MilestoneRepository } from "../db/repositories/MilestoneRepository";
import type { Chapter, MemoryWithRelations, Tag, BabyProfile, Vault, MilestoneInstance } from "../types";

export interface ExportData {
  version: string;
  exportedAt: string;
  babyProfile: BabyProfile | null;
  chapters: ExportChapter[];
  vaults: ExportVault[];
  pregnancyJournalEntries: ExportMemory[];
  tags: Tag[];
  milestoneInstances: MilestoneInstance[];
}

export interface ExportChapter extends Chapter {
  tags: Tag[];
  memories: ExportMemory[];
}

export interface ExportVault extends Vault {
  entries: ExportMemory[];
}

export interface ExportMemory extends Omit<MemoryWithRelations, "photos"> {
  photos: ExportPhoto[];
}

export interface ExportPhoto {
  id: string;
  uri: string;
  orderIndex: number;
  filename: string;
}

function toExportMemory(memory: MemoryWithRelations): ExportMemory {
  return {
    ...memory,
    photos: memory.photos.map((photo) => ({
      id: photo.id,
      uri: photo.uri,
      orderIndex: photo.orderIndex,
      filename: photo.uri.split("/").pop() || `photo_${photo.id}`,
    })),
  };
}

async function buildExportData(babyId?: string): Promise<ExportData> {
  let babyProfile: BabyProfile | null = null;
  if (babyId) {
    babyProfile = await BabyProfileRepository.getById(babyId);
  } else {
    babyProfile = await BabyProfileRepository.getDefault();
  }
  const chapters = await ChapterRepository.getAllIncludingArchived(babyProfile?.id);
  const allTags = await TagRepository.getAll();

  // Export chapters with memories
  const exportChapters: ExportChapter[] = [];
  for (const chapter of chapters) {
    const chapterTags = await TagRepository.getForChapter(chapter.id);
    const memories = await MemoryRepository.getByChapterIdWithRelations(chapter.id);
    exportChapters.push({
      ...chapter,
      tags: chapterTags,
      memories: memories.map(toExportMemory),
    });
  }

  // Export vaults with entries
  const exportVaults: ExportVault[] = [];
  if (babyProfile) {
    const vaults = await VaultRepository.getAll(babyProfile.id);
    for (const vault of vaults) {
      const entries = await MemoryRepository.getByVaultIdWithRelations(vault.id);
      exportVaults.push({
        ...vault,
        entries: entries.map(toExportMemory),
      });
    }
  }

  // Export pregnancy journal entries
  const pregnancyEntries = await MemoryRepository.getPregnancyJournalEntriesWithRelations(babyProfile?.id);

  // Export milestone instances
  const milestoneInstances = babyProfile
    ? await MilestoneRepository.getByBabyId(babyProfile.id)
    : [];

  const exportData: ExportData = {
    version: "1.1.0",
    exportedAt: new Date().toISOString(),
    babyProfile: babyProfile || null,
    chapters: exportChapters,
    vaults: exportVaults,
    pregnancyJournalEntries: pregnancyEntries.map(toExportMemory),
    tags: allTags,
    milestoneInstances,
  };

  return exportData;
}

// --- ZIP backup with photos ---

interface PhotoMapping {
  absoluteUri: string;
  filename: string;
}

/**
 * Strips file:// scheme from a URI to get a raw filesystem path.
 * react-native-zip-archive expects raw paths, not file:// URIs.
 */
function uriToPath(uri: string): string {
  if (uri.startsWith("file://")) {
    return uri.replace("file://", "");
  }
  return uri;
}

/**
 * Collects all photo file references from export data, deduplicated by filename.
 */
function collectAllPhotos(exportData: ExportData): PhotoMapping[] {
  const mappings: PhotoMapping[] = [];
  const seen = new Set<string>();

  const processMemory = (memory: ExportMemory) => {
    for (const photo of memory.photos) {
      const filename = photo.uri.split("/").pop() || `photo_${photo.id}.jpg`;
      if (!seen.has(filename)) {
        seen.add(filename);
        mappings.push({ absoluteUri: photo.uri, filename });
      }
    }
  };

  for (const chapter of exportData.chapters) {
    for (const memory of chapter.memories) processMemory(memory);
  }
  for (const vault of exportData.vaults) {
    for (const entry of vault.entries) processMemory(entry);
  }
  for (const entry of exportData.pregnancyJournalEntries) processMemory(entry);

  return mappings;
}

/**
 * Rewrites photo URIs in export data to relative paths (photos/{filename})
 * so the backup is portable across devices.
 */
function rewritePhotoPaths(exportData: ExportData): ExportData {
  const rewriteMemory = (memory: ExportMemory): ExportMemory => ({
    ...memory,
    photos: memory.photos.map((photo) => {
      const filename = photo.uri.split("/").pop() || `photo_${photo.id}.jpg`;
      return { ...photo, uri: `photos/${filename}`, filename };
    }),
  });

  return {
    ...exportData,
    chapters: exportData.chapters.map((ch) => ({
      ...ch,
      memories: ch.memories.map(rewriteMemory),
    })),
    vaults: exportData.vaults.map((v) => ({
      ...v,
      entries: v.entries.map(rewriteMemory),
    })),
    pregnancyJournalEntries: exportData.pregnancyJournalEntries.map(rewriteMemory),
  };
}

/**
 * Exports all data + photos as a ZIP bundle.
 * Photos are copied file-by-file (never loaded into JS memory).
 * The native zip() operation streams directly from disk.
 */
export async function exportToZip(
  onProgress?: (progress: number) => void
): Promise<void> {
  const { zip, subscribe } = require("react-native-zip-archive") as typeof import("react-native-zip-archive");

  const stagingDirName = `Offly_backup_${Date.now()}`;
  const stagingDir = new Directory(Paths.cache, stagingDirName);

  try {
    // 1. Build export data
    onProgress?.(0);
    const exportData = await buildExportData();

    // 2. Collect photo mappings and rewrite URIs to relative paths
    const photoMappings = collectAllPhotos(exportData);
    const portableData = rewritePhotoPaths(exportData);

    // 3. Create staging directory
    if (stagingDir.exists) {
      stagingDir.delete();
    }
    stagingDir.create();

    // 4. Write data.json
    const dataFile = new File(stagingDir, "data.json");
    dataFile.write(JSON.stringify(portableData, null, 2));

    // 5. Copy photos to staging/photos/
    if (photoMappings.length > 0) {
      const photosSubDir = new Directory(stagingDir, "photos");
      photosSubDir.create();

      for (let i = 0; i < photoMappings.length; i++) {
        const mapping = photoMappings[i];
        try {
          const sourceFile = new File(mapping.absoluteUri);
          if (sourceFile.exists) {
            const destFile = new File(photosSubDir, mapping.filename);
            sourceFile.copy(destFile);
          }
        } catch (error) {
          console.warn(`Failed to copy photo ${mapping.filename}:`, error);
        }
        // Copy phase is 0-50% of progress
        onProgress?.(((i + 1) / photoMappings.length) * 0.5);
      }
    } else {
      onProgress?.(0.5);
    }

    // 6. Zip the staging directory
    const zipFilePath = uriToPath(Paths.cache.uri) + `/${stagingDirName}.zip`;

    const progressSubscription = subscribe(({ progress }: { progress: number }) => {
      // Zip phase is 50-90% of total progress
      onProgress?.(0.5 + progress * 0.4);
    });

    try {
      await zip(uriToPath(stagingDir.uri), zipFilePath);
    } finally {
      progressSubscription.remove();
    }

    onProgress?.(0.9);

    // 7. Clean up staging directory
    try {
      if (stagingDir.exists) stagingDir.delete();
    } catch {
      // Non-fatal cleanup
    }

    // 8. Share the zip file
    const zipFileUri = `file://${zipFilePath}`;
    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(zipFileUri, {
        mimeType: "application/zip",
        dialogTitle: "Backup Offly Data",
        UTI: "public.zip-archive",
      });
    } else {
      throw new Error("Sharing is not available on this device");
    }

    onProgress?.(1);

    // 9. Clean up zip file after sharing
    try {
      const zipFile = new File(zipFileUri);
      if (zipFile.exists) zipFile.delete();
    } catch {
      // Non-fatal
    }
  } catch (error) {
    // Clean up staging on error
    try {
      if (stagingDir.exists) stagingDir.delete();
    } catch {
      // ignore
    }
    console.error("ZIP export failed:", error);
    throw error;
  }
}

export async function getExportStats(babyId?: string): Promise<{
  chapterCount: number;
  memoryCount: number;
  photoCount: number;
  tagCount: number;
  vaultCount: number;
  pregnancyEntryCount: number;
}> {
  let babyProfile: BabyProfile | null = null;
  if (babyId) {
    babyProfile = await BabyProfileRepository.getById(babyId);
  } else {
    babyProfile = await BabyProfileRepository.getDefault();
  }
  const chapters = await ChapterRepository.getAllIncludingArchived(babyProfile?.id);
  const allTags = await TagRepository.getAll();

  let memoryCount = 0;
  let photoCount = 0;

  for (const chapter of chapters) {
    const memories = await MemoryRepository.getByChapterIdWithRelations(chapter.id);
    memoryCount += memories.length;
    for (const memory of memories) {
      photoCount += memory.photos.length;
    }
  }

  let vaultCount = 0;
  if (babyProfile) {
    vaultCount = await VaultRepository.count(babyProfile.id);
  }

  const pregnancyEntryCount = await MemoryRepository.countPregnancyJournal(babyProfile?.id);

  return {
    chapterCount: chapters.length,
    memoryCount,
    photoCount,
    tagCount: allTags.length,
    vaultCount,
    pregnancyEntryCount,
  };
}
