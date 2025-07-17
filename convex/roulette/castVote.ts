import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    sessionId: v.id("sessions"),
    productId: v.id("products"),
    upvote: v.boolean(),
  },
  handler: async (ctx, args) => {
    // Get the current user from Clerk via the identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject;
    
    // Verify session exists and is in voting state
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      throw new Error("Session not found");
    }
    
    if (session.status !== "voting") {
      throw new Error("Session is not accepting votes");
    }
    
    // Verify user is a participant
    if (!session.participantIds.includes(userId)) {
      throw new Error("You are not a participant in this session");
    }
    
    // Verify the product is a candidate
    const candidate = await ctx.db
      .query("candidateWines")
      .withIndex("by_session_product", (q) => 
        q.eq("sessionId", args.sessionId).eq("productId", args.productId)
      )
      .first();
      
    if (!candidate) {
      throw new Error("This wine is not a candidate in this session");
    }
    
    // Remove any existing vote by this user for this product
    const existingVote = await ctx.db
      .query("votes")
      .withIndex("by_session_product", (q) =>
        q.eq("sessionId", args.sessionId).eq("productId", args.productId)
      )
      .filter((q) => q.eq(q.field("userId"), userId))
      .first();
      
    if (existingVote) {
      await ctx.db.delete(existingVote._id);
    }
    
    // Cast the vote
    await ctx.db.insert("votes", {
      sessionId: args.sessionId,
      productId: args.productId,
      userId,
      upvote: args.upvote,
      createdAt: Date.now(),
    });
    
    return { success: true };
  },
});