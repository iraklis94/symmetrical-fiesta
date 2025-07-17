import React, { useCallback, useMemo } from 'react';
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
import { router } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';

const { width } = Dimensions.get('window');

const CATEGORIES = [
  {
    id: 'wine',
    name: 'Wine',
    nameGr: 'Κρασί',
    icon: '🍷',
    color: '#722f37',
    description: 'Discover authentic Greek wines',
    subcategories: [
      { id: 'red_wine', name: 'Red Wine', nameGr: 'Κόκκινο Κρασί' },
      { id: 'white_wine', name: 'White Wine', nameGr: 'Λευκό Κρασί' },
      { id: 'rose_wine', name: 'Rosé Wine', nameGr: 'Ροζέ Κρασί' },
      { id: 'sparkling_wine', name: 'Sparkling Wine', nameGr: 'Αφρώδες Κρασί' },
    ],
  },
  {
    id: 'cheese',
    name: 'Cheese',
    nameGr: 'Τυρί',
    icon: '🧀',
    color: '#f39c12',
    description: 'Traditional Greek cheeses',
    subcategories: [
      { id: 'feta', name: 'Feta', nameGr: 'Φέτα' },
      { id: 'kefalotyri', name: 'Kefalotyri', nameGr: 'Κεφαλοτύρι' },
      { id: 'graviera', name: 'Graviera', nameGr: 'Γραβιέρα' },
      { id: 'manouri', name: 'Manouri', nameGr: 'Μανούρι' },
    ],
  },
  {
    id: 'olive_oil',
    name: 'Olive Oil',
    nameGr: 'Ελαιόλαδο',
    icon: '🫒',
    color: '#27ae60',
    description: 'Premium Greek olive oils',
    subcategories: [
      { id: 'extra_virgin', name: 'Extra Virgin', nameGr: 'Παραδοσιακό' },
      { id: 'virgin', name: 'Virgin', nameGr: 'Παρθένο' },
      { id: 'organic', name: 'Organic', nameGr: 'Βιολογικό' },
      { id: 'flavored', name: 'Flavored', nameGr: 'Αρωματικό' },
    ],
  },
];

const FEATURED_PRODUCTS = [
  {
    id: '1',
    name: 'Domaine Gerovassiliou Malagousia',
    brand: 'Domaine Gerovassiliou',
    category: 'wine',
    price: 18.50,
    rating: 4.8,
    image: null,
  },
  {
    id: '2',
    name: 'Traditional Feta PDO',
    brand: 'Greek Dairy Co.',
    category: 'cheese',
    price: 8.90,
    rating: 4.6,
    image: null,
  },
  {
    id: '3',
    name: 'Extra Virgin Olive Oil',
    brand: 'Peloponnese Estate',
    category: 'olive_oil',
    price: 12.99,
    rating: 4.9,
    image: null,
  },
];

