import * as logger from '@/lib/logger';
import { Memory } from '@/types/models';

import { openDb } from './index';

export async function listMemories(): Promise<Memory[]> {
  try {
    const db = await openDb();
    const rows = await db.getAllAsync<Memory>('SELECT * FROM memories ORDER BY happenedAt DESC');
    return rows;
  } catch (error) {
    logger.error('Failed to list memories', error);
    throw error;
  }
}

export async function getMemoryById(id: string): Promise<Memory | null> {
  try {
    const db = await openDb();
    const memory = await db.getFirstAsync<Memory>('SELECT * FROM memories WHERE id = ?', [id]);
    return memory ?? null;
  } catch (error) {
    logger.error('Failed to get memory by id', id, error);
    throw error;
  }
}

export async function upsertMemory(memory: Memory): Promise<void> {
  try {
    const db = await openDb();
    await db.runAsync(
      `
      INSERT INTO memories (id, title, body, createdAt, happenedAt, latitude, longitude, placeLabel, updatedAt)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        body = excluded.body,
        createdAt = excluded.createdAt,
        happenedAt = excluded.happenedAt,
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        placeLabel = excluded.placeLabel,
        updatedAt = excluded.updatedAt;
    `,
      [
        memory.id,
        memory.title ?? null,
        memory.body ?? null,
        memory.createdAt,
        memory.happenedAt,
        memory.latitude,
        memory.longitude,
        memory.placeLabel ?? null,
        memory.updatedAt,
      ],
    );
  } catch (error) {
    logger.error('Failed to upsert memory', memory.id, error);
    throw error;
  }
}

export async function deleteMemory(id: string): Promise<void> {
  try {
    const db = await openDb();
    await db.runAsync('DELETE FROM memory_media WHERE memoryId = ?', [id]);
    await db.runAsync('DELETE FROM memories WHERE id = ?', [id]);
  } catch (error) {
    logger.error('Failed to delete memory', id, error);
    throw error;
  }
}
