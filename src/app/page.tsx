"use client";

import { useQuery } from "convex/react";
import { api } from "../../convex/_generated/api";
import { SignedIn, SignedOut, SignInButton, useUser } from "@clerk/nextjs";
import { Header } from "@/components/dashboard/header";
import { UploadZone } from "@/components/dashboard/upload-zone";
import { GradeFeed } from "@/components/dashboard/grade-feed";
import { TeacherFeed } from "@/components/dashboard/teacher-feed";
import { RoleSelection } from "@/components/dashboard/role-selection";
import { Button } from "@/components/ui/button";
import { ArrowRight } from "lucide-react";
import Image from "next/image"; // Import Image

export function Footer() {
    return (
      <footer className="border-t border-(--border-base) py-8 mt-auto bg-(--bg-base)">
        <div className="container mx-auto px-6 flex flex-col md:flex-row justify-between items-center gap-4">
            <div className="text-[10px] uppercase tracking-[0.2em] font-mono text-(--fg-muted)">
                © 2026 Jet Noir Systems, LLC.
            </div>
            
            <a 
                href="https://www.jetnoir.systems/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="group text-[10px] uppercase tracking-[0.2em] font-mono text-(--fg-muted) hover:text-(--fg-base) transition-colors flex items-center gap-2"
            >
                BUILT BY JET NOIR SYSTEMS
                
                {/* Tiny Subtle Paper Plane Logo */}
                <div className="relative h-4 w-4 opacity-40 group-hover:opacity-100 transition-opacity duration-300">
                    <Image 
                        src="/jet-noir-logo-wht.svg" 
                        alt="Jet Noir" 
                        fill
                        className="object-contain"
                    />
                </div>
            </a>
        </div>
      </footer>
    );
}

export default function Home() {
  const user = useQuery(api.users.getUser);
  const { user: clerkUser } = useUser();

  return (
    <div className="min-h-screen bg-(--bg-base) text-(--fg-base) flex flex-col font-sans">
      <Header />
      
      <main className="grow flex flex-col">
        <SignedIn>
          {user === undefined ? (
             <div className="grow flex items-center justify-center">
                <div className="flex flex-col items-center gap-4">
                    <div className="h-1 w-12 bg-(--fg-base) animate-pulse" />
                    <span className="text-xs font-mono tracking-widest text-(--fg-muted)">
                        ESTABLISHING SECURE CONNECTION...
                    </span>
                </div>
             </div>
          ) : user === null ? (
            <RoleSelection />
          ) : (
            <div className="container mx-auto px-0 md:px-6 py-12 max-w-7xl animate-in fade-in duration-700">
              
              {/* TOP BAR: CONTEXT */}
              <div className="flex items-center justify-between mb-8 border-b border-(--border-base) pb-4 mx-4 md:mx-0">
                 <div className="flex items-center gap-4">
                    <span className="bg-(--fg-base) text-(--bg-base) text-[10px] font-bold px-2 py-1 uppercase tracking-wider">
                        Live_Deployment
                    </span>
                    <h1 className="text-sm font-mono uppercase tracking-widest text-(--fg-muted)">
                        Sector: {user.role === 'student' ? 'Upload_Protocol' : 'Command_Console'}
                    </h1>
                 </div>
                 <div className="hidden md:block text-[10px] font-mono text-(--fg-muted)">
                    SECURE_CHANNEL // V.2.0.4
                 </div>
              </div>

              {/* STUDENT VIEW */}
              {user.role === "student" && (
                <div className="grid lg:grid-cols-[360px_1fr] gap-0 lg:gap-16">
                  
                  {/* LEFT COLUMN: CONTROL PANEL */}
                  <section className="border-r border-(--border-base) pr-0 lg:pr-12 pb-12 lg:pb-0">
                    <div className="mb-8">
                        <h2 className="text-xl font-bold tracking-tight mb-2 uppercase">Input Stream</h2>
                        <div className="h-1 w-8 bg-(--fg-base) mb-4" />
                        <p className="text-xs text-(--fg-muted) leading-relaxed font-mono">
                            Initialize analysis protocol. 
                            <br />
                            System accepts static layout or kinetic flow.
                        </p>
                    </div>
                    <UploadZone />
                  </section>
                  
                  {/* RIGHT COLUMN: DATA FEED */}
                  <section>
                    <div className="mb-8 flex items-center justify-between">
                         <h2 className="text-xl font-bold tracking-tight uppercase">Analysis Logs</h2>
                         <div className="h-px grow bg-(--border-base) ml-6 opacity-50" />
                    </div>
                    <GradeFeed />
                  </section>
                </div>
              )}

              {/* TEACHER VIEW */}
              {user.role === "teacher" && (
                <section>
                  <div className="bg-(--bg-panel) border border-(--border-base) p-6 mb-12 flex flex-col md:flex-row items-start md:items-center justify-between gap-4">
                     <div>
                        <h1 className="text-xl font-bold tracking-tight uppercase mb-1">Instructor Node</h1>
                        <p className="text-xs text-(--fg-muted) font-mono">
                            ID: <span className="text-(--fg-base)">{clerkUser?.primaryEmailAddress?.emailAddress}</span>
                        </p>
                     </div>
                     <div className="text-[10px] font-mono text-(--fg-muted) uppercase border border-(--border-base) px-3 py-1">
                        Status: Active
                     </div>
                  </div>
                  <TeacherFeed />
                </section>
              )}
            </div>
          )}
        </SignedIn>

        <SignedOut>
             <div className="grow flex flex-col relative overflow-hidden">
                
                {/* HERO SECTION */}
                <div className="grow flex flex-col items-center justify-center text-center px-6 relative z-10">
                    <div className="mb-6 flex items-center gap-3 border border-(--border-base) px-4 py-2 bg-(--bg-panel) backdrop-blur-md">
                        <div className="h-2 w-2 bg-green-500 rounded-full animate-pulse" />
                        <span className="text-[10px] font-mono uppercase tracking-widest text-(--fg-muted)">
                            System Nominal
                        </span>
                    </div>

                    <h1 className="text-5xl md:text-8xl font-black tracking-tighter mb-6 uppercase text-(--fg-base)">
                        Design<br />Vision<br />AI
                    </h1>
                    
                    <p className="text-lg md:text-xl text-(--fg-muted) font-light max-w-xl leading-relaxed mb-10">
                        Multimodal design analysis engine.
                        <br />
                        <span className="text-xs font-mono block mt-4 uppercase tracking-[0.3em] opacity-70">
                            Images // Video // Motion
                        </span>
                    </p>
                    
                    <SignInButton mode="modal">
                        <Button className="h-14 pl-8 pr-6 text-lg rounded-none border border-(--fg-base) bg-transparent text-(--fg-base) hover:bg-(--fg-base) hover:text-(--bg-base) transition-all group">
                            INITIALIZE PROTOCOL
                            <ArrowRight className="ml-4 h-5 w-5 group-hover:translate-x-1 transition-transform" />
                        </Button>
                    </SignInButton>
                </div>

                {/* DECORATIVE GRID */}
                <div className="absolute inset-0 z-0 pointer-events-none opacity-20" 
                     style={{ 
                         backgroundImage: 'linear-gradient(var(--border-base) 1px, transparent 1px), linear-gradient(90deg, var(--border-base) 1px, transparent 1px)', 
                         backgroundSize: '40px 40px' 
                     }} 
                />
             </div>
        </SignedOut>

      </main>

      <Footer />
    </div>
  );
}