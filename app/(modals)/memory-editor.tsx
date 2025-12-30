import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';

export default function MemoryEditorModal() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Memory Editor</Text>
        <Text style={styles.description}>
          This modal will handle creating and editing memories. Editor fields coming soon.
        </Text>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  header: {
    gap: 8,
  },
  title: {
    fontSize: 28,
    fontWeight: '600',
  },
  description: {
    fontSize: 16,
    color: '#4a4a4a',
  },
});
