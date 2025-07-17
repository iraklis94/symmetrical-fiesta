import { query } from "../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    // Get all candidates for the session
    const candidates = await ctx.db
      .query("candidateWines")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    if (candidates.length === 0) {
      return [];
    }
    
    // Get all votes for the session
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    // Create a vote count map
    const voteMap: Record<string, { upvotes: number; downvotes: number; userVote?: boolean }> = {};
    
    // Get current user's ID
    const identity = await ctx.auth.getUserIdentity();
    const currentUserId = identity?.subject;
    
    for (const vote of votes) {
      const productIdStr = vote.productId;
      if (!voteMap[productIdStr]) {
        voteMap[productIdStr] = { upvotes: 0, downvotes: 0 };
      }
      
      if (vote.upvote) {
        voteMap[productIdStr].upvotes++;
      } else {
        voteMap[productIdStr].downvotes++;
      }
      
      // Track current user's vote
      if (vote.userId === currentUserId) {
        voteMap[productIdStr].userVote = vote.upvote;
      }
    }
    
    // Get product details and combine with vote data
    const candidatesWithDetails = await Promise.all(
      candidates.map(async (candidate) => {
        const product = await ctx.db.get(candidate.productId);
        if (!product) {
          return null;
        }
        
        const productIdStr = candidate.productId;
        const voteData = voteMap[productIdStr] || { upvotes: 0, downvotes: 0 };
        
        return {
          candidateId: candidate._id,
          productId: candidate.productId,
          order: candidate.order,
          name: product.name,
          nameEn: product.nameEn,
          brand: product.brand,
          region: product.origin.region,
          country: product.origin.country,
          images: product.images,
          avgRating: product.avgRating,
          wineData: product.wineData,
          upvotes: voteData.upvotes,
          downvotes: voteData.downvotes,
          userVote: voteData.userVote,
          netVotes: voteData.upvotes - voteData.downvotes,
        };
      })
    );
    
    // Filter out null values and sort by order
    return candidatesWithDetails
      .filter((c) => c !== null)
      .sort((a, b) => a!.order - b!.order);
  },
});