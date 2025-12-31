import React from 'react';
import { StyleSheet, View } from 'react-native';

import { colors, radius, shadow } from '@/components/ui/tokens';

type MemoryPinProps = {
  selected?: boolean;
};

export function MemoryPin({ selected = false }: MemoryPinProps) {
  return (
    <View style={styles.container}>
      <View style={[styles.pin, selected && styles.pinSelected]}>
        <View style={[styles.dot, selected && styles.dotSelected]} />
      </View>
      <View style={[styles.tail, selected && styles.tailSelected]} />
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    alignItems: 'center',
  },
  pin: {
    width: 32,
    height: 32,
    borderRadius: radius.lg,
    backgroundColor: colors.surface,
    borderWidth: 2,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
    ...shadow.subtle,
  },
  pinSelected: {
    borderColor: colors.primary,
  },
  dot: {
    width: 14,
    height: 14,
    borderRadius: radius.pill,
    backgroundColor: colors.accent,
    borderWidth: 1,
    borderColor: colors.surface,
  },
  dotSelected: {
    backgroundColor: colors.primary,
  },
  tail: {
    width: 10,
    height: 10,
    backgroundColor: colors.border,
    transform: [{ rotate: '45deg' }],
    marginTop: -4,
    borderBottomLeftRadius: radius.sm,
    borderBottomRightRadius: radius.sm,
  },
  tailSelected: {
    backgroundColor: colors.primary,
  },
});

export default MemoryPin;
