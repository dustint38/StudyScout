import { View, Text, StyleSheet } from 'react-native';
import StudySpotCard from './StudySpotCard';
import { StudySpot } from '@/types';
import { router } from 'expo-router';

type Props = {
  title: string;
  spots: StudySpot[];
};

export default function SpotSection({ title, spots }: Props) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {spots.map(spot => (
        <StudySpotCard key={spot.id} spot={spot} onPress={() => router.push(`/study-spot/${spot.id}`)} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 20,
    fontWeight: '800',
    marginBottom: 10,
    color: '#333',
    marginLeft: 10,
  },
});
