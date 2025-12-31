import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { colors, radius, spacing, text as textTokens } from './ui/tokens';
import { Memory } from '@/types/models';

type MemoryListItemProps = {
  memory: Memory;
  onPress: () => void;
  testID?: string;
};

export function MemoryListItem({ memory, onPress, testID }: MemoryListItemProps) {
  return (
    <Pressable
      onPress={onPress}
      style={({ pressed }) => [styles.container, pressed && styles.pressed]}
      accessibilityRole="button"
      testID={testID}
    >
      <View style={styles.headerRow}>
        <Text style={styles.title}>{memory.title || 'Untitled'}</Text>
        {memory.song ? <Text style={styles.badge}>Song</Text> : null}
      </View>
      <Text style={styles.meta}>{memory.happenedAt}</Text>
      {memory.placeLabel ? <Text style={styles.place}>{memory.placeLabel}</Text> : null}
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
    paddingVertical: spacing.sm,
  },
  pressed: {
    opacity: 0.9,
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
    ...textTokens.caption,
    color: colors.primary,
    backgroundColor: '#e8f1ff',
    paddingHorizontal: spacing.sm,
    paddingVertical: 2,
    borderRadius: radius.sm,
  },
  meta: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
  place: {
    ...textTokens.caption,
    color: colors.text,
  },
});

export default MemoryListItem;
