import { mutation, query, internalMutation } from "./_generated/server";
import { v } from "convex/values";

// 1. Generate Upload URL (for both Images and Videos)
export const generateUploadUrl = mutation(async (ctx) => {
  return await ctx.storage.generateUploadUrl();
});

// 2. Create Submission (Now includes contentType)
export const createSubmission = mutation({
  args: {
    storageId: v.id("_storage"),
    title: v.string(),
    teacherEmail: v.optional(v.string()),
    contentType: v.string(), // e.g. "image/png" or "video/mp4"
  },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const submissionId = await ctx.db.insert("submissions", {
      userId: identity.subject,
      studentName: identity.name || "Unknown Apprentice",
      storageId: args.storageId,
      title: args.title,
      teacherEmail: args.teacherEmail,
      contentType: args.contentType, // Store mime type
      status: "pending",
    });

    return submissionId;
  },
});

// 3. Get Student's Submissions (Maps storage ID to usable URLs)
export const getSubmissions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) return [];

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_user", (q) => q.eq("userId", identity.subject))
      .order("desc")
      .collect();

    // Generate secure URLs for thumbnails/video players
    return await Promise.all(
      submissions.map(async (sub) => ({
        ...sub,
        imageUrl: await ctx.storage.getUrl(sub.storageId),
      }))
    );
  },
});

// 4. Get Teacher's Submissions (For the Instructor View)
export const getTeacherSubmissions = query({
  handler: async (ctx) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity || !identity.email) return [];

    const submissions = await ctx.db
      .query("submissions")
      .withIndex("by_teacher", (q) => q.eq("teacherEmail", identity.email))
      .order("desc")
      .collect();

    return await Promise.all(
      submissions.map(async (sub) => ({
        ...sub,
        imageUrl: await ctx.storage.getUrl(sub.storageId),
      }))
    );
  },
});

// 5. Delete Submission (Removes DB Record AND File from Storage)
export const deleteSubmission = mutation({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    const identity = await ctx.auth.getUserIdentity();
    if (!identity) throw new Error("Unauthorized");

    const submission = await ctx.db.get(args.submissionId);
    if (!submission) return;

    // Security Check: Only the owner can delete
    if (submission.userId !== identity.subject) {
      throw new Error("Unauthorized delete request");
    }

    // 1. Delete the image/video file from Convex Storage
    if (submission.storageId) {
        await ctx.storage.delete(submission.storageId);
    }

    // 2. Delete the database record
    await ctx.db.delete(args.submissionId);
  },
});

// 6. Internal: Save Grade (Called by Gemini Action)
export const saveGrade = internalMutation({
  args: {
    submissionId: v.id("submissions"),
    gradeData: v.any(), // Flexible JSON structure
  },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, {
      status: "graded",
      gradeData: args.gradeData,
    });
  },
});

// 7. Internal: Fail Submission (Called if Gemini errors out)
export const failSubmission = internalMutation({
  args: { submissionId: v.id("submissions") },
  handler: async (ctx, args) => {
    await ctx.db.patch(args.submissionId, { status: "failed" });
  },
});