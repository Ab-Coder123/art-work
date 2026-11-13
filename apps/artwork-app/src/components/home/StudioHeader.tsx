"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Pencil } from "lucide-react";
import { ThemeToggle } from "@/components/cinematic/ThemeToggle";
import { SoundToggle } from "@/components/cinematic/SoundToggle";
import { MagneticButton } from "@/components/cinematic/MagneticButton";
import { useDoodleStore } from "@/store/useDoodleStore";
import { DEFAULT_LAYOUT_CONTENT, type StudioHeaderProps } from "./types";

export const StudioHeader = React.memo(function StudioHeader({
  activeStage,
  scrollToStage,
  onInkBurst,
  layout = DEFAULT_LAYOUT_CONTENT,
}: StudioHeaderProps) {
  const toggleDoodle = useDoodleStore((state) => state.toggleDoodle);

  const galleryVaultLabel =
    layout.fullVaultCtaText &&
    !layout.fullVaultCtaText.toLowerCase().includes("vault")
      ? layout.fullVaultCtaText
      : `★ ${layout.navGalleryLabel} ↗`;

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/95 dark:bg-[#0D0D12]/95 backdrop-blur-md nav-shadow transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-7xl mx-auto py-1.5 sm:py-2">
        {/* Logo Anchor */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollToStage("stage-01")}
            className="group cursor-pointer active:scale-95 transition-transform flex items-center"
            title={`${layout.footerBrandTitle} — ${layout.navHomeLabel}`}
            aria-label={`${layout.footerBrandTitle} — ${layout.navHomeLabel}`}
          >
            <div className="relative w-11 h-11 sm:w-13 sm:h-13 md:w-14 md:h-14 lg:w-16 lg:h-16 hover:rotate-3 transition-transform">
              <Image
                src="/assets/images/artwork_logo.png"
                alt="Art Work Logo"
                fill
                sizes="(max-width: 640px) 44px, (max-width: 768px) 56px, 64px"
                priority
                className="object-contain dark:hidden"
              />
              <Image
                src="/assets/images/artwork_logo_dark.png"
                alt="Art Work Logo"
                fill
                sizes="(max-width: 640px) 44px, (max-width: 768px) 56px, 64px"
                priority
                className="object-contain hidden dark:block"
              />
            </div>
          </button>
        </div>

        {/* Desktop Navigation Links (Sticker Buttons) */}
        <nav className="hidden md:flex items-center gap-2 font-headline text-xs uppercase tracking-wider font-bold">
          <button
            onClick={() => scrollToStage("stage-01")}
            className={`inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              activeStage === "stage-01"
                ? "bg-yellow-400 text-black border-black comic-shadow-sm -rotate-1 scale-105 z-10"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1"
            }`}
          >
            {layout.navHomeLabel}
          </button>

          {/* Standalone /gallery Page Action Pill (located beside Home) */}
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1 bg-yellow-300 dark:bg-yellow-400 text-black font-headline font-black text-xs uppercase px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 border-black comic-shadow-sm hover:bg-yellow-400 hover:-translate-y-0.5 hover:-rotate-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
          >
            <span>{galleryVaultLabel}</span>
          </Link>

          <button
            onClick={() => scrollToStage("stage-02")}
            className={`inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              activeStage === "stage-02"
                ? "bg-yellow-400 text-black border-black comic-shadow-sm rotate-1 scale-105 z-10"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 rotate-1"
            }`}
          >
            {layout.navWhyUsLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-03")}
            className={`inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              activeStage === "stage-03"
                ? "bg-yellow-400 text-black border-black comic-shadow-sm -rotate-1 scale-105 z-10"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1"
            }`}
          >
            {layout.navServicesLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-04")}
            className={`inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              activeStage === "stage-04"
                ? "bg-yellow-400 text-black border-black comic-shadow-sm -rotate-1 scale-105 z-10"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1"
            }`}
          >
            {layout.navContactLabel}
          </button>
        </nav>

        {/* Trailing Primary Actions: Theme Toggle + Sound Toggle + Brief Inquiry + Ink Mode */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />
          <SoundToggle />

          <MagneticButton soundType="pop">
            <button
              onClick={() => scrollToStage("stage-04")}
              className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-bold text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-DEFAULT border-2 border-black comic-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all duration-150 cursor-pointer"
            >
              <span>{layout.briefCtaText}</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </MagneticButton>

          <button
            onClick={(e) => {
              onInkBurst(e);
              toggleDoodle();
            }}
            aria-label="Toggle Studio Pen Doodle Mode"
            className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-black dark:border-zinc-400 rounded-DEFAULT bg-white dark:bg-[#181824] hover:bg-yellow-100 dark:hover:bg-[#222232] comic-shadow-sm active:scale-90 transition-transform cursor-pointer flex items-center justify-center text-black dark:text-yellow-400"
            title="Toggle Studio Pen Doodle Mode"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Stage Navigation Pill Strip (Sticker Buttons) */}
      <div className="md:hidden flex items-center justify-start gap-2 px-3 py-2 bg-yellow-50/95 dark:bg-[#12121A]/95 border-t border-black/10 dark:border-white/10 overflow-x-auto no-scrollbar">
        <button
          onClick={() => scrollToStage("stage-01")}
          className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
            activeStage === "stage-01"
              ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black -rotate-1"
              : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
          }`}
        >
          {layout.navHomeLabel}
        </button>
        <Link
          href="/gallery"
          className="px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-black uppercase tracking-wider bg-yellow-300 dark:bg-yellow-400 text-black border-2 border-black comic-shadow-sm whitespace-nowrap active:scale-95"
        >
          {galleryVaultLabel}
        </Link>
        <button
          onClick={() => scrollToStage("stage-02")}
          className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
            activeStage === "stage-02"
              ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black rotate-1"
              : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
          }`}
        >
          {layout.navWhyUsLabel}
        </button>
        <button
          onClick={() => scrollToStage("stage-03")}
          className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
            activeStage === "stage-03"
              ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black -rotate-1"
              : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
          }`}
        >
          {layout.navServicesLabel}
        </button>
        <button
          onClick={() => scrollToStage("stage-04")}
          className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
            activeStage === "stage-04"
              ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black -rotate-1"
              : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
          }`}
        >
          {layout.navContactLabel}
        </button>
      </div>
    </header>
  );
});
