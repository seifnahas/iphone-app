import React, { ReactNode } from 'react';
import { Pressable, PressableProps, StyleSheet, View } from 'react-native';

import { colors, radius, spacing } from './tokens';

type IconButtonVariant = 'primary' | 'ghost' | 'subtle';
type IconButtonSize = 'sm' | 'md';

type IconButtonProps = {
  icon: ReactNode;
  variant?: IconButtonVariant;
  size?: IconButtonSize;
  disabled?: boolean;
} & Pick<PressableProps, 'onPress' | 'testID'>;

const sizeStyles: Record<IconButtonSize, object> = {
  sm: {
    padding: spacing.sm,
    minWidth: 36,
    minHeight: 36,
  },
  md: {
    padding: spacing.md,
    minWidth: 44,
    minHeight: 44,
  },
};

const variantStyles: Record<IconButtonVariant, { container: object; pressed?: object }> = {
  primary: {
    container: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    pressed: { opacity: 0.92 },
  },
  ghost: {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    pressed: { backgroundColor: colors.surfaceMuted },
  },
  subtle: {
    container: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
    },
    pressed: { backgroundColor: colors.surfaceSubtle },
  },
};

export function IconButton({
  icon,
  onPress,
  variant = 'ghost',
  size = 'md',
  disabled = false,
  testID,
}: IconButtonProps) {
  const isDisabled = disabled;
  const variantStyle = variantStyles[variant];

  return (
    <Pressable
      accessibilityRole="button"
      onPress={onPress}
      disabled={isDisabled}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyle.container,
        pressed && !isDisabled && variantStyle.pressed,
        isDisabled && styles.disabled,
      ]}
      testID={testID}
    >
      <View pointerEvents="none" style={styles.icon}>
        {icon}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    alignItems: 'center',
    justifyContent: 'center',
  },
  icon: {
    alignItems: 'center',
    justifyContent: 'center',
  },
  disabled: {
    opacity: 0.55,
  },
});

export default IconButton;
