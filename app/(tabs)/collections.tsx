import Feather from '@expo/vector-icons/Feather';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { EmptyState } from '@/components/ui/EmptyState';
import { Text } from '@/components/ui/Text';
import { colors, spacing } from '@/components/ui/tokens';

export default function CollectionsScreen() {
  const handleNewCollectionPress = () => {
    // TODO: Hook up collection creation flow
  };

  return (
    <Screen>
      <View style={styles.stack}>
        <Card elevated>
          <View style={styles.header}>
            <View style={styles.headerText}>
              <Text variant="overline" muted>
                Organize
              </Text>
              <Text variant="title">Collections</Text>
              <Text variant="caption" muted>
                Group memories into curated sets for trips, people, or themes.
              </Text>
            </View>
            <Button
            title="New collection"
            variant="primary"
            icon={<Feather name="plus" size={16} color="#ffffff" />}
            onPress={handleNewCollectionPress}
          />
          </View>
          <Divider />
          <Text variant="caption" muted>
            Collection creation and assignment flows are coming soon. Use the map to keep adding memories in the
            meantime.
          </Text>
        </Card>

        <Card>
          <EmptyState
            title="Nothing here yet"
            description="Once collections are available, you'll see them listed here for quick browsing."
            icon={<Feather name="folder" size={20} color={colors.text} />}
            action={<Button title="Plan a set" variant="ghost" size="sm" onPress={handleNewCollectionPress} />}
          />
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  header: {
    gap: spacing.md,
  },
  headerText: {
    gap: spacing.xs,
  },
});
