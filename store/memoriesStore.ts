import { create } from 'zustand';

import * as logger from '@/lib/logger';
import { deleteMemory, getMemoryById, listMemories, upsertMemory } from '@/lib/db/memories';
import { initDb } from '@/lib/db';
import { Memory, SpotifyTrack } from '@/types/models';

interface MemoriesState {
  memories: Memory[];
  isHydrated: boolean;
  hydrate: () => Promise<void>;
  upsert: (memory: Memory) => Promise<void>;
  remove: (id: string) => Promise<void>;
  setPinSong: (id: string, song: SpotifyTrack) => Promise<void>;
  removePinSong: (id: string) => Promise<void>;
}

export const useMemoriesStore = create<MemoriesState>((set, get) => ({
  memories: [],
  isHydrated: false,
  hydrate: async () => {
    try {
      await initDb();
      const data = await listMemories();
      set({ memories: data, isHydrated: true });
    } catch (error) {
      logger.error('Failed to hydrate memories', error);
      set({ isHydrated: true });
    }
  },
  upsert: async (memory) => {
    try {
      await initDb();
      await upsertMemory(memory);
      const data = await listMemories();
      set({ memories: data, isHydrated: true });
    } catch (error) {
      logger.error('Failed to upsert memory', memory.id, error);
    }
  },
  remove: async (id) => {
    try {
      await initDb();
      await deleteMemory(id);
      const data = await listMemories();
      set({ memories: data, isHydrated: true });
    } catch (error) {
      logger.error('Failed to delete memory', id, error);
    }
  },
  setPinSong: async (id, song) => {
    try {
      await initDb();
      const memory = (await getMemoryById(id)) ?? get().memories.find((item) => item.id === id);

      if (!memory) {
        logger.warn('Cannot attach song; memory not found', id);
        return;
      }

      await upsertMemory({ ...memory, song });
      const data = await listMemories();
      set({ memories: data, isHydrated: true });
    } catch (error) {
      logger.error('Failed to set pin song', id, error);
    }
  },
  removePinSong: async (id) => {
    try {
      await initDb();
      const memory = (await getMemoryById(id)) ?? get().memories.find((item) => item.id === id);

      if (!memory) {
        logger.warn('Cannot remove song; memory not found', id);
        return;
      }

      await upsertMemory({ ...memory, song: undefined });
      const data = await listMemories();
      set({ memories: data, isHydrated: true });
    } catch (error) {
      logger.error('Failed to remove pin song', id, error);
    }
  },
}));
