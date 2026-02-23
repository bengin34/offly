// SQLite schema definitions for Offly

export const CREATE_BABY_PROFILES_TABLE = `
  CREATE TABLE IF NOT EXISTS baby_profiles (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT,
    birthdate TEXT,
    edd TEXT,
    mode TEXT NOT NULL DEFAULT 'born',
    is_default INTEGER NOT NULL DEFAULT 0,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
  );
`;

export const CREATE_CHAPTERS_TABLE = `
  CREATE TABLE IF NOT EXISTS chapters (
    id TEXT PRIMARY KEY NOT NULL,
    baby_id TEXT NOT NULL,
    title TEXT NOT NULL,
    start_date TEXT NOT NULL,
    end_date TEXT,
    description TEXT,
    cover_image_uri TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (baby_id) REFERENCES baby_profiles (id) ON DELETE CASCADE
  );
`;

export const CREATE_MEMORIES_TABLE = `
  CREATE TABLE IF NOT EXISTS memories (
    id TEXT PRIMARY KEY NOT NULL,
    chapter_id TEXT,
    vault_id TEXT,
    is_pregnancy_journal INTEGER NOT NULL DEFAULT 0,
    memory_type TEXT NOT NULL CHECK (memory_type IN ('milestone', 'note', 'letter')),
    title TEXT NOT NULL,
    description TEXT,
    date TEXT NOT NULL,
    location_name TEXT,
    latitude REAL,
    longitude REAL,
    map_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE CASCADE,
    FOREIGN KEY (vault_id) REFERENCES vaults (id) ON DELETE CASCADE
  );
`;

export const CREATE_TAGS_TABLE = `
  CREATE TABLE IF NOT EXISTS tags (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT NOT NULL UNIQUE
  );
`;

export const CREATE_MEMORY_TAGS_TABLE = `
  CREATE TABLE IF NOT EXISTS memory_tags (
    memory_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (memory_id, tag_id),
    FOREIGN KEY (memory_id) REFERENCES memories (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
  );
`;

export const CREATE_CHAPTER_TAGS_TABLE = `
  CREATE TABLE IF NOT EXISTS chapter_tags (
    chapter_id TEXT NOT NULL,
    tag_id TEXT NOT NULL,
    PRIMARY KEY (chapter_id, tag_id),
    FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE CASCADE,
    FOREIGN KEY (tag_id) REFERENCES tags (id) ON DELETE CASCADE
  );
`;

export const CREATE_MEMORY_PHOTOS_TABLE = `
  CREATE TABLE IF NOT EXISTS memory_photos (
    id TEXT PRIMARY KEY NOT NULL,
    memory_id TEXT NOT NULL,
    uri TEXT NOT NULL,
    order_index INTEGER NOT NULL DEFAULT 0,
    FOREIGN KEY (memory_id) REFERENCES memories (id) ON DELETE CASCADE
  );
`;

export const CREATE_VAULTS_TABLE = `
  CREATE TABLE IF NOT EXISTS vaults (
    id TEXT PRIMARY KEY NOT NULL,
    baby_id TEXT NOT NULL,
    target_age_years INTEGER NOT NULL,
    unlock_date TEXT,
    status TEXT NOT NULL DEFAULT 'locked' CHECK (status IN ('locked', 'unlocked')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (baby_id) REFERENCES baby_profiles (id) ON DELETE CASCADE
  );
`;

export const CREATE_VAULTS_BABY_ID_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_vaults_baby_id ON vaults (baby_id);
`;

export const CREATE_MEMORIES_VAULT_ID_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_memories_vault_id ON memories (vault_id);
`;

export const CREATE_MEMORIES_PREGNANCY_JOURNAL_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_memories_pregnancy_journal ON memories (is_pregnancy_journal);
`;

export const CREATE_MILESTONE_INSTANCES_TABLE = `
  CREATE TABLE IF NOT EXISTS milestone_instances (
    id TEXT PRIMARY KEY NOT NULL,
    baby_id TEXT NOT NULL,
    chapter_id TEXT,
    milestone_template_id TEXT NOT NULL,
    associated_memory_id TEXT,
    expected_date TEXT NOT NULL,
    filled_date TEXT,
    status TEXT NOT NULL DEFAULT 'pending' CHECK (status IN ('pending', 'filled', 'archived')),
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (baby_id) REFERENCES baby_profiles (id) ON DELETE CASCADE,
    FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE CASCADE,
    FOREIGN KEY (associated_memory_id) REFERENCES memories (id) ON DELETE SET NULL
  );
`;

export const CREATE_MILESTONE_INSTANCES_BABY_ID_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_milestone_instances_baby_id ON milestone_instances (baby_id);
`;

export const CREATE_MILESTONE_INSTANCES_STATUS_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_milestone_instances_status ON milestone_instances (status);
`;

export const CREATE_MILESTONE_INSTANCES_EXPECTED_DATE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_milestone_instances_expected_date ON milestone_instances (expected_date);
`;

// Migration: add columns to existing tables for upgrades
export const ALTER_BABY_PROFILES_ADD_EDD = `
  ALTER TABLE baby_profiles ADD COLUMN edd TEXT;
`;

export const ALTER_BABY_PROFILES_ADD_MODE = `
  ALTER TABLE baby_profiles ADD COLUMN mode TEXT NOT NULL DEFAULT 'born';
`;

