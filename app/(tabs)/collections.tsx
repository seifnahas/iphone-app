import React from 'react';
import { Pressable, StyleSheet, Text, View } from 'react-native';

import { Screen } from '@/components/Screen';

export default function CollectionsScreen() {
  const handleNewCollectionPress = () => {
    // TODO: Hook up collection creation flow
  };

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Collections</Text>
        <Text style={styles.description}>
          Group memories into collections. Creation and assignment features are coming soon.
        </Text>
      </View>
      <Pressable style={styles.button} onPress={handleNewCollectionPress}>
        <Text style={styles.buttonText}>New Collection</Text>
      </Pressable>
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
