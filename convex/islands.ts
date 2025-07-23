import { v } from "convex/values";
import { query } from "./_generated/server";

interface WineInfo {
  id: string;
  name: string;
  image: string;
  price: number;
  rating: number;
  description?: string;
}

interface IslandInfo {
  id: string;
  name: string;
  image: string;
  history: string;
}

const ISLANDS: IslandInfo[] = [
  {
    id: "santorini",
    name: "Santorini",
    image: "https://images.unsplash.com/photo-1504274066651-8d31a536b11a?auto=format&fit=crop&w=800&q=60",
    history:
      "Santorini's volcanic terroir shapes its celebrated Assyrtiko wines, famed for their bracing acidity and mineral finish.",
  },
  {
    id: "crete",
    name: "Crete",
    image: "https://images.unsplash.com/photo-1534940531807-dc04e2f1aa9c?auto=format&fit=crop&w=800&q=60",
    history:
      "Crete boasts a 4,000-year-old wine tradition. Indigenous varieties such as Vidiano and Kotsifali thrive in its sunny vineyards.",
  },
  {
    id: "rhodes",
    name: "Rhodes",
    image: "https://images.unsplash.com/photo-1567609744553-133edb2eec55?auto=format&fit=crop&w=800&q=60",
    history:
      "Known in antiquity as \"Oenologos\" (the wine island), Rhodes produces refreshing whites from Athiri and bold reds from Mandilaria.",
  },
  {
    id: "paros",
    name: "Paros",
    image: "https://images.unsplash.com/photo-1541414773697-06618078e60e?auto=format&fit=crop&w=800&q=60",
    history:
      "Paros is famed for its Malvasia exports during the Middle Ages. Today, Monemvasia and Mandilaria blends define its character.",
  },
  {
    id: "lesbos",
    name: "Lesbos",
    image: "https://images.unsplash.com/photo-1498654200322-302e59a56f31?auto=format&fit=crop&w=800&q=60",
    history:
      "Lesbos has a revival of wine-making focusing on Chidiriotiko grapes rooted in volcanic sub-soil, resulting in spicy, earthy reds.",
  },
];

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