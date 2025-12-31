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
import { ModalHeader } from '@/components/ui/ModalHeader';
import { Text } from '@/components/ui/Text';
import { colors, spacing } from '@/components/ui/tokens';
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
        <Button
          title="Clear filters"
          variant="ghost"
          size="sm"
          onPress={handleClearFilters}
          icon={<Feather name="refresh-ccw" size={16} color={colors.text} />}
        />
      </Card>
    </View>
  );

  const renderEmptyState = () => {
    if (!isHydrated) {
      return (
        <Card style={styles.emptyCard}>
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
          description="Add one from the map to start searching."
          icon={<Feather name="map-pin" size={20} color={colors.text} />}
        />
      );
    }

    return (
        <EmptyState
          title="No matches"
          description="Try updating your search or filters."
          icon={<Feather name="search" size={20} color={colors.text} />}
          action={<Button title="Reset filters" variant="ghost" size="sm" onPress={handleClearFilters} />}
        />
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
  listContent: {
    padding: spacing.lg,
    gap: spacing.md,
    width: '100%',
    maxWidth: 720,
    alignSelf: 'center',
  },
  separator: {
    height: spacing.xs,
  },
  filterCard: {
    gap: spacing.md,
  },
  emptyCard: {
    gap: spacing.sm,
  },
});
