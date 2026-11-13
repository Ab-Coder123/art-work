"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
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

  const galleryVaultLabel =
    layout.fullVaultCtaText &&
    !layout.fullVaultCtaText.toLowerCase().includes("vault")
      ? layout.fullVaultCtaText
      : `★ ${layout.navGalleryLabel} ↗`;

  return (
    <header className="fixed top-0 left-0 w-full z-40 bg-[#08080d]/85 backdrop-blur-xl ring-1 ring-white/10 transition-colors duration-200">
      <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-7xl mx-auto py-2">
        {/* Logo Anchor */}
        <div className="flex items-center gap-2">
          <button
            onClick={() => scrollToStage("stage-01")}
            className="group cursor-pointer active:scale-95 transition-transform flex items-center"
            title={`${layout.footerBrandTitle} — ${layout.navHomeLabel}`}
            aria-label={`${layout.footerBrandTitle} — ${layout.navHomeLabel}`}
          >
            <div className="relative w-10 h-10 sm:w-12 sm:h-12 hover:scale-105 transition-transform">
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

        {/* Desktop Navigation Links (EKO Style Modern Glass Capsule Tabs) */}
        <nav className="hidden md:flex items-center gap-1.5 p-1 rounded-full bg-white/5 ring-1 ring-white/10 backdrop-blur-md font-headline text-xs uppercase tracking-wider font-semibold">
          <button
            onClick={() => scrollToStage("stage-01")}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none ${
              activeStage === "stage-01"
                ? "bg-[#dcb858] text-black font-bold shadow-[0_2px_12px_rgba(220,184,88,0.3)]"
                : "text-zinc-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {layout.navHomeLabel}
          </button>

          {/* Standalone /gallery Page Action Pill (located beside Home) */}
          <Link
            href="/gallery"
            className="px-3.5 py-1.5 rounded-full text-zinc-200 hover:text-[#dcb858] hover:bg-white/10 ring-1 ring-white/10 transition-all duration-200 cursor-pointer"
          >
            <span>{galleryVaultLabel}</span>
          </Link>

          <button
            onClick={() => scrollToStage("stage-02")}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none ${
              activeStage === "stage-02"
                ? "bg-[#dcb858] text-black font-bold shadow-[0_2px_12px_rgba(220,184,88,0.3)]"
                : "text-zinc-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {layout.navWhyUsLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-03")}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none ${
              activeStage === "stage-03"
                ? "bg-[#dcb858] text-black font-bold shadow-[0_2px_12px_rgba(220,184,88,0.3)]"
                : "text-zinc-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {layout.navServicesLabel}
          </button>
          <button
            onClick={() => scrollToStage("stage-04")}
            className={`px-3.5 py-1.5 rounded-full transition-all duration-200 cursor-pointer select-none ${
              activeStage === "stage-04"
                ? "bg-[#dcb858] text-black font-bold shadow-[0_2px_12px_rgba(220,184,88,0.3)]"
                : "text-zinc-300 hover:text-white hover:bg-white/10"
            }`}
          >
            {layout.navContactLabel}
          </button>
        </nav>

        {/* Trailing Primary Actions: Theme Toggle + Sound Toggle + WhatsApp + Brief Inquiry + Ink Mode */}
        <div className="flex items-center gap-2 sm:gap-2.5">
          <ThemeToggle />
          <SoundToggle />

          <a
            href={`https://wa.me/${whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            aria-label={`WhatsApp ${whatsappPhone}`}
            title={`WhatsApp: ${whatsappPhone}`}
            className="inline-flex items-center gap-1.5 bg-white/5 hover:bg-white/10 text-zinc-100 font-headline font-bold text-xs px-3 py-1.5 sm:py-2 rounded-full ring-1 ring-white/15 hover:ring-emerald-500/60 transition-all duration-150 cursor-pointer whitespace-nowrap"
          >
            <MessageCircle className="w-3.5 h-3.5 text-emerald-400 shrink-0 stroke-[2.2]" />
            <span className="hidden lg:inline">{whatsappPhone}</span>
          </a>

          <MagneticButton soundType="pop">
            <button
              onClick={() => scrollToStage("stage-04")}
              className="inline-flex items-center gap-1.5 bg-[#dcb858] hover:bg-yellow-300 text-black font-headline font-bold text-xs px-4 sm:px-5 py-1.5 sm:py-2 rounded-full shadow-[0_0_20px_rgba(220,184,88,0.3)] hover:scale-105 active:scale-95 transition-all duration-150 cursor-pointer whitespace-nowrap"
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
            className="w-8 h-8 sm:w-9 sm:h-9 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/15 active:scale-90 transition-transform cursor-pointer flex items-center justify-center text-zinc-300 hover:text-[#dcb858]"
            title="Toggle Studio Pen Doodle Mode"
          >
            <Pencil className="w-4 h-4" />
          </button>
        </div>
      </div>

      {/* Mobile Stage Navigation Pill Strip (EKO Clean Dark Capsule Strip) */}
      <div className="md:hidden flex items-center justify-start gap-1.5 px-3 py-1.5 bg-[#0a0a10]/95 ring-t-1 ring-white/10 overflow-x-auto no-scrollbar">
        <button
          onClick={() => scrollToStage("stage-01")}
          className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
            activeStage === "stage-01"
              ? "bg-[#dcb858] text-black"
              : "text-zinc-300 bg-white/5 ring-1 ring-white/10"
          }`}
        >
          {layout.navHomeLabel}
        </button>
        <Link
          href="/gallery"
          className="px-3 py-1 rounded-full text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider text-[#dcb858] bg-[#dcb858]/10 ring-1 ring-[#dcb858]/30 whitespace-nowrap"
        >
          {galleryVaultLabel}
        </Link>
        <button
          onClick={() => scrollToStage("stage-02")}
          className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
            activeStage === "stage-02"
              ? "bg-[#dcb858] text-black"
              : "text-zinc-300 bg-white/5 ring-1 ring-white/10"
          }`}
        >
          {layout.navWhyUsLabel}
        </button>
        <button
          onClick={() => scrollToStage("stage-03")}
          className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
            activeStage === "stage-03"
              ? "bg-[#dcb858] text-black"
              : "text-zinc-300 bg-white/5 ring-1 ring-white/10"
          }`}
        >
          {layout.navServicesLabel}
        </button>
        <button
          onClick={() => scrollToStage("stage-04")}
          className={`px-3 py-1 rounded-full text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap ${
            activeStage === "stage-04"
              ? "bg-[#dcb858] text-black"
              : "text-zinc-300 bg-white/5 ring-1 ring-white/10"
          }`}
        >
          {layout.navContactLabel}
        </button>
      </div>
    </header>
  );
});
