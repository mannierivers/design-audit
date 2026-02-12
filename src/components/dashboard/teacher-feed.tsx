"use client";

import { useState, useRef } from "react";
import { useQuery } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { 
  Minus, 
  Plus, 
  Download, 
  ExternalLink, 
  BookOpen, 
  BarChart3,
  Play,
  User
} from "lucide-react";
import { generateAuditPDF } from "@/lib/generate-pdf";

export function TeacherFeed() {
  const submissions = useQuery(api.submissions.getTeacherSubmissions);

  if (submissions === undefined) {
     return (
        <div className="flex justify-center p-12">
            <div className="h-1 w-1 bg-neutral-900 animate-ping" />
        </div>
     );
  }

  if (submissions.length === 0) {
    return (
      <div className="py-20 text-center border border-dashed border-neutral-300 bg-neutral-50/50">
        <p className="text-sm font-mono uppercase tracking-widest text-neutral-500">
            No Active Submissions
        </p>
        <p className="text-xs text-neutral-400 mt-2 max-w-xs mx-auto leading-relaxed">
            Ensure students have correctly input your instructor ID (email) during the upload protocol.
        </p>
      </div>
    );
  }

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between border-b border-neutral-200 pb-4">
        <h2 className="text-xl font-light tracking-tight">Classroom Feed</h2>
        <span className="text-xs font-mono text-neutral-400">{submissions.length} ENTRIES</span>
      </div>

      <div className="space-y-0 divide-y divide-neutral-100">
        {submissions.map((sub) => (
          <TeacherAuditRow key={sub._id} submission={sub} />
        ))}
      </div>
    </div>
  );
}

