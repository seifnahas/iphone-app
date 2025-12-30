import { useLocalSearchParams, useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import { Alert, Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import * as logger from '@/lib/logger';
import { getMemoryById } from '@/lib/db/memories';
import { listMediaByMemoryId } from '@/lib/db/media';
import { useMemoriesStore } from '@/store/memoriesStore';
import { Memory } from '@/types/models';

export default function MemoryDetailScreen() {
  const router = useRouter();
  const remove = useMemoriesStore((state) => state.remove);
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const memoryId = Array.isArray(params.id) ? params.id[0] : params.id ?? 'unknown';
  const [memory, setMemory] = useState<Memory | null>(null);
  const [mediaCount, setMediaCount] = useState(0);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);
  const [isDeleting, setIsDeleting] = useState(false);

  useEffect(() => {
    let isMounted = true;

    const loadMemory = async () => {
      setError(null);

      try {
        const [memoryRecord, mediaItems] = await Promise.all([
          getMemoryById(memoryId),
          listMediaByMemoryId(memoryId),
        ]);

        if (!isMounted) return;

        if (!memoryRecord) {
          setMemory(null);
          setMediaCount(0);
          setError('Memory not found.');
          return;
        }

        setMemory(memoryRecord);
        setMediaCount(mediaItems.length);
      } catch (loadError) {
        if (!isMounted) return;
        logger.error('Failed to load memory detail', memoryId, loadError);
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

  const handleEdit = () => {
    router.push({ pathname: '/(modals)/memory-editor', params: { id: memoryId } });
  };

  const confirmDelete = () => {
    if (!memory || isDeleting) return;

    Alert.alert('Delete memory', 'This will remove the memory and its media.', [
      { text: 'Cancel', style: 'cancel' },
      {
        text: 'Delete',
        style: 'destructive',
        onPress: async () => {
          setIsDeleting(true);

          try {
            await remove(memory.id);
            if (router.canGoBack()) {
              router.back();
            } else {
              router.replace('/map');
            }
          } catch (deleteError) {
            logger.error('Failed to delete memory', memory?.id, deleteError);
            setError('Failed to delete memory. Please try again.');
          } finally {
            setIsDeleting(false);
          }
        },
      },
    ]);
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Memory Detail</Text>
        <Text style={styles.description}>Viewing memory {memoryId}.</Text>
      </View>
      {isLoading ? (
        <Text style={styles.description}>Loading...</Text>
      ) : error ? (
        <Text style={[styles.description, styles.errorText]}>{error}</Text>
      ) : memory ? (
        <>
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

          <View style={styles.actions}>
            <Pressable style={[styles.button, styles.secondaryButton]} onPress={handleEdit}>
              <Text style={[styles.buttonText, styles.secondaryButtonText]}>Edit</Text>
            </Pressable>
            <Pressable
              style={[styles.button, styles.dangerButton]}
              onPress={confirmDelete}
              disabled={isDeleting}
            >
              <Text style={[styles.buttonText, styles.dangerButtonText]}>
                {isDeleting ? 'Deleting...' : 'Delete'}
              </Text>
            </Pressable>
          </View>
        </>
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
  actions: {
    flexDirection: 'row',
    gap: 12,
    marginTop: 12,
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
  dangerButton: {
    backgroundColor: '#ffecec',
    borderWidth: 1,
    borderColor: '#ff3b30',
  },
  dangerButtonText: {
    color: '#ff3b30',
  },
  errorText: {
    color: '#ff3b30',
  },
});
