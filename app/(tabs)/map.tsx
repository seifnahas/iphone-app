import { Link } from 'expo-router';
import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';

export default function MapScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
        <Text style={styles.description}>Visualize your memories on the map. Map logic coming soon.</Text>
      </View>
      <Link href="/(modals)/memory-editor" asChild>
        <Pressable style={styles.button}>
          <Text style={styles.buttonText}>Create Memory</Text>
        </Pressable>
      </Link>
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
  button: {
    marginTop: 8,
    backgroundColor: '#0a84ff',
    paddingHorizontal: 14,
    paddingVertical: 12,
    borderRadius: 10,
  },
  buttonText: {
    color: '#ffffff',
    fontWeight: '600',
    fontSize: 16,
    textAlign: 'center',
  },
});
