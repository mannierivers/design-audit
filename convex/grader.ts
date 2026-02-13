"use node";
import { action } from "./_generated/server";
import { v } from "convex/values";
import { internal } from "./_generated/api";
import { GoogleGenerativeAI } from "@google/generative-ai";
import { GoogleAIFileManager, FileState } from "@google/generative-ai/server";
import fs from "fs";
import path from "path";
import os from "os";

const genAI = new GoogleGenerativeAI(process.env.GEMINI_API_KEY!);
const fileManager = new GoogleAIFileManager(process.env.GEMINI_API_KEY!);

export const gradeDesign = action({
  args: { 
    storageId: v.id("_storage"), 
    submissionId: v.id("submissions"),
    contentType: v.string() // <--- THIS is the missing argument causing your error
  },
  handler: async (ctx, args) => {
    try {
      // 1. Get file URL from Convex
      const fileUrl = await ctx.storage.getUrl(args.storageId);
      if (!fileUrl) throw new Error("File not found");

      // 2. Download the file buffer
      const response = await fetch(fileUrl);
      const buffer = await response.arrayBuffer();
      
      let promptParts: any[] = [];
      let geminiFile: any = null;

      // --- BRANCH A: VIDEO HANDLING ---
      if (args.contentType.startsWith("video")) {
        // Write to temp file (Gemini File API requires a path)
        const tempFilePath = path.join(os.tmpdir(), `upload-${Date.now()}.mp4`);
        fs.writeFileSync(tempFilePath, Buffer.from(buffer));

        // Upload to Gemini
        const uploadResult = await fileManager.uploadFile(tempFilePath, {
          mimeType: args.contentType,
          displayName: "Design Audit Video",
        });
        geminiFile = uploadResult.file;

        // Poll until active
        let file = await fileManager.getFile(geminiFile.name);
        while (file.state === FileState.PROCESSING) {
          await new Promise((resolve) => setTimeout(resolve, 2000)); // Wait 2s
          file = await fileManager.getFile(geminiFile.name);
        }

        if (file.state === FileState.FAILED) {
          throw new Error("Video processing failed by Gemini");
        }

        promptParts = [
          { fileData: { mimeType: file.mimeType, fileUri: file.uri } },
          { text: "Analyze this UI interaction/animation video." }
        ];

        // Cleanup temp file
        fs.unlinkSync(tempFilePath);
      } 
      
      // --- BRANCH B: IMAGE HANDLING ---
      else {
        // For images, we can send base64 inline (cheaper/faster than File API for small images)
        const base64Data = Buffer.from(buffer).toString("base64");
        promptParts = [
          { inlineData: { mimeType: args.contentType, data: base64Data } },
          { text: "Analyze this design image." }
        ];
      }

      // 3. Construct the "Director" Prompt
      const model = genAI.getGenerativeModel({ model: "gemini-2.0-flash" });

      const rubricPrompt = `
        You are a Senior Art Director.
        Analyze the attached design (image or video).
        
        If VIDEO: Focus on flow, interaction design, animation timing, and usability.
        If IMAGE: Focus on layout, typography, color, and hierarchy.

        Return valid JSON only:
        {
          "category": "String (e.g. 'Mobile App Interaction', 'Logo', 'Web Layout')",
          "breakdown": {
             "typography": (0-100),
             "hierarchy": (0-100),
             "color": (0-100),
             "layout": (0-100)
          },
          "score": (Average of metrics),
          "strengths": ["string", "string"],
          "weaknesses": ["string", "string"],
          "actionable_feedback": "Short summary.",
          "recommendations": [
            { "topic": "string", "advice": "string", "resource_title": "string", "resource_url": "string" }
          ]
        }
      `;

      // 4. Call Gemini
      const result = await model.generateContent([
        ...promptParts,
        { text: rubricPrompt }
      ]);
      
      const responseText = result.response.text();
      
      // Clean up JSON (Gemini sometimes adds markdown blocks)
      const cleanJson = responseText.replace(/```json/g, "").replace(/```/g, "").trim();
      
      let gradeData;
      try {
        gradeData = JSON.parse(cleanJson);
      } catch (e) {
        console.error("Failed to parse Gemini JSON:", cleanJson);
        throw new Error("Invalid JSON from AI");
      }

      // 5. Save to DB
      await ctx.runMutation(internal.submissions.saveGrade, {
        submissionId: args.submissionId,
        gradeData,
      });

      // 6. Cleanup Gemini Cloud Storage (Save money/space)
      if (geminiFile) {
        await fileManager.deleteFile(geminiFile.name);
      }

    } catch (error) {
      console.error(error);
      await ctx.runMutation(internal.submissions.failSubmission, {
        submissionId: args.submissionId,
      });
    }
  },
});