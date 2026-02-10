// Core entity types for Offly

export type MemoryType = "milestone" | "note" | "letter";
export type BabyMode = "born" | "pregnant";
export type VaultStatus = "locked" | "unlocked";
export type MilestoneCategory = "growth" | "social" | "physical" | "prenatal" | "other";
export type MilestoneInstanceStatus = "pending" | "filled" | "archived";

export interface BabyProfile {
  id: string;
  name?: string;
  birthdate?: string; // ISO date string (DOB)
  edd?: string; // ISO date string (Estimated Due Date)
  mode: BabyMode;
  isDefault: boolean;
  createdAt: string;
  updatedAt: string;
}

export interface Vault {
  id: string;
  babyId: string;
  targetAgeYears: number;
  unlockDate?: string; // ISO date string, derived from DOB/EDD + targetAgeYears
  status: VaultStatus;
  createdAt: string;
  updatedAt: string;
}

export interface MilestoneTemplate {
  id: string;
  label: string;
  description?: string;
  category: MilestoneCategory;
  ageWeeksMin?: number; // For born mode
  ageWeeksMax?: number;
  gestationWeeksMin?: number; // For pregnancy mode
  gestationWeeksMax?: number;
}

export interface MilestoneInstance {
  id: string;
  babyId: string;
  chapterId?: string;
  milestoneTemplateId: string;
  associatedMemoryId?: string; // NULL until filled
  expectedDate: string; // ISO date string
  filledDate?: string; // ISO date string, when filled
  status: MilestoneInstanceStatus;
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
  vaultId?: string; // set when entry belongs to a vault
  isPregnancyJournal: boolean; // true for pregnancy journal entries (chapterId is empty)
  memoryType: MemoryType;
  title: string;
  description?: string;
  date: string; // ISO date string
  // Location fields (optional)
  locationName?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  // Milestone fields (optional)
  milestoneTemplateId?: string; // Links to milestone template if from template
  isCustomMilestone?: boolean; // True if user-created, false if from template
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

export interface MilestoneInstanceWithTemplate extends MilestoneInstance {
  template: MilestoneTemplate;
  associatedMemory?: MemoryWithRelations;
}

export interface ChapterWithMilestoneProgress extends ChapterWithTags {
  milestoneTotal: number;
  milestoneFilled: number;
  memoryCount: number;
}

export interface ChapterWithMemories extends ChapterWithTags {
  memories: MemoryWithRelations[];
}

// Form types for creating/updating
export interface CreateBabyProfileInput {
  name?: string;
  birthdate?: string;
  edd?: string;
  mode?: BabyMode;
}

export interface UpdateBabyProfileInput extends Partial<CreateBabyProfileInput> {
  id: string;
}

export interface CreateVaultInput {
  babyId: string;
  targetAgeYears: number;
}

export interface VaultWithEntryCount extends Vault {
  entryCount: number;
  lastSavedAt?: string;
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
  vaultId?: string;
  isPregnancyJournal?: boolean;
  memoryType: MemoryType;
  title: string;
  description?: string;
  date: string;
  tagIds?: string[];
  photoUris?: string[];
  // Location fields
  locationName?: string;
  latitude?: number;
  longitude?: number;
  mapUrl?: string;
  // Milestone fields
  milestoneTemplateId?: string;
  isCustomMilestone?: boolean;
}

export interface UpdateMemoryInput extends Partial<Omit<CreateMemoryInput, "chapterId">> {
  id: string;
}

// Search types
export interface SearchResult {
  type: "chapter" | "memory" | "vault";
  id: string;
  title: string;
  matchedField: string;
  matchedText: string;
  chapterId?: string;
  chapterTitle?: string;
  vaultId?: string;
  memoryType?: MemoryType;
  isPregnancyJournal?: boolean;
}

export interface SearchFilters {
  resultType?: "all" | "chapter" | "memory" | "vault" | "pregnancy_journal";
  memoryType?: MemoryType;
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
}

// Export types
export interface ExportData {
  version: string;
  exportedAt: string;
  babyProfile: BabyProfile;
  chapters: ExportChapter[];
  vaults: ExportVault[];
  pregnancyJournalEntries: ExportMemory[];
  tags: Tag[];
}

export interface ExportVault extends Vault {
  entries: ExportMemory[];
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
