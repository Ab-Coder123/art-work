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
import { Kinetic3DBackground } from "@/components/cinematic/Kinetic3DBackground";
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
  Palette,
  Compass,
  Send,
} from "lucide-react";
import { SiteContent, HeroManifestoContent, WhyUsTeaserContent, ContactSectionContent } from "@/types/content";
import { SEED_SITE_CONTENT } from "@/data/seedContent";

type StageId = "stage-01" | "stage-02" | "stage-03" | "stage-04";

/* =========================================================================
   SCENE 01: HERO / MANIFESTO COMPONENT
   ========================================================================= */
interface ManifestoContentProps {
  content: HeroManifestoContent;
  onExploreShowreel: () => void;
  onViewCapabilities: () => void;
}

function ManifestoContent({ content, onExploreShowreel, onViewCapabilities }: ManifestoContentProps) {
  return (
    <div className="w-full max-w-6xl mx-auto py-1 sm:py-2 flex flex-col justify-center my-auto">
      {/* Top Energy Badge & Comic Stickers */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-1.5 sm:mb-2">
        <div className="inline-flex items-center gap-1.5 border border-black bg-white px-3 py-0.5 rounded-full comic-shadow-sm font-headline text-[10px] font-black uppercase tracking-wider">
          <span className="text-yellow-500 font-black">★</span>
          <span>{content.announcementBadge}</span>
          <span className="bg-yellow-400 text-black px-1.5 py-0.2 rounded-full font-bold ml-1 text-[9px]">
            {content.editionBadge}
          </span>
        </div>

        {/* Sticky Note Callout 01 */}
        <div className="relative -rotate-2 hover:rotate-0 transition-transform duration-200">
          <div className="bg-yellow-200 border border-black px-2.5 py-0.5 text-[10px] font-headline font-bold text-black comic-shadow-sm flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-black stroke-[2]" />
            <span>{content.stickyNote}</span>
          </div>
          <div className="absolute -top-1.5 left-4 w-6 h-2 bg-white/70 border border-black/40 rotate-2"></div>
        </div>
      </div>

      {/* Hero Typography Section */}
      <div className="relative mb-2 sm:mb-2.5 max-w-4xl">
        <h1 className="font-headline font-black text-2xl sm:text-3xl md:text-4xl lg:text-[42px] xl:text-[48px] tracking-tight leading-[1.02] text-black dark:text-white">
          <KineticBrushWord variant="wave" color="#dcb858" strokeWidth={2.4} delay={0.1}>
            {content.headlinePart1}
          </KineticBrushWord> <br />
          <span className="relative inline-block mt-0.5 sm:mt-1">
            {/* Canary Yellow Ink Splash Backdrop */}
            <motion.span
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="absolute -inset-1 sm:-inset-1.5 bg-yellow-400 -rotate-1 rounded-DEFAULT -z-10 border-2 border-black comic-shadow"
            ></motion.span>
            <span className="text-black relative z-10 px-1 sm:px-2">{content.headlinePart2}</span>
            {/* Slender Hand-drawn Paintbrush Stroke */}
            <KineticBrushStroke variant="double" color="#111111" strokeWidth={2.2} delay={0.35} />
          </span>
        </h1>

        {/* Comic Starburst / POW Badge */}
        <div className="absolute -top-2 right-0 sm:right-6 hidden sm:block animate-star-pulse">
          <div className="relative w-14 h-14 sm:w-16 sm:h-16 flex items-center justify-center">
            <svg
              className="w-full h-full fill-yellow-400 stroke-black stroke-2 drop-shadow-md"
              viewBox="0 0 100 100"
            >
              <polygon points="50,0 63,28 95,20 78,48 100,70 69,76 65,100 45,82 18,95 24,68 0,55 25,36 15,10 44,22"></polygon>
            </svg>
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 text-black font-headline font-black text-[7px] uppercase leading-tight -rotate-6">
              <span>{content.starburstText.top}</span>
              <span className="bg-black text-white px-1 py-0.2 rounded-sm text-[6px]">{content.starburstText.middle}</span>
              <span>{content.starburstText.bottom}</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cluster & Team Collective Art with Magnetic Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 sm:gap-4 items-center">
        <div className="lg:col-span-5 space-y-2 sm:space-y-2.5">
          <p className="font-body text-xs sm:text-sm text-black/80 dark:text-zinc-300 max-w-sm leading-relaxed">
            {content.introParagraph}
          </p>

          <div className="flex flex-wrap items-center gap-2 pt-0.5">
            <MagneticButton soundType="pop">
              <button
                onClick={onExploreShowreel}
                className="relative group inline-flex items-center gap-1.5 bg-black text-white hover:bg-yellow-400 hover:text-black font-headline font-extrabold text-xs px-3.5 py-1.5 rounded-DEFAULT border-2 border-black comic-shadow transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              >
                <span>{content.primaryCtaText}</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </MagneticButton>

            <MagneticButton soundType="click">
              <button
                onClick={onViewCapabilities}
                className="inline-flex items-center gap-1 bg-white dark:bg-[#161622] text-black dark:text-white hover:bg-black dark:hover:bg-yellow-400 hover:text-white dark:hover:text-black font-headline font-bold text-xs px-3 py-1.5 rounded-DEFAULT border-2 border-black dark:border-zinc-600 comic-shadow-sm transition-all duration-150 cursor-pointer"
              >
                <span>{content.secondaryCtaText}</span>
                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </MagneticButton>
          </div>

          {/* Milestone Badges */}
          <div className="grid grid-cols-3 gap-1.5 pt-0.5 max-w-sm">
            {content.metrics.map((badge, idx) => (
              <motion.div
                key={badge.label}
                initial={{ opacity: 0, y: 15 }}
                whileInView={{ opacity: 1, y: 0 }}
                viewport={{ once: true, amount: 0.2 }}
                transition={{ duration: 0.4, delay: 0.1 + idx * 0.08, ease: [0.22, 1, 0.36, 1] }}
                className="border border-black dark:border-zinc-700 bg-white dark:bg-[#151520] p-1.5 rounded-DEFAULT comic-shadow-sm text-center"
              >
                <div className="font-headline font-black text-sm sm:text-base text-black dark:text-white">{badge.num}</div>
                <div className="text-[8px] font-headline font-bold text-black/70 dark:text-zinc-400 uppercase">
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
          className="lg:col-span-7 relative"
        >
          <div className="border-3 border-black dark:border-zinc-600 bg-white dark:bg-[#151520] rounded-lg p-2 comic-shadow relative group">
            <div className="absolute -top-2 left-6 w-10 h-4 bg-yellow-300/80 border border-black/30 -rotate-3 z-30"></div>
            <div className="absolute -top-2 right-6 w-10 h-4 bg-yellow-300/80 border border-black/30 rotate-2 z-30"></div>

            <div className="flex items-center justify-between pb-1 mb-1 border-b border-black/10 dark:border-white/10 text-[10px] font-headline font-bold text-black dark:text-white">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 border border-black"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-400 border border-black"></span>
                <span className="w-2 h-2 rounded-full bg-green-500 border border-black"></span>
                <span className="ml-1 text-black/60 dark:text-zinc-400 font-mono text-[10px]">
                  {content.canvasHeader}
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <Paintbrush className="w-3.5 h-3.5 text-black dark:text-yellow-400" />
                <span className="dark:text-yellow-400">{content.canvasTag}</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded border border-black dark:border-zinc-700 bg-white dark:bg-[#0E0E14] aspect-[16/9] max-h-[160px] lg:max-h-[180px] xl:max-h-[210px] flex items-center justify-center">
              <Image
                src={content.heroImage}
                alt={content.heroImageAlt}
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
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
function WhyUsContent({ content }: { content: WhyUsTeaserContent }) {
  const renderCardIcon = (iconName?: string) => {
    switch (iconName) {
      case "sparkles":
        return <Sparkles className="w-4 h-4 text-black dark:text-yellow-400 fill-yellow-400" />;
      case "palette":
        return <Palette className="w-4 h-4 text-black dark:text-yellow-400 stroke-[1.75]" />;
      default:
        return <Layers className="w-4 h-4 text-black dark:text-yellow-400 stroke-[1.75]" />;
    }
  };

  return (
    <div className="w-full max-w-6xl mx-auto py-1 sm:py-2 flex flex-col justify-center my-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-2 pb-1.5 border-b-2 border-black dark:border-zinc-700">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-black px-2.5 py-0.5 border border-black comic-shadow-sm text-[10px] font-headline font-black uppercase mb-1">
            <span>{content.eyebrow}</span>
          </div>
          <h2 className="font-headline font-black text-lg sm:text-xl lg:text-2xl text-black dark:text-white tracking-tight">
            <KineticBrushWord variant="double" color="#dcb858" strokeWidth={2.4}>
              {content.headline}
            </KineticBrushWord>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/why-us"
            className="inline-flex items-center gap-1.5 font-headline font-black text-[11px] uppercase bg-black dark:bg-yellow-400 text-white dark:text-black hover:bg-yellow-400 dark:hover:bg-yellow-300 hover:text-black px-3 py-1.5 rounded border border-black comic-shadow-sm transition-all"
          >
            <span>{content.exploreCtaText}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* 3 Bento Cards (Compact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 mb-2.5">
        {content.bentoCards.map((card, idx) => (
          <motion.div
            key={card.number}
            initial={{ opacity: 0, y: 22, scale: 0.97 }}
            whileInView={{ opacity: 1, y: 0, scale: 1 }}
            viewport={{ once: true, amount: 0.12 }}
            transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
            className={`border-2 border-black dark:border-zinc-700 p-2.5 sm:p-3 rounded-lg ${
              idx === 1 ? "bg-yellow-50 dark:bg-[#1B1B28]" : "bg-white dark:bg-[#151520]"
            } comic-shadow flex flex-col justify-between`}
          >
            <div>
              <div className="flex items-center justify-between mb-1.5">
                <span className="w-5 h-5 rounded-DEFAULT bg-yellow-400 text-black border border-black flex items-center justify-center font-headline font-black text-[11px] comic-shadow-sm">
                  {card.number}
                </span>
                {renderCardIcon(card.iconName)}
              </div>
              <h3 className="font-headline font-black text-xs sm:text-sm text-black dark:text-white mb-0.5 uppercase">
                {card.title}
              </h3>
              <p className="font-body text-[10px] text-black/75 dark:text-zinc-300 leading-snug">
                {card.description}
              </p>
            </div>
            <div className="pt-1.5 mt-1.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[9px] font-headline font-bold">
              <span className="bg-black text-white px-1.5 py-0.2 rounded">{card.badge}</span>
              <CheckCircle2 className="w-3 h-3 text-black dark:text-yellow-400" />
            </div>
          </motion.div>
        ))}
      </div>

      {/* Blueprint Showcase Card */}
      <ScrollReveal direction="up" distance={20}>
        <div className="border-2 sm:border-3 border-black dark:border-zinc-700 rounded-lg p-2.5 sm:p-3 bg-white dark:bg-[#151520] comic-shadow relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
            <div className="lg:col-span-6 space-y-1">
              <div className="inline-flex items-center gap-1 text-[9px] font-headline font-black uppercase text-black bg-yellow-300 px-1.5 py-0.2 rounded border border-black">
                <Compass className="w-3 h-3 text-black" />
                <span>{content.blueprint.badge}</span>
              </div>
              <h3 className="font-headline font-black text-sm sm:text-base text-black dark:text-white">
                {content.blueprint.title}
              </h3>
              <p className="font-body text-[10px] sm:text-[11px] text-black/80 dark:text-zinc-300">
                {content.blueprint.description}
              </p>
            </div>
            <div className="lg:col-span-6 border border-black dark:border-zinc-700 rounded overflow-hidden aspect-[16/9] max-h-[120px] lg:max-h-[135px] bg-white dark:bg-[#0E0E14] relative">
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
    <div className="w-full max-w-6xl mx-auto py-1 flex flex-col justify-center my-auto">
      <Capabilities3DMatrix />
    </div>
  );
}

/* =========================================================================
   SCENE 04: CONTACT & BRIEF INQUIRY COMPONENT
   ========================================================================= */
function ContactContent({ content }: { content: ContactSectionContent }) {
  return (
    <div className="w-full max-w-6xl mx-auto py-1 sm:py-2 flex flex-col justify-center my-auto">
      <div className="border-3 border-black dark:border-zinc-700 bg-white dark:bg-[#151520] rounded-lg p-3 sm:p-4 comic-shadow relative mt-2.5">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-300 text-black border border-black px-3 py-0.5 font-headline font-black text-[9px] uppercase tracking-widest comic-shadow-sm -rotate-1 z-20">
          {content.stageTag}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-start pt-1">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-2"
          >
            <h2 className="font-headline font-black text-lg sm:text-xl text-black dark:text-white tracking-tight leading-none">
              <KineticBrushWord variant="wave" color="#dcb858" strokeWidth={2.4}>
                {content.headline}
              </KineticBrushWord>
            </h2>
            <p className="font-body text-xs text-black/80 dark:text-zinc-300">
              {content.description}
            </p>

            <div className="border border-black dark:border-zinc-700 rounded p-1.5 bg-yellow-50 dark:bg-[#1C1C28] relative">
              <div className="aspect-[16/9] max-h-[110px] lg:max-h-[125px] rounded overflow-hidden border border-black dark:border-zinc-700 bg-white dark:bg-[#0E0E14] relative">
                <Image
                  src={content.intakeImage}
                  alt={content.intakeImageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="mt-1 text-center text-[9px] font-headline font-bold text-black/70 dark:text-zinc-400">
                {content.intakeLabel}
              </div>
            </div>

            <div className="space-y-1 text-[10px] font-headline font-bold text-black dark:text-zinc-200">
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-yellow-400 text-black border border-black flex items-center justify-center font-bold text-[9px]">
                  @
                </span>
                <span>{content.email}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-yellow-400 text-black border border-black flex items-center justify-center font-bold text-[9px]">
                  📞
                </span>
                <span>{content.phone}</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-4 h-4 rounded-full bg-yellow-400 text-black border border-black flex items-center justify-center font-bold text-[9px]">
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
            className="lg:col-span-7 bg-white dark:bg-[#181824] border border-black dark:border-zinc-700 rounded-lg p-3 comic-shadow-sm"
          >
            <form
              className="space-y-2"
              onSubmit={(e) => {
                e.preventDefault();
                soundFX.playPop();
                alert("Brief submitted to Art Work! Our stage director will be in touch shortly.");
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                <div>
                  <label className="block font-headline font-bold text-[10px] uppercase mb-0.5 text-black dark:text-zinc-300">
                    Your Name / Title
                  </label>
                  <input
                    className="w-full border border-black dark:border-zinc-700 rounded p-1.5 font-body text-xs focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                    placeholder="Alex Mercer, Head of Brand"
                    required
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-headline font-bold text-[10px] uppercase mb-0.5 text-black dark:text-zinc-300">
                    Email Address
                  </label>
                  <input
                    className="w-full border border-black dark:border-zinc-700 rounded p-1.5 font-body text-xs focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                    placeholder="alex@company.com"
                    required
                    type="email"
                  />
                </div>
              </div>

              <div>
                <label className="block font-headline font-bold text-[10px] uppercase mb-0.5 text-black dark:text-zinc-300">
                  The Core Brief / Vision Constraints
                </label>
                <textarea
                  className="w-full border border-black dark:border-zinc-700 rounded p-1.5 font-body text-xs focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                  placeholder="Describe your arena, product launch, or brand evolution requirements..."
                  required
                  rows={2}
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[9px] font-body text-black/60 dark:text-zinc-400">
                  ⚡ 24h rapid response standard
                </span>
                <MagneticButton soundType="pop">
                  <button
                    className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-black hover:text-white dark:hover:bg-yellow-300 dark:hover:text-black text-black font-headline font-black text-xs px-3.5 py-1.5 rounded border border-black comic-shadow-sm active:scale-95 transition-all cursor-pointer"
                    type="submit"
                  >
                    <span>{content.submitButtonText}</span>
                    <Send className="w-3.5 h-3.5 stroke-[2.5]" />
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
        <div>© 2025 Art Work - Marketing Solutions. Pinned Kinetic Stage Engine.</div>
        <div className="flex items-center gap-3 font-headline font-bold">
          <button onClick={() => scrollToStage("stage-01")} className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer">
            01 MANIFESTO
          </button>
          <button onClick={() => scrollToStage("stage-02")} className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer">
            02 WHY US
          </button>
          <button onClick={() => scrollToStage("stage-03")} className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer">
            03 SERVICES
          </button>
          <Link href="/gallery" className="text-black dark:text-white font-bold underline decoration-yellow-400 hover:text-black dark:hover:text-yellow-400">
            ★ GALLERY
          </Link>
          <button onClick={() => scrollToStage("stage-04")} className="hover:text-black dark:hover:text-yellow-400 hover:underline cursor-pointer">
            04 CONTACT
          </button>
        </div>
      </div>
    </footer>
  );
}

/* =========================================================================
   CLIENT HOME COMPONENT
   ========================================================================= */
export interface HomePageClientProps {
  content?: SiteContent;
}

export default function HomePageClient({ content = SEED_SITE_CONTENT }: HomePageClientProps) {
  const [activeStage, setActiveStage] = useState<StageId>("stage-01");
  const toggleDoodle = useDoodleStore((state) => state.toggleDoodle);
  const trackRef = useRef<HTMLDivElement>(null);

  // Activate Lenis luxury 60-120 FPS momentum smooth virtual scrolling
  useSmoothScroll();

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
    let ticking = false;
    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        const s2 = document.getElementById("stage-02-mobile");
        const s3 = document.getElementById("stage-03-mobile");
        const s4 = document.getElementById("stage-04-mobile");
        const threshold = window.innerHeight * 0.38;

        let nextStage: StageId = "stage-01";
        if (s4 && s4.getBoundingClientRect().top <= threshold) {
          nextStage = "stage-04";
        } else if (s3 && s3.getBoundingClientRect().top <= threshold) {
          nextStage = "stage-03";
        } else if (s2 && s2.getBoundingClientRect().top <= threshold) {
          nextStage = "stage-02";
        }

        setActiveStage((prev) => (prev !== nextStage ? nextStage : prev));
        return;
      }

      if (!trackRef.current) return;
      if (!ticking) {
        window.requestAnimationFrame(() => {
          if (!trackRef.current) {
            ticking = false;
            return;
          }
          const rect = trackRef.current.getBoundingClientRect();
          const totalDist = trackRef.current.scrollHeight - window.innerHeight;
          const scrolled = -rect.top;
          const progress = Math.max(0, Math.min(1, scrolled / totalDist));

          let nextStage: StageId = "stage-01";
          if (progress >= 0.72) {
            nextStage = "stage-04";
          } else if (progress >= 0.40) {
            nextStage = "stage-03";
          } else if (progress >= 0.12) {
            nextStage = "stage-02";
          }

          setActiveStage((prev) => (prev !== nextStage ? nextStage : prev));
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
    };
  }, []);

  // Programmatic scroll-to-stage utility
  const scrollToStage = useCallback((stageId: StageId) => {
    soundFX.playWhoosh();
    setActiveStage(stageId);

    const isMobile = window.innerWidth < 768;
    if (isMobile) {
      const targetElem = document.getElementById(`${stageId}-mobile`);
      if (targetElem) {
        targetElem.scrollIntoView({ behavior: "smooth" });
      }
      return;
    }

    if (!trackRef.current) return;
    const totalDist = trackRef.current.scrollHeight - window.innerHeight;
    let targetProgress = 0;

    switch (stageId) {
      case "stage-01":
        targetProgress = 0;
        break;
      case "stage-02":
        targetProgress = 0.25;
        break;
      case "stage-03":
        targetProgress = 0.55;
        break;
      case "stage-04":
        targetProgress = 0.95;
        break;
    }

    const targetY = trackRef.current.offsetTop + totalDist * targetProgress;
    window.scrollTo({
      top: targetY,
      behavior: "smooth",
    });
  }, []);

  return (
    <div className="relative min-h-screen bg-white dark:bg-[#0C0C10] text-black dark:text-white transition-colors duration-300 overflow-x-hidden selection:bg-yellow-400 selection:text-black">
      {/* Cinematic Video Intro Loader */}
      <IntroLoader />

      {/* Kinetic 3D Floating Grid Physics Layer */}
      <Kinetic3DBackground />

      {/* Kinetic Dynamic Animated Arrow Connectors */}
      <KineticMotionArrows />

      {/* Kinetic Floating Doodles & Architectural Annotations */}
      <KineticDoodlesLayer />

      {/* Interactive Drag & Draw Animated Studio Pen */}
      <KineticPaintPen />

      {/* High-Performance 60FPS Disappearing Ink Doodle Canvas */}
      <InteractiveDoodleCanvas />

      {/* Dot Grid Sketchpad Canvas */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0"></div>

      {/* ================= FIXED TOP HEADER (SHARED DESKTOP & MOBILE) ================= */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/95 dark:bg-[#0D0D12]/95 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors duration-200">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-7xl mx-auto py-1.5 sm:py-2">
          {/* Logo Anchor with Transparent Brand Image */}
          <button
            onClick={() => scrollToStage("stage-01")}
            className="group cursor-pointer active:scale-95 transition-transform flex items-center"
            title="Art Work — Home"
            aria-label="Art Work — Home"
          >
            <div className="relative w-14 h-14 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20 hover:rotate-3 transition-transform">
              <Image
                src="/assets/images/artwork_logo.png"
                alt="Art Work Logo"
                fill
                sizes="(max-width: 640px) 56px, (max-width: 768px) 64px, 80px"
                priority
                className="object-contain"
              />
            </div>
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-headline text-xs sm:text-sm uppercase tracking-wider font-bold">
            <button
              onClick={() => scrollToStage("stage-01")}
              className={`${
                activeStage === "stage-01"
                  ? "text-black dark:text-yellow-400 border-b-2 border-yellow-400 font-extrabold"
                  : "text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              } pb-0.5 transition-all cursor-pointer`}
            >
              01 Manifesto
            </button>
            <button
              onClick={() => scrollToStage("stage-02")}
              className={`${
                activeStage === "stage-02"
                  ? "text-black dark:text-yellow-400 border-b-2 border-yellow-400 font-extrabold"
                  : "text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              } pb-0.5 transition-all cursor-pointer`}
            >
              02 Why Us
            </button>
            <button
              onClick={() => scrollToStage("stage-03")}
              className={`${
                activeStage === "stage-03"
                  ? "text-black dark:text-yellow-400 border-b-2 border-yellow-400 font-extrabold"
                  : "text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              } pb-0.5 transition-all cursor-pointer`}
            >
              03 Services
            </button>
            <Link
              href="/gallery"
              className="text-black hover:text-black font-headline font-black text-xs uppercase px-2.5 py-1 rounded bg-yellow-300 border border-black comic-shadow-sm hover:bg-yellow-400 transition-all active:scale-95 flex items-center gap-1"
            >
              <span>★ Gallery</span>
            </Link>
            <button
              onClick={() => scrollToStage("stage-04")}
              className={`${
                activeStage === "stage-04"
                  ? "text-black dark:text-yellow-400 border-b-2 border-yellow-400 font-extrabold"
                  : "text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white"
              } pb-0.5 transition-all cursor-pointer`}
            >
              04 Contact
            </button>
          </nav>

          {/* Action Button & Controllers */}
          <div className="flex items-center gap-2">
            <ThemeToggle />
            <SoundToggle />
            <button
              onClick={() => {
                soundFX.playPop();
                toggleDoodle();
              }}
              aria-label="Toggle Studio Pen Doodle Mode"
              className="w-8 h-8 border-2 border-black dark:border-zinc-400 rounded-DEFAULT bg-white dark:bg-[#181824] hover:bg-yellow-100 dark:hover:bg-[#222232] comic-shadow-sm active:scale-90 transition-transform cursor-pointer flex items-center justify-center text-black dark:text-yellow-400"
              title="Toggle Studio Pen Doodle Mode"
            >
              <Pencil className="w-4 h-4" />
            </button>
            <MagneticButton soundType="pop">
              <button
                onClick={() => scrollToStage("stage-04")}
                className="hidden sm:inline-flex items-center gap-1.5 px-3 py-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-headline text-xs font-black uppercase tracking-wider rounded-DEFAULT border-2 border-black comic-shadow-sm active:scale-95 transition-all cursor-pointer"
              >
                <span>Brief Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </MagneticButton>
          </div>
        </div>
      </header>

      {/* =========================================================================
          DESKTOP VIEW: PINNED THEATER (>= 768px)
          400vh Scroll Track with Fixed Viewport Stage Morphing
          ========================================================================= */}
      <section
        ref={trackRef}
        className="hidden md:block relative w-full h-[400vh]"
        id="pinned-stage-track"
      >
        {/* STICKY FIXED VIEWPORT THEATER */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between z-10 pt-[90px] pb-1">
          {/* PINNED SCROLLYTELLING VERTICAL STAGE INDICATOR (Right Dock) */}
          <aside className="fixed right-4 sm:right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-end gap-3.5">
            <button
              onClick={() => scrollToStage("stage-01")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                01 Manifesto
              </span>
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 border-black transition-all duration-300 ${
                  activeStage === "stage-01"
                    ? "bg-yellow-400 scale-125 shadow-[0_0_8px_#facc15]"
                    : "bg-white/80 dark:bg-zinc-800"
                }`}
              />
            </button>

            <button
              onClick={() => scrollToStage("stage-02")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                02 Why Us
              </span>
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 border-black transition-all duration-300 ${
                  activeStage === "stage-02"
                    ? "bg-yellow-400 scale-125 shadow-[0_0_8px_#facc15]"
                    : "bg-white/80 dark:bg-zinc-800"
                }`}
              />
            </button>

            <button
              onClick={() => scrollToStage("stage-03")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                03 Services
              </span>
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 border-black transition-all duration-300 ${
                  activeStage === "stage-03"
                    ? "bg-yellow-400 scale-125 shadow-[0_0_8px_#facc15]"
                    : "bg-white/80 dark:bg-zinc-800"
                }`}
              />
            </button>

            <button
              onClick={() => scrollToStage("stage-04")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                04 Contact
              </span>
              <div
                className={`w-3.5 h-3.5 rounded-full border-2 border-black transition-all duration-300 ${
                  activeStage === "stage-04"
                    ? "bg-yellow-400 scale-125 shadow-[0_0_8px_#facc15]"
                    : "bg-white/80 dark:bg-zinc-800"
                }`}
              />
            </button>
          </aside>

          {/* MAIN STAGE CINEMATIC VIEWPORT */}
          <main className="relative flex-1 flex flex-col justify-center items-center w-full px-4 sm:px-6 max-w-7xl mx-auto overflow-hidden">
            <AnimatePresence mode="wait">
              {activeStage === "stage-01" && (
                <motion.div
                  key="scene-manifesto"
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex flex-col justify-center h-full"
                >
                  <ManifestoContent
                    content={content.manifesto}
                    onExploreShowreel={() => scrollToStage("stage-03")}
                    onViewCapabilities={() => scrollToStage("stage-02")}
                  />
                </motion.div>
              )}

              {activeStage === "stage-02" && (
                <motion.div
                  key="scene-why-us"
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex flex-col justify-center h-full"
                >
                  <WhyUsContent content={content.whyUsTeaser} />
                </motion.div>
              )}

              {activeStage === "stage-03" && (
                <motion.div
                  key="scene-services"
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex flex-col justify-center h-full"
                >
                  <ServicesContent />
                </motion.div>
              )}

              {activeStage === "stage-04" && (
                <motion.div
                  key="scene-contact"
                  initial={{ opacity: 0, scale: 0.96, y: 15 }}
                  animate={{ opacity: 1, scale: 1, y: 0 }}
                  exit={{ opacity: 0, scale: 1.02, y: -15 }}
                  transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
                  className="w-full flex flex-col justify-center h-full"
                >
                  <ContactContent content={content.contact} />
                </motion.div>
              )}
            </AnimatePresence>
          </main>

          {/* STUDIO FOOTER */}
          <StudioFooter scrollToStage={scrollToStage} />
        </div>
      </section>

      {/* =========================================================================
          MOBILE VIEW: NATURAL DOCUMENT FLOW (< 768px)
          ========================================================================= */}
      <div className="block md:hidden w-full pt-20 pb-16 px-4 space-y-16">
        <section id="stage-01-mobile" className="min-h-[85vh] flex flex-col justify-center">
          <ManifestoContent
            content={content.manifesto}
            onExploreShowreel={() => scrollToStage("stage-03")}
            onViewCapabilities={() => scrollToStage("stage-02")}
          />
        </section>

        <section id="stage-02-mobile" className="min-h-[85vh] flex flex-col justify-center pt-8 border-t-2 border-black/10 dark:border-zinc-800">
          <WhyUsContent content={content.whyUsTeaser} />
        </section>

        <section id="stage-03-mobile" className="min-h-[85vh] flex flex-col justify-center pt-8 border-t-2 border-black/10 dark:border-zinc-800">
          <ServicesContent />
        </section>

        <section id="stage-04-mobile" className="min-h-[85vh] flex flex-col justify-center pt-8 border-t-2 border-black/10 dark:border-zinc-800">
          <ContactContent content={content.contact} />
        </section>

        <StudioFooter scrollToStage={scrollToStage} />
      </div>
    </div>
  );
}
