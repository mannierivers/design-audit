"use client";

import { UserButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RefreshCw } from "lucide-react";
import { ThemeToggle } from "@/components/ui/theme-toggle";

export function Header() {
  const user = useQuery(api.users.getUser);
  const updateRole = useMutation(api.users.updateRole);

  const toggleRole = async () => {
    if (!user) return;
    const newRole = user.role === "student" ? "teacher" : "student";
    await updateRole({ role: newRole });
  };

  return (
    <header className="border-b border-neutral-100 bg-[var(--bg-base)] sticky top-0 z-50 transition-colors duration-300">
      <div className="container mx-auto px-6 h-16 flex items-center justify-between">
        
        {/* Brand - UPDATED NAME */}
        <div className="flex items-center gap-4">
          <div className="h-4 w-4 bg-neutral-950" /> 
          <span className="font-semibold text-sm tracking-[0.2em] uppercase text-neutral-950">
            Design_Vision_AI
          </span>
        </div>

        <div className="flex items-center gap-6">
           
           {/* Role Switcher */}
           {user && (
             <button 
               onClick={toggleRole}
               className="hidden md:flex group items-center gap-2 text-xs font-mono text-neutral-400 hover:text-neutral-900 transition-colors uppercase tracking-wider"
             >
               <span className="group-hover:underline decoration-neutral-300 underline-offset-4">
                 View: {user.role}
               </span>
               <RefreshCw className="h-3 w-3 opacity-50 group-hover:opacity-100" />
             </button>
           )}
            
           <ThemeToggle />

           <div className="flex items-center gap-4">
              <UserButton afterSignOutUrl="/" />
           </div>
        </div>
      </div>
    </header>
  );
}