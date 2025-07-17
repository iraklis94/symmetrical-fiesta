import { create } from 'zustand';
import { persist, createJSONStorage } from 'zustand/middleware';
import AsyncStorage from '@react-native-async-storage/async-storage';
import { Doc, Id } from '../../convex/_generated/dataModel';
import { useConvex } from 'convex/react';
import { api } from '../../convex/_generated/api';

export interface CartItem {
  productId: Id<'products'>;
  storeId: Id<'stores'>;
  product: Doc<'products'>;
  store: Doc<'stores'>;
  quantity: number;
  price: number;
  notes?: string;
}

interface CartStore {
  items: CartItem[];
  addItem: (item: Omit<CartItem, 'notes'> & { notes?: string }) => void;
  removeItem: (productId: Id<'products'>, storeId: Id<'stores'>) => void;
  updateQuantity: (productId: Id<'products'>, storeId: Id<'stores'>, quantity: number) => void;
  updateNotes: (productId: Id<'products'>, storeId: Id<'stores'>, notes: string) => void;
  clearCart: () => void;
  clearStoreItems: (storeId: Id<'stores'>) => void;
  getTotalItems: () => number;
  getTotalPrice: () => number;
  getStoreGroups: () => Map<Id<'stores'>, CartItem[]>;
  getStoreTotals: () => Map<Id<'stores'>, { subtotal: number; items: number }>;
}

export const useCartStore = create<CartStore>()(
  persist(
    (set, get) => ({
      items: [],
      
      addItem: (item) => set((state) => {
        const existingIndex = state.items.findIndex(
          (i) => i.productId === item.productId && i.storeId === item.storeId
        );
        
        if (existingIndex >= 0) {
          const newItems = [...state.items];
          newItems[existingIndex].quantity += item.quantity;
          return { items: newItems };
        }
        
        return { items: [...state.items, { ...item }] };
      }),
      
      removeItem: (productId, storeId) => set((state) => ({
        items: state.items.filter(
          (item) => !(item.productId === productId && item.storeId === storeId)
        ),
      })),
      
      updateQuantity: (productId, storeId, quantity) => set((state) => {
        if (quantity <= 0) {
          return {
            items: state.items.filter(
              (item) => !(item.productId === productId && item.storeId === storeId)
            ),
          };
        }
        
        return {
          items: state.items.map((item) =>
            item.productId === productId && item.storeId === storeId
              ? { ...item, quantity }
              : item
          ),
        };
      }),
      
      updateNotes: (productId, storeId, notes) => set((state) => ({
        items: state.items.map((item) =>
          item.productId === productId && item.storeId === storeId
            ? { ...item, notes }
            : item
        ),
      })),
      
      clearCart: () => set({ items: [] }),
      
      clearStoreItems: (storeId) => set((state) => ({
        items: state.items.filter((item) => item.storeId !== storeId),
      })),
      
      getTotalItems: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.quantity, 0);
      },
      
      getTotalPrice: () => {
        const { items } = get();
        return items.reduce((sum, item) => sum + item.price * item.quantity, 0);
      },
      
      getStoreGroups: () => {
        const { items } = get();
        const groups = new Map<Id<'stores'>, CartItem[]>();
        
        items.forEach((item) => {
          const storeItems = groups.get(item.storeId) || [];
          storeItems.push(item);
          groups.set(item.storeId, storeItems);
        });
        
        return groups;
      },
      
      getStoreTotals: () => {
        const { items } = get();
        const totals = new Map<Id<'stores'>, { subtotal: number; items: number }>();
        
        items.forEach((item) => {
          const current = totals.get(item.storeId) || { subtotal: 0, items: 0 };
          totals.set(item.storeId, {
            subtotal: current.subtotal + item.price * item.quantity,
            items: current.items + item.quantity,
          });
        });
        
        return totals;
      },
    }),
    {
      name: 'greekmarket-cart',
      storage: createJSONStorage(() => AsyncStorage),
    }
  )
); 