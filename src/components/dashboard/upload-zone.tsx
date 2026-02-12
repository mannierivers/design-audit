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

  // CONSTANTS
  const MAX_SIZE_MB = 50; // Increased for Video support
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
      
      if (!result.ok) throw new Error("Storage upload failed");

      const { storageId } = await result.json();
      
      // 3. Create Database Record
      const submissionId = await createSubmission({
        storageId,
        title: file.name,
        teacherEmail: teacherEmail || undefined,
        contentType: file.type, // Important: Save mime type for Gemini
      });

      // 4. Trigger Gemini AI Analysis
      await gradeDesign({ 
        storageId, 
        submissionId,
        contentType: file.type 
      });

      setTeacherEmail(""); // Reset email field on success
      
    } catch (error) {
      console.error(error);
      alert("System Error: Upload process failed.");
    } finally {
      setIsUploading(false);
    }
  };

  return (
    <div className="grid md:grid-cols-[1fr_300px] gap-8 items-start">
      
      {/* 1. Upload Area */}
      <div
        className={`
          relative border border-dashed h-64 flex flex-col items-center justify-between p-8 transition-all cursor-pointer group
          ${isDragOver 
            ? "border-neutral-950 bg-neutral-50" 
            : "border-neutral-300 hover:border-neutral-400 bg-(--bg-base)"}
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
        {/* Top Label */}
        <span className="text-xs font-mono uppercase tracking-widest text-neutral-400 group-hover:text-neutral-600 transition-colors">
            01. Input Source
        </span>

        {/* Center Action */}
        <div className="text-center space-y-4">
            <div className="flex items-center gap-3">
                <Button variant="outline" isLoading={isUploading} className="pointer-events-none">
                    Select File
                </Button>
                <span className="text-sm text-neutral-400 hidden sm:inline-block">or drag & drop</span>
            </div>
        </div>

        {/* Bottom Technical Specs */}
        <div className="w-full flex items-center justify-center gap-6 border-t border-neutral-200 pt-4 mt-2">
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 uppercase tracking-tight">
                <AlertCircle className="h-3 w-3" />
                <span>Max: {MAX_SIZE_MB}MB</span>
            </div>
            <div className="w-px h-3 bg-neutral-200" />
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 uppercase tracking-tight">
                <FileImage className="h-3 w-3" />
                <span>IMG</span>
            </div>
            <div className="flex items-center gap-2 text-[10px] font-mono text-neutral-400 uppercase tracking-tight">
                <Film className="h-3 w-3" />
                <span>VID</span>
            </div>
        </div>

        {/* Hidden Input */}
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

      {/* 2. Settings Area (Email) */}
      <div className="space-y-6 pt-2">
        
        <div className="space-y-4">
            <label className="block text-xs font-medium uppercase tracking-wider text-neutral-500">
                02. Routing (Optional)
            </label>
            <div className="flex gap-2 border-b border-neutral-200 pb-2 focus-within:border-neutral-950 transition-colors">
                <input 
                    type="email" 
                    placeholder="instructor@firm.com"
                    value={teacherEmail}
                    onChange={(e) => setTeacherEmail(e.target.value)}
                    className="w-full bg-transparent outline-none text-sm placeholder:text-neutral-300 font-mono text-neutral-900"
                />
                <ArrowUpRight className="h-4 w-4 text-neutral-300" />
            </div>
            <p className="text-[10px] text-neutral-400 leading-relaxed max-w-xs">
                Submissions are indexed and forwarded to the specified instructor address for internal review.
            </p>
        </div>

      </div>
    </div>
  );
}