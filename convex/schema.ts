import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  users: defineTable({
    email: v.string(),
    name: v.string(),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
    role: v.string(), // customer, admin, partner
    preferences: v.object({
      language: v.string(),
      currency: v.string(),
      favoriteCategories: v.array(v.string()),
      dietaryRestrictions: v.array(v.string()),
      notifications: v.object({
        push: v.boolean(),
        email: v.boolean(),
        sms: v.boolean(),
      }),
    }),
    metadata: v.object({
      lastLogin: v.number(),
      totalOrders: v.number(),
      totalSpent: v.number(),
      loyaltyPoints: v.number(),
    }),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_email", ["email"])
    .index("by_role", ["role"]),

  products: defineTable({
    // Basic info
    name: v.string(),
    nameEn: v.string(),
    category: v.string(), // wine, cheese, olive_oil
    subcategory: v.string(), // red_wine, white_wine, feta, etc.
    barcode: v.optional(v.string()),
    
    // Details
    description: v.string(),
    descriptionEn: v.string(),
    images: v.array(v.string()),
    
    // Specifications
    brand: v.string(),
    origin: v.object({
      country: v.string(),
      region: v.string(),
      producer: v.optional(v.string()),
    }),
    
    // Category-specific data
    wineData: v.optional(v.object({
      type: v.string(), // red, white, rosé, sparkling
      grapeVariety: v.array(v.string()),
      vintage: v.number(),
      alcoholContent: v.number(),
      servingTemp: v.object({
        min: v.number(),
        max: v.number(),
      }),
      tastingNotes: v.optional(v.object({
        aroma: v.array(v.string()),
        flavor: v.array(v.string()),
        finish: v.string(),
      })),
    })),
    
    cheeseData: v.optional(v.object({
      type: v.string(), // hard, soft, semi-hard
      milk: v.string(), // cow, goat, sheep, mixed
      aging: v.string(),
      fatContent: v.number(),
    })),
    
    oliveOilData: v.optional(v.object({
      type: v.string(), // extra virgin, virgin, refined
      acidity: v.number(),
      harvestYear: v.number(),
      oliveVariety: v.array(v.string()),
    })),
    
    // Metadata
    avgRating: v.number(),
    ratingsCount: v.number(),
    active: v.boolean(),
    featured: v.boolean(),
    tags: v.array(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_category", ["category"])
    .index("by_subcategory", ["subcategory"])
    .index("by_barcode", ["barcode"])
    .index("by_featured", ["featured"])
    .searchIndex("search_products", {
      searchField: "name",
      filterFields: ["category", "active"],
    }),

  stores: defineTable({
    name: v.string(),
    type: v.string(), // supermarket, specialty, wine_shop
    logo: v.optional(v.string()),
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
      address: v.string(),
      city: v.string(),
      postalCode: v.string(),
    }),
    contact: v.object({
      phone: v.string(),
      email: v.optional(v.string()),
      website: v.optional(v.string()),
    }),
    hours: v.array(v.object({
      day: v.number(), // 0-6 (Sunday-Saturday)
      open: v.string(), // "09:00"
      close: v.string(), // "21:00"
      closed: v.boolean(),
    })),
    features: v.array(v.string()), // parking, wheelchair_access, etc.
    partnered: v.boolean(),
    rating: v.number(),
    deliveryFee: v.number(),
    minOrderAmount: v.number(),
    estimatedDeliveryTime: v.number(), // in minutes
    active: v.boolean(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_partnered", ["partnered"])
    .index("by_active", ["active"])
    .index("by_type", ["type"]),

  inventory: defineTable({
    productId: v.id("products"),
    storeId: v.id("stores"),
    price: v.number(),
    comparePrice: v.optional(v.number()), // Original price for discounts
    currency: v.string(),
    inStock: v.boolean(),
    quantity: v.optional(v.number()),
    unit: v.string(), // piece, kg, liter
    minOrder: v.optional(v.number()),
    maxOrder: v.optional(v.number()),
    lastRestocked: v.optional(v.number()),
    updatedAt: v.number(),
  })
    .index("by_product", ["productId"])
    .index("by_store", ["storeId"])
    .index("by_product_store", ["productId", "storeId"])
    .index("by_in_stock", ["inStock"]),

  ratings: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    rating: v.number(), // 1-5
    review: v.optional(v.string()),
    images: v.array(v.string()),
    verifiedPurchase: v.boolean(),
    helpful: v.number(),
    notHelpful: v.number(),
    
    // Wine-specific ratings
    wineRating: v.optional(v.object({
      appearance: v.number(),
      aroma: v.number(),
      body: v.number(),
      tannins: v.number(),
      acidity: v.number(),
      finish: v.number(),
      overall: v.number(),
      foodPairings: v.array(v.string()),
    })),
    
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_product", ["productId"])
    .index("by_rating", ["rating"])
    .index("by_verified", ["verifiedPurchase"]),

  carts: defineTable({
    userId: v.id("users"),
    items: v.array(v.object({
      productId: v.id("products"),
      storeId: v.id("stores"),
      quantity: v.number(),
      price: v.number(),
      notes: v.optional(v.string()),
    })),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"]),

  orders: defineTable({
    userId: v.id("users"),
    orderNumber: v.string(),
    items: v.array(v.object({
      productId: v.id("products"),
      storeId: v.id("stores"),
      quantity: v.number(),
      price: v.number(),
      name: v.string(),
    })),
    stores: v.array(v.id("stores")),
    subtotal: v.number(),
    deliveryFee: v.number(),
    discount: v.number(),
    total: v.number(),
    status: v.string(), // pending, confirmed, preparing, delivering, completed, cancelled
    deliveryType: v.string(), // delivery, pickup
    deliveryAddress: v.optional(v.object({
      street: v.string(),
      city: v.string(),
      postalCode: v.string(),
      coordinates: v.object({
        latitude: v.number(),
        longitude: v.number(),
      }),
      notes: v.optional(v.string()),
    })),
    pickupTime: v.optional(v.number()),
    estimatedDelivery: v.optional(v.number()),
    paymentMethod: v.string(),
    paymentIntentId: v.string(),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_status", ["status"])
    .index("by_order_number", ["orderNumber"]),

  favorites: defineTable({
    userId: v.id("users"),
    productId: v.id("products"),
    createdAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_user_product", ["userId", "productId"]),

  addresses: defineTable({
    userId: v.id("users"),
    label: v.string(), // Home, Work, etc.
    street: v.string(),
    city: v.string(),
    postalCode: v.string(),
    coordinates: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    isDefault: v.boolean(),
    notes: v.optional(v.string()),
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_user", ["userId"])
    .index("by_default", ["userId", "isDefault"]),
    
  // Group Wine Roulette tables
  sessions: defineTable({
    hostUserId: v.string(), // Clerk user ID
    sessionCode: v.string(), // 6-digit code for joining
    region: v.string(),
    filters: v.object({
      priceMin: v.optional(v.number()),
      priceMax: v.optional(v.number()),
      ratingMin: v.optional(v.number()),
      categories: v.optional(v.array(v.string())),
    }),
    participantIds: v.array(v.string()), // Clerk user IDs
    status: v.union(v.literal("pending"), v.literal("voting"), v.literal("complete")),
    winnerId: v.optional(v.id("products")), // Winner wine ID
    createdAt: v.number(),
    updatedAt: v.number(),
  })
    .index("by_code", ["sessionCode"])
    .index("by_host", ["hostUserId"])
    .index("by_status", ["status"]),

  candidateWines: defineTable({
    sessionId: v.id("sessions"),
    productId: v.id("products"),
    order: v.number(), // Display order
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_session_product", ["sessionId", "productId"]),

  votes: defineTable({
    sessionId: v.id("sessions"),
    productId: v.id("products"),
    userId: v.string(), // Clerk user ID
    upvote: v.boolean(),
    createdAt: v.number(),
  })
    .index("by_session", ["sessionId"])
    .index("by_user_session", ["userId", "sessionId"])
    .index("by_session_product", ["sessionId", "productId"]),
}); 