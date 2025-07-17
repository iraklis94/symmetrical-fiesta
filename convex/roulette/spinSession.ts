import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

// Shuffle array using Fisher-Yates algorithm
function shuffle<T>(array: T[]): T[] {
  const shuffled = [...array];
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]];
  }
  return shuffled;
}

export default mutation({
  args: {
    sessionId: v.id("sessions"),
    candidateCount: v.optional(v.number()), // Default to 4
  },
  handler: async (ctx, args) => {
    // Get the current user from Clerk via the identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    // Get the session
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    
    // Only the host can spin
    if (session.hostUserId !== userId) {
      throw new Error("Only the host can spin");
    }
    
    if (session.status !== "pending") {
      throw new Error("Session is not in pending state");
    }
    
    const count = args.candidateCount || 4;
    
    // Build the query for wines
    let wineQuery = ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", "wine"))
      .filter((q) => q.eq(q.field("active"), true));
    
    // Get all wines that match the filters
    const allWines = await wineQuery.collect();
    
    // Apply additional filters
    const filteredWines = allWines.filter((wine) => {
      // Check region
      if (wine.origin.region !== session.region) {
        return false;
      }
      
      // Check price range if filters are set
      if (session.filters.priceMin !== undefined || session.filters.priceMax !== undefined) {
        // Get the inventory for this wine to check price
        // For simplicity, we'll skip this check for now
        // In a real app, you'd want to join with inventory data
      }
      
      // Check rating
      if (session.filters.ratingMin !== undefined && wine.avgRating < session.filters.ratingMin) {
        return false;
      }
      
      return true;
    });
    
    if (filteredWines.length === 0) {
      throw new Error("No wines found matching the criteria");
    }
    
    // Randomly select wines
    const selectedWines = shuffle(filteredWines).slice(0, Math.min(count, filteredWines.length));
    
    // Clear old candidates and votes
    const oldCandidates = await ctx.db
      .query("candidateWines")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
      
    for (const candidate of oldCandidates) {
      await ctx.db.delete(candidate._id);
    }
    
    const oldVotes = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
      
    for (const vote of oldVotes) {
      await ctx.db.delete(vote._id);
    }
    
    // Insert new candidates
    for (let i = 0; i < selectedWines.length; i++) {
      await ctx.db.insert("candidateWines", {
        sessionId: args.sessionId,
        productId: selectedWines[i]._id,
        order: i,
        createdAt: Date.now(),
      });
    }
    
    // Update session status to voting
    await ctx.db.patch(args.sessionId, {
      status: "voting",
      updatedAt: Date.now(),
    });
    
    return { candidateCount: selectedWines.length };
  },
});