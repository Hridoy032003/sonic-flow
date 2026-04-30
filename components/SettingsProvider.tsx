"use client";

import React, { createContext, useContext, useEffect, useState } from "react";
import { useApi } from "@/hooks/useApi";

interface SettingsContextType {
  settings: {
    askSubscription: boolean;
    defaultTheme: string;
  } | null;
  loading: boolean;
}

const SettingsContext = createContext<SettingsContextType>({ settings: null, loading: true });

export function SettingsProvider({ children }: { children: React.ReactNode }) {
  const { data, loading } = useApi<{ settings: any }>("/api/admin/settings");
  const [mounted, setMounted] = useState(false);

  useEffect(() => {
    setMounted(true);
  }, []);

  useEffect(() => {
    if (loading || !data?.settings) return;

    const theme = data.settings.defaultTheme;
    let shouldBeDark = false;

    if (theme === "dark") {
      shouldBeDark = true;
    } else if (theme === "system") {
      shouldBeDark = window.matchMedia("(prefers-color-scheme: dark)").matches;
    }

    if (shouldBeDark) {
      document.documentElement.classList.add("dark");
    } else {
      document.documentElement.classList.remove("dark");
    }
    
    // Clear any local storage theme to prevent confusion if it was set before
    localStorage.removeItem("theme");
  }, [data, loading]);

  if (!mounted) return null; // Avoid hydration mismatch

  return (
    <SettingsContext.Provider value={{ settings: data?.settings || null, loading }}>
      {children}
    </SettingsContext.Provider>
  );
}

export function useSettings() {
  return useContext(SettingsContext);
}
