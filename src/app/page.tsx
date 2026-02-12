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

export default function Home() {
  const user = useQuery(api.users.getUser);
  const { user: clerkUser } = useUser();

  return (
    <div className="min-h-screen bg-[var(--bg-base)] text-neutral-900 selection:bg-neutral-900 selection:text-white flex flex-col transition-colors duration-300">
      <Header />
      
      <main className="container mx-auto px-6 py-16 max-w-5xl flex-grow">
        <SignedIn>
          {user === undefined ? (
             <div className="flex justify-center pt-20">
                <div className="h-1 w-1 bg-neutral-900 animate-ping" />
             </div>
          ) : user === null ? (
            <RoleSelection />
          ) : (
            <div className="space-y-24 animate-in fade-in duration-1000">
              
              {/* STUDENT VIEW */}
              {user.role === "student" && (
                <>
                  <section>
                    <div className="mb-12 max-w-lg">
                        <h1 className="text-4xl font-light tracking-tight mb-4">Submission Protocol</h1>
                        <p className="text-neutral-500 leading-relaxed">
                            Upload high-fidelity UI exports or video motion captures.
                            The neural engine will analyze static layout or kinetic flow.
                        </p>
                    </div>
                    <UploadZone />
                  </section>
                  <section>
                    <GradeFeed />
                  </section>
                </>
              )}

              {/* TEACHER VIEW */}
              {user.role === "teacher" && (
                <section>
                  <div className="mb-12 border-l-2 border-neutral-900 pl-6 py-2">
                     <h1 className="text-2xl font-medium tracking-tight">Instructor Dashboard</h1>
                     <p className="text-sm text-neutral-500 mt-2 font-mono">
                        ID: {clerkUser?.primaryEmailAddress?.emailAddress}
                     </p>
                  </div>
                  <TeacherFeed />
                </section>
              )}
            </div>
          )}
        </SignedIn>

        <SignedOut>
             <div className="flex flex-col items-center justify-center min-h-[60vh] text-center space-y-8">
                <h1 className="text-5xl md:text-8xl font-bold tracking-tighter">
                    DESIGN_VISION_AI
                </h1>
                <p className="text-xl md:text-2xl text-neutral-500 font-light max-w-2xl leading-relaxed">
                    Multimodal design scoring for the modern web.
                    <br />
                    <span className="text-sm font-mono opacity-50 block mt-4 uppercase tracking-widest">
                        Images • Video • Motion
                    </span>
                </p>
                <SignInButton mode="modal">
                    <Button size="lg" className="h-14 px-10 text-lg rounded-full">
                        Initialize Audit
                    </Button>
                </SignInButton>
             </div>
        </SignedOut>

      </main>

      {/* FOOTER */}
      <footer className="border-t border-neutral-100 py-8 mt-12">
        <div className="container mx-auto px-6 flex justify-center">
            <a 
                href="https://www.jetnoir.systems/" 
                target="_blank" 
                rel="noopener noreferrer"
                className="text-[10px] uppercase tracking-[0.2em] font-mono text-neutral-400 hover:text-neutral-900 transition-colors flex items-center gap-2"
            >
                <div className="h-2 w-2 bg-neutral-900 rotate-45" />
                Built by Jet Noir Systems
            </a>
        </div>
      </footer>
    </div>
  );
}