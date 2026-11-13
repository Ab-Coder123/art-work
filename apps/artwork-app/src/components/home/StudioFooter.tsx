"use client";

import React from "react";
import { DEFAULT_LAYOUT_CONTENT, type StudioFooterProps } from "./types";

export const StudioFooter = React.memo(function StudioFooter({
  scrollToStage,
  layout = DEFAULT_LAYOUT_CONTENT,
}: StudioFooterProps) {
  return (
    <footer className="w-full py-3 bg-[#08080d]/90 backdrop-blur-md text-zinc-400 ring-t-1 ring-white/10 z-30 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 max-w-7xl mx-auto text-[11px] font-mono gap-2 sm:gap-0">
        <div className="text-zinc-400/90">{layout.footerCopyright}</div>
        <div className="flex items-center gap-4 font-headline font-semibold flex-wrap justify-center uppercase tracking-wider text-xs">
          <button
            onClick={() => scrollToStage("stage-01")}
            className="text-zinc-400 hover:text-[#dcb858] transition-colors cursor-pointer uppercase"
          >
            {layout.navHomeLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-gallery")}
            className="text-[#dcb858] hover:text-yellow-300 font-bold transition-colors cursor-pointer uppercase"
          >
            ★ {layout.navGalleryLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-02")}
            className="text-zinc-400 hover:text-[#dcb858] transition-colors cursor-pointer uppercase"
          >
            {layout.navWhyUsLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-03")}
            className="text-zinc-400 hover:text-[#dcb858] transition-colors cursor-pointer uppercase"
          >
            {layout.navServicesLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-04")}
            className="text-zinc-400 hover:text-[#dcb858] transition-colors cursor-pointer uppercase"
          >
            {layout.navContactLabel}
          </button>
        </div>
      </div>
    </footer>
  );
});
