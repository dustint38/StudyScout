import { Image } from 'expo-image';
import { Platform, StyleSheet, FlatList, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import StudySpotCard, { StudySpot }  from '@/components/StudySpotCard';


const studySpots: StudySpot[] = [
  { id: '1', name: 'Powell Library', rating: 4.5, distance: '0.3 mi', image: 'https://upload.wikimedia.org/wikipedia/commons/thumb/e/ef/Powell_Library%2C_UCLA.jpg/1200px-Powell_Library%2C_UCLA.jpg' },
]

export default function HomeScreen() {
  return (
    <View style={{ flex: 1, padding: 16 }}>
      <FlatList
        data={studySpots}
        keyExtractor={item => item.id}
        renderItem={({ item }) => <StudySpotCard spot={item} />}
      />
    </View>
  )
}

const styles = StyleSheet.create({
  titleContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 8,
  },
  stepContainer: {
    gap: 8,
    marginBottom: 8,
  },
  reactLogo: {
    height: 178,
    width: 290,
    bottom: 0,
    left: 0,
    position: 'absolute',
  },
});
