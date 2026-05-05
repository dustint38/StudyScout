import { StyleSheet, View } from 'react-native';
import StudySpotMap from '@/components/StudySpotMap';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <StudySpotMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
