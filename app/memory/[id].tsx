import { useLocalSearchParams } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';

export default function MemoryDetailScreen() {
  const params = useLocalSearchParams<{ id?: string | string[] }>();
  const memoryId = Array.isArray(params.id) ? params.id[0] : params.id ?? 'unknown';

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Memory Detail</Text>
        <Text style={styles.description}>Viewing memory {memoryId}. Detailed view coming soon.</Text>
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
