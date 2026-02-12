"use client";

import { useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { ArrowRight } from "lucide-react";

export function RoleSelection() {
  const createUser = useMutation(api.users.createUser);

  return (
    <div className="fixed inset-0 z-50 flex bg-white">
      {/* Student Side */}
      <button 
        onClick={() => createUser({ role: "student" })}
        className="flex-1 flex flex-col justify-center items-center p-12 hover:bg-neutral-50 transition-colors border-r border-neutral-100 group text-left"
      >
        <div className="max-w-xs space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest text-neutral-400">01.</span>
            <h2 className="text-3xl font-light tracking-tight">Student</h2>
            <p className="text-sm text-neutral-500 leading-relaxed">
                Submit work for algorithmic review and design audit.
            </p>
            <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                <ArrowRight className="h-5 w-5" />
            </div>
        </div>
      </button>

      {/* Teacher Side */}
      <button 
        onClick={() => createUser({ role: "teacher" })}
        className="flex-1 flex flex-col justify-center items-center p-12 hover:bg-neutral-950 hover:text-white transition-colors group text-left"
      >
        <div className="max-w-xs space-y-4">
            <span className="font-mono text-xs uppercase tracking-widest opacity-50">02.</span>
            <h2 className="text-3xl font-light tracking-tight">Instructor</h2>
            <p className="text-sm opacity-60 leading-relaxed">
                Review submissions routed to your agency identifier.
            </p>
             <div className="pt-4 opacity-0 group-hover:opacity-100 transition-opacity -translate-x-2 group-hover:translate-x-0 duration-300">
                <ArrowRight className="h-5 w-5" />
            </div>
        </div>
      </button>
    </div>
  );
}