function TeacherAuditRow({ submission }: { submission: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const videoRef = useRef<HTMLVideoElement>(null);

  const isGraded = submission.status === "graded";
  const score = submission.gradeData?.score;
  const breakdown = submission.gradeData?.breakdown;
  const category = submission.gradeData?.category;
  
  // Detect if video
  const isVideo = submission.contentType?.startsWith("video");

  const handleDownload = (e: React.MouseEvent) => {
    e.stopPropagation();
    generateAuditPDF(submission);
  };

  const handleMouseEnter = () => {
    if (isVideo && videoRef.current) {
        videoRef.current.play().catch(e => console.log("Autoplay prevented", e));
    }
  };

  const handleMouseLeave = () => {
    if (isVideo && videoRef.current) {
        videoRef.current.pause();
        videoRef.current.currentTime = 0; 
    }
  };

  return (
    <div className="group relative transition-opacity duration-300">
      
      {/* SUMMARY ROW */}
      <div 
        onClick={() => isGraded && setIsExpanded(!isExpanded)}
        className={`
            grid grid-cols-[60px_1fr_100px_40px] gap-6 items-center py-6 cursor-pointer transition-colors
            ${isGraded ? "hover:bg-neutral-50" : "opacity-50 cursor-wait"}
        `}
      >
        {/* 1. THUMBNAIL */}
        <div 
            className="h-12 w-12 bg-neutral-100 border border-neutral-200 overflow-hidden relative"
            onMouseEnter={handleMouseEnter}
            onMouseLeave={handleMouseLeave}
        >
            {submission.imageUrl ? (
                isVideo ? (
                    <>
                        <video 
                            ref={videoRef}
                            src={submission.imageUrl} 
                            className="h-full w-full object-cover opacity-80 group-hover:opacity-100 transition-opacity"
                            muted
                            loop
                            playsInline
                        />
                        <div className="absolute inset-0 flex items-center justify-center pointer-events-none">
                            <Play className="h-3 w-3 text-white drop-shadow-md opacity-70" fill="currentColor" />
                        </div>
                    </>
                ) : (
                    // eslint-disable-next-line @next/next/no-img-element
                    <img 
                        src={submission.imageUrl} 
                        alt="Thumbnail" 
                        className="h-full w-full object-cover grayscale group-hover:grayscale-0 transition-all duration-500"
                    />
                )
            ) : (
                <div className="h-full w-full flex items-center justify-center bg-neutral-50 text-neutral-300">
                   <div className="h-2 w-2 bg-neutral-200 rounded-full" />
                </div>
            )}
        </div>

        {/* 2. INFO */}
        <div className="min-w-0">
            <h3 className="font-medium text-neutral-900 truncate pr-4">{submission.title}</h3>
            
            {/* Student Name & Date */}
            <div className="flex items-center gap-3 text-xs text-neutral-400 font-mono mt-1 uppercase">
                <span className="flex items-center gap-1 text-neutral-600 font-bold tracking-tight">
                    <User className="h-3 w-3" />
                    {submission.studentName || "Unknown"}
                </span>
                <span className="w-px h-3 bg-neutral-200" />
                <span>{new Date(submission._creationTime).toLocaleDateString()}</span>
            </div>
        </div>

        {/* 3. SCORE */}
        <div className="text-right pr-6">
            {score ? (
                <span className={`text-2xl font-light tracking-tighter ${
                    score >= 90 ? "text-neutral-900" : "text-neutral-500"
                }`}>
                    {score}<span className="text-xs ml-1 align-top opacity-30">/100</span>
                </span>
            ) : (
                <span className="text-xs font-mono">...</span>
            )}
        </div>

        {/* 4. EXPAND ICON */}
        <div className="flex items-center justify-end text-neutral-300">
            {isGraded && (
                isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />
            )}
        </div>
      </div>

      {/* EXPANDED DETAILS */}
      {isExpanded && submission.gradeData && (
        <div className="bg-neutral-50 p-8 border-t border-neutral-100 animate-in slide-in-from-top-2 duration-200">
            <div className="grid lg:grid-cols-[1fr_1fr_300px] gap-12">
                
                {/* Column 1: Metrics & Lists */}
                <div className="space-y-8">
                    {/* Scorecard */}
                    {breakdown && (
                        <div className="bg-white border border-neutral-200 p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                    <BarChart3 className="h-3 w-3" />
                                    Metric Analysis
                                </h4>
                                {category && (
                                    <span className="text-[10px] font-mono uppercase bg-neutral-100 px-2 py-1 rounded text-neutral-500">
                                        {category}
                                    </span>
                                )}
                            </div>
                            <div className="space-y-3">
                                {Object.entries(breakdown).map(([label, value]) => (
                                    <ScoreBar key={label} label={label} value={Number(value)} />
                                ))}
                            </div>
                        </div>
                    )}

                    {/* Strengths */}
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-neutral-400">Strengths</h4>
                        <ul className="space-y-2">
                            {submission.gradeData.strengths.map((s: string, i: number) => (
                                <li key={i} className="text-sm text-neutral-700 flex gap-3">
                                    <span className="block w-1 h-1 bg-neutral-300 mt-2 shrink-0" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>

                    {/* Weaknesses */}
                     <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-neutral-400">Weaknesses</h4>
                        <ul className="space-y-2">
                            {submission.gradeData.weaknesses.map((w: string, i: number) => (
                                <li key={i} className="text-sm text-neutral-700 flex gap-3">
                                    <span className="block w-1 h-1 bg-neutral-900 mt-2 shrink-0" />
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Column 2: Feedback & Resources */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-neutral-400">Director's Note</h4>
                    <p className="text-sm leading-7 text-neutral-600 font-serif italic mb-6">
                        "{submission.gradeData.actionable_feedback}"
                    </p>
                    
                    {submission.gradeData.recommendations && (
                        <div className="space-y-4 pt-6 border-t border-neutral-200">
                             <h4 className="text-xs font-bold uppercase tracking-widest text-neutral-400 flex items-center gap-2">
                                <BookOpen className="h-3 w-3" />
                                Referenced Standards
                             </h4>
                             <div className="space-y-4">
                                {submission.gradeData.recommendations.map((rec: any, i: number) => (
                                    <div key={i} className="bg-white border border-neutral-200 p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wide text-neutral-900">
                                                {rec.topic}
                                            </span>
                                            <a href={rec.resource_url} target="_blank" rel="noopener noreferrer">
                                                <ExternalLink className="h-3 w-3 text-neutral-400 hover:text-neutral-900" />
                                            </a>
                                        </div>
                                        <p className="text-xs text-neutral-500 mb-2 leading-relaxed">{rec.advice}</p>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>

                {/* Column 3: Actions */}
                <div className="pt-8 lg:pt-0 lg:border-l lg:border-neutral-200 lg:pl-8 flex flex-col justify-end">
                    <Button 
                        variant="outline" 
                        size="sm" 
                        className="w-full gap-2"
                        onClick={handleDownload}
                    >
                        <Download className="h-3 w-3" />
                        Download Report
                    </Button>
                </div>
             </div>
        </div>
      )}
    </div>
  );
}

// Helper
function ScoreBar({ label, value }: { label: string; value: number }) {
    const formattedLabel = label.replace(/([A-Z])/g, ' $1').replace(/^./, str => str.toUpperCase());
    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider text-neutral-500">
                <span>{formattedLabel}</span>
                <span>{value}/100</span>
            </div>
            <div className="h-2 w-full bg-neutral-100 overflow-hidden">
                <div className="h-full bg-neutral-900" style={{ width: `${value}%` }} />
            </div>
        </div>
    );
}