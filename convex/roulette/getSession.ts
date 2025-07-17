import { query } from "../_generated/server";
import { v } from "convex/values";

export default query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) {
      return null;
    }
    
    // Get participant details
    // Note: In a real app, you'd fetch user details from Clerk
    // For now, we'll just return the IDs
    const participants = session.participantIds.map((id) => ({
      id,
      name: `User ${id.slice(-4)}`, // Temporary placeholder
      avatar: null,
    }));
    
    return {
      ...session,
      participants,
      isHost: false, // Will be determined on client side
    };
  },
});