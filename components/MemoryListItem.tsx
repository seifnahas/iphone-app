import Feather from '@expo/vector-icons/Feather';
import React, { useMemo } from 'react';
import { Pressable, StyleSheet, View } from 'react-native';

import { Memory } from '@/types/models';

import { Card } from './ui/Card';
import { colors, radius, spacing } from './ui/tokens';
import { Text } from './ui/Text';

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

function Meta({ icon, label }: { icon: keyof typeof Feather.glyphMap; label: string }) {
  return (
    <View style={styles.metaPill}>
      <Feather name={icon} size={14} color={colors.mutedText} />
      <Text variant="caption" muted numberOfLines={1}>
        {label}
      </Text>
    </View>
  );
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
      <Card style={styles.cardSurface} padded>
        <View style={styles.headerRow}>
          <Text variant="subtitle" numberOfLines={1} style={styles.title}>
            {memory.title || 'Untitled'}
          </Text>
          {memory.song ? (
            <View style={styles.badge}>
              <Feather name="music" size={14} color={colors.primary} />
              <Text variant="caption" style={styles.badgeText}>
                Song
              </Text>
            </View>
          ) : null}
        </View>

        <View style={styles.metaRow}>
          {formattedHappenedAt ? <Meta icon="clock" label={formattedHappenedAt} /> : null}
          {memory.placeLabel ? (
            <Meta icon="map-pin" label={memory.placeLabel} />
          ) : (
            <Meta icon="map" label={`${memory.latitude.toFixed(2)}, ${memory.longitude.toFixed(2)}`} />
          )}
        </View>
      </Card>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  container: {
    borderRadius: radius.xl,
    overflow: 'hidden',
  },
  pressed: {
    opacity: 0.94,
  },
  cardSurface: {
    gap: spacing.sm,
  },
  headerRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.sm,
  },
  title: {
    flex: 1,
  },
  badge: {
    backgroundColor: colors.primaryForeground,
    paddingHorizontal: spacing.sm,
    paddingVertical: spacing.xs / 2,
    borderRadius: radius.pill,
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
  },
  badgeText: {
    color: colors.primary,
  },
  metaRow: {
    flexDirection: 'row',
    flexWrap: 'wrap',
    gap: spacing.sm,
  },
  metaPill: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.xs,
    paddingVertical: spacing.xs,
    paddingHorizontal: spacing.sm,
    borderRadius: radius.pill,
    backgroundColor: colors.surfaceMuted,
  },
});

export default MemoryListItem;
