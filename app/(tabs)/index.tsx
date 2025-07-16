import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  ScrollView,
  TouchableOpacity,
  StyleSheet,
  FlatList,
  RefreshControl,
  Alert,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useConvexAuth } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { CategoryCard } from '../../src/components/CategoryCard';
import { ProductCard } from '../../src/components/ProductCard';
import { ProductCardSkeleton, CategoryCardSkeleton } from '../../src/components/SkeletonLoader';

const CATEGORIES = [
  { id: 'wine', name: 'Wine', nameGr: 'Κρασί', icon: '🍷', color: '#722f37' },
  { id: 'cheese', name: 'Cheese', nameGr: 'Τυρί', icon: '🧀', color: '#f39c12' },
  { id: 'olive_oil', name: 'Olive Oil', nameGr: 'Ελαιόλαδο', icon: '🫒', color: '#27ae60' },
];

const SKELETON_PRODUCTS = Array.from({ length: 6 }, (_, i) => ({ id: i }));
const SKELETON_CATEGORIES = Array.from({ length: 3 }, (_, i) => ({ id: i }));

export default function HomeScreen() {
  const [refreshing, setRefreshing] = useState(false);
  const { isAuthenticated } = useConvexAuth();

  // Mock data for featured products
  const MOCK_FEATURED_PRODUCTS = [
    {
      _id: '1',
      name: 'Domaine Gerovassiliou Malagousia',
      brand: 'Domaine Gerovassiliou',
      category: 'wine',
      price: 18.50,
      avgRating: 4.8,
      ratingsCount: 124,
      featured: true,
      images: [],
    },
    {
      _id: '2',
      name: 'Traditional Feta PDO',
      brand: 'Greek Dairy Co.',
      category: 'cheese',
      price: 8.90,
      avgRating: 4.6,
      ratingsCount: 156,
      featured: true,
      images: [],
    },
    {
      _id: '3',
      name: 'Extra Virgin Olive Oil',
      brand: 'Peloponnese Estate',
      category: 'olive_oil',
      price: 12.99,
      avgRating: 4.9,
      ratingsCount: 203,
      featured: true,
      images: [],
    },
  ];

  const MOCK_POPULAR_WINES = [
    {
      _id: '4',
      name: 'Boutari Naoussa Red',
      brand: 'Boutari',
      category: 'wine',
      price: 15.99,
      avgRating: 4.6,
      ratingsCount: 89,
      featured: false,
      images: [],
    },
    {
      _id: '5',
      name: 'Tsantali Rapsani Reserve',
      brand: 'Tsantali',
      category: 'wine',
      price: 22.00,
      avgRating: 4.9,
      ratingsCount: 67,
      featured: true,
      images: [],
    },
    {
      _id: '6',
      name: 'Alpha Estate Xinomavro',
      brand: 'Alpha Estate',
      category: 'wine',
      price: 19.50,
      avgRating: 4.7,
      ratingsCount: 112,
      featured: false,
      images: [],
    },
  ];

  // Fetch featured products
  const {
    data: featuredProducts = MOCK_FEATURED_PRODUCTS,
    isLoading: featuredLoading,
    error: featuredError,
    refetch: refetchFeatured,
  } = useQuery({
    queryKey: ['featured-products'],
    queryFn: async () => {
      // This would be replaced with actual Convex query
      // return await convex.query(api.products.getFeaturedProducts, { limit: 6 });
      return MOCK_FEATURED_PRODUCTS;
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
    cacheTime: 10 * 60 * 1000, // 10 minutes
  });

  // Fetch popular wines
  const {
    data: popularWines = MOCK_POPULAR_WINES,
    isLoading: winesLoading,
    error: winesError,
    refetch: refetchWines,
  } = useQuery({
    queryKey: ['popular-wines'],
    queryFn: async () => {
      // This would be replaced with actual Convex query
      // return await convex.query(api.products.getProductsByCategory, { 
      //   category: 'wine', 
      //   limit: 6 
      // });
      return MOCK_POPULAR_WINES;
    },
    staleTime: 5 * 60 * 1000,
    cacheTime: 10 * 60 * 1000,
  });

  const handleRefresh = useCallback(async () => {
    setRefreshing(true);
    try {
      await Promise.all([
        refetchFeatured(),
        refetchWines(),
      ]);
    } catch (error) {
      console.error('Refresh failed:', error);
    } finally {
      setRefreshing(false);
    }
  }, [refetchFeatured, refetchWines]);

  const handleSearch = useCallback(() => {
    router.push('/search');
  }, []);

  const handleCategoryPress = useCallback((category: typeof CATEGORIES[0]) => {
    router.push(`/categories/${category.id}`);
  }, []);

  const handleProductPress = useCallback((product: any) => {
    router.push(`/product/${product._id}`);
  }, []);

  const handleNotificationPress = useCallback(() => {
    if (!isAuthenticated) {
      Alert.alert('Sign In Required', 'Please sign in to view notifications');
      return;
    }
    router.push('/notifications');
  }, [isAuthenticated]);

  const renderCategory = useCallback(({ item }: { item: typeof CATEGORIES[0] }) => (
    <CategoryCard
      category={item}
      onPress={handleCategoryPress}
    />
  ), [handleCategoryPress]);

  const renderProduct = useCallback(({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
    />
  ), [handleProductPress]);

  const renderProductSkeleton = useCallback(() => (
    <ProductCardSkeleton />
  ), []);

  const renderCategorySkeleton = useCallback(() => (
    <CategoryCardSkeleton />
  ), []);

  const keyExtractor = useCallback((item: any) => item.id || item._id, []);

  const searchBar = useMemo(() => (
    <TouchableOpacity onPress={handleSearch} activeOpacity={0.7}>
      <View style={styles.searchBar}>
        <Ionicons name="search-outline" size={20} color="#7f8c8d" />
        <Text style={styles.searchPlaceholder}>Search for wine, cheese, olive oil...</Text>
      </View>
    </TouchableOpacity>
  ), [handleSearch]);

  const header = useMemo(() => (
    <View style={styles.header}>
      <View>
        <Text style={styles.greeting}>Καλημέρα! 👋</Text>
        <Text style={styles.subGreeting}>Welcome to GreekMarket</Text>
      </View>
      <TouchableOpacity onPress={handleNotificationPress}>
        <View style={styles.notificationIcon}>
          <Ionicons name="notifications-outline" size={24} color="#2c3e50" />
          <View style={styles.notificationBadge} />
        </View>
      </TouchableOpacity>
    </View>
  ), [handleNotificationPress]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <ScrollView
        showsVerticalScrollIndicator={false}
        refreshControl={
          <RefreshControl refreshing={refreshing} onRefresh={handleRefresh} />
        }
        removeClippedSubviews={true}
        maxToRenderPerBatch={10}
        windowSize={10}
      >
        {header}
        {searchBar}

        {/* Categories */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Shop by Category</Text>
          <FlatList
            data={CATEGORIES}
            renderItem={renderCategory}
            keyExtractor={keyExtractor}
            horizontal
            showsHorizontalScrollIndicator={false}
            contentContainerStyle={styles.categoriesList}
            removeClippedSubviews={true}
            maxToRenderPerBatch={3}
            windowSize={5}
          />
        </View>

        {/* Featured Products */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Featured Products</Text>
            <TouchableOpacity onPress={() => router.push('/products/featured')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          {featuredLoading ? (
            <FlatList
              data={SKELETON_PRODUCTS}
              renderItem={renderProductSkeleton}
              keyExtractor={keyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
              removeClippedSubviews={true}
              maxToRenderPerBatch={3}
              windowSize={5}
            />
          ) : featuredError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load featured products</Text>
              <TouchableOpacity onPress={() => refetchFeatured()}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : featuredProducts.length > 0 ? (
            <FlatList
              data={featuredProducts}
              renderItem={renderProduct}
              keyExtractor={keyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
              removeClippedSubviews={true}
              maxToRenderPerBatch={3}
              windowSize={5}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No featured products available</Text>
            </View>
          )}
        </View>

        {/* Popular Wines */}
        <View style={styles.section}>
          <View style={styles.sectionHeader}>
            <Text style={styles.sectionTitle}>Popular Wines</Text>
            <TouchableOpacity onPress={() => router.push('/products/wine')}>
              <Text style={styles.seeAllText}>See all</Text>
            </TouchableOpacity>
          </View>
          {winesLoading ? (
            <FlatList
              data={SKELETON_PRODUCTS}
              renderItem={renderProductSkeleton}
              keyExtractor={keyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
              removeClippedSubviews={true}
              maxToRenderPerBatch={3}
              windowSize={5}
            />
          ) : winesError ? (
            <View style={styles.errorContainer}>
              <Text style={styles.errorText}>Failed to load popular wines</Text>
              <TouchableOpacity onPress={() => refetchWines()}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : popularWines.length > 0 ? (
            <FlatList
              data={popularWines}
              renderItem={renderProduct}
              keyExtractor={keyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.productsList}
              removeClippedSubviews={true}
              maxToRenderPerBatch={3}
              windowSize={5}
            />
          ) : (
            <View style={styles.emptyContainer}>
              <Text style={styles.emptyText}>No popular wines available</Text>
            </View>
          )}
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
  errorContainer: {
    padding: 20,
    alignItems: 'center',
  },
  errorText: {
    color: '#e74c3c',
    fontSize: 16,
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    color: '#e74c3c',
    fontSize: 14,
    textDecorationLine: 'underline',
  },
  emptyContainer: {
    padding: 20,
    alignItems: 'center',
  },
  emptyText: {
    color: '#7f8c8d',
    fontSize: 16,
    textAlign: 'center',
  },
  productsList: {
    paddingHorizontal: 20,
  },
}); 