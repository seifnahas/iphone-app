import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  View,
} from 'react-native';

import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ModalHeader } from '@/components/ui/ModalHeader';
import { TextField } from '@/components/ui/TextField';
import { colors, radius, spacing } from '@/components/ui/tokens';
import { Text } from '@/components/ui/Text';
import { beginAuth } from '@/lib/spotify/spotifyAuth';
import { searchTracks } from '@/lib/spotify/spotifyApi';
import { useSongSelectionStore } from '@/store/songSelectionStore';
import { SpotifyTrack } from '@/types/models';

export default function SongPickerModal() {
  const router = useRouter();
  const setPendingSong = useSongSelectionStore((state) => state.setPendingSong);

  const [query, setQuery] = useState('');
  const [results, setResults] = useState<SpotifyTrack[]>([]);
  const [isLoading, setIsLoading] = useState(false);
  const [hasSearched, setHasSearched] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [refreshKey, setRefreshKey] = useState(0);

  const debouncedQuery = useDebouncedValue(query, 400);
  const handleClose = () => router.back();

  useEffect(() => {
    const runSearch = async () => {
      if (!debouncedQuery.trim()) {
        setResults([]);
        setHasSearched(false);
        setError(null);
        return;
      }

      setIsLoading(true);
      setError(null);
      setHasSearched(true);

      try {
        const tracks = await searchTracks(debouncedQuery);
        setResults(tracks);
      } catch (searchError) {
        const message =
          searchError instanceof Error ? searchError.message : 'Failed to search songs.';
        setError(message);
        setResults([]);
      } finally {
        setIsLoading(false);
      }
    };

    runSearch();
  }, [debouncedQuery, refreshKey]);

  const handleSelect = (track: SpotifyTrack) => {
    setPendingSong(track);
    router.back();
  };

  const renderListEmpty = () => {
    if (isLoading) {
      return (
        <Card style={styles.centerCard}>
          <ActivityIndicator />
          <Text variant="caption" muted>
            Searching...
          </Text>
        </Card>
      );
    }

    if (error) {
      return (
        <Card style={styles.centerCard}>
          <Text variant="caption" style={styles.errorText}>
            {error}
          </Text>
          <Button title="Retry" onPress={() => setRefreshKey((key) => key + 1)} size="sm" />
        </Card>
      );
    }

    if (!hasSearched) {
      return (
        <Card style={styles.centerCard}>
          <Text variant="caption" muted>
            Start typing to search for a song.
          </Text>
        </Card>
      );
    }

    return (
      <Card style={styles.centerCard}>
        <Text variant="caption" muted>
          No songs found. Try a different search.
        </Text>
      </Card>
    );
  };

  return (
    <Screen>
      <FlatList
        data={results}
        keyExtractor={(item) => item.spotifyTrackId}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        renderItem={({ item }) => (
          <Pressable
            onPress={() => handleSelect(item)}
            style={({ pressed }) => [styles.row, pressed && styles.rowPressed]}
          >
            <Image
              source={
                item.albumArtUrl ? { uri: item.albumArtUrl } : require('@/assets/images/icon.png')
              }
              style={styles.artwork}
            />
            <View style={styles.rowText}>
              <Text variant="body" style={styles.trackTitle} numberOfLines={1}>
                {item.title}
              </Text>
              <Text variant="caption" muted numberOfLines={1}>
                {item.artist}
              </Text>
              {!item.previewUrl ? (
                <Text variant="caption" style={styles.previewMissing}>
                  Preview not available
                </Text>
              ) : null}
            </View>
          </Pressable>
        )}
        ListHeaderComponent={
          <View style={styles.headerContainer}>
            <ModalHeader
              title="Song Picker"
              subtitle="Search Spotify to attach a preview to your memory."
              onClose={handleClose}
            />

            <Card style={styles.card}>
              <TextField
                label="Search"
                value={query}
                onChangeText={setQuery}
                placeholder="Search tracks or artists"
                autoCapitalize="none"
                testID="song-search-input"
              />
              <Button
                title="Connect Spotify"
                onPress={beginAuth}
                variant="subtle"
                size="sm"
                style={styles.connectButton}
              />
            </Card>
          </View>
        }
        ListEmptyComponent={renderListEmpty}
        contentContainerStyle={styles.listContent}
        keyboardShouldPersistTaps="handled"
      />
    </Screen>
  );
}

function useDebouncedValue<T>(value: T, delay: number) {
  const [debounced, setDebounced] = useState(value);

  useEffect(() => {
    const timeout = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(timeout);
  }, [value, delay]);

  return debounced;
}

const styles = StyleSheet.create({
  headerContainer: {
    gap: spacing.md,
  },
  card: {
    gap: spacing.sm,
  },
  connectButton: {
    alignSelf: 'flex-start',
  },
  centerCard: {
    gap: spacing.sm,
    alignItems: 'center',
  },
  errorText: {
    color: colors.danger,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    padding: spacing.md,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
  },
  rowPressed: {
    backgroundColor: colors.surfaceMuted,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    fontWeight: '600',
  },
  previewMissing: {
    color: colors.danger,
  },
  artwork: {
    width: 48,
    height: 48,
    borderRadius: radius.sm,
    backgroundColor: colors.border,
  },
  separator: {
    height: spacing.xs,
  },
});
