import { useRouter } from 'expo-router';
import React, { useEffect, useState } from 'react';
import {
  ActivityIndicator,
  FlatList,
  Image,
  Pressable,
  StyleSheet,
  Text,
  View,
} from 'react-native';

import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { TextField } from '@/components/ui/TextField';
import { colors, radius, spacing, text as textTokens } from '@/components/ui/tokens';
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

  return (
    <Screen scroll>
      <View style={styles.header}>
        <Text style={styles.title}>Song Picker</Text>
        <Text style={styles.subtitle}>Search Spotify to attach a preview to your memory.</Text>
      </View>

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
          variant="secondary"
          size="sm"
          style={styles.connectButton}
        />
      </Card>

      {isLoading ? (
        <Card style={styles.centerCard}>
          <ActivityIndicator />
          <Text style={styles.caption}>Searching...</Text>
        </Card>
      ) : error ? (
        <Card style={styles.centerCard}>
          <Text style={[styles.caption, styles.errorText]}>{error}</Text>
          <Button title="Retry" onPress={() => setRefreshKey((key) => key + 1)} size="sm" />
        </Card>
      ) : results.length === 0 && hasSearched ? (
        <Card style={styles.centerCard}>
          <Text style={styles.caption}>No songs found. Try a different search.</Text>
        </Card>
      ) : (
        <FlatList
          data={results}
          keyExtractor={(item) => item.spotifyTrackId}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Pressable onPress={() => handleSelect(item)} style={styles.row}>
              <Image
                source={
                  item.albumArtUrl
                    ? { uri: item.albumArtUrl }
                    : require('@/assets/images/icon.png')
                }
                style={styles.artwork}
              />
              <View style={styles.rowText}>
                <Text style={styles.trackTitle} numberOfLines={1}>
                  {item.title}
                </Text>
                <Text style={styles.trackArtist} numberOfLines={1}>
                  {item.artist}
                </Text>
                {!item.previewUrl ? (
                  <Text style={styles.previewMissing}>Preview not available</Text>
                ) : null}
              </View>
            </Pressable>
          )}
          ListEmptyComponent={
            hasSearched ? null : (
              <Card style={styles.centerCard}>
                <Text style={styles.caption}>Start typing to search for a song.</Text>
              </Card>
            )
          }
          contentContainerStyle={styles.listContent}
        />
      )}
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
  header: {
    gap: spacing.xs,
    marginBottom: spacing.md,
  },
  title: {
    ...textTokens.title,
    color: colors.text,
  },
  subtitle: {
    ...textTokens.body,
    color: colors.mutedText,
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
  caption: {
    ...textTokens.body,
    color: colors.mutedText,
  },
  errorText: {
    color: colors.destructive,
  },
  listContent: {
    marginTop: spacing.md,
  },
  row: {
    flexDirection: 'row',
    gap: spacing.md,
    alignItems: 'center',
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.xs,
    borderRadius: radius.md,
    backgroundColor: colors.surface,
  },
  rowText: {
    flex: 1,
    gap: 2,
  },
  trackTitle: {
    ...textTokens.body,
    color: colors.text,
    fontWeight: '600',
  },
  trackArtist: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
  previewMissing: {
    ...textTokens.caption,
    color: colors.destructive,
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
