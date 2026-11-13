"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { DEFAULT_COMPANIES } from "@art-work/types";
import { MagneticButton } from "@/components/cinematic/MagneticButton";
import { PartnersMarquee } from "./PartnersMarquee";
import { DEFAULT_HERO_CONTENT, type ManifestoHeroProps } from "./types";

const STUDIO_BACKDROP_VARIANTS = [
  "/assets/images/blueprint_stage_scenography.webp",
  "/assets/images/creative_chief_intake.webp",
] as const;

export const ManifestoHero = React.memo(function ManifestoHero({
  onViewCapabilities,
  onExploreShowreel,
  content = DEFAULT_HERO_CONTENT,
  companies = DEFAULT_COMPANIES,
}: ManifestoHeroProps) {
  const heroImg = content.heroImage || "/assets/images/hero_studio_collective.jpg";
  const heroAlt = content.heroImageAlt || "Art Work Creative Marketing Studio Collective";
  const primaryCta = content.primaryCtaText || "VIEW OUR PROJECTS";
  const secondaryCta = content.secondaryCtaText || "EXPLORE OUR SERVICES";
  const proofTagline =
    content.proofTagline || "CREATIVE | PLANNING | PRODUCTION | ON-SITE DELIVERY";
  const performanceBadge = content.performanceBadge || "PERFORMANCE MARKETING";

  const backdropImages = useMemo(
    () => Array.from(new Set([heroImg, ...STUDIO_BACKDROP_VARIANTS])),
    [heroImg]
  );

  const [activeImageIdx, setActiveImageIdx] = useState(0);
  const [isGlitching, setIsGlitching] = useState(false);

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

  return (
    <div className="w-full flex flex-col justify-start">
      {/* Edge-to-Edge Full-Width Hero Stage sized cleanly inside initial viewport */}
      <div className="relative w-full overflow-hidden min-h-[calc(100svh-132px)] md:min-h-[calc(100vh-104px)] flex flex-col items-center justify-center px-4 sm:px-8 lg:px-12 py-5 sm:py-6 bg-[#0C0C10]">
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
            className="object-cover object-center opacity-55 transition-opacity duration-200"
            unoptimized={currentBackdrop.startsWith("http") || currentBackdrop.startsWith("data:")}
          />
        </div>

        {/* Sliced Chromatic Glitch Burst Layers (active for 360ms on 3s transition) */}
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
                className="object-cover object-center opacity-70 saturate-150 hue-rotate-15"
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
                className="object-cover object-center opacity-65 brightness-125 -hue-rotate-15"
                unoptimized={currentBackdrop.startsWith("http") || currentBackdrop.startsWith("data:")}
              />
            </div>
            <div
              aria-hidden="true"
              className="absolute inset-0 pointer-events-none opacity-25"
              style={{
                backgroundImage:
                  "repeating-linear-gradient(0deg, rgba(220,184,88,0.22) 0px, rgba(220,184,88,0.22) 2px, transparent 2px, transparent 6px)",
              }}
            />
          </>
        )}

        {/* Balanced Dark Scrim & Warm Brand Yellow Ambient Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#0C0C10]/75 via-[#0C0C10]/58 to-[#0C0C10]/88"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 28%, rgba(220, 184, 88, 0.16) 0%, rgba(12, 12, 16, 0) 75%)",
          }}
        />

        {/* Centered Editorial Content Stack (fits cleanly above footer on laptop viewports) */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Top Centered Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -6 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/10 backdrop-blur-md ring-1 ring-white/20 text-zinc-100 text-[10px] sm:text-xs font-headline font-semibold tracking-wide mb-3 sm:mb-4"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dcb858] shrink-0" />
            <span>{content.announcementBadge}</span>
          </motion.div>

          {/* Centered Display Headline with Art Work Yellow Accent */}
          <motion.h1
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline font-black text-2xl xs:text-3xl sm:text-4xl lg:text-[46px] xl:text-[54px] tracking-tight leading-[1.06] text-white max-w-4xl mb-3 sm:mb-4"
          >
            <span>{content.headlinePart1}</span>{" "}
            <span className="text-[#dcb858] drop-shadow-[0_2px_20px_rgba(220,184,88,0.28)]">
              {content.headlinePart2}
            </span>
          </motion.h1>

          {/* Centered Subtitle Copy */}
          <motion.p
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-xs sm:text-sm md:text-base text-zinc-200/90 max-w-2xl leading-relaxed mb-5 sm:mb-6"
          >
            {content.introParagraph}
          </motion.p>

          {/* Centered Action Pill Row (Reference Layout in Brand Yellow) */}
          <motion.div
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-2.5 sm:gap-3 mb-5 sm:mb-6"
          >
            {/* Primary Solid Yellow Pill */}
            <Link
              href="/gallery"
              className="group inline-flex items-center justify-center gap-2 bg-[#dcb858] hover:bg-yellow-300 text-black font-headline font-black text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-full shadow-[0_8px_28px_rgba(220,184,88,0.34)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
              <span>{primaryCta}</span>
            </Link>

            {/* Secondary Translucent Pill */}
            <MagneticButton soundType="click">
              <button
                onClick={onViewCapabilities}
                className="inline-flex items-center justify-center gap-2 bg-white/10 hover:bg-white/18 text-white font-headline font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-full backdrop-blur-md ring-1 ring-white/25 hover:ring-white/50 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>{secondaryCta}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </MagneticButton>

            {/* Tertiary Yellow-Ringed Pill */}
            {onExploreShowreel ? (
              <button
                onClick={onExploreShowreel}
                className="inline-flex items-center justify-center gap-2 bg-[#0C0C10]/70 hover:bg-[#dcb858]/15 text-white font-headline font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-full backdrop-blur-md ring-1 ring-[#dcb858]/70 hover:ring-[#dcb858] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-[#dcb858] stroke-[2.2]" />
                <span>{performanceBadge}</span>
              </button>
            ) : (
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-[#0C0C10]/70 hover:bg-[#dcb858]/15 text-white font-headline font-bold text-xs sm:text-sm px-5 sm:px-6 py-2.5 sm:py-3 rounded-full backdrop-blur-md ring-1 ring-[#dcb858]/70 hover:ring-[#dcb858] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-[#dcb858] stroke-[2.2]" />
                <span>{performanceBadge}</span>
              </Link>
            )}
          </motion.div>

          {/* Compact Glass Milestone Metrics & Studio Tagline */}
          <div className="w-full max-w-lg flex flex-col items-center gap-2.5">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
              {(content.metrics || DEFAULT_HERO_CONTENT.metrics).map((badge, idx) => (
                <motion.div
                  key={`${badge.label}-${idx}`}
                  initial={{ opacity: 0, y: 8 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: 0.1 + idx * 0.05, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white/8 backdrop-blur-md ring-1 ring-white/15 px-2.5 sm:px-3.5 py-1.5 sm:py-2 rounded-xl text-center"
                >
                  <div className="font-headline font-black text-sm sm:text-base text-[#dcb858]">
                    {badge.num}
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-headline font-semibold text-zinc-200 uppercase tracking-wider mt-0.5">
                    {badge.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-[9px] sm:text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-300/80">
              {proofTagline}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 02: PARTNERS & CLIENT NETWORK TICKER */}
      <div className="w-full max-w-7xl mx-auto px-4 sm:px-6 pb-6">
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
