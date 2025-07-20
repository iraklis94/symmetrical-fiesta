import React, { useCallback, useMemo } from 'react';
import {
  View,
  Text,
  TouchableOpacity,
  ScrollView,
  StyleSheet,
  Alert,
  Dimensions,
} from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { Ionicons } from '@expo/vector-icons';
import { router } from 'expo-router';
import { useCartStore } from '../../src/stores/cartStore';
import { Id } from '../../convex/_generated/dataModel';

const { width } = Dimensions.get('window');

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getStoreGroups = useCartStore((state) => state.getStoreGroups);
  const updateQuantity = useCartStore((state) => state.updateQuantity);
  const removeItem = useCartStore((state) => state.removeItem);
  const clearCart = useCartStore((state) => state.clearCart);

  const storeGroups = useMemo(() => getStoreGroups(), [getStoreGroups]);
  const totalPrice = useMemo(() => getTotalPrice(), [getTotalPrice]);

  const handleQuantityChange = useCallback((productId: Id<'products'>, storeId: Id<'stores'>, newQuantity: number) => {
    if (newQuantity <= 0) {
      Alert.alert(
        'Remove Item',
        'Do you want to remove this item from your cart?',
        [
          { text: 'Cancel', style: 'cancel' },
          { text: 'Remove', style: 'destructive', onPress: () => removeItem(productId, storeId) },
        ]
      );
    } else {
      updateQuantity(productId, storeId, newQuantity);
    }
  }, [updateQuantity, removeItem]);

  const handleRemoveItem = useCallback((productId: Id<'products'>, storeId: Id<'stores'>) => {
    Alert.alert(
      'Remove Item',
      'Do you want to remove this item from your cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Remove', style: 'destructive', onPress: () => removeItem(productId, storeId) },
      ]
    );
  }, [removeItem]);

  const handleClearCart = useCallback(() => {
    Alert.alert(
      'Clear Cart',
      'Are you sure you want to clear your entire cart?',
      [
        { text: 'Cancel', style: 'cancel' },
        { text: 'Clear', style: 'destructive', onPress: clearCart },
      ]
    );
  }, [clearCart]);

  const handleCheckout = useCallback(() => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }
    router.push('/cart/checkout');
  }, [items.length]);

  const renderCartItem = useCallback((item: any) => (
    <View key={`${item.productId}-${item.storeId}`} style={styles.cartItem}>
      <View style={styles.itemImage}>
        <Text style={styles.itemEmoji}>
          {item.product.category === 'wine' ? '🍷' : 
           item.product.category === 'cheese' ? '🧀' : '🫒'}
        </Text>
      </View>
      
      <View style={styles.itemDetails}>
        <Text style={styles.itemName} numberOfLines={2}>
          {item.product.name}
        </Text>
        <Text style={styles.itemBrand}>{item.product.brand}</Text>
        <Text style={styles.itemStore}>{item.store.name}</Text>
        <Text style={styles.itemPrice}>€{item.price.toFixed(2)}</Text>
      </View>

      <View style={styles.itemActions}>
        <View style={styles.quantityContainer}>
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.productId, item.storeId, item.quantity - 1)}
          >
            <Ionicons name="remove" size={16} color="#e74c3c" />
          </TouchableOpacity>
          
          <Text style={styles.quantityText}>{item.quantity}</Text>
          
          <TouchableOpacity
            style={styles.quantityButton}
            onPress={() => handleQuantityChange(item.productId, item.storeId, item.quantity + 1)}
          >
            <Ionicons name="add" size={16} color="#e74c3c" />
          </TouchableOpacity>
        </View>

        <TouchableOpacity
          style={styles.removeButton}
          onPress={() => handleRemoveItem(item.productId, item.storeId)}
        >
          <Ionicons name="trash-outline" size={18} color="#e74c3c" />
        </TouchableOpacity>
      </View>
    </View>
  ), [handleQuantityChange, handleRemoveItem]);

  const renderStoreSection = useCallback((storeId: string, storeItems: any[]) => {
    const store = storeItems[0]?.store;
    const storeSubtotal = storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
      <View key={storeId} style={styles.storeSection}>
        <View style={styles.storeHeader}>
          <Text style={styles.storeName}>{store?.name}</Text>
          <Text style={styles.storeSubtotal}>€{storeSubtotal.toFixed(2)}</Text>
        </View>
        
        {storeItems.map(renderCartItem)}
      </View>
    );
  }, [renderCartItem]);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container} edges={['top']}>
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#7f8c8d" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add some products to your cart to get started
          </Text>
          <TouchableOpacity 
            style={styles.continueShoppingButton}
            onPress={() => router.replace('/(tabs)')}
          >
            <Text style={styles.continueShoppingText}>Continue Shopping</Text>
          </TouchableOpacity>
        </View>
      </SafeAreaView>
    );
  }

  return (
    <SafeAreaView style={styles.container} edges={['top']}>
      <View style={styles.header}>
        <Text style={styles.headerTitle}>My Cart</Text>
        <TouchableOpacity onPress={handleClearCart}>
          <Text style={styles.clearCartText}>Clear All</Text>
        </TouchableOpacity>
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {Array.from(storeGroups.entries()).map(([storeId, storeItems]) =>
          renderStoreSection(storeId, storeItems)
        )}
      </ScrollView>

      <View style={styles.footer}>
        <View style={styles.totalContainer}>
          <Text style={styles.totalLabel}>Total ({totalItems} items)</Text>
          <Text style={styles.totalPrice}>€{totalPrice.toFixed(2)}</Text>
        </View>
        
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handleCheckout}
        >
          <Text style={styles.checkoutButtonText}>
            Proceed to Checkout
          </Text>
          <Ionicons name="arrow-forward" size={20} color="white" />
        </TouchableOpacity>
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
  clearCartText: {
    fontSize: 14,
    color: '#e74c3c',
    fontWeight: '500',
  },
  content: {
    flex: 1,
  },
  storeSection: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 10,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
  },
  storeName: {
    fontSize: 16,
    fontWeight: '600',
    color: '#2c3e50',
  },
  storeSubtotal: {
    fontSize: 16,
    fontWeight: '600',
    color: '#e74c3c',
  },
  cartItem: {
    flexDirection: 'row',
    alignItems: 'center',
    marginBottom: 15,
    paddingBottom: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#f8f9fa',
  },
  itemImage: {
    width: 60,
    height: 60,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 28,
  },
  itemDetails: {
    flex: 1,
  },
  itemName: {
    fontSize: 14,
    fontWeight: '500',
    color: '#2c3e50',
    marginBottom: 2,
  },
  itemBrand: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 2,
  },
  itemStore: {
    fontSize: 12,
    color: '#7f8c8d',
    marginBottom: 4,
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#e74c3c',
  },
  itemActions: {
    alignItems: 'flex-end',
    gap: 10,
  },
  quantityContainer: {
    flexDirection: 'row',
    alignItems: 'center',
    backgroundColor: '#f8f9fa',
    borderRadius: 8,
    paddingHorizontal: 8,
    paddingVertical: 4,
  },
  quantityButton: {
    width: 28,
    height: 28,
    borderRadius: 14,
    backgroundColor: 'white',
    justifyContent: 'center',
    alignItems: 'center',
    shadowColor: '#000',
    shadowOffset: { width: 0, height: 1 },
    shadowOpacity: 0.1,
    shadowRadius: 2,
    elevation: 2,
  },
  quantityText: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
    marginHorizontal: 12,
    minWidth: 20,
    textAlign: 'center',
  },
  removeButton: {
    width: 32,
    height: 32,
    borderRadius: 16,
    backgroundColor: '#e74c3c10',
    justifyContent: 'center',
    alignItems: 'center',
  },
  footer: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  totalContainer: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 15,
  },
  totalLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  totalPrice: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  checkoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 16,
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'center',
    gap: 8,
  },
  checkoutButtonText: {
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
    marginBottom: 20,
  },
  continueShoppingButton: {
    backgroundColor: '#e74c3c',
    paddingHorizontal: 24,
    paddingVertical: 12,
    borderRadius: 8,
  },
  continueShoppingText: {
    fontSize: 16,
    fontWeight: '600',
    color: 'white',
  },
}); 