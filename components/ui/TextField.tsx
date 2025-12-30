import React from 'react';
import { StyleSheet, Text, TextInput, TextInputProps, View } from 'react-native';

import { colors, radius, spacing, text as textTokens } from './tokens';

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
}: TextFieldProps) {
  return (
    <View style={styles.container}>
      <Text style={styles.label}>{label}</Text>
      <TextInput
        value={value}
        onChangeText={onChangeText}
        placeholder={placeholder}
        placeholderTextColor={colors.mutedText}
        multiline={multiline}
        autoCapitalize={autoCapitalize}
        keyboardType={keyboardType}
        textContentType={textContentType}
        style={[
          styles.input,
          multiline && styles.multiline,
          errorText ? styles.inputError : styles.inputDefault,
        ]}
        testID={testID}
      />
      {errorText ? (
        <Text style={styles.errorText}>{errorText}</Text>
      ) : helperText ? (
        <Text style={styles.helperText}>{helperText}</Text>
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    gap: spacing.xs,
  },
  label: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
  input: {
    ...textTokens.body,
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderRadius: radius.md,
    paddingVertical: spacing.sm,
    paddingHorizontal: spacing.md,
    color: colors.text,
  },
  inputDefault: {
    borderColor: colors.border,
  },
  inputError: {
    borderColor: colors.destructive,
  },
  multiline: {
    minHeight: 96,
    textAlignVertical: 'top',
  },
  helperText: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
  errorText: {
    ...textTokens.caption,
    color: colors.destructive,
  },
});

export default TextField;
