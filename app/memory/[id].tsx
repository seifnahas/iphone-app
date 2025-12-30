import { useLocalSearchParams } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import * as logger from '@/lib/logger';
import { getMemoryById } from '@/lib/db/memories';
import { listMediaByMemoryId } from '@/lib/db/media';
import { Memory } from '@/types/models';

export default function MemoryDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const memoryId = Array.isArray(params.id) ? params.id[0] : params.id ?? 'unknown';
  const [memory, setMemory] = useState<Memory | null>(null);
  const [mediaCount, setMediaCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);

  useEffect(() => {
    let isMounted = true;

    const loadMemory = async () => {
      try {
        const [memoryRecord, mediaItems] = await Promise.all([
          getMemoryById(memoryId),
          listMediaByMemoryId(memoryId),
        ]);

        if (!isMounted) return;

        setMemory(memoryRecord);
        setMediaCount(mediaItems.length);
      } catch (error) {
        logger.error('Failed to load memory detail', memoryId, error);
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

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Memory Detail</Text>
        <Text style={styles.description}>Viewing memory {memoryId}.</Text>
      </View>
      {isLoading ? (
        <Text style={styles.description}>Loading...</Text>
      ) : memory ? (
        <View style={styles.card}>
          <Text style={styles.fieldLabel}>Title</Text>
          <Text style={styles.fieldValue}>{memory.title || 'Untitled'}</Text>

          <Text style={styles.fieldLabel}>When</Text>
          <Text style={styles.fieldValue}>{memory.happenedAt}</Text>

          <Text style={styles.fieldLabel}>Location</Text>
          <Text style={styles.fieldValue}>
            {memory.latitude.toFixed(4)}, {memory.longitude.toFixed(4)}
          </Text>

          <Text style={styles.fieldLabel}>Body</Text>
          <Text style={styles.fieldValue}>{memory.body || 'No notes yet.'}</Text>

          <Text style={styles.fieldLabel}>Media</Text>
          <Text style={styles.fieldValue}>{mediaCount} item(s)</Text>
        </View>
      ) : (
        <Text style={styles.description}>Memory not found.</Text>
      )}
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
  card: {
    marginTop: 8,
    padding: 12,
    borderRadius: 12,
    backgroundColor: '#f4f4f4',
    gap: 6,
  },
  fieldLabel: {
    fontSize: 14,
    color: '#6b6b6b',
  },
  fieldValue: {
    fontSize: 16,
    fontWeight: '600',
  },
});
