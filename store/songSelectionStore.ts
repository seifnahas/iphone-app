import { create } from 'zustand';

import { SpotifyTrack } from '@/types/models';

type SongSelectionState = {
  pendingSong: SpotifyTrack | null;
  setPendingSong: (song: SpotifyTrack) => void;
  consumePendingSong: () => SpotifyTrack | null;
  clear: () => void;
};

export const useSongSelectionStore = create<SongSelectionState>((set, get) => ({
  pendingSong: null,
  setPendingSong: (song) => set({ pendingSong: song }),
  consumePendingSong: () => {
    const song = get().pendingSong;
    set({ pendingSong: null });
    return song;
  },
  clear: () => set({ pendingSong: null }),
}));
