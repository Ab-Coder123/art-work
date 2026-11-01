"use client";

import React from "react";
import { DEFAULT_LAYOUT_CONTENT, type StudioFooterProps } from "./types";

export const StudioFooter = React.memo(function StudioFooter({
  scrollToStage,
  layout = DEFAULT_LAYOUT_CONTENT,
}: StudioFooterProps) {
  return (
    <footer className="w-full py-2.5 bg-white/95 dark:bg-[#0D0D12]/95 text-black dark:text-white border-t border-black/10 dark:border-white/10 z-30 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 max-w-7xl mx-auto text-[10px] text-black/70 dark:text-zinc-400 font-mono gap-2 sm:gap-0">
        <div>{layout.footerCopyright}</div>
        <div className="flex items-center gap-3 font-headline font-bold flex-wrap justify-center uppercase">
          <button
            onClick={() => scrollToStage("stage-01")}
            className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
          >
            {layout.navHomeLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-02")}
            className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
          >
            {layout.navWhyUsLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-03")}
            className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
          >
            {layout.navServicesLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-gallery")}
            className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer text-yellow-600 dark:text-yellow-400 font-black uppercase"
          >
            ★ {layout.navGalleryLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-04")}
            className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
          >
            {layout.navContactLabel}
          </button>
        </div>
      </div>
    </footer>
  );
});
