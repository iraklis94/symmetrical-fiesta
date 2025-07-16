import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';

const CATEGORIES = [
  { id: 'wine', name: 'Wine', nameGr: 'Κρασί', icon: '🍷', color: '#722f37' },
  { id: 'cheese', name: 'Cheese', nameGr: 'Τυρί', icon: '🧀', color: '#f39c12' },
  { id: 'olive_oil', name: 'Olive Oil', nameGr: 'Ελαιόλαδο', icon: '🫒', color: '#27ae60' },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Refresh data here
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleSearch = () => {
    // Navigate to search
    console.log('Search pressed');
  };

  const renderCategory = ({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color + '20' }]}
      onPress={() => console.log(`Category ${item.name} pressed`)}
    >
      <Text style={styles.categoryIcon}>{item.icon}</Text>
      <Text style={styles.categoryName}>{item.nameGr}</Text>
      <Text style={styles.categoryNameEn}>{item.name}</Text>
    </TouchableOpacity>
  );

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
      >
        {/* Header */}
        <View style={styles.header}>
          <View>
            <Text style={styles.greeting}>Καλημέρα! 👋</Text>
            <Text style={styles.subGreeting}>Welcome to GreekMarket</Text>
          </View>
          <TouchableOpacity>
            <View style={styles.notificationIcon}>
              <Ionicons name="notifications-outline" size={24} color="#2c3e50" />
              <View style={styles.notificationBadge} />
            </View>
          </TouchableOpacity>
        </View>

        {/* Search Bar */}
        <TouchableOpacity onPress={handleSearch} activeOpacity={0.7}>
          <View style={styles.searchBar}>
            <Ionicons name="search-outline" size={20} color="#7f8c8d" />
            <Text style={styles.searchPlaceholder}>Search for wine, cheese, olive oil...</Text>
          </View>
        </TouchableOpacity>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={(item) => item.id}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
          />
        </View>

        {/* Featured Products Placeholder */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>Featured products will appear here</Text>
          </View>
        </View>

        {/* Popular Products Placeholder */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Wines</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <View style={styles.placeholderBox}>
            <Text style={styles.placeholderText}>Popular wines will appear here</Text>
          </View>
        </View>
      </ScrollView>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  greeting: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
  },
  subGreeting: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  notificationIcon: {
    position: 'relative',
  },
  notificationBadge: {
    position: 'absolute',
    top: -2,
    right: -2,
    width: 8,
    height: 8,
    backgroundColor: '#e74c3c',
    borderRadius: 4,
  },
  searchBar: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    marginHorizontal: 20,
    marginVertical: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    borderRadius: 10,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchPlaceholder: {
    marginLeft: 10,
    fontSize: 16,
    color: '#7f8c8d',
  },
  section: {
    marginTop: 25,
    marginBottom: 10,
  },
  sectionHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  sectionTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    paddingHorizontal: 20,
    marginBottom: 15,
  },
  seeAllText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#e74c3c',
  },
  categoriesList: {
    paddingHorizontal: 20,
  },
  categoryCard: {
    width: 100,
    height: 100,
    borderRadius: 15,
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
    padding: 10,
  },
  categoryIcon: {
    fontSize: 36,
    marginBottom: 8,
  },
  categoryName: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    textAlign: 'center',
  },
  categoryNameEn: {
    fontSize: 11,
    color: '#7f8c8d',
    textAlign: 'center',
    marginTop: 2,
  },
  placeholderBox: {
    height: 150,
    marginHorizontal: 20,
    backgroundColor: '#ffffff',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    borderWidth: 1,
    borderColor: '#ecf0f1',
    borderStyle: 'dashed',
  },
  placeholderText: {
    color: '#7f8c8d',
    fontSize: 14,
  },
}); 