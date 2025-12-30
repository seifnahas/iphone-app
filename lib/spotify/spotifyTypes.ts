import { SpotifyTrack } from '@/types/models';

export type SpotifyExternalTrack = {
  id: string;
  name: string;
  artists: { name: string }[];
  album: {
    images?: { url: string }[];
  };
  preview_url?: string | null;
};

export type SpotifySearchResponse = {
  tracks?: {
    items: SpotifyExternalTrack[];
  };
};

export function normalizeTrack(track: SpotifyExternalTrack): SpotifyTrack {
  return {
    spotifyTrackId: track.id,
    title: track.name,
    artist: track.artists.map((artist) => artist.name).join(', '),
    albumArtUrl: track.album.images?.[0]?.url,
    previewUrl: track.preview_url ?? undefined,
  };
}
