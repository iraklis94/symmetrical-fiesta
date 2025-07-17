import { mutation } from "../_generated/server";
import { v } from "convex/values";

export default mutation({
  args: {
    sessionCode: v.string(),
  },
  handler: async (ctx, args) => {
    // Get the current user from Clerk via the identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject; // Clerk user ID
    
    // Find session by code
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_code", (q) => q.eq("sessionCode", args.sessionCode))
      .first();
      
    if (!session) {
      throw new Error("Session not found");
    }
    
    if (session.status !== "pending") {
      throw new Error("Session is no longer accepting participants");
    }
    
    // Check if user is already in the session
    if (session.participantIds.includes(userId)) {
      return { sessionId: session._id, alreadyJoined: true };
    }
    
    // Add user to participants
    await ctx.db.patch(session._id, {
      participantIds: [...session.participantIds, userId],
      updatedAt: Date.now(),
    });
    
    return { sessionId: session._id, alreadyJoined: false };
  },
});