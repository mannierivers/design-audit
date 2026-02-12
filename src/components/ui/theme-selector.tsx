"use client";

import { useTheme } from "next-themes";
import { useEffect, useState } from "react";
import { ChevronDown, Palette } from "lucide-react";
import { Button } from "@/components/ui/button";

const themes = [
  { id: "light", name: "Swiss", color: "#ffffff" },
  { id: "noir", name: "Noir", color: "#050505" },
  { id: "oyster", name: "Oyster", color: "#e6e4e0" },
  { id: "terminal", name: "Terminal", color: "#020a02" },
  { id: "cobalt", name: "Cobalt", color: "#020617" },
  { id: "ember", name: "Ember", color: "#450a0a" },
  { id: "slate", name: "Slate", color: "#18181b" },
];

export function ThemeSelector() {
  const { theme, setTheme } = useTheme();
  const [mounted, setMounted] = useState(false);
  const [isOpen, setIsOpen] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  if (!mounted) return null;

  // Find active theme object
  const activeTheme = themes.find((t) => t.id === theme) || themes[0];

  return (
    <div className="relative">
      {/* Trigger Button */}
      <button
        onClick={() => setIsOpen(!isOpen)}
        onBlur={() => setTimeout(() => setIsOpen(false), 200)}
        className="flex items-center gap-2 px-3 py-1.5 border border-(--border-base) hover:bg-(--bg-panel) transition-colors text-[10px] font-mono uppercase tracking-widest text-(--fg-muted) hover:text-(--fg-base)"
      >
        <div 
            className="h-2 w-2 rounded-full border border-(--border-base)" 
            style={{ backgroundColor: activeTheme.color }}
        />
        <span className="hidden sm:inline-block">Sys_Theme: {activeTheme.name}</span>
        <ChevronDown className="h-3 w-3 opacity-50" />
      </button>

      {/* Dropdown Menu */}
      {isOpen && (
        <div className="absolute top-full right-0 mt-2 w-48 bg-(--bg-base) border border-(--border-base) shadow-2xl z-50 animate-in fade-in zoom-in-95 duration-100 p-1">
            <div className="text-[9px] uppercase font-mono text-(--fg-muted) px-2 py-1 border-b border-(--border-base) mb-1">
                Select Interface
            </div>
            {themes.map((t) => (
                <button
                    key={t.id}
                    onClick={() => {
                        setTheme(t.id);
                        setIsOpen(false);
                    }}
                    className={`
                        w-full flex items-center gap-3 px-3 py-2 text-[10px] uppercase font-mono tracking-wider transition-colors text-left
                        ${theme === t.id ? "bg-(--fg-base) text-(--bg-base)" : "text-(--fg-muted) hover:bg-(--bg-panel) hover:text-(--fg-base)"}
                    `}
                >
                    <div 
                        className="h-2 w-2 border border-current"
                        style={{ backgroundColor: t.color }} 
                    />
                    {t.name}
                </button>
            ))}
        </div>
      )}
    </div>
  );
}