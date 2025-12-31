import * as logger from '@/lib/logger';
import { parseNoteBlocks, serializeNoteBlocks } from '@/lib/noteBlocks';
import { Memory } from '@/types/models';

import { openDb } from './index';

type MemoryRow = Omit<Memory, 'song' | 'noteBlocks'> & {
  songSpotifyTrackId?: string | null;
  songTitle?: string | null;
  songArtist?: string | null;
  songAlbumArtUrl?: string | null;
  songPreviewUrl?: string | null;
  noteBlocks?: string | null;
};

function mapRowToMemory(row: MemoryRow): Memory {
  const {
    songSpotifyTrackId,
    songTitle,
    songArtist,
    songAlbumArtUrl,
    songPreviewUrl,
    noteBlocks,
    ...rest
  } = row;

  const hasSong = songSpotifyTrackId && songTitle && songArtist;
  return {
    ...rest,
    noteBlocks: parseNoteBlocks(noteBlocks),
    song: hasSong
      ? {
          spotifyTrackId: songSpotifyTrackId,
          title: songTitle,
          artist: songArtist,
          albumArtUrl: songAlbumArtUrl ?? undefined,
          previewUrl: songPreviewUrl ?? undefined,
        }
      : undefined,
  };
}

export async function listMemories(): Promise<Memory[]> {
  try {
    const db = await openDb();
    const rows = await db.getAllAsync<MemoryRow>('SELECT * FROM memories ORDER BY happenedAt DESC');
    return rows.map(mapRowToMemory);
  } catch (error) {
    logger.error('Failed to list memories', error);
    throw error;
  }
}

export async function getMemoryById(id: string): Promise<Memory | null> {
  try {
    const db = await openDb();
    const memory = await db.getFirstAsync<MemoryRow>('SELECT * FROM memories WHERE id = ?', [id]);
    return memory ? mapRowToMemory(memory) : null;
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
      INSERT INTO memories (id, title, body, noteBlocks, createdAt, happenedAt, latitude, longitude, placeLabel, updatedAt, songSpotifyTrackId, songTitle, songArtist, songAlbumArtUrl, songPreviewUrl)
      VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)
      ON CONFLICT(id) DO UPDATE SET
        title = excluded.title,
        body = excluded.body,
        noteBlocks = excluded.noteBlocks,
        createdAt = excluded.createdAt,
        happenedAt = excluded.happenedAt,
        latitude = excluded.latitude,
        longitude = excluded.longitude,
        placeLabel = excluded.placeLabel,
        updatedAt = excluded.updatedAt,
        songSpotifyTrackId = excluded.songSpotifyTrackId,
        songTitle = excluded.songTitle,
        songArtist = excluded.songArtist,
        songAlbumArtUrl = excluded.songAlbumArtUrl,
        songPreviewUrl = excluded.songPreviewUrl;
    `,
      [
        memory.id,
        memory.title ?? null,
        memory.body ?? null,
        serializeNoteBlocks(memory.noteBlocks),
        memory.createdAt,
        memory.happenedAt,
        memory.latitude,
        memory.longitude,
        memory.placeLabel ?? null,
        memory.updatedAt,
        memory.song?.spotifyTrackId ?? null,
        memory.song?.title ?? null,
        memory.song?.artist ?? null,
        memory.song?.albumArtUrl ?? null,
        memory.song?.previewUrl ?? null,
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
