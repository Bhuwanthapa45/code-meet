// import { mutation, query } from "./_generated/server";
// import { v } from "convex/values";

// export const getAllInterviews = query({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     const interviews = await ctx.db.query("interviews").collect();

//     return interviews;
//   },
// });

// export const getMyInterviews = query({
//   handler: async (ctx) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) return [];

//     const interviews = await ctx.db
//       .query("interviews")
//       .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
//       .collect();

//     return interviews!;
//   },
// });

// export const getInterviewByStreamCallId = query({
//   args: { streamCallId: v.string() },
//   handler: async (ctx, args) => {
//     return await ctx.db
//       .query("interviews")
//       .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
//       .first();
//   },
// });

// export const createInterview = mutation({
//   args: {
//     title: v.string(),
//     description: v.optional(v.string()),
//     startTime: v.number(),
//     status: v.string(),
//     streamCallId: v.string(),
//     candidateId: v.string(),
//     interviewerIds: v.array(v.string()),
//   },
//   handler: async (ctx, args) => {
//     const identity = await ctx.auth.getUserIdentity();
//     if (!identity) throw new Error("Unauthorized");

//     return await ctx.db.insert("interviews", {
//       ...args,
//     });
//   },
// });

// export const updateInterviewStatus = mutation({
//   args: {
//     id: v.id("interviews"),
//     status: v.string(),
//   },
//   handler: async (ctx, args) => {
//     return await ctx.db.patch(args.id, {
//       status: args.status,
//       ...(args.status === "completed" ? { endTime: Date.now() } : {}),
//     });
//   },
// });

import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// Get all interviews (only if authenticated)
export const getAllInterviews = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthorized");

      const interviews = await ctx.db.query("interviews").collect();
      return interviews;
    } catch (error) {
      console.error("getAllInterviews error:", error);
      throw new Error("Failed to fetch interviews.");
    }
  },
});

// Get interviews for current user
export const getMyInterviews = query({
  handler: async (ctx) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) return [];

      const interviews = await ctx.db
        .query("interviews")
        .withIndex("by_candidate_id", (q) => q.eq("candidateId", identity.subject))
        .collect();

      return interviews!;
    } catch (error) {
      console.error("getMyInterviews error:", error);
      return [];
    }
  },
});

// Get interview by stream call ID
export const getInterviewByStreamCallId = query({
  args: { streamCallId: v.string() },
  handler: async (ctx, args) => {
    try {
      const interview = await ctx.db
        .query("interviews")
        .withIndex("by_stream_call_id", (q) => q.eq("streamCallId", args.streamCallId))
        .first();

      return interview;
    } catch (error) {
      console.error("getInterviewByStreamCallId error:", error);
      return null;
    }
  },
});

// Create a new interview
export const createInterview = mutation({
  args: {
    title: v.string(),
    description: v.optional(v.string()),
    startTime: v.number(),
    status: v.string(),
    streamCallId: v.string(),
    candidateId: v.string(),
    interviewerIds: v.array(v.string()),
  },
  handler: async (ctx, args) => {
    try {
      const identity = await ctx.auth.getUserIdentity();
      if (!identity) throw new Error("Unauthorized");

      const newInterview = await ctx.db.insert("interviews", {
        ...args,
      });

      return newInterview;
    } catch (error) {
      console.error("createInterview error:", error);
      throw new Error("Failed to create interview.");
    }
  },
});

// Update interview status
export const updateInterviewStatus = mutation({
  args: {
    id: v.id("interviews"),
    status: v.string(),
  },
  handler: async (ctx, args) => {
    try {
      const update = await ctx.db.patch(args.id, {
        status: args.status,
        ...(args.status === "completed" ? { endTime: Date.now() } : {}),
      });

      return update;
    } catch (error) {
      console.error("updateInterviewStatus error:", error);
      throw new Error("Failed to update interview status.");
    }
  },
});
