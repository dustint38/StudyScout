import { View, Text, Image, StyleSheet, ImageSourcePropType} from 'react-native'

type StudySpot = {
  id: string
  name: string
  rating: number
  distance: string
  image: string
}

type Props = {
  spot: StudySpot
}

export default function StudySpotCard({ spot }: Props) {
  return (
    <View style={styles.card}>
      <Image source={{ uri: spot.image }} style={styles.image} />
      <View style={styles.info}>
        <Text style={styles.name}>{spot.name}</Text>
        <Text style={styles.detail}>{spot.rating} · {spot.distance}</Text>
      </View>
    </View>
  )
}

const styles = StyleSheet.create({
  card:   { flexDirection: 'row', padding: 12, gap: 12 },
  image:  { width: 72, height: 72, borderRadius: 8 },
  info:   { flex: 1, justifyContent: 'center' },
  name:   { fontSize: 15, fontWeight: '500' },
  detail: { fontSize: 13, color: '#888', marginTop: 4 },
})

export type { StudySpot }
