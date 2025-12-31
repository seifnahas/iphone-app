import Feather from '@expo/vector-icons/Feather';
import { useRouter } from 'expo-router';
import React, { useEffect, useMemo, useState } from 'react';
import { ScrollView, StyleSheet, View } from 'react-native';
import MapView, { LongPressEvent, Marker, Region } from 'react-native-maps';

import { Screen } from '@/components/Screen';
import { Card } from '@/components/ui/Card';
import { IconButton } from '@/components/ui/IconButton';
import { MemoryPin } from '@/components/ui/map/MemoryPin';
import { Text } from '@/components/ui/Text';
import { Button } from '@/components/ui/Button';
import { colors, radius, spacing } from '@/components/ui/tokens';
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
  const [selectedMemoryId, setSelectedMemoryId] = useState<string | null>(null);

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

  const selectedMemory = useMemo(
    () => memories.find((memory) => memory.id === selectedMemoryId) ?? memories[0],
    [memories, selectedMemoryId],
  );

  useEffect(() => {
    if (isHydrated && memories.length && !selectedMemoryId) {
      setSelectedMemoryId(memories[0].id);
    }
  }, [isHydrated, memories, selectedMemoryId]);

  const handleMarkerPress = (id: string) => {
    setSelectedMemoryId(id);
  };

  const handleOpenMemory = (id?: string) => {
    if (!id) return;
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
    <Screen padded={false}>
      <View style={styles.mapContainer}>
        <MapView style={styles.map} initialRegion={initialRegion} onLongPress={handleLongPress}>
          {isHydrated &&
            memories.map((memory) => (
              <Marker
                key={memory.id}
                coordinate={{ latitude: memory.latitude, longitude: memory.longitude }}
                onPress={() => handleMarkerPress(memory.id)}
                anchor={{ x: 0.5, y: 1 }}
              >
                <MemoryPin selected={selectedMemory?.id === memory.id} />
              </Marker>
            ))}
        </MapView>

        <View pointerEvents="box-none" style={styles.overlayTop}>
          <Card elevated style={styles.overlayCard}>
            <View style={styles.overlayHeader}>
              <View style={styles.overlayText}>
                <Text variant="overline" muted>
                  Memory map
                </Text>
                <Text variant="title">Pinboard</Text>
                <Text variant="caption" muted>
                  Long-press anywhere to capture a moment. Tap a pin to preview it.
                </Text>
              </View>
              <IconButton
                variant="subtle"
                icon={<Feather name="search" size={18} color={colors.text} />}
                onPress={handleOpenSearch}
              />
            </View>
          </Card>
          {!isHydrated ? (
            <Card muted style={styles.statusCard}>
              <Text variant="caption" muted>
                Loading memories...
              </Text>
            </Card>
          ) : null}
        </View>

        <View pointerEvents="box-none" style={styles.overlayBottom}>
          <Card elevated style={styles.contextCard}>
            <View style={styles.contextHeader}>
              <View>
                <Text variant="caption" muted>
                  Memory pins
                </Text>
                <Text variant="subtitle">
                  {memories.length ? `${memories.length} saved` : 'No pins yet'}
                </Text>
              </View>
              <Button
                title="New memory"
                size="sm"
                variant="primary"
                onPress={() =>
                  router.push({
                    pathname: '/(modals)/memory-editor',
                    params: {
                      latitude: (selectedMemory?.latitude ?? DEFAULT_REGION.latitude).toString(),
                      longitude: (selectedMemory?.longitude ?? DEFAULT_REGION.longitude).toString(),
                      happenedAt: new Date().toISOString(),
                    },
                  })
                }
                icon={<Feather name="plus" size={16} color="#ffffff" />}
              />
            </View>

            <ScrollView
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.pillsRow}
            >
              {memories.map((memory) => {
                const isActive = memory.id === selectedMemory?.id;
                return (
                  <IconButton
                    key={memory.id}
                    variant={isActive ? 'primary' : 'ghost'}
                    size="md"
                    onPress={() => setSelectedMemoryId(memory.id)}
                    icon={<Feather name="map-pin" size={18} color={isActive ? '#ffffff' : colors.text} />}
                    testID={`memory-pill-${memory.id}`}
                  />
                );
              })}
            </ScrollView>

            {selectedMemory ? (
              <View style={styles.selectionRow}>
                <View style={styles.selectionMeta}>
                  <Text variant="body" style={styles.selectionTitle} numberOfLines={1}>
                    {selectedMemory.title || 'Pinned memory'}
                  </Text>
                  <Text variant="caption" muted numberOfLines={2}>
                    {selectedMemory.placeLabel ??
                      `${selectedMemory.latitude.toFixed(2)}, ${selectedMemory.longitude.toFixed(2)}`}
                  </Text>
                </View>
                <Button
                  title="Open"
                  size="sm"
                  variant="ghost"
                  onPress={() => handleOpenMemory(selectedMemory.id)}
                />
              </View>
            ) : (
              <Text variant="caption" muted>
                Tap and hold on the map to add your first memory.
              </Text>
            )}
          </Card>
        </View>
      </View>
    </Screen>
  );
}

const styles = StyleSheet.create({
  mapContainer: {
    flex: 1,
    backgroundColor: colors.surface,
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
    gap: spacing.md,
  },
  overlayText: {
    flex: 1,
    gap: spacing.xs,
  },
  statusCard: {
    padding: spacing.md,
  },
  overlayBottom: {
    position: 'absolute',
    left: spacing.lg,
    right: spacing.lg,
    bottom: spacing.lg,
  },
  contextCard: {
    gap: spacing.md,
    borderRadius: radius.xl,
  },
  contextHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    gap: spacing.md,
  },
  pillsRow: {
    gap: spacing.sm,
  },
  selectionRow: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    gap: spacing.md,
  },
  selectionMeta: {
    flex: 1,
    gap: spacing.xs,
  },
  selectionTitle: {
    fontWeight: '700',
  },
});
