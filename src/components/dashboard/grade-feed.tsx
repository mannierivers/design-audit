"use client";

import { useState, useRef } from "react";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { Button } from "@/components/ui/button";
import { 
  Minus, 
  Plus, 
  Trash2, 
  Loader2, 
  Download, 
  ExternalLink, 
  BookOpen, 
  BarChart3,
  Play
} from "lucide-react";
import { generateAuditPDF } from "@/lib/generate-pdf";

export function GradeFeed() {
  const submissions = useQuery(api.submissions.getSubmissions);

  if (!submissions) return null;

  return (
    <div className="space-y-12">
      <div className="flex items-end justify-between border-b border-(--border-base) pb-4">
        <h2 className="text-xl font-light tracking-tight uppercase text-(--fg-base)">Recent Audits</h2>
        <span className="text-xs font-mono text-(--fg-muted)">{submissions.length} ENTRIES</span>
      </div>

      <div className="space-y-0 divide-y divide-(--border-base)">
        {submissions.map((sub) => (
          <AuditRow key={sub._id} submission={sub} />
        ))}
        {submissions.length === 0 && (
            <div className="py-12 text-center text-sm text-(--fg-muted) font-mono uppercase">
                NO DATA AVAILABLE
            </div>
        )}
      </div>
    </div>
  );
}

