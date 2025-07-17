import { v } from "convex/values";
import { query, mutation } from "./_generated/server";
import { Doc, Id } from "./_generated/dataModel";

// Generate a 6-digit session code
function generateSessionCode(): string {
  return Math.floor(100000 + Math.random() * 900000).toString();
}

// Shuffle array helper
function shuffle<T>(array: T[]): T[] {
  const arr = [...array];
  for (let i = arr.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1));
    [arr[i], arr[j]] = [arr[j], arr[i]];
  }
  return arr;
}

// Create a new roulette session
export const createSession = mutation({
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
    // Get current user ID (would come from Clerk auth in real app)
    const userId = "demo-user"; // Replace with actual auth
    
    // Generate unique session code
    let sessionCode: string;
    let existingSession;
    do {
      sessionCode = generateSessionCode();
      existingSession = await ctx.db
        .query("sessions")
        .withIndex("by_code", (q) => q.eq("sessionCode", sessionCode))
        .first();
    } while (existingSession);
    
    // Create session
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

// Join an existing session
export const joinSession = mutation({
  args: {
    sessionCode: v.string(),
  },
  handler: async (ctx, args) => {
    const userId = "demo-user"; // Replace with actual auth
    
    // Find session by code
    const session = await ctx.db
      .query("sessions")
      .withIndex("by_code", (q) => q.eq("sessionCode", args.sessionCode))
      .first();
    
    if (!session) {
      throw new Error("Session not found");
    }
    
    if (session.status !== "pending") {
      throw new Error("Session has already started");
    }
    
    // Check if already a participant
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

// Start the wine spin
export const spinSession = mutation({
  args: {
    sessionId: v.id("sessions"),
    candidateCount: v.optional(v.number()),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    
    const userId = "demo-user"; // Replace with actual auth
    if (session.hostUserId !== userId) {
      throw new Error("Only the host can start the spin");
    }
    
    // Get wines matching criteria
    let winesQuery = ctx.db
      .query("products")
      .withIndex("by_category", (q) => q.eq("category", "wine"))
      .filter((q) => q.eq(q.field("active"), true));
    
    const wines = await winesQuery.collect();
    
    // Filter by region and other criteria
    let filteredWines = wines.filter(wine => 
      wine.origin?.region === session.region
    );
    
    // Apply price filter
    if (session.filters.priceMin || session.filters.priceMax) {
      // Would need to join with inventory to get prices
      // For now, using mock filtering
    }
    
    // Apply rating filter
    if (session.filters.ratingMin) {
      filteredWines = filteredWines.filter(wine => 
        wine.avgRating >= session.filters.ratingMin!
      );
    }
    
    // Shuffle and pick candidates
    const candidateCount = args.candidateCount || 4;
    const selectedWines = shuffle(filteredWines).slice(0, candidateCount);
    
    if (selectedWines.length === 0) {
      throw new Error("No wines found matching criteria");
    }
    
    // Clear existing candidates and votes
    const existingCandidates = await ctx.db
      .query("candidateWines")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    for (const candidate of existingCandidates) {
      await ctx.db.delete(candidate._id);
    }
    
    const existingVotes = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    for (const vote of existingVotes) {
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
    
    // Update session status
    await ctx.db.patch(args.sessionId, {
      status: "voting",
      updatedAt: Date.now(),
    });
    
    return { candidateCount: selectedWines.length };
  },
});

// Cast a vote
export const castVote = mutation({
  args: {
    sessionId: v.id("sessions"),
    productId: v.id("products"),
    upvote: v.boolean(),
  },
  handler: async (ctx, args) => {
    const userId = "demo-user"; // Replace with actual auth
    
    const session = await ctx.db.get(args.sessionId);
    if (!session || session.status !== "voting") {
      throw new Error("Session not available for voting");
    }
    
    // Check if user is a participant
    if (!session.participantIds.includes(userId)) {
      throw new Error("User is not a participant in this session");
    }
    
    // Remove any existing vote by this user for this product
    const existingVotes = await ctx.db
      .query("votes")
      .withIndex("by_user_session", (q) => 
        q.eq("userId", userId).eq("sessionId", args.sessionId)
      )
      .collect();
    
    for (const vote of existingVotes) {
      if (vote.productId === args.productId) {
        await ctx.db.delete(vote._id);
      }
    }
    
    // Cast new vote
    await ctx.db.insert("votes", {
      sessionId: args.sessionId,
      productId: args.productId,
      userId,
      upvote: args.upvote,
      createdAt: Date.now(),
    });
    
    // Check if all participants have voted
    const allVotes = await ctx.db
      .query("votes")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    const candidateWines = await ctx.db
      .query("candidateWines")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    const expectedVotes = session.participantIds.length * candidateWines.length;
    
    if (allVotes.length >= expectedVotes) {
      // Auto-finalize if everyone has voted
      await finalizeSessionInternal(ctx, args.sessionId);
    }
    
    return { success: true };
  },
});

// Finalize session and determine winner
async function finalizeSessionInternal(ctx: any, sessionId: Id<"sessions">) {
  const session = await ctx.db.get(sessionId);
  if (!session) throw new Error("Session not found");
  
  // Get all votes
  const votes = await ctx.db
    .query("votes")
    .withIndex("by_session", (q) => q.eq("sessionId", sessionId))
    .collect();
  
  // Tally votes
  const voteCount: Record<string, number> = {};
  for (const vote of votes) {
    const productId = vote.productId.toString();
    if (!voteCount[productId]) voteCount[productId] = 0;
    if (vote.upvote) voteCount[productId]++;
  }
  
  // Find winner
  let winnerId: Id<"products"> | undefined;
  let maxVotes = -1;
  
  for (const [productId, count] of Object.entries(voteCount)) {
    if (count > maxVotes) {
      maxVotes = count;
      winnerId = productId as Id<"products">;
    }
  }
  
  // Update session
  await ctx.db.patch(sessionId, {
    status: "complete",
    winnerId,
    updatedAt: Date.now(),
  });
  
  return winnerId;
}

export const finalizeSession = mutation({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const userId = "demo-user"; // Replace with actual auth
    
    const session = await ctx.db.get(args.sessionId);
    if (!session) throw new Error("Session not found");
    
    if (session.hostUserId !== userId) {
      throw new Error("Only the host can finalize the session");
    }
    
    const winnerId = await finalizeSessionInternal(ctx, args.sessionId);
    return { winnerId };
  },
});

// Get session details with real-time updates
export const getSession = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const session = await ctx.db.get(args.sessionId);
    if (!session) return null;
    
    // Get candidate wines with details
    const candidateWines = await ctx.db
      .query("candidateWines")
      .withIndex("by_session", (q) => q.eq("sessionId", args.sessionId))
      .collect();
    
    const candidatesWithDetails = await Promise.all(
      candidateWines.map(async (candidate) => {
        const product = await ctx.db.get(candidate.productId);
        if (!product) return null;
        
        // Get vote count for this product
        const votes = await ctx.db
          .query("votes")
          .withIndex("by_session", (q) => 
            q.eq("sessionId", args.sessionId)
          )
          .filter((q) => q.eq(q.field("productId"), candidate.productId))
          .collect();
        
        const upvotes = votes.filter(v => v.upvote).length;
        const downvotes = votes.filter(v => !v.upvote).length;
        
        return {
          candidateId: candidate._id,
          product,
          order: candidate.order,
          votes: { upvotes, downvotes },
        };
      })
    );
    
    return {
      ...session,
      candidates: candidatesWithDetails.filter(Boolean).sort((a, b) => a!.order - b!.order),
    };
  },
});

// Get user's votes for a session
export const getUserVotes = query({
  args: {
    sessionId: v.id("sessions"),
  },
  handler: async (ctx, args) => {
    const userId = "demo-user"; // Replace with actual auth
    
    const votes = await ctx.db
      .query("votes")
      .withIndex("by_user_session", (q) => 
        q.eq("userId", userId).eq("sessionId", args.sessionId)
      )
      .collect();
    
    const voteMap: Record<string, boolean> = {};
    for (const vote of votes) {
      voteMap[vote.productId.toString()] = vote.upvote;
    }
    
    return voteMap;
  },
});

// Get active sessions for a user
export const getUserSessions = query({
  args: {
    status: v.optional(v.union(v.literal("pending"), v.literal("voting"), v.literal("complete"))),
  },
  handler: async (ctx, args) => {
    const userId = "demo-user"; // Replace with actual auth
    
    let sessions = await ctx.db
      .query("sessions")
      .collect();
    
    // Filter by user participation
    sessions = sessions.filter(s => s.participantIds.includes(userId));
    
    // Filter by status if specified
    if (args.status) {
      sessions = sessions.filter(s => s.status === args.status);
    }
    
    // Sort by most recent
    sessions.sort((a, b) => b.updatedAt - a.updatedAt);
    
    return sessions;
  },
});