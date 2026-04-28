import { useState } from 'react'
import { View, Text, Image, StyleSheet, Pressable } from 'react-native'
import { router } from 'expo-router'
import { StudySpot } from '../types';


type Props = {
  spot: StudySpot
  onPress?: () => void
}



export default function StudySpotCard({ spot, onPress }: Props) {
  const [imgError, setImgError] = useState(false);
  const showPlaceholder = !spot.imageURL || imgError;

  return (
    <Pressable onPress={onPress ?? (() => router.push(`/study-spot/${spot.id}`))}>
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
      <View style={styles.info}>
        <Text style={styles.name}>{spot.name}</Text>
        <Text style={styles.detail}>{spot.rating} · {spot.distance}</Text>
      </View>
    </Pressable>
  )
}

const styles = StyleSheet.create({
  card:            { flexDirection: 'row', padding: 12, gap: 12 },
  image:           { width: 72, height: 72, borderRadius: 8 },
  placeholder:     { backgroundColor: '#e0e0e0', alignItems: 'center', justifyContent: 'center' },
  placeholderText: { fontSize: 24 },
  info:            { flex: 1, justifyContent: 'center' },
  name:            { fontSize: 15, fontWeight: '500' },
  detail:          { fontSize: 13, color: '#888', marginTop: 4 },
})

