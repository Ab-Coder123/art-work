"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import { IntroLoader } from "@/components/cinematic/IntroLoader";
import { Capabilities3DMatrix } from "@/components/cinematic/Capabilities3DMatrix";
import { KineticDoodlesLayer } from "@/components/cinematic/KineticDoodlesLayer";
import { KineticMotionArrows } from "@/components/cinematic/KineticMotionArrows";
import { KineticPaintPen } from "@/components/cinematic/KineticPaintPen";
import { DeferredKinetic3DBackground } from "@/components/cinematic/DeferredKinetic3DBackground";
import { InteractiveDoodleCanvas } from "@/components/cinematic/InteractiveDoodleCanvas";
import { SoundToggle } from "@/components/cinematic/SoundToggle";
import { MagneticButton } from "@/components/cinematic/MagneticButton";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { soundFX } from "@/utils/soundFX";
import { useDoodleStore } from "@/store/useDoodleStore";
import { KineticBrushWord, KineticBrushStroke } from "@/components/cinematic/KineticBrushStroke";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";
import { ThemeToggle } from "@/components/cinematic/ThemeToggle";
import {
  ArrowRight,
  ArrowDown,
  Pencil,
  Lightbulb,
  Paintbrush,
  Layers,
  CheckCircle2,
  Sparkles,
  Zap,
  Palette,
  Compass,
  Send,
  AlertCircle,
  Loader2,
  TrendingUp,
} from "lucide-react";

import rawProjects from "@/data/projects.json";
import { DEFAULT_SITE_CONTENT } from "@art-work/database/content/default-content";
import {
  type ContactSectionContent,
  type ProjectRecord,
  resolveSafeYouTubeEmbed,
  getProjectThumbnailUrl,
} from "@art-work/types";

type StageId = "stage-01" | "stage-02" | "stage-03" | "stage-gallery" | "stage-04";
const STAGE_ORDER: StageId[] = ["stage-01", "stage-02", "stage-03", "stage-gallery", "stage-04"];
const DEFAULT_HERO_CONTENT = {
  announcementBadge: DEFAULT_SITE_CONTENT.manifesto.announcementBadge,
  editionBadge: DEFAULT_SITE_CONTENT.manifesto.editionBadge,
  headlinePart1: DEFAULT_SITE_CONTENT.manifesto.headlinePart1,
  headlinePart2: DEFAULT_SITE_CONTENT.manifesto.headlinePart2,
  introParagraph: DEFAULT_SITE_CONTENT.manifesto.introParagraph,
  metrics: DEFAULT_SITE_CONTENT.manifesto.metrics,
};
const DEFAULT_WHY_US_CONTENT = DEFAULT_SITE_CONTENT.whyUsTeaser;

/* =========================================================================
   SCENE 01: HERO / MANIFESTO COMPONENT
   ========================================================================= */
interface ManifestoContentProps {
  onViewCapabilities: () => void;
  onExploreShowreel?: () => void;
  onViewGallery?: () => void;
  content: {
    announcementBadge: string;
    editionBadge: string;
    headlinePart1: string;
    headlinePart2: string;
    introParagraph: string;
    metrics: Array<{ num: string; label: string }>;
  };
}

