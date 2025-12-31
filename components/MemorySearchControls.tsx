import React from 'react';
import { Pressable, StyleSheet, Text, TextInput, View } from 'react-native';

import { MemorySongFilter, MemorySortOrder } from '@/lib/memorySearch';
import { colors, radius, spacing, text as textTokens } from './ui/tokens';

type MemorySearchControlsProps = {
  query: string;
  filterHasSong: MemorySongFilter;
  sort: MemorySortOrder;
  onQueryChange: (value: string) => void;
  onFilterChange: (value: MemorySongFilter) => void;
  onSortChange: (value: MemorySortOrder) => void;
};

type OptionPillProps = {
  label: string;
  active: boolean;
  onPress: () => void;
};

function OptionPill({ label, active, onPress }: OptionPillProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [
        styles.pill,
        active ? styles.pillActive : styles.pillInactive,
        pressed && styles.pillPressed,
      ]}
      accessibilityRole="button"
    >
      <Text style={[styles.pillText, active ? styles.pillTextActive : styles.pillTextInactive]}>
        {label}
      </Text>
    </Pressable>
  );
}

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
      <TextInput
        value={query}
        onChangeText={onQueryChange}
        placeholder="Search memories"
        placeholderTextColor={colors.mutedText}
        autoCapitalize="none"
        style={styles.searchInput}
        testID="memory-search-input"
      />

      <View style={styles.row}>
        <Text style={styles.label}>Song</Text>
        <View style={styles.pillRow}>
          <OptionPill label="All" active={filterHasSong === 'all'} onPress={() => onFilterChange('all')} />
          <OptionPill
            label="With song"
            active={filterHasSong === 'withSong'}
            onPress={() => onFilterChange('withSong')}
          />
          <OptionPill
            label="Without"
            active={filterHasSong === 'withoutSong'}
            onPress={() => onFilterChange('withoutSong')}
          />
        </View>
      </View>

      <View style={styles.row}>
        <Text style={styles.label}>Sort</Text>
        <View style={styles.pillRow}>
          <OptionPill label="Newest" active={sort === 'newest'} onPress={() => onSortChange('newest')} />
          <OptionPill label="Oldest" active={sort === 'oldest'} onPress={() => onSortChange('oldest')} />
        </View>
      </View>
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
    padding: spacing.md,
  },
  searchInput: {
    ...textTokens.body,
    backgroundColor: colors.background,
    borderColor: colors.border,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  row: {
    gap: spacing.xs,
  },
  label: {
    ...textTokens.caption,
    color: colors.mutedText,
    fontWeight: '600',
  },
  pillRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  pill: {
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    borderWidth: 1,
    minHeight: 44,
    alignItems: 'center',
    justifyContent: 'center',
  },
  pillActive: {
    backgroundColor: '#e8f1ff',
    borderColor: colors.primary,
  },
  pillInactive: {
    backgroundColor: colors.background,
    borderColor: colors.border,
  },
  pillPressed: {
    opacity: 0.9,
  },
  pillText: {
    ...textTokens.body,
  },
  pillTextActive: {
    color: colors.primary,
    fontWeight: '700',
  },
  pillTextInactive: {
    color: colors.text,
  },
});

export default MemorySearchControls;
