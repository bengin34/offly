import * as SQLite from "expo-sqlite";
import { ALL_MIGRATIONS } from "./schema";
import { v4 as uuidv4 } from "uuid";

const DATABASE_NAME = "BabyLegacy.db";

let db: SQLite.SQLiteDatabase | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  db = await SQLite.openDatabaseAsync(DATABASE_NAME);

  // Enable foreign keys
  await db.execAsync("PRAGMA foreign_keys = ON;");

  // Run migrations
  for (const migration of ALL_MIGRATIONS) {
    await db.execAsync(migration);
  }

  // Ensure default baby profile exists
  await ensureDefaultBabyProfile(db);

  return db;
}

async function ensureDefaultBabyProfile(
  database: SQLite.SQLiteDatabase
): Promise<void> {
  const existing = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM baby_profiles"
  );

  if (!existing || existing.count === 0) {
    const id = uuidv4();
    const now = new Date().toISOString();
    await database.runAsync(
      `INSERT INTO baby_profiles (id, name, is_default, created_at, updated_at)
       VALUES (?, ?, 1, ?, ?)`,
      [id, null, now, now]
    );
  }
}

export async function closeDatabase(): Promise<void> {
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

// Helper to generate timestamps
export function getTimestamp(): string {
  return new Date().toISOString();
}
