import { View, Text, StyleSheet } from 'react-native';

export default function StudySpotMap() {
  return (
    <View style={styles.container}>
      <Text style={styles.text}>Map is only available on iOS and Android.</Text>
    </View>
  );
}

const styles = StyleSheet.create({
  container: { flex: 1, justifyContent: 'center', alignItems: 'center' },
  text: { fontSize: 16, color: '#666' },
});
