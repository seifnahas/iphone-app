import { useRouter } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import * as logger from '@/lib/logger';
import { generateId } from '@/lib/id';
import { useMemoriesStore } from '@/store/memoriesStore';
import { Memory } from '@/types/models';

export default function MemoryEditorModal() {
  const router = useRouter();
  const upsert = useMemoriesStore((state) => state.upsert);

  const handleCreateSample = async () => {
    const now = new Date().toISOString();
    const memory: Memory = {
      id: generateId(),
      title: 'Sample Memory',
      body: 'A quick placeholder entry.',
      createdAt: now,
      happenedAt: now,
      latitude: 51.5074 + (Math.random() - 0.5) * 0.1,
      longitude: -0.1278 + (Math.random() - 0.5) * 0.1,
      placeLabel: 'London area',
      updatedAt: now,
    };

    try {
      await upsert(memory);
      router.back();
    } catch (error) {
      logger.error('Failed to create sample memory', error);
    }
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Memory Editor</Text>
        <Text style={styles.description}>
          This modal will handle creating and editing memories. Editor fields coming soon.
        </Text>
      </View>
      <Pressable style={styles.button} onPress={handleCreateSample}>
        <Text style={styles.buttonText}>Create sample memory</Text>
      </Pressable>
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
  button: {
    marginTop: 8,
    backgroundColor: '#0a84ff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
