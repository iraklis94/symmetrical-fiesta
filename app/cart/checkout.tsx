import React, { useState, useCallback, useMemo } from 'react';
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

const { width } = Dimensions.get('window');

const DELIVERY_OPTIONS = [
  { id: 'delivery', label: 'Home Delivery', icon: 'car-outline', price: 3.99 },
  { id: 'pickup', label: 'Store Pickup', icon: 'bag-outline', price: 0 },
];

const PAYMENT_METHODS = [
  { id: 'card', label: 'Credit/Debit Card', icon: 'card-outline' },
  { id: 'paypal', label: 'PayPal', icon: 'logo-paypal' },
  { id: 'apple_pay', label: 'Apple Pay', icon: 'logo-apple' },
];

export default function CheckoutScreen() {
  const [selectedDelivery, setSelectedDelivery] = useState('delivery');
  const [selectedPayment, setSelectedPayment] = useState('card');
  
  const items = useCartStore((state) => state.items);
  const getTotalPrice = useCartStore((state) => state.getTotalPrice);
  const getStoreGroups = useCartStore((state) => state.getStoreGroups);
  const clearCart = useCartStore((state) => state.clearCart);

  const storeGroups = useMemo(() => getStoreGroups(), [getStoreGroups]);
  const subtotal = useMemo(() => getTotalPrice(), [getTotalPrice]);
  const deliveryFee = useMemo(() => 
    selectedDelivery === 'delivery' ? 3.99 : 0, [selectedDelivery]
  );
  const total = useMemo(() => subtotal + deliveryFee, [subtotal, deliveryFee]);

  const handlePlaceOrder = useCallback(() => {
    if (items.length === 0) {
      Alert.alert('Empty Cart', 'Please add items to your cart before checkout');
      return;
    }

    Alert.alert(
      'Confirm Order',
      `Total: €${total.toFixed(2)}\n\nProceed with payment?`,
      [
        { text: 'Cancel', style: 'cancel' },
        {
          text: 'Confirm',
          onPress: () => {
            // Here you would integrate with Stripe or other payment processor
            Alert.alert(
              'Order Placed!',
              'Your order has been successfully placed. You will receive a confirmation email shortly.',
              [
                {
                  text: 'OK',
                  onPress: () => {
                    clearCart();
                    router.replace('/(tabs)');
                  },
                },
              ]
            );
          },
        },
      ]
    );
  }, [items.length, total, clearCart]);

  const renderStoreSection = useCallback((storeId: string, storeItems: any[]) => {
    const store = storeItems[0]?.store;
    const storeSubtotal = storeItems.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return (
      <View key={storeId} style={styles.storeSection}>
        <View style={styles.storeHeader}>
          <Text style={styles.storeName}>{store?.name}</Text>
          <Text style={styles.storeSubtotal}>€{storeSubtotal.toFixed(2)}</Text>
        </View>
        
        {storeItems.map((item) => (
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
              <Text style={styles.itemQuantity}>Qty: {item.quantity}</Text>
            </View>
            <Text style={styles.itemPrice}>€{(item.price * item.quantity).toFixed(2)}</Text>
          </View>
        ))}
      </View>
    );
  }, []);

  const renderDeliveryOption = useCallback(({ item }: { item: typeof DELIVERY_OPTIONS[0] }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.deliveryOption,
        selectedDelivery === item.id && styles.deliveryOptionActive
      ]}
      onPress={() => setSelectedDelivery(item.id)}
    >
      <View style={styles.deliveryOptionContent}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={selectedDelivery === item.id ? '#e74c3c' : '#7f8c8d'} 
        />
        <View style={styles.deliveryOptionText}>
          <Text style={[
            styles.deliveryOptionLabel,
            selectedDelivery === item.id && styles.deliveryOptionLabelActive
          ]}>
            {item.label}
          </Text>
          <Text style={styles.deliveryOptionPrice}>
            {item.price > 0 ? `€${item.price.toFixed(2)}` : 'Free'}
          </Text>
        </View>
      </View>
      {selectedDelivery === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#e74c3c" />
      )}
    </TouchableOpacity>
  ), [selectedDelivery]);

  const renderPaymentMethod = useCallback(({ item }: { item: typeof PAYMENT_METHODS[0] }) => (
    <TouchableOpacity
      key={item.id}
      style={[
        styles.paymentMethod,
        selectedPayment === item.id && styles.paymentMethodActive
      ]}
      onPress={() => setSelectedPayment(item.id)}
    >
      <View style={styles.paymentMethodContent}>
        <Ionicons 
          name={item.icon as any} 
          size={24} 
          color={selectedPayment === item.id ? '#e74c3c' : '#7f8c8d'} 
        />
        <Text style={[
          styles.paymentMethodLabel,
          selectedPayment === item.id && styles.paymentMethodLabelActive
        ]}>
          {item.label}
        </Text>
      </View>
      {selectedPayment === item.id && (
        <Ionicons name="checkmark-circle" size={24} color="#e74c3c" />
      )}
    </TouchableOpacity>
  ), [selectedPayment]);

  if (items.length === 0) {
    return (
      <SafeAreaView style={styles.container}>
        <View style={styles.header}>
          <TouchableOpacity onPress={() => router.back()}>
            <Ionicons name="arrow-back" size={24} color="#2c3e50" />
          </TouchableOpacity>
          <Text style={styles.headerTitle}>Checkout</Text>
          <View style={{ width: 24 }} />
        </View>
        
        <View style={styles.emptyContainer}>
          <Ionicons name="cart-outline" size={80} color="#7f8c8d" />
          <Text style={styles.emptyTitle}>Your cart is empty</Text>
          <Text style={styles.emptyText}>
            Add some products to your cart to proceed with checkout
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
        <TouchableOpacity onPress={() => router.back()}>
          <Ionicons name="arrow-back" size={24} color="#2c3e50" />
        </TouchableOpacity>
        <Text style={styles.headerTitle}>Checkout</Text>
        <View style={{ width: 24 }} />
      </View>

      <ScrollView style={styles.content} showsVerticalScrollIndicator={false}>
        {/* Order Summary */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Summary</Text>
          {Array.from(storeGroups.entries()).map(([storeId, storeItems]) =>
            renderStoreSection(storeId, storeItems)
          )}
        </View>

        {/* Delivery Options */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Delivery Method</Text>
          {DELIVERY_OPTIONS.map(item => renderDeliveryOption({ item }))}
        </View>

        {/* Payment Method */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Payment Method</Text>
          {PAYMENT_METHODS.map(item => renderPaymentMethod({ item }))}
        </View>

        {/* Order Total */}
        <View style={styles.section}>
          <Text style={styles.sectionTitle}>Order Total</Text>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Subtotal</Text>
            <Text style={styles.totalValue}>€{subtotal.toFixed(2)}</Text>
          </View>
          <View style={styles.totalRow}>
            <Text style={styles.totalLabel}>Delivery Fee</Text>
            <Text style={styles.totalValue}>€{deliveryFee.toFixed(2)}</Text>
          </View>
          <View style={[styles.totalRow, styles.finalTotal]}>
            <Text style={styles.finalTotalLabel}>Total</Text>
            <Text style={styles.finalTotalValue}>€{total.toFixed(2)}</Text>
          </View>
        </View>
      </ScrollView>

      {/* Checkout Button */}
      <View style={styles.checkoutFooter}>
        <TouchableOpacity 
          style={styles.checkoutButton}
          onPress={handlePlaceOrder}
        >
          <Text style={styles.checkoutButtonText}>
            Place Order • €{total.toFixed(2)}
          </Text>
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
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderBottomWidth: 1,
    borderBottomColor: '#ecf0f1',
    backgroundColor: 'white',
  },
  headerTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  content: {
    flex: 1,
  },
  section: {
    backgroundColor: 'white',
    marginTop: 10,
    paddingHorizontal: 20,
    paddingVertical: 15,
  },
  sectionTitle: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
    marginBottom: 15,
  },
  storeSection: {
    marginBottom: 20,
  },
  storeHeader: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
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
  },
  itemImage: {
    width: 50,
    height: 50,
    borderRadius: 8,
    backgroundColor: '#f8f9fa',
    justifyContent: 'center',
    alignItems: 'center',
    marginRight: 12,
  },
  itemEmoji: {
    fontSize: 24,
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
  itemQuantity: {
    fontSize: 12,
    color: '#7f8c8d',
  },
  itemPrice: {
    fontSize: 14,
    fontWeight: '600',
    color: '#2c3e50',
  },
  deliveryOption: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    marginBottom: 10,
  },
  deliveryOptionActive: {
    borderColor: '#e74c3c',
    backgroundColor: '#e74c3c10',
  },
  deliveryOptionContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  deliveryOptionText: {
    marginLeft: 12,
  },
  deliveryOptionLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
  },
  deliveryOptionLabelActive: {
    color: '#e74c3c',
  },
  deliveryOptionPrice: {
    fontSize: 14,
    color: '#7f8c8d',
    marginTop: 2,
  },
  paymentMethod: {
    flexDirection: 'row',
    alignItems: 'center',
    justifyContent: 'space-between',
    paddingVertical: 15,
    paddingHorizontal: 15,
    borderRadius: 10,
    borderWidth: 1,
    borderColor: '#ecf0f1',
    marginBottom: 10,
  },
  paymentMethodActive: {
    borderColor: '#e74c3c',
    backgroundColor: '#e74c3c10',
  },
  paymentMethodContent: {
    flexDirection: 'row',
    alignItems: 'center',
  },
  paymentMethodLabel: {
    fontSize: 16,
    fontWeight: '500',
    color: '#2c3e50',
    marginLeft: 12,
  },
  paymentMethodLabelActive: {
    color: '#e74c3c',
  },
  totalRow: {
    flexDirection: 'row',
    justifyContent: 'space-between',
    alignItems: 'center',
    marginBottom: 10,
  },
  totalLabel: {
    fontSize: 16,
    color: '#7f8c8d',
  },
  totalValue: {
    fontSize: 16,
    color: '#2c3e50',
  },
  finalTotal: {
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
    paddingTop: 10,
    marginTop: 10,
  },
  finalTotalLabel: {
    fontSize: 18,
    fontWeight: '600',
    color: '#2c3e50',
  },
  finalTotalValue: {
    fontSize: 18,
    fontWeight: '600',
    color: '#e74c3c',
  },
  checkoutFooter: {
    backgroundColor: 'white',
    paddingHorizontal: 20,
    paddingVertical: 15,
    borderTopWidth: 1,
    borderTopColor: '#ecf0f1',
  },
  checkoutButton: {
    backgroundColor: '#e74c3c',
    borderRadius: 10,
    paddingVertical: 16,
    alignItems: 'center',
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