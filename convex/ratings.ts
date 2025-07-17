import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get product ratings
export const getProductRatings = query({
  args: {
    productId: v.id("products"),
    limit: v.optional(v.number()),
    sortBy: v.optional(v.string()), // "recent", "rating", "helpful"
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;
    
    let ratingsQuery = ctx.db
      .query("ratings")
      .withIndex("by_product", (q) => q.eq("productId", args.productId));
    
    const ratings = await ratingsQuery.collect();
    
    // Sort ratings
    let sortedRatings = [...ratings];
    switch (args.sortBy) {
      case "recent":
        sortedRatings.sort((a, b) => b.createdAt - a.createdAt);
        break;
      case "rating":
        sortedRatings.sort((a, b) => b.rating - a.rating);
        break;
      case "helpful":
        sortedRatings.sort((a, b) => (b.helpful - b.notHelpful) - (a.helpful - a.notHelpful));
        break;
      default:
        sortedRatings.sort((a, b) => b.createdAt - a.createdAt);
    }
    
    // Get user details for each rating
    const ratingsWithUsers = await Promise.all(
      sortedRatings.slice(0, limit).map(async (rating) => {
        const user = await ctx.db.get(rating.userId);
        return {
          ...rating,
          user: user ? {
            name: user.name,
            avatar: user.avatar,
          } : null,
        };
      })
    );
    
    return ratingsWithUsers;
  },
});

// Add product rating
export const addProductRating = mutation({
  args: {
    productId: v.id("products"),
    rating: v.number(),
    review: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
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

    // Check if product exists
    const product = await ctx.db.get(args.productId);
    if (!product || !product.active) {
      throw new Error("Product not found or not available");
    }

    // Check if user already rated this product
    const existingRating = await ctx.db
      .query("ratings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .filter((q) => q.eq(q.field("productId"), args.productId))
      .first();

    if (existingRating) {
      throw new Error("You have already rated this product");
    }

    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    // Validate wine rating if provided
    if (args.wineRating) {
      const wineFields = ['appearance', 'aroma', 'body', 'tannins', 'acidity', 'finish', 'overall'];
      for (const field of wineFields) {
        const value = args.wineRating[field as keyof typeof args.wineRating];
        if (typeof value === 'number' && (value < 1 || value > 5)) {
          throw new Error(`Wine rating ${field} must be between 1 and 5`);
        }
      }
    }

    const rating = await ctx.db.insert("ratings", {
      userId: user._id,
      productId: args.productId,
      rating: args.rating,
      review: args.review,
      images: args.images || [],
      verifiedPurchase: false, // TODO: Check if user has purchased this product
      helpful: 0,
      notHelpful: 0,
      wineRating: args.wineRating,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Update product average rating
    await updateProductAverageRating(ctx, args.productId);

    return rating;
  },
});

// Update product rating
export const updateProductRating = mutation({
  args: {
    ratingId: v.id("ratings"),
    rating: v.number(),
    review: v.optional(v.string()),
    images: v.optional(v.array(v.string())),
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

    const existingRating = await ctx.db.get(args.ratingId);
    if (!existingRating || existingRating.userId !== user._id) {
      throw new Error("Rating not found or not owned by user");
    }

    // Validate rating
    if (args.rating < 1 || args.rating > 5) {
      throw new Error("Rating must be between 1 and 5");
    }

    const updatedRating = await ctx.db.patch(args.ratingId, {
      rating: args.rating,
      review: args.review,
      images: args.images,
      wineRating: args.wineRating,
      updatedAt: Date.now(),
    });

    // Update product average rating
    await updateProductAverageRating(ctx, existingRating.productId);

    return updatedRating;
  },
});

// Delete product rating
export const deleteProductRating = mutation({
  args: {
    ratingId: v.id("ratings"),
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

    const rating = await ctx.db.get(args.ratingId);
    if (!rating || rating.userId !== user._id) {
      throw new Error("Rating not found or not owned by user");
    }

    await ctx.db.delete(args.ratingId);

    // Update product average rating
    await updateProductAverageRating(ctx, rating.productId);

    return { success: true };
  },
});

// Mark rating as helpful/not helpful
export const markRatingHelpful = mutation({
  args: {
    ratingId: v.id("ratings"),
    helpful: v.boolean(), // true for helpful, false for not helpful
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const rating = await ctx.db.get(args.ratingId);
    if (!rating) {
      throw new Error("Rating not found");
    }

    const update = args.helpful
      ? { helpful: rating.helpful + 1 }
      : { notHelpful: rating.notHelpful + 1 };

    return await ctx.db.patch(args.ratingId, update);
  },
});

// Get user's ratings
export const getUserRatings = query({
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

    const ratings = await ctx.db
      .query("ratings")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .order("desc")
      .take(args.limit ?? 20)
      .collect();

    // Get product details for each rating
    const ratingsWithProducts = await Promise.all(
      ratings.map(async (rating) => {
        const product = await ctx.db.get(rating.productId);
        return {
          ...rating,
          product,
        };
      })
    );

    return ratingsWithProducts.filter(r => r.product);
  },
});

// Helper function to update product average rating
async function updateProductAverageRating(ctx: any, productId: Id<"products">) {
  const ratings = await ctx.db
    .query("ratings")
    .withIndex("by_product", (q) => q.eq("productId", productId))
    .collect();

  const avgRating = ratings.length > 0
    ? ratings.reduce((sum, r) => sum + r.rating, 0) / ratings.length
    : 0;

  await ctx.db.patch(productId, {
    avgRating,
    ratingsCount: ratings.length,
    updatedAt: Date.now(),
  });
}