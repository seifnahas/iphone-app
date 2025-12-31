import React, { ReactNode } from 'react';
import { StyleProp, StyleSheet, TextInput, TextInputProps, View, ViewStyle } from 'react-native';

import { colors, radius, spacing, text as textTokens } from './tokens';

type InputProps = TextInputProps & {
  leadingIcon?: ReactNode;
  trailingIcon?: ReactNode;
  containerStyle?: StyleProp<ViewStyle>;
};

export function Input({ leadingIcon, trailingIcon, style, containerStyle, ...rest }: InputProps) {
  return (
    <View style={[styles.container, containerStyle]}>
      {leadingIcon ? <View style={styles.icon}>{leadingIcon}</View> : null}
      <TextInput
        placeholderTextColor={colors.mutedText}
        style={[
          styles.input,
          leadingIcon ? styles.hasLeading : undefined,
          trailingIcon ? styles.hasTrailing : undefined,
          style,
        ]}
        {...rest}
      />
      {trailingIcon ? <View style={styles.icon}>{trailingIcon}</View> : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'center',
    borderRadius: radius.lg,
    borderWidth: 1,
    borderColor: colors.border,
    backgroundColor: colors.surface,
    paddingHorizontal: spacing.md,
    minHeight: 48,
  },
  icon: {
    justifyContent: 'center',
    alignItems: 'center',
  },
  input: {
    flex: 1,
    ...textTokens.body,
    color: colors.text,
    paddingVertical: spacing.sm,
  },
  hasLeading: {
    marginLeft: spacing.sm,
  },
  hasTrailing: {
    marginRight: spacing.sm,
  },
});

export default Input;
