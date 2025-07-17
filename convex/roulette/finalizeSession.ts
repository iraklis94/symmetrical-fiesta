import { mutation } from "../_generated/server";
import { v } from "convex/values";
import { Id } from "../_generated/dataModel";

export default mutation({
  args: {
    sessionId: v.id("sessions"),
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
    
    // Only the host can finalize
    if (session.hostUserId !== userId) {
      throw new Error("Only the host can finalize the session");
    }
    
    if (session.status !== "voting") {
      throw new Error("Session is not in voting state");
    }
    
    // Get all votes for this session
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    // Tally the votes
    const scoreMap: Record<string, number> = {};
    
    for (const vote of votes) {
      const productIdStr = vote.productId;
      if (!scoreMap[productIdStr]) {
        scoreMap[productIdStr] = 0;
      }
      scoreMap[productIdStr] += vote.upvote ? 1 : -1;
    }
    
    // Find the winner (highest score)
    let winnerId: Id<"products"> | null = null;
    let highestScore = -Infinity;
    
    for (const [productIdStr, score] of Object.entries(scoreMap)) {
      if (score > highestScore) {
        highestScore = score;
        winnerId = productIdStr as Id<"products">;
      }
    }
    
    // If no votes were cast, pick the first candidate
    if (!winnerId) {
      const firstCandidate = await ctx.db
        .query("candidateWines")
        .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
        .first();
        
      if (firstCandidate) {
        winnerId = firstCandidate.productId;
      }
    }
    
    // Update session status and winner
    await ctx.db.patch(args.sessionId, {
      status: "complete",
      winnerId: winnerId || undefined,
      updatedAt: Date.now(),
    });
    
    return { winnerId };
  },
});