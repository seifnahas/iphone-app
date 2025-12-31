import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { MemoryListItem } from '@/components/MemoryListItem';
import { MemorySearchControls } from '@/components/MemorySearchControls';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { ModalHeader } from '@/components/ui/ModalHeader';
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
      <ModalHeader
        title="Search pins"
        subtitle="Filter and sort your map memories."
        onClose={() => router.back()}
      />

      <Card style={styles.filterCard}>
        <MemorySearchControls
          query={query}
          filterHasSong={filterHasSong}
          sort={sort}
          onQueryChange={setQuery}
          onFilterChange={setFilterHasSong}
          onSortChange={setSort}
        />
        <Button title="Clear filters" variant="secondary" size="sm" onPress={handleClearFilters} />
      </Card>
    </View>
  );

  const renderEmptyState = () => {
    if (!isHydrated) {
      return (
        <Card style={styles.emptyCard}>
          <Text style={styles.muted}>Loading memories...</Text>
        </Card>
      );
    }

    if (memories.length === 0) {
      return (
        <Card style={styles.emptyCard}>
          <Text style={styles.muted}>No memories yet. Add one from the map.</Text>
        </Card>
      );
    }

    return (
      <Card style={styles.emptyCard}>
        <Text style={styles.title}>No matches</Text>
        <Text style={styles.description}>Try updating your search or filters.</Text>
        <Button title="Reset filters" variant="secondary" size="sm" onPress={handleClearFilters} />
      </Card>
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
    paddingBottom: spacing.sm,
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
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  separator: {
    height: spacing.sm,
  },
  filterCard: {
    gap: spacing.md,
  },
  emptyCard: {
    gap: spacing.sm,
  },
});
