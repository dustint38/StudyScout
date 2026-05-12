import { StyleSheet, View } from 'react-native';
import SpotMap from '@/components/SpotMap';

export default function MapScreen() {
  return (
    <View style={styles.container}>
      <SpotMap />
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1 },
});
