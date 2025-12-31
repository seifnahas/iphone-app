import React, { ReactNode } from 'react';
import { ActivityIndicator, Pressable, PressableProps, StyleSheet, View } from 'react-native';

import { colors, radius, spacing, text as textTokens } from './tokens';
import { Text } from './Text';

type ButtonVariant = 'primary' | 'ghost' | 'subtle' | 'danger' | 'secondary';
type ButtonSize = 'sm' | 'md';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  icon?: ReactNode;
  pressableProps?: Omit<PressableProps, 'onPress'>;
} & Pick<PressableProps, 'testID' | 'style'>;

const sizeStyles: Record<ButtonSize, object> = {
  sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
    minHeight: 40,
  },
  md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
    minHeight: 48,
  },
};

const variantStyles: Record<
  ButtonVariant,
  { container: object; textColor: string; pressed?: object; borderColor?: string }
> = {
  primary: {
    container: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    textColor: '#ffffff',
    pressed: { opacity: 0.94 },
  },
  ghost: {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    textColor: colors.text,
    pressed: { backgroundColor: colors.surfaceMuted },
  },
  subtle: {
    container: {
      backgroundColor: colors.surfaceMuted,
      borderColor: colors.border,
    },
    textColor: colors.text,
    pressed: { backgroundColor: colors.surfaceSubtle },
  },
  secondary: {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    textColor: colors.text,
    pressed: { backgroundColor: colors.surfaceMuted },
  },
  danger: {
    container: {
      backgroundColor: colors.danger,
      borderColor: colors.danger,
    },
    textColor: '#ffffff',
    pressed: { opacity: 0.9 },
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  icon,
  style,
  pressableProps,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = variantStyles[variant] ?? variantStyles.primary;

  return (
    <Pressable
      accessibilityRole="button"
      accessibilityState={{ disabled: isDisabled }}
      disabled={isDisabled}
      onPress={onPress}
      style={({ pressed }) => [
        styles.base,
        sizeStyles[size],
        variantStyle.container,
        pressed && !isDisabled && variantStyle.pressed,
        isDisabled && styles.disabled,
        style,
      ]}
      testID={testID}
      {...pressableProps}
    >
      <View style={styles.content}>
        {icon ? <View style={styles.icon}>{icon}</View> : null}
        {loading ? (
          <ActivityIndicator size="small" color={variantStyle.textColor} />
        ) : (
          <Text style={[styles.label, { color: variantStyle.textColor }]}>{title}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.lg,
    borderWidth: 1,
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  content: {
    alignItems: 'center',
    justifyContent: 'center',
    flexDirection: 'row',
    gap: spacing.sm,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  label: {
    ...textTokens.body,
    fontWeight: '700',
  },
  disabled: {
    opacity: 0.55,
  },
});

export default Button;
