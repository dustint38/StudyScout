import { useEffect, useState } from 'react'
import { View, Text, Image, StyleSheet, ActivityIndicator, ScrollView, TouchableOpacity, Alert } from 'react-native'
import { useLocalSearchParams, Stack } from 'expo-router'
import { Ionicons } from '@expo/vector-icons'
import { useStudySpots } from '@/hooks/useStudySpots'
import { useAuth } from '@/hooks/useAuth'
import { getUserRating, submitRating } from '@/services/db'

export default function StudySpotDetail() {
  const { id } = useLocalSearchParams<{ id: string }>()
  const { spots, loading } = useStudySpots()
  const { user } = useAuth()
  const spot = spots.find(s => s.id === id) ?? null
  const [imgError, setImgError] = useState(false)

  const [selectedStars, setSelectedStars] = useState<number>(0)
  const [submitting, setSubmitting] = useState(false)
  const [existingRating, setExistingRating] = useState<number | null>(null)
  const [ratingLoading, setRatingLoading] = useState(false)

  useEffect(() => {
    if (!user || !id) return
    setRatingLoading(true)
    getUserRating(id, user.uid)
      .then(r => {
        setExistingRating(r)
        if (r !== null) setSelectedStars(r)
      })
      .finally(() => setRatingLoading(false))
  }, [user, id])

  const handleSubmit = async () => {
    if (!user) return
    if (selectedStars === 0) {
      Alert.alert('Select a rating', 'Tap a star to choose your rating.')
      return
    }
    setSubmitting(true)
    try {
      await submitRating(id, user.uid, selectedStars)
      setExistingRating(selectedStars)
      Alert.alert('Thanks!', `You rated this spot ${selectedStars} star${selectedStars === 1 ? '' : 's'}.`)
    } catch {
      Alert.alert('Error', 'Could not save your rating. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

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
  const ratingLabel = spot.ratingCount != null && spot.ratingCount > 0
    ? `${spot.rating.toFixed(1)} / 5  (${spot.ratingCount} ${spot.ratingCount === 1 ? 'rating' : 'ratings'})`
    : `${spot.rating} / 5`

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

      <Row label="Rating" value={ratingLabel} />
      {spot.distance !== undefined && <Row label="Distance" value={spot.distance} />}
      {spot.noiseLevel !== undefined && <Row label="Noise Level" value={spot.noiseLevel} />}
      {spot.hasWifi !== undefined && <Row label="WiFi" value={spot.hasWifi ? 'Yes' : 'No'} />}
      {spot.hasOutlets !== undefined && <Row label="Outlets" value={spot.hasOutlets ? 'Yes' : 'No'} />}

      <View style={styles.divider} />

      <View style={styles.ratingSection}>
        <Text style={styles.ratingSectionTitle}>
          {existingRating !== null ? 'Update Your Rating' : 'Rate This Spot'}
        </Text>

        {!user ? (
          <Text style={styles.loginPrompt}>Log in to leave a rating.</Text>
        ) : ratingLoading ? (
          <ActivityIndicator size="small" color="#2774AE" style={{ marginTop: 8 }} />
        ) : (
          <>
            {existingRating !== null && (
              <Text style={styles.existingLabel}>Your current rating: {existingRating} ★</Text>
            )}
            <StarPicker value={selectedStars} onChange={setSelectedStars} />
            <TouchableOpacity
              style={[styles.submitButton, submitting && styles.submitButtonDisabled]}
              onPress={handleSubmit}
              disabled={submitting}
            >
              {submitting ? (
                <ActivityIndicator size="small" color="#fff" />
              ) : (
                <Text style={styles.submitButtonText}>
                  {existingRating !== null ? 'Update Rating' : 'Submit Rating'}
                </Text>
              )}
            </TouchableOpacity>
          </>
        )}
      </View>
    </ScrollView>
  )
}

function StarPicker({ value, onChange }: { value: number; onChange: (n: number) => void }) {
  return (
    <View style={styles.stars}>
      {[1, 2, 3, 4, 5].map(n => (
        <TouchableOpacity key={n} onPress={() => onChange(n)} hitSlop={8}>
          <Ionicons
            name={n <= value ? 'star' : 'star-outline'}
            size={36}
            color={n <= value ? '#f59e0b' : '#ccc'}
          />
        </TouchableOpacity>
      ))}
    </View>
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
  centered:            { flex: 1, justifyContent: 'center', alignItems: 'center' },
  container:           { padding: 16 },
  image:               { width: '100%', height: 220, borderRadius: 12, marginBottom: 16 },
  placeholder:         { backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  placeholderText:     { fontSize: 48 },
  name:                { fontSize: 24, fontWeight: '700', marginBottom: 4 },
  address:             { fontSize: 15, color: '#666', marginBottom: 16 },
  divider:             { height: 1, backgroundColor: '#eee', marginVertical: 16 },
  row:                 { flexDirection: 'row', justifyContent: 'space-between', paddingVertical: 10, borderBottomWidth: 1, borderBottomColor: '#f0f0f0' },
  label:               { fontSize: 15, color: '#555' },
  value:               { fontSize: 15, fontWeight: '500' },
  ratingSection:       { gap: 12 },
  ratingSectionTitle:  { fontSize: 17, fontWeight: '700' },
  existingLabel:       { fontSize: 14, color: '#555' },
  loginPrompt:         { fontSize: 14, color: '#888', marginTop: 4 },
  stars:               { flexDirection: 'row', gap: 8 },
  submitButton:        { backgroundColor: '#2774AE', borderRadius: 10, paddingVertical: 12, alignItems: 'center', marginTop: 4 },
  submitButtonDisabled:{ opacity: 0.6 },
  submitButtonText:    { color: '#fff', fontSize: 15, fontWeight: '600' },
})
