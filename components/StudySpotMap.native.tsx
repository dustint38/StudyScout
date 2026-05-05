import { useStudySpots } from '@/hooks/useStudySpots';
import { useRouter } from 'expo-router';
import { StyleSheet, View, ActivityIndicator } from 'react-native';
import MapView, { Marker } from 'react-native-maps';

export default function StudySpotMap() {
  const { spots, loading } = useStudySpots();
  const router = useRouter();

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" />
      </View>
    );
  }

  return (
    <MapView
      style={styles.map}
      provider="google"
      initialRegion={{
        latitude: 34.0689,
        longitude: -118.4452,
        latitudeDelta: 0.03,
        longitudeDelta: 0.03,
      }}
    >
      {spots
        .filter(s => s.latitude != null && s.longitude != null)
        .map(spot => (
          <Marker
            key={spot.id}
            coordinate={{ latitude: spot.latitude!, longitude: spot.longitude! }}
            title={spot.name}
            description={spot.address}
            onCalloutPress={() => router.push(`/study-spot/${spot.id}`)}
          />
        ))}
    </MapView>
  );
}

const styles = StyleSheet.create({
  map: { flex: 1 },
  centered: { flex: 1, justifyContent: 'center', alignItems: 'center' },
});
