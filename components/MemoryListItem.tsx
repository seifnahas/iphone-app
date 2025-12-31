import React, { useMemo } from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, text as textTokens } from './ui/tokens';
import { Memory } from '@/types/models';

type MemoryListItemProps = {
  memory: Memory;
  onPress: () => void;
  testID?: string;
};

function formatHappenedAt(value: string | undefined) {
  if (!value) return null;
  const parsed = new Date(value);
  if (Number.isNaN(parsed.getTime())) return value;
  return parsed.toLocaleString(undefined, { dateStyle: 'medium', timeStyle: 'short' });
}

export function MemoryListItem({ memory, onPress, testID }: MemoryListItemProps) {
  const formattedHappenedAt = useMemo(() => formatHappenedAt(memory.happenedAt), [memory.happenedAt]);

  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      testID={testID}
    >
      <View style={styles.cardSurface}>
        <View style={styles.headerRow}>
          <Text style={styles.title} numberOfLines={1}>
            {memory.title || 'Untitled'}
          </Text>
          {memory.song ? (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>Song</Text>
            </View>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          {formattedHappenedAt ? <Text style={styles.meta}>{formattedHappenedAt}</Text> : null}
          {memory.placeLabel ? <Text style={styles.meta}>{memory.placeLabel}</Text> : null}
        </View>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.lg,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.94,
  },
  cardSurface: {
    gap: spacing.sm,
    paddingHorizontal: spacing.md,
    paddingVertical: spacing.md,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    borderRadius: radius.lg,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    ...textTokens.body,
    color: colors.text,
    fontWeight: '700',
    flex: 1,
  },
  badge: {
    backgroundColor: '#e8f1ff',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.md,
  },
  badgeText: {
    ...textTokens.caption,
    color: colors.primary,
    fontWeight: '600',
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  meta: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
});

export default MemoryListItem;
