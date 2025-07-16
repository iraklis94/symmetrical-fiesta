import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get nearby stores
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
    let storesQuery = ctx.db
      .query("stores")
      .withIndex("by_active", (q) => q.eq("active", true));
    
    if (args.onlyPartnered) {
      storesQuery = ctx.db
        .query("stores")
        .withIndex("by_partnered", (q) => q.eq("partnered", true))
        .filter((q) => q.eq(q.field("active"), true));
    }
    
    const stores = await storesQuery.collect();
    
    // Filter by type if specified
    let filteredStores = stores;
    if (args.storeType) {
      filteredStores = stores.filter(store => store.type === args.storeType);
    }
    
    // Calculate distances and filter by radius
    const storesWithDistance = filteredStores.map(store => {
      const distance = calculateDistance(
        args.location.latitude,
        args.location.longitude,
        store.location.latitude,
        store.location.longitude
      );
      
      return {
        ...store,
        distance,
      };
    }).filter(store => store.distance <= args.radius);
    
    // Sort by distance
    storesWithDistance.sort((a, b) => a.distance - b.distance);
    
    return storesWithDistance;
  },
});

// Get store details
export const getStore = query({
  args: { id: v.id("stores") },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.id);
    if (!store || !store.active) return null;
    
    // Get store hours for today
    const today = new Date().getDay();
    const todayHours = store.hours.find(h => h.day === today);
    
    // Check if store is open
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    const isOpen = todayHours && !todayHours.closed && 
      currentTime >= todayHours.open && currentTime <= todayHours.close;
    
    return {
      ...store,
      isOpen,
      todayHours,
    };
  },
});

// Get all active stores
export const getAllStores = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 50;
    
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_active", (q) => q.eq("active", true))
      .take(limit);
    
    return stores;
  },
});

// Get stores by type
export const getStoresByType = query({
  args: {
    type: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_type", (q) => q.eq("type", args.type))
      .filter((q) => q.eq(q.field("active"), true))
      .take(limit);
    
    return stores;
  },
});

// Get partnered stores
export const getPartneredStores = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    
    const stores = await ctx.db
      .query("stores")
      .withIndex("by_partnered", (q) => q.eq("partnered", true))
      .filter((q) => q.eq(q.field("active"), true))
      .take(limit);
    
    return stores;
  },
});

// Check if store delivers to location
export const checkDeliveryAvailability = query({
  args: {
    storeId: v.id("stores"),
    location: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
  },
  handler: async (ctx, args) => {
    const store = await ctx.db.get(args.storeId);
    if (!store || !store.active) {
      return { available: false, reason: 'Store not found or inactive' };
    }
    
    const distance = calculateDistance(
      args.location.latitude,
      args.location.longitude,
      store.location.latitude,
      store.location.longitude
    );
    
    // Assume max delivery radius of 10km
    const MAX_DELIVERY_RADIUS = 10;
    
    if (distance > MAX_DELIVERY_RADIUS) {
      return { 
        available: false, 
        reason: 'Location too far for delivery',
        distance,
      };
    }
    
    // Check if store is open
    const today = new Date().getDay();
    const todayHours = store.hours.find(h => h.day === today);
    
    if (!todayHours || todayHours.closed) {
      return { 
        available: false, 
        reason: 'Store is closed today',
      };
    }
    
    const now = new Date();
    const currentTime = `${now.getHours().toString().padStart(2, '0')}:${now.getMinutes().toString().padStart(2, '0')}`;
    
    if (currentTime < todayHours.open || currentTime > todayHours.close) {
      return { 
        available: false, 
        reason: 'Store is closed now',
        opensAt: todayHours.open,
        closesAt: todayHours.close,
      };
    }
    
    return { 
      available: true,
      deliveryFee: store.deliveryFee,
      estimatedTime: store.estimatedDeliveryTime,
      minOrderAmount: store.minOrderAmount,
      distance,
    };
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