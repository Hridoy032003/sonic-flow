"use client";

import { useAuth } from "@/hooks/useAuth";
import LoadingScreen from "./LoadingScreen";

export default function AuthLoadingHandler({ children }: { children: React.ReactNode }) {
  const { loading } = useAuth();

  if (loading) {
    return <LoadingScreen />;
  }

  return <>{children}</>;
}
