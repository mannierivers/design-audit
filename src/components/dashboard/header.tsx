"use client";

import { UserButton } from "@clerk/nextjs";
import { useQuery, useMutation } from "convex/react";
import { api } from "../../../convex/_generated/api";
import { RefreshCw, MessageSquareQuote } from "lucide-react";
import { ThemeSelector } from "@/components/ui/theme-selector";
import { useEffect, useState } from "react";

export function Header() {
  const user = useQuery(api.users.getUser);
  const updateRole = useMutation(api.users.updateRole);
  
  // State for the inspiring quote
  const [quote, setQuote] = useState<{ text: string; author: string } | null>(null);

  useEffect(() => {
    // Curated quotes from Designers & Filmmakers of Color
    const quotes = [
        { text: "There are 360 degrees, so why stick to one?", author: "Zaha Hadid" },
        { text: "To be an artist means never to avert one's eyes.", author: "Akira Kurosawa" },
        { text: "The visual is the primary medium.", author: "Barry Jenkins" },
        { text: "I did it for the 17-year-old version of myself.", author: "Virgil Abloh" },
        { text: "I want to disturb the dust.", author: "Steve McQueen" },
        { text: "A mood is a dangerous thing.", author: "Wong Kar-wai" }
    ];

    // Pick a random one on mount
    const randomQuote = quotes[Math.floor(Math.random() * quotes.length)];
    setQuote(randomQuote);
  }, []);

  const toggleRole = async () => {
    if (!user) return;
    const newRole = user.role === "student" ? "teacher" : "student";
    await updateRole({ role: newRole });
  };

  return (
    <header className="border-b border-(--border-base) bg-(--bg-base) sticky top-0 z-50 backdrop-blur-sm transition-colors duration-300">
      <div className="w-full flex items-center justify-between h-14">
        
        {/* LEFT: Branding */}
        <div className="flex items-center h-full px-6 border-r border-(--border-base) min-w-60">
          <div className="h-3 w-3 bg-(--accent) mr-3 animate-pulse" /> 
          <span className="font-bold text-xs tracking-[0.2em] uppercase text-(--fg-base)">
            Design_Vision_AI
          </span>
        </div>

        {/* CENTER: System Broadcast (Quote) */}
        <div className="hidden md:flex items-center justify-center flex-1 h-full px-4 overflow-hidden">
            <div className="flex items-center gap-3 text-[10px] font-mono text-(--fg-muted) uppercase tracking-widest animate-in fade-in slide-in-from-top-2 duration-1000">
                <MessageSquareQuote className="h-3 w-3 opacity-50" />
                {quote ? (
                    <span>
                        &quot;{quote.text}&quot; <span className="opacity-50 mx-2">//</span> {quote.author}
                    </span>
                ) : (
                    <span className="animate-pulse">ESTABLISHING UPLINK...</span>
                )}
            </div>
        </div>

        {/* RIGHT: User Controls */}
        <div className="flex items-center h-full px-6 border-l border-(--border-base) gap-6">
           {user && (
             <button 
               onClick={toggleRole}
               className="hidden md:flex group items-center gap-2 text-[10px] font-mono text-(--fg-muted) hover:text-(--fg-base) transition-colors uppercase tracking-widest"
             >
               <span className="group-hover:underline decoration-(--fg-muted) underline-offset-4">
                 VIEW: {user.role}
               </span>
               <RefreshCw className="h-3 w-3 opacity-50 group-hover:opacity-100" />
             </button>
           )}
            
           <ThemeSelector />

           <div className="flex items-center gap-4 pl-4 border-l border-(--border-base)">
              <UserButton afterSignOutUrl="/" />
           </div>
        </div>
      </div>
    </header>
  );
}