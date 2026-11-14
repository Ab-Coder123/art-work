"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Pencil } from "lucide-react";
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
  whatsappPhone = "+20 (2) 2794-0000",
}: StudioHeaderProps) {
  const pathname = usePathname();
  const toggleDoodle = useDoodleStore((state) => state.toggleDoodle);

  const isHome = pathname === "/";
  const isGallery = pathname === "/gallery";
  const isWhyUs = pathname === "/why-us";

  const galleryVaultLabel =
    layout.fullVaultCtaText &&
    !layout.fullVaultCtaText.toLowerCase().includes("vault")
      ? layout.fullVaultCtaText
      : `★ ${layout.navGalleryLabel} ↗`;

  const phoneClean = (whatsappPhone || "+20 (2) 2794-0000").replace(/\D/g, "") || "20227940000";
  const whatsappUrl = `https://wa.me/${phoneClean}`;

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-white/95 dark:bg-[#0D0D12]/95 backdrop-blur-md nav-shadow transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-7xl mx-auto py-1.5 sm:py-2">
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
              className={`inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1`}
            >
              {layout.navContactLabel}
            </Link>
          )}
        </nav>

        {/* Trailing Primary Actions: Theme Toggle + Sound Toggle + WhatsApp Icon ONLY + Studio Pen */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />
          <SoundToggle />

          {/* WHATSAPP ICON BUTTON (ONLY ICON, REPLACING BRIEF INQUIRY) */}
          <MagneticButton soundType="pop">
            <a
              href={whatsappUrl}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={layout.briefCtaText || "Chat on WhatsApp"}
              title={layout.briefCtaText || "Chat on WhatsApp"}
              className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-black dark:border-zinc-400 rounded-DEFAULT bg-[#25D366] hover:bg-[#20bd5a] text-white comic-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-90 transition-all duration-150 cursor-pointer flex items-center justify-center"
            >
              <svg
                className="w-4 h-4 sm:w-4.5 sm:h-4.5 fill-current"
                viewBox="0 0 24 24"
                aria-hidden="true"
              >
                <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
              </svg>
            </a>
          </MagneticButton>

          {/* STUDIO DOODLE PEN */}
          <button
            onClick={(e) => {
              onInkBurst?.(e);
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
