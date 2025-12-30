import { useRouter } from 'expo-router';
import React, { useMemo } from 'react';
import { StyleSheet, Text, View } from 'react-native';
import MapView, { LongPressEvent, Marker, Region } from 'react-native-maps';

import { Screen } from '@/components/Screen';
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

  return (
    <Screen>
      <View style={styles.header}>
        <Text style={styles.title}>Map</Text>
        <Text style={styles.description}>Drop pins to add memories at any spot.</Text>
      </View>

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
  map: {
    flex: 1,
    borderRadius: 12,
    overflow: 'hidden',
  },
});
