import { useEffect, useState, useCallback } from 'react';
import { Stack } from 'expo-router';
import { StatusBar } from 'expo-status-bar';
import { ConvexProvider, ConvexReactClient } from 'convex/react';
import { SafeAreaProvider } from 'react-native-safe-area-context';
import { GestureHandlerRootView } from 'react-native-gesture-handler';
import { StripeProvider } from '@stripe/stripe-react-native';
import Toast from 'react-native-toast-message';
import * as SplashScreen from 'expo-splash-screen';
import { QueryClient, QueryClientProvider } from '@tanstack/react-query';
import Constants from 'expo-constants';
import { ErrorBoundary } from '../src/components/ErrorBoundary';

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const convexUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_CONVEX_URL || 'https://empty-salamander-555.convex.cloud';
const stripeKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

const convex = new ConvexReactClient(convexUrl);

// Optimized QueryClient configuration
const queryClient = new QueryClient({
  defaultOptions: {
    queries: {
      staleTime: 5 * 60 * 1000, // 5 minutes
      cacheTime: 10 * 60 * 1000, // 10 minutes
      retry: (failureCount, error: any) => {
        // Don't retry on 4xx errors
        if (error?.status >= 400 && error?.status < 500) {
          return false;
        }
        return failureCount < 3;
      },
      retryDelay: (attemptIndex) => Math.min(1000 * 2 ** attemptIndex, 30000),
      refetchOnWindowFocus: false,
      refetchOnReconnect: true,
    },
    mutations: {
      retry: false,
    },
  },
});

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  const prepare = useCallback(async () => {
    try {
      // Preload critical resources
      await Promise.all([
        // Add any critical preloading here
        new Promise(resolve => setTimeout(resolve, 500)), // Reduced delay
      ]);
    } catch (e) {
      console.warn('Error during app preparation:', e);
    } finally {
      setAppIsReady(true);
      await SplashScreen.hideAsync();
    }
  }, []);

  useEffect(() => {
    prepare();
  }, [prepare]);

  if (!appIsReady) {
    return null;
  }

  return (
    <ErrorBoundary>
      <ConvexProvider client={convex}>
        <QueryClientProvider client={queryClient}>
          <StripeProvider
            publishableKey={stripeKey}
            merchantIdentifier="merchant.com.greekmarket.app"
          >
            <GestureHandlerRootView style={{ flex: 1 }}>
              <SafeAreaProvider>
                <StatusBar style="dark" />
                <Stack
                  screenOptions={{
                    headerShown: false,
                    animation: 'slide_from_right',
                  }}
                >
                  <Stack.Screen name="(tabs)" />
                  <Stack.Screen name="auth" />
                  <Stack.Screen
                    name="product/[id]"
                    options={{
                      title: 'Product Details',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="categories/[id]"
                    options={{
                      title: 'Category',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="store/[id]"
                    options={{
                      title: 'Store Details',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="search"
                    options={{
                      title: 'Search Products',
                      presentation: 'modal',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="cart/checkout"
                    options={{
                      title: 'Checkout',
                      presentation: 'modal',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="orders"
                    options={{
                      title: 'My Orders',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="favorites"
                    options={{
                      title: 'My Favorites',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="addresses"
                    options={{
                      title: 'Delivery Addresses',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="payment"
                    options={{
                      title: 'Payment Methods',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="notifications"
                    options={{
                      title: 'Notifications',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="language"
                    options={{
                      title: 'Language & Region',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="help"
                    options={{
                      title: 'Help & Support',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                  <Stack.Screen
                    name="about"
                    options={{
                      title: 'About GreekMarket',
                      headerBackTitle: 'Back',
                      headerShown: true,
                    }}
                  />
                </Stack>
                <Toast />
              </SafeAreaProvider>
            </GestureHandlerRootView>
          </StripeProvider>
        </QueryClientProvider>
      </ConvexProvider>
    </ErrorBoundary>
  );
} 