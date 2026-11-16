"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { PenTool } from "lucide-react";
import { ThemeToggle } from "@/components/cinematic/ThemeToggle";
import { SoundToggle } from "@/components/cinematic/SoundToggle";
import { useDoodleStore } from "@/store/useDoodleStore";
import { DEFAULT_LAYOUT_CONTENT, type StudioHeaderProps } from "./types";

export const StudioHeader = React.memo(function StudioHeader({
  activeStage,
  scrollToStage,
  onInkBurst,
  layout = DEFAULT_LAYOUT_CONTENT,
}: StudioHeaderProps) {
  const pathname = usePathname();
  const isDoodleActive = useDoodleStore((state) => state.isDoodleActive);
  const toggleDoodle = useDoodleStore((state) => state.toggleDoodle);

  const isHome = pathname === "/";
  const isGallery = pathname === "/gallery";
  const isWhyUs = pathname === "/why-us";

  const galleryVaultLabel =
    layout.fullVaultCtaText &&
    !layout.fullVaultCtaText.toLowerCase().includes("vault")
      ? layout.fullVaultCtaText
      : `★ ${layout.navGalleryLabel} ↗`;

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/95 dark:bg-[#0D0D12]/95 backdrop-blur-md nav-shadow transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-[1216px] mx-auto py-1.5 sm:py-2">
        {/* Logo Anchor */}
        <div className="flex items-center gap-2">
          {isHome && scrollToStage ? (
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
          ) : (
            <Link
              href="/"
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
            </Link>
          )}
        </div>

        {/* Desktop Navigation Links (Sticker Buttons) */}
        <nav className="hidden md:flex items-center gap-2 font-headline text-xs uppercase tracking-wider font-bold">
          {/* 1. HOME BUTTON */}
          {isHome && scrollToStage ? (
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
          ) : (
            <Link
              href="/"
              className={`inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                isHome
                  ? "bg-yellow-400 text-black border-black comic-shadow-sm -rotate-1 scale-105 z-10"
                  : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1"
              }`}
            >
              {layout.navHomeLabel}
            </Link>
          )}

          {/* 2. GALLERY BUTTON — RIGHT BESIDE HOME */}
          <Link
            href="/gallery"
            className={`inline-flex items-center gap-1 font-headline font-black text-xs uppercase px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 border-black comic-shadow-sm transition-all cursor-pointer ${
              isGallery || (isHome && activeStage === "stage-gallery")
                ? "bg-yellow-400 text-black scale-105 rotate-1 z-10"
                : "bg-yellow-300 dark:bg-yellow-400 text-black hover:bg-yellow-400 hover:-translate-y-0.5 hover:rotate-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            }`}
          >
            <span>{galleryVaultLabel}</span>
          </Link>

          {/* 3. WHY US BUTTON */}
          {isHome && scrollToStage ? (
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
          ) : (
            <Link
              href="/why-us"
              className={`inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                isWhyUs
                  ? "bg-yellow-400 text-black border-black comic-shadow-sm rotate-1 scale-105 z-10"
                  : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 rotate-1"
              }`}
            >
              {layout.navWhyUsLabel}
            </Link>
          )}

          {/* 4. SERVICES BUTTON */}
          {isHome && scrollToStage ? (
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
          ) : (
            <Link
              href="/#stage-03"
              className={`inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1`}
            >
              {layout.navServicesLabel}
            </Link>
          )}

          {/* 5. CONTACT BUTTON */}
          {isHome && scrollToStage ? (
            <button
              onClick={() => scrollToStage("stage-04")}
              title={layout.briefCtaText || layout.navContactLabel}
              aria-label={layout.briefCtaText || layout.navContactLabel}
              className={`inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
                activeStage === "stage-04"
                  ? "bg-yellow-400 text-black border-black comic-shadow-sm -rotate-1 scale-105 z-10"
                  : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1"
              }`}
            >
              {layout.navContactLabel}
            </button>
          ) : (
            <Link
              href="/#stage-04"
              title={layout.briefCtaText || layout.navContactLabel}
              aria-label={layout.briefCtaText || layout.navContactLabel}
              className={`inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1`}
            >
              {layout.navContactLabel}
            </Link>
          )}
        </nav>

        {/* Trailing Primary Actions: Theme Toggle + Sound Toggle + Studio Pen */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />
          <SoundToggle />

          {/* STUDIO DOODLE PEN */}
          <button
            onClick={(e) => {
              onInkBurst?.(e);
              toggleDoodle();
            }}
            aria-label="Toggle Studio Pen Doodle Mode"
            title={
              isDoodleActive
                ? "Studio Pen Active! (Click to stop drawing)"
                : "Studio Pen: Click to draw doodles on the canvas ✍️"
            }
            className={`w-8 h-8 sm:w-9 sm:h-9 border-2 rounded-DEFAULT comic-shadow-sm active:scale-90 transition-all duration-150 cursor-pointer flex items-center justify-center select-none ${
              isDoodleActive
                ? "bg-yellow-400 text-black border-black rotate-6 scale-105 shadow-[0_0_12px_rgba(250,204,21,0.7)]"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black dark:border-zinc-500 hover:bg-yellow-200 dark:hover:bg-[#222232] hover:text-black dark:hover:text-yellow-400 hover:translate-x-0.5 hover:translate-y-0.5"
            }`}
          >
            <PenTool className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Stage Navigation Pill Strip (Sticker Buttons) */}
      <div className="md:hidden flex items-center justify-start gap-2 px-3 py-2 bg-yellow-50/95 dark:bg-[#12121A]/95 border-t border-black/10 dark:border-white/10 overflow-x-auto no-scrollbar">
        {/* 1. Mobile HOME */}
        {isHome && scrollToStage ? (
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
        ) : (
          <Link
            href="/"
            className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              isHome
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black -rotate-1"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
            }`}
          >
            {layout.navHomeLabel}
          </Link>
        )}

        {/* 2. Mobile GALLERY — RIGHT BESIDE HOME */}
        <Link
          href="/gallery"
          className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-black uppercase tracking-wider border-2 border-black comic-shadow-sm whitespace-nowrap active:scale-95 ${
            isGallery || (isHome && activeStage === "stage-gallery")
              ? "bg-yellow-400 text-black font-black"
              : "bg-yellow-300 dark:bg-yellow-400 text-black"
          }`}
        >
          {galleryVaultLabel}
        </Link>

        {/* 3. Mobile WHY US */}
        {isHome && scrollToStage ? (
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
        ) : (
          <Link
            href="/why-us"
            className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${
              isWhyUs
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black rotate-1"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
            }`}
          >
            {layout.navWhyUsLabel}
          </Link>
        )}

        {/* 4. Mobile SERVICES */}
        {isHome && scrollToStage ? (
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
        ) : (
          <Link
            href="/#stage-03"
            className="px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
          >
            {layout.navServicesLabel}
          </Link>
        )}

        {/* 5. Mobile CONTACT */}
        {isHome && scrollToStage ? (
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
        ) : (
          <Link
            href="/#stage-04"
            className="px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
          >
            {layout.navContactLabel}
          </Link>
        )}
      </div>
    </header>
  );
});
