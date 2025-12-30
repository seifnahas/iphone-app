import React from 'react';
import {
  ActivityIndicator,
  Pressable,
  StyleSheet,
  Text,
  View,
  ViewStyle,
} from 'react-native';

import { colors, radius, spacing, text as textTokens } from './tokens';

type ButtonVariant = 'primary' | 'secondary' | 'destructive';
type ButtonSize = 'sm' | 'md';

type ButtonProps = {
  title: string;
  onPress: () => void;
  variant?: ButtonVariant;
  size?: ButtonSize;
  disabled?: boolean;
  loading?: boolean;
  style?: ViewStyle;
  testID?: string;
};

const sizeStyles: Record<ButtonSize, ViewStyle> = {
  sm: {
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.lg,
  },
  md: {
    paddingVertical: spacing.md,
    paddingHorizontal: spacing.xl,
  },
};

const variantStyles: Record<
  ButtonVariant,
  { container: ViewStyle; text: { color: string }; textColor: string; pressed?: ViewStyle }
> = {
  primary: {
    container: {
      backgroundColor: colors.primary,
      borderColor: colors.primary,
    },
    text: { color: '#ffffff' },
    textColor: '#ffffff',
    pressed: { opacity: 0.9 },
  },
  secondary: {
    container: {
      backgroundColor: colors.surface,
      borderColor: colors.border,
    },
    text: { color: colors.text },
    textColor: colors.text,
    pressed: { backgroundColor: colors.background },
  },
  destructive: {
    container: {
      backgroundColor: colors.destructive,
      borderColor: colors.destructive,
    },
    text: { color: '#ffffff' },
    textColor: '#ffffff',
    pressed: { opacity: 0.92 },
  },
};

export function Button({
  title,
  onPress,
  variant = 'primary',
  size = 'md',
  disabled = false,
  loading = false,
  style,
  testID,
}: ButtonProps) {
  const isDisabled = disabled || loading;
  const variantStyle = variantStyles[variant];

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
        isDisabled && styles.disabled,
        pressed && !isDisabled && variantStyle.pressed,
        style,
      ]}
      testID={testID}
    >
      <View style={styles.content}>
        {loading ? (
          <ActivityIndicator size="small" color={variantStyle.textColor} />
        ) : (
          <Text style={[styles.label, variantStyle.text]}>{title}</Text>
        )}
      </View>
    </Pressable>
  );
}

const styles = StyleSheet.create({
  base: {
    borderRadius: radius.md,
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
  label: {
    ...textTokens.body,
  },
  disabled: {
    opacity: 0.6,
  },
});

export default Button;
