import React, { useState, useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TextInput,
  TouchableOpacity,
  FlatList,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../src/components/ProductCard';
import { ProductCardSkeleton } from '../src/components/SkeletonLoader';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  { id: 'all', name: 'All', nameGr: 'Όλα' },
  { id: 'wine', name: 'Wine', nameGr: 'Κρασί' },
  { id: 'cheese', name: 'Cheese', nameGr: 'Τυρί' },
  { id: 'olive_oil', name: 'Olive Oil', nameGr: 'Ελαιόλαδο' },
];

const PRICE_RANGES = [
  { id: 'all', label: 'All Prices' },
  { id: '0-10', label: '€0 - €10' },
  { id: '10-25', label: '€10 - €25' },
  { id: '25-50', label: '€25 - €50' },
  { id: '50+', label: '€50+' },
];

export default function SearchScreen() {
  const [searchTerm, setSearchTerm] = useState('');
  const [selectedCategory, setSelectedCategory] = useState('all');
  const [selectedPriceRange, setSelectedPriceRange] = useState('all');
  const [showFilters, setShowFilters] = useState(false);

  const {
    data: searchResults = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['search', searchTerm, selectedCategory, selectedPriceRange],
    queryFn: async () => {
      if (!searchTerm.trim()) return [];
      
      // This would be replaced with actual Convex query
      // return await convex.query(api.products.searchProducts, {
      //   searchTerm: searchTerm.trim(),
      //   category: selectedCategory === 'all' ? undefined : selectedCategory,
      //   filters: {
      //     priceRange: selectedPriceRange === 'all' ? undefined : parsePriceRange(selectedPriceRange),
      //   },
      // });
      
      // Mock data for now
      return [];
    },
    enabled: searchTerm.trim().length > 0,
    staleTime: 2 * 60 * 1000, // 2 minutes
  });

  const handleSearch = useCallback(() => {
    if (searchTerm.trim()) {
      refetch();
    }
  }, [searchTerm, refetch]);

  const handleProductPress = useCallback((product: any) => {
    router.push(`/product/${product._id}`);
  }, []);

  const handleCategoryPress = useCallback((categoryId: string) => {
    setSelectedCategory(categoryId);
  }, []);

  const handlePriceRangePress = useCallback((rangeId: string) => {
    setSelectedPriceRange(rangeId);
  }, []);

  const clearFilters = useCallback(() => {
    setSelectedCategory('all');
    setSelectedPriceRange('all');
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

  const renderCategory = useCallback(({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity
      style={[
        styles.categoryChip,
        selectedCategory === item.id && styles.categoryChipActive
      ]}
      onPress={() => handleCategoryPress(item.id)}
    >
      <Text style={[
        styles.categoryChipText,
        selectedCategory === item.id && styles.categoryChipTextActive
      ]}>
        {item.nameGr}
      </Text>
    </TouchableOpacity>
  ), [selectedCategory, handleCategoryPress]);

  const renderPriceRange = useCallback(({ item }: { item: typeof PRICE_RANGES[0] }) => (
    <TouchableOpacity
      style={[
        styles.priceChip,
        selectedPriceRange === item.id && styles.priceChipActive
      ]}
      onPress={() => handlePriceRangePress(item.id)}
    >
      <Text style={[
        styles.priceChipText,
        selectedPriceRange === item.id && styles.priceChipTextActive
      ]}>
        {item.label}
      </Text>
    </TouchableOpacity>
  ), [selectedPriceRange, handlePriceRangePress]);

  const keyExtractor = useCallback((item: any) => item.id || item._id, []);

  const searchBar = useMemo(() => (
    <View style={styles.searchContainer}>
      <View style={styles.searchInputContainer}>
        <Ionicons name="search-outline" size={20} color="#7f8c8d" />
        <TextInput
          style={styles.searchInput}
          placeholder="Search for wine, cheese, olive oil..."
          placeholderTextColor="#7f8c8d"
          value={searchTerm}
          onChangeText={setSearchTerm}
          onSubmitEditing={handleSearch}
          returnKeyType="search"
          autoCapitalize="none"
          autoCorrect={false}
        />
        {searchTerm.length > 0 && (
          <TouchableOpacity onPress={() => setSearchTerm('')}>
            <Ionicons name="close-circle" size={20} color="#7f8c8d" />
          </TouchableOpacity>
        )}
      </View>
      <TouchableOpacity
        style={styles.filterButton}
        onPress={() => setShowFilters(!showFilters)}
      >
        <Ionicons name="filter" size={20} color="#2c3e50" />
      </TouchableOpacity>
    </View>
  ), [searchTerm, showFilters, handleSearch]);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Search Products</Text>
        <View style={{ width: 24 }} />
      </View>

      {searchBar}

      {showFilters && (
        <View style={styles.filtersContainer}>
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Category</Text>
            <FlatList
              data={CATEGORIES}
              renderItem={renderCategory}
              keyExtractor={keyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.categoriesList}
            />
          </View>
          
          <View style={styles.filterSection}>
            <Text style={styles.filterTitle}>Price Range</Text>
            <FlatList
              data={PRICE_RANGES}
              renderItem={renderPriceRange}
              keyExtractor={keyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.priceRangesList}
            />
          </View>

          <TouchableOpacity style={styles.clearFiltersButton} onPress={clearFilters}>
            <Text style={styles.clearFiltersText}>Clear Filters</Text>
          </TouchableOpacity>
        </View>
      )}

      {searchTerm.trim() && (
        <View style={styles.resultsContainer}>
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
              <Text style={styles.errorText}>Failed to load search results</Text>
              <TouchableOpacity onPress={() => refetch()}>
                <Text style={styles.retryText}>Retry</Text>
              </TouchableOpacity>
            </View>
          ) : searchResults.length > 0 ? (
            <FlatList
              data={searchResults}
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
              <Text style={styles.emptyTitle}>No results found</Text>
              <Text style={styles.emptyText}>
                Try adjusting your search terms or filters
              </Text>
            </View>
          )}
        </View>
      )}

      {!searchTerm.trim() && (
        <View style={styles.initialState}>
          <Ionicons name="search-outline" size={80} color="#7f8c8d" />
          <Text style={styles.initialTitle}>Search Products</Text>
          <Text style={styles.initialText}>
            Find your favorite Greek wines, cheeses, and olive oils
          </Text>
        </View>
      )}
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
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  searchContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    paddingHorizontal: 20,
    paddingVertical: 15,
    gap: 10,
  },
  searchInputContainer: {
    flex: 1,
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 10,
    paddingHorizontal: 15,
    paddingVertical: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  searchInput: {
    flex: 1,
    marginLeft: 10,
    fontSize: 16,
    color: '#2c3e50',
  },
  filterButton: {
    width: 44,
    height: 44,
    backgroundColor: 'white',
    borderRadius: 10,
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  filtersContainer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  filterSection: {
    marginBottom: 15,
  },
  filterTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  categoriesList: {
    gap: 10,
  },
  categoryChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  categoryChipActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  categoryChipText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  categoryChipTextActive: {
    color: 'white',
  },
  priceRangesList: {
    gap: 10,
  },
  priceChip: {
    paddingHorizontal: 16,
    paddingVertical: 8,
    borderRadius: 20,
    backgroundColor: '#ecf0f1',
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  priceChipActive: {
    backgroundColor: '#e74c3c',
    borderColor: '#e74c3c',
  },
  priceChipText: {
    fontSize: 14,
    color: '#7f8c8d',
    fontWeight: '500',
  },
  priceChipTextActive: {
    color: 'white',
  },
  clearFiltersButton: {
    alignSelf: 'flex-start',
    paddingVertical: 8,
  },
  clearFiltersText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
  resultsContainer: {
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
  errorText: {
    fontSize: 16,
    color: '#e74c3c',
    textAlign: 'center',
    marginBottom: 10,
  },
  retryText: {
    fontSize: 14,
    color: '#e74c3c',
    textDecorationLine: 'underline',
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
  initialState: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  initialTitle: {
    fontSize: 24,
    fontWeight: '600',
    color: '#2c3e50',
    marginTop: 15,
    marginBottom: 8,
  },
  initialText: {
    fontSize: 16,
    color: '#7f8c8d',
    textAlign: 'center',
    lineHeight: 24,
  },
});