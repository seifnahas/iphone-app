import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React from 'react';
import { StyleSheet, View } from 'react-native';

import { Screen } from '@/components/Screen';
import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Divider } from '@/components/ui/Divider';
import { Text } from '@/components/ui/Text';
import { spacing, colors } from '@/components/ui/tokens';

const tips = [
  {
    title: 'Drop pins fast',
    description: 'Long-press anywhere on the map to capture a memory with location details.',
    icon: 'map-pin' as const,
  },
  {
    title: 'Filter by vibe',
    description: 'Search, filter by songs, and sort from newest to oldest in the timeline.',
    icon: 'filter' as const,
  },
  {
    title: 'Curate collections',
    description: 'Plan future groups for trips, people, or seasons. Coming soon to this tab.',
    icon: 'folder' as const,
  },
];

export default function ExploreScreen() {
  const router = useRouter();

  return (
    <Screen>
      <View style={styles.stack}>
        <Card elevated>
          <View style={styles.hero}>
            <View style={styles.heroText}>
              <Text variant="overline" muted>
                Quick guide
              </Text>
              <Text variant="title">Explore the app</Text>
              <Text variant="caption" muted>
                A crisp overview of how to navigate pins, timelines, and collections.
              </Text>
            </View>
            <Button
              title="Open map"
              variant="primary"
              icon={<Feather name="map" size={16} color="#ffffff" />}
              onPress={() => router.push('/map')}
            />
          </View>
        </Card>

        {tips.map((tip) => (
          <Card key={tip.title}>
            <View style={styles.tipRow}>
              <View style={styles.tipIcon}>
                <Feather name={tip.icon} size={18} color={colors.text} />
              </View>
              <View style={styles.tipCopy}>
                <Text variant="subtitle">{tip.title}</Text>
                <Text variant="caption" muted>
                  {tip.description}
                </Text>
              </View>
            </View>
          </Card>
        ))}

        <Card>
          <View style={styles.actionsRow}>
            <Button
              title="Go to timeline"
              variant="ghost"
              icon={<Feather name="clock" size={16} color={colors.text} />}
              onPress={() => router.push('/timeline')}
            />
            <Button
              title="Browse collections"
              variant="ghost"
              icon={<Feather name="layers" size={16} color={colors.text} />}
              onPress={() => router.push('/collections')}
            />
          </View>
          <Divider />
          <Text variant="caption" muted>
            Need anything else? Add a TODO above so we can clarify instead of guessing.
          </Text>
        </Card>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  stack: {
    gap: spacing.md,
  },
  hero: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  heroText: {
    gap: spacing.xs,
    flex: 1,
  },
  tipRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: spacing.md,
  },
  tipIcon: {
    width: 40,
    height: 40,
    borderRadius: 20,
    backgroundColor: '#eef2f6',
    alignItems: 'center',
    justifyContent: 'center',
  },
  tipCopy: {
    gap: spacing.xs,
    flex: 1,
  },
  actionsRow: {
    flexDirection: 'row',
    gap: spacing.sm,
  },
});
