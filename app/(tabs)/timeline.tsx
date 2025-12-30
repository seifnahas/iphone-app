import { Link } from 'expo-router';
import React from 'react';
import { FlatList, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { useMemoriesStore } from '@/store/memoriesStore';

export default function TimelineScreen() {
  const memories = useMemoriesStore((state) => state.memories);
  const isHydrated = useMemoriesStore((state) => state.isHydrated);

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Timeline</Text>
        <Text style={styles.description}>Review your memories in chronological order.</Text>
      </View>

      {!isHydrated ? (
        <Text style={styles.muted}>Loading memories...</Text>
      ) : memories.length === 0 ? (
        <Text style={styles.muted}>No memories yet. Create one to see it here.</Text>
      ) : (
        <FlatList
          data={memories}
          keyExtractor={(item) => item.id}
          ItemSeparatorComponent={() => <View style={styles.separator} />}
          renderItem={({ item }) => (
            <Link href={`/memory/${item.id}`} style={styles.link}>
              <Text style={styles.memoryTitle}>{item.title || 'Untitled'}</Text>
              <Text style={styles.meta}>{item.happenedAt}</Text>
            </Link>
          )}
        />
      )}
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
  muted: {
    color: '#6b6b6b',
    fontSize: 16,
  },
  separator: {
    height: 1,
    backgroundColor: '#e0e0e0',
    marginVertical: 8,
  },
  link: {
    paddingVertical: 8,
  },
  memoryTitle: {
    color: '#0a84ff',
    fontSize: 17,
    fontWeight: '600',
  },
  meta: {
    color: '#6b6b6b',
    fontSize: 14,
  },
});
