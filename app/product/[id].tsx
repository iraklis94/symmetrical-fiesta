import React, { useState } from 'react';
import {
  View,
  Text,
  ScrollView,
  Image,
  TouchableOpacity,
  StyleSheet,
  ActivityIndicator,
  FlatList,
  Alert,
} from 'react-native';
import { useLocalSearchParams } from 'expo-router';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { useQuery, useMutation } from 'convex/react';
import { api } from '../../convex/_generated/api';
import { LinearGradient } from 'expo-linear-gradient';
import { useCartStore } from '../../src/stores/cartStore';
import { useLocation } from '../../src/hooks/useLocation';
import Toast from 'react-native-toast-message';
import { Id } from '../../convex/_generated/dataModel';

export default function ProductDetailScreen() {
  const { id } = useLocalSearchParams<{ id: string }>();
  const productId = id as Id<'products'>;
  const { location } = useLocation();
  const [selectedImageIndex, setSelectedImageIndex] = useState(0);
  const [quantity, setQuantity] = useState(1);
  const [selectedStore, setSelectedStore] = useState<any>(null);
  
  const addToCart = useCartStore((state) => state.addItem);
  
  // Fetch product details
  const product = useQuery(api.products.getProduct, { id: productId });
  
  // Fetch product availability
  const availability = useQuery(api.products.getProductAvailability, {
    productId,
    userLocation: location || undefined,
  });

  const handleAddToCart = () => {
    if (!selectedStore) {
      Alert.alert('Select Store', 'Please select a store to add this product to cart');
      return;
    }
    
    if (!product) return;
    
    addToCart({
      productId: product._id,
      storeId: selectedStore.store.id,
      product,
      store: selectedStore.store,
      quantity,
      price: selectedStore.price,
    });
    
    Toast.show({
      type: 'success',
      text1: 'Added to cart',
      text2: `${quantity} × ${product.name}`,
    });
  };

  if (!product) {
    return (
      <View style={styles.loadingContainer}>
        <ActivityIndicator size="large" color="#e74c3c" />
      </View>
    );
  }

  const formatPrice = (price: number) => `€${price.toFixed(2)}`;
  
  const renderProductImage = () => {
    if (product.images && product.images.length > 0) {
      return (
        <View>
          <Image
            source={{ uri: product.images[selectedImageIndex] }}
            style={styles.mainImage}
            resizeMode="cover"
          />
          {product.images.length > 1 && (
            <FlatList
              horizontal
              data={product.images}
              keyExtractor={(item, index) => index.toString()}
              renderItem={({ item, index }) => (
                <TouchableOpacity
                  onPress={() => setSelectedImageIndex(index)}
                  style={[
                    styles.thumbnail,
                    selectedImageIndex === index && styles.selectedThumbnail,
                  ]}
                >
                  <Image source={{ uri: item }} style={styles.thumbnailImage} />
                </TouchableOpacity>
              )}
              style={styles.thumbnailList}
              showsHorizontalScrollIndicator={false}
            />
          )}
        </View>
      );
    }
    
    return (
      <View style={styles.placeholderImage}>
        <Text style={styles.placeholderEmoji}>
          {product.category === 'wine' ? '🍷' : 
           product.category === 'cheese' ? '🧀' : '🫒'}
        </Text>
      </View>
    );
  };

  return (
    <SafeAreaView style={styles.container} edges={['bottom']}>
      <ScrollView showsVerticalScrollIndicator={false}>
        {renderProductImage()}
        
        <View style={styles.content}>
          {/* Product Info */}
          <View style={styles.header}>
            <View style={styles.titleSection}>
              <Text style={styles.brand}>{product.brand}</Text>
              <Text style={styles.name}>{product.name}</Text>
              <Text style={styles.nameEn}>{product.nameEn}</Text>
            </View>
            <TouchableOpacity style={styles.favoriteButton}>
              <Ionicons name="heart-outline" size={28} color="#e74c3c" />
            </TouchableOpacity>
          </View>

          {/* Rating */}
          <View style={styles.ratingSection}>
            <View style={styles.rating}>
              <Ionicons name="star" size={20} color="#f39c12" />
              <Text style={styles.ratingText}>
                {product.avgRating ? product.avgRating.toFixed(1) : '0.0'}
              </Text>
              <Text style={styles.ratingCount}>
                ({product.ratingsCount || 0} reviews)
              </Text>
            </View>
            <TouchableOpacity>
              <Text style={styles.reviewLink}>Read reviews</Text>
            </TouchableOpacity>
          </View>

          {/* Description */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Description</Text>
            <Text style={styles.description}>{product.description}</Text>
          </View>

          {/* Product Specifications */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Specifications</Text>
            {product.category === 'wine' && product.wineData && (
              <View style={styles.specs}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Type</Text>
                  <Text style={styles.specValue}>{product.wineData.type}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Vintage</Text>
                  <Text style={styles.specValue}>{product.wineData.vintage}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Alcohol</Text>
                  <Text style={styles.specValue}>{product.wineData.alcoholContent}%</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Grapes</Text>
                  <Text style={styles.specValue}>
                    {product.wineData.grapeVariety.join(', ')}
                  </Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Serving</Text>
                  <Text style={styles.specValue}>
                    {product.wineData.servingTemp.min}°C - {product.wineData.servingTemp.max}°C
                  </Text>
                </View>
              </View>
            )}
            {product.category === 'cheese' && product.cheeseData && (
              <View style={styles.specs}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Type</Text>
                  <Text style={styles.specValue}>{product.cheeseData.type}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Milk</Text>
                  <Text style={styles.specValue}>{product.cheeseData.milk}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Aging</Text>
                  <Text style={styles.specValue}>{product.cheeseData.aging}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Fat</Text>
                  <Text style={styles.specValue}>{product.cheeseData.fatContent}%</Text>
                </View>
              </View>
            )}
            {product.category === 'olive_oil' && product.oliveOilData && (
              <View style={styles.specs}>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Type</Text>
                  <Text style={styles.specValue}>{product.oliveOilData.type}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Acidity</Text>
                  <Text style={styles.specValue}>{product.oliveOilData.acidity}%</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Harvest</Text>
                  <Text style={styles.specValue}>{product.oliveOilData.harvestYear}</Text>
                </View>
                <View style={styles.specRow}>
                  <Text style={styles.specLabel}>Variety</Text>
                  <Text style={styles.specValue}>
                    {product.oliveOilData.oliveVariety.join(', ')}
                  </Text>
                </View>
              </View>
            )}
          </View>

          {/* Origin */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Origin</Text>
            <View style={styles.origin}>
              <Ionicons name="location" size={20} color="#e74c3c" />
              <View style={styles.originText}>
                <Text style={styles.originRegion}>{product.origin.region}</Text>
                <Text style={styles.originCountry}>{product.origin.country}</Text>
                {product.origin.producer && (
                  <Text style={styles.originProducer}>by {product.origin.producer}</Text>
                )}
              </View>
            </View>
          </View>

          {/* Availability */}
          <View style={styles.section}>
            <Text style={styles.sectionTitle}>Available at</Text>
            {availability && availability.length > 0 ? (
              <FlatList
                data={availability}
                keyExtractor={(item) => item?.store.id || ''}
                renderItem={({ item }) => {
                  if (!item) return null;
                  return (
                    <TouchableOpacity
                      style={[
                        styles.storeCard,
                        selectedStore?.store.id === item.store.id && styles.selectedStoreCard,
                      ]}
                      onPress={() => setSelectedStore(item)}
                    >
                      <View style={styles.storeInfo}>
                        <Text style={styles.storeName}>{item.store.name}</Text>
                        <Text style={styles.storeDistance}>
                          {item.distance ? `${item.distance.toFixed(1)} km away` : 'Distance unknown'}
                        </Text>
                      </View>
                      <View style={styles.priceInfo}>
                        <Text style={styles.price}>{formatPrice(item.price)}</Text>
                        {item.comparePrice && (
                          <Text style={styles.comparePrice}>{formatPrice(item.comparePrice)}</Text>
                        )}
                        <Text style={styles.unit}>per {item.unit}</Text>
                      </View>
                    </TouchableOpacity>
                  );
                }}
                scrollEnabled={false}
              />
            ) : (
              <Text style={styles.noAvailability}>
                Currently not available in nearby stores
              </Text>
            )}
          </View>
        </View>
      </ScrollView>

      {/* Bottom Action Bar */}
      {selectedStore && (
        <View style={styles.bottomBar}>
          <View style={styles.quantitySelector}>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(Math.max(1, quantity - 1))}
            >
              <Ionicons name="remove" size={20} color="#2c3e50" />
            </TouchableOpacity>
            <Text style={styles.quantity}>{quantity}</Text>
            <TouchableOpacity
              style={styles.quantityButton}
              onPress={() => setQuantity(quantity + 1)}
            >
              <Ionicons name="add" size={20} color="#2c3e50" />
            </TouchableOpacity>
          </View>
          
          <TouchableOpacity
            style={styles.addToCartButton}
            onPress={handleAddToCart}
          >
            <Text style={styles.addToCartText}>
              Add to Cart • {formatPrice(selectedStore.price * quantity)}
            </Text>
          </TouchableOpacity>
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
  loadingContainer: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
  },
  mainImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
  },
  placeholderImage: {
    width: '100%',
    height: 300,
    backgroundColor: '#f0f0f0',
    justifyContent: 'center',
    alignItems: 'center',
  },
  placeholderEmoji: {
    fontSize: 80,
  },
  thumbnailList: {
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  thumbnail: {
    width: 60,
    height: 60,
    marginRight: 10,
    borderRadius: 8,
    overflow: 'hidden',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedThumbnail: {
    borderColor: '#e74c3c',
  },
  thumbnailImage: {
    width: '100%',
    height: '100%',
  },
  content: {
    padding: 20,
  },
  header: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'flex-start',
    marginBottom: 15,
  },
  titleSection: {
    flex: 1,
    marginRight: 15,
  },
  brand: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#7f8c8d',
    marginBottom: 4,
  },
  name: {
    fontSize: 24,
    fontFamily: 'Inter-Bold',
    color: '#2c3e50',
    marginBottom: 4,
  },
  nameEn: {
    fontSize: 16,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
  },
  favoriteButton: {
    padding: 8,
  },
  ratingSection: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    marginBottom: 20,
    paddingBottom: 20,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  rating: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  ratingText: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
    marginLeft: 5,
  },
  ratingCount: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
    marginLeft: 5,
  },
  reviewLink: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#e74c3c',
  },
  section: {
    marginBottom: 25,
  },
  sectionTitle: {
    fontSize: 18,
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  description: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#34495e',
    lineHeight: 22,
  },
  specs: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
  },
  specRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    paddingVertical: 8,
    borderBottomWidth: 1,
    borderBottomColor: '#f0f0f0',
  },
  specLabel: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
  },
  specValue: {
    fontSize: 14,
    fontFamily: 'Inter-Medium',
    color: '#2c3e50',
    textAlign: 'right',
    flex: 1,
    marginLeft: 10,
  },
  origin: {
    flexDirection: 'row',
    alignItems: 'flex-start',
    backgroundColor: 'white',
    padding: 15,
    borderRadius: 10,
  },
  originText: {
    marginLeft: 10,
    flex: 1,
  },
  originRegion: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
  },
  originCountry: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
    marginTop: 2,
  },
  originProducer: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
    marginTop: 4,
    fontStyle: 'italic',
  },
  storeCard: {
    backgroundColor: 'white',
    borderRadius: 10,
    padding: 15,
    marginBottom: 10,
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    borderWidth: 2,
    borderColor: 'transparent',
  },
  selectedStoreCard: {
    borderColor: '#e74c3c',
  },
  storeInfo: {
    flex: 1,
  },
  storeName: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
  },
  storeDistance: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
    marginTop: 2,
  },
  priceInfo: {
    alignItems: 'flex-end',
  },
  price: {
    fontSize: 18,
    fontFamily: 'Inter-Bold',
    color: '#e74c3c',
  },
  comparePrice: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
    textDecorationLine: 'line-through',
  },
  unit: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
  },
  noAvailability: {
    fontSize: 14,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
    textAlign: 'center',
    paddingVertical: 20,
  },
  bottomBar: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    padding: 20,
    backgroundColor: 'white',
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  quantitySelector: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    padding: 4,
  },
  quantityButton: {
    width: 36,
    height: 36,
    justifyContent: 'center',
    alignItems: 'center',
    backgroundColor: 'white',
    borderRadius: 6,
  },
  quantity: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
    marginHorizontal: 20,
  },
  addToCartButton: {
    flex: 1,
    marginLeft: 15,
    backgroundColor: '#e74c3c',
    paddingVertical: 15,
    borderRadius: 10,
    alignItems: 'center',
  },
  addToCartText: {
    fontSize: 16,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
}); 