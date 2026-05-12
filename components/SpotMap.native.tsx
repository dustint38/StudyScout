import { useEffect, useRef, useState } from 'react';
import { ActivityIndicator, Pressable, StyleSheet, Text, View } from 'react-native';
import * as Location from 'expo-location';
import { router } from 'expo-router';
import { useStudySpots } from '@/hooks/useStudySpots';

// react-native-maps requires a development build — not available in Expo Go.
// We lazy-require it so the tab doesn't crash when running in Expo Go.
let NativeMapView: any = null;
let NativeMarker: any = null;
let NativeCallout: any = null;
try {
  const maps = require('react-native-maps');
  NativeMapView = maps.default;
  NativeMarker = maps.Marker;
  NativeCallout = maps.Callout;
} catch {
  // Expo Go: native module not registered
}

type Region = {
  latitude: number;
  longitude: number;
  latitudeDelta: number;
  longitudeDelta: number;
};

const DEFAULT_REGION: Region = {
  latitude: 34.0689,
  longitude: -118.4452,
  latitudeDelta: 0.02,
  longitudeDelta: 0.02,
};

export default function SpotMap() {
  const mapRef = useRef<any>(null);
  const { spots } = useStudySpots();
  const [userLocation, setUserLocation] = useState<{ latitude: number; longitude: number } | null>(null);
  const [locationError, setLocationError] = useState<string | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    (async () => {
      const { status } = await Location.requestForegroundPermissionsAsync();
      if (status !== 'granted') {
        setLocationError('Location permission denied');
        setLoading(false);
        return;
      }
      const loc = await Location.getCurrentPositionAsync({ accuracy: Location.Accuracy.Balanced });
      setUserLocation({ latitude: loc.coords.latitude, longitude: loc.coords.longitude });
      setLoading(false);
    })();
  }, []);

  const centerOnUser = () => {
    if (!userLocation || !mapRef.current) return;
    mapRef.current.animateToRegion({
      ...userLocation,
      latitudeDelta: 0.02,
      longitudeDelta: 0.02,
    });
  };

  const initialRegion = userLocation
    ? { ...userLocation, latitudeDelta: 0.02, longitudeDelta: 0.02 }
    : DEFAULT_REGION;

  const mappableSpots = spots.filter(s => s.latitude != null && s.longitude != null);

  if (!NativeMapView) {
    return (
      <View style={styles.centered}>
        <Text style={styles.devBuildIcon}>🗺️</Text>
        <Text style={styles.devBuildTitle}>Development Build Required</Text>
        <Text style={styles.devBuildSub}>
          The map uses react-native-maps, which isn't included in Expo Go.
          Run a development build to use this feature.
        </Text>
      </View>
    );
  }

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#2774AE" />
        <Text style={styles.loadingText}>Finding your location...</Text>
      </View>
    );
  }

  return (
    <View style={styles.mapWrapper}>
      {locationError && <Text style={styles.errorText}>{locationError}</Text>}
      <NativeMapView
        ref={mapRef}
        style={StyleSheet.absoluteFillObject}
        initialRegion={initialRegion}
        showsUserLocation={userLocation != null}
        showsMyLocationButton={false}
      >
        {mappableSpots.map((spot: any) => (
          <NativeMarker
            key={spot.id}
            coordinate={{ latitude: spot.latitude, longitude: spot.longitude }}
            pinColor="#2774AE"
          >
            <NativeCallout onPress={() => router.push(`/study-spot/${spot.id}`)}>
              <View style={styles.callout}>
                <Text style={styles.calloutName}>{spot.name}</Text>
                <Text style={styles.calloutAddress} numberOfLines={1}>{spot.address}</Text>
                <View style={styles.calloutRow}>
                  <Text style={styles.calloutRating}>★ {spot.rating?.toFixed(1)}</Text>
                  {spot.noiseLevel && (
                    <Text style={styles.calloutTag}>{spot.noiseLevel}</Text>
                  )}
                </View>
                <Text style={styles.calloutTap}>Tap to view details</Text>
              </View>
            </NativeCallout>
          </NativeMarker>
        ))}
      </NativeMapView>

      {userLocation && (
        <Pressable style={styles.recenterButton} onPress={centerOnUser}>
          <Text style={styles.recenterIcon}>⊙</Text>
        </Pressable>
      )}

      {mappableSpots.length === 0 && (
        <View style={styles.noSpotsBanner}>
          <Text style={styles.noSpotsText}>No spots with coordinates yet</Text>
        </View>
      )}
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  loadingText: {
    fontSize: 14,
    color: '#666',
  },
  devBuildIcon: {
    fontSize: 48,
  },
  devBuildTitle: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  devBuildSub: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
    lineHeight: 20,
  },
  errorText: {
    fontSize: 12,
    color: '#cc0000',
    padding: 8,
  },
  mapWrapper: {
    flex: 1,
  },
  recenterButton: {
    position: 'absolute',
    bottom: 24,
    right: 16,
    width: 44,
    height: 44,
    borderRadius: 22,
    backgroundColor: '#fff',
    alignItems: 'center',
    justifyContent: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.2,
    shadowRadius: 4,
    elevation: 4,
  },
  recenterIcon: {
    fontSize: 22,
    color: '#2774AE',
  },
  callout: {
    width: 200,
    padding: 8,
  },
  calloutName: {
    fontSize: 14,
    fontWeight: '700',
    marginBottom: 2,
  },
  calloutAddress: {
    fontSize: 11,
    color: '#666',
    marginBottom: 6,
  },
  calloutRow: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
    marginBottom: 4,
  },
  calloutRating: {
    fontSize: 12,
    color: '#f59e0b',
    fontWeight: '600',
  },
  calloutTag: {
    fontSize: 11,
    color: '#fff',
    backgroundColor: '#2774AE',
    borderRadius: 4,
    paddingHorizontal: 6,
    paddingVertical: 1,
  },
  calloutTap: {
    fontSize: 10,
    color: '#2774AE',
    marginTop: 2,
  },
  noSpotsBanner: {
    position: 'absolute',
    bottom: 24,
    left: 16,
    right: 68,
    backgroundColor: 'rgba(255,255,255,0.9)',
    borderRadius: 8,
    paddingHorizontal: 12,
    paddingVertical: 8,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.15,
    shadowRadius: 3,
    elevation: 3,
  },
  noSpotsText: {
    fontSize: 13,
    color: '#666',
    textAlign: 'center',
  },
});
