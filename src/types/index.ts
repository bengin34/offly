// Core entity types for BabyLegacy

export type MemoryType = "milestone" | "note";

export interface BabyProfile {
  id: string;
  name?: string;
  birthdate?: string; // ISO date string
  avatarUri?: string;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Chapter {
  id: string;
  babyId: string;
  title: string;
  startDate: string; // ISO date string
  endDate?: string; // ISO date string
  description?: string;
  coverImageUri?: string;
  createdAt: string;
  updatedAt: string;
}

export interface Memory {
  id: string;
  chapterId: string;
  memoryType: MemoryType;
  title: string;
  description?: string;
  importance?: number; // 1-5 scale or boolean (1 = important)
  date: string; // ISO date string
  // Location fields (optional)
  locationName?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  createdAt: string;
  updatedAt: string;
}

// Location parsing result
export interface ParsedLocation {
  name?: string;
  latitude?: number;
  longitude?: number;
  originalUrl?: string;
}

export interface Tag {
  id: string;
  name: string;
}

export interface MemoryTag {
  memoryId: string;
  tagId: string;
}

export interface ChapterTag {
  chapterId: string;
  tagId: string;
}

export interface MemoryPhoto {
  id: string;
  memoryId: string;
  uri: string;
  orderIndex: number;
}

// Extended types with relations
export interface ChapterWithTags extends Chapter {
  tags: Tag[];
}

export interface MemoryWithRelations extends Memory {
  tags: Tag[];
  photos: MemoryPhoto[];
}

export interface ChapterWithMemories extends ChapterWithTags {
  memories: MemoryWithRelations[];
}

// Form types for creating/updating
export interface CreateBabyProfileInput {
  name?: string;
  birthdate?: string;
  avatarUri?: string;
}

export interface UpdateBabyProfileInput extends Partial<CreateBabyProfileInput> {
  id: string;
}

export interface CreateChapterInput {
  babyId: string;
  title: string;
  startDate: string;
  endDate?: string;
  description?: string;
  coverImageUri?: string;
  tagIds?: string[];
}

export interface UpdateChapterInput extends Partial<Omit<CreateChapterInput, "babyId">> {
  id: string;
}

export interface CreateMemoryInput {
  chapterId: string;
  memoryType: MemoryType;
  title: string;
  description?: string;
  importance?: number;
  date: string;
  tagIds?: string[];
  photoUris?: string[];
  // Location fields
  locationName?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
}

export interface UpdateMemoryInput extends Partial<Omit<CreateMemoryInput, "chapterId">> {
  id: string;
}

// Search types
export interface SearchResult {
  type: "chapter" | "memory";
  id: string;
  title: string;
  matchedField: string;
  matchedText: string;
  chapterId?: string;
  chapterTitle?: string;
  memoryType?: MemoryType;
  importance?: number;
}

export interface SearchFilters {
  resultType?: "all" | "chapter" | "memory";
  memoryType?: MemoryType;
  minImportance?: number;
  tagIds?: string[];
  chapterId?: string;
}

// Stats types
export interface AppStats {
  totalChapters: number;
  totalMemories: number;
  totalMilestones: number;
  totalNotes: number;
  totalPhotos: number;
  totalTags: number;
  memoriesWithPhotos: number;
  importantMemories: number;
}

// Export types
export interface ExportData {
  version: string;
  exportedAt: string;
  babyProfile: BabyProfile;
  chapters: ExportChapter[];
  tags: Tag[];
}

export interface ExportChapter extends Chapter {
  tags: Tag[];
  memories: ExportMemory[];
}

export interface ExportMemory extends Memory {
  tags: Tag[];
  photos: ExportPhoto[];
}

export interface ExportPhoto {
  id: string;
  uri: string;
  orderIndex: number;
}

// Import types
export interface ImportResult {
  success: boolean;
  chaptersImported: number;
  memoriesImported: number;
  tagsImported: number;
  photosImported: number;
  skipped: {
    chapters: number;
    memories: number;
    tags: number;
  };
  errors: string[];
}
