import { Image } from 'expo-image';
import { Platform, StyleSheet, FlatList, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';
import { useStudySpots } from '@/hooks/useStudySpots';

import StudySpotCard, { StudySpot }  from '@/components/StudySpotCard';


const { spots: studySpots } = useStudySpots();

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
