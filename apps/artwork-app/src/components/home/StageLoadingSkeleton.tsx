"use client";

import React from "react";
import { Loader2, Sparkles } from "lucide-react";

export const StageLoadingSkeleton = React.memo(function StageLoadingSkeleton({
  title = "LOADING STAGE",
}: {
  title?: string;
}) {
  return (
    <div className="w-full max-w-7xl mx-auto py-12 px-4 flex flex-col items-center justify-center min-h-[340px] sm:min-h-[420px]">
      <div className="relative border-2 border-black dark:border-zinc-700 bg-white/90 dark:bg-[#151520]/90 rounded-2xl p-6 sm:p-8 comic-shadow flex flex-col items-center text-center max-w-md w-full animate-pulse backdrop-blur-sm">
        <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1 rounded-full border border-black font-headline font-black text-xs uppercase comic-shadow-sm mb-4 -rotate-1">
          <Sparkles className="w-3.5 h-3.5 fill-black" />
          <span>STAGE ENGINE</span>
        </div>
        <Loader2 className="w-7 h-7 text-yellow-500 animate-spin mb-3 stroke-[2.5]" />
        <h3 className="font-headline font-black text-base sm:text-lg text-black dark:text-white uppercase tracking-tight mb-1">
          {title}
        </h3>
        <p className="font-mono text-[11px] sm:text-xs text-black/60 dark:text-zinc-400">
          Mounting kinetic interactive module...
        </p>
      </div>
    </div>
  );
});
