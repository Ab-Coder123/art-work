"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Sparkles,
  Layers,
  Zap,
  Compass,
  CheckCircle2,
  Download,
} from "lucide-react";
import { DEFAULT_COMPANIES } from "@art-work/types";
import { MagneticButton } from "@/components/cinematic/MagneticButton";
import { PartnersMarquee } from "./PartnersMarquee";
import { DEFAULT_HERO_CONTENT, type ManifestoHeroProps } from "./types";

const STUDIO_BACKDROP_VARIANTS = [
  "/assets/images/blueprint_stage_scenography.webp",
  "/assets/images/creative_chief_intake.webp",
] as const;

const HERO_VALUE_PILLARS = [
  {
    icon: Layers,
    title: "Turnkey Creative",
    description: "High-end spatial visuals, brand systems, and exhibition concepts engineered to stand out.",
  },
  {
    icon: Compass,
    title: "Precision Engineering",
    description: "3D architectural drafting, custom booth fabrication, and rigorous structural safety.",
  },
  {
    icon: Zap,
    title: "Immersive Technology",
    description: "Synchronized 4K LED screens, DMX lighting control, and interactive projection mapping.",
  },
  {
    icon: CheckCircle2,
    title: "360° Live Delivery",
    description: "Flawless on-site execution, vendor coordination, and 100% on-time show call management.",
  },
];

