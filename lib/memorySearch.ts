import * as logger from '@/lib/logger';
import { Memory } from '@/types/models';

export type MemorySongFilter = 'all' | 'withSong' | 'withoutSong';
export type MemorySortOrder = 'newest' | 'oldest';

export const normalizeText = (value: string) => value.toLowerCase().trim().replace(/\s+/g, ' ');

export const memoryMatchesQuery = (memory: Memory, normalizedQuery: string) => {
  if (!normalizedQuery) {
    return true;
  }

  const fields = [memory.title, memory.body, memory.placeLabel];
  return fields.some((field) => field && normalizeText(field).includes(normalizedQuery));
};

let hasLoggedInvalidDate = false;

const sortMemories = (memories: Memory[], sort: MemorySortOrder) => {
  let encounteredInvalidDate = false;

  const sorted = [...memories].sort((a, b) => {
    const aTime = Date.parse(a.happenedAt);
    const bTime = Date.parse(b.happenedAt);

    if (Number.isNaN(aTime) || Number.isNaN(bTime)) {
      encounteredInvalidDate = true;
      return 0;
    }

    return sort === 'newest' ? bTime - aTime : aTime - bTime;
  });

  if (encounteredInvalidDate) {
    if (!hasLoggedInvalidDate) {
      logger.error('Encountered invalid happenedAt while sorting memories.');
      hasLoggedInvalidDate = true;
    }
    return memories;
  }

  return sorted;
};

export const filterAndSortMemories = (
  memories: Memory[],
  options: { query: string; filterHasSong: MemorySongFilter; sort: MemorySortOrder },
) => {
  const normalizedQuery = normalizeText(options.query);

  const filtered = memories.filter((memory) => {
    const matchesQuery = memoryMatchesQuery(memory, normalizedQuery);

    if (!matchesQuery) return false;
    if (options.filterHasSong === 'withSong') return Boolean(memory.song);
    if (options.filterHasSong === 'withoutSong') return !memory.song;

    return true;
  });

  return sortMemories(filtered, options.sort);
};
