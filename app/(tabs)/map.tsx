import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { LongPressEvent, Marker, Region } from 'react-native-maps';

import { Button } from '@/components/ui/Button';
import { Card } from '@/components/ui/Card';
import { Screen } from '@/components/Screen';
import { colors, radius, spacing, text as textTokens } from '@/components/ui/tokens';
import { useMemoriesStore } from '@/store/memoriesStore';

const DEFAULT_REGION: Region = {
  latitude: 37.7749,
  longitude: -122.4194,
  latitudeDelta: 0.5,
  longitudeDelta: 0.5,
};

export default function MapScreen() {
  const router = useRouter();
  const memories = useMemoriesStore((state) => state.memories);
  const isHydrated = useMemoriesStore((state) => state.isHydrated);

  const initialRegion = useMemo<Region>(() => {
    if (memories.length > 0) {
      const firstMemory = memories[0];
      return {
        latitude: firstMemory.latitude,
        longitude: firstMemory.longitude,
        latitudeDelta: 0.1,
        longitudeDelta: 0.1,
      };
    }

    return DEFAULT_REGION;
  }, [memories]);

  const handleMarkerPress = (id: string) => {
    router.push(`/memory/${id}`);
  };

  const handleLongPress = (event: LongPressEvent) => {
    const { latitude, longitude } = event.nativeEvent.coordinate;
    const happenedAt = new Date().toISOString();

    router.push({
      pathname: '/(modals)/memory-editor',
      params: {
        latitude: latitude.toString(),
        longitude: longitude.toString(),
        happenedAt,
      },
    });
  };

  const handleOpenSearch = () => {
    router.push('/(modals)/pin-search');
  };

  return (
    <Screen>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={initialRegion} onLongPress={handleLongPress}>
          {isHydrated &&
            memories.map((memory) => (
              <Marker
                key={memory.id}
                coordinate={{ latitude: memory.latitude, longitude: memory.longitude }}
                onPress={() => handleMarkerPress(memory.id)}
                title={memory.title || 'Memory'}
              />
            ))}
        </MapView>

        <View pointerEvents="box-none" style={styles.overlayTop}>
          <Card style={styles.overlayCard}>
            <View style={styles.overlayHeader}>
              <View style={styles.overlayText}>
                <Text style={styles.title}>Map</Text>
                <Text style={styles.subtitle}>Long-press anywhere to drop a memory.</Text>
              </View>
              <Button title="Search pins" variant="secondary" size="sm" onPress={handleOpenSearch} />
            </View>
          </Card>
          {!isHydrated ? (
            <Card style={styles.statusCard}>
              <Text style={styles.loading}>Loading memories...</Text>
            </Card>
          ) : null}
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    borderRadius: radius.lg,
    overflow: 'hidden',
    backgroundColor: colors.surface,
    borderWidth: 1,
    borderColor: colors.border,
    position: 'relative',
  },
  map: {
    flex: 1,
  },
  overlayTop: {
    position: 'absolute',
    top: spacing.lg,
    left: spacing.lg,
    right: spacing.lg,
    gap: spacing.sm,
  },
  overlayCard: {
    padding: spacing.md,
  },
  overlayHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    borderRadius: radius.lg,
    gap: spacing.md,
  },
  overlayText: {
    flex: 1,
    gap: spacing.xs,
  },
  title: {
    ...textTokens.title,
    color: colors.text,
  },
  subtitle: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
  statusCard: {
    padding: spacing.md,
  },
  loading: {
    ...textTokens.caption,
    color: colors.mutedText,
  },
});
