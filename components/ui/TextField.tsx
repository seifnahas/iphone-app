import React from 'react';
import { StyleSheet, TextInputProps, View } from 'react-native';

import { colors, spacing } from './tokens';
import { Input } from './Input';
import { Text } from './Text';

type TextFieldProps = {
  label: string;
  value: string;
  onChangeText: (text: string) => void;
  placeholder?: string;
  multiline?: boolean;
  autoCapitalize?: 'none' | 'sentences' | 'words' | 'characters';
  keyboardType?: TextInputProps['keyboardType'];
  textContentType?: TextInputProps['textContentType'];
  helperText?: string;
  errorText?: string;
  testID?: string;
  secureTextEntry?: boolean;
};

export function TextField({
  label,
  value,
  onChangeText,
  placeholder,
  multiline = false,
  autoCapitalize,
  keyboardType,
  textContentType,
  helperText,
  errorText,
  testID,
  secureTextEntry,
}: TextFieldProps) {
  const showHelper = helperText && !errorText;

  return (
    <View style={styles.container}>
      <Text variant="caption" muted style={styles.label}>
        {label}
      </Text>
      <Input
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        textContentType={textContentType}
        testID={testID}
        secureTextEntry={secureTextEntry}
        style={[styles.input, multiline && styles.multiline, errorText ? styles.inputError : undefined]}
      />
      {showHelper ? (
        <Text variant="caption" muted>
          {helperText}
        </Text>
      ) : null}
      {errorText ? (
        <Text variant="caption" style={styles.errorText}>
          {errorText}
        </Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    letterSpacing: 0.4,
  },
  input: {
    paddingVertical: spacing.sm,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  inputError: {
    borderColor: colors.danger,
  },
  errorText: {
    color: colors.danger,
  },
});

export default TextField;
