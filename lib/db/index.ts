import * as SQLite from 'expo-sqlite';

import * as logger from '@/lib/logger';

let dbPromise: Promise<SQLite.SQLiteDatabase> | undefined;

export function openDb(): Promise<SQLite.SQLiteDatabase> {
  dbPromise ??= SQLite.openDatabaseAsync('memories.db');
  return dbPromise;
}

export async function initDb() {
  try {
    const db = await openDb();

    await db.execAsync('PRAGMA foreign_keys = ON;');
    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS memories (
        id TEXT PRIMARY KEY,
        title TEXT NULL,
        body TEXT NULL,
        createdAt TEXT NOT NULL,
        happenedAt TEXT NOT NULL,
        latitude REAL NOT NULL,
        longitude REAL NOT NULL,
        placeLabel TEXT NULL,
        updatedAt TEXT NOT NULL
      );
    `);

    await db.execAsync(`
      CREATE TABLE IF NOT EXISTS memory_media (
        id TEXT PRIMARY KEY,
        memoryId TEXT NOT NULL,
        type TEXT NOT NULL,
        uri TEXT NOT NULL,
        createdAt TEXT NOT NULL,
        FOREIGN KEY (memoryId) REFERENCES memories(id) ON DELETE CASCADE
      );
    `);

    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_memories_happened_at ON memories(happenedAt);');
    await db.execAsync('CREATE INDEX IF NOT EXISTS idx_media_memory_id ON memory_media(memoryId);');
  } catch (error) {
    logger.error('Failed to initialize database', error);
    throw error;
  }
}
