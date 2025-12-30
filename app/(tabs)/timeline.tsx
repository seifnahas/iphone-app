import { Link } from 'expo-router';
import React from 'react';
import { StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';

export default function TimelineScreen() {
  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Timeline</Text>
        <Text style={styles.description}>
          Review your memories in chronological order. Timeline list coming soon.
        </Text>
      </View>
      <Link href="/memory/placeholder-id" style={styles.link}>
        <Text style={styles.linkText}>Open a placeholder memory</Text>
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
  link: {
    marginTop: 8,
  },
  linkText: {
    color: '#0a84ff',
    fontSize: 16,
    fontWeight: '600',
  },
});
