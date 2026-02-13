"use client";

import { useState } from "react";
import { useMutation, useAction } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { ArrowUpRight, AlertCircle, FileImage, Film } from "lucide-react"; 

export function UploadZone() {
  const generateUploadUrl = useMutation(api.submissions.generateUploadUrl);
  const createSubmission = useMutation(api.submissions.createSubmission);
  const gradeDesign = useAction(api.grader.gradeDesign);

  const [isDragOver, setIsDragOver] = useState(false);
  const [isUploading, setIsUploading] = useState(false);
  const [teacherEmail, setTeacherEmail] = useState("");

  const MAX_SIZE_MB = 50; 
  const ALLOWED_TYPES = [
    "image/png", 
    "image/jpeg", 
    "image/webp",
    "video/mp4",
    "video/webm"
  ];

  const validateFile = (file: File) => {
    if (!ALLOWED_TYPES.includes(file.type)) {
      alert("ERR_INVALID_FORMAT: System accepts PNG, JPG, WEBP, MP4, and WEBM.");
      return false;
    }
    if (file.size > MAX_SIZE_MB * 1024 * 1024) {
      alert(`ERR_CAPACITY_EXCEEDED: File exceeds ${MAX_SIZE_MB}MB limit.`);
      return false;
    }
    return true;
  };

const handleFile = async (file: File) => {
    if (!file || !validateFile(file)) return;
    
    setIsUploading(true);
    try {
      // 1. Get secure upload URL
      const postUrl = await generateUploadUrl();

      // 2. Upload file to Convex Storage
      const result = await fetch(postUrl, {
        method: "POST",
        headers: { "Content-Type": file.type },
        body: file,
      });
      
      if (!result.ok) throw new Error(`Storage upload failed: ${result.statusText}`);

      const { storageId } = await result.json();
      
      // 3. Create Database Record
      const submissionId = await createSubmission({
        storageId,
        title: file.name,
        teacherEmail: teacherEmail || undefined,
        contentType: file.type,
      });

      // 4. Trigger Gemini AI Analysis (BACKGROUND)
      // We do NOT await this. We let it run on the server while we reset the UI.
      gradeDesign({ 
        storageId, 
        submissionId,
        contentType: file.type 
      });

      // 5. Success Feedback
      setTeacherEmail(""); 
      alert("Upload Successful! Analysis is running in the background.");
      
    } catch (error: any) {
      console.error("Upload Error Details:", error);
      // Show the actual error message to help debugging
      alert(`System Error: ${error.message || "Upload process failed."}`);
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="flex flex-col gap-8 w-full">
      
      {/* 1. Upload Area */}
      <div
        className={`
          relative border border-dashed h-64 w-full flex flex-col items-center justify-between p-6 transition-all cursor-pointer group
          ${isDragOver 
            ? "border-(--fg-base) bg-(--bg-panel)" 
            : "border-(--border-base) hover:border-(--fg-muted) bg-(--bg-base)"}
        `}
        onDragOver={(e) => { e.preventDefault(); setIsDragOver(true); }}
        onDragLeave={() => setIsDragOver(false)}
        onDrop={(e) => {
          e.preventDefault();
          setIsDragOver(false);
          const file = e.dataTransfer.files?.[0];
          if (file) handleFile(file);
        }}
      >
        <span className="text-[10px] font-mono uppercase tracking-widest text-(--fg-muted) group-hover:text-(--fg-base) transition-colors w-full text-left">
            // 01. Input Source
        </span>

        <div className="text-center space-y-4">
            <div className="flex flex-col items-center gap-3">
                <Button variant="outline" isLoading={isUploading} className="pointer-events-none w-full">
                    {isUploading ? "Uploading..." : "Select File"}
                </Button>
                <span className="text-[10px] text-(--fg-muted) font-mono uppercase">or drag & drop</span>
            </div>
        </div>

        {/* Technical Specs Footer */}
        <div className="w-full flex items-center justify-between border-t border-(--border-base) pt-3 mt-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-(--fg-muted) uppercase tracking-tight">
                <AlertCircle className="h-3 w-3" />
                <span>Max: {MAX_SIZE_MB}MB</span>
            </div>
            <div className="flex items-center gap-3">
                <div className="flex items-center gap-1 text-[10px] font-mono text-(--fg-muted) uppercase">
                    <FileImage className="h-3 w-3" />
                    <span>IMG</span>
                </div>
                <div className="flex items-center gap-1 text-[10px] font-mono text-(--fg-muted) uppercase">
                    <Film className="h-3 w-3" />
                    <span>VID</span>
                </div>
            </div>
        </div>

        <input
            type="file"
            accept={ALLOWED_TYPES.join(",")}
            className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) handleFile(file);
            }}
            disabled={isUploading}
        />
      </div>

      {/* 2. Routing Area */}
      <div className="space-y-4 border-t border-(--border-base) pt-8">
         <div className="flex items-center justify-between">
            <label className="text-[10px] font-mono uppercase tracking-widest text-(--fg-muted)">
                // 02. Routing Node
            </label>
            <span className="text-[9px] uppercase bg-(--bg-panel) text-(--fg-muted) border border-(--border-base) px-1 rounded">Optional</span>
         </div>

         <div className="flex gap-2 border-b border-(--border-base) pb-2 focus-within:border-(--fg-base) transition-colors">
            <input 
                type="email" 
                placeholder="instructor@firm.com"
                value={teacherEmail}
                onChange={(e) => setTeacherEmail(e.target.value)}
                className="w-full bg-transparent outline-none text-sm placeholder:text-(--fg-muted)/30 font-mono text-(--fg-base)"
            />
            <ArrowUpRight className="h-4 w-4 text-(--fg-muted)" />
         </div>
         <p className="text-[10px] text-(--fg-muted) leading-relaxed">
            Forward analysis packet to instructor ID for review.
         </p>
      </div>

    </div>
  );
}