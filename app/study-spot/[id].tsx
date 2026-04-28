import { useState } from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { useStudySpots } from '@/hooks/useStudySpots'

export default function StudySpotDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { spots, loading } = useStudySpots()
  const spot = spots.find(s => s.id === id) ?? null
  const [imgError, setImgError] = useState(false)

  if (loading) {
    return (
      <View style={styles.centered}>
        <ActivityIndicator size="large" color="#000" />
      </View>
    )
  }

  if (!spot) {
    return (
      <View style={styles.centered}>
        <Text>Spot not found.</Text>
      </View>
    )
  }

  const showPlaceholder = !spot.imageURL || imgError

  return (
    <ScrollView contentContainerStyle={styles.container}>
      <Stack.Screen options={{ title: spot.name }} />
      {showPlaceholder ? (
        <View style={[styles.image, styles.placeholder]}>
          <Text style={styles.placeholderText}>📍</Text>
        </View>
      ) : (
        <Image
          source={{ uri: spot.imageURL }}
          style={styles.image}
          onError={() => setImgError(true)}
        />
      )}

      <Text style={styles.name}>{spot.name}</Text>
      <Text style={styles.address}>{spot.address}</Text>

      <View style={styles.divider} />

      <Row label="Rating" value={`${spot.rating} / 5`} />
      {spot.distance !== undefined && <Row label="Distance" value={spot.distance} />}
      {spot.noiseLevel !== undefined && <Row label="Noise Level" value={spot.noiseLevel} />}
      {spot.hasWifi !== undefined && <Row label="WiFi" value={spot.hasWifi ? 'Yes' : 'No'} />}
      {spot.hasOutlets !== undefined && <Row label="Outlets" value={spot.hasOutlets ? 'Yes' : 'No'} />}
    </ScrollView>
  )
}

function Row({ label, value }: { label: string; value: string }) {
  return (
    <View style={styles.row}>
      <Text style={styles.label}>{label}</Text>
      <Text style={styles.value}>{value}</Text>
    </View>
  )
}

const styles = StyleSheet.create({
  centered:     { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container:    { padding: 16 },
  image:        { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  placeholder:  { backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 48 },
  name:         { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  address:      { fontSize: 15, color: '#666', marginBottom: 16 },
  divider:      { height: 1, backgroundColor: '#eee', marginBottom: 16 },
  row:          { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label:        { fontSize: 15, color: '#555' },
  value:        { fontSize: 15, fontWeight: '500' },
})
