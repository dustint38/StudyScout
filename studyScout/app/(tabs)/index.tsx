import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
} from 'react-native';
import { useStudySpots } from '@/hooks/useStudySpots';
import { useSpotSearch } from '@/hooks/useSpotSearch';
import SpotSection from '@/components/SpotSection';

export default function HomeScreen() {
  const { spots, loading } = useStudySpots();
  const { search, setSearch, filtered } = useSpotSearch(spots);

  const recommended = filtered.slice(0, 3);
  const trending = filtered.slice(3);

  if (loading) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#000" />
        <Text>Loading study spots...</Text>
      </View>
    );
  }

  return (
    <SafeAreaView style={styles.container}>
      <Text style={styles.header}>StudyScout</Text>
      <TextInput
        style={styles.searchBar}
        placeholder="🔍  Search"
        value={search}
        onChangeText={setSearch}
      />
      <ScrollView>
        <SpotSection title="Recommended Near You" spots={recommended} />
        <SpotSection title="Trending Now" spots={trending} />
      </ScrollView>
    </SafeAreaView>
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
