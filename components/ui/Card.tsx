import React, { ReactNode } from 'react';
import { StyleSheet, View, ViewStyle } from 'react-native';

import { colors, hairlineWidth, radius, shadow, spacing } from './tokens';

type CardProps = {
  children: ReactNode;
  style?: ViewStyle;
  padded?: boolean;
  elevated?: boolean;
  muted?: boolean;
};

export function Card({ children, style, padded = true, elevated = false, muted = false }: CardProps) {
  return (
    <View
      style={[
        styles.card,
        muted && styles.muted,
        elevated && styles.elevated,
        padded ? styles.padded : styles.unpadded,
        style,
      ]}
    >
      {children}
    </View>
  );
}

const styles = StyleSheet.create({
  card: {
    backgroundColor: colors.surface,
    borderColor: colors.border,
    borderWidth: hairlineWidth,
    borderRadius: radius.xl,
  },
  muted: {
    backgroundColor: colors.surfaceMuted,
  },
  padded: {
    padding: spacing.lg,
  },
  unpadded: {
    padding: spacing.sm,
  },
  elevated: {
    ...shadow.soft,
  },
});

export default Card;
