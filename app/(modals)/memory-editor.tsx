import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import * as logger from '@/lib/logger';
import { getMemoryById } from '@/lib/db/memories';
import { generateId } from '@/lib/id';
import { useMemoriesStore } from '@/store/memoriesStore';
import { Memory } from '@/types/models';

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

  const latitude = existingMemory
    ? existingMemory.latitude
    : latitudeFromParams ?? fallbackLocation.latitude;
  const longitude = existingMemory
    ? existingMemory.longitude
    : longitudeFromParams ?? fallbackLocation.longitude;

  const handleSave = async () => {
    if (isSaving || (isEditing && !existingMemory) || isLoading) {
      return;
    }

    const trimmedTitle = title.trim();
    const parsedDate = new Date(happenedAt);
    const trimmedPlaceLabel = placeLabel.trim();
    const trimmedBody = body.trim();

    if (!trimmedTitle) {
      Alert.alert('Title required', 'Please add a title before saving.');
      return;
    }

    if (Number.isNaN(parsedDate.getTime())) {
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

  const subtitle = isEditing ? 'Update the fields to edit this memory.' : 'Fill in the basics to add a memory to your timeline.';

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>{isEditing ? 'Edit Memory' : 'New Memory'}</Text>
        <Text style={styles.description}>{subtitle}</Text>
        {error ? <Text style={[styles.description, styles.errorText]}>{error}</Text> : null}
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a title"
          style={styles.input}
          editable={!isLoading}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Happened At (ISO) *</Text>
        <TextInput
          value={happenedAt}
          onChangeText={setHappenedAt}
          placeholder="2024-06-01T12:00:00Z"
          autoCapitalize="none"
          style={styles.input}
          editable={!isLoading}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Place Label (optional)</Text>
        <TextInput
          value={placeLabel}
          onChangeText={setPlaceLabel}
          placeholder="Pinned location"
          style={styles.input}
          editable={!isLoading}
        />
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Body (optional)</Text>
        <TextInput
          value={body}
          onChangeText={setBody}
          placeholder="Add a quick note"
          multiline
          style={[styles.input, styles.multilineInput]}
          editable={!isLoading}
        />
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleCancel} disabled={isSaving}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleSave} disabled={isSaving || isLoading}>
          <Text style={styles.buttonText}>{isSaving ? 'Saving...' : 'Save'}</Text>
        </Pressable>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#4a4a4a',
  },
  fieldGroup: {
    gap: 6,
  },
  label: {
    fontSize: 14,
    color: '#4a4a4a',
    fontWeight: '500',
  },
  input: {
    borderWidth: 1,
    borderColor: '#d0d0d0',
    borderRadius: 10,
    paddingHorizontal: 12,
    paddingVertical: 10,
    fontSize: 16,
    backgroundColor: '#ffffff',
  },
  multilineInput: {
    minHeight: 100,
    textAlignVertical: 'top',
  },
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 8,
  },
  button: {
    backgroundColor: '#0a84ff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
    flex: 1,
    alignItems: 'center',
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
  },
  secondaryButton: {
    backgroundColor: '#f2f2f2',
  },
  secondaryButtonText: {
    color: '#0a84ff',
  },
  errorText: {
    color: '#ff3b30',
  },
});
