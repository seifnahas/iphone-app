import Constants from 'expo-constants';
import * as Linking from 'expo-linking';
import * as WebBrowser from 'expo-web-browser';

import * as logger from '@/lib/logger';

type CachedToken = {
  accessToken: string;
  expiresAt?: number;
};

let cachedToken: CachedToken | null = null;

const FALLBACK_REDIRECT = Linking.createURL('spotify-auth');

export function getConfiguredClientId(): string | undefined {
  return (
    Constants?.expoConfig?.extra?.spotifyClientId ??
    process.env.EXPO_PUBLIC_SPOTIFY_CLIENT_ID ??
    undefined
  );
}

export async function getAccessToken(): Promise<string | null> {
  const envToken =
    Constants?.expoConfig?.extra?.spotifyAccessToken ??
    process.env.EXPO_PUBLIC_SPOTIFY_ACCESS_TOKEN;

  if (envToken) {
    return envToken;
  }

  if (cachedToken && (!cachedToken.expiresAt || cachedToken.expiresAt > Date.now())) {
    return cachedToken.accessToken;
  }

  logger.warn(
    'Spotify auth is not configured. Provide EXPO_PUBLIC_SPOTIFY_ACCESS_TOKEN or implement PKCE auth.',
  );
  return null;
}

export async function beginAuth(): Promise<void> {
  const clientId = getConfiguredClientId();

  if (!clientId) {
    logger.warn('Cannot start Spotify auth: missing client ID.');
    return;
  }

  // TODO: Implement Authorization Code with PKCE using an approved dependency.
  // We avoid adding new dependencies; once expo-auth-session (or similar) is approved,
  // replace this placeholder with a full PKCE flow and secure token persistence.
  const redirectUri = FALLBACK_REDIRECT;
  const authUrl = `https://accounts.spotify.com/authorize?client_id=${encodeURIComponent(
    clientId,
  )}&response_type=code&redirect_uri=${encodeURIComponent(
    redirectUri,
  )}&scope=${encodeURIComponent('user-read-email')}&code_challenge_method=S256&code_challenge=TODO`;

  try {
    await WebBrowser.openBrowserAsync(authUrl);
  } catch (error) {
    logger.error('Failed to open Spotify auth page', error);
  }
}

export function cacheAccessToken(accessToken: string, expiresInSeconds?: number) {
  cachedToken = {
    accessToken,
    expiresAt: expiresInSeconds ? Date.now() + expiresInSeconds * 1000 : undefined,
  };
}