export const ALTER_MEMORIES_ADD_VAULT_ID = `
  ALTER TABLE memories ADD COLUMN vault_id TEXT REFERENCES vaults(id) ON DELETE CASCADE;
`;

export const ALTER_MEMORIES_ADD_IS_PREGNANCY_JOURNAL = `
  ALTER TABLE memories ADD COLUMN is_pregnancy_journal INTEGER NOT NULL DEFAULT 0;
`;

export const ALTER_MEMORIES_ADD_MILESTONE_TEMPLATE_ID = `
  ALTER TABLE memories ADD COLUMN milestone_template_id TEXT;
`;

export const ALTER_MEMORIES_ADD_IS_CUSTOM_MILESTONE = `
  ALTER TABLE memories ADD COLUMN is_custom_milestone INTEGER DEFAULT 0;
`;

export const ALTER_MILESTONE_INSTANCES_ADD_CHAPTER_ID = `
  ALTER TABLE milestone_instances ADD COLUMN chapter_id TEXT REFERENCES chapters(id) ON DELETE CASCADE;
`;

// Archive & undo support for pregnant→born mode switch
export const ALTER_CHAPTERS_ADD_ARCHIVED_AT = `
  ALTER TABLE chapters ADD COLUMN archived_at TEXT;
`;

export const ALTER_BABY_PROFILES_ADD_PREVIOUS_MODE = `
  ALTER TABLE baby_profiles ADD COLUMN previous_mode TEXT;
`;

export const ALTER_BABY_PROFILES_ADD_PREVIOUS_EDD = `
  ALTER TABLE baby_profiles ADD COLUMN previous_edd TEXT;
`;

export const ALTER_BABY_PROFILES_ADD_MODE_SWITCHED_AT = `
  ALTER TABLE baby_profiles ADD COLUMN mode_switched_at TEXT;
`;

export const ALTER_BABY_PROFILES_ADD_SHOW_ARCHIVED_CHAPTERS = `
  ALTER TABLE baby_profiles ADD COLUMN show_archived_chapters INTEGER DEFAULT 1;
`;

// Indexes for search performance
export const CREATE_CHAPTERS_TITLE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_chapters_title ON chapters (title);
`;

export const CREATE_CHAPTERS_BABY_ID_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_chapters_baby_id ON chapters (baby_id);
`;

export const CREATE_MEMORIES_TITLE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_memories_title ON memories (title);
`;

export const CREATE_MEMORIES_CHAPTER_ID_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_memories_chapter_id ON memories (chapter_id);
`;

export const CREATE_MEMORIES_DATE_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_memories_date ON memories (date);
`;

export const CREATE_TAGS_NAME_INDEX = `
  CREATE INDEX IF NOT EXISTS idx_tags_name ON tags (name);
`;

export const ALL_MIGRATIONS = [
  CREATE_BABY_PROFILES_TABLE,
  CREATE_CHAPTERS_TABLE,
  CREATE_VAULTS_TABLE,
  CREATE_MEMORIES_TABLE,
  CREATE_TAGS_TABLE,
  CREATE_MEMORY_TAGS_TABLE,
  CREATE_CHAPTER_TAGS_TABLE,
  CREATE_MEMORY_PHOTOS_TABLE,
  CREATE_MILESTONE_INSTANCES_TABLE,
  CREATE_CHAPTERS_TITLE_INDEX,
  CREATE_CHAPTERS_BABY_ID_INDEX,
  CREATE_MEMORIES_TITLE_INDEX,
  CREATE_MEMORIES_CHAPTER_ID_INDEX,
  CREATE_MEMORIES_DATE_INDEX,
  CREATE_TAGS_NAME_INDEX,
  CREATE_VAULTS_BABY_ID_INDEX,
  CREATE_MEMORIES_VAULT_ID_INDEX,
  CREATE_MEMORIES_PREGNANCY_JOURNAL_INDEX,
  CREATE_MILESTONE_INSTANCES_BABY_ID_INDEX,
  CREATE_MILESTONE_INSTANCES_STATUS_INDEX,
  CREATE_MILESTONE_INSTANCES_EXPECTED_DATE_INDEX,
];

// ALTER migrations for existing installs (run safely — column may already exist)
export const UPGRADE_MIGRATIONS = [
  ALTER_BABY_PROFILES_ADD_EDD,
  ALTER_BABY_PROFILES_ADD_MODE,
  ALTER_MEMORIES_ADD_VAULT_ID,
  ALTER_MEMORIES_ADD_IS_PREGNANCY_JOURNAL,
  ALTER_MEMORIES_ADD_MILESTONE_TEMPLATE_ID,
  ALTER_MEMORIES_ADD_IS_CUSTOM_MILESTONE,
  ALTER_MILESTONE_INSTANCES_ADD_CHAPTER_ID,
  ALTER_CHAPTERS_ADD_ARCHIVED_AT,
  ALTER_BABY_PROFILES_ADD_PREVIOUS_MODE,
  ALTER_BABY_PROFILES_ADD_PREVIOUS_EDD,
  ALTER_BABY_PROFILES_ADD_MODE_SWITCHED_AT,
  ALTER_BABY_PROFILES_ADD_SHOW_ARCHIVED_CHAPTERS,
];
