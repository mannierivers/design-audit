import { defineSchema, defineTable } from "convex/server";
import { v } from "convex/values";

export default defineSchema({
  submissions: defineTable({
    userId: v.string(),
    studentName: v.optional(v.string()),
    teacherEmail: v.optional(v.string()),
    storageId: v.id("_storage"),
    title: v.string(),
    
    // FIXED: Made optional so old data doesn't crash the app
    contentType: v.optional(v.string()), 

    status: v.union(v.literal("pending"), v.literal("graded"), v.literal("failed")),
    gradeData: v.optional(
      v.object({
        score: v.number(),
        category: v.optional(v.string()),
        breakdown: v.optional(v.any()), 
        strengths: v.array(v.string()),
        weaknesses: v.array(v.string()),
        actionable_feedback: v.string(),
        recommendations: v.optional(v.any()),
      })
    ),
  })
  .index("by_user", ["userId"])
  .index("by_teacher", ["teacherEmail"]),

  users: defineTable({
    tokenIdentifier: v.string(),
    name: v.string(),
    email: v.string(),
    role: v.union(v.literal("student"), v.literal("teacher")),
  })
  .index("by_token", ["tokenIdentifier"]),
});