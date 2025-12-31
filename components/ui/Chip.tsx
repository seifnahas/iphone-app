import React from 'react';
import { Pressable, PressableProps, StyleProp, StyleSheet, View, ViewStyle } from 'react-native';

import { colors, radius, spacing, text as textTokens } from './tokens';
import { Text } from './Text';

type ChipVariant = 'solid' | 'outline' | 'ghost';

type ChipProps = {
  label: string;
  active?: boolean;
  variant?: ChipVariant;
  style?: StyleProp<ViewStyle>;
} & Pick<PressableProps, 'onPress' | 'testID'>;

const variantStyles: Record<ChipVariant, { container: object; active?: object; text?: object }> = {
  solid: {
    container: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
    },
    active: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    text: {
      color: colors.text,
    },
  },
  outline: {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    active: {
      borderColor: colors.primary,
    },
    text: {
      color: colors.text,
    },
  },
  ghost: {
    container: {
      backgroundColor: 'transparent',
      borderColor: colors.border,
    },
    active: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.primary,
    },
  },
};

export function Chip({ label, active = false, variant = 'solid', onPress, testID, style }: ChipProps) {
  const variantStyle = variantStyles[variant];

  return (
    <Pressable
      onPress={onPress}
      testID={testID}
      style={({ pressed }) => [
        styles.base,
        variantStyle.container,
        active && variantStyle.active,
        pressed && styles.pressed,
        style,
      ]}
    >
      <View>
        <Text variant="caption" style={[styles.label, variantStyle.text, active && styles.activeLabel]}>
          {label}
        </Text>
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderWidth: 1,
    borderRadius: radius.pill,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    alignItems: 'center',
    justifyContent: 'center',
    minHeight: 36,
  },
  label: {
    ...textTokens.body,
    fontSize: 14,
  },
  activeLabel: {
    color: colors.primaryForeground,
  },
  pressed: {
    opacity: 0.92,
  },
});

export default Chip;
