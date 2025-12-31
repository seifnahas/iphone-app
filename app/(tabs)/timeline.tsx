import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { MemoryListItem } from '@/components/MemoryListItem';
import { MemorySearchControls } from '@/components/MemorySearchControls';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { colors, spacing, text as textTokens } from '@/components/ui/tokens';
import { filterAndSortMemories, MemorySongFilter, MemorySortOrder } from '@/lib/memorySearch';
import { useMemoriesStore } from '@/store/memoriesStore';

export default function TimelineScreen() {
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

  const listHeader = (
    <View style={styles.header}>
      <View style={styles.pageTitleBlock}>
        <Text style={styles.overline}>Explore</Text>
        <Text style={styles.title}>Timeline</Text>
        <Text style={styles.description}>Review your memories in chronological order.</Text>
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
      return (
        <Card>
          <Text style={styles.muted}>Loading memories...</Text>
        </Card>
      );
    }

    if (memories.length === 0) {
      return (
        <Card style={styles.emptyCard}>
          <Text style={styles.title}>No memories yet</Text>
          <Text style={styles.description}>Create a memory on the map to see it here.</Text>
        </Card>
      );
    }

    return (
      <Card style={styles.emptyCard}>
        <Text style={styles.title}>No matches</Text>
        <Text style={styles.description}>Try adjusting your search or filters.</Text>
        <Button title="Clear filters" onPress={handleClearFilters} variant="secondary" size="sm" />
      </Card>
    );
  };

  return (
    <Screen>
      <FlatList
        data={isHydrated ? searchResults : []}
        keyExtractor={(item) => item.id}
        ItemSeparatorComponent={() => <View style={styles.itemSpacer} />}
        renderItem={({ item }) => (
          <MemoryListItem memory={item} onPress={() => router.push(`/memory/${item.id}`)} />
        )}
        ListHeaderComponent={listHeader}
        ListEmptyComponent={renderEmptyState}
        ListHeaderComponentStyle={styles.headerSpacing}
        contentContainerStyle={styles.listContent}
        style={styles.list}
      />
    </Screen>
  );
}

const styles = StyleSheet.create({
  list: {
    flex: 1,
  },
  listContent: {
    paddingBottom: spacing.xl,
    gap: spacing.md,
  },
  header: {
    gap: spacing.md,
  },
  headerSpacing: {
    gap: spacing.md,
  },
  pageTitleBlock: {
    gap: spacing.xs,
  },
  overline: {
    ...textTokens.caption,
    color: colors.mutedText,
    textTransform: 'uppercase',
    letterSpacing: 1,
    fontWeight: '700',
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
  itemSpacer: {
    height: spacing.md,
  },
  emptyCard: {
    gap: spacing.xs,
  },
});
