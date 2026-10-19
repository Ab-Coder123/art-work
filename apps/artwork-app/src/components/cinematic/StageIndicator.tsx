"use client";

import React from "react";
import { useScrollytellingStore, SCENE_STEPS } from "@/hooks/useScrollytellingStore";

export const StageIndicator: React.FC = () => {
  const { currentScene } = useScrollytellingStore();

  return (
    <aside
      className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden md:flex flex-col items-end gap-5 select-none"
      aria-label="Scene progression timeline"
    >
      <div className="flex flex-col items-center gap-3 py-3 px-2 bg-white/80 backdrop-blur-md rounded-full border border-black/10 shadow-sm">
        {SCENE_STEPS.map((step) => {
          const isActive = currentScene === step.id;
          return (
            <div
              key={step.id}
              className="group relative flex items-center justify-center cursor-pointer"
              title={step.label}
            >
              {/* Tooltip on hover */}
              <span className="absolute right-7 px-2.5 py-1 rounded bg-black text-white font-mono text-[10px] tracking-wider whitespace-nowrap opacity-0 group-hover:opacity-100 transition-opacity duration-200 pointer-events-none">
                {step.label}
              </span>

              {/* Indicator Dot */}
              <div
                className={`w-3 h-3 rounded-full transition-all duration-300 ${
                  isActive
                    ? "bg-yellow-400 scale-125 ring-4 ring-yellow-400/30"
                    : "bg-black/20 hover:bg-black/40 scale-100"
                }`}
              />
            </div>
          );
        })}
      </div>

      {/* Vertical Explore Prompt */}
      <span className="text-[10px] font-mono tracking-widest text-black/40 uppercase rotate-90 origin-right translate-x-2 pt-2">
        SCROLL TO EXPLORE ↓
      </span>
    </aside>
  );
};
