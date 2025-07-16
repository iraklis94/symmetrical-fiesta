import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { ProductCard } from '../../src/components/ProductCard';
import { ProductCardSkeleton } from '../../src/components/SkeletonLoader';

const { width } = Dimensions.get('window');

const CATEGORIES = {
  wine: {
    id: 'wine',
    name: 'Wine',
    nameGr: 'Κρασί',
    icon: '🍷',
    color: '#722f37',
    description: 'Discover authentic Greek wines from renowned vineyards',
    subcategories: [
      { id: 'red_wine', name: 'Red Wine', nameGr: 'Κόκκινο Κρασί' },
      { id: 'white_wine', name: 'White Wine', nameGr: 'Λευκό Κρασί' },
      { id: 'rose_wine', name: 'Rosé Wine', nameGr: 'Ροζέ Κρασί' },
      { id: 'sparkling_wine', name: 'Sparkling Wine', nameGr: 'Αφρώδες Κρασί' },
    ],
  },
  cheese: {
    id: 'cheese',
    name: 'Cheese',
    nameGr: 'Τυρί',
    icon: '🧀',
    color: '#f39c12',
    description: 'Traditional Greek cheeses with authentic flavors',
    subcategories: [
      { id: 'feta', name: 'Feta', nameGr: 'Φέτα' },
      { id: 'kefalotyri', name: 'Kefalotyri', nameGr: 'Κεφαλοτύρι' },
      { id: 'graviera', name: 'Graviera', nameGr: 'Γραβιέρα' },
      { id: 'manouri', name: 'Manouri', nameGr: 'Μανούρι' },
    ],
  },
  olive_oil: {
    id: 'olive_oil',
    name: 'Olive Oil',
    nameGr: 'Ελαιόλαδο',
    icon: '🫒',
    color: '#27ae60',
    description: 'Premium Greek olive oils from ancient groves',
    subcategories: [
      { id: 'extra_virgin', name: 'Extra Virgin', nameGr: 'Παραδοσιακό' },
      { id: 'virgin', name: 'Virgin', nameGr: 'Παρθένο' },
      { id: 'organic', name: 'Organic', nameGr: 'Βιολογικό' },
      { id: 'flavored', name: 'Flavored', nameGr: 'Αρωματικό' },
    ],
  },
};

const MOCK_PRODUCTS = {
  wine: [
    {
      _id: '1',
      name: 'Domaine Gerovassiliou Malagousia',
      brand: 'Domaine Gerovassiliou',
      category: 'wine',
      subcategory: 'white_wine',
      price: 18.50,
      avgRating: 4.8,
      ratingsCount: 124,
      featured: true,
      images: [],
    },
    {
      _id: '2',
      name: 'Boutari Naoussa Red',
      brand: 'Boutari',
      category: 'wine',
      subcategory: 'red_wine',
      price: 15.99,
      avgRating: 4.6,
      ratingsCount: 89,
      featured: false,
      images: [],
    },
    {
      _id: '3',
      name: 'Tsantali Rapsani Reserve',
      brand: 'Tsantali',
      category: 'wine',
      subcategory: 'red_wine',
      price: 22.00,
      avgRating: 4.9,
      ratingsCount: 67,
      featured: true,
      images: [],
    },
  ],
  cheese: [
    {
      _id: '4',
      name: 'Traditional Feta PDO',
      brand: 'Greek Dairy Co.',
      category: 'cheese',
      subcategory: 'feta',
      price: 8.90,
      avgRating: 4.6,
      ratingsCount: 156,
      featured: true,
      images: [],
    },
    {
      _id: '5',
      name: 'Aged Kefalotyri',
      brand: 'Cretan Dairy',
      category: 'cheese',
      subcategory: 'kefalotyri',
      price: 12.50,
      avgRating: 4.7,
      ratingsCount: 78,
      featured: false,
      images: [],
    },
  ],
  olive_oil: [
    {
      _id: '6',
      name: 'Extra Virgin Olive Oil',
      brand: 'Peloponnese Estate',
      category: 'olive_oil',
      subcategory: 'extra_virgin',
      price: 12.99,
      avgRating: 4.9,
      ratingsCount: 203,
      featured: true,
      images: [],
    },
    {
      _id: '7',
      name: 'Organic Olive Oil',
      brand: 'Crete Organic',
      category: 'olive_oil',
      subcategory: 'organic',
      price: 16.50,
      avgRating: 4.8,
      ratingsCount: 95,
      featured: false,
      images: [],
    },
  ],
};

