import React from 'react';
import { View, Text, StyleSheet } from 'react-native';
import { SafeAreaView } from 'react-native-safe-area-context';
import { useCartStore } from '../../src/stores/cartStore';

export default function CartScreen() {
  const items = useCartStore((state) => state.items);
  const totalItems = useCartStore((state) => state.getTotalItems());

  return (
    <SafeAreaView style={styles.container}>
      <View style={styles.content}>
        <Text style={styles.title}>Shopping Cart</Text>
        <Text style={styles.subtitle}>
          {totalItems > 0 
            ? `You have ${totalItems} items in your cart`
            : 'Your cart is empty'}
        </Text>
      </View>
    </SafeAreaView>
  );
}

const styles = StyleSheet.create({
  container: {
    flex: 1,
    backgroundColor: '#f8f9fa',
  },
  content: {
    flex: 1,
    justifyContent: 'center',
    alignItems: 'center',
    padding: 20,
  },
  title: {
    fontSize: 24,
    fontWeight: 'bold',
    color: '#2c3e50',
    marginBottom: 10,
  },
  subtitle: {
    fontSize: 16,
    color: '#7f8c8d',
  },
}); 