"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles, TrendingUp } from "lucide-react";
import { DEFAULT_COMPANIES } from "@art-work/types";
import { MagneticButton } from "@/components/cinematic/MagneticButton";
import { PartnersMarquee } from "./PartnersMarquee";
import { DEFAULT_HERO_CONTENT, type ManifestoHeroProps } from "./types";

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

  return (
    <div className="w-full max-w-7xl mx-auto pt-2 sm:pt-4 pb-6 flex flex-col justify-start">
      {/* Centered Full-Bleed Studio Hero Stage (Art Work Yellow #dcb858 Brand Palette) */}
      <div className="relative overflow-hidden rounded-2xl sm:rounded-3xl min-h-[430px] sm:min-h-[490px] lg:min-h-[530px] flex flex-col items-center justify-center px-5 sm:px-10 py-10 sm:py-12 bg-[#0C0C10] ring-1 ring-black/15 dark:ring-white/10 shadow-[0_24px_70px_rgba(0,0,0,0.42)]">
        {/* Full-Bleed Studio Backdrop Image */}
        <Image
          src={heroImg}
          alt={heroAlt}
          fill
          priority
          sizes="(max-width: 768px) 100vw, 1280px"
          className="object-cover object-center scale-[1.03] opacity-40"
          unoptimized={heroImg.startsWith("http") || heroImg.startsWith("data:")}
        />

        {/* Moody Gradient & Warm Brand Yellow Ambient Overlay */}
        <div
          aria-hidden="true"
          className="absolute inset-0 bg-gradient-to-b from-[#0C0C10]/80 via-[#0C0C10]/72 to-[#0C0C10]/94"
        />
        <div
          aria-hidden="true"
          className="absolute inset-0 pointer-events-none"
          style={{
            background:
              "radial-gradient(60% 50% at 50% 25%, rgba(220, 184, 88, 0.16) 0%, rgba(12, 12, 16, 0) 75%)",
          }}
        />

        {/* Centered Editorial Content Stack */}
        <div className="relative z-10 w-full max-w-4xl mx-auto flex flex-col items-center text-center">
          {/* Top Centered Pill Badge */}
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.35, ease: [0.22, 1, 0.36, 1] }}
            className="inline-flex items-center gap-2 px-4 py-1.5 rounded-full bg-white/8 backdrop-blur-md ring-1 ring-white/15 text-zinc-100 text-[11px] sm:text-xs font-headline font-semibold tracking-wide mb-5 sm:mb-6"
          >
            <Sparkles className="w-3.5 h-3.5 text-[#dcb858] shrink-0" />
            <span>{content.announcementBadge}</span>
          </motion.div>

          {/* Centered Multi-Line Display Headline with Art Work Yellow Accent */}
          <motion.h1
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
            className="font-headline font-black text-3xl xs:text-4xl sm:text-5xl lg:text-[54px] xl:text-[60px] tracking-tight leading-[1.08] text-white max-w-4xl mb-4 sm:mb-5"
          >
            <span>{content.headlinePart1}</span>{" "}
            <span className="text-[#dcb858] drop-shadow-[0_2px_20px_rgba(220,184,88,0.28)]">
              {content.headlinePart2}
            </span>
          </motion.h1>

          {/* Centered Subtitle Copy */}
          <motion.p
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="font-body text-sm sm:text-base md:text-lg text-zinc-300/90 max-w-2xl leading-relaxed mb-7 sm:mb-8"
          >
            {content.introParagraph}
          </motion.p>

          {/* Centered Action Pill Row (Reference Layout in Brand Yellow) */}
          <motion.div
            initial={{ opacity: 0, y: 12 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
            className="flex flex-wrap items-center justify-center gap-3 sm:gap-3.5 mb-7 sm:mb-8"
          >
            {/* Primary Solid Yellow Pill */}
            <Link
              href="/gallery"
              className="group inline-flex items-center justify-center gap-2 bg-[#dcb858] hover:bg-yellow-300 text-black font-headline font-black text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 rounded-full shadow-[0_8px_28px_rgba(220,184,88,0.34)] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
            >
              <Sparkles className="w-4 h-4 stroke-[2.2]" />
              <span>{primaryCta}</span>
            </Link>

            {/* Secondary Translucent Pill */}
            <MagneticButton soundType="click">
              <button
                onClick={onViewCapabilities}
                className="inline-flex items-center justify-center gap-2 bg-white/8 hover:bg-white/15 text-white font-headline font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 rounded-full backdrop-blur-md ring-1 ring-white/22 hover:ring-white/45 hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <span>{secondaryCta}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.2]" />
              </button>
            </MagneticButton>

            {/* Tertiary Yellow-Ringed Pill */}
            {onExploreShowreel ? (
              <button
                onClick={onExploreShowreel}
                className="inline-flex items-center justify-center gap-2 bg-[#0C0C10]/65 hover:bg-[#dcb858]/15 text-white font-headline font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 rounded-full backdrop-blur-md ring-1 ring-[#dcb858]/65 hover:ring-[#dcb858] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-[#dcb858] stroke-[2.2]" />
                <span>{performanceBadge}</span>
              </button>
            ) : (
              <Link
                href="/gallery"
                className="inline-flex items-center justify-center gap-2 bg-[#0C0C10]/65 hover:bg-[#dcb858]/15 text-white font-headline font-bold text-xs sm:text-sm px-6 sm:px-7 py-3 sm:py-3.5 rounded-full backdrop-blur-md ring-1 ring-[#dcb858]/65 hover:ring-[#dcb858] hover:-translate-y-0.5 active:scale-95 transition-all duration-200 cursor-pointer"
              >
                <TrendingUp className="w-4 h-4 text-[#dcb858] stroke-[2.2]" />
                <span>{performanceBadge}</span>
              </Link>
            )}
          </motion.div>

          {/* Compact Glass Milestone Metrics & Studio Tagline */}
          <div className="w-full max-w-xl flex flex-col items-center gap-3">
            <div className="grid grid-cols-3 gap-2 sm:gap-3 w-full">
              {(content.metrics || DEFAULT_HERO_CONTENT.metrics).map((badge, idx) => (
                <motion.div
                  key={`${badge.label}-${idx}`}
                  initial={{ opacity: 0, y: 10 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.35, delay: 0.1 + idx * 0.06, ease: [0.22, 1, 0.36, 1] }}
                  className="bg-white/6 backdrop-blur-md ring-1 ring-white/12 px-2.5 sm:px-4 py-2 sm:py-2.5 rounded-xl text-center"
                >
                  <div className="font-headline font-black text-sm sm:text-lg text-[#dcb858]">
                    {badge.num}
                  </div>
                  <div className="text-[9px] sm:text-[10px] font-headline font-semibold text-zinc-300 uppercase tracking-wider mt-0.5">
                    {badge.label}
                  </div>
                </motion.div>
              ))}
            </div>

            <div className="text-[10px] font-mono font-bold uppercase tracking-widest text-zinc-400">
              {proofTagline}
            </div>
          </div>
        </div>
      </div>

      {/* SECTION 02: PARTNERS & CLIENT NETWORK TICKER */}
      <PartnersMarquee
        companies={companies}
        partnersBadge={content.partnersBadge}
        partnersHeadlinePrefix={content.partnersHeadlinePrefix}
        partnersHeadlineHighlight={content.partnersHeadlineHighlight}
        starburstText={content.starburstText}
      />
    </div>
  );
});
