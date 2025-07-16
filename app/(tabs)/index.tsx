import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  TextInput,
  Image,
  FlatList,
  RefreshControl,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { Link, router } from 'expo-router';
import { useQuery } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { LinearGradient } from 'expo-linear-gradient';
import { ProductCard } from '../../src/components/ProductCard';
import { CategoryCard } from '../../src/components/CategoryCard';
import { useLocation } from '../../src/hooks/useLocation';

const CATEGORIES = [
  { id: 'wine', name: 'Wine', nameGr: 'Κρασί', icon: '🍷', color: '#722f37' },
  { id: 'cheese', name: 'Cheese', nameGr: 'Τυρί', icon: '🧀', color: '#f39c12' },
  { id: 'olive_oil', name: 'Olive Oil', nameGr: 'Ελαιόλαδο', icon: '🫒', color: '#27ae60' },
];

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { location, errorMsg } = useLocation();
  
  const featuredProducts = useQuery(api.products.getFeaturedProducts, { limit: 10 });
  const popularProducts = useQuery(api.products.getProductsByCategory, { 
    category: 'wine', 
    limit: 10 
  });

  const handleRefresh = React.useCallback(() => {
    setRefreshing(true);
    // Refresh data here
    setTimeout(() => setRefreshing(false), 2000);
  }, []);

  const handleSearch = () => {
    router.push('/search');
  };

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
            <Text style={styles.subGreeting}>
              {location ? `📍 ${location.city || 'Your location'}` : 'Getting location...'}
            </Text>
          </View>
          <TouchableOpacity onPress={() => router.push('/notifications')}>
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

        {/* Hero Banner */}
        <LinearGradient
          colors={['#e74c3c', '#c0392b']}
          start={{ x: 0, y: 0 }}
          end={{ x: 1, y: 0 }}
          style={styles.heroBanner}
        >
          <View style={styles.bannerContent}>
            <Text style={styles.bannerTitle}>Premium Greek Products</Text>
            <Text style={styles.bannerSubtitle}>Delivered to your door</Text>
            <TouchableOpacity style={styles.bannerButton}>
              <Text style={styles.bannerButtonText}>Explore Now</Text>
            </TouchableOpacity>
          </View>
          <Image
            source={require('../../assets/images/hero-products.png')}
            style={styles.bannerImage}
            resizeMode="contain"
          />
        </LinearGradient>

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <View style={styles.categoriesGrid}>
            {CATEGORIES.map((category) => (
              <CategoryCard
                key={category.id}
                category={category}
                onPress={() => router.push(`/categories?type=${category.id}`)}
              />
            ))}
          </View>
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={featuredProducts || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => router.push(`/product/${item._id}`)}
              />
            )}
            contentContainerStyle={styles.productsList}
          />
        </View>

        {/* Popular Wines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Wines</Text>
            <TouchableOpacity>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          <FlatList
            horizontal
            showsHorizontalScrollIndicator={false}
            data={popularProducts || []}
            keyExtractor={(item) => item._id}
            renderItem={({ item }) => (
              <ProductCard
                product={item}
                onPress={() => router.push(`/product/${item._id}`)}
              />
            )}
            contentContainerStyle={styles.productsList}
          />
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
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
  },
  subGreeting: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
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
    fontFamily: 'Inter-Regular',
  },
  heroBanner: {
    marginHorizontal: 20,
    marginVertical: 10,
    borderRadius: 15,
    padding: 20,
    flexDirection: 'row',
    alignItems: 'center',
    overflow: 'hidden',
  },
  bannerContent: {
    flex: 1,
  },
  bannerTitle: {
    fontSize: 22,
    fontFamily: 'Inter-Bold',
    color: 'white',
    marginBottom: 5,
  },
  bannerSubtitle: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: 'rgba(255, 255, 255, 0.9)',
    marginBottom: 15,
  },
  bannerButton: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 10,
    borderRadius: 20,
    alignSelf: 'flex-start',
  },
  bannerButtonText: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#e74c3c',
  },
  bannerImage: {
    width: 120,
    height: 120,
    position: 'absolute',
    right: -20,
    bottom: -20,
  },
  section: {
    marginTop: 25,
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
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
  },
  seeAllText: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#e74c3c',
  },
  categoriesGrid: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    paddingHorizontal: 20,
  },
  productsList: {
    paddingHorizontal: 20,
  },
}); 