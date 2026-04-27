import { View, Text, StyleSheet } from 'react-native';
import StudySpotCard from './StudySpotCard';
import { StudySpot } from '@/types';

type Props = {
  title: string;
  spots: StudySpot[];
};

export default function SpotSection({ title, spots }: Props) {
  return (
    <View>
      <Text style={styles.title}>{title}</Text>
      {spots.map(spot => (
        <StudySpotCard key={spot.id} spot={spot} />
      ))}
    </View>
  );
}

const styles = StyleSheet.create({
  title: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
});
