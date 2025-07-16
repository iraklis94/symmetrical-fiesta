import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get products by category
export const getProductsByCategory = query({
  args: {
    category: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const products = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", args.category))
      .filter((q) => q.eq(q.field("active"), true))
      .take(limit);
    
    return products;
  },
});

// Get featured products
export const getFeaturedProducts = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    const products = await ctx.db
      .query("products")
      .withIndex("by_featured", (q) => q.eq("featured", true))
      .filter((q) => q.eq(q.field("active"), true))
      .take(limit);
    
    return products;
  },
});

// Get product details
export const getProduct = query({
  args: { id: v.id("products") },
  handler: async (ctx, args) => {
    const product = await ctx.db.get(args.id);
    if (!product) return null;
    
    // Get average rating
    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_product", (q) => q.eq("productId", args.id))
      .collect();
    
    const avgRating = ratings.length > 0
      ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
      : 0;
    
    return {
      ...product,
      avgRating,
      ratingsCount: ratings.length,
    };
  },
});

// Search products
export const searchProducts = query({
  args: {
    searchTerm: v.string(),
    category: v.optional(v.string()),
    filters: v.optional(v.object({
      priceRange: v.optional(v.object({
        min: v.number(),
        max: v.number(),
      })),
      rating: v.optional(v.number()),
      inStock: v.optional(v.boolean()),
    })),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    
    let query = ctx.db
      .query("products")
      .withSearchIndex("search_products", (q) => 
        q.search("name", args.searchTerm)
      )
      .filter((q) => q.eq(q.field("active"), true));
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    const products = await query.take(limit);
    
    // Apply additional filters
    let filteredProducts = products;
    
    if (args.filters?.rating) {
      filteredProducts = filteredProducts.filter(p => p.avgRating >= args.filters!.rating!);
    }
    
    return filteredProducts;
  },
});

// Get products with inventory for a specific store
export const getProductsWithInventory = query({
  args: {
    storeId: v.id("stores"),
    category: v.optional(v.string()),
    onlyInStock: v.optional(v.boolean()),
  },
  handler: async (ctx, args) => {
    // Get inventory items for the store
    let inventoryQuery = ctx.db
      .query("inventory")
      .withIndex("by_store", (q) => q.eq("storeId", args.storeId));
    
    if (args.onlyInStock) {
      inventoryQuery = inventoryQuery.filter((q) => q.eq(q.field("inStock"), true));
    }
    
    const inventory = await inventoryQuery.collect();
    
    // Get products for each inventory item
    const productsWithInventory = await Promise.all(
      inventory.map(async (item) => {
        const product = await ctx.db.get(item.productId);
        if (!product || !product.active) return null;
        if (args.category && product.category !== args.category) return null;
        
        return {
          ...product,
          inventory: {
            price: item.price,
            comparePrice: item.comparePrice,
            inStock: item.inStock,
            quantity: item.quantity,
            unit: item.unit,
          },
        };
      })
    );
    
    return productsWithInventory.filter(Boolean);
  },
});

// Scan barcode
export const scanBarcode = query({
  args: { barcode: v.string() },
  handler: async (ctx, args) => {
    const product = await ctx.db
      .query("products")
      .withIndex("by_barcode", (q) => q.eq("barcode", args.barcode))
      .first();
    
    return product;
  },
});

