import { SpotifyTrack } from '@/types/models';

import * as logger from '../logger';
import { getAccessToken } from './spotifyAuth';
import { SpotifySearchResponse, SpotifyExternalTrack, normalizeTrack } from './spotifyTypes';

const SEARCH_URL = 'https://api.spotify.com/v1/search';

export async function searchTracks(query: string): Promise<SpotifyTrack[]> {
  const trimmed = query.trim();

  if (!trimmed) {
    return [];
  }

  const accessToken = await getAccessToken();

  if (!accessToken) {
    throw new Error('Spotify not connected. Please sign in to search.');
  }

  const url = `${SEARCH_URL}?q=${encodeURIComponent(trimmed)}&type=track&limit=20`;

  try {
    const response = await fetch(url, {
      headers: {
        Authorization: `Bearer ${accessToken}`,
      },
    });

    if (!response.ok) {
      const text = await response.text();
      logger.error('Spotify search failed', response.status, text);
      throw new Error('Spotify search failed. Please try again.');
    }

    const data = (await response.json()) as SpotifySearchResponse;
    const items: SpotifyExternalTrack[] = data.tracks?.items ?? [];
    return items.map(normalizeTrack);
  } catch (error) {
    logger.error('Spotify search error', error);
    throw error;
  }
}
