"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, ArrowDown, TrendingUp } from "lucide-react";
import { DEFAULT_COMPANIES } from "@art-work/types";
import { MagneticButton } from "@/components/cinematic/MagneticButton";
import { KineticBrushWord, KineticBrushStroke } from "@/components/cinematic/KineticBrushStroke";
import { PartnersMarquee } from "./PartnersMarquee";
import { DEFAULT_HERO_CONTENT, type ManifestoHeroProps } from "./types";

export function ManifestoHero({
  onViewCapabilities,
  content = DEFAULT_HERO_CONTENT,
  companies = DEFAULT_COMPANIES,
}: ManifestoHeroProps) {
  return (
    <div className="w-full max-w-7xl mx-auto pt-3 sm:pt-6 pb-6 flex flex-col justify-start">
      {/* 2-Column Responsive Hero Grid (Level & Aligned with Studio Canvas) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 lg:gap-7 items-start">
        {/* Left Column: Headline, Paragraph, Actions, Metrics & Badges */}
        <div className="lg:col-span-6 flex flex-col justify-start">
          {/* Hero Typography Section */}
          <div className="relative mb-2 sm:mb-2.5 max-w-xl">
            <h1 className="font-headline font-black text-2xl xs:text-3xl sm:text-4xl md:text-5xl lg:text-[40px] xl:text-[46px] tracking-tight leading-[1.08] sm:leading-[1.04] text-black dark:text-white">
              <KineticBrushWord variant="wave" color="var(--color-primary-yellow, #dcb858)" strokeWidth={2.4} delay={0.1}>
                {content.headlinePart1}
              </KineticBrushWord>{" "}
              <br />
              <span className="relative inline-block mt-1 sm:mt-1.5">
                {/* Canary Yellow Ink Splash Backdrop */}
                <motion.span
                  initial={{ scaleX: 0, originX: 0 }}
                  animate={{ scaleX: 1 }}
                  transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
                  className="absolute -inset-0.5 sm:-inset-1 bg-yellow-400 -rotate-1 rounded-DEFAULT -z-10 border-2 border-black comic-shadow"
                ></motion.span>
                <span className="text-black relative z-10 px-1.5 sm:px-2.5">{content.headlinePart2}</span>
                {/* Slender Hand-drawn Paintbrush Stroke */}
                <KineticBrushStroke variant="double" color="#111111" strokeWidth={2.0} delay={0.35} />
              </span>
            </h1>
          </div>

          {/* Action Cluster & Info */}
          <div className="space-y-2 sm:space-y-2.5 max-w-lg">
            <p className="font-body text-sm sm:text-base text-black/85 dark:text-zinc-200 leading-relaxed">
              {content.introParagraph}
            </p>

            {/* Primary Action Buttons: View Projects + Explore Services */}
            <div className="flex flex-wrap items-center gap-2.5 pt-1">
              <Link
                href="/gallery"
                className="relative group inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-xl border-2 border-black comic-shadow transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 cursor-pointer"
              >
                <span>VIEW OUR PROJECTS</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </Link>

              <MagneticButton soundType="click">
                <button
                  onClick={onViewCapabilities}
                  className="inline-flex items-center gap-1.5 bg-white dark:bg-[#161622] text-black dark:text-white hover:bg-black dark:hover:bg-yellow-400 hover:text-white dark:hover:text-black font-headline font-bold text-xs sm:text-sm px-4 sm:px-4.5 py-2.5 sm:py-3 rounded-xl border-2 border-black dark:border-zinc-600 comic-shadow-sm transition-all duration-150 cursor-pointer"
                >
                  <span>EXPLORE OUR SERVICES</span>
                  <ArrowDown className="w-4 h-4 stroke-[2.5]" />
                </button>
              </MagneticButton>
            </div>

            {/* Safe Proof Tagline */}
            <div className="text-[10px] font-mono font-bold uppercase tracking-wider text-black/60 dark:text-zinc-400 pt-0.5">
              CREATIVE | PLANNING | PRODUCTION | ON-SITE DELIVERY
            </div>

            {/* Milestone Badges */}
            <div className="grid grid-cols-3 gap-2 pt-1 max-w-md">
              {content.metrics.map((badge, idx) => (
                <motion.div
                  key={badge.label}
                  initial={{ opacity: 0, y: 15 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true, amount: 0.2 }}
                  transition={{ duration: 0.4, delay: 0.1 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                  className="border-2 border-black dark:border-zinc-700 bg-white dark:bg-[#151520] p-2 sm:p-2.5 rounded-DEFAULT comic-shadow-sm text-center"
                >
                  <div className="font-headline font-black text-sm sm:text-base md:text-lg text-black dark:text-white">
                    {badge.num}
                  </div>
                  <div className="text-[8px] sm:text-[9px] font-headline font-bold text-black/70 dark:text-zinc-400 uppercase mt-0.5">
                    {badge.label}
                  </div>
                </motion.div>
              ))}
            </div>

            {/* Bottom Floating Badges (Positioned cleanly at bottom of Hero) */}
            <div className="flex flex-wrap items-center gap-2 sm:gap-2.5 pt-2">
              <motion.div
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.35, delay: 0.15 }}
                className="relative bg-white dark:bg-[#151520] border border-black/15 dark:border-zinc-700 px-3 py-1 rounded-lg shadow-sm flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-tight text-black dark:text-zinc-200"
              >
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                <span>PERFORMANCE MARKETING</span>
              </motion.div>

              <div className="inline-flex items-center gap-1.5 border border-black/20 bg-yellow-400 text-black px-3.5 py-1 rounded-lg shadow-sm font-headline text-[10px] sm:text-xs font-black uppercase tracking-wider">
                <span>{content.announcementBadge}</span>
              </div>
            </div>
          </div>
        </div>

        {/* Right Visual: Clean, Modern Edge-to-Edge Artwork */}
        <motion.div
          initial={{ opacity: 0, x: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-6 relative w-full pt-1"
        >
          <div className="relative overflow-hidden rounded-2xl aspect-[16/10] min-h-[220px] sm:min-h-[270px] lg:min-h-[320px] xl:min-h-[360px] flex items-center justify-center shadow-2xl">
            <Image
              src="/assets/images/hero_studio_collective.jpg"
              alt="Art Work Creative Marketing Studio Collective"
              fill
              priority
              sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
              className="object-cover rounded-2xl"
            />
          </div>
        </motion.div>
      </div>

      {/* SECTION 02: PARTNERS & CLIENT NETWORK TICKER */}
      <PartnersMarquee companies={companies} />
    </div>
  );
}
