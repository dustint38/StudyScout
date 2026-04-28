import { Image } from 'expo-image';
import { Platform, StyleSheet, FlatList, View, Text, TouchableOpacity} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';

import { useAuth } from '@/hooks/useAuth';
import { signIn } from '@/services/auth';
import { useRouter } from 'expo-router';

export default function ProfileScreen() {
  const { user } = useAuth();
  const router = useRouter();

  if (!user) {
    return (
      <View style={styles.container}>
        <Text style={styles.header}>You're not logged in</Text>
        

        <TouchableOpacity style={styles.button} onPress={() => router.push('/(auth)/login')} >
                <Text style={styles.buttonText}>Log In</Text>
        </TouchableOpacity>
      </View>
    );
  }

  return (
    <View style={styles.container}>
      <Text>Welcome, {user.email}</Text>
      {/* rest of profile */}
    </View>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#fff',
    paddingHorizontal: 16,
  },
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    gap: 12,
  },
  button: { backgroundColor: "#007AFF", padding: 14, borderRadius: 8, alignItems: "center" },
  buttonText: { color: "#fff", fontWeight: "bold" },
  link: { marginTop: 16, textAlign: "center", color: "#007AFF" },
  header: {
    fontSize: 28,
    fontWeight: 'bold',
    marginTop: 16,
    marginBottom: 12,
  },
  searchBar: {
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
    marginBottom: 20,
  },
});
