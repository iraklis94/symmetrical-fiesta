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
import { router, useLocalSearchParams } from 'expo-router';
import { useQuery } from '@tanstack/react-query';
import { ProductCard } from '../../src/components/ProductCard';
import { ProductCardSkeleton } from '../../src/components/SkeletonLoader';

const { width } = Dimensions.get('window');

const MOCK_STORES = {
  '1': {
    id: '1',
    name: 'AB Vassilopoulos',
    type: 'supermarket',
    logo: null,
    location: {
      latitude: 37.9838,
      longitude: 23.7275,
      address: 'Syntagma Square, Athens',
      city: 'Athens',
      postalCode: '105 63',
    },
    contact: {
      phone: '+30 210 1234567',
      email: 'info@ab.gr',
      website: 'https://www.ab.gr',
    },
    hours: [
      { day: 0, open: '08:00', close: '22:00', closed: false },
      { day: 1, open: '08:00', close: '22:00', closed: false },
      { day: 2, open: '08:00', close: '22:00', closed: false },
      { day: 3, open: '08:00', close: '22:00', closed: false },
      { day: 4, open: '08:00', close: '22:00', closed: false },
      { day: 5, open: '08:00', close: '22:00', closed: false },
      { day: 6, open: '08:00', close: '22:00', closed: false },
    ],
    features: ['parking', 'wheelchair_access', 'delivery'],
    partnered: true,
    rating: 4.5,
    deliveryFee: 2.99,
    minOrderAmount: 15.00,
    estimatedDeliveryTime: 45,
    active: true,
  },
  '2': {
    id: '2',
    name: 'The Wine Shop',
    type: 'specialty',
    logo: null,
    location: {
      latitude: 37.9715,
      longitude: 23.7267,
      address: 'Plaka, Athens',
      city: 'Athens',
      postalCode: '105 58',
    },
    contact: {
      phone: '+30 210 9876543',
      email: 'info@wineshop.gr',
      website: 'https://www.wineshop.gr',
    },
    hours: [
      { day: 0, open: '10:00', close: '18:00', closed: false },
      { day: 1, open: '10:00', close: '18:00', closed: false },
      { day: 2, open: '10:00', close: '18:00', closed: false },
      { day: 3, open: '10:00', close: '18:00', closed: false },
      { day: 4, open: '10:00', close: '18:00', closed: false },
      { day: 5, open: '10:00', close: '18:00', closed: false },
      { day: 6, open: '10:00', close: '18:00', closed: false },
    ],
    features: ['tasting', 'expert_advice', 'delivery'],
    partnered: true,
    rating: 4.8,
    deliveryFee: 4.99,
    minOrderAmount: 25.00,
    estimatedDeliveryTime: 60,
    active: true,
  },
};

