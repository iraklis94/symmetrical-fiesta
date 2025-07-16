# GreekMarket - Product Discovery & Rating Platform

## 🍷 Overview

GreekMarket is a mobile-first iOS application that revolutionizes how Greek consumers discover, rate, and purchase premium products like wine, cheese, and olive oil. Similar to Wolt but focused on specialty Greek products, the app combines real-time product availability, user ratings, and seamless delivery options.

### Key Features
- 🗺️ **Interactive Map**: Discover nearby supermarkets and specialty stores using Mapbox
- ⭐ **Product Ratings**: Community-driven ratings for wine, cheese, and olive oil
- 🔍 **Smart Filtering**: Product-first search with intelligent filtering options
- 💳 **Seamless Payments**: Integrated Stripe payment processing
- 📊 **Real-time Data**: Live product availability and pricing through APIs
- 🚚 **Delivery Options**: Order for pickup or delivery from partnered stores

## 🏗️ Technical Stack

### Frontend
- **Framework**: Expo (React Native)
- **Platform**: iOS (initially), with Android compatibility
- **Maps**: Mapbox GL JS for React Native
- **State Management**: Zustand/Redux Toolkit
- **UI Components**: NativeWind (Tailwind CSS for React Native)

### Backend
- **Database & Backend**: Convex (Real-time, reactive backend)
- **Authentication**: Convex Auth with social logins
- **Payment Processing**: Stripe
- **File Storage**: Convex File Storage for product images

### External APIs
- **Maps**: Mapbox API
- **Product Data**: Custom integrations with Greek suppliers
- **Geocoding**: Mapbox Geocoding API
- **Reviews**: Internal system with potential Google Reviews integration

## 📱 Core Features

### 1. Product Discovery
- Browse products by category (Wine, Cheese, Olive Oil)
- Product-first selection with smart filtering
- Barcode scanning for quick product lookup
- Advanced search with filters (price, region, ratings, availability)

### 2. Interactive Map
- Real-time store locations
- Store hours and availability status
- Distance-based sorting
- Route planning to selected stores

### 3. Rating System
- 5-star rating system
- Detailed reviews with photos
- Verified purchase badges
- Expert reviews section
- Taste profiles for wines

### 4. Shopping & Checkout
- Add to cart functionality
- Multiple store cart management
- Delivery/pickup options
- Stripe payment integration
- Order tracking

### 5. User Profiles
- Purchase history
- Favorite products
- Personal tasting notes
- Achievement badges
- Social sharing

## 🗄️ Database Schema (Convex)

```typescript
// Schema structure for Convex backend
export const schema = defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    avatar: v.optional(v.string()),
    preferences: v.object({
      favoriteCategories: v.array(v.string()),
      dietaryRestrictions: v.array(v.string()),
    }),
    createdAt: v.number(),
  }),

  products: defineTable({
    name: v.string(),
    category: v.string(), // wine, cheese, olive_oil
    subcategory: v.optional(v.string()), // red_wine, white_wine, feta, etc.
    barcode: v.optional(v.string()),
    description: v.string(),
    images: v.array(v.string()),
    origin: v.object({
      region: v.string(),
      producer: v.string(),
    }),
    specifications: v.any(), // Flexible for different product types
    createdAt: v.number(),
  }),

  stores: defineTable({
    name: v.string(),
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
      address: v.string(),
    }),
    hours: v.array(v.object({
      day: v.string(),
      open: v.string(),
      close: v.string(),
    })),
    type: v.string(), // supermarket, specialty, wine_shop
    partnered: v.boolean(),
  }),

  ratings: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    rating: v.number(),
    review: v.optional(v.string()),
    images: v.array(v.string()),
    verifiedPurchase: v.boolean(),
    createdAt: v.number(),
  }),

  inventory: defineTable({
    productId: v.id("products"),
    storeId: v.id("stores"),
    price: v.number(),
    inStock: v.boolean(),
    quantity: v.optional(v.number()),
    lastUpdated: v.number(),
  }),

  orders: defineTable({
    userId: v.id("users"),
    items: v.array(v.object({
      productId: v.id("products"),
      storeId: v.id("stores"),
      quantity: v.number(),
      price: v.number(),
    })),
    total: v.number(),
    status: v.string(),
    deliveryType: v.string(), // pickup, delivery
    paymentIntentId: v.string(),
    createdAt: v.number(),
  }),
});
```

