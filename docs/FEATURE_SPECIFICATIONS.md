# Feature Specifications - GreekMarket

## Core User Flows

### 1. Product-First Discovery Flow
Users select product type before seeing filtering options:

```
Home → Category Selection → Product Type → Filters → Results → Details → Cart
```

#### Category Breakdown:
- **Wine**: Red, White, Rosé, Sparkling, Dessert
- **Cheese**: Feta, Kasseri, Graviera, Kefalotiri, Manouri  
- **Olive Oil**: Extra Virgin, Virgin, Organic, PDO

### 2. Map-Based Shopping

#### Features:
- Real-time store locations with Mapbox
- Color-coded availability indicators
- Multi-stop route optimization
- Store hours & distance display
- Filter by store type (supermarket, specialty, wine shop)

#### Store Information Display:
```typescript
interface StoreInfo {
  name: string;
  type: 'supermarket' | 'specialty' | 'wine_shop';
  distance: number; // km from user
  availability: Map<productId, boolean>;
  rating: number;
  deliveryOptions: ['pickup', 'delivery'];
  estimatedWait: number; // minutes
}
```

### 3. Rating & Review System

#### General Rating Features:
- 5-star rating system
- Written reviews with photo uploads
- Verified purchase badges
- Helpful/unhelpful voting

#### Wine-Specific Ratings:
- Tasting notes (body, sweetness, acidity, tannins)
- Aroma profiles
- Food pairing suggestions
- Serving temperature recommendations

#### Cheese & Olive Oil Ratings:
- Texture descriptions
- Usage recommendations
- Recipe suggestions

## Key Features

### Smart Search & Filters

1. **Barcode Scanning**
   - Quick product lookup
   - Add unknown products
   - Price comparison

2. **Voice Search** (Greek & English)
   - Natural language processing
   - "Find me a dry red wine under €15"

3. **Advanced Filters**
   - Price range
   - Ratings (minimum stars)
   - Distance from location
   - Availability (in stock, delivery today)
   - Product-specific filters (vintage, region, etc.)

### Shopping Cart

#### Multi-Store Management:
- Separate mini-carts per store
- Combined checkout option
- Delivery fee optimization
- Mixed pickup/delivery options

#### Smart Features:
- Save cart for later
- Reorder previous purchases
- Share cart with others
- Price drop notifications

### Checkout & Payment

#### Payment Methods:
- Credit/Debit cards (via Stripe)
- Apple Pay
- Google Pay
- Cash on delivery
- Store credit/loyalty points

#### Delivery Options:
1. **Express Delivery** (< 2 hours)
2. **Same Day Delivery**
3. **Scheduled Delivery**
4. **Store Pickup**
5. **Combined Delivery** (multiple stores)

### User Profiles

#### Personalization:
- Taste preferences learning
- Purchase history
- Favorite products/stores
- Custom lists (e.g., "Summer Wines")
- Dietary restrictions

#### Achievements & Loyalty:
- Points system (1 point per €1)
- Bonus multipliers for local/organic products
- Achievement badges
- Tier benefits (Bronze, Silver, Gold)

## Technical Specifications

### Real-time Features

1. **Live Inventory Updates**
   ```typescript
   // Subscribe to product availability
   const subscription = convex.subscribe(
     'inventory:updates',
     { productIds, storeIds },
     (updates) => updateLocalInventory(updates)
   );
   ```

2. **Order Tracking**
   - Real-time driver location
   - ETA updates
   - Order status changes
   - Push notifications

3. **Price Monitoring**
   - Price drop alerts
   - Flash sale notifications
   - Dynamic pricing display

### Offline Capabilities

1. **Cached Data**:
   - Product catalog
   - Store locations
   - User favorites
   - Recent searches

2. **Offline Actions**:
   - Browse products
   - Add to cart
   - View order history
   - Read reviews

3. **Sync on Connection**:
   - Upload pending reviews
   - Sync cart changes
   - Update favorites

### Performance Optimizations

1. **Image Loading**:
   - Progressive loading
   - WebP format with fallbacks
   - Thumbnail placeholders
   - CDN distribution

2. **Data Fetching**:
   - Pagination (20 items default)
   - Lazy loading
   - Prefetching next page
   - Search debouncing

3. **Caching Strategy**:
   - 1-hour cache for product data
   - 24-hour cache for store info
   - Permanent cache for user data
   - Smart cache invalidation

## Partner Features

### Store Management Portal

1. **Inventory Management**:
   - Real-time stock updates
   - Bulk import/export
   - Low stock alerts
   - Automated reordering

2. **Order Processing**:
   - New order notifications
   - Accept/reject orders
   - Update order status
   - Print order labels

3. **Analytics Dashboard**:
   - Sales metrics
   - Popular products
   - Customer insights
   - Revenue tracking

### Promotional Tools

1. **Discounts & Offers**:
   - Percentage/fixed discounts
   - BOGO deals
   - Time-limited flash sales
   - Customer segment targeting

2. **Featured Listings**:
   - Homepage placement
   - Category highlights
   - Search boost
   - Map prominence

## Compliance & Security

### Data Protection
- GDPR compliant
- Encrypted sensitive data
- Secure payment processing (PCI DSS)
- Regular security audits

### Content Moderation
- Review flagging system
- Automated spam detection
- Manual review queue
- Community guidelines

### Age Verification
- Age gate for wine purchases
- ID verification for delivery
- Parental controls
- Responsible messaging 