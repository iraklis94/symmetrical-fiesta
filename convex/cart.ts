import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get user's cart
export const getUserCart = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return null;

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!cart) return { items: [] };

    // Get full product and store details for each cart item
    const cartWithDetails = await Promise.all(
      cart.items.map(async (item) => {
        const [product, store] = await Promise.all([
          ctx.db.get(item.productId),
          ctx.db.get(item.storeId),
        ]);

        return {
          ...item,
          product,
          store,
        };
      })
    );

    return {
      ...cart,
      items: cartWithDetails.filter(item => item.product && item.store),
    };
  },
});

// Add item to cart
export const addToCart = mutation({
  args: {
    productId: v.id("products"),
    storeId: v.id("stores"),
    quantity: v.number(),
    price: v.number(),
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

    // Check if product and store exist
    const [product, store] = await Promise.all([
      ctx.db.get(args.productId),
      ctx.db.get(args.storeId),
    ]);

    if (!product || !store) {
      throw new Error("Product or store not found");
    }

    // Check if product is in stock at this store
    const inventory = await ctx.db
      .query("inventory")
      .withIndex("by_product_store", (q) => 
        q.eq("productId", args.productId).eq("storeId", args.storeId)
      )
      .first();

    if (!inventory || !inventory.inStock) {
      throw new Error("Product not available at this store");
    }

    // Get existing cart or create new one
    let cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!cart) {
      // Create new cart
      return await ctx.db.insert("carts", {
        userId: user._id,
        items: [{
          productId: args.productId,
          storeId: args.storeId,
          quantity: args.quantity,
          price: args.price,
          notes: args.notes,
        }],
        updatedAt: Date.now(),
      });
    }

    // Check if item already exists in cart
    const existingItemIndex = cart.items.findIndex(
      item => item.productId === args.productId && item.storeId === args.storeId
    );

    let updatedItems = [...cart.items];

    if (existingItemIndex >= 0) {
      // Update existing item quantity
      updatedItems[existingItemIndex] = {
        ...updatedItems[existingItemIndex],
        quantity: updatedItems[existingItemIndex].quantity + args.quantity,
        price: args.price, // Update price in case it changed
        notes: args.notes || updatedItems[existingItemIndex].notes,
      };
    } else {
      // Add new item
      updatedItems.push({
        productId: args.productId,
        storeId: args.storeId,
        quantity: args.quantity,
        price: args.price,
        notes: args.notes,
      });
    }

    // Update cart
    return await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    });
  },
});

// Update cart item quantity
export const updateCartItemQuantity = mutation({
  args: {
    productId: v.id("products"),
    storeId: v.id("stores"),
    quantity: v.number(),
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

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!cart) {
      throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId === args.productId && item.storeId === args.storeId
    );

    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    let updatedItems = [...cart.items];

    if (args.quantity <= 0) {
      // Remove item
      updatedItems.splice(itemIndex, 1);
    } else {
      // Update quantity
      updatedItems[itemIndex] = {
        ...updatedItems[itemIndex],
        quantity: args.quantity,
      };
    }

    return await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    });
  },
});

// Remove item from cart
export const removeFromCart = mutation({
  args: {
    productId: v.id("products"),
    storeId: v.id("stores"),
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

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!cart) {
      throw new Error("Cart not found");
    }

    const updatedItems = cart.items.filter(
      item => !(item.productId === args.productId && item.storeId === args.storeId)
    );

    return await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    });
  },
});

// Clear cart
export const clearCart = mutation({
  args: {},
  handler: async (ctx) => {
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

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!cart) {
      return { success: true };
    }

    return await ctx.db.patch(cart._id, {
      items: [],
      updatedAt: Date.now(),
    });
  },
});

// Update cart item notes
export const updateCartItemNotes = mutation({
  args: {
    productId: v.id("products"),
    storeId: v.id("stores"),
    notes: v.string(),
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

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!cart) {
      throw new Error("Cart not found");
    }

    const itemIndex = cart.items.findIndex(
      item => item.productId === args.productId && item.storeId === args.storeId
    );

    if (itemIndex === -1) {
      throw new Error("Item not found in cart");
    }

    const updatedItems = [...cart.items];
    updatedItems[itemIndex] = {
      ...updatedItems[itemIndex],
      notes: args.notes,
    };

    return await ctx.db.patch(cart._id, {
      items: updatedItems,
      updatedAt: Date.now(),
    });
  },
});

// Get cart summary (total items, total price)
export const getCartSummary = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return { totalItems: 0, totalPrice: 0 };

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return { totalItems: 0, totalPrice: 0 };

    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (!cart || cart.items.length === 0) {
      return { totalItems: 0, totalPrice: 0 };
    }

    const totalItems = cart.items.reduce((sum, item) => sum + item.quantity, 0);
    const totalPrice = cart.items.reduce((sum, item) => sum + (item.price * item.quantity), 0);

    return { totalItems, totalPrice };
  },
});