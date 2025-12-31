import { useFocusEffect, useLocalSearchParams, useRouter } from 'expo-router';
import React, { useCallback, useState } from 'react';
import { Alert, Image, Linking, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { getMemoryById } from '@/lib/db/memories';
import { listMediaByMemoryId } from '@/lib/db/media';
import * as logger from '@/lib/logger';
import { colors, radius, spacing, text as textTokens } from '@/components/ui/tokens';
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

  useFocusEffect(
    useCallback(() => {
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
    }, [memoryId]),
  );

  const handleEdit = () => {
    router.push({ pathname: '/(modals)/memory-editor', params: { id: memoryId } });
  };

  const handlePlayInSpotify = async (trackId?: string) => {
    if (!trackId) return;

    const appUrl = `spotify:track:${trackId}`;
    const webUrl = `https://open.spotify.com/track/${trackId}`;

    try {
      const canOpenApp = await Linking.canOpenURL(appUrl);
      if (canOpenApp) {
        await Linking.openURL(appUrl);
        return;
      }

      const canOpenWeb = await Linking.canOpenURL(webUrl);
      if (canOpenWeb) {
        await Linking.openURL(webUrl);
        return;
      }

      logger.error('Unable to open Spotify URLs', trackId);
      Alert.alert('Unable to open Spotify right now.');
    } catch (linkError) {
      logger.error('Failed to open Spotify link', trackId, linkError);
      Alert.alert('Unable to open Spotify right now.');
    }
  };

  const confirmDelete = () => {
    if (!memory || isDeleting) return;

    Alert.alert('Delete memory?', undefined, [
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
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Memory Detail</Text>
        <Text style={styles.description}>Viewing memory {memoryId}.</Text>
      </View>
      {isLoading ? (
        <Card>
          <Text style={styles.description}>Loading...</Text>
        </Card>
      ) : error ? (
        <Card>
          <Text style={[styles.description, styles.errorText]}>{error}</Text>
        </Card>
      ) : memory ? (
        <>
          <Card>
            <View style={styles.cardHeader}>
              <Text style={styles.memoryTitle}>{memory.title || 'Untitled'}</Text>
              <View style={styles.metaRow}>
                <Text style={styles.metaText}>{memory.happenedAt}</Text>
                {memory.placeLabel ? <Text style={styles.metaText}>{memory.placeLabel}</Text> : null}
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Body</Text>
            </View>
            <Text style={styles.bodyText}>{memory.body?.trim() || 'No notes yet.'}</Text>
          </Card>

          {memory.song ? (
            <Card>
              <View style={styles.sectionHeaderRow}>
                <Text style={styles.sectionTitle}>Song</Text>
                <Button title="Edit" onPress={handleEdit} size="sm" variant="secondary" />
              </View>
              <View style={styles.songContent}>
                <Image
                  source={
                    memory.song.albumArtUrl
                      ? { uri: memory.song.albumArtUrl }
                      : require('@/assets/images/icon.png')
                  }
                  style={styles.songArt}
                />
                <View style={styles.songMeta}>
                  <Text style={styles.songTitle} numberOfLines={1}>
                    {memory.song.title}
                  </Text>
                  <Text style={styles.songArtist} numberOfLines={1}>
                    {memory.song.artist}
                  </Text>
                </View>
              </View>
              <View style={styles.songActions}>
                <Button
                  title="Play in Spotify"
                  onPress={() => handlePlayInSpotify(memory.song?.spotifyTrackId)}
                  size="sm"
                />
                {/* TODO: Add copy link action when clipboard support is available. */}
              </View>
            </Card>
          ) : null}

          <Card>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Location</Text>
            </View>
            <View style={styles.detailList}>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Latitude</Text>
                <Text style={styles.detailValue}>{memory.latitude.toFixed(4)}</Text>
              </View>
              <View style={styles.detailRow}>
                <Text style={styles.detailLabel}>Longitude</Text>
                <Text style={styles.detailValue}>{memory.longitude.toFixed(4)}</Text>
              </View>
            </View>
          </Card>

          <Card>
            <View style={styles.sectionHeader}>
              <Text style={styles.sectionTitle}>Media</Text>
            </View>
            <Text style={styles.bodyText}>{mediaCount} item(s)</Text>
          </Card>

          <View style={styles.actions}>
            <Button title="Edit" variant="primary" onPress={handleEdit} style={styles.actionButton} />
            <Button
              title={isDeleting ? 'Deleting...' : 'Delete'}
              variant="destructive"
              onPress={confirmDelete}
              disabled={isDeleting}
              loading={isDeleting}
              style={styles.actionButton}
            />
          </View>
        </>
      ) : (
        <Card>
          <Text style={styles.description}>Memory not found.</Text>
        </Card>
      )}
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.xs,
  },
  title: {
    ...textTokens.title,
    color: colors.text,
  },
  description: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
  cardHeader: {
    gap: spacing.xs,
  },
  memoryTitle: {
    ...textTokens.title,
    color: colors.text,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaText: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
  sectionHeader: {
    marginBottom: spacing.sm,
  },
  sectionHeaderRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: spacing.md,
    gap: spacing.sm,
  },
  sectionTitle: {
    ...textTokens.caption,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 0.5,
  },
  bodyText: {
    ...textTokens.body,
    color: colors.text,
  },
  detailList: {
    gap: spacing.sm,
  },
  detailRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
  },
  detailLabel: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
  detailValue: {
    ...textTokens.body,
    color: colors.text,
  },
  actions: {
    flexDirection: 'row',
    gap: spacing.sm,
    marginTop: spacing.md,
  },
  actionButton: {
    flex: 1,
  },
  errorText: {
    color: colors.destructive,
  },
  songContent: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    marginBottom: spacing.md,
  },
  songArt: {
    width: 56,
    height: 56,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  songMeta: {
    flex: 1,
    gap: 2,
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
  songActions: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