// Get product availability across stores
export const getProductAvailability = query({
  args: {
    productId: v.id("products"),
    userLocation: v.optional(v.object({
      latitude: v.number(),
      longitude: v.number(),
    })),
  },
  handler: async (ctx, args) => {
    // Get all inventory entries for this product
    const inventory = await ctx.db
      .query("inventory")
      .withIndex("by_product", (q) => q.eq("productId", args.productId))
      .filter((q) => q.eq(q.field("inStock"), true))
      .collect();
    
    // Get store details for each inventory entry
    const availability = await Promise.all(
      inventory.map(async (item) => {
        const store = await ctx.db.get(item.storeId);
        if (!store || !store.active) return null;
        
        // Calculate distance if user location provided
        let distance: number | undefined;
        if (args.userLocation) {
          distance = calculateDistance(
            args.userLocation.latitude,
            args.userLocation.longitude,
            store.location.latitude,
            store.location.longitude
          );
        }
        
        return {
          store: {
            id: store._id,
            name: store.name,
            type: store.type,
            location: store.location,
            deliveryFee: store.deliveryFee,
            estimatedDeliveryTime: store.estimatedDeliveryTime,
            rating: store.rating,
          },
          price: item.price,
          comparePrice: item.comparePrice,
          quantity: item.quantity,
          unit: item.unit,
          distance,
        };
      })
    );
    
    // Filter out nulls and sort by distance if available
    const validAvailability = availability.filter(Boolean);
    if (args.userLocation) {
      validAvailability.sort((a, b) => (a!.distance || 0) - (b!.distance || 0));
    }
    
    return validAvailability;
  },
});

// Helper function to calculate distance between two coordinates
function calculateDistance(lat1: number, lon1: number, lat2: number, lon2: number): number {
  const R = 6371; // Radius of the Earth in km
  const dLat = (lat2 - lat1) * Math.PI / 180;
  const dLon = (lon2 - lon1) * Math.PI / 180;
  const a = 
    Math.sin(dLat/2) * Math.sin(dLat/2) +
    Math.cos(lat1 * Math.PI / 180) * Math.cos(lat2 * Math.PI / 180) *
    Math.sin(dLon/2) * Math.sin(dLon/2);
  const c = 2 * Math.atan2(Math.sqrt(a), Math.sqrt(1-a));
  return R * c;
}

// Get products by subcategory
export const getProductsBySubcategory = query({
  args: {
    subcategory: v.string(),
    limit: v.optional(v.number()),
    cursor: v.optional(v.string()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const products = await ctx.db
      .query("products")
      .withIndex("by_subcategory", (q) => q.eq("subcategory", args.subcategory))
      .filter((q) => q.eq(q.field("active"), true))
      .take(limit);
    
    return products;
  },
});

// Get popular products (by rating)
export const getPopularProducts = query({
  args: {
    category: v.optional(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 10;
    
    let query = ctx.db
      .query("products")
      .filter((q) => q.eq(q.field("active"), true));
    
    if (args.category) {
      query = query.filter((q) => q.eq(q.field("category"), args.category));
    }
    
    const products = await query.take(limit);
    
    // Sort by rating (products with higher ratings first)
    products.sort((a, b) => (b.avgRating || 0) - (a.avgRating || 0));
    
    return products;
  },
});

// Get products by brand
export const getProductsByBrand = query({
  args: {
    brand: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const products = await ctx.db
      .query("products")
      .filter((q) => 
        q.and(
          q.eq(q.field("active"), true),
          q.eq(q.field("brand"), args.brand)
        )
      )
      .take(limit);
    
    return products;
  },
});

// Get products by tags
export const getProductsByTags = query({
  args: {
    tags: v.array(v.string()),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    const products = await ctx.db
      .query("products")
      .filter((q) => 
        q.and(
          q.eq(q.field("active"), true),
          q.gte(q.field("tags"), args.tags)
        )
      )
      .take(limit);
    
    return products;
  },
});

// Get related products
export const getRelatedProducts = query({
  args: {
    productId: v.id("products"),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 6;
    
    const product = await ctx.db.get(args.productId);
    if (!product) return [];
    
    // Get products in the same category and subcategory
    const relatedProducts = await ctx.db
      .query("products")
      .filter((q) => 
        q.and(
          q.eq(q.field("active"), true),
          q.eq(q.field("category"), product.category),
          q.eq(q.field("subcategory"), product.subcategory),
          q.neq(q.field("_id"), args.productId)
        )
      )
      .take(limit);
    
    return relatedProducts;
  },
}); 