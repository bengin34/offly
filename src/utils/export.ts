import { File, Paths } from "expo-file-system";
import * as Sharing from "expo-sharing";
import {
  ChapterRepository,
  MemoryRepository,
  TagRepository,
} from "../db/repositories";
import { BabyProfileRepository } from "../db/repositories/BabyProfileRepository";
import type { Chapter, MemoryWithRelations, Tag, BabyProfile } from "../types";

export interface ExportData {
  version: string;
  exportedAt: string;
  babyProfile: BabyProfile | null;
  chapters: ExportChapter[];
  tags: Tag[];
}

export interface ExportChapter extends Chapter {
  tags: Tag[];
  memories: ExportMemory[];
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

async function buildExportData(): Promise<ExportData> {
  const babyProfile = await BabyProfileRepository.getDefault();
  const chapters = await ChapterRepository.getAll();
  const allTags = await TagRepository.getAll();

  const exportChapters: ExportChapter[] = [];

  for (const chapter of chapters) {
    const chapterTags = await TagRepository.getForChapter(chapter.id);
    const memories = await MemoryRepository.getByChapterIdWithRelations(chapter.id);

    const exportMemories: ExportMemory[] = memories.map((memory) => ({
      ...memory,
      photos: memory.photos.map((photo) => ({
        id: photo.id,
        uri: photo.uri,
        orderIndex: photo.orderIndex,
        filename: photo.uri.split("/").pop() || `photo_${photo.id}`,
      })),
    }));

    exportChapters.push({
      ...chapter,
      tags: chapterTags,
      memories: exportMemories,
    });
  }

  const exportData: ExportData = {
    version: "1.0.0",
    exportedAt: new Date().toISOString(),
    babyProfile: babyProfile || null,
    chapters: exportChapters,
    tags: allTags,
  };

  return exportData;
}

export async function exportAllData(): Promise<string> {
  const exportData = await buildExportData();
  return JSON.stringify(exportData, null, 2);
}

export async function exportToJson(): Promise<void> {
  try {
    const jsonData = await exportAllData();
    const filename = `BabyLegacy_export_${Date.now()}.json`;
    const file = new File(Paths.cache, filename);

    await file.write(jsonData);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/json",
        dialogTitle: "Export BabyLegacy Data",
        UTI: "public.json",
      });
    } else {
      throw new Error("Sharing is not available on this device");
    }
  } catch (error) {
    console.error("Export failed:", error);
    throw error;
  }
}

function escapeHtml(value: string): string {
  return value
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#39;");
}

function buildHtmlTable(headers: string[], rows: string[][]): string {
  const headerRow = headers.map((header) => `<th>${escapeHtml(header)}</th>`).join("");
  const bodyRows = rows
    .map(
      (row) =>
        `<tr>${row.map((cell) => `<td>${escapeHtml(cell)}</td>`).join("")}</tr>`
    )
    .join("");

  return `<table border="1"><thead><tr>${headerRow}</tr></thead><tbody>${bodyRows}</tbody></table>`;
}

export async function exportToXls(): Promise<void> {
  try {
    const exportData = await buildExportData();

    const chapterHeaders = [
      "Chapter ID",
      "Title",
      "Start Date",
      "End Date",
      "Description",
      "Cover Image URI",
      "Created At",
      "Updated At",
      "Tag Names",
      "Tag IDs",
    ];
    const chapterRows = exportData.chapters.map((chapter) => [
      chapter.id,
      chapter.title,
      chapter.startDate,
      chapter.endDate ?? "",
      chapter.description ?? "",
      chapter.coverImageUri ?? "",
      chapter.createdAt,
      chapter.updatedAt,
      chapter.tags.map((tag) => tag.name).join(", "),
      chapter.tags.map((tag) => tag.id).join(", "),
    ]);

    const memoryHeaders = [
      "Memory ID",
      "Chapter ID",
      "Memory Type",
      "Title",
      "Description",
      "Importance",
      "Date",
      "Location",
      "Created At",
      "Updated At",
      "Tag Names",
      "Photo Filenames",
      "Photo URIs",
    ];
    const memoryRows = exportData.chapters.flatMap((chapter) =>
      chapter.memories.map((memory) => [
        memory.id,
        chapter.id,
        memory.memoryType,
        memory.title,
        memory.description ?? "",
        memory.importance !== undefined && memory.importance !== null ? String(memory.importance) : "",
        memory.date,
        memory.locationName ?? "",
        memory.createdAt,
        memory.updatedAt,
        memory.tags.map((tag) => tag.name).join(", "),
        memory.photos.map((photo) => photo.filename).join(", "),
        memory.photos.map((photo) => photo.uri).join(", "),
      ])
    );

    const photoHeaders = [
      "Photo ID",
      "Memory ID",
      "Chapter ID",
      "URI",
      "Order Index",
      "Filename",
    ];
    const photoRows = exportData.chapters.flatMap((chapter) =>
      chapter.memories.flatMap((memory) =>
        memory.photos.map((photo) => [
          photo.id,
          memory.id,
          chapter.id,
          photo.uri,
          String(photo.orderIndex),
          photo.filename,
        ])
      )
    );

    const tagHeaders = ["Tag ID", "Tag Name"];
    const tagRows = exportData.tags.map((tag) => [tag.id, tag.name]);

    const html = [
      "<!DOCTYPE html>",
      "<html>",
      '<head><meta charset="utf-8" /></head>',
      "<body>",
      "<h2>Chapters</h2>",
      buildHtmlTable(chapterHeaders, chapterRows),
      "<h2>Memories</h2>",
      buildHtmlTable(memoryHeaders, memoryRows),
      "<h2>Photos</h2>",
      buildHtmlTable(photoHeaders, photoRows),
      "<h2>Tags</h2>",
      buildHtmlTable(tagHeaders, tagRows),
      "</body>",
      "</html>",
    ].join("");

    const filename = `BabyLegacy_export_${Date.now()}.xls`;
    const file = new File(Paths.cache, filename);

    await file.write(html);

    const canShare = await Sharing.isAvailableAsync();
    if (canShare) {
      await Sharing.shareAsync(file.uri, {
        mimeType: "application/vnd.ms-excel",
        dialogTitle: "Export BabyLegacy Data",
        UTI: "com.microsoft.excel.xls",
      });
    } else {
      throw new Error("Sharing is not available on this device");
    }
  } catch (error) {
    console.error("Export failed:", error);
    throw error;
  }
}

export async function getExportStats(): Promise<{
  chapterCount: number;
  memoryCount: number;
  photoCount: number;
  tagCount: number;
}> {
  const chapters = await ChapterRepository.getAll();
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

  return {
    chapterCount: chapters.length,
    memoryCount,
    photoCount,
    tagCount: allTags.length,
  };
}
