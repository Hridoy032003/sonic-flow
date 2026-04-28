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