export default function CategoryDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const [selectedSubcategory, setSelectedSubcategory] = useState('all');
  const [sortBy, setSortBy] = useState('featured');
  const convex = useConvex();

  const category = useMemo(() => CATEGORIES[id as keyof typeof CATEGORIES], [id]);

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['category-products', id, selectedSubcategory],
    queryFn: async () => {
      return await convex.query(api.products.getProductsByCategory, {
        category: id,
        subcategory: selectedSubcategory === 'all' ? undefined : selectedSubcategory,
      });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleProductPress = useCallback((product: any) => {
    router.push(`/product/${product._id}`);
  }, []);

  const handleSubcategoryPress = useCallback((subcategoryId: string) => {
    setSelectedSubcategory(subcategoryId);
  }, []);

  const handleSortChange = useCallback((sortOption: string) => {
    setSortBy(sortOption);
  }, []);

  const renderProduct = useCallback(({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
    />
  ), [handleProductPress]);

  const renderProductSkeleton = useCallback(() => (
    <ProductCardSkeleton />
  ), []);

  const renderSubcategory = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.subcategoryChip,
        selectedSubcategory === item.id && styles.subcategoryChipActive
      ]}
      onPress={() => handleSubcategoryPress(item.id)}
    >
      <Text style={[
        styles.subcategoryText,
        selectedSubcategory === item.id && styles.subcategoryTextActive
      ]}>
        {item.nameGr}
      </Text>
    </TouchableOpacity>
  ), [selectedSubcategory, handleSubcategoryPress]);

  const renderSortOption = useCallback(({ item }: { item: { id: string; label: string } }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.sortOption,
        sortBy === item.id && styles.sortOptionActive
      ]}
      onPress={() => handleSortChange(item.id)}
    >
      <Text style={[
        styles.sortOptionText,
        sortBy === item.id && styles.sortOptionTextActive
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  ), [sortBy, handleSortChange]);

  const keyExtractor = useCallback((item: any) => item.id || item._id, []);

  const sortOptions = [
    { id: 'featured', label: 'Featured' },
    { id: 'price_low', label: 'Price: Low to High' },
    { id: 'price_high', label: 'Price: High to Low' },
    { id: 'rating', label: 'Highest Rated' },
  ];

  if (!category) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorTitle}>Category Not Found</Text>
          <Text style={styles.errorText}>
            The category you're looking for doesn't exist
          </Text>
          <TouchableOpacity 
            style={styles.backButton}
            onPress={() => router.back()}
          >
            <Text style={styles.backButtonText}>Go Back</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>{category.nameGr}</Text>
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <View style={styles.categoryInfo}>
        <View style={styles.categoryHeader}>
          <Text style={styles.categoryIcon}>{category.icon}</Text>
          <View style={styles.categoryDetails}>
            <Text style={styles.categoryName}>{category.nameGr}</Text>
            <Text style={styles.categoryNameEn}>{category.name}</Text>
          </View>
        </View>
        <Text style={styles.categoryDescription}>{category.description}</Text>
      </View>

      {/* Subcategories */}
      <View style={styles.subcategoriesContainer}>
        <FlatList
          data={[{ id: 'all', name: 'All', nameGr: 'Όλα' }, ...category.subcategories]}
          renderItem={renderSubcategory}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.subcategoriesList}
        />
      </View>

      {/* Sort Options */}
      <View style={styles.sortContainer}>
        <Text style={styles.sortLabel}>Sort by:</Text>
        <FlatList
          data={sortOptions}
          renderItem={renderSortOption}
          keyExtractor={keyExtractor}
          horizontal
          showsHorizontalScrollIndicator={false}
          contentContainerStyle={styles.sortOptionsList}
        />
      </View>

      {/* Products */}
      <View style={styles.productsContainer}>
        {isLoading ? (
          <FlatList
            data={Array.from({ length: 6 }, (_, i) => ({ id: i }))}
            renderItem={renderProductSkeleton}
            keyExtractor={keyExtractor}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
          />
        ) : error ? (
          <View style={styles.errorContainer}>
            <Text style={styles.errorText}>Failed to load products</Text>
            <TouchableOpacity onPress={() => refetch()}>
              <Text style={styles.retryText}>Retry</Text>
            </TouchableOpacity>
          </View>
        ) : products.length > 0 ? (
          <FlatList
            data={products}
            renderItem={renderProduct}
            keyExtractor={keyExtractor}
            numColumns={2}
            columnWrapperStyle={styles.productRow}
            contentContainerStyle={styles.productsList}
            showsVerticalScrollIndicator={false}
          />
        ) : (
          <View style={styles.emptyContainer}>
            <Ionicons name="search-outline" size={64} color="#7f8c8d" />
            <Text style={styles.emptyTitle}>No products found</Text>
            <Text style={styles.emptyText}>
              Try adjusting your filters or browse other categories
            </Text>
          </View>
        )}
      </View>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  categoryInfo: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 20,
  },
  categoryHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 10,
  },
  categoryIcon: {
    fontSize: 32,
    marginRight: 12,
  },
  categoryDetails: {
    flex: 1,
  },
  categoryName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  categoryNameEn: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  categoryDescription: {
    fontSize: 14,
    color: '#7f8c8d',
    lineHeight: 20,
  },
  subcategoriesContainer: {
    backgroundColor: 'white',
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  subcategoriesList: {
    paddingHorizontal: 20,
    gap: 10,
  },
  subcategoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  subcategoryChipActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  subcategoryText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  subcategoryTextActive: {
    color: 'white',
  },
  sortContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  sortLabel: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 10,
  },
  sortOptionsList: {
    gap: 10,
  },
  sortOption: {
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    backgroundColor: '#f8f9fa',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  sortOptionActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  sortOptionText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  sortOptionTextActive: {
    color: 'white',
  },
  productsContainer: {
    flex: 1,
  },
  productsList: {
    padding: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  errorContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  errorTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 8,
  },
  errorText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    marginBottom: 20,
  },
  retryText: {
    fontSize: 14,
    color: '#e74c3c',
    textDecorationLine: 'underline',
  },
  backButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  backButtonText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
  emptyContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  emptyTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 8,
  },
  emptyText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
  },
});