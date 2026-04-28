import { useState } from 'react';
import {
  View,
  Text,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
  ScrollView,
  Pressable,
} from 'react-native';
import { useStudySpots } from '@/hooks/useStudySpots';
import { useSpotSearch } from '@/hooks/useSpotSearch';
import SpotSection from '@/components/SpotSection';
import FilterModal from '@/components/FilterModal';
import { router } from 'expo-router'

export default function HomeScreen() {
  const { spots, loading } = useStudySpots();
  const { search, setSearch, filters, setFilters, filtered, activeFilterCount } = useSpotSearch(spots);
  const [showFilters, setShowFilters] = useState(false);

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
      <View style={styles.searchRow}>
        <TextInput
          style={styles.searchBar}
          placeholder="🔍  Search"
          value={search}
          onChangeText={setSearch}
        />
        <Pressable style={styles.filterButton} onPress={() => setShowFilters(true)}>
          <Text style={styles.filterIcon}>⚙️</Text>
          {activeFilterCount > 0 && (
            <View style={styles.badge}>
              <Text style={styles.badgeText}>{activeFilterCount}</Text>
            </View>
          )}
        </Pressable>
      </View>
      <ScrollView>
        <SpotSection title="Recommended Near You" spots={recommended} />
        <SpotSection title="Trending Now" spots={trending} />
      </ScrollView>
      <FilterModal
        visible={showFilters}
        filters={filters}
        onChange={setFilters}
        onClose={() => setShowFilters(false)}
      />
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
    marginLeft: 10,
  },
  searchRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
    marginHorizontal: 10,
    gap: 8,
  },
  searchBar: {
    flex: 1,
    backgroundColor: '#f0f0f0',
    borderRadius: 10,
    paddingHorizontal: 14,
    paddingVertical: 8,
    fontSize: 16,
  },
  filterButton: {
    width: 40,
    height: 40,
    borderRadius: 10,
    backgroundColor: '#f0f0f0',
    alignItems: 'center',
    justifyContent: 'center',
  },
  filterIcon: {
    fontSize: 18,
  },
  badge: {
    position: 'absolute',
    top: -4,
    right: -4,
    backgroundColor: '#007AFF',
    borderRadius: 8,
    minWidth: 16,
    height: 16,
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 3,
  },
  badgeText: {
    color: '#fff',
    fontSize: 10,
    fontWeight: '700',
  },
});
