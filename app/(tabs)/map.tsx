import React from 'react';
import {
  View,
  Text,
  StyleSheet,
  TouchableOpacity,
  ScrollView,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';

const MOCK_STORES = [
  {
    id: '1',
    name: 'AB Vassilopoulos',
    type: 'supermarket',
    distance: 0.8,
    address: 'Syntagma Square, Athens',
    rating: 4.5,
  },
  {
    id: '2',
    name: 'Sklavenitis',
    type: 'supermarket',
    distance: 1.2,
    address: 'Kolonaki, Athens',
    rating: 4.3,
  },
  {
    id: '3',
    name: 'The Wine Shop',
    type: 'specialty',
    distance: 2.1,
    address: 'Plaka, Athens',
    rating: 4.8,
  },
];

export default function MapScreen() {
  const renderStore = (store: typeof MOCK_STORES[0]) => (
    <TouchableOpacity key={store.id} style={styles.storeCard}>
      <View style={styles.storeIcon}>
        <Ionicons
          name={store.type === 'supermarket' ? 'cart' : 'business'}
          size={24}
          color="#e74c3c"
        />
      </View>
      <View style={styles.storeInfo}>
        <Text style={styles.storeName}>{store.name}</Text>
        <Text style={styles.storeAddress}>{store.address}</Text>
        <View style={styles.storeStats}>
          <View style={styles.statItem}>
            <Ionicons name="location-outline" size={14} color="#7f8c8d" />
            <Text style={styles.statText}>{store.distance} km</Text>
          </View>
          <View style={styles.statItem}>
            <Ionicons name="star" size={14} color="#f39c12" />
            <Text style={styles.statText}>{store.rating}</Text>
          </View>
        </View>
      </View>
      <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.mapPlaceholder}>
        <Ionicons name="map-outline" size={80} color="#7f8c8d" />
        <Text style={styles.mapPlaceholderText}>Map view coming soon</Text>
        <Text style={styles.mapPlaceholderSubtext}>
          Enable location to see nearby stores
        </Text>
      </View>
      
      <View style={styles.storeListContainer}>
        <Text style={styles.sectionTitle}>Nearby Stores</Text>
        <ScrollView showsVerticalScrollIndicator={false}>
          {MOCK_STORES.map(renderStore)}
        </ScrollView>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  mapPlaceholder: {
    height: 300,
    backgroundColor: '#ecf0f1',
    justifyContent: 'center',
    alignItems: 'center',
  },
  mapPlaceholderText: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 15,
  },
  mapPlaceholderSubtext: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 5,
  },
  storeListContainer: {
    flex: 1,
    padding: 20,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  storeCard: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  storeIcon: {
    width: 50,
    height: 50,
    borderRadius: 25,
    backgroundColor: '#e74c3c20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  storeAddress: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
  },
  storeStats: {
    flexDirection: 'row',
    gap: 15,
  },
  statItem: {
    flexDirection: 'row',
    alignItems: 'center',
    gap: 4,
  },
  statText: {
    fontSize: 12,
    color: '#7f8c8d',
  },
}); 