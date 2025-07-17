import { mutation } from "../_generated/server";
import { v } from "convex/values";

// Generate a random 6-digit code
function generateSessionCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

export default mutation({
  args: {
    region: v.string(),
    filters: v.object({
      priceMin: v.optional(v.number()),
      priceMax: v.optional(v.number()),
      ratingMin: v.optional(v.number()),
      categories: v.optional(v.array(v.string())),
    }),
  },
  handler: async (ctx, args) => {
    // Get the current user from Clerk via the identity
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) {
      throw new Error("Unauthorized");
    }
    
    const userId = identity.subject; // Clerk user ID
    
    // Generate a unique session code
    let sessionCode: string;
    let existingSession;
    do {
      sessionCode = generateSessionCode();
      existingSession = await ctx.db
        .query("sessions")
        .withIndex("by_code", (q) => q.eq("sessionCode", sessionCode))
        .first();
    } while (existingSession);
    
    // Create the session
    const sessionId = await ctx.db.insert("sessions", {
      hostUserId: userId,
      sessionCode,
      region: args.region,
      filters: args.filters,
      participantIds: [userId],
      status: "pending",
      createdAt: Date.now(),
      updatedAt: Date.now(),
    });
    
    return { sessionId, sessionCode };
  },
});