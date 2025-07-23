import { v } from "convex/values";
import { mutation, query, action } from "./_generated/server";

/**
 * recordOilPurchase
 *
 * This mutation should be invoked after a user successfully purchases olive-oil tanks.
 * It increments the user’s pending tank counter and automatically triggers new
 * tree-planting records every time 4 tanks are accumulated.
 */
export const recordOilPurchase = mutation({
  args: {
    tanks: v.number(), // Number of olive-oil tanks purchased in the transaction
  },
  handler: async (ctx, args) => {
    if (args.tanks <= 0) return;

    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Not authenticated");
    }

    // Find user document
    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();

    if (!user) throw new Error("User not found");

    // Fetch or create orchard counter for user
    let counter = await ctx.db
      .query("orchardCounters")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    const now = Date.now();

    const pendingTanks = counter?.pendingTanks ?? 0;
    const treesPlanted = counter?.treesPlanted ?? 0;

    const totalTanks = pendingTanks + args.tanks;

    const newTrees = Math.floor(totalTanks / 4);
    const newPending = totalTanks % 4;

    // Upsert counter
    if (counter) {
      await ctx.db.patch(counter._id, {
        pendingTanks: newPending,
        treesPlanted: treesPlanted + newTrees,
        updatedAt: now,
      });
    } else {
      await ctx.db.insert("orchardCounters", {
        userId: user._id,
        pendingTanks: newPending,
        treesPlanted: newTrees,
        updatedAt: now,
      });
    }

    // For each new tree, create orchardTrees entry and optionally trigger partner API
    for (let i = 0; i < newTrees; i++) {
      const treeNumber = treesPlanted + i + 1;
      const orchardTreeId = await ctx.db.insert("orchardTrees", {
        userId: user._id,
        treeNumber,
        partnerTreeId: undefined,
        location: undefined,
        plantedAt: undefined,
        createdAt: now,
      });

      // Optionally kick off an async action to notify planting partner.
      // We don’t await here to keep the mutation fast.
      ctx.scheduler.runAfter(0, "orchard.triggerPartnerPlanting", {
        orchardTreeId,
      });
    }

    return {
      newTrees,
      newPending,
      totalTrees: treesPlanted + newTrees,
    };
  },
});

/**
 * getUserOrchard
 * Returns the user’s orchard statistics and recent trees.
 */
export const getUserOrchard = query({
  args: {
    limit: v.optional(v.number()), // number of recent trees to return
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_email", (q) => q.eq("email", identity.email!))
      .first();
    if (!user) return null;

    const counter = await ctx.db
      .query("orchardCounters")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .first();

    const limit = args.limit ?? 20;
    const trees = await ctx.db
      .query("orchardTrees")
      .withIndex("by_user", (q) => q.eq("userId", user._id))
      .take(limit);

    return {
      pendingTanks: counter?.pendingTanks ?? 0,
      treesPlanted: counter?.treesPlanted ?? 0,
      recentTrees: trees,
    };
  },
});

/**
 * getCommunityTreeCount
 * Returns total trees planted by all users.
 */
export const getCommunityTreeCount = query({
  args: {},
  handler: async (ctx) => {
    const allCounters = await ctx.db.query("orchardCounters").collect();
    const total = allCounters.reduce((sum, c) => sum + c.treesPlanted, 0);
    return {
      total,
    };
  },
});

/**
 * triggerPartnerPlanting
 * Action scheduled by recordOilPurchase to call the external tree-planting partner.
 * In a real implementation, we’d perform an HTTP request here.
 */
export const triggerPartnerPlanting = action({
  args: {
    orchardTreeId: v.id("orchardTrees"),
  },
  handler: async (ctx, args) => {
    // Example placeholder – perform external API call here.
    // const response = await fetch("https://partner.example.com/plant", { ... })
    // const data = await response.json();
    // await ctx.db.patch(args.orchardTreeId, {
    //   partnerTreeId: data.id,
    //   plantedAt: Date.now(),
    //   location: data.location,
    // });

    // For now, simulate success after a small delay
    await new Promise((resolve) => setTimeout(resolve, 100));

    await ctx.db.patch(args.orchardTreeId, {
      partnerTreeId: `SIM-${args.orchardTreeId}`,
      plantedAt: Date.now(),
    });
  },
});