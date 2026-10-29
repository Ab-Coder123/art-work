"use client";

import React from "react";
import type { StageId, TheaterStageIndicatorProps } from "./types";

interface StageItem {
  id: StageId;
  label: string;
}

const STAGE_ITEMS: StageItem[] = [
  { id: "stage-01", label: "Home" },
  { id: "stage-02", label: "Why Us" },
  { id: "stage-03", label: "Services" },
  { id: "stage-gallery", label: "★ Gallery" },
  { id: "stage-04", label: "Contact" },
];

export const TheaterStageIndicator = React.memo(function TheaterStageIndicator({
  activeStage,
  scrollToStage,
}: TheaterStageIndicatorProps) {
  return (
    <aside className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3.5">
      {STAGE_ITEMS.map((item) => {
        const isActive = activeStage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollToStage(item.id)}
            className="group flex items-center gap-2.5 text-right cursor-pointer"
          >
            <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label}
            </span>
            <div
              className={`w-3 h-3 rounded-full border-2 border-black dark:border-zinc-400 transition-all ${
                isActive
                  ? "bg-yellow-400 ring-4 ring-yellow-400/30 scale-125"
                  : "bg-white dark:bg-[#1A1A24] group-hover:bg-yellow-400"
              }`}
            ></div>
          </button>
        );
      })}
    </aside>
  );
});
