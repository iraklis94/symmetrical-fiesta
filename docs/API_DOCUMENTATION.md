# API Documentation - GreekMarket

## Overview

This document outlines all API endpoints, external integrations, and data flows for the GreekMarket application.

## Table of Contents
1. [Convex Functions](#convex-functions)
2. [External API Integrations](#external-api-integrations)
3. [Authentication Flow](#authentication-flow)
4. [Real-time Subscriptions](#real-time-subscriptions)

## Convex Functions

### User Management

#### `createUser`
Creates a new user account
```typescript
export const createUser = mutation({
  args: {
    email: v.string(),
    name: v.string(),
    authProvider: v.string(),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

#### `updateUserPreferences`
Updates user preferences and settings
```typescript
export const updateUserPreferences = mutation({
  args: {
    userId: v.id("users"),
    preferences: v.object({
      favoriteCategories: v.array(v.string()),
      dietaryRestrictions: v.array(v.string()),
      notificationSettings: v.object({
        orderUpdates: v.boolean(),
        promotions: v.boolean(),
        newProducts: v.boolean(),
      }),
    }),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

### Product Management

#### `searchProducts`
Search and filter products
```typescript
export const searchProducts = query({
  args: {
    searchTerm: v.optional(v.string()),
    category: v.optional(v.string()),
    filters: v.optional(v.object({
      priceRange: v.object({
        min: v.number(),
        max: v.number(),
      }),
      rating: v.optional(v.number()),
      origin: v.optional(v.string()),
      inStock: v.optional(v.boolean()),
    })),
    pagination: v.object({
      limit: v.number(),
      cursor: v.optional(v.string()),
    }),
  },
  handler: async (ctx, args) => {
    // Implementation with full-text search
  },
});
```

#### `getProductDetails`
Get detailed product information
```typescript
export const getProductDetails = query({
  args: {
    productId: v.id("products"),
    includeInventory: v.optional(v.boolean()),
    userLocation: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Returns product with ratings, reviews, and nearby availability
  },
});
```

#### `scanBarcode`
Look up product by barcode
```typescript
export const scanBarcode = query({
  args: {
    barcode: v.string(),
  },
  handler: async (ctx, args) => {
    // Implementation
  },
});
```

### Store Management

#### `getNearbyStores`
Find stores near user location
```typescript
export const getNearbyStores = query({
  args: {
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    radius: v.number(), // in kilometers
    storeType: v.optional(v.string()),
    onlyPartnered: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Returns stores sorted by distance
  },
});
```

#### `getStoreInventory`
Get product availability for a specific store
```typescript
export const getStoreInventory = query({
  args: {
    storeId: v.id("stores"),
    category: v.optional(v.string()),
    inStockOnly: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Returns products available at the store
  },
});
```

### Rating & Review System

#### `submitRating`
Submit a product rating
```typescript
export const submitRating = mutation({
  args: {
    productId: v.id("products"),
    rating: v.number(), // 1-5
    review: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
    tastingNotes: v.optional(v.object({
      // Wine-specific
      body: v.optional(v.number()), // 1-5
      sweetness: v.optional(v.number()), // 1-5
      acidity: v.optional(v.number()), // 1-5
      tannins: v.optional(v.number()), // 1-5
    })),
  },
  handler: async (ctx, args) => {
    // Verify purchase before allowing rating
  },
});
```

#### `getRatings`
Get ratings for a product
```typescript
export const getRatings = query({
  args: {
    productId: v.id("products"),
    sortBy: v.optional(v.string()), // recent, helpful, rating
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Returns paginated ratings
  },
});
```

### Order Management

#### `createOrder`
Create a new order
```typescript
export const createOrder = mutation({
  args: {
    items: v.array(v.object({
      productId: v.id("products"),
      storeId: v.id("stores"),
      quantity: v.number(),
    })),
    deliveryType: v.string(), // pickup, delivery
    deliveryAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      postalCode: v.string(),
      coordinates: v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
    })),
    scheduledTime: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    // Creates order and initiates Stripe payment
  },
});
```

#### `updateOrderStatus`
Update order status (webhook from delivery service)
```typescript
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
    trackingInfo: v.optional(v.object({
      driverLocation: v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
      estimatedArrival: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Updates order and sends notifications
  },
});
```

## External API Integrations

### Mapbox Integration

#### Configuration
```javascript
// mapbox.config.js
export const MAPBOX_CONFIG = {
  accessToken: process.env.EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN,
  styles: {
    streets: 'mapbox://styles/mapbox/streets-v11',
    light: 'mapbox://styles/mapbox/light-v10',
  },
  defaultCenter: {
    // Athens, Greece
    longitude: 23.7275,
    latitude: 37.9838,
  },
};
```

#### Geocoding API
```javascript
// Get coordinates from address
const geocodeAddress = async (address) => {
  const response = await fetch(
    `https://api.mapbox.com/geocoding/v5/mapbox.places/${encodeURIComponent(
      address
    )}.json?access_token=${MAPBOX_CONFIG.accessToken}&country=GR`
  );
  return response.json();
};
```

#### Directions API
```javascript
// Get route between points
const getRoute = async (start, end) => {
  const response = await fetch(
    `https://api.mapbox.com/directions/v5/mapbox/driving/${start.longitude},${start.latitude};${end.longitude},${end.latitude}?access_token=${MAPBOX_CONFIG.accessToken}&geometries=geojson`
  );
  return response.json();
};
```

### Stripe Integration

#### Payment Intent Creation
```javascript
// Backend function to create payment intent
export const createPaymentIntent = action({
  args: {
    amount: v.number(), // in cents
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
    
    const paymentIntent = await stripe.paymentIntents.create({
      amount: args.amount,
      currency: 'eur',
      metadata: {
        orderId: args.orderId,
      },
      payment_method_types: ['card'],
    });
    
    return {
      clientSecret: paymentIntent.client_secret,
    };
  },
});
```

#### Webhook Handler
```javascript
// Handle Stripe webhooks
export const handleStripeWebhook = httpAction(async (ctx, request) => {
  const stripe = new Stripe(process.env.STRIPE_SECRET_KEY);
  const sig = request.headers.get('stripe-signature');
  
  const event = stripe.webhooks.constructEvent(
    await request.text(),
    sig,
    process.env.STRIPE_WEBHOOK_SECRET
  );
  
  switch (event.type) {
    case 'payment_intent.succeeded':
      // Update order status
      break;
    case 'payment_intent.payment_failed':
      // Handle failed payment
      break;
  }
  
  return new Response(null, { status: 200 });
});
```

### Product Data APIs

#### Greek Wine API (Example)
```javascript
// Fetch wine data from external API
const fetchWineData = async (query) => {
  const response = await fetch(
    `https://api.greekwines.gr/v1/products?search=${query}`,
    {
      headers: {
        'X-API-Key': process.env.GREEK_WINE_API_KEY,
      },
    }
  );
  return response.json();
};
```

#### Barcode Lookup Service
```javascript
// OpenFoodFacts API for product data
const lookupBarcode = async (barcode) => {
  const response = await fetch(
    `https://world.openfoodfacts.org/api/v0/product/${barcode}.json`
  );
  const data = await response.json();
  
  if (data.status === 1) {
    return {
      name: data.product.product_name,
      brand: data.product.brands,
      image: data.product.image_url,
      ingredients: data.product.ingredients_text,
    };
  }
  return null;
};
```

## Authentication Flow

### Social Login Implementation
```javascript
// Convex Auth configuration
export const { auth, signIn, signOut, store } = convexAuth({
  providers: [
    // Google OAuth
    GoogleOAuth({
      clientId: process.env.GOOGLE_CLIENT_ID,
      clientSecret: process.env.GOOGLE_CLIENT_SECRET,
    }),
    // Apple Sign In
    AppleOAuth({
      clientId: process.env.APPLE_CLIENT_ID,
      teamId: process.env.APPLE_TEAM_ID,
      keyId: process.env.APPLE_KEY_ID,
      privateKey: process.env.APPLE_PRIVATE_KEY,
    }),
    // Email/Password
    Password(),
  ],
});
```

### JWT Token Management
```javascript
// Token refresh logic
export const refreshToken = action({
  args: {
    refreshToken: v.string(),
  },
  handler: async (ctx, args) => {
    // Validate and refresh JWT
  },
});
```

## Real-time Subscriptions

### Order Tracking
```javascript
// Subscribe to order updates
export const subscribeToOrder = subscription({
  args: {
    orderId: v.id("orders"),
  },
  handler: async (ctx, args) => {
    // Real-time order status updates
  },
});
```

### Inventory Updates
```javascript
// Subscribe to product availability changes
export const subscribeToInventory = subscription({
  args: {
    productIds: v.array(v.id("products")),
    storeId: v.optional(v.id("stores")),
  },
  handler: async (ctx, args) => {
    // Real-time stock updates
  },
});
```

### Live Ratings
```javascript
// Subscribe to new ratings for a product
export const subscribeToRatings = subscription({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    // Stream new ratings as they come in
  },
});
```

## Error Handling

### Standard Error Response Format
```typescript
interface ApiError {
  code: string;
  message: string;
  details?: any;
  timestamp: number;
}

// Error codes
export const ERROR_CODES = {
  PRODUCT_NOT_FOUND: 'PRODUCT_NOT_FOUND',
  STORE_NOT_FOUND: 'STORE_NOT_FOUND',
  INSUFFICIENT_STOCK: 'INSUFFICIENT_STOCK',
  PAYMENT_FAILED: 'PAYMENT_FAILED',
  INVALID_LOCATION: 'INVALID_LOCATION',
  UNAUTHORIZED: 'UNAUTHORIZED',
  RATE_LIMIT_EXCEEDED: 'RATE_LIMIT_EXCEEDED',
};
```

## Rate Limiting

### API Rate Limits
- Anonymous users: 100 requests/hour
- Authenticated users: 1000 requests/hour
- Store partners: 5000 requests/hour

### Implementation
```javascript
export const rateLimit = {
  windowMs: 60 * 60 * 1000, // 1 hour
  max: (req) => {
    if (req.user?.role === 'partner') return 5000;
    if (req.user) return 1000;
    return 100;
  },
};
``` 