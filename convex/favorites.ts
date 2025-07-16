import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get user favorites
export const getUserFavorites = query({
  args: {
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return [];

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 50)
      .collect();

    // Get full product details for each favorite
    const favoritesWithDetails = await Promise.all(
      favorites.map(async (favorite) => {
        const product = await ctx.db.get(favorite.productId);
        if (!product || !product.active) return null;

        return {
          ...favorite,
          product,
        };
      })
    );

    return favoritesWithDetails.filter(Boolean);
  },
});

// Add product to favorites
export const addToFavorites = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if product exists and is active
    const product = await ctx.db.get(args.productId);
    if (!product || !product.active) {
      throw new Error("Product not found or not available");
    }

    // Check if already in favorites
    const existingFavorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", user._id).eq("productId", args.productId)
      )
      .first();

    if (existingFavorite) {
      throw new Error("Product already in favorites");
    }

    return await ctx.db.insert("favorites", {
      userId: user._id,
      productId: args.productId,
      createdAt: Date.now(),
    });
  },
});

// Remove product from favorites
export const removeFromFavorites = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", user._id).eq("productId", args.productId)
      )
      .first();

    if (!favorite) {
      throw new Error("Product not in favorites");
    }

    await ctx.db.delete(favorite._id);
    return { success: true };
  },
});

// Check if product is in favorites
export const isInFavorites = query({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return false;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return false;

    const favorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", user._id).eq("productId", args.productId)
      )
      .first();

    return !!favorite;
  },
});

// Toggle favorite status
export const toggleFavorite = mutation({
  args: {
    productId: v.id("products"),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) {
      throw new Error("User not found");
    }

    // Check if product exists and is active
    const product = await ctx.db.get(args.productId);
    if (!product || !product.active) {
      throw new Error("Product not found or not available");
    }

    // Check if already in favorites
    const existingFavorite = await ctx.db
      .query("favorites")
      .withIndex("by_user_product", (q) => 
        q.eq("userId", user._id).eq("productId", args.productId)
      )
      .first();

    if (existingFavorite) {
      // Remove from favorites
      await ctx.db.delete(existingFavorite._id);
      return { added: false };
    } else {
      // Add to favorites
      await ctx.db.insert("favorites", {
        userId: user._id,
        productId: args.productId,
        createdAt: Date.now(),
      });
      return { added: true };
    }
  },
});

// Get favorites count
export const getFavoritesCount = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return 0;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return 0;

    const favorites = await ctx.db
      .query("favorites")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return favorites.length;
  },
});