function AuditRow({ submission }: { submission: any }) {
  const [isExpanded, setIsExpanded] = useState(false);
  const [isDeleting, setIsDeleting] = useState(false);
  
  const videoRef = useRef<HTMLVideoElement>(null);
  const deleteSubmission = useMutation(api.submissions.deleteSubmission);

  const isGraded = submission.status === "graded";
  const score = submission.gradeData?.score;
  const breakdown = submission.gradeData?.breakdown;
  const category = submission.gradeData?.category;
  
  const isVideo = submission.contentType?.startsWith("video");

  const handleDelete = async (e: React.MouseEvent) => {
    e.stopPropagation();
    if (!confirm("Are you sure you want to permanently delete this audit?")) return;
    
    setIsDeleting(true);
    try {
      await deleteSubmission({ submissionId: submission._id });
    } catch (error) {
      console.error("Failed to delete", error);
      setIsDeleting(false);
    }
  };

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
        {isDeleting && (
            <div className="absolute inset-0 bg-(--bg-base) opacity-80 z-10 flex items-center justify-center">
                <Loader2 className="h-4 w-4 animate-spin text-(--fg-muted)" />
            </div>
        )}

      {/* SUMMARY ROW */}
      <div 
        onClick={() => isGraded && setIsExpanded(!isExpanded)}
        className={`
            grid grid-cols-[60px_1fr_100px_80px] gap-6 items-center py-6 cursor-pointer transition-colors
            ${isGraded ? "hover:bg-(--bg-panel)" : "opacity-50 cursor-wait"}
        `}
      >
        {/* 1. THUMBNAIL */}
        <div 
            className="h-12 w-12 bg-(--bg-panel) border border-(--border-base) overflow-hidden relative"
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
                            <Play className="h-3 w-3 text-(--fg-base) drop-shadow-md opacity-70" fill="currentColor" />
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
                <div className="h-full w-full flex items-center justify-center bg-(--bg-panel) text-(--fg-muted)">
                   <div className="h-2 w-2 bg-(--border-base) rounded-full" />
                </div>
            )}
        </div>

        {/* 2. TITLE & DATE */}
        <div className="min-w-0">
            <h3 className="font-medium text-(--fg-base) truncate pr-4">{submission.title}</h3>
            <p className="text-xs text-(--fg-muted) font-mono mt-1 uppercase flex items-center gap-2">
                {new Date(submission._creationTime).toLocaleDateString()} — {submission.status}
                {isVideo && <span className="bg-(--bg-panel) border border-(--border-base) text-[9px] px-1 rounded text-(--fg-muted)">VID</span>}
            </p>
        </div>

        {/* 3. SCORE */}
        <div className="text-right pr-6">
            {score ? (
                <span className={`text-2xl font-light tracking-tighter ${
                    score >= 90 ? "text-(--fg-base)" : "text-(--fg-muted)"
                }`}>
                    {score}<span className="text-xs ml-1 align-top opacity-30">/100</span>
                </span>
            ) : (
                <span className="text-xs font-mono text-(--fg-muted)">...</span>
            )}
        </div>

        {/* 4. ACTIONS */}
        <div className="flex items-center justify-end gap-4 text-(--fg-muted) pr-2">
            <button 
                onClick={handleDelete}
                className="opacity-0 group-hover:opacity-100 hover:text-red-600 transition-all duration-200 p-2"
                title="Delete Audit"
            >
                <Trash2 className="h-4 w-4" />
            </button>
            <div>
                {isGraded && (
                    isExpanded ? <Minus className="h-4 w-4" /> : <Plus className="h-4 w-4" />
                )}
            </div>
        </div>
      </div>

      {/* EXPANDED DETAILS */}
      {isExpanded && submission.gradeData && (
        <div className="bg-(--bg-panel) p-8 border-t border-(--border-base) animate-in slide-in-from-top-2 duration-200">
            <div className="grid lg:grid-cols-[1fr_1fr_300px] gap-12">
                
                {/* Column 1: Scorecard & Lists */}
                <div className="space-y-8">
                    
                    {/* Dynamic Breakdown Scorecard */}
                    {breakdown && (
                        <div className="bg-(--bg-base) border border-(--border-base) p-6 mb-6">
                            <div className="flex justify-between items-center mb-4">
                                <h4 className="text-xs font-bold uppercase tracking-widest text-(--fg-muted) flex items-center gap-2">
                                    <BarChart3 className="h-3 w-3" />
                                    Metric Analysis
                                </h4>
                                {category && (
                                    <span className="text-[10px] font-mono uppercase bg-(--bg-panel) px-2 py-1 rounded text-(--fg-muted) border border-(--border-base)">
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

                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-(--fg-muted)">Strengths</h4>
                        <ul className="space-y-2">
                            {submission.gradeData.strengths.map((s: string, i: number) => (
                                <li key={i} className="text-sm text-(--fg-base) flex gap-3">
                                    <span className="block w-1 h-1 bg-(--fg-muted) mt-2 shrink-0" />
                                    {s}
                                </li>
                            ))}
                        </ul>
                    </div>
                    <div>
                        <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-(--fg-muted)">Weaknesses</h4>
                        <ul className="space-y-2">
                            {submission.gradeData.weaknesses.map((w: string, i: number) => (
                                <li key={i} className="text-sm text-(--fg-base) flex gap-3">
                                    <span className="block w-1 h-1 bg-(--fg-muted) mt-2 shrink-0" />
                                    {w}
                                </li>
                            ))}
                        </ul>
                    </div>
                </div>

                {/* Column 2: Director's Note & Citations */}
                <div>
                    <h4 className="text-xs font-bold uppercase tracking-widest mb-4 text-(--fg-muted)">Director's Note</h4>
                    <p className="text-sm leading-7 text-(--fg-base) font-serif italic mb-6">
                        "{submission.gradeData.actionable_feedback}"
                    </p>
                    
                    {submission.gradeData.recommendations && (
                        <div className="space-y-4 pt-6 border-t border-(--border-base)">
                             <h4 className="text-xs font-bold uppercase tracking-widest text-(--fg-muted) flex items-center gap-2">
                                <BookOpen className="h-3 w-3" />
                                Referenced Standards
                             </h4>
                             <div className="space-y-4">
                                {submission.gradeData.recommendations.map((rec: any, i: number) => (
                                    <div key={i} className="bg-(--bg-base) border border-(--border-base) p-4">
                                        <div className="flex justify-between items-start mb-2">
                                            <span className="text-xs font-bold uppercase tracking-wide text-(--fg-base)">
                                                {rec.topic}
                                            </span>
                                            <a 
                                                href={rec.resource_url} 
                                                target="_blank" 
                                                rel="noopener noreferrer"
                                                className="text-(--fg-muted) hover:text-(--fg-base)"
                                            >
                                                <ExternalLink className="h-3 w-3" />
                                            </a>
                                        </div>
                                        <p className="text-xs text-(--fg-muted) mb-3 leading-relaxed">
                                            {rec.advice}
                                        </p>
                                        <a 
                                            href={rec.resource_url}
                                            target="_blank"
                                            rel="noopener noreferrer" 
                                            className="text-[10px] font-mono text-(--fg-muted) hover:underline uppercase"
                                        >
                                            Source: {rec.resource_title}
                                        </a>
                                    </div>
                                ))}
                             </div>
                        </div>
                    )}
                </div>

                {/* Column 3: Actions */}
                <div className="pt-8 lg:pt-0 lg:border-l lg:border-(--border-base) lg:pl-8 flex flex-col justify-end">
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

// Helper Component for the Bar Charts
function ScoreBar({ label, value }: { label: string; value: number }) {
    const formattedLabel = label
        .replace(/([A-Z])/g, ' $1')
        .replace(/^./, str => str.toUpperCase());

    return (
        <div className="space-y-1">
            <div className="flex justify-between text-[10px] uppercase font-mono tracking-wider text-(--fg-muted)">
                <span>{formattedLabel}</span>
                <span>{value}/100</span>
            </div>
            <div className="h-2 w-full bg-(--bg-panel) overflow-hidden border border-(--border-base)">
                <div 
                    className="h-full bg-(--fg-base) transition-all duration-1000" 
                    style={{ width: `${value}%` }} 
                />
            </div>
        </div>
    );
}