export default function CategoriesScreen() {
  const convex = useConvex();
  
  const {
    data: featuredProducts = FEATURED_PRODUCTS,
    isLoading,
    error,
  } = useQuery({
    queryKey: ['featured-products-categories'],
    queryFn: async () => {
      return await convex.query(api.products.getFeaturedProducts, { limit: 6 });
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleCategoryPress = useCallback((category: typeof CATEGORIES[0]) => {
    router.push(`/categories/${category.id}`);
  }, []);

  const handleSubcategoryPress = useCallback((categoryId: string, subcategoryId: string) => {
    router.push(`/categories/${categoryId}/${subcategoryId}`);
  }, []);

  const handleProductPress = useCallback((product: any) => {
    router.push(`/product/${product.id}`);
  }, []);

  const handleSearchPress = useCallback(() => {
    router.push('/search');
  }, []);

  const renderCategory = useCallback(({ item }: { item: typeof CATEGORIES[0] }) => (
    <TouchableOpacity
      style={[styles.categoryCard, { backgroundColor: item.color + '20' }]}
      onPress={() => handleCategoryPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.categoryHeader}>
        <Text style={styles.categoryIcon}>{item.icon}</Text>
        <View style={styles.categoryInfo}>
          <Text style={styles.categoryName}>{item.nameGr}</Text>
          <Text style={styles.categoryNameEn}>{item.name}</Text>
        </View>
        <Ionicons name="chevron-forward" size={20} color="#7f8c8d" />
      </View>
      
      <Text style={styles.categoryDescription}>{item.description}</Text>
      
      <View style={styles.subcategoriesContainer}>
        {item.subcategories.slice(0, 2).map((sub) => (
          <TouchableOpacity
            key={sub.id}
            style={styles.subcategoryChip}
            onPress={() => handleSubcategoryPress(item.id, sub.id)}
          >
            <Text style={styles.subcategoryText}>{sub.nameGr}</Text>
          </TouchableOpacity>
        ))}
        {item.subcategories.length > 2 && (
          <Text style={styles.moreText}>+{item.subcategories.length - 2} more</Text>
        )}
      </View>
    </TouchableOpacity>
  ), [handleCategoryPress, handleSubcategoryPress]);

  const renderFeaturedProduct = useCallback(({ item }: { item: any }) => (
    <TouchableOpacity
      style={styles.featuredProductCard}
      onPress={() => handleProductPress(item)}
      activeOpacity={0.7}
    >
      <View style={styles.productImage}>
        <Text style={styles.productEmoji}>
          {item.category === 'wine' ? '🍷' : 
           item.category === 'cheese' ? '🧀' : '🫒'}
        </Text>
      </View>
      
      <View style={styles.productInfo}>
        <Text style={styles.productBrand}>{item.brand}</Text>
        <Text style={styles.productName} numberOfLines={2}>
          {item.name}
        </Text>
        
        <View style={styles.productRating}>
          <Ionicons name="star" size={14} color="#f39c12" />
          <Text style={styles.ratingText}>{item.rating}</Text>
        </View>
        
        <Text style={styles.productPrice}>€{item.price.toFixed(2)}</Text>
      </View>
    </TouchableOpacity>
  ), [handleProductPress]);

  const keyExtractor = useCallback((item: any) => item.id, []);

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>Categories</Text>
        <TouchableOpacity onPress={handleSearchPress}>
          <Ionicons name="search-outline" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={CATEGORIES}
        renderItem={renderCategory}
        keyExtractor={keyExtractor}
        showsVerticalScrollIndicator={false}
        contentContainerStyle={styles.categoriesList}
        ListHeaderComponent={
          <View style={styles.featuredSection}>
            <Text style={styles.featuredTitle}>Featured Products</Text>
            <FlatList
              data={featuredProducts}
              renderItem={renderFeaturedProduct}
              keyExtractor={keyExtractor}
              horizontal
              showsHorizontalScrollIndicator={false}
              contentContainerStyle={styles.featuredList}
            />
          </View>
        }
        ListFooterComponent={
          <View style={styles.footer}>
            <Text style={styles.footerText}>
              Discover the finest Greek products
            </Text>
          </View>
        }
      />
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
    backgroundColor: 'white',
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  headerTitle: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
  },
  categoriesList: {
    padding: 20,
  },
  featuredSection: {
    marginBottom: 30,
  },
  featuredTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  featuredList: {
    gap: 15,
  },
  featuredProductCard: {
    width: width * 0.4,
    backgroundColor: 'white',
    borderRadius: 12,
    padding: 12,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  productImage: {
    width: '100%',
    height: 80,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginBottom: 10,
  },
  productEmoji: {
    fontSize: 36,
  },
  productInfo: {
    flex: 1,
  },
  productBrand: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  productName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 6,
    minHeight: 36,
  },
  productRating: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 6,
  },
  ratingText: {
    fontSize: 12,
    color: '#2c3e50',
    marginLeft: 4,
  },
  productPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
  },
  categoryCard: {
    backgroundColor: 'white',
    borderRadius: 15,
    padding: 20,
    marginBottom: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
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
  categoryInfo: {
    flex: 1,
  },
  categoryName: {
    fontSize: 18,
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
    marginBottom: 15,
    lineHeight: 20,
  },
  subcategoriesContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    flexWrap: 'wrap',
    gap: 8,
  },
  subcategoryChip: {
    backgroundColor: 'white',
    paddingHorizontal: 12,
    paddingVertical: 6,
    borderRadius: 16,
    borderWidth: 1,
    borderColor: '#ecf0f1',
  },
  subcategoryText: {
    fontSize: 12,
    color: '#2c3e50',
    fontWeight: '500',
  },
  moreText: {
    fontSize: 12,
    color: '#7f8c8d',
    fontStyle: 'italic',
  },
  footer: {
    alignItems: 'center',
    paddingVertical: 20,
  },
  footerText: {
    fontSize: 14,
    color: '#7f8c8d',
    textAlign: 'center',
  },
}); 