## 🚀 Getting Started

### Prerequisites
- Node.js 18+
- Expo CLI
- iOS Simulator or physical device
- Convex account
- Stripe account
- Mapbox account

### Installation

1. Clone the repository
```bash
git clone https://github.com/yourusername/greekmarket.git
cd greekmarket
```

2. Install dependencies
```bash
npm install
```

3. Set up environment variables
```bash
cp .env.example .env
```

4. Configure your `.env` file:
```env
EXPO_PUBLIC_CONVEX_URL=your_convex_deployment_url
EXPO_PUBLIC_STRIPE_PUBLISHABLE_KEY=your_stripe_key
EXPO_PUBLIC_MAPBOX_ACCESS_TOKEN=your_mapbox_token
```

5. Initialize Convex
```bash
npx convex dev
```

6. Start the Expo development server
```bash
npx expo start
```

## 📋 Development Roadmap

### Phase 1: MVP (Months 1-2)
- [ ] Basic app structure with Expo
- [ ] Convex backend setup
- [ ] User authentication
- [ ] Product catalog (wine focus)
- [ ] Basic map integration
- [ ] Simple rating system

### Phase 2: Core Features (Months 3-4)
- [ ] Stripe payment integration
- [ ] Advanced filtering
- [ ] Store inventory integration
- [ ] Order management
- [ ] Push notifications

### Phase 3: Enhanced Experience (Months 5-6)
- [ ] Barcode scanning
- [ ] AI-powered recommendations
- [ ] Social features
- [ ] Loyalty program
- [ ] Multi-language support (Greek/English)

### Phase 4: Scale & Optimize (Months 7+)
- [ ] Android version
- [ ] Partner API integrations
- [ ] Advanced analytics
- [ ] B2B features for stores
- [ ] Subscription service for premium users

## 🔗 API Integrations

### Product Data Sources
- Greek Wine Federation API (hypothetical)
- Local supplier databases
- Manual data entry for artisanal products
- Web scraping for pricing (where permitted)

### Third-party Services
- **Mapbox**: Store locations and routing
- **Stripe**: Payment processing
- **SendGrid**: Transactional emails
- **OneSignal**: Push notifications
- **Sentry**: Error monitoring

## 🎨 UI/UX Guidelines

### Design Principles
- **Mobile-first**: Optimized for one-handed use
- **Greek aesthetic**: Mediterranean color palette
- **Speed**: Fast loading, offline capabilities
- **Accessibility**: WCAG 2.1 AA compliant

### Key Screens
1. **Home**: Featured products, nearby stores
2. **Map View**: Interactive store locator
3. **Product Detail**: Ratings, reviews, availability
4. **Category Browse**: Filter and sort options
5. **Cart**: Multi-store management
6. **Profile**: Orders, favorites, preferences

## 🔐 Security Considerations

- End-to-end encryption for payment data
- Secure API key management
- User data privacy compliance (GDPR)
- Regular security audits
- Rate limiting on API endpoints

## 📚 Additional Resources

- [Expo Documentation](https://docs.expo.dev/)
- [Convex Documentation](https://docs.convex.dev/)
- [Stripe React Native](https://stripe.com/docs/stripe-react-native)
- [Mapbox React Native](https://docs.mapbox.com/react-native/)

## 🤝 Contributing

We welcome contributions! Please see our [Contributing Guide](CONTRIBUTING.md) for details.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details. 