// SQLite schema definitions for BabyLegacy

export const CREATE_BABY_PROFILES_TABLE = `
  CREATE TABLE IF NOT EXISTS baby_profiles (
    id TEXT PRIMARY KEY NOT NULL,
    name TEXT,
    birthdate TEXT,
    avatar_uri TEXT,
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
    chapter_id TEXT NOT NULL,
    memory_type TEXT NOT NULL CHECK (memory_type IN ('milestone', 'note')),
    title TEXT NOT NULL,
    description TEXT,
    importance INTEGER,
    date TEXT NOT NULL,
    location_name TEXT,
    latitude REAL,
    longitude REAL,
    map_url TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY (chapter_id) REFERENCES chapters (id) ON DELETE CASCADE
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
  CREATE_MEMORIES_TABLE,
  CREATE_TAGS_TABLE,
  CREATE_MEMORY_TAGS_TABLE,
  CREATE_CHAPTER_TAGS_TABLE,
  CREATE_MEMORY_PHOTOS_TABLE,
  CREATE_CHAPTERS_TITLE_INDEX,
  CREATE_CHAPTERS_BABY_ID_INDEX,
  CREATE_MEMORIES_TITLE_INDEX,
  CREATE_MEMORIES_CHAPTER_ID_INDEX,
  CREATE_MEMORIES_DATE_INDEX,
  CREATE_TAGS_NAME_INDEX,
];
