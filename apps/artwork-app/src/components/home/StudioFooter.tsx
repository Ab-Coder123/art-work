"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { DEFAULT_LAYOUT_CONTENT, type StudioFooterProps } from "./types";

export const StudioFooter = React.memo(function StudioFooter({
  scrollToStage,
  layout = DEFAULT_LAYOUT_CONTENT,
}: StudioFooterProps) {
  const pathname = usePathname();
  const isHome = pathname === "/";

  return (
    <footer className="w-full py-3 bg-white/95 dark:bg-[#0D0D12]/95 text-black dark:text-white border-t border-black/10 dark:border-white/10 z-30 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 max-w-7xl mx-auto text-[10px] text-black/70 dark:text-zinc-400 font-mono gap-2 sm:gap-0">
        <div>{layout.footerCopyright}</div>
        <div className="flex items-center gap-3 font-headline font-bold flex-wrap justify-center uppercase">
          {/* 1. Home */}
          {isHome && scrollToStage ? (
            <button
              onClick={() => scrollToStage("stage-01")}
              className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
            >
              {layout.navHomeLabel}
            </button>
          ) : (
            <Link
              href="/"
              className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
            >
              {layout.navHomeLabel}
            </Link>
          )}

          {/* 2. Gallery (beside Home) */}
          <Link
            href="/gallery"
            className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer text-yellow-600 dark:text-yellow-400 font-black uppercase"
          >
            ★ {layout.navGalleryLabel}
          </Link>

          {/* 3. Why Us */}
          {isHome && scrollToStage ? (
            <button
              onClick={() => scrollToStage("stage-02")}
              className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
            >
              {layout.navWhyUsLabel}
            </button>
          ) : (
            <Link
              href="/why-us"
              className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
            >
              {layout.navWhyUsLabel}
            </Link>
          )}

          {/* 4. Services */}
          {isHome && scrollToStage ? (
            <button
              onClick={() => scrollToStage("stage-03")}
              className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
            >
              {layout.navServicesLabel}
            </button>
          ) : (
            <Link
              href="/#stage-03"
              className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
            >
              {layout.navServicesLabel}
            </Link>
          )}

          {/* 5. Contact */}
          {isHome && scrollToStage ? (
            <button
              onClick={() => scrollToStage("stage-04")}
              className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
            >
              {layout.navContactLabel}
            </button>
          ) : (
            <Link
              href="/#stage-04"
              className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer uppercase"
            >
              {layout.navContactLabel}
            </Link>
          )}
        </div>
      </div>
    </footer>
  );
});
