import { useState } from 'react'
import {
  View, Text, TextInput, Pressable, StyleSheet,
  ScrollView, ActivityIndicator, Alert,
} from 'react-native'
import { router, Stack } from 'expo-router'
import { addStudySpot } from '@/services/db'

const NOISE_LEVELS = ['Quiet', 'Moderate', 'Loud'] as const
type NoiseLevel = typeof NOISE_LEVELS[number]

export default function AddStudySpot() {
  const [name, setName] = useState('')
  const [address, setAddress] = useState('')
  const [rating, setRating] = useState('')
  const [distance, setDistance] = useState('')
  const [imageURL, setImageURL] = useState('')
  const [noiseLevel, setNoiseLevel] = useState<NoiseLevel | null>(null)
  const [hasWifi, setHasWifi] = useState<boolean | null>(null)
  const [hasOutlets, setHasOutlets] = useState<boolean | null>(null)
  const [loading, setLoading] = useState(false)

  const handleSubmit = async () => {
    if (!name.trim() || !address.trim() || !rating.trim()) {
      Alert.alert('Missing fields', 'Name, address, and rating are required.')
      return
    }
    const parsedRating = parseFloat(rating)
    if (isNaN(parsedRating) || parsedRating < 0 || parsedRating > 5) {
      Alert.alert('Invalid rating', 'Rating must be a number between 0 and 5.')
      return
    }
    setLoading(true)
    try {
      await addStudySpot({
        name: name.trim(),
        address: address.trim(),
        rating: parsedRating,
        ...(distance.trim() && { distance: distance.trim() }),
        ...(imageURL.trim() && { imageURL: imageURL.trim() }),
        ...(noiseLevel && { noiseLevel }),
        ...(hasWifi !== null && { hasWifi }),
        ...(hasOutlets !== null && { hasOutlets }),
      })
      router.back()
    } catch (e: any) {
      Alert.alert('Error', e.message)
    } finally {
      setLoading(false)
    }
  }

  return (
    <>
      <Stack.Screen options={{ title: 'Add Study Spot' }} />
      <ScrollView contentContainerStyle={styles.container}>
        <Text style={styles.label}>Name *</Text>
        <TextInput style={styles.input} value={name} onChangeText={setName} placeholder="e.g. Powell Library" />

        <Text style={styles.label}>Address *</Text>
        <TextInput style={styles.input} value={address} onChangeText={setAddress} placeholder="e.g. 405 Hilgard Ave" />

        <Text style={styles.label}>Rating (0–5) *</Text>
        <TextInput style={styles.input} value={rating} onChangeText={setRating} placeholder="e.g. 4.5" keyboardType="decimal-pad" />

        <Text style={styles.label}>Distance</Text>
        <TextInput style={styles.input} value={distance} onChangeText={setDistance} placeholder="e.g. 0.3 mi" />

        <Text style={styles.label}>Image URL</Text>
        <TextInput style={styles.input} value={imageURL} onChangeText={setImageURL} placeholder="https://..." autoCapitalize="none" />

        <Text style={styles.label}>Noise Level</Text>
        <View style={styles.chipRow}>
          {NOISE_LEVELS.map(level => (
            <Pressable
              key={level}
              style={[styles.chip, noiseLevel === level && styles.chipActive]}
              onPress={() => setNoiseLevel(noiseLevel === level ? null : level)}
            >
              <Text style={[styles.chipText, noiseLevel === level && styles.chipTextActive]}>{level}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>WiFi</Text>
        <View style={styles.chipRow}>
          {([true, false] as const).map(val => (
            <Pressable
              key={String(val)}
              style={[styles.chip, hasWifi === val && styles.chipActive]}
              onPress={() => setHasWifi(hasWifi === val ? null : val)}
            >
              <Text style={[styles.chipText, hasWifi === val && styles.chipTextActive]}>{val ? 'Yes' : 'No'}</Text>
            </Pressable>
          ))}
        </View>

        <Text style={styles.label}>Outlets</Text>
        <View style={styles.chipRow}>
          {([true, false] as const).map(val => (
            <Pressable
              key={String(val)}
              style={[styles.chip, hasOutlets === val && styles.chipActive]}
              onPress={() => setHasOutlets(hasOutlets === val ? null : val)}
            >
              <Text style={[styles.chipText, hasOutlets === val && styles.chipTextActive]}>{val ? 'Yes' : 'No'}</Text>
            </Pressable>
          ))}
        </View>

        <Pressable style={styles.submitButton} onPress={handleSubmit} disabled={loading}>
          {loading
            ? <ActivityIndicator color="#fff" />
            : <Text style={styles.submitText}>Add Spot</Text>}
        </Pressable>
      </ScrollView>
    </>
  )
}

const styles = StyleSheet.create({
  container:       { padding: 20, paddingBottom: 40 },
  label:           { fontSize: 13, fontWeight: '600', color: '#555', marginBottom: 6, marginTop: 16 },
  input:           { borderWidth: 1, borderColor: '#ddd', borderRadius: 8, padding: 12, fontSize: 15 },
  chipRow:         { flexDirection: 'row', gap: 8 },
  chip:            { borderWidth: 1, borderColor: '#ccc', borderRadius: 20, paddingHorizontal: 16, paddingVertical: 7 },
  chipActive:      { backgroundColor: '#2774AE', borderColor: '#2774AE' },
  chipText:        { fontSize: 14, color: '#333' },
  chipTextActive:  { color: '#fff' },
  submitButton:    { marginTop: 32, backgroundColor: '#2774AE', borderRadius: 10, padding: 14, alignItems: 'center' },
  submitText:      { color: '#fff', fontWeight: '700', fontSize: 15 },
})
