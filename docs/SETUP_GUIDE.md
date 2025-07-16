# Setup Guide - GreekMarket

## Prerequisites

Before starting, ensure you have the following installed:

- **Node.js** (v18.0.0 or higher)
- **npm** or **yarn**
- **Git**
- **Xcode** (for iOS development)
- **iOS Simulator** or physical iOS device
- **VS Code** or preferred IDE

## Account Setup

### 1. Expo Account
```bash
# Install Expo CLI globally
npm install -g expo-cli eas-cli

# Create Expo account
expo register

# Login to Expo
expo login
```

### 2. Convex Setup
1. Visit [convex.dev](https://convex.dev) and create an account
2. Create a new project named "greekmarket"
3. Note your deployment URL

### 3. Mapbox Setup
1. Create account at [mapbox.com](https://mapbox.com)
2. Generate an access token
3. Enable the following APIs:
   - Maps SDK for iOS
   - Navigation SDK
   - Geocoding API

### 4. Stripe Setup
1. Create account at [stripe.com](https://stripe.com)
2. Get your publishable key and secret key
3. Set up webhook endpoint (we'll configure this later)

## Project Setup

### 1. Clone and Install

```bash
# Clone the repository
git clone https://github.com/yourusername/greekmarket.git
cd greekmarket

# Install dependencies
npm install

# Install iOS dependencies
cd ios && pod install && cd ..
```

### 2. Environment Configuration

Create a `.env` file in the root directory:

```env
# Expo
EXPO_PUBLIC_API_URL=http://localhost:3000

# Convex
EXPO_PUBLIC_CONVEX_URL=https://your-project.convex.cloud
CONVEX_DEPLOY_KEY=your-deploy-key

# Mapbox
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your-mapbox-token

# Stripe
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=pk_test_your-key
STRIPE_SECRET_KEY=sk_test_your-key
STRIPE_WEBHOOK_SECRET=whsec_your-webhook-secret

# Optional: External APIs
GREEK_WINE_API_KEY=your-api-key
OPENFOODFACTS_API_KEY=your-api-key
```

### 3. Convex Setup

```bash
# Install Convex CLI
npm install -g convex

# Initialize Convex (choose existing project)
npx convex init

# Deploy the schema
npx convex deploy

# Start Convex dev server
npx convex dev
```

### 4. Database Seed (Optional)

```bash
# Run seed script to populate sample data
npm run seed
```

## Running the App

### Development Mode

```bash
# Terminal 1: Start Convex
npx convex dev

# Terminal 2: Start Expo
npx expo start

# Press 'i' for iOS simulator
# Or scan QR code with Expo Go app
```

### iOS Simulator Setup

1. Open Xcode → Preferences → Locations
2. Ensure Command Line Tools is set
3. Open Simulator app
4. Device → iOS → Choose device (iPhone 14 Pro recommended)

### Physical Device Setup

1. Install Expo Go from App Store
2. Connect to same network as development machine
3. Scan QR code from terminal

## Project Structure

```
greekmarket/
├── app/                    # Expo Router pages
│   ├── (auth)/            # Authentication screens
│   ├── (tabs)/            # Main tab screens
│   └── _layout.tsx        # Root layout
├── components/            # Reusable components
├── hooks/                 # Custom React hooks
├── utils/                 # Utility functions
├── stores/                # State management
├── services/              # API services
├── constants/             # App constants
├── assets/                # Images, fonts, etc.
├── convex/                # Backend functions
│   ├── schema.ts          # Database schema
│   ├── auth.ts            # Authentication
│   └── functions/         # API functions
└── scripts/               # Build & utility scripts
```

## Common Development Tasks

### Adding a New Screen

```bash
# Create new file in app directory
touch app/wine/[id].tsx
```

```typescript
// app/wine/[id].tsx
import { Stack, useLocalSearchParams } from 'expo-router';
import { Text, View } from 'react-native';

export default function WineDetail() {
  const { id } = useLocalSearchParams();
  
  return (
    <>
      <Stack.Screen options={{ title: 'Wine Details' }} />
      <View>
        <Text>Wine ID: {id}</Text>
      </View>
    </>
  );
}
```

### Adding Convex Functions

```typescript
// convex/products.ts
import { query, mutation } from "./_generated/server";
import { v } from "convex/values";

export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    return await ctx.db.get(args.id);
  },
});
```

### Using Convex in Components

```typescript
// components/ProductList.tsx
import { useQuery } from "convex/react";
import { api } from "../convex/_generated/api";

export function ProductList() {
  const products = useQuery(api.products.list);
  
  if (!products) return <Loading />;
  
  return (
    <FlatList
      data={products}
      renderItem={({ item }) => <ProductCard product={item} />}
    />
  );
}
```

## Testing

### Unit Tests

```bash
# Run all tests
npm test

# Run tests in watch mode
npm test -- --watch

# Run tests with coverage
npm test -- --coverage
```

### E2E Tests (Detox)

```bash
# Build for testing
detox build -c ios.sim.debug

# Run tests
detox test -c ios.sim.debug
```

## Troubleshooting

### Common Issues

1. **Metro bundler issues**
   ```bash
   # Clear cache
   npx expo start -c
   ```

2. **iOS build failures**
   ```bash
   # Clean build
   cd ios && xcodebuild clean && cd ..
   # Reset pods
   cd ios && pod deintegrate && pod install && cd ..
   ```

3. **Convex connection issues**
   - Check that Convex dev server is running
   - Verify CONVEX_URL in .env
   - Check network connectivity

4. **Mapbox not rendering**
   - Verify access token is valid
   - Check iOS Info.plist has required permissions
   - Ensure location services are enabled

### Debug Tools

1. **React Native Debugger**
   - Download from [GitHub](https://github.com/jhen0409/react-native-debugger)
   - Enable from Dev Menu

2. **Expo Developer Tools**
   - Automatically opens in browser
   - Shows logs, device info, etc.

3. **Convex Dashboard**
   - View real-time data
   - Monitor function logs
   - Test functions directly

## Deployment Preparation

### iOS App Store

1. **Apple Developer Account**
   - Enroll at developer.apple.com ($99/year)
   - Create App ID and provisioning profiles

2. **Build Configuration**
   ```bash
   # Configure EAS Build
   eas build:configure
   
   # Build for App Store
   eas build --platform ios --profile production
   ```

3. **App Store Connect**
   - Create app listing
   - Upload screenshots
   - Submit for review

### Backend Deployment

1. **Convex Production**
   ```bash
   # Deploy to production
   npx convex deploy --prod
   ```

2. **Environment Variables**
   - Set production values in Convex dashboard
   - Update Stripe webhooks to production URL

## Additional Resources

- [Expo Documentation](https://docs.expo.dev)
- [Convex Documentation](https://docs.convex.dev)
- [React Native Documentation](https://reactnative.dev)
- [Mapbox React Native](https://github.com/rnmapbox/maps)
- [Stripe React Native](https://stripe.com/docs/stripe-react-native)

## Support

- **Discord**: Join our developer community
- **GitHub Issues**: Report bugs and request features
- **Email**: dev@greekmarket.gr 