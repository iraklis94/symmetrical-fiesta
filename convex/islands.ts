import { v } from "convex/values";
import { query } from "./_generated/server";
import { ISLANDS } from "./datasets/islands";

// WineInfo interface retained for cross-file imports
interface WineInfo {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  description?: string;
}

export const getIslands = query({
  args: {},
  handler: async () => {
    return ISLANDS;
  },
});

export const getWinesByIsland = query({
  args: {
    islandId: v.string(),
    limit: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const limit = args.limit ?? 20;

    const allWines = await ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", "wine"))
      .filter((q) => q.eq(q.field("active"), true))
      .collect();

    const filtered = allWines.filter((w) => (w as any).origin?.region === args.islandId);

    return filtered.slice(0, limit);
  },
});