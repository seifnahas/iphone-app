import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { Screen } from '@/components/Screen';
import * as logger from '@/lib/logger';
import { generateId } from '@/lib/id';
import { useMemoriesStore } from '@/store/memoriesStore';
import { Memory } from '@/types/models';

type MemoryEditorParams = {
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

  const latitudeFromParams = parseNumberParam(params.latitude);
  const longitudeFromParams = parseNumberParam(params.longitude);
  const initialHappenedAt = getSingleParam(params.happenedAt) ?? new Date().toISOString();

  const fallbackLocation = useMemo(
    () => ({
      latitude: 51.5074 + (Math.random() - 0.5) * 0.1,
      longitude: -0.1278 + (Math.random() - 0.5) * 0.1,
    }),
    [],
  );

  const latitude = latitudeFromParams ?? fallbackLocation.latitude;
  const longitude = longitudeFromParams ?? fallbackLocation.longitude;

  const [title, setTitle] = useState('');
  const [happenedAt, setHappenedAt] = useState(initialHappenedAt);
  const [body, setBody] = useState('');

  const handleSave = async () => {
    const trimmedTitle = title.trim();
    const parsedDate = new Date(happenedAt);

    if (!trimmedTitle) {
      Alert.alert('Title required', 'Please add a title before saving.');
      return;
    }

    if (Number.isNaN(parsedDate.getTime())) {
      Alert.alert('Invalid date', 'Use a valid ISO date (e.g. 2024-06-01T12:00:00Z).');
      return;
    }

    const now = new Date().toISOString();
    const memory: Memory = {
      id: generateId(),
      title: trimmedTitle,
      body: body.trim() || undefined,
      createdAt: now,
      happenedAt: parsedDate.toISOString(),
      latitude,
      longitude,
      placeLabel: 'Pinned location', // TODO: replace with reverse geocoded label
      updatedAt: now,
    };

    try {
      await upsert(memory);
      router.back();
    } catch (error) {
      logger.error('Failed to save memory', error);
    }
  };

  const handleCancel = () => {
    router.back();
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>New Memory</Text>
        <Text style={styles.description}>Fill in the basics to add a memory to your timeline.</Text>
      </View>

      <View style={styles.fieldGroup}>
        <Text style={styles.label}>Title *</Text>
        <TextInput
          value={title}
          onChangeText={setTitle}
          placeholder="Enter a title"
          style={styles.input}
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
        />
      </View>

      <View style={styles.actions}>
        <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleCancel}>
          <Text style={[styles.buttonText, styles.secondaryButtonText]}>Cancel</Text>
        </Pressable>
        <Pressable style={styles.button} onPress={handleSave}>
          <Text style={styles.buttonText}>Save</Text>
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
});