const MOCK_STORE_PRODUCTS = {
  '1': [
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
  ],
  '2': [
    {
      _id: '3',
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
  ],
};

export default function StoreDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();

  const store = useMemo(() => MOCK_STORES[id as keyof typeof MOCK_STORES], [id]);

  const {
    data: products = [],
    isLoading,
    error,
    refetch,
  } = useQuery({
    queryKey: ['store-products', id],
    queryFn: async () => {
      // This would be replaced with actual Convex query
      // return await convex.query(api.products.getProductsWithInventory, {
      //   storeId: id,
      // });
      
      return MOCK_STORE_PRODUCTS[id as keyof typeof MOCK_STORE_PRODUCTS] || [];
    },
    staleTime: 5 * 60 * 1000, // 5 minutes
  });

  const handleProductPress = useCallback((product: any) => {
    router.push(`/product/${product._id}`);
  }, []);

  const handleCallStore = useCallback(() => {
    if (store?.contact?.phone) {
      // In a real app, you would use Linking to make a phone call
      console.log('Calling:', store.contact.phone);
    }
  }, [store]);

  const handleVisitWebsite = useCallback(() => {
    if (store?.contact?.website) {
      // In a real app, you would use Linking to open the website
      console.log('Opening website:', store.contact.website);
    }
  }, [store]);

  const renderProduct = useCallback(({ item }: { item: any }) => (
    <ProductCard
      product={item}
      onPress={handleProductPress}
    />
  ), [handleProductPress]);

  const renderProductSkeleton = useCallback(() => (
    <ProductCardSkeleton />
  ), []);

  const keyExtractor = useCallback((item: any) => item.id || item._id, []);

  const getDayName = useCallback((day: number) => {
    const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
    return days[day];
  }, []);

  if (!store) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.errorContainer}>
          <Ionicons name="alert-circle-outline" size={64} color="#e74c3c" />
          <Text style={styles.errorTitle}>Store Not Found</Text>
          <Text style={styles.errorText}>
            The store you're looking for doesn't exist
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
        <Text style={styles.headerTitle}>{store.name}</Text>
        <TouchableOpacity onPress={() => router.push('/search')}>
          <Ionicons name="search-outline" size={24} color="#2c3e50" />
        </TouchableOpacity>
      </View>

      <FlatList
        data={products}
        renderItem={renderProduct}
        keyExtractor={keyExtractor}
        numColumns={2}
        columnWrapperStyle={styles.productRow}
        contentContainerStyle={styles.productsList}
        showsVerticalScrollIndicator={false}
        ListHeaderComponent={
          <View style={styles.storeInfo}>
            <View style={styles.storeHeader}>
              <View style={styles.storeLogo}>
                <Ionicons 
                  name={store.type === 'supermarket' ? 'cart' : 'business'} 
                  size={32} 
                  color="#e74c3c" 
                />
              </View>
              <View style={styles.storeDetails}>
                <Text style={styles.storeName}>{store.name}</Text>
                <Text style={styles.storeType}>{store.type}</Text>
                <View style={styles.storeRating}>
                  <Ionicons name="star" size={16} color="#f39c12" />
                  <Text style={styles.ratingText}>{store.rating}</Text>
                  <Text style={styles.ratingCount}>({store.rating * 20} reviews)</Text>
                </View>
              </View>
            </View>

            <View style={styles.storeActions}>
              <TouchableOpacity style={styles.actionButton} onPress={handleCallStore}>
                <Ionicons name="call-outline" size={20} color="#e74c3c" />
                <Text style={styles.actionText}>Call</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton} onPress={handleVisitWebsite}>
                <Ionicons name="globe-outline" size={20} color="#e74c3c" />
                <Text style={styles.actionText}>Website</Text>
              </TouchableOpacity>
              <TouchableOpacity style={styles.actionButton}>
                <Ionicons name="location-outline" size={20} color="#e74c3c" />
                <Text style={styles.actionText}>Directions</Text>
              </TouchableOpacity>
            </View>

            <View style={styles.storeInfoSection}>
              <Text style={styles.sectionTitle}>Store Information</Text>
              
              <View style={styles.infoRow}>
                <Ionicons name="location-outline" size={16} color="#7f8c8d" />
                <Text style={styles.infoText}>{store.location.address}</Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="time-outline" size={16} color="#7f8c8d" />
                <Text style={styles.infoText}>
                  {getDayName(0)}-{getDayName(6)}: {store.hours[0].open}-{store.hours[0].close}
                </Text>
              </View>
              
              <View style={styles.infoRow}>
                <Ionicons name="car-outline" size={16} color="#7f8c8d" />
                <Text style={styles.infoText}>
                  Delivery: €{store.deliveryFee.toFixed(2)} • Min €{store.minOrderAmount.toFixed(2)} • {store.estimatedDeliveryTime}min
                </Text>
              </View>
            </View>

            <View style={styles.productsHeader}>
              <Text style={styles.productsTitle}>Available Products</Text>
              <Text style={styles.productsCount}>{products.length} products</Text>
            </View>
          </View>
        }
        ListEmptyComponent={
          isLoading ? (
            <FlatList
              data={Array.from({ length: 4 }, (_, i) => ({ id: i }))}
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
          ) : (
            <View style={styles.emptyContainer}>
              <Ionicons name="bag-outline" size={64} color="#7f8c8d" />
              <Text style={styles.emptyTitle}>No products available</Text>
              <Text style={styles.emptyText}>
                This store doesn't have any products listed yet
              </Text>
            </View>
          )
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
  productsList: {
    padding: 20,
  },
  productRow: {
    justifyContent: 'space-between',
    marginBottom: 15,
  },
  storeInfo: {
    backgroundColor: 'white',
    marginBottom: 20,
    borderRadius: 12,
    padding: 20,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.05,
    shadowRadius: 3,
    elevation: 2,
  },
  storeHeader: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 20,
  },
  storeLogo: {
    width: 60,
    height: 60,
    borderRadius: 30,
    backgroundColor: '#e74c3c20',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 15,
  },
  storeDetails: {
    flex: 1,
  },
  storeName: {
    fontSize: 20,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 2,
  },
  storeType: {
    fontSize: 14,
    color: '#7f8c8d',
    marginBottom: 5,
    textTransform: 'capitalize',
  },
  storeRating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    color: '#7f8c8d',
    marginLeft: 4,
  },
  storeActions: {
    flexDirection: 'row',
    justifyContent: 'space-around',
    marginBottom: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  actionButton: {
    alignItems: 'center',
    paddingHorizontal: 10,
  },
  actionText: {
    fontSize: 12,
    color: '#e74c3c',
    fontWeight: '500',
    marginTop: 4,
  },
  storeInfoSection: {
    marginBottom: 20,
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  sectionTitle: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 10,
  },
  infoRow: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  infoText: {
    fontSize: 14,
    color: '#7f8c8d',
    marginLeft: 8,
    flex: 1,
  },
  productsHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    paddingTop: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  productsTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  productsCount: {
    fontSize: 14,
    color: '#7f8c8d',
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