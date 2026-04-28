"use client";

import { Moon, Sun } from "lucide-react";
import { useEffect, useState } from "react";
import { useSettings } from "@/components/SettingsProvider";

export default function ThemeToggle() {
  const [isDark, setIsDark] = useState(false);
  const { settings, loading } = useSettings();

  useEffect(() => {
    if (loading) return; // Wait for settings to load

    const savedTheme = localStorage.getItem("theme");
    
    let shouldBeDark = false;

    if (savedTheme === "dark") {
      shouldBeDark = true;
    } else if (!savedTheme) {
      if (settings?.defaultTheme === "dark") {
        shouldBeDark = true;
      } else if (settings?.defaultTheme === "system") {
        shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
      } else {
        shouldBeDark = false; // "light" or undefined
      }
    }

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
      setIsDark(true);
    } else {
      document.documentElement.classList.remove("dark");
      setIsDark(false);
    }
  }, [settings, loading]);

  const toggleTheme = () => {
    if (isDark) {
      document.documentElement.classList.remove("dark");
      localStorage.setItem("theme", "light");
      setIsDark(false);
    } else {
      document.documentElement.classList.add("dark");
      localStorage.setItem("theme", "dark");
      setIsDark(true);
    }
  };

  return (
    <button
      onClick={toggleTheme}
      className="fixed bottom-10 right-10 z-[200] w-14 h-14 bg-slate-900 dark:bg-white text-white dark:text-slate-900 rounded-full shadow-2xl flex items-center justify-center hover:scale-110 active:scale-95 transition-all duration-300 group overflow-hidden"
      aria-label="Toggle Theme"
    >
      <div className="relative w-6 h-6">
        <Sun 
          className={`absolute inset-0 transition-transform duration-500 ${isDark ? 'rotate-90 scale-0' : 'rotate-0 scale-100'}`} 
          size={24} 
        />
        <Moon 
          className={`absolute inset-0 transition-transform duration-500 ${isDark ? 'rotate-0 scale-100' : '-rotate-90 scale-0'}`} 
          size={24} 
        />
      </div>
      
      {/* Tooltip */}
      <span className="absolute right-full mr-4 px-3 py-1.5 bg-slate-900 text-white text-[10px] font-black uppercase tracking-widest rounded-lg opacity-0 group-hover:opacity-100 transition-opacity pointer-events-none whitespace-nowrap">
        {isDark ? 'Light Mode' : 'Dark Mode'}
      </span>
    </button>
  );
}
