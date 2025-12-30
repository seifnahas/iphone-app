import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { useMemoriesStore } from '@/store/memoriesStore';

export default function MapScreen() {
  const { memories, isHydrated } = useMemoriesStore((state) => ({
    memories: state.memories,
    isHydrated: state.isHydrated,
  }));
  const previewMemories = memories.slice(0, 3);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
        <Text style={styles.description}>
          Visualize your memories on the map. Map rendering is coming soon.
        </Text>
      </View>
      <Link href="/(modals)/memory-editor" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Create Memory</Text>
        </Pressable>
      </Link>
      <View style={styles.summaryCard}>
        <Text style={styles.summaryTitle}>Loaded memories</Text>
        {!isHydrated ? (
          <Text style={styles.muted}>Loading...</Text>
        ) : (
          <>
            <Text style={styles.count}>{memories.length}</Text>
            {previewMemories.length > 0 ? (
              previewMemories.map((memory) => (
                <Text key={memory.id} style={styles.muted}>
                  {memory.latitude.toFixed(4)}, {memory.longitude.toFixed(4)}
                </Text>
              ))
            ) : (
              <Text style={styles.muted}>No coordinates yet</Text>
            )}
          </>
        )}
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
  summaryCard: {
    marginTop: 12,
    padding: 12,
    borderRadius: 10,
    backgroundColor: '#f4f4f4',
    gap: 6,
  },
  summaryTitle: {
    fontSize: 16,
    fontWeight: '600',
  },
  count: {
    fontSize: 24,
    fontWeight: '700',
  },
  muted: {
    color: '#6b6b6b',
    fontSize: 14,
  },
});
