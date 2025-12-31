import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Button } from './Button';
import { spacing } from './tokens';
import { Text } from './Text';

type ModalHeaderProps = {
  title: string;
  subtitle?: string;
  onClose?: () => void;
};

export function ModalHeader({ title, subtitle, onClose }: ModalHeaderProps) {
  return (
    <View style={styles.container}>
      <View style={styles.textColumn}>
        <Text variant="title">{title}</Text>
        {subtitle ? (
          <Text variant="body" muted>
            {subtitle}
          </Text>
        ) : null}
      </View>
      {onClose ? <Button title="Close" variant="ghost" size="sm" onPress={onClose} /> : null}
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
});

export default ModalHeader;
