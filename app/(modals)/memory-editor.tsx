import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useEffect, useMemo, useState } from 'react';
import {
  Alert,
  KeyboardAvoidingView,
  Platform,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { colors, spacing, text as textTokens } from '@/components/ui/tokens';
import * as logger from '@/lib/logger';
import { getMemoryById } from '@/lib/db/memories';
import { generateId } from '@/lib/id';
import { useMemoriesStore } from '@/store/memoriesStore';
import { useSongSelectionStore } from '@/store/songSelectionStore';
import { Memory, SpotifyTrack } from '@/types/models';

type MemoryEditorParams = {
  id?: string | string[];
  latitude?: string | string[];
  longitude?: string | string[];
  happenedAt?: string | string[];
};

const parseNumberParam = (value?: string | string[]) => {
  if (!value) return null;

  const raw = Array.isArray(value) ? value[0] : value;
  const parsed = Number(raw);

  return Number.isFinite(parsed) ? parsed : null;
};

const getSingleParam = (value?: string | string[]) => {
  if (!value) return null;
  return Array.isArray(value) ? value[0] : value;
};

export default function MemoryEditorModal() {
  const router = useRouter();
  const params = useLocalSearchParams<MemoryEditorParams>();
  const upsert = useMemoriesStore((state) => state.upsert);
  const consumePendingSong = useSongSelectionStore((state) => state.consumePendingSong);

  const memoryId = getSingleParam(params.id);
  const isEditing = Boolean(memoryId);

  const latitudeFromParams = parseNumberParam(params.latitude);
  const longitudeFromParams = parseNumberParam(params.longitude);
  const initialHappenedAt = useMemo(
    () => getSingleParam(params.happenedAt) ?? new Date().toISOString(),
    [params.happenedAt],
  );

  const fallbackLocation = useMemo(
    () => ({
      latitude: 51.5074 + (Math.random() - 0.5) * 0.1,
      longitude: -0.1278 + (Math.random() - 0.5) * 0.1,
    }),
    [],
  );

  const [title, setTitle] = useState('');
  const [happenedAt, setHappenedAt] = useState(initialHappenedAt);
  const [body, setBody] = useState('');
  const [placeLabel, setPlaceLabel] = useState('Pinned location'); // TODO: replace with reverse geocoded label
  const [existingMemory, setExistingMemory] = useState<Memory | null>(null);
  const [isLoading, setIsLoading] = useState<boolean>(isEditing);
  const [isSaving, setIsSaving] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [song, setSong] = useState<SpotifyTrack | undefined>(undefined);

  useEffect(() => {
    if (!memoryId) return;

    let isMounted = true;

    const loadMemory = async () => {
      setError(null);
      setIsLoading(true);

      try {
        const record = await getMemoryById(memoryId);

        if (!isMounted) return;

        if (!record) {
          setError('Memory not found.');
          return;
        }

        setExistingMemory(record);
        setTitle(record.title ?? '');
        setBody(record.body ?? '');
        setHappenedAt(record.happenedAt);
        setPlaceLabel(record.placeLabel ?? '');
        setSong(record.song ?? undefined);
      } catch (loadError) {
        if (!isMounted) return;
        logger.error('Failed to load memory for editing', memoryId, loadError);
        setError('Failed to load memory. Please try again.');
      } finally {
        if (isMounted) {
          setIsLoading(false);
        }
      }
    };

    loadMemory();

    return () => {
      isMounted = false;
    };
  }, [memoryId]);

  useFocusEffect(
    useCallback(() => {
      const pending = consumePendingSong();
      if (pending) {
        setSong(pending);
      }
    }, [consumePendingSong]),
  );

  const latitude = existingMemory
    ? existingMemory.latitude
    : latitudeFromParams ?? fallbackLocation.latitude;
  const longitude = existingMemory
    ? existingMemory.longitude
    : longitudeFromParams ?? fallbackLocation.longitude;

  const trimmedTitle = title.trim();
  const parsedDate = new Date(happenedAt);
  const isTitleValid = Boolean(trimmedTitle);
  const isDateValid = !Number.isNaN(parsedDate.getTime());
  const isSaveDisabled = isSaving || isLoading || !isTitleValid || !isDateValid;

  const handleSave = async () => {
    if (isSaving || (isEditing && !existingMemory) || isLoading) {
      return;
    }

    const trimmedPlaceLabel = placeLabel.trim();
    const trimmedBody = body.trim();

    if (!isTitleValid) {
      Alert.alert('Title required', 'Please add a title before saving.');
      return;
    }

    if (!isDateValid) {
      Alert.alert('Invalid date', 'Use a valid ISO date (e.g. 2024-06-01T12:00:00Z).');
      return;
    }

    setIsSaving(true);
    setError(null);

    const now = new Date().toISOString();

    const memoryToSave: Memory = existingMemory
      ? {
          ...existingMemory,
          title: trimmedTitle,
          body: trimmedBody || undefined,
          happenedAt: parsedDate.toISOString(),
          placeLabel: trimmedPlaceLabel || undefined,
          updatedAt: now,
          song,
        }
      : {
          id: generateId(),
          title: trimmedTitle,
          body: trimmedBody || undefined,
          createdAt: now,
          happenedAt: parsedDate.toISOString(),
          latitude,
          longitude,
          placeLabel: trimmedPlaceLabel || undefined,
          updatedAt: now,
          song,
        };

    try {
      await upsert(memoryToSave);
      router.back();
    } catch (saveError) {
      logger.error('Failed to save memory', memoryToSave.id, saveError);
      setError('Failed to save memory. Please try again.');
    } finally {
      setIsSaving(false);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  const handleRemoveSong = () => {
    setSong(undefined);
  };

  const handleOpenSongPicker = () => {
    router.push('/(modals)/song-picker');
  };

  const subtitle = isEditing
    ? 'Update the fields to edit this memory.'
    : 'Fill in the basics to add a memory to your timeline.';

  return (
    <Screen scroll>
      <KeyboardAvoidingView
        behavior={Platform.OS === 'ios' ? 'padding' : undefined}
        style={styles.flex}
      >
        <View style={styles.content}>
          <View style={styles.header}>
            <Text style={styles.title}>{isEditing ? 'Edit Memory' : 'New Memory'}</Text>
            <Text style={styles.subtitle}>{subtitle}</Text>
            {error ? <Text style={styles.errorText}>{error}</Text> : null}
          </View>

          <Card style={styles.card}>
            <View style={styles.fieldStack}>
              <TextField
                label="Title *"
                value={title}
                onChangeText={setTitle}
                placeholder="Enter a title"
                errorText={!isTitleValid ? 'Title is required' : undefined}
                testID="memory-title"
              />
              <TextField
                label="Happened At (ISO) *"
                value={happenedAt}
                onChangeText={setHappenedAt}
                placeholder="2024-06-01T12:00:00Z"
                autoCapitalize="none"
                helperText="Use an ISO date-time (UTC)."
                errorText={!isDateValid ? 'Enter a valid ISO date' : undefined}
                testID="memory-happened-at"
              />
              <TextField
                label="Place Label (optional)"
                value={placeLabel}
                onChangeText={setPlaceLabel}
                placeholder="Pinned location"
                testID="memory-place-label"
              />
              <TextField
                label="Body (optional)"
                value={body}
                onChangeText={setBody}
                placeholder="Add a quick note"
                multiline
                testID="memory-body"
              />
              <View style={styles.songSection}>
                <View style={styles.sectionHeader}>
                  <Text style={styles.sectionTitle}>Song</Text>
                  {song ? (
                    <View style={styles.songActions}>
                      <Button
                        title="Change"
                        size="sm"
                        variant="secondary"
                        onPress={handleOpenSongPicker}
                        testID="change-song"
                      />
                      <Button
                        title="Remove"
                        size="sm"
                        variant="destructive"
                        onPress={handleRemoveSong}
                        testID="remove-song"
                      />
                    </View>
                  ) : (
                    <Button
                      title="Add song"
                      size="sm"
                      variant="primary"
                      onPress={handleOpenSongPicker}
                      testID="add-song"
                    />
                  )}
                </View>
                {song ? (
                  <View style={styles.songSummary}>
                    <Text style={styles.songTitle}>{song.title}</Text>
                    <Text style={styles.songArtist}>{song.artist}</Text>
                    {!song.previewUrl ? (
                      <Text style={styles.previewWarning}>Preview not available.</Text>
                    ) : null}
                  </View>
                ) : (
                  <Text style={styles.description}>Attach a Spotify song preview to this memory.</Text>
                )}
              </View>
            </View>
          </Card>

          <View style={styles.actions}>
            <Button
              title="Cancel"
              onPress={handleCancel}
              variant="secondary"
              disabled={isSaving}
              style={styles.actionButton}
            />
            <Button
              title={isSaving ? 'Saving...' : 'Save'}
              onPress={handleSave}
              variant="primary"
              loading={isSaving}
              disabled={isSaveDisabled}
              style={styles.actionButton}
            />
          </View>
        </View>
      </KeyboardAvoidingView>
    </Screen>
  );
}

const styles = StyleSheet.create({
  flex: {
    flex: 1,
  },
  content: {
    flex: 1,
    gap: spacing.lg,
  },
  header: {
    gap: spacing.xs,
  },
  title: {
    ...textTokens.title,
    color: colors.text,
  },
  subtitle: {
    ...textTokens.body,
    color: colors.mutedText,
  },
  errorText: {
    ...textTokens.caption,
    color: colors.destructive,
  },
  card: {
    gap: spacing.md,
  },
  fieldStack: {
    gap: spacing.md,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  description: {
    ...textTokens.body,
    color: colors.mutedText,
  },
  songSection: {
    gap: spacing.sm,
  },
  sectionHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  sectionTitle: {
    ...textTokens.body,
    color: colors.text,
    fontWeight: '600',
  },
  songActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
  songSummary: {
    gap: spacing.xs,
  },
  songTitle: {
    ...textTokens.body,
    color: colors.text,
    fontWeight: '600',
  },
  songArtist: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
  previewWarning: {
    ...textTokens.caption,
    color: colors.destructive,
  },
});
