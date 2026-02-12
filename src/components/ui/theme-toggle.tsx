"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { Monitor, Moon, Sun, Circle } from "lucide-react";

export function ThemeToggle() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  return (
    <div className="flex items-center gap-1 border border-neutral-200 bg-white p-1 rounded-full">
      <button
        onClick={() => setTheme("light")}
        className={`p-1.5 rounded-full transition-all ${theme === 'light' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-neutral-900'}`}
        title="Swiss (Light)"
      >
        <Sun className="h-3 w-3" />
      </button>
      <button
        onClick={() => setTheme("noir")}
        className={`p-1.5 rounded-full transition-all ${theme === 'noir' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-neutral-900'}`}
        title="Noir (Dark)"
      >
        <Moon className="h-3 w-3" />
      </button>
      <button
        onClick={() => setTheme("oyster")}
        className={`p-1.5 rounded-full transition-all ${theme === 'oyster' ? 'bg-neutral-900 text-white' : 'text-neutral-400 hover:text-neutral-900'}`}
        title="Oyster (Off-White)"
      >
        <Circle className="h-3 w-3" />
      </button>
    </div>
  );
}