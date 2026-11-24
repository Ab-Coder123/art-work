"use client";

import React from "react";
import { getUiDictionary } from "@art-work/types";
import { useShowcaseStore } from "@/store/useShowcaseStore";
import type { StageId, TheaterStageIndicatorProps } from "./types";

export const TheaterStageIndicator = React.memo(function TheaterStageIndicator({
  activeStage,
  scrollToStage,
}: TheaterStageIndicatorProps) {
  const locale = useShowcaseStore((s) => s.locale);
  const dict = getUiDictionary(locale);

  const stageItems: { id: StageId; label: string }[] = [
    { id: "stage-01", label: dict.stages.home },
    { id: "stage-02", label: dict.stages.whyUs },
    { id: "stage-03", label: dict.stages.services },
    { id: "stage-gallery", label: dict.stages.gallery },
    { id: "stage-04", label: dict.stages.contact },
  ];

  return (
    <aside className="fixed end-4 sm:end-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3.5">
      {stageItems.map((item) => {
        const isActive = activeStage === item.id;
        return (
          <button
            key={item.id}
            onClick={() => scrollToStage(item.id)}
            className="group flex items-center gap-2.5 text-end cursor-pointer"
          >
            <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
              {item.label}
            </span>
            <div
              className={`w-3.5 h-3.5 rounded-full stage-indicator-dot transition-all duration-200 ${
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
