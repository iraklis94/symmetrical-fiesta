import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc } from "./_generated/dataModel";

// Get current user profile
export const getCurrentUser = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    return user;
  },
});

// Create or update user profile
export const upsertUser = mutation({
  args: {
    name: v.string(),
    phone: v.optional(v.string()),
    avatar: v.optional(v.string()),
    preferences: v.optional(v.object({
      language: v.string(),
      currency: v.string(),
      favoriteCategories: v.array(v.string()),
      dietaryRestrictions: v.array(v.string()),
      notifications: v.object({
        push: v.boolean(),
        email: v.boolean(),
        sms: v.boolean(),
      }),
    })),
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    const existingUser = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    const now = Date.now();
    const userData = {
      email: identity.email!,
      name: args.name,
      phone: args.phone,
      avatar: args.avatar,
      role: "customer",
      preferences: args.preferences || {
        language: "en",
        currency: "EUR",
        favoriteCategories: [],
        dietaryRestrictions: [],
        notifications: {
          push: true,
          email: true,
          sms: false,
        },
      },
      metadata: {
        lastLogin: now,
        totalOrders: existingUser?.metadata.totalOrders || 0,
        totalSpent: existingUser?.metadata.totalSpent || 0,
        loyaltyPoints: existingUser?.metadata.loyaltyPoints || 0,
      },
      createdAt: existingUser?.createdAt || now,
      updatedAt: now,
    };

    if (existingUser) {
      return await ctx.db.patch(existingUser._id, userData);
    } else {
      return await ctx.db.insert("users", userData);
    }
  },
});

// Update user preferences
export const updateUserPreferences = mutation({
  args: {
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

    return await ctx.db.patch(user._id, {
      preferences: args.preferences,
      updatedAt: Date.now(),
    });
  },
});

// Update user metadata (last login, etc.)
export const updateUserMetadata = mutation({
  args: {
    lastLogin: v.optional(v.number()),
    totalOrders: v.optional(v.number()),
    totalSpent: v.optional(v.number()),
    loyaltyPoints: v.optional(v.number()),
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

    const metadata = { ...user.metadata };
    if (args.lastLogin !== undefined) metadata.lastLogin = args.lastLogin;
    if (args.totalOrders !== undefined) metadata.totalOrders = args.totalOrders;
    if (args.totalSpent !== undefined) metadata.totalSpent = args.totalSpent;
    if (args.loyaltyPoints !== undefined) metadata.loyaltyPoints = args.loyaltyPoints;

    return await ctx.db.patch(user._id, {
      metadata,
      updatedAt: Date.now(),
    });
  },
});

// Get user addresses
export const getUserAddresses = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return [];

    const addresses = await ctx.db
      .query("addresses")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    return addresses;
  },
});

// Add user address
export const addUserAddress = mutation({
  args: {
    label: v.string(),
    street: v.string(),
    city: v.string(),
    postalCode: v.string(),
    coordinates: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    isDefault: v.boolean(),
    notes: v.optional(v.string()),
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

    // If this is the default address, unset other defaults
    if (args.isDefault) {
      const existingDefaults = await ctx.db
        .query("addresses")
        .withIndex("by_default", (q) => 
          q.eq("userId", user._id).eq("isDefault", true)
        )
        .collect();

      for (const addr of existingDefaults) {
        await ctx.db.patch(addr._id, { isDefault: false });
      }
    }

    return await ctx.db.insert("addresses", {
      userId: user._id,
      label: args.label,
      street: args.street,
      city: args.city,
      postalCode: args.postalCode,
      coordinates: args.coordinates,
      isDefault: args.isDefault,
      notes: args.notes,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
  },
});

// Update user address
export const updateUserAddress = mutation({
  args: {
    addressId: v.id("addresses"),
    label: v.string(),
    street: v.string(),
    city: v.string(),
    postalCode: v.string(),
    coordinates: v.object({
      latitude: v.number(),
      longitude: v.number(),
    }),
    isDefault: v.boolean(),
    notes: v.optional(v.string()),
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

    const address = await ctx.db.get(args.addressId);
    if (!address || address.userId !== user._id) {
      throw new Error("Address not found or not owned by user");
    }

    // If this is the default address, unset other defaults
    if (args.isDefault) {
      const existingDefaults = await ctx.db
        .query("addresses")
        .withIndex("by_default", (q) => 
          q.eq("userId", user._id).eq("isDefault", true)
        )
        .collect();

      for (const addr of existingDefaults) {
        if (addr._id !== args.addressId) {
          await ctx.db.patch(addr._id, { isDefault: false });
        }
      }
    }

    return await ctx.db.patch(args.addressId, {
      label: args.label,
      street: args.street,
      city: args.city,
      postalCode: args.postalCode,
      coordinates: args.coordinates,
      isDefault: args.isDefault,
      notes: args.notes,
      updatedAt: Date.now(),
    });
  },
});

// Delete user address
export const deleteUserAddress = mutation({
  args: {
    addressId: v.id("addresses"),
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

    const address = await ctx.db.get(args.addressId);
    if (!address || address.userId !== user._id) {
      throw new Error("Address not found or not owned by user");
    }

    await ctx.db.delete(args.addressId);
    return { success: true };
  },
});