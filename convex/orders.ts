import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Get user orders
export const getUserOrders = query({
  args: {
    status: v.optional(v.string()),
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

    let ordersQuery = ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", user._id));

    if (args.status) {
      ordersQuery = ordersQuery.filter((q) => q.eq(q.field("status"), args.status));
    }

    const orders = await ordersQuery
      .order("desc")
      .take(args.limit ?? 20)
      .collect();

    // Get full product and store details for each order
    const ordersWithDetails = await Promise.all(
      orders.map(async (order) => {
        const itemsWithDetails = await Promise.all(
          order.items.map(async (item) => {
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

        const storesWithDetails = await Promise.all(
          order.stores.map(async (storeId) => {
            return await ctx.db.get(storeId);
          })
        );

        return {
          ...order,
          items: itemsWithDetails.filter(item => item.product && item.store),
          stores: storesWithDetails.filter(Boolean),
        };
      })
    );

    return ordersWithDetails;
  },
});

// Get order details
export const getOrder = query({
  args: { orderId: v.id("orders") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return null;

    const order = await ctx.db.get(args.orderId);
    if (!order || order.userId !== user._id) return null;

    // Get full product and store details
    const itemsWithDetails = await Promise.all(
      order.items.map(async (item) => {
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

    const storesWithDetails = await Promise.all(
      order.stores.map(async (storeId) => {
        return await ctx.db.get(storeId);
      })
    );

    return {
      ...order,
      items: itemsWithDetails.filter(item => item.product && item.store),
      stores: storesWithDetails.filter(Boolean),
    };
  },
});

// Create order from cart
export const createOrder = mutation({
  args: {
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
    paymentMethod: v.string(),
    paymentIntentId: v.string(),
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

    // Generate order number
    const orderNumber = `GM${Date.now()}${Math.random().toString(36).substr(2, 5).toUpperCase()}`;

    // Calculate estimated delivery time
    const estimatedDelivery = args.deliveryType === 'delivery' 
      ? Date.now() + (45 * 60 * 1000) // 45 minutes from now
      : undefined;

    const order = await ctx.db.insert("orders", {
      userId: user._id,
      orderNumber,
      items: args.items,
      stores: args.stores,
      subtotal: args.subtotal,
      deliveryFee: args.deliveryFee,
      discount: args.discount,
      total: args.total,
      status: "pending",
      deliveryType: args.deliveryType,
      deliveryAddress: args.deliveryAddress,
      pickupTime: args.pickupTime,
      estimatedDelivery,
      paymentMethod: args.paymentMethod,
      paymentIntentId: args.paymentIntentId,
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });

    // Clear user's cart after successful order
    const cart = await ctx.db
      .query("carts")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    if (cart) {
      await ctx.db.patch(cart._id, {
        items: [],
        updatedAt: Date.now(),
      });
    }

    // Update user metadata
    const totalSpent = user.metadata.totalSpent + args.total;
    const totalOrders = user.metadata.totalOrders + 1;
    const loyaltyPoints = user.metadata.loyaltyPoints + Math.floor(args.total);

    await ctx.db.patch(user._id, {
      metadata: {
        ...user.metadata,
        totalSpent,
        totalOrders,
        loyaltyPoints,
      },
      updatedAt: Date.now(),
    });

    return order;
  },
});

// Update order status
export const updateOrderStatus = mutation({
  args: {
    orderId: v.id("orders"),
    status: v.string(),
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

    const order = await ctx.db.get(args.orderId);
    if (!order || order.userId !== user._id) {
      throw new Error("Order not found or not owned by user");
    }

    return await ctx.db.patch(args.orderId, {
      status: args.status,
      updatedAt: Date.now(),
    });
  },
});

// Cancel order
export const cancelOrder = mutation({
  args: { orderId: v.id("orders") },
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

    const order = await ctx.db.get(args.orderId);
    if (!order || order.userId !== user._id) {
      throw new Error("Order not found or not owned by user");
    }

    // Only allow cancellation of pending or confirmed orders
    if (!["pending", "confirmed"].includes(order.status)) {
      throw new Error("Order cannot be cancelled at this stage");
    }

    return await ctx.db.patch(args.orderId, {
      status: "cancelled",
      updatedAt: Date.now(),
    });
  },
});

// Get order statistics
export const getOrderStats = query({
  args: {},
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) return null;

    const orders = await ctx.db
      .query("orders")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .collect();

    const stats = {
      totalOrders: orders.length,
      totalSpent: orders.reduce((sum, order) => sum + order.total, 0),
      pendingOrders: orders.filter(order => order.status === "pending").length,
      completedOrders: orders.filter(order => order.status === "completed").length,
      cancelledOrders: orders.filter(order => order.status === "cancelled").length,
    };

    return stats;
  },
});