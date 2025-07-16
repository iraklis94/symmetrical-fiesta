import React from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  Image,
  StyleSheet,
  Dimensions,
} from 'react-native';
import { Ionicons } from '@expo/vector-icons';
import { Doc } from '../../convex/_generated/dataModel';

const { width } = Dimensions.get('window');
const CARD_WIDTH = width * 0.4;

interface ProductCardProps {
  product: Doc<'products'>;
  onPress: () => void;
  style?: any;
}

export function ProductCard({ product, onPress, style }: ProductCardProps) {
  const formatPrice = (price: number) => {
    return `€${price.toFixed(2)}`;
  };

  const getCategoryEmoji = (category: string) => {
    switch (category) {
      case 'wine': return '🍷';
      case 'cheese': return '🧀';
      case 'olive_oil': return '🫒';
      default: return '📦';
    }
  };

  return (
    <TouchableOpacity onPress={onPress} activeOpacity={0.8}>
      <View style={[styles.container, style]}>
        {product.featured && (
          <View style={styles.featuredBadge}>
            <Text style={styles.featuredText}>Featured</Text>
          </View>
        )}
        
        <View style={styles.imageContainer}>
          {product.images?.length > 0 ? (
            <Image
              source={{ uri: product.images[0] }}
              style={styles.image}
              resizeMode="cover"
            />
          ) : (
            <View style={styles.placeholderImage}>
              <Text style={styles.categoryEmoji}>
                {getCategoryEmoji(product.category)}
              </Text>
            </View>
          )}
        </View>

        <View style={styles.content}>
          <Text style={styles.brand}>{product.brand}</Text>
          <Text style={styles.name} numberOfLines={2}>
            {product.name}
          </Text>
          
          <View style={styles.ratingContainer}>
            <Ionicons name="star" size={14} color="#f39c12" />
            <Text style={styles.rating}>
              {product.avgRating ? product.avgRating.toFixed(1) : '0.0'}
            </Text>
            <Text style={styles.ratingCount}>
              ({product.ratingsCount || 0})
            </Text>
          </View>

          <View style={styles.priceContainer}>
            <Text style={styles.price}>From €--</Text>
          </View>
        </View>
      </View>
    </TouchableOpacity>
  );
}

const styles = StyleSheet.create({
  container: {
    width: CARD_WIDTH,
    backgroundColor: 'white',
    borderRadius: 12,
    marginRight: 15,
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 2 },
    shadowOpacity: 0.08,
    shadowRadius: 4,
    elevation: 3,
  },
  featuredBadge: {
    position: 'absolute',
    top: 10,
    left: 10,
    backgroundColor: '#e74c3c',
    paddingHorizontal: 8,
    paddingVertical: 4,
    borderRadius: 6,
    zIndex: 1,
  },
  featuredText: {
    fontSize: 10,
    fontFamily: 'Inter-SemiBold',
    color: 'white',
  },
  imageContainer: {
    width: '100%',
    height: CARD_WIDTH * 0.8,
    borderTopLeftRadius: 12,
    borderTopRightRadius: 12,
    overflow: 'hidden',
  },
  image: {
    width: '100%',
    height: '100%',
  },
  placeholderImage: {
    width: '100%',
    height: '100%',
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
  },
  categoryEmoji: {
    fontSize: 48,
  },
  content: {
    padding: 12,
  },
  brand: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#7f8c8d',
    marginBottom: 2,
  },
  name: {
    fontSize: 14,
    fontFamily: 'Inter-SemiBold',
    color: '#2c3e50',
    marginBottom: 6,
    minHeight: 36,
  },
  ratingContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 8,
  },
  rating: {
    fontSize: 12,
    fontFamily: 'Inter-Medium',
    color: '#2c3e50',
    marginLeft: 4,
  },
  ratingCount: {
    fontSize: 12,
    fontFamily: 'Inter-Regular',
    color: '#7f8c8d',
    marginLeft: 2,
  },
  priceContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
  },
  price: {
    fontSize: 16,
    fontFamily: 'Inter-Bold',
    color: '#e74c3c',
  },
}); 