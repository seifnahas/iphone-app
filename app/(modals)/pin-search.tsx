import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { MemoryListItem } from '@/components/MemoryListItem';
import { MemorySearchControls } from '@/components/MemorySearchControls';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { colors, spacing, text as textTokens } from '@/components/ui/tokens';
import { filterAndSortMemories, MemorySongFilter, MemorySortOrder } from '@/lib/memorySearch';
import { useMemoriesStore } from '@/store/memoriesStore';

export default function PinSearchModal() {
  const router = useRouter();
  const memories = useMemoriesStore((state) => state.memories);
  const isHydrated = useMemoriesStore((state) => state.isHydrated);

  const [query, setQuery] = useState('');
  const [filterHasSong, setFilterHasSong] = useState<MemorySongFilter>('all');
  const [sort, setSort] = useState<MemorySortOrder>('newest');

  const searchResults = useMemo(
    () =>
      filterAndSortMemories(memories, {
        query,
        filterHasSong,
        sort,
      }),
    [memories, query, filterHasSong, sort],
  );

  const handleClearFilters = () => {
    setQuery('');
    setFilterHasSong('all');
    setSort('newest');
  };

  const header = (
    <View style={styles.header}>
      <View style={styles.headerRow}>
        <View style={styles.headerText}>
          <Text style={styles.title}>Search pins</Text>
          <Text style={styles.description}>Filter and sort your map memories.</Text>
        </View>
        <Button title="Close" variant="secondary" size="sm" onPress={() => router.back()} />
      </View>

      <MemorySearchControls
        query={query}
        filterHasSong={filterHasSong}
        sort={sort}
        onQueryChange={setQuery}
        onFilterChange={setFilterHasSong}
        onSortChange={setSort}
      />
    </View>
  );

  const renderEmptyState = () => {
    if (!isHydrated) {
      return <Text style={styles.muted}>Loading memories...</Text>;
    }

    if (memories.length === 0) {
      return <Text style={styles.muted}>No memories yet. Add one from the map.</Text>;
    }

    return (
      <View style={styles.emptyState}>
        <Text style={styles.title}>No matches</Text>
        <Text style={styles.description}>Try updating your search or filters.</Text>
        <Text style={styles.linkButton} onPress={handleClearFilters}>
          Clear filters
        </Text>
      </View>
    );
  };

  return (
    <Screen>
      <FlatList
        data={isHydrated ? searchResults : []}
        keyExtractor={(item) => item.id}
        renderItem={({ item }) => (
          <MemoryListItem memory={item} onPress={() => router.push(`/memory/${item.id}`)} />
        )}
        ItemSeparatorComponent={() => <View style={styles.separator} />}
        ListHeaderComponent={header}
        ListEmptyComponent={renderEmptyState}
        contentContainerStyle={styles.listContent}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: spacing.md,
    paddingBottom: spacing.md,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.sm,
  },
  headerText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...textTokens.title,
    color: colors.text,
  },
  description: {
    ...textTokens.body,
    color: colors.mutedText,
  },
  muted: {
    ...textTokens.body,
    color: colors.mutedText,
  },
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
  },
  separator: {
    height: 1,
    backgroundColor: colors.border,
    marginVertical: spacing.sm,
  },
  emptyState: {
    gap: spacing.xs,
    paddingVertical: spacing.md,
  },
  linkButton: {
    ...textTokens.body,
    color: colors.primary,
    fontWeight: '600',
  },
});
