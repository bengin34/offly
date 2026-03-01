import * as SQLite from "expo-sqlite";
import {
  ALL_MIGRATIONS,
  ALTER_CHAPTERS_ADD_ARCHIVED_AT,
  ALTER_MEMORIES_ADD_BABY_ID,
  UPGRADE_MIGRATIONS,
} from "./schema";
import { generateUUID } from "../utils/uuid";

const DATABASE_NAME = "Offly.db";

let db: SQLite.SQLiteDatabase | null = null;
let dbInitPromise: Promise<SQLite.SQLiteDatabase> | null = null;

export async function getDatabase(): Promise<SQLite.SQLiteDatabase> {
  if (db) {
    return db;
  }

  if (dbInitPromise) {
    return dbInitPromise;
  }

  dbInitPromise = (async () => {
    const openedDb = await SQLite.openDatabaseAsync(DATABASE_NAME);
    db = openedDb;

    // Enable foreign keys
    await runStatement(openedDb, "PRAGMA foreign_keys = ON;");
    // Wait briefly instead of failing immediately when a write lock is active.
    await runStatement(openedDb, "PRAGMA busy_timeout = 5000;");

    // Run create-table migrations (idempotent via IF NOT EXISTS)
    for (const migration of ALL_MIGRATIONS) {
      await runStatement(openedDb, migration);
    }

    await ensureRequiredColumns(openedDb);

    // Run ALTER upgrades safely (column may already exist)
    for (const migration of UPGRADE_MIGRATIONS) {
      try {
        await runStatement(openedDb, migration);
      } catch (error) {
        // Keep startup resilient but don't hide unexpected migration issues.
        const message = error instanceof Error ? error.message : String(error);
        if (
          !message.toLowerCase().includes("duplicate column name") &&
          !message.toLowerCase().includes("already exists")
        ) {
          console.warn("[db:migration] failed:", message);
        }
      }
    }

    // Ensure default baby profile exists
    await ensureDefaultBabyProfile(openedDb);

    return openedDb;
  })();

  try {
    return await dbInitPromise;
  } catch (error) {
    db = null;
    throw error;
  } finally {
    dbInitPromise = null;
  }
}

async function ensureRequiredColumns(database: SQLite.SQLiteDatabase): Promise<void> {
  await ensureColumnExists(database, "chapters", "archived_at", ALTER_CHAPTERS_ADD_ARCHIVED_AT);
  await ensureColumnExists(database, "memories", "baby_id", ALTER_MEMORIES_ADD_BABY_ID);
}

async function ensureColumnExists(
  database: SQLite.SQLiteDatabase,
  tableName: string,
  columnName: string,
  addColumnSql: string
): Promise<void> {
  const columns = await database.getAllAsync<{ name: string }>(
    `PRAGMA table_info(${tableName})`
  );
  const hasColumn = columns.some((column) => column.name === columnName);
  if (!hasColumn) {
    await runStatement(database, addColumnSql);
  }
}

async function ensureDefaultBabyProfile(
  database: SQLite.SQLiteDatabase
): Promise<void> {
  const existing = await database.getFirstAsync<{ count: number }>(
    "SELECT COUNT(*) as count FROM baby_profiles"
  );

  if (!existing || existing.count === 0) {
    const id = generateUUID();
    const now = new Date().toISOString();

    await database.runAsync(
      `INSERT INTO baby_profiles (id, name, is_default, created_at, updated_at)
       VALUES (?, ?, 1, ?, ?)`,
      [id, null, now, now]
    );
  }
}

export async function closeDatabase(): Promise<void> {
  dbInitPromise = null;
  if (db) {
    await db.closeAsync();
    db = null;
  }
}

// Helper to generate timestamps
export function getTimestamp(): string {
  return new Date().toISOString();
}

async function runStatement(
  database: SQLite.SQLiteDatabase,
  sql: string
): Promise<void> {
  await database.runAsync(sql);
}
