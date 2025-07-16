import { useEffect, useState } from 'react';
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

// Prevent the splash screen from auto-hiding
SplashScreen.preventAutoHideAsync();

const convexUrl = Constants.expoConfig?.extra?.EXPO_PUBLIC_CONVEX_URL || 'https://empty-salamander-555.convex.cloud';
const stripeKey = Constants.expoConfig?.extra?.EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY || 'pk_test_placeholder';

const convex = new ConvexReactClient(convexUrl);
const queryClient = new QueryClient();

export default function RootLayout() {
  const [appIsReady, setAppIsReady] = useState(false);

  useEffect(() => {
    async function prepare() {
      try {
        // Artificially delay for demo purposes
        await new Promise<void>(resolve => setTimeout(resolve, 1000));
      } catch (e) {
        console.warn(e);
      } finally {
        setAppIsReady(true);
        await SplashScreen.hideAsync();
      }
    }

    prepare();
  }, []);

  if (!appIsReady) {
    return null;
  }

  return (
    <ConvexProvider client={convex}>
      <QueryClientProvider client={queryClient}>
        <StripeProvider
          publishableKey={stripeKey}
          merchantIdentifier="merchant.com.greekmarket.app"
        >
          <GestureHandlerRootView style={{ flex: 1 }}>
            <SafeAreaProvider>
              <StatusBar style="dark" />
              <Stack>
                <Stack.Screen name="(tabs)" options={{ headerShown: false }} />
                <Stack.Screen name="(auth)" options={{ headerShown: false }} />
                <Stack.Screen
                  name="product/[id]"
                  options={{
                    title: 'Product Details',
                    headerBackTitle: 'Back',
                  }}
                />
                <Stack.Screen
                  name="store/[id]"
                  options={{
                    title: 'Store Details',
                    headerBackTitle: 'Back',
                  }}
                />
                <Stack.Screen
                  name="search"
                  options={{
                    title: 'Search Products',
                    presentation: 'modal',
                  }}
                />
                <Stack.Screen
                  name="cart/checkout"
                  options={{
                    title: 'Checkout',
                    presentation: 'modal',
                  }}
                />
              </Stack>
              <Toast />
            </SafeAreaProvider>
          </GestureHandlerRootView>
        </StripeProvider>
      </QueryClientProvider>
    </ConvexProvider>
  );
} 