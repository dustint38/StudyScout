import { StyleSheet, Text, View } from 'react-native';

export default function SpotMap() {
  return (
    <View style={styles.centered}>
      <Text style={styles.icon}>🗺️</Text>
      <Text style={styles.message}>Map view is available on the mobile app</Text>
      <Text style={styles.sub}>Open StudyScout on your phone to see spots near you</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  centered: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
    paddingHorizontal: 32,
  },
  icon: {
    fontSize: 48,
  },
  message: {
    fontSize: 17,
    fontWeight: '600',
    textAlign: 'center',
  },
  sub: {
    fontSize: 14,
    color: '#666',
    textAlign: 'center',
  },
});