function ManifestoContent({
  onViewCapabilities,
  content = DEFAULT_HERO_CONTENT,
}: ManifestoContentProps) {
  return (
    <div className="w-full max-w-7xl mx-auto pt-2 pb-6 flex flex-col justify-start">
      {/* Technical Header Ribbon (Matching Why-Us Scene Architecture & Proportions) */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black dark:border-zinc-800 pb-2.5 mb-4 sm:mb-5 text-xs font-mono uppercase tracking-widest text-black/70 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-black text-white font-black text-[10px]">SCENE // 01</span>
          <span className="font-bold">CREATIVE MARKETING MANIFESTO &amp; ARENA ARCHITECTURE</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>CAD: REV-2026.04</span>
          <span>•</span>
          <span>STAGE: PINNED PERSPECTIVE</span>
          <span>•</span>
          <span className="text-black dark:text-white font-extrabold">STATUS: 100% UNAPOLOGETIC</span>
        </div>
      </div>

      {/* Top Floating Badges (Fluid Flex Alignment with Performance Marketing Badge) */}
      <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-3 sm:mb-4">
        <motion.div
          initial={{ opacity: 0, y: -8, rotate: -3 }}
          animate={{ opacity: 1, y: 0, rotate: -2 }}
          transition={{ duration: 0.35, delay: 0.1 }}
          className="relative bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 px-3 py-1 rounded-lg shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 text-[11px] sm:text-xs font-bold tracking-tight text-black dark:text-zinc-200"
        >
          <div className="washi-tape"></div>
          <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
          <span>
            PERFORMANCE MARKETING{" "}
            <strong className="bg-yellow-300 dark:bg-yellow-400 text-black px-1 rounded font-black">
              (+340% ROI)
            </strong>
          </span>
        </motion.div>

        <div className="inline-flex items-center gap-1.5 border-2 border-black bg-white dark:bg-[#151520] text-black dark:text-zinc-200 px-3 sm:px-3.5 py-1 rounded-lg comic-shadow-sm font-headline text-[10px] sm:text-xs font-black uppercase tracking-wider">
          <span className="text-yellow-500 font-black">★</span>
          <span>{content.announcementBadge}</span>
          <span className="bg-yellow-400 text-black px-2 py-0.5 rounded font-bold ml-1 text-[9px] sm:text-[10px]">
            {content.editionBadge}
          </span>
        </div>

        {/* Sticky Note Callout 01 */}
        <div className="hidden xs:block relative -rotate-2 hover:rotate-0 transition-transform duration-200">
          <div className="bg-yellow-200 border-2 border-black px-3 py-1 text-[10px] sm:text-xs font-headline font-bold text-black comic-shadow-sm flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-black stroke-[2]" />
            <span>STICKY_NOTE_01.CAD: &quot;Zero cookie-cutter templates.&quot;</span>
          </div>
          <div className="absolute -top-1.5 left-4 w-6 h-2 bg-white/70 border border-black/40 rotate-2"></div>
        </div>
      </div>

      {/* Hero Typography Section */}
      <div className="relative mb-3 sm:mb-4 max-w-5xl">
        <h1 className="font-headline font-black text-3xl xs:text-4xl sm:text-5xl md:text-6xl lg:text-[54px] xl:text-[64px] tracking-tight leading-[1.08] sm:leading-[1.04] text-black dark:text-white">
          <KineticBrushWord variant="wave" color="#dcb858" strokeWidth={2.4} delay={0.1}>
            {content.headlinePart1}
          </KineticBrushWord> <br />
          <span className="relative inline-block mt-1 sm:mt-2">
            {/* Canary Yellow Ink Splash Backdrop */}
            <motion.span
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="absolute -inset-1 sm:-inset-2 bg-yellow-400 -rotate-1 rounded-DEFAULT -z-10 border-2 border-black comic-shadow"
            ></motion.span>
            <span className="text-black relative z-10 px-2 sm:px-3">{content.headlinePart2}</span>
            {/* Slender Hand-drawn Paintbrush Stroke */}
            <KineticBrushStroke variant="double" color="#111111" strokeWidth={2.2} delay={0.35} />
          </span>
        </h1>

        {/* Comic Starburst / POW Badge */}
        <div className="absolute -top-3 right-0 sm:right-6 hidden sm:block animate-star-pulse">
          <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
            <svg
              className="w-full h-full fill-yellow-400 stroke-black stroke-2 drop-shadow-md"
              viewBox="0 0 100 100"
            >
              <polygon points="50,0 63,28 95,20 78,48 100,70 69,76 65,100 45,82 18,95 24,68 0,55 25,36 15,10 44,22"></polygon>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 text-black font-headline font-black text-[8px] sm:text-[9px] uppercase leading-tight -rotate-6">
              <span>100% RAW</span>
              <span className="bg-black text-white px-1 py-0.2 rounded-sm text-[7px]">UNAPOLOGETIC</span>
              <span>CREATIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cluster & Team Collective Art with Magnetic Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
        <div className="lg:col-span-5 space-y-3 sm:space-y-4">
          <p className="font-body text-sm sm:text-base text-black/85 dark:text-zinc-200 max-w-md leading-relaxed">
            {content.introParagraph}
          </p>

          {/* Primary Action Buttons: Gallery + Capabilities */}
          <div className="flex flex-wrap items-center gap-2.5 pt-1">
            <Link
              href="/gallery"
              className="relative group inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-black text-xs sm:text-sm px-4 sm:px-5 py-2.5 sm:py-3 rounded-DEFAULT border-2 border-black comic-shadow transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 cursor-pointer"
            >
              <span>★ EXPLORE GALLERY</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>

            <MagneticButton soundType="click">
              <button
                onClick={onViewCapabilities}
                className="inline-flex items-center gap-1.5 bg-white dark:bg-[#161622] text-black dark:text-white hover:bg-black dark:hover:bg-yellow-400 hover:text-white dark:hover:text-black font-headline font-bold text-xs sm:text-sm px-4 sm:px-4.5 py-2.5 sm:py-3 rounded-DEFAULT border-2 border-black dark:border-zinc-600 comic-shadow-sm transition-all duration-150 cursor-pointer"
              >
                <span>OUR DISCIPLINES</span>
                <ArrowDown className="w-4 h-4 stroke-[2.5]" />
              </button>
            </MagneticButton>
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
        </div>

        {/* Right Visual: Collective Canvas */}
        <motion.div
          initial={{ opacity: 0, x: 25, scale: 0.98 }}
          whileInView={{ opacity: 1, x: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.5, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 relative w-full"
        >
          <div className="border-2 sm:border-3 border-black dark:border-zinc-600 bg-white dark:bg-[#151520] rounded-xl p-2.5 sm:p-3 comic-shadow relative group">
            <div className="absolute -top-2.5 left-6 w-12 h-5 bg-yellow-300/80 border border-black/30 -rotate-3 z-30"></div>
            <div className="absolute -top-2.5 right-6 w-12 h-5 bg-yellow-300/80 border border-black/30 rotate-2 z-30"></div>

            <div className="flex items-center justify-between pb-1.5 mb-2 border-b border-black/10 dark:border-white/10 text-xs font-headline font-bold text-black dark:text-white">
              <div className="flex items-center gap-1.5">
                <span className="w-2.5 h-2.5 rounded-full bg-red-500 border border-black"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black"></span>
                <span className="w-2.5 h-2.5 rounded-full bg-green-500 border border-black"></span>
                <span className="ml-1 text-black/60 dark:text-zinc-400 font-mono text-[10px] sm:text-xs">
                  STUDIO_COLLECTIVE_CANVAS.V4
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px] sm:text-xs">
                <Paintbrush className="w-3.5 h-3.5 text-black dark:text-yellow-400" />
                <span className="dark:text-yellow-400">INK_LAYER_ACTIVE</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded-lg border-2 border-black dark:border-zinc-700 bg-white dark:bg-[#0E0E14] aspect-[16/10] min-h-[220px] sm:min-h-[270px] lg:min-h-[320px] xl:min-h-[360px] flex items-center justify-center">
              <Image
                src="/assets/images/hero_studio_collective.webp"
                alt="Art Work Creative Marketing Studio Collective"
                fill
                priority
                sizes="(max-width: 768px) 100vw, (max-width: 1024px) 50vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </motion.div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 02: WHY US / BENTO & BLUEPRINT COMPONENT
   ========================================================================= */
function WhyUsContent({ content = DEFAULT_WHY_US_CONTENT }: { content?: typeof DEFAULT_WHY_US_CONTENT }) {
  return (
    <div className="w-full max-w-7xl mx-auto pt-2 pb-6 flex flex-col justify-start">
      {/* Technical Header Ribbon */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black dark:border-zinc-800 pb-2.5 mb-4 sm:mb-5 text-xs font-mono uppercase tracking-widest text-black/70 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-black text-white font-black text-[10px]">SCENE // 02</span>
          <span className="font-bold">AGENCY PROPOSITION &amp; EXPERIENTIAL PROOF</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>CAD: REV-2026.04</span>
          <span>•</span>
          <span>STAGE: PINNED PERSPECTIVE</span>
          <span>•</span>
          <span className="text-black dark:text-white font-extrabold">STATUS: 100% UNAPOLOGETIC</span>
        </div>
      </div>
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-3 pb-2 border-b-2 border-black dark:border-zinc-700">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1 border border-black comic-shadow-sm text-xs font-headline font-black uppercase mb-1.5">
            <span>{content.eyebrow}</span>
          </div>
          <h2 className="font-headline font-black text-xl sm:text-2xl lg:text-3xl text-black dark:text-white tracking-tight">
            <KineticBrushWord variant="double" color="#dcb858" strokeWidth={2.4}>
              {content.headline}
            </KineticBrushWord>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/why-us"
            className="inline-flex items-center gap-1.5 font-headline font-black text-xs uppercase bg-black dark:bg-yellow-400 text-white dark:text-black hover:bg-yellow-400 dark:hover:bg-yellow-300 hover:text-black px-4 py-2 rounded border border-black comic-shadow-sm transition-all"
          >
            <span>{content.exploreCtaText}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>
      </div>

      {/* 3 Bento Cards (Scaled ~5% for 15-inch Laptops) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-3.5 mb-3.5 sm:mb-4">
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, delay: 0, ease: [0.22, 1, 0.36, 1] }}
          className="border-2 border-black dark:border-zinc-700 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#151520] comic-shadow flex flex-col justify-between min-h-[175px] sm:min-h-[195px]"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-5 h-5 rounded-DEFAULT bg-yellow-400 text-black border border-black flex items-center justify-center font-headline font-black text-[11px] comic-shadow-sm">
                {content.bentoCards[0].number}
              </span>
              <Layers className="w-4 h-4 text-black dark:text-yellow-400 stroke-[1.75]" />
            </div>
            <h3 className="font-headline font-black text-sm sm:text-base text-black dark:text-white mb-1 uppercase">
              {content.bentoCards[0].title}
            </h3>
            <p className="font-body text-xs text-black/75 dark:text-zinc-300 leading-relaxed">
              {content.bentoCards[0].description}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-headline font-bold">
            <span className="bg-black text-white px-2 py-0.5 rounded">{content.bentoCards[0].badge}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="border-2 border-black dark:border-zinc-700 p-3.5 sm:p-4 rounded-xl bg-yellow-50 dark:bg-[#1B1B28] comic-shadow flex flex-col justify-between min-h-[175px] sm:min-h-[195px]"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-5 h-5 rounded-DEFAULT bg-yellow-400 text-black border border-black flex items-center justify-center font-headline font-black text-[11px] comic-shadow-sm">
                {content.bentoCards[1].number}
              </span>
              <Sparkles className="w-4 h-4 text-black dark:text-yellow-400 fill-yellow-400" />
            </div>
            <h3 className="font-headline font-black text-sm sm:text-base text-black dark:text-white mb-1 uppercase">
              {content.bentoCards[1].title}
            </h3>
            <p className="font-body text-xs text-black/75 dark:text-zinc-300 leading-relaxed">
              {content.bentoCards[1].description}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-headline font-bold">
            <span className="bg-yellow-400 text-black border border-black px-2 py-0.5 rounded">
              {content.bentoCards[1].badge}
            </span>
            <Zap className="w-3.5 h-3.5 text-black dark:text-yellow-400 fill-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="border-2 border-black dark:border-zinc-700 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#151520] comic-shadow flex flex-col justify-between min-h-[175px] sm:min-h-[195px]"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-5 h-5 rounded-DEFAULT bg-yellow-400 text-black border border-black flex items-center justify-center font-headline font-black text-[11px] comic-shadow-sm">
                {content.bentoCards[2].number}
              </span>
              <Palette className="w-4 h-4 text-black dark:text-yellow-400 stroke-[1.75]" />
            </div>
            <h3 className="font-headline font-black text-sm sm:text-base text-black dark:text-white mb-1 uppercase">
              {content.bentoCards[2].title}
            </h3>
            <p className="font-body text-xs text-black/75 dark:text-zinc-300 leading-relaxed">
              {content.bentoCards[2].description}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-headline font-bold">
            <span className="bg-black text-white px-2 py-0.5 rounded">{content.bentoCards[2].badge}</span>
            <Paintbrush className="w-3.5 h-3.5 text-black dark:text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Blueprint Showcase Card */}
      <ScrollReveal direction="up" distance={20}>
        <div className="border-2 sm:border-3 border-black dark:border-zinc-700 rounded-xl p-3.5 sm:p-5 bg-white dark:bg-[#151520] comic-shadow relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-6 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-headline font-black uppercase text-black bg-yellow-300 px-2 py-0.5 rounded border border-black">
                <Compass className="w-3 h-3 text-black" />
                <span>{content.blueprint.badge}</span>
              </div>
              <h3 className="font-headline font-black text-base sm:text-lg text-black dark:text-white">
                {content.blueprint.title}
              </h3>
              <p className="font-body text-xs text-black/80 dark:text-zinc-300 leading-relaxed">
                {content.blueprint.description}
              </p>
            </div>
            <div className="lg:col-span-6 border-2 border-black dark:border-zinc-700 rounded-lg overflow-hidden aspect-[16/9] min-h-[160px] sm:min-h-[190px] lg:min-h-[220px] bg-white dark:bg-[#0E0E14] relative">
              <Image
                src={content.blueprint.image}
                alt={content.blueprint.altText}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
}

/* =========================================================================
   SCENE 03: 3D CAPABILITIES MATRIX COMPONENT
   ========================================================================= */
function ServicesContent() {
  return (
    <div className="w-full max-w-[1500px] mx-auto pt-2 pb-6 flex flex-col justify-start">
      {/* Technical Header Ribbon */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black dark:border-zinc-800 pb-2.5 mb-3 text-xs font-mono uppercase tracking-widest text-black/70 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-black text-white font-black text-[10px]">SCENE // 03</span>
          <span className="font-bold">CAPABILITIES &amp; 3D MATRIX DISCIPLINE ROSTER</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>CAD: REV-2026.04</span>
          <span>•</span>
          <span>STAGE: PINNED PERSPECTIVE</span>
          <span>•</span>
          <span className="text-black dark:text-white font-extrabold">STATUS: 100% MODULAR</span>
        </div>
      </div>
      <Capabilities3DMatrix />
    </div>
  );
}

/* =========================================================================
   SCENE 03.5: PROJECT ARCHIVE & GALLERY SHOWCASE COMPONENT
   ========================================================================= */
function GalleryShowcaseContent() {
  const [projectsList, setProjectsList] = useState<ProjectRecord[]>(
    rawProjects as ProjectRecord[]
  );

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/projects?limit=6");
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data.items) && data.items.length > 0) {
            setProjectsList(data.items);
          }
        }
      } catch {
        // Fallback to rawProjects seed data
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const featured = projectsList.slice(0, 3);

  return (
    <div className="w-full max-w-7xl mx-auto pt-2 pb-6 flex flex-col justify-start">
      {/* Technical Header Ribbon */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black dark:border-zinc-800 pb-2.5 mb-4 text-xs font-mono uppercase tracking-widest text-black/70 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-black text-white font-black text-[10px]">SCENE // 04</span>
          <span className="font-bold">PROJECT ARCHIVE &amp; ARENA SHOWREEL VAULT</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>CAD: REV-2026.04</span>
          <span>•</span>
          <span>STAGE: PINNED PERSPECTIVE</span>
          <span>•</span>
          <span className="text-black dark:text-white font-extrabold">STATUS: 100% PRODUCTION READY</span>
        </div>
      </div>
      {/* Comic Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-3 mb-3 sm:mb-4 pb-2 border-b-2 border-black dark:border-zinc-700">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1 border border-black comic-shadow-sm text-xs font-headline font-black uppercase mb-1.5">
            <span>★ 04 PROJECT ARCHIVE &amp; GALLERY</span>
          </div>
          <h2 className="font-headline font-black text-xl sm:text-2xl lg:text-3xl text-black dark:text-white tracking-tight">
            CRAFTED IN INK.{" "}
            <KineticBrushWord variant="double" color="#dcb858" strokeWidth={2.4}>
              EXECUTED IN ARENAS.
            </KineticBrushWord>
          </h2>
          <p className="font-body text-xs sm:text-sm text-black/75 dark:text-zinc-300 mt-1">
            Volumetric 8K LED walls, parametric stage trusses, and dynamic lighting rigs.
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 font-headline font-black text-xs uppercase bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded border-2 border-black comic-shadow-sm transition-all"
          >
            <span>VIEW ALL PROJECTS ({projectsList.length})</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* Featured Video Showcase Theater */}
      {featured.length > 0 && (() => {
        const primary = featured[0];
        const yt = resolveSafeYouTubeEmbed(primary);
        if (!yt) return null;

        return (
          <div className="mb-4 sm:mb-5 p-4 sm:p-6 rounded-2xl border-2 border-black dark:border-zinc-700 bg-white dark:bg-[#151520] comic-shadow">
            <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
              {/* Responsive Embedded YouTube Player */}
              <div className="lg:col-span-7">
                <div className="relative aspect-video rounded-xl overflow-hidden border-2 border-black bg-black comic-shadow-sm">
                  <iframe
                    src={yt.embedUrl}
                    title={primary.youtubeTitle || primary.title}
                    className="w-full h-full border-0 pointer-events-auto cursor-pointer relative z-10"
                    allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                    referrerPolicy="strict-origin-when-cross-origin"
                    allowFullScreen
                  />
                </div>
              </div>

              {/* Video Info & Metadata */}
              <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
                <div>
                  <div className="flex items-center gap-2 mb-2 flex-wrap">
                    <span className="bg-yellow-400 text-black text-[10px] font-headline font-black px-2.5 py-0.5 rounded border border-black comic-shadow-sm">
                      {primary.stamp}
                    </span>
                    <span className="bg-red-600 text-white text-[10px] font-headline font-black px-2.5 py-0.5 rounded border border-black comic-shadow-sm">
                      ▶ OFFICIAL SHOWREEL
                    </span>
                    <span className="text-xs font-mono text-black/60 dark:text-zinc-400 uppercase">
                      {primary.client}
                    </span>
                  </div>

                  <h3 className="font-headline font-black text-xl sm:text-2xl text-black dark:text-white tracking-tight mb-1.5">
                    {primary.title}
                  </h3>

                  {primary.youtubeTitle && primary.youtubeTitle !== primary.title && (
                    <div className="text-xs sm:text-sm font-headline font-extrabold text-red-600 dark:text-red-400 mb-1.5">
                      🎬 {primary.youtubeTitle}
                    </div>
                  )}

                  <p className="font-body text-xs sm:text-sm text-black/80 dark:text-zinc-300 leading-relaxed line-clamp-4 mb-3">
                    {primary.youtubeDescription || primary.description}
                  </p>

                  <div className="flex flex-wrap gap-1.5 mb-3">
                    {primary.tags.map((tag, i) => (
                      <span
                        key={i}
                        className="text-[10px] font-headline font-bold uppercase bg-yellow-100 dark:bg-zinc-800 border border-black/30 dark:border-zinc-700 text-black dark:text-zinc-200 px-2.5 py-0.5 rounded"
                      >
                        {tag}
                      </span>
                    ))}
                  </div>
                </div>

                <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between flex-wrap gap-2">
                  <span className="font-headline font-black text-xs sm:text-sm text-black dark:text-yellow-400">
                    {primary.stats}
                  </span>
                  <div className="flex items-center gap-2.5">
                    <a
                      href={yt.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-headline font-black px-3.5 py-1.5 rounded border-2 border-black comic-shadow-sm transition-all"
                    >
                      <span>YOUTUBE</span>
                      <span className="text-[10px]">↗</span>
                    </a>
                    <Link
                      href="/gallery"
                      className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-headline font-black px-4 py-1.5 rounded border-2 border-black comic-shadow-sm transition-all"
                    >
                      <span>EXPLORE GALLERY</span>
                      <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                    </Link>
                  </div>
                </div>
              </div>
            </div>
          </div>
        );
      })()}

      {/* Additional Project Cards Grid */}
      {featured.length > 1 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-3">
          {featured.slice(1).map((p) => {
            const ytEmbed = resolveSafeYouTubeEmbed(p);
            const cardThumb = getProjectThumbnailUrl(p);
            return (
              <Link
                key={p.id}
                href="/gallery"
                className="group border-2 border-black dark:border-zinc-700 p-3 sm:p-3.5 rounded-xl bg-white dark:bg-[#151520] comic-shadow hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none transition-all flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-lg overflow-hidden border border-black mb-2.5 bg-black">
                    <Image
                      src={cardThumb}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                    />
                    <span className="absolute top-2 left-2 bg-yellow-400 text-black text-[9px] sm:text-[10px] font-headline font-black px-2 py-0.5 rounded border border-black comic-shadow-sm">
                      {p.stamp}
                    </span>
                    {ytEmbed && (
                      <span className="absolute bottom-2 right-2 bg-red-600 text-white text-[9px] sm:text-[10px] font-headline font-black px-2 py-0.5 rounded border border-black comic-shadow-sm">
                        {ytEmbed.isShort ? "▶ 9:16 REEL" : "▶ VIDEO"}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono text-black/60 dark:text-zinc-400 mb-1 uppercase">
                    {p.client}
                  </div>
                  <h3 className="font-headline font-black text-sm sm:text-base text-black dark:text-white group-hover:text-yellow-500 transition-colors mb-1 line-clamp-1">
                    {p.title}
                  </h3>
                  {p.youtubeTitle && (
                    <div className="text-[11px] font-headline font-bold text-red-700 dark:text-red-300 line-clamp-1 mb-1">
                      🎬 {p.youtubeTitle}
                    </div>
                  )}
                  <p className="font-body text-xs text-black/70 dark:text-zinc-300 line-clamp-2 leading-relaxed mb-2.5">
                    {p.description}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-xs font-headline font-bold text-black dark:text-yellow-400">
                  <span>{p.stats}</span>
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    EXPLORE ➔
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Full Vault CTA Button on Mobile */}
      <div className="text-center pt-1 block md:hidden">
        <Link
          href="/gallery"
          className="w-full inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-black text-xs py-2.5 px-4 rounded-lg border-2 border-black comic-shadow active:scale-95 transition-all"
        >
          <span>★ EXPLORE COMPLETE PROJECT ARCHIVE ({projectsList.length} SHOWCASE{projectsList.length === 1 ? "" : "S"})</span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 04: CONTACT & BRIEF INQUIRY COMPONENT
   ========================================================================= */
function ContactContent({ content }: { content: ContactSectionContent }) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    serviceType: "Stage Design & Arena Rigging",
    brief: "",
    _hp: "",
  });
  const formLoadedAtRef = useRef<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

  const serviceOptions = [
    "Stage Design & Arena Rigging",
    "Conferences & Keynote LED",
    "Exhibition Booths",
    "Brand Architecture",
    "Custom Rigging & Tech",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playPop();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const response = await fetch("/api/contact/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          serviceType: formData.serviceType,
          brief: formData.brief,
          _hp: formData._hp,
          _ts: formLoadedAtRef.current,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to submit project brief. Please check your information.",
        });
      } else {
        setSubmitStatus({
          type: "success",
          message: "⚡ Brief dispatched! Our stage director has received your specifications and will respond within 24 hours.",
        });
        setFormData({
          fullName: "",
          email: "",
          serviceType: "Stage Design & Arena Rigging",
          brief: "",
          _hp: "",
        });
        formLoadedAtRef.current = Date.now();
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error occurred while sending your brief. Please verify your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-2 pb-6 flex flex-col justify-start">
      {/* Technical Header Ribbon */}
      <div className="flex flex-wrap items-center justify-between border-b-2 border-black dark:border-zinc-800 pb-2.5 mb-3 text-xs font-mono uppercase tracking-widest text-black/70 dark:text-zinc-400">
        <div className="flex items-center gap-3">
          <span className="px-2 py-0.5 bg-black text-white font-black text-[10px]">SCENE // 05</span>
          <span className="font-bold">CLIENT INTAKE &amp; RAPID BRIEF DISPATCH</span>
        </div>
        <div className="hidden sm:flex items-center gap-4">
          <span>CAD: REV-2026.04</span>
          <span>•</span>
          <span>STAGE: PINNED PERSPECTIVE</span>
          <span>•</span>
          <span className="text-black dark:text-white font-extrabold">STATUS: 24H RAPID DISPATCH</span>
        </div>
      </div>
      <div className="border-3 border-black dark:border-zinc-700 bg-white dark:bg-[#151520] rounded-2xl p-4 sm:p-5 lg:p-6 comic-shadow relative mt-2">
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-300 text-black border-2 border-black px-4 py-1 font-headline font-black text-[10px] sm:text-xs uppercase tracking-widest comic-shadow-sm -rotate-1 z-20">
          {content.stageTag}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pt-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-3"
          >
            <h2 className="font-headline font-black text-xl sm:text-2xl lg:text-3xl text-black dark:text-white tracking-tight leading-tight">
              {content.headline}
            </h2>
            <p className="font-body text-xs sm:text-sm text-black/80 dark:text-zinc-300 leading-relaxed">
              {content.description}
            </p>

            <div className="border-2 border-black dark:border-zinc-700 rounded-xl p-2 bg-yellow-50 dark:bg-[#1C1C28] relative">
              <div className="aspect-[16/9] min-h-[170px] sm:min-h-[200px] lg:min-h-[220px] rounded-lg overflow-hidden border border-black dark:border-zinc-700 bg-white dark:bg-[#0E0E14] relative">
                <Image
                  src={content.intakeImage}
                  alt={content.intakeImageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="mt-1.5 text-center text-[10px] sm:text-xs font-headline font-bold text-black/70 dark:text-zinc-400">
                {content.intakeLabel}
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-headline font-bold text-black dark:text-zinc-200">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-black border border-black flex items-center justify-center font-bold text-[10px]">
                  @
                </span>
                <a href={`mailto:${content.email}`} className="hover:underline">{content.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-black border border-black flex items-center justify-center font-bold text-[10px]">
                  📍
                </span>
                <span>{content.studioLocations}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white dark:bg-[#181824] border-2 border-black dark:border-zinc-700 rounded-xl p-4 sm:p-5 comic-shadow-sm"
          >
            {submitStatus.type === "success" && (
              <div className="mb-2.5 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500 rounded text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <p className="font-body">{submitStatus.message}</p>
              </div>
            )}

            {submitStatus.type === "error" && (
              <div className="mb-2.5 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-500 rounded text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <p className="font-body">{submitStatus.message}</p>
              </div>
            )}

            <form className="space-y-2" onSubmit={handleSubmit}>
              {/* Invisible Honeypot field for bot deterrence */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                  opacity: 0,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                <input
                  type="text"
                  name="_hp"
                  tabIndex={-1}
                  value={formData._hp}
                  onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-headline font-bold text-xs uppercase mb-1 text-black dark:text-zinc-300">
                    Your Name / Title
                  </label>
                  <input
                    className="w-full border-2 border-black dark:border-zinc-700 rounded-xl p-2.5 sm:p-3 font-body text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                    placeholder="Alex Mercer, Head of Brand"
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-headline font-bold text-xs uppercase mb-1 text-black dark:text-zinc-300">
                    Email Address
                  </label>
                  <input
                    className="w-full border-2 border-black dark:border-zinc-700 rounded-xl p-2.5 sm:p-3 font-body text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                    placeholder="alex@company.com"
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                  />
                </div>
              </div>

              <div>
                <label className="block font-headline font-bold text-xs uppercase mb-1.5 text-black dark:text-zinc-300">
                  Target Service
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {serviceOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: opt })}
                      className={`text-[10px] sm:text-xs font-headline font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${formData.serviceType === opt
                          ? "bg-yellow-400 text-black border-black shadow-[2px_2px_0px_#000]"
                          : "bg-zinc-100 dark:bg-zinc-800 text-black/70 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white"
                        }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-headline font-bold text-xs uppercase mb-1 text-black dark:text-zinc-300">
                  The Core Brief / Vision Constraints
                </label>
                <textarea
                  className="w-full border-2 border-black dark:border-zinc-700 rounded-xl p-2.5 sm:p-3 font-body text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                  placeholder="Describe your arena, product launch, or brand evolution requirements (min 10 characters)..."
                  required
                  rows={3}
                  value={formData.brief}
                  onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] sm:text-xs font-body text-black/60 dark:text-zinc-400">
                  ⚡ 24h rapid response standard
                </span>
                <MagneticButton soundType="pop">
                  <button
                    className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-black hover:text-white dark:hover:bg-yellow-300 dark:hover:text-black text-black font-headline font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl border-2 border-black comic-shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                    type="submit"
                    disabled={isSubmitting}
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>DISPATCHING...</span>
                      </>
                    ) : (
                      <>
                        <span>{content.submitButtonText}</span>
                        <Send className="w-4 h-4 stroke-[2.5]" />
                      </>
                    )}
                  </button>
                </MagneticButton>
              </div>
            </form>
          </motion.div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   STUDIO COMPACT FOOTER COMPONENT
   ========================================================================= */
function StudioFooter({ scrollToStage }: { scrollToStage: (s: StageId) => void }) {
  return (
    <footer className="w-full py-2.5 bg-white/95 dark:bg-[#0D0D12]/95 text-black dark:text-white border-t border-black/10 dark:border-white/10 z-30 transition-colors duration-200">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 max-w-7xl mx-auto text-[10px] text-black/70 dark:text-zinc-400 font-mono gap-2 sm:gap-0">
        <div>© 2026 Art Work - Marketing Solutions. Pinned Kinetic Stage Engine.</div>
        <div className="flex items-center gap-3 font-headline font-bold flex-wrap justify-center">
          <button onClick={() => scrollToStage("stage-01")} className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer">
            HOME
          </button>
          <Link href="/company" className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer">
            COMPANY
          </Link>
          <button onClick={() => scrollToStage("stage-02")} className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer">
            WHY US
          </button>
          <button onClick={() => scrollToStage("stage-03")} className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer">
            SERVICES
          </button>
          <button onClick={() => scrollToStage("stage-gallery")} className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer text-yellow-600 dark:text-yellow-400 font-black">
            ★ GALLERY
          </button>
          <button onClick={() => scrollToStage("stage-04")} className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer">
            CONTACT
          </button>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   MAIN EXPORT HOME PAGE COMPONENT
   ========================================================================= */
export default function Home() {
  const [activeStage, setActiveStage] = useState<StageId>("stage-01");
  const [heroContent, setHeroContent] = useState(DEFAULT_HERO_CONTENT);
  const [whyUsContent, setWhyUsContent] = useState(DEFAULT_WHY_US_CONTENT);
  const [contactContent, setContactContent] = useState(DEFAULT_SITE_CONTENT.contact);
  const toggleDoodle = useDoodleStore((state) => state.toggleDoodle);
  const trackRef = useRef<HTMLDivElement>(null);
  const theaterRef = useRef<HTMLDivElement>(null);
  const mainContainerRef = useRef<HTMLElement>(null);
  const isTransitioningRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const boundaryReachedTimeRef = useRef(0);
  const activeStageRef = useRef<StageId>(activeStage);

  useEffect(() => {
    activeStageRef.current = activeStage;
  }, [activeStage]);

  // Activate Lenis luxury 60-120 FPS momentum smooth virtual scrolling
  useSmoothScroll();

  useEffect(() => {
    let mounted = true;
    fetch("/api/content", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((siteContent: {
        manifesto?: Record<string, unknown>;
        whyUsTeaser?: typeof DEFAULT_WHY_US_CONTENT;
        contact?: ContactSectionContent;
      }) => {
        const manifesto = siteContent.manifesto;
        if (!mounted) return;
        const teaser = siteContent.whyUsTeaser;
        if (siteContent.contact) {
          setContactContent({ ...DEFAULT_SITE_CONTENT.contact, ...siteContent.contact });
        }
        if (teaser?.bentoCards && teaser.bentoCards.length >= 3 && teaser.blueprint) {
          setWhyUsContent({
            ...DEFAULT_WHY_US_CONTENT,
            ...teaser,
            bentoCards: teaser.bentoCards.slice(0, 3),
            blueprint: { ...DEFAULT_WHY_US_CONTENT.blueprint, ...teaser.blueprint },
          });
        }
        if (!manifesto) return;
        const metrics = Array.isArray(manifesto.metrics)
          ? manifesto.metrics
            .filter((item): item is { num: string; label: string } =>
              Boolean(item && typeof item === "object" && "num" in item && "label" in item)
            )
            .map((item) => ({ num: String(item.num), label: String(item.label) }))
          : DEFAULT_HERO_CONTENT.metrics;
        setHeroContent({
          announcementBadge: String(manifesto.announcementBadge || manifesto.banner_badge || DEFAULT_HERO_CONTENT.announcementBadge),
          editionBadge: String(manifesto.editionBadge || DEFAULT_HERO_CONTENT.editionBadge),
          headlinePart1: String(manifesto.headlinePart1 || manifesto.headline_highlight || DEFAULT_HERO_CONTENT.headlinePart1),
          headlinePart2: String(manifesto.headlinePart2 || manifesto.headline_suffix || DEFAULT_HERO_CONTENT.headlinePart2),
          introParagraph: String(manifesto.introParagraph || manifesto.subheadline || DEFAULT_HERO_CONTENT.introParagraph),
          metrics: metrics.length ? metrics.slice(0, 3) : DEFAULT_HERO_CONTENT.metrics,
        });
      })
      .catch(() => { });
    return () => {
      mounted = false;
    };
  }, []);

  // Mouse sparkle trail physics (bypassed if prefers-reduced-motion is active)
  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const createSparkle = (x: number, y: number) => {
      const p = document.createElement("div");
      p.className = "cursor-particle";
      p.style.left = `${x}px`;
      p.style.top = `${y}px`;
      const size = Math.floor(Math.random() * 8) + 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 25 + 5;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      document.body.appendChild(p);

      requestAnimationFrame(() => {
        p.style.transform = `translate(${vx}px, ${vy}px) scale(0)`;
        p.style.opacity = "0";
      });

      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 450);
    };

    let lastMove = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove > 110) {
        createSparkle(e.clientX, e.clientY);
        lastMove = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // HIGH-PERFORMANCE SCROLL SYNCHRONIZER:
    // Throttled via RAF with zero redundant re-renders
    let ticking = false;
    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Mobile: Detect active stage based on section bounding boxes
        const s2 = document.getElementById("stage-02-mobile");
        const s3 = document.getElementById("stage-03-mobile");
        const sGallery = document.getElementById("stage-gallery-mobile");
        const s4 = document.getElementById("stage-04-mobile");
        const threshold = window.innerHeight * 0.38;

        let nextStage: StageId = "stage-01";
        if (s4 && s4.getBoundingClientRect().top <= threshold) {
          nextStage = "stage-04";
        } else if (sGallery && sGallery.getBoundingClientRect().top <= threshold) {
          nextStage = "stage-gallery";
        } else if (s3 && s3.getBoundingClientRect().top <= threshold) {
          nextStage = "stage-03";
        } else if (s2 && s2.getBoundingClientRect().top <= threshold) {
          nextStage = "stage-02";
        }

        setActiveStage((prev) => (prev === nextStage ? prev : nextStage));
      }
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const scrollToStage = useCallback((stage: StageId) => {
    soundFX.playWhoosh();
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (isMobile) {
      const targetEl = document.getElementById(`${stage}-mobile`);
      if (targetEl) {
        const headerOffset = 104; // Height of fixed header + mobile pill bar
        const elementPosition = targetEl.getBoundingClientRect().top;
        const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
        const targetTop = Math.max(0, offsetPosition);

        if (window.__lenis) {
          window.__lenis.scrollTo(targetTop);
        } else {
          window.scrollTo({
            top: targetTop,
            behavior: "smooth",
          });
        }
        setActiveStage(stage);
        return;
      }
    }

    // Desktop: Update active stage & reset internal component scroll
    setActiveStage(stage);
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = 0;
    }

    // Sync 3D background / parallax track position
    if (!trackRef.current) return;
    const maxScroll = trackRef.current.scrollHeight - window.innerHeight;
    let target = 0;
    if (stage === "stage-01") target = 0;
    if (stage === "stage-02") target = maxScroll * 0.25;
    if (stage === "stage-03") target = maxScroll * 0.50;
    if (stage === "stage-gallery") target = maxScroll * 0.75;
    if (stage === "stage-04") target = maxScroll * 1.0;

    if (window.__lenis) {
      window.__lenis.scrollTo(target);
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
    }
  }, []);

  // DESKTOP INTERNAL SCROLL-Y COMPLETION & PROGRESSION ENGINE:
  // Requires the active component's internal scroll Y to scroll completely to its end
  // before transitioning to the next (or previous) stage.
  useEffect(() => {
    const theater = theaterRef.current;
    if (!theater) return;

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return;

      const main = mainContainerRef.current;
      if (!main) return;

      // Lock during stage transitions to prevent skipping stages
      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = main;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      const isAtBottom = scrollTop >= maxScroll - 6;
      const isAtTop = scrollTop <= 6;
      const now = Date.now();

      // SCROLLING DOWNWARDS
      if (e.deltaY > 0) {
        if (!isAtBottom) {
          // Internal scroll down in progress: let component scroll naturally
          accumulatedDeltaRef.current = 0;
          boundaryReachedTimeRef.current = 0;
          return;
        }

        // At bottom of component: contain scroll and intercept continuation
        e.preventDefault();

        if (boundaryReachedTimeRef.current === 0) {
          boundaryReachedTimeRef.current = now;
          accumulatedDeltaRef.current = 0;
          return;
        }

        // Require brief settle pause if component had scrollable content
        if (maxScroll > 15 && now - boundaryReachedTimeRef.current < 160) {
          return;
        }

        accumulatedDeltaRef.current += e.deltaY;
        if (accumulatedDeltaRef.current >= 45) {
          const currentIndex = STAGE_ORDER.indexOf(activeStageRef.current);
          if (currentIndex < STAGE_ORDER.length - 1) {
            isTransitioningRef.current = true;
            accumulatedDeltaRef.current = 0;
            boundaryReachedTimeRef.current = 0;
            const nextStage = STAGE_ORDER[currentIndex + 1];
            scrollToStage(nextStage);
            setTimeout(() => {
              isTransitioningRef.current = false;
            }, 600);
          }
        }
      }
      // SCROLLING UPWARDS
      else if (e.deltaY < 0) {
        if (!isAtTop) {
          // Internal scroll up in progress: let component scroll naturally
          accumulatedDeltaRef.current = 0;
          boundaryReachedTimeRef.current = 0;
          return;
        }

        // At top of component: contain scroll and intercept continuation
        e.preventDefault();

        if (boundaryReachedTimeRef.current === 0) {
          boundaryReachedTimeRef.current = now;
          accumulatedDeltaRef.current = 0;
          return;
        }

        // Require brief settle pause if component had scrollable content
        if (maxScroll > 15 && now - boundaryReachedTimeRef.current < 160) {
          return;
        }

        accumulatedDeltaRef.current += e.deltaY;
        if (accumulatedDeltaRef.current <= -45) {
          const currentIndex = STAGE_ORDER.indexOf(activeStageRef.current);
          if (currentIndex > 0) {
            isTransitioningRef.current = true;
            accumulatedDeltaRef.current = 0;
            boundaryReachedTimeRef.current = 0;
            const prevStage = STAGE_ORDER[currentIndex - 1];
            scrollToStage(prevStage);
            setTimeout(() => {
              isTransitioningRef.current = false;
            }, 600);
          }
        }
      }
    };

    theater.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      theater.removeEventListener("wheel", handleWheel);
    };
  }, [scrollToStage]);

  const triggerInkBurst = (e: React.MouseEvent<HTMLButtonElement>) => {
    soundFX.playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    for (let i = 0; i < 20; i++) {
      const p = document.createElement("div");
      p.className = "cursor-particle";
      p.style.left = `${originX}px`;
      p.style.top = `${originY}px`;
      const size = Math.floor(Math.random() * 8) + 4;
      p.style.width = `${size}px`;
      p.style.height = `${size}px`;

      const angle = Math.random() * Math.PI * 2;
      const speed = Math.random() * 30 + 10;
      const vx = Math.cos(angle) * speed;
      const vy = Math.sin(angle) * speed;

      document.body.appendChild(p);

      requestAnimationFrame(() => {
        p.style.transform = `translate(${vx}px, ${vy}px) scale(0)`;
        p.style.opacity = "0";
      });

      setTimeout(() => {
        if (p.parentNode) p.parentNode.removeChild(p);
      }, 500);
    }
  };

  return (
    <>
      <IntroLoader />

      {/* Real 3D Kinetic Three.js Background with Auto-Synced Scroll Motion */}
      <DeferredKinetic3DBackground />

      {/* Kinetic Doodles Layer in Safe Margins */}
      <KineticDoodlesLayer />

      {/* Kinetic Motion Arrows Layer in Background */}
      <KineticMotionArrows />

      {/* Interactive Studio Paint Pen with Dynamic Brush Stroke */}
      <KineticPaintPen />

      {/* High-Performance 60FPS Disappearing Ink Doodle Canvas */}
      <InteractiveDoodleCanvas />

      {/* Dot Grid Sketchpad Canvas */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0"></div>

      {/* ================= FIXED TOP HEADER (SHARED DESKTOP & MOBILE) ================= */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/95 dark:bg-[#0D0D12]/95 backdrop-blur-md border-b-2 border-black dark:border-zinc-800 transition-colors duration-200">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-7xl mx-auto py-1.5 sm:py-2">
          {/* Logo Anchor + Quick Mobile Gallery Link */}
          <div className="flex items-center gap-2">
            <button
              onClick={() => scrollToStage("stage-01")}
              className="group cursor-pointer active:scale-95 transition-transform flex items-center"
              title="Art Work — Home"
              aria-label="Art Work — Home"
            >
              <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20 hover:rotate-3 transition-transform">
                <Image
                  src="/assets/images/artwork_logo.png"
                  alt="Art Work Logo"
                  fill
                  sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
                  priority
                  className="object-contain"
                />
              </div>
            </button>

            {/* Quick Mobile Gallery Badge */}
            <Link
              href="/gallery"
              className="md:hidden inline-flex items-center gap-1 bg-yellow-300 dark:bg-yellow-400 text-black font-headline font-black text-[10px] uppercase px-2 py-0.5 rounded border border-black comic-shadow-sm active:scale-95"
            >
              <span>★ Gallery</span>
            </Link>
          </div>

          {/* Desktop Navigation Links (Sticker Buttons) */}
          <nav className="hidden md:flex items-center gap-2 font-headline text-xs uppercase tracking-wider font-bold">
            <button
              onClick={() => scrollToStage("stage-01")}
              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${activeStage === "stage-01"
                  ? "bg-yellow-400 text-black border-black comic-shadow-sm -rotate-1 scale-105 z-10"
                  : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1"
                }`}
            >
              Home
            </button>
            <Link
              href="/company"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 rotate-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Partner&apos;s
            </Link>
            <button
              onClick={() => scrollToStage("stage-02")}
              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${activeStage === "stage-02"
                  ? "bg-yellow-400 text-black border-black comic-shadow-sm rotate-1 scale-105 z-10"
                  : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 rotate-1"
                }`}
            >
              Why Us
            </button>
            <button
              onClick={() => scrollToStage("stage-03")}
              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${activeStage === "stage-03"
                  ? "bg-yellow-400 text-black border-black comic-shadow-sm -rotate-1 scale-105 z-10"
                  : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1"
                }`}
            >
              Services
            </button>
            <button
              onClick={() => scrollToStage("stage-gallery")}
              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${activeStage === "stage-gallery"
                  ? "bg-yellow-400 text-black border-black comic-shadow-sm rotate-1 scale-105 z-10"
                  : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 rotate-1"
                }`}
            >
              Gallery
            </button>
            <button
              onClick={() => scrollToStage("stage-04")}
              className={`inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 font-headline font-black text-xs uppercase tracking-wider transition-all duration-150 cursor-pointer select-none active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${activeStage === "stage-04"
                  ? "bg-yellow-400 text-black border-black comic-shadow-sm -rotate-1 scale-105 z-10"
                  : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1"
                }`}
            >
              Contact
            </button>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1 bg-yellow-300 dark:bg-yellow-400 text-black font-headline font-black text-xs uppercase px-3 py-1.5 rounded-lg border-2 border-black comic-shadow-sm hover:bg-yellow-400 hover:-translate-y-0.5 hover:-rotate-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ml-1 cursor-pointer"
            >
              ★ Full Vault ↗
            </Link>
          </nav>

          {/* Trailing Primary Actions: Theme Toggle + Sound Toggle + Brief Inquiry + Ink Mode */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />
            <SoundToggle />

            <MagneticButton soundType="pop">
              <button
                onClick={() => scrollToStage("stage-04")}
                className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-bold text-xs px-2.5 sm:px-3.5 py-1.5 rounded-DEFAULT border-2 border-black comic-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <span>Brief Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </MagneticButton>

            <button
              onClick={(e) => {
                triggerInkBurst(e);
                toggleDoodle();
              }}
              aria-label="Toggle Studio Pen Doodle Mode"
              className="w-8 h-8 border-2 border-black dark:border-zinc-400 rounded-DEFAULT bg-white dark:bg-[#181824] hover:bg-yellow-100 dark:hover:bg-[#222232] comic-shadow-sm active:scale-90 transition-transform cursor-pointer flex items-center justify-center text-black dark:text-yellow-400"
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
            className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${activeStage === "stage-01"
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black -rotate-1"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
              }`}
          >
            Home
          </button>
          <Link
            href="/company"
            className="px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5"
          >
            Company
          </Link>
          <button
            onClick={() => scrollToStage("stage-02")}
            className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${activeStage === "stage-02"
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black rotate-1"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
              }`}
          >
            Why Us
          </button>
          <button
            onClick={() => scrollToStage("stage-03")}
            className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${activeStage === "stage-03"
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black -rotate-1"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
              }`}
          >
            Services
          </button>
          <button
            onClick={() => scrollToStage("stage-gallery")}
            className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${activeStage === "stage-gallery"
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black rotate-1"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
              }`}
          >
            Gallery
          </button>
          <button
            onClick={() => scrollToStage("stage-04")}
            className={`px-3 py-1.5 rounded-lg text-[10px] sm:text-xs font-headline font-bold uppercase tracking-wider transition-all duration-150 cursor-pointer whitespace-nowrap active:translate-x-0.5 active:translate-y-0.5 active:shadow-none ${activeStage === "stage-04"
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black -rotate-1"
                : "bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm hover:bg-yellow-100 hover:text-black dark:hover:text-white"
              }`}
          >
            Contact
          </button>
        </div>
      </header>

      {/* =========================================================================
          MOBILE RESPONSIVE SEQUENTIAL FLOW (Natural Unhindered Scrolling)
          ========================================================================= */}
      <div className="block md:hidden w-full relative z-10 pt-28">
        {/* Stage 01 Mobile */}
        <ScrollReveal direction="up" distance={30} viewportAmount={0.08}>
          <section
            id="stage-01-mobile"
            className="w-full min-h-[calc(100vh-7rem)] py-6 px-4 flex flex-col justify-center"
          >
            <ManifestoContent
              content={heroContent}
              onExploreShowreel={() => scrollToStage("stage-gallery")}
              onViewCapabilities={() => scrollToStage("stage-03")}
            />
          </section>
        </ScrollReveal>

        {/* Stage 02 Mobile */}
        <ScrollReveal direction="up" distance={30} viewportAmount={0.08}>
          <section
            id="stage-02-mobile"
            className="w-full min-h-screen py-10 px-4 flex flex-col justify-center border-t-2 border-black/10"
          >
            <WhyUsContent content={whyUsContent} />
          </section>
        </ScrollReveal>

        {/* Stage 03 Mobile */}
        <ScrollReveal direction="up" distance={30} viewportAmount={0.08}>
          <section
            id="stage-03-mobile"
            className="w-full min-h-screen py-10 px-4 flex flex-col justify-center border-t-2 border-black/10"
          >
            <ServicesContent />
          </section>
        </ScrollReveal>

        {/* Stage Gallery Mobile (Featured Projects Showcase) */}
        <ScrollReveal direction="up" distance={30} viewportAmount={0.08}>
          <section
            id="stage-gallery-mobile"
            className="w-full min-h-screen py-10 px-4 flex flex-col justify-center border-t-2 border-black/10"
          >
            <GalleryShowcaseContent />
          </section>
        </ScrollReveal>

        {/* Stage 04 Mobile */}
        <ScrollReveal direction="up" distance={30} viewportAmount={0.08}>
          <section
            id="stage-04-mobile"
            className="w-full min-h-screen py-10 px-4 flex flex-col justify-center border-t-2 border-black/10"
          >
            <ContactContent content={contactContent} />
          </section>
        </ScrollReveal>

        {/* Mobile Page Footer */}
        <StudioFooter scrollToStage={scrollToStage} />
      </div>

      {/* =========================================================================
          DESKTOP PINNED SCROLLYTELLING THEATER CONTAINER (Large Screens)
          ========================================================================= */}
      <div
        ref={trackRef}
        className="hidden md:block relative w-full h-[400vh]"
        id="pinned-stage-track"
      >
        {/* STICKY FIXED VIEWPORT THEATER (Generous spacing below fixed navbar for 15-inch displays) */}
        <div
          ref={theaterRef}
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between z-10 pt-[96px] sm:pt-[104px] pb-2"
        >
          {/* PINNED SCROLLYTELLING VERTICAL STAGE INDICATOR (Right Dock) */}
          <aside className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3.5">
            <button
              onClick={() => scrollToStage("stage-01")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Home
              </span>
              <div
                className={`w-3 h-3 rounded-full border-2 border-black dark:border-zinc-400 transition-all ${activeStage === "stage-01"
                    ? "bg-yellow-400 ring-4 ring-yellow-400/30 scale-125"
                    : "bg-white dark:bg-[#1A1A24] group-hover:bg-yellow-400"
                  }`}
              ></div>
            </button>
            <button
              onClick={() => scrollToStage("stage-02")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Why Us
              </span>
              <div
                className={`w-3 h-3 rounded-full border-2 border-black dark:border-zinc-400 transition-all ${activeStage === "stage-02"
                    ? "bg-yellow-400 ring-4 ring-yellow-400/30 scale-125"
                    : "bg-white dark:bg-[#1A1A24] group-hover:bg-yellow-400"
                  }`}
              ></div>
            </button>
            <button
              onClick={() => scrollToStage("stage-03")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Services
              </span>
              <div
                className={`w-3 h-3 rounded-full border-2 border-black dark:border-zinc-400 transition-all ${activeStage === "stage-03"
                    ? "bg-yellow-400 ring-4 ring-yellow-400/30 scale-125"
                    : "bg-white dark:bg-[#1A1A24] group-hover:bg-yellow-400"
                  }`}
              ></div>
            </button>
            <button
              onClick={() => scrollToStage("stage-gallery")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                ★ Gallery
              </span>
              <div
                className={`w-3 h-3 rounded-full border-2 border-black dark:border-zinc-400 transition-all ${activeStage === "stage-gallery"
                    ? "bg-yellow-400 ring-4 ring-yellow-400/30 scale-125"
                    : "bg-white dark:bg-[#1A1A24] group-hover:bg-yellow-400"
                  }`}
              ></div>
            </button>
            <button
              onClick={() => scrollToStage("stage-04")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                Contact
              </span>
              <div
                className={`w-3 h-3 rounded-full border-2 border-black dark:border-zinc-400 transition-all ${activeStage === "stage-04"
                    ? "bg-yellow-400 ring-4 ring-yellow-400/30 scale-125"
                    : "bg-white dark:bg-[#1A1A24] group-hover:bg-yellow-400"
                  }`}
              ></div>
            </button>
          </aside>

          {/* MAIN DYNAMIC SCENE CANVAS (Desktop Pinned & Morphing with AnimatePresence) */}
          <main
            ref={mainContainerRef}
            data-lenis-prevent="true"
            style={{ overscrollBehaviorY: "contain" }}
            className="flex-1 w-full min-h-0 relative overflow-y-auto overflow-x-hidden flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-4 sm:pt-6 pb-8 custom-scrollbar"
          >
            <AnimatePresence mode="wait">
              {activeStage === "stage-01" && (
                <motion.div
                  key="scene-01"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex-1 flex flex-col items-center justify-start"
                >
                  <ManifestoContent
                    content={heroContent}
                    onExploreShowreel={() => scrollToStage("stage-gallery")}
                    onViewCapabilities={() => scrollToStage("stage-03")}
                  />
                </motion.div>
              )}

              {activeStage === "stage-02" && (
                <motion.div
                  key="scene-02"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex-1 flex flex-col items-center justify-start"
                >
                  <WhyUsContent content={whyUsContent} />
                </motion.div>
              )}

              {activeStage === "stage-03" && (
                <motion.div
                  key="scene-03"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex-1 flex flex-col items-center justify-start"
                >
                  <ServicesContent />
                </motion.div>
              )}

              {activeStage === "stage-gallery" && (
                <motion.div
                  key="scene-gallery"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex-1 flex flex-col items-center justify-start"
                >
                  <GalleryShowcaseContent />
                </motion.div>
              )}

              {activeStage === "stage-04" && (
                <motion.div
                  key="scene-04"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex-1 flex flex-col items-center justify-start"
                >
                  <ContactContent content={contactContent} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* Desktop Compact Footer */}
          <StudioFooter scrollToStage={scrollToStage} />
        </div>
      </div>
    </>
  );
}
