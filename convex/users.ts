import { mutation, query } from "./_generated/server";
import { v } from "convex/values";

// ... (Keep existing getUser and createUser) ...

export const getUser = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return null;

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    return user;
  },
});

export const createUser = mutation({
  args: { role: v.union(v.literal("student"), v.literal("teacher")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const existing = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (existing) return existing._id;

    return await ctx.db.insert("users", {
      tokenIdentifier: identity.subject,
      name: identity.name || "Anonymous",
      email: identity.email!,
      role: args.role,
    });
  },
});

// NEW: Add this function to allow role switching
export const updateRole = mutation({
  args: { role: v.union(v.literal("student"), v.literal("teacher")) },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const user = await ctx.db
      .query("users")
      .withIndex("by_token", (q) => q.eq("tokenIdentifier", identity.subject))
      .unique();

    if (!user) throw new Error("User not found");

    await ctx.db.patch(user._id, { role: args.role });
  },
});