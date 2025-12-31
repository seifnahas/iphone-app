import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Button } from './Button';
import { colors, spacing, text as textTokens } from './tokens';

type ModalHeaderProps = {
  title: string;
  subtitle?: string;
  onClose?: () => void;
};

export function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textColumn}>
        <Text style={styles.title}>{title}</Text>
        {subtitle ? <Text style={styles.subtitle}>{subtitle}</Text> : null}
      </View>
      {onClose ? (
        <Button title="Close" variant="secondary" size="sm" onPress={onClose} />
      ) : null}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    justifyContent: 'space-between',
    gap: spacing.md,
    paddingBottom: spacing.sm,
  },
  textColumn: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...textTokens.title,
    color: colors.text,
  },
  subtitle: {
    ...textTokens.body,
    color: colors.mutedText,
  },
});

export default ModalHeader;