export const ManifestoHero = React.memo(function ManifestoHero({
  onViewCapabilities,
  onExploreShowreel,
  content = DEFAULT_HERO_CONTENT,
  companies = DEFAULT_COMPANIES,
}: ManifestoHeroProps) {
  const heroImg = content.heroImage || "/assets/images/hero_studio_collective.jpg";
  const heroAlt = content.heroImageAlt || "Art Work Creative Marketing Studio Collective";
  const primaryCta = content.primaryCtaText || "START A PROJECT";
  const secondaryCta = content.secondaryCtaText || "EXPLORE SERVICES";
  const proofTagline =
    content.proofTagline || "CREATIVE | PLANNING | PRODUCTION | ON-SITE DELIVERY";
  const performanceBadge = content.performanceBadge || "DOWNLOAD PORTFOLIO";

  const backdropImages = useMemo(
    () => Array.from(new Set([heroImg, ...STUDIO_BACKDROP_VARIANTS])),
    [heroImg]
  );

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);
  const [quickName, setQuickName] = useState("");
  const [quickContact, setQuickContact] = useState("");

  useEffect(() => {
    if (backdropImages.length <= 1) return;

    const prefersReducedMotion =
      typeof window !== "undefined" &&
      window.matchMedia("(prefers-reduced-motion: reduce)").matches;

    let glitchTimeout: ReturnType<typeof setTimeout> | null = null;

    const interval = setInterval(() => {
      if (!prefersReducedMotion) {
        setIsGlitching(true);
      }
      setActiveImageIdx((prev) => (prev + 1) % backdropImages.length);

      if (!prefersReducedMotion) {
        if (glitchTimeout) clearTimeout(glitchTimeout);
        glitchTimeout = setTimeout(() => {
          setIsGlitching(false);
        }, 360);
      }
    }, 3000);

    return () => {
      clearInterval(interval);
      if (glitchTimeout) clearTimeout(glitchTimeout);
    };
  }, [backdropImages.length]);

  const currentBackdrop = backdropImages[activeImageIdx % backdropImages.length] || heroImg;

  const handleQuickProposal = (e: React.FormEvent) => {
    e.preventDefault();
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("artwork:quick-intake", {
          detail: { fullName: quickName, contact: quickContact },
        })
      );
      window.dispatchEvent(
        new CustomEvent("artwork:navigate-stage", { detail: { stage: "stage-04" } })
      );
      const briefSec = document.getElementById("brief-inquiry");
      if (briefSec) {
        briefSec.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <div className="w-full flex flex-col justify-start">
      {/* Edge-to-Edge Full-Width Hero Stage styled to EKO luxury aesthetic */}
      <div className="relative w-full overflow-hidden min-h-[calc(100svh-120px)] md:min-h-[calc(100vh-90px)] flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12 pt-8 pb-10 bg-[#08080d]">
        {/* Full-Bleed Studio Backdrop Image with 3s Glitch Swapper */}
        <div
          key={currentBackdrop}
          className={`absolute inset-0 pointer-events-none ${isGlitching ? "hero-glitch-base" : ""}`}
        >
          <Image
            src={currentBackdrop}
            alt={heroAlt}
            fill
            priority
            sizes="100vw"
            className="object-cover object-center opacity-45 transition-opacity duration-300"
            unoptimized={currentBackdrop.startsWith("http") || currentBackdrop.startsWith("data:")}
          />
        </div>

        {/* Sliced Chromatic Glitch Burst Layers */}
        {isGlitching && (
          <>
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none hero-glitch-slice-a mix-blend-screen"
            >
              <Image
                src={currentBackdrop}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-center opacity-65 saturate-150 hue-rotate-15"
                unoptimized={currentBackdrop.startsWith("http") || currentBackdrop.startsWith("data:")}
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none hero-glitch-slice-b mix-blend-screen"
            >
              <Image
                src={currentBackdrop}
                alt=""
                fill
                sizes="100vw"
                className="object-cover object-center opacity-60 brightness-125 -hue-rotate-15"
                unoptimized={currentBackdrop.startsWith("http") || currentBackdrop.startsWith("data:")}
              />
            </div>
          </>
        )}

        {/* Balanced Dark Scrim & Warm Brand Accent Ambient Radial Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#08080d]/80 via-[#08080d]/60 to-[#08080d]/95"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(65% 55% at 50% 25%, rgba(220, 184, 88, 0.14) 0%, rgba(8, 8, 13, 0) 80%)",
          }}
        />

        {/* Centered Editorial Content Stack (EKO Innovations Page 1 Hierarchy) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Top Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/5 backdrop-blur-md ring-1 ring-white/15 text-zinc-200 text-xs font-headline font-semibold tracking-wide mb-4 shadow-lg"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dcb858] shrink-0" />
            <span>{content.announcementBadge}</span>
          </motion.div>

          {/* Centered Display Headline with Art Work Yellow Accent */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline font-black text-3xl sm:text-5xl lg:text-[56px] tracking-tight leading-[1.08] text-white max-w-4xl mb-4"
          >
            <span>{content.headlinePart1}</span>{" "}
            <span className="text-[#dcb858] drop-shadow-[0_2px_24px_rgba(220,184,88,0.32)]">
              {content.headlinePart2}
            </span>
          </motion.h1>

          {/* Centered Subtitle Copy */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-xs sm:text-sm md:text-base text-zinc-300 max-w-2xl leading-relaxed mb-6"
          >
            {content.introParagraph}
          </motion.p>

          {/* 3 Action Pills (EKO Reference Layout) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-3 mb-6"
          >
            {/* Primary Solid Yellow Pill */}
            <button
              onClick={() => {
                if (typeof window !== "undefined") {
                  window.dispatchEvent(
                    new CustomEvent("artwork:navigate-stage", { detail: { stage: "stage-04" } })
                  );
                  const briefSec = document.getElementById("brief-inquiry");
                  if (briefSec) briefSec.scrollIntoView({ behavior: "smooth" });
                }
              }}
              className="group inline-flex items-center justify-center gap-2 bg-[#dcb858] hover:bg-yellow-300 text-black font-headline font-bold text-xs sm:text-sm px-6 py-3 rounded-full shadow-[0_8px_24px_rgba(220,184,88,0.32)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
              <span>{primaryCta}</span>
            </button>

            {/* Secondary Translucent Pill */}
            <MagneticButton soundType="click">
              <button
                onClick={onViewCapabilities}
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-white/10 text-white font-headline font-bold text-xs sm:text-sm px-6 py-3 rounded-full backdrop-blur-md ring-1 ring-white/15 hover:ring-white/30 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>{secondaryCta}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </MagneticButton>

            {/* Tertiary Action Pill */}
            {onExploreShowreel ? (
              <button
                onClick={onExploreShowreel}
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-[#dcb858]/15 text-zinc-200 hover:text-white font-headline font-bold text-xs sm:text-sm px-6 py-3 rounded-full backdrop-blur-md ring-1 ring-[#dcb858]/50 hover:ring-[#dcb858] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#dcb858] stroke-[2.2]" />
                <span>{performanceBadge}</span>
              </button>
            ) : (
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-white/5 hover:bg-[#dcb858]/15 text-zinc-200 hover:text-white font-headline font-bold text-xs sm:text-sm px-6 py-3 rounded-full backdrop-blur-md ring-1 ring-[#dcb858]/50 hover:ring-[#dcb858] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <Download className="w-4 h-4 text-[#dcb858] stroke-[2.2]" />
                <span>{performanceBadge}</span>
              </Link>
            )}
          </motion.div>

          {/* Interactive Quick Intake Bar Capsule (EKO Page 1 Reference) */}
          <motion.form
            onSubmit={handleQuickProposal}
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
            className="w-full max-w-2xl mx-auto mb-6 p-2 rounded-2xl sm:rounded-full bg-[#0d0d15]/80 backdrop-blur-xl ring-1 ring-white/15 hover:ring-[#dcb858]/40 transition-all flex flex-col sm:flex-row items-center gap-2 shadow-2xl"
          >
            <div className="flex-1 w-full flex items-center px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10 text-xs">
              <input
                type="text"
                placeholder="Full Name"
                value={quickName}
                onChange={(e) => setQuickName(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-zinc-500 focus:outline-none font-body text-xs"
                id="hero-quick-name"
              />
            </div>
            <div className="flex-1 w-full flex items-center px-4 py-2 rounded-full bg-white/5 ring-1 ring-white/10 text-xs">
              <input
                type="text"
                placeholder="Work Email or WhatsApp"
                value={quickContact}
                onChange={(e) => setQuickContact(e.target.value)}
                className="w-full bg-transparent text-white placeholder:text-zinc-500 focus:outline-none font-body text-xs"
                id="hero-quick-contact"
              />
            </div>
            <button
              type="submit"
              className="w-full sm:w-auto inline-flex items-center justify-center gap-2 px-6 py-2.5 rounded-full bg-[#dcb858] hover:bg-yellow-300 text-black font-headline font-bold text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0 shadow-lg hover:scale-105 active:scale-95"
            >
              <span>Get Proposal</span>
              <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
            </button>
          </motion.form>

          {/* 4 EKO-Style Value Pillars Strip at Hero Base */}
          <motion.div
            initial={{ opacity: 0, y: 15 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.25, ease: [0.22, 1, 0.36, 1] }}
            className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3 w-full max-w-5xl text-left mt-2"
          >
            {HERO_VALUE_PILLARS.map((item) => {
              const Icon = item.icon;
              return (
                <div
                  key={item.title}
                  className="p-4 rounded-xl bg-white/[0.03] hover:bg-white/[0.06] ring-1 ring-white/10 hover:ring-[#dcb858]/40 transition-all duration-200 group"
                >
                  <div className="flex items-center gap-2.5 mb-2">
                    <div className="w-7 h-7 rounded-lg bg-[#dcb858]/10 ring-1 ring-[#dcb858]/30 flex items-center justify-center text-[#dcb858] group-hover:bg-[#dcb858] group-hover:text-black transition-colors">
                      <Icon className="w-4 h-4 stroke-[2]" />
                    </div>
                    <div className="font-headline font-bold text-xs text-white group-hover:text-[#dcb858] transition-colors">
                      {item.title}
                    </div>
                  </div>
                  <p className="font-body text-[11px] text-zinc-400 leading-snug">
                    {item.description}
                  </p>
                </div>
              );
            })}
          </motion.div>

          {/* Minimalist Proof Tagline */}
          <div className="mt-5 text-[10px] font-mono uppercase tracking-widest text-zinc-500">
            {proofTagline}
          </div>
        </div>
      </div>

      {/* SECTION 02: PARTNERS & CLIENT NETWORK TICKER */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-6">
        <PartnersMarquee
          companies={companies}
          partnersBadge={content.partnersBadge}
          partnersHeadlinePrefix={content.partnersHeadlinePrefix}
          partnersHeadlineHighlight={content.partnersHeadlineHighlight}
          starburstText={content.starburstText}
        />
      </div>
    </div>
  );
});
