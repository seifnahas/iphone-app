import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useMemo, useState } from 'react';
import { FlatList, StyleSheet, View } from 'react-native';

import { MemoryListItem } from '@/components/MemoryListItem';
import { MemorySearchControls } from '@/components/MemorySearchControls';
import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { colors, spacing } from '@/components/ui/tokens';
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
      <Card elevated>
        <View style={styles.pageTitleBlock}>
          <Text variant="overline" muted>
            Explore
          </Text>
          <Text variant="title">Timeline</Text>
          <Text variant="caption" muted>
            Review your memories in chronological order with quick filters.
          </Text>
        </View>
      </Card>
      <Card>
        <MemorySearchControls
          query={query}
          filterHasSong={filterHasSong}
          sort={sort}
          onQueryChange={setQuery}
          onFilterChange={setFilterHasSong}
          onSortChange={setSort}
        />
        <Button
          title="Clear filters"
          onPress={handleClearFilters}
          variant="ghost"
          size="sm"
          icon={<Feather name="refresh-ccw" size={16} color={colors.text} />}
          style={styles.clearButton}
        />
      </Card>
    </View>
  );

  const renderEmptyState = () => {
    if (!isHydrated) {
      return (
        <Card>
          <Text variant="caption" muted>
            Loading memories...
          </Text>
        </Card>
      );
    }

    if (memories.length === 0) {
      return (
        <EmptyState
          title="No memories yet"
          description="Create a memory on the map to see it here."
          icon={<Feather name="map-pin" size={20} color="#0f172a" />}
        />
      );
    }

    return (
      <EmptyState
        title="No matches"
        description="Try adjusting your search or filters."
        icon={<Feather name="filter" size={20} color="#0f172a" />}
        action={<Button title="Clear filters" onPress={handleClearFilters} variant="ghost" size="sm" />}
      />
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
    paddingBottom: spacing.xxl,
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
  itemSpacer: {
    height: spacing.md,
  },
  clearButton: {
    alignSelf: 'flex-start',
    marginTop: spacing.sm,
  },
});
