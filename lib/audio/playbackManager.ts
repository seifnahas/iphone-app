import { SpotifyTrack } from '@/types/models';

import * as logger from '../logger';

export type PlaybackStatus = 'idle' | 'loading' | 'playing' | 'paused' | 'unavailable' | 'error';

export type PlaybackState = {
  status: PlaybackStatus;
  trackId: string | null;
  error?: string;
};

type AudioModule = typeof import('expo-av');
type SoundInstance = {
  unloadAsync: () => Promise<void>;
  pauseAsync: () => Promise<void>;
  setOnPlaybackStatusUpdate: (callback?: (status: unknown) => void) => void;
};

let currentState: PlaybackState = { status: 'idle', trackId: null };
let sound: SoundInstance | null = null;
let audioModule: AudioModule | null = null;
let isAudioChecked = false;
const listeners = new Set<(state: PlaybackState) => void>();

function notify(next: PlaybackState) {
  currentState = next;
  listeners.forEach((listener) => listener(next));
}

async function ensureAudioModule(): Promise<AudioModule | null> {
  if (audioModule || isAudioChecked) {
    return audioModule;
  }

  isAudioChecked = true;

  try {
    audioModule = await import('expo-av');
  } catch (error) {
    logger.warn('expo-av is not available; audio playback disabled', error);
    notify({
      status: 'unavailable',
      trackId: currentState.trackId,
      error: 'Audio playback unavailable (expo-av missing).',
    });
    audioModule = null;
  }

  return audioModule;
}

export function getState(): PlaybackState {
  return currentState;
}

export function subscribe(listener: (state: PlaybackState) => void) {
  listeners.add(listener);
  listener(currentState);

  return () => {
    listeners.delete(listener);
  };
}

async function unloadSound() {
  if (sound) {
    try {
      await sound.unloadAsync();
    } catch (error) {
      logger.warn('Failed to unload sound', error);
    } finally {
      sound = null;
    }
  }
}

export async function stop() {
  await unloadSound();
  notify({ status: 'idle', trackId: null });
}

export async function pause() {
  if (!sound) {
    return;
  }

  try {
    await sound.pauseAsync();
    notify({ status: 'paused', trackId: currentState.trackId });
  } catch (error) {
    logger.error('Failed to pause playback', error);
    notify({ status: 'error', trackId: currentState.trackId, error: 'Failed to pause playback.' });
  }
}

export async function play(track: SpotifyTrack) {
  if (!track.previewUrl) {
    notify({ status: 'error', trackId: track.spotifyTrackId, error: 'Preview not available.' });
    return;
  }

  const audio = await ensureAudioModule();

  if (!audio) {
    return;
  }

  await unloadSound();

  notify({ status: 'loading', trackId: track.spotifyTrackId });

  try {
    const { sound: createdSound } = await audio.Audio.Sound.createAsync(
      { uri: track.previewUrl },
      { shouldPlay: true },
    );

    sound = createdSound as SoundInstance;
    notify({ status: 'playing', trackId: track.spotifyTrackId });

    sound.setOnPlaybackStatusUpdate?.((status: any) => {
      if (!status.isLoaded) {
        return;
      }

      if (status.didJustFinish) {
        notify({ status: 'idle', trackId: null });
      }
    });
  } catch (error) {
    logger.error('Failed to start playback', error);
    notify({
      status: 'error',
      trackId: track.spotifyTrackId,
      error: 'Unable to play preview.',
    });
  }
}
