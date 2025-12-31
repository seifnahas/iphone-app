import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { MemorySongFilter, MemorySortOrder } from '@/lib/memorySearch';

import { Chip } from './ui/Chip';
import { Divider } from './ui/Divider';
import { Input } from './ui/Input';
import { Text } from './ui/Text';
import { colors, spacing } from './ui/tokens';

type MemorySearchControlsProps = {
  query: string;
  filterHasSong: MemorySongFilter;
  sort: MemorySortOrder;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: MemorySongFilter) => void;
  onSortChange: (value: MemorySortOrder) => void;
};

export function MemorySearchControls({
  query,
  filterHasSong,
  sort,
  onQueryChange,
  onFilterChange,
  onSortChange,
}: MemorySearchControlsProps) {
  return (
    <View style={styles.container}>
      <Input
        value={query}
        onChangeText={onQueryChange}
        placeholder="Search memories"
        placeholderTextColor={colors.mutedText}
        autoCapitalize="none"
        testID="memory-search-input"
        leadingIcon={<Feather name="search" size={18} color={colors.mutedText} />}
      />

      <Divider />

      <View style={styles.row}>
        <Text variant="caption" muted>
          Song attachment
        </Text>
        <View style={styles.chipRow}>
          <Chip label="All" active={filterHasSong === 'all'} onPress={() => onFilterChange('all')} />
          <Chip
            label="With song"
            active={filterHasSong === 'withSong'}
            onPress={() => onFilterChange('withSong')}
          />
          <Chip
            label="Without"
            active={filterHasSong === 'withoutSong'}
            onPress={() => onFilterChange('withoutSong')}
          />
        </View>
      </View>

      <View style={styles.row}>
        <Text variant="caption" muted>
          Sort order
        </Text>
        <View style={styles.chipRow}>
          <Chip label="Newest" active={sort === 'newest'} onPress={() => onSortChange('newest')} />
          <Chip label="Oldest" active={sort === 'oldest'} onPress={() => onSortChange('oldest')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
  },
  row: {
    gap: spacing.xs,
  },
  chipRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
});

export default MemorySearchControls;
