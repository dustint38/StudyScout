/*import { Image } from 'expo-image';
import { Platform, StyleSheet, FlatList, View} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { HelloWave } from '@/components/hello-wave';
import ParallaxScrollView from '@/components/parallax-scroll-view';
import { ThemedText } from '@/components/themed-text';
import { ThemedView } from '@/components/themed-view';
import { Link } from 'expo-router';


import StudySpotCard, { StudySpot }  from '@/components/StudySpotCard';


const studySpots: StudySpot[] = [
]

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
*/

import { useEffect, useState } from 'react';
import {
  View,
  Text,
  FlatList,
  Image,
  TextInput,
  StyleSheet,
  SafeAreaView,
  ActivityIndicator,
} from 'react-native';
import { collection, getDocs } from 'firebase/firestore';
import { db } from '@/config/firebase';

type StudySpot = {
  id: string;
  name: string;
  rating: number;
  distance: number;
  imageURL: string;
};

export default function HomeScreen() {
  const [spots, setSpots] = useState<StudySpot[]>([]);
  const [loading, setLoading] = useState(true);
  const [search, setSearch] = useState('');

  useEffect(() => {
    async function fetchSpots() {
      try {
        const snapshot = await getDocs(collection(db, 'studySpots'));
        const data = snapshot.docs.map(doc => ({
          id: doc.id,
          ...doc.data(),
        })) as StudySpot[];
        setSpots(data);
      } catch (error) {
        console.error('Error fetching spots:', error);
      } finally {
        setLoading(false);
      }
    }
    fetchSpots();
  }, []);

  const filtered = spots.filter(spot =>
    spot.name.toLowerCase().includes(search.toLowerCase())
  );

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
      {/* Header */}
      <Text style={styles.header}>StudyScout</Text>

      {/* Search Bar */}
      <TextInput
        style={styles.searchBar}
        placeholder="🔍  Search"
        value={search}
        onChangeText={setSearch}
      />

      {/* Spot Lists */}
      <FlatList
        data={[]}
        keyExtractor={() => 'main'}
        renderItem={null}
        ListHeaderComponent={
          <>
            <Text style={styles.sectionTitle}>Recommended Near You</Text>
            {recommended.map(spot => (
              <SpotCard key={spot.id} spot={spot} />
            ))}

            <Text style={styles.sectionTitle}>Trending Now</Text>
            {trending.map(spot => (
              <SpotCard key={spot.id} spot={spot} />
            ))}
          </>
        }
      />
    </SafeAreaView>
  );
}

function SpotCard({ spot }: { spot: StudySpot }) {
  return (
    <View style={styles.card}>
      <Image
        source={{ uri: spot.imageURL }}
        style={styles.cardImage}
      />
      <View style={styles.cardInfo}>
        <Text style={styles.cardName}>{spot.name}</Text>
        <Text style={styles.cardDetail}>⭐ {spot.rating}</Text>
        <Text style={styles.cardDetail}>📍 {spot.distance}</Text>
      </View>
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
  sectionTitle: {
    fontSize: 14,
    fontWeight: '600',
    marginBottom: 10,
    color: '#333',
  },
  card: {
    flexDirection: 'row',
    backgroundColor: '#f9f9f9',
    borderRadius: 12,
    marginBottom: 12,
    overflow: 'hidden',
    shadowColor: '#000',
    shadowOpacity: 0.05,
    shadowRadius: 4,
  },
  cardImage: {
    width: 80,
    height: 80,
    borderColor: 'red',
  },
  cardInfo: {
    flex: 1,
    padding: 10,
    gap: 4,
    justifyContent: 'center',
  },
  cardName: {
    fontSize: 14,
    fontWeight: '600',
  },
  cardDetail: {
    fontSize: 12,
    color: '#555',
  },
});