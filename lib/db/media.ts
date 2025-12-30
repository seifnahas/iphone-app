import * as logger from '@/lib/logger';
import { MemoryMedia } from '@/types/models';

import { openDb } from './index';

export async function listMediaByMemoryId(memoryId: string): Promise<MemoryMedia[]> {
  try {
    const db = await openDb();
    const media = await db.getAllAsync<MemoryMedia>(
      'SELECT * FROM memory_media WHERE memoryId = ? ORDER BY createdAt DESC',
      [memoryId],
    );
    return media;
  } catch (error) {
    logger.error('Failed to list media by memory id', memoryId, error);
    throw error;
  }
}

export async function addMedia(media: MemoryMedia): Promise<void> {
  try {
    const db = await openDb();
    await db.runAsync(
      `
      INSERT INTO memory_media (id, memoryId, type, uri, createdAt)
      VALUES (?, ?, ?, ?, ?);
    `,
      [media.id, media.memoryId, media.type, media.uri, media.createdAt],
    );
  } catch (error) {
    logger.error('Failed to add media', media.id, error);
    throw error;
  }
}

export async function deleteMedia(id: string): Promise<void> {
  try {
    const db = await openDb();
    await db.runAsync('DELETE FROM memory_media WHERE id = ?', [id]);
  } catch (error) {
    logger.error('Failed to delete media', id, error);
    throw error;
  }
}
