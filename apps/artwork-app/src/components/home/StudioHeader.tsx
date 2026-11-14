"use client";

import React, { useEffect, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MessageCircle, Pencil } from "lucide-react";
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
  const toggleDoodle = useDoodleStore((state) => state.toggleDoodle);
  const whatsappDigits = (whatsappPhone || "+20 (2) 2794-0000").replace(/\D/g, "") || "20227940000";

  // Reactive scroll tracking for floating animated capsule
  const [isScrolled, setIsScrolled] = useState(false);

  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (!ticking) {
        window.requestAnimationFrame(() => {
          setIsScrolled(window.scrollY > 40);
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  // Guarantee the Star (★) is preserved in all circumstances
  const rawGallery =
    layout.fullVaultCtaText &&
    !layout.fullVaultCtaText.toLowerCase().includes("vault")
      ? layout.fullVaultCtaText
      : layout.navGalleryLabel || "Gallery";
  const galleryVaultLabel = rawGallery.startsWith("★")
    ? rawGallery
    : `★ ${rawGallery} ↗`;

  return (
    <header className="fixed top-0 left-0 w-full z-40 pointer-events-none flex flex-col items-center px-2 sm:px-4 transition-all duration-300">
      {/* Primary Floating Capsule Bar */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
          mass: 0.8,
        }}
        className={`pointer-events-auto w-full transition-colors duration-300 ${
          isScrolled
            ? "mt-2.5 sm:mt-3.5 max-w-5xl rounded-full bg-[#08080d]/90 dark:bg-[#08080d]/92 bg-white/95 backdrop-blur-2xl ring-1 ring-black/10 dark:ring-white/15 shadow-[0_12px_40px_rgba(0,0,0,0.25)] dark:shadow-[0_16px_50px_rgba(0,0,0,0.65)] px-3.5 sm:px-6 py-1.5 sm:py-2"
            : "mt-0 max-w-7xl rounded-none bg-[#08080d]/80 dark:bg-[#08080d]/85 bg-white/85 backdrop-blur-xl border-b border-black/5 dark:border-white/10 px-4 sm:px-6 py-2.5 sm:py-3.5"
        }`}
      >
        <div className="flex justify-between items-center w-full">
          {/* Logo Anchor */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToStage("stage-01")}
              className="group cursor-pointer active:scale-95 transition-transform flex items-center"
              title={`${layout.footerBrandTitle} — ${layout.navHomeLabel}`}
              aria-label={`${layout.footerBrandTitle} — ${layout.navHomeLabel}`}
            >
              <div
                className={`relative transition-all duration-300 hover:scale-105 ${
                  isScrolled
                    ? "w-8 h-8 sm:w-9 sm:h-9"
                    : "w-9 h-9 sm:w-11 sm:h-11"
                }`}
              >
                <Image
                  src="/assets/images/artwork_logo.png"
                  alt="Art Work Logo"
                  fill
                  sizes="(max-width: 640px) 36px, (max-width: 768px) 44px, 56px"
                  priority
                  className="object-contain dark:hidden"
                />
                <Image
                  src="/assets/images/artwork_logo_dark.png"
                  alt="Art Work Logo"
                  fill
                  sizes="(max-width: 640px) 36px, (max-width: 768px) 44px, 56px"
                  priority
                  className="object-contain hidden dark:block"
                />
              </div>
            </button>
          </div>

          {/* Desktop Navigation Links (EKO Style Modern Glass Capsule Tabs) */}
          <nav
            className={`hidden md:flex items-center gap-1 sm:gap-1.5 p-1 rounded-full bg-black/5 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 backdrop-blur-md font-headline text-xs uppercase tracking-wider font-semibold transition-all duration-300`}
          >
            <button
              onClick={() => scrollToStage("stage-01")}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none ${
                activeStage === "stage-01"
                  ? "bg-[#dcb858] text-black font-bold shadow-[0_2px_12px_rgba(220,184,88,0.35)]"
                  : "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {layout.navHomeLabel}
            </button>

            {/* Standalone /gallery Page Action Pill with Star ★ */}
            <Link
              href="/gallery"
              className="px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full text-[#dcb858] bg-[#dcb858]/10 hover:bg-[#dcb858]/20 ring-1 ring-[#dcb858]/35 transition-all duration-200 cursor-pointer select-none font-bold shadow-[0_0_12px_rgba(220,184,88,0.2)] flex items-center gap-1"
            >
              <span>{galleryVaultLabel}</span>
            </Link>

            <button
              onClick={() => scrollToStage("stage-02")}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none ${
                activeStage === "stage-02"
                  ? "bg-[#dcb858] text-black font-bold shadow-[0_2px_12px_rgba(220,184,88,0.35)]"
                  : "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {layout.navWhyUsLabel}
            </button>
            <button
              onClick={() => scrollToStage("stage-03")}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none ${
                activeStage === "stage-03"
                  ? "bg-[#dcb858] text-black font-bold shadow-[0_2px_12px_rgba(220,184,88,0.35)]"
                  : "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {layout.navServicesLabel}
            </button>
            <button
              onClick={() => scrollToStage("stage-04")}
              className={`px-3 sm:px-3.5 py-1 sm:py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none ${
                activeStage === "stage-04"
                  ? "bg-[#dcb858] text-black font-bold shadow-[0_2px_12px_rgba(220,184,88,0.35)]"
                  : "text-zinc-700 dark:text-zinc-300 hover:text-black dark:hover:text-white hover:bg-black/5 dark:hover:bg-white/10"
              }`}
            >
              {layout.navContactLabel}
            </button>
          </nav>

          {/* Trailing Primary Actions: Theme Toggle + Sound Toggle + WhatsApp + Brief Inquiry + Ink Mode */}
          <div className="flex items-center gap-1.5 sm:gap-2">
            <ThemeToggle />
            <SoundToggle />

            <a
              href={`https://wa.me/${whatsappDigits}`}
              target="_blank"
              rel="noopener noreferrer"
              aria-label={`WhatsApp ${whatsappPhone}`}
              title={`WhatsApp: ${whatsappPhone}`}
              className="inline-flex items-center gap-1.5 bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 text-zinc-800 dark:text-zinc-100 font-headline font-bold text-xs px-2.5 sm:px-3 py-1.5 rounded-full ring-1 ring-black/10 dark:ring-white/15 hover:ring-emerald-500/60 transition-all duration-150 cursor-pointer whitespace-nowrap"
            >
              <MessageCircle className="w-3.5 h-3.5 text-emerald-500 dark:text-emerald-400 shrink-0 stroke-[2.2]" />
              <span className="hidden xl:inline">{whatsappPhone}</span>
            </a>

            <MagneticButton soundType="pop">
              <button
                onClick={() => scrollToStage("stage-04")}
                className={`inline-flex items-center gap-1.5 bg-[#dcb858] hover:bg-yellow-300 text-black font-headline font-bold text-xs rounded-full shadow-[0_0_20px_rgba(220,184,88,0.35)] hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap ${
                  isScrolled
                    ? "px-3.5 sm:px-4 py-1.5"
                    : "px-4 sm:px-5 py-1.5 sm:py-2"
                }`}
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
              className="w-7 h-7 sm:w-8 sm:h-8 rounded-full bg-black/5 dark:bg-white/5 hover:bg-black/10 dark:hover:bg-white/10 ring-1 ring-black/10 dark:ring-white/15 active:scale-90 transition-transform cursor-pointer flex items-center justify-center text-zinc-600 dark:text-zinc-300 hover:text-[#dcb858]"
              title="Toggle Studio Pen Doodle Mode"
            >
              <Pencil className="w-3.5 h-3.5 sm:w-4 sm:h-4" />
            </button>
          </div>
        </div>
      </motion.div>

      {/* Mobile Stage Navigation Pill Strip */}
      <motion.div
        layout
        transition={{
          type: "spring",
          stiffness: 300,
          damping: 30,
        }}
        className={`md:hidden pointer-events-auto transition-all duration-300 flex items-center justify-start gap-1 overflow-x-auto no-scrollbar ${
          isScrolled
            ? "mx-auto max-w-fit mt-1.5 px-2.5 py-1 rounded-full bg-[#08080d]/90 dark:bg-[#08080d]/92 bg-white/95 ring-1 ring-black/10 dark:ring-white/15 shadow-lg"
            : "w-full px-3 py-1.5 bg-[#0a0a10]/95 dark:bg-[#0a0a10]/95 bg-white/95 border-b border-black/5 dark:border-white/10"
        }`}
      >
        <button
          onClick={() => scrollToStage("stage-01")}
          className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
            activeStage === "stage-01"
              ? "bg-[#dcb858] text-black"
              : "text-zinc-700 dark:text-zinc-300 bg-black/5 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10"
          }`}
        >
          {layout.navHomeLabel}
        </button>
        <Link
          href="/gallery"
          className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider text-[#dcb858] bg-[#dcb858]/15 ring-1 ring-[#dcb858]/40 whitespace-nowrap flex items-center gap-1 shadow-[0_0_10px_rgba(220,184,88,0.25)]"
        >
          <span>{galleryVaultLabel}</span>
        </Link>
        <button
          onClick={() => scrollToStage("stage-02")}
          className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
            activeStage === "stage-02"
              ? "bg-[#dcb858] text-black"
              : "text-zinc-700 dark:text-zinc-300 bg-black/5 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10"
          }`}
        >
          {layout.navWhyUsLabel}
        </button>
        <button
          onClick={() => scrollToStage("stage-03")}
          className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
            activeStage === "stage-03"
              ? "bg-[#dcb858] text-black"
              : "text-zinc-700 dark:text-zinc-300 bg-black/5 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10"
          }`}
        >
          {layout.navServicesLabel}
        </button>
        <button
          onClick={() => scrollToStage("stage-04")}
          className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
            activeStage === "stage-04"
              ? "bg-[#dcb858] text-black"
              : "text-zinc-700 dark:text-zinc-300 bg-black/5 dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10"
          }`}
        >
          {layout.navContactLabel}
        </button>
      </motion.div>
    </header>
  );
});
