"use client";

export default function LoadingScreen() {
  return (
    <div className="fixed inset-0 z-[200] bg-background flex flex-col items-center justify-center gap-8">
      <div className="relative flex items-end gap-2 h-20">
        <div className="w-3 bg-indigo-600 rounded-full animate-[bounce_1s_infinite] h-10"></div>
        <div className="w-3 bg-indigo-600 rounded-full animate-[bounce_1s_infinite_200ms] h-20"></div>
        <div className="w-3 bg-indigo-600 rounded-full animate-[bounce_1s_infinite_400ms] h-14"></div>

        {/* Glow effect */}
        <div className="absolute inset-0 bg-indigo-500/20 blur-3xl -z-10"></div>
      </div>

      <div className="flex flex-col items-center gap-3">
        <h2 className="text-3xl font-black text-foreground tracking-[0.2em] uppercase">SonicFlow</h2>

      </div>
    </div>
  );
}
