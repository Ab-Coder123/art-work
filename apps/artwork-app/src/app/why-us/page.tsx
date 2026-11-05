"use client";

import React, { useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { KineticMotionArrows } from "@/components/cinematic/KineticMotionArrows";
import { KineticPaintPen } from "@/components/cinematic/KineticPaintPen";
import { Kinetic3DBackground } from "@/components/cinematic/Kinetic3DBackground";
import { InteractiveDoodleCanvas } from "@/components/cinematic/InteractiveDoodleCanvas";
import { SoundToggle } from "@/components/cinematic/SoundToggle";
import { ThemeToggle } from "@/components/cinematic/ThemeToggle";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { KineticBrushWord } from "@/components/cinematic/KineticBrushStroke";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";
import { DEFAULT_SITE_CONTENT } from "@art-work/database/content/default-content";
import type { LayoutSectionContent, WhyUsPageContent } from "@art-work/types";
import {
  ArrowRight,
  ArrowLeft,
  ArrowUpRight,
  TrendingUp,
  Sparkles,
  PenTool,
  CheckCircle2,
  XCircle,
  LayoutDashboard,
  Lightbulb,
  Store,
  Layers,
  Monitor,
  Send,
  Play,
} from "lucide-react";

function renderCapabilityIcon(icon?: string) {
  switch (icon) {
    case "lightbulb":
      return <Lightbulb className="w-7 h-7 text-black dark:text-yellow-400 stroke-[1.75]" />;
    case "store":
      return <Store className="w-7 h-7 text-black dark:text-yellow-400 stroke-[1.75]" />;
    case "monitor":
      return <Monitor className="w-7 h-7 text-black dark:text-yellow-400 stroke-[1.75]" />;
    case "layers":
    default:
      return <Layers className="w-7 h-7 text-black dark:text-yellow-400 stroke-[1.75]" />;
  }
}

export default function WhyUsPage() {
  const [content, setContent] = React.useState<WhyUsPageContent>(DEFAULT_SITE_CONTENT.whyUsPage);
  const [layout, setLayout] = React.useState<LayoutSectionContent>(DEFAULT_SITE_CONTENT.layout);

  // Activate Lenis luxury virtual smooth scroll
  useSmoothScroll();

  useEffect(() => {
    let mounted = true;
    fetch("/api/content", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((siteContent: { whyUsPage?: WhyUsPageContent; layout?: LayoutSectionContent }) => {
        if (!mounted || !siteContent) return;
        if (siteContent.whyUsPage) {
          setContent({ ...DEFAULT_SITE_CONTENT.whyUsPage, ...siteContent.whyUsPage });
        }
        if (siteContent.layout) {
          setLayout({ ...DEFAULT_SITE_CONTENT.layout, ...siteContent.layout });
        }
      })
      .catch(() => {
        // Keep the complete local defaults available when the content API is offline.
      });
    return () => {
      mounted = false;
    };
  }, []);

  // Mouse sparkle trail physics from Stitch design
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
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, []);

  const capabilityCards =
    Array.isArray(content.capabilityCards) && content.capabilityCards.length > 0
      ? content.capabilityCards
      : DEFAULT_SITE_CONTENT.whyUsPage.capabilityCards || [];

  const stickers =
    Array.isArray(content.doodleStickers) && content.doodleStickers.length > 0
      ? content.doodleStickers
      : DEFAULT_SITE_CONTENT.whyUsPage.doodleStickers;

  return (
    <div className="bg-drafting-grid dark:bg-[#0C0C10] text-black dark:text-[#F3F3F5] font-body antialiased min-h-screen selection:bg-yellow-400 selection:text-black relative overflow-x-hidden transition-colors duration-200">
      {/* Real 3D Kinetic Three.js Background with Scroll-Driven Motion */}
      <Kinetic3DBackground />

      {/* Dot Grid Sketchpad Canvas */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0"></div>

      {/* Kinetic Motion Arrows Layer */}
      <KineticMotionArrows />

      {/* Interactive Studio Paint Pen with Dynamic Paint Stroke */}
      <KineticPaintPen />

      {/* High-Performance 60FPS Disappearing Ink Doodle Canvas */}
      <InteractiveDoodleCanvas />

      {/* ================= TOP NAVIGATION ================= */}
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-[#0C0C10]/90 backdrop-blur-md nav-shadow transition-colors duration-200">
        <div className="flex justify-between items-center w-full px-6 py-2 sm:py-2.5 max-w-7xl mx-auto">
          {/* Logo Anchor with Transparent Brand Image */}
          <Link
            href="/"
            className="group active:scale-95 transition-transform flex items-center"
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

          {/* Desktop Navigation Links (Sticker Buttons) */}
          <nav className="hidden md:flex items-center gap-2 font-headline text-xs uppercase tracking-wider font-bold">
            <Link
              href="/#stage-01"
              className="inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {layout.navHomeLabel}
            </Link>
            {/* Active Link: Why Us */}
            <span className="inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 bg-yellow-400 text-black border-black comic-shadow-sm rotate-1 scale-105 z-10 font-black">
              {layout.navWhyUsLabel}
            </span>
            <Link
              href="/#stage-03"
              className="inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {layout.navServicesLabel}
            </Link>
            <Link
              href="/#stage-04"
              className="inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              {layout.navContactLabel}
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1 bg-yellow-300 dark:bg-yellow-400 text-black font-headline font-black text-xs uppercase px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 border-black comic-shadow-sm hover:bg-yellow-400 hover:-translate-y-0.5 hover:rotate-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ml-1 cursor-pointer"
            >
              ★ {layout.navGalleryLabel} ↗
            </Link>
          </nav>

          {/* Trailing Action Button + Theme & Sound FX Controllers */}
          <div className="flex items-center gap-2.5 sm:gap-3">
            <ThemeToggle />
            <SoundToggle />
            <Link
              href="/#stage-04"
              className="inline-flex items-center gap-1.5 px-3.5 sm:px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-headline text-xs md:text-sm font-extrabold uppercase tracking-wider rounded-DEFAULT border-2 border-black comic-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all duration-150"
            >
              <span>{layout.briefCtaText}</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>

        {/* Mobile Navigation Strip in Why Us */}
        <div className="md:hidden flex items-center justify-start gap-1.5 px-3 py-1.5 bg-yellow-50/95 dark:bg-[#12121A]/95 border-t border-black/10 dark:border-white/10 overflow-x-auto no-scrollbar">
          <Link
            href="/#stage-01"
            className="px-2.5 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black/70 dark:text-zinc-300 border border-black/20 dark:border-zinc-700 whitespace-nowrap"
          >
            ← {layout.navHomeLabel}
          </Link>
          <span className="px-2.5 py-1 rounded text-[10px] font-headline font-black uppercase tracking-wider bg-yellow-400 text-black border-2 border-black comic-shadow-sm whitespace-nowrap">
            {layout.navWhyUsLabel}
          </span>
          <Link
            href="/#stage-03"
            className="px-2.5 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black/70 dark:text-zinc-300 border border-black/20 dark:border-zinc-700 whitespace-nowrap"
          >
            {layout.navServicesLabel}
          </Link>
          <Link
            href="/#stage-04"
            className="px-2.5 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black/70 dark:text-zinc-300 border border-black/20 dark:border-zinc-700 whitespace-nowrap"
          >
            {layout.navContactLabel}
          </Link>
          <Link
            href="/gallery"
            className="px-2.5 py-1 rounded text-[10px] font-headline font-black uppercase tracking-wider bg-yellow-300 dark:bg-yellow-400 text-black border-2 border-black comic-shadow-sm whitespace-nowrap"
          >
            ★ {layout.navGalleryLabel} ↗
          </Link>
        </div>
      </header>

      {/* ================= VERTICAL STAGE SCROLLYTELLING INDICATOR (Fixed Right) ================= */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4">
        <div className="text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-zinc-500 rotate-90 origin-bottom mb-4">
          Stage Cue
        </div>
        <Link className="group flex items-center justify-end w-28 gap-2" href="/#stage-01" title="Scene 01">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-headline text-[10px] font-extrabold tracking-wider uppercase text-black/60 dark:text-zinc-400">
            {layout.navHomeLabel}
          </span>
          <span className="w-7 h-7 rounded-full bg-white dark:bg-[#151520] border border-black/30 dark:border-zinc-700 flex items-center justify-center text-[10px] font-black text-black/60 dark:text-zinc-400 group-hover:border-black dark:group-hover:border-zinc-500">
            01
          </span>
        </Link>
        <div className="w-0.5 h-6 bg-black/20 dark:bg-zinc-700"></div>
        <div className="group flex items-center justify-end w-36 gap-2" title="Scene 02 Active">
          <span className="font-headline text-[10px] font-black tracking-wider uppercase text-black bg-yellow-400 px-2 py-0.5 rounded border border-black">
            {layout.navWhyUsLabel}
          </span>
          <span className="w-9 h-9 rounded-full bg-black dark:bg-[#181824] text-yellow-400 border-2 border-yellow-400 ring-4 ring-yellow-400/40 flex items-center justify-center text-xs font-black shadow-md">
            02
          </span>
        </div>
        <div className="w-0.5 h-6 bg-black/20 dark:bg-zinc-700"></div>
        <Link className="group flex items-center justify-end w-28 gap-2" href="/#stage-03" title="Scene 03">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-headline text-[10px] font-extrabold tracking-wider uppercase text-black/60 dark:text-zinc-400">
            {layout.navServicesLabel}
          </span>
          <span className="w-7 h-7 rounded-full bg-white dark:bg-[#151520] border border-black/30 dark:border-zinc-700 flex items-center justify-center text-[10px] font-black text-black/60 dark:text-zinc-400 group-hover:border-black dark:group-hover:border-zinc-500">
            03
          </span>
        </Link>
        <div className="w-0.5 h-6 bg-black/20 dark:bg-zinc-700"></div>
        <Link className="group flex items-center justify-end w-28 gap-2" href="/#brief-inquiry" title="Scene 04">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-headline text-[10px] font-extrabold tracking-wider uppercase text-black/60 dark:text-zinc-400">
            {layout.navContactLabel}
          </span>
          <span className="w-7 h-7 rounded-full bg-white dark:bg-[#151520] border border-black/30 dark:border-zinc-700 flex items-center justify-center text-[10px] font-black text-black/60 dark:text-zinc-400 group-hover:border-black dark:group-hover:border-zinc-500">
            04
          </span>
        </Link>
      </aside>

      {/* ================= MAIN VIEWPORT STAGE ================= */}
      <main className="relative z-10 pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-6 sm:px-8 xl:pr-14">
        {/* HERO SECTION: Interactive Sticky Board & Architectural Easel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-20">
          {/* LEFT COLUMN: Centerpiece Marker Typography & Surrounding Doodle Stickers */}
          <div className="lg:col-span-7 relative pt-2">
            {/* Top Floating Badges */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-3">
              <motion.div
                initial={{ opacity: 0, y: -10, rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="relative bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 px-3 py-1 rounded-lg shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 text-[11px] font-bold tracking-tight text-black dark:text-zinc-200"
              >
                <div className="washi-tape"></div>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                <span>{content.roiBadge}</span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10, rotate: 4 }}
                animate={{ opacity: 1, y: 0, rotate: 2 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-yellow-300 border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 text-[11px] font-extrabold uppercase text-black"
              >
                <Sparkles className="w-3.5 h-3.5 text-black fill-yellow-500" />
                <span>{content.contentCreationBadge}</span>
              </motion.div>
            </div>

            {/* ICONIC DRY-BRUSH MARKER CENTERPIECE */}
            <div className="relative my-3 inline-block select-none">
              <div className="absolute -top-8 left-36 sm:left-44 transform -rotate-12 z-20 pointer-events-none">
                <svg
                  className="w-12 h-10 text-yellow-500 drop-shadow-[0_2px_0_#000]"
                  fill="currentColor"
                  stroke="black"
                  strokeLinecap="round"
                  strokeLinejoin="round"
                  strokeWidth="2.5"
                  viewBox="0 0 54 44"
                >
                  <path d="M 4,36 L 50,36 L 46,14 L 32,24 L 27,6 L 22,24 L 8,14 Z" fill="#FACC15"></path>
                  <circle cx="27" cy="6" fill="#111" r="3"></circle>
                  <circle cx="8" cy="14" fill="#111" r="3"></circle>
                  <circle cx="46" cy="14" fill="#111" r="3"></circle>
                </svg>
              </div>

              <div className="font-brush text-7xl sm:text-8xl md:text-9xl text-black dark:text-white leading-none tracking-tight">
                {content.heroHeadlineRow1}
              </div>

              <div className="relative inline-block mt-1 font-brush text-7xl sm:text-8xl md:text-9xl text-black leading-none brush-swipe-bg">
                <span className="relative z-10 drop-shadow-[2px_3px_0px_rgba(255,255,255,0.8)]">
                  {content.heroHeadlineRow2}
                </span>
              </div>

              <div className="absolute -bottom-6 right-0 transform translate-x-12 translate-y-2 pointer-events-none hidden sm:block">
                <svg
                  className="w-16 h-14 text-black dark:text-zinc-400"
                  fill="none"
                  stroke="currentColor"
                  strokeLinecap="round"
                  strokeWidth="2.5"
                  viewBox="0 0 80 60"
                >
                  <path d="M 10,10 C 35,5 65,15 65,45" strokeDasharray="4 4"></path>
                  <polyline fill="none" points="55,42 65,45 68,35"></polyline>
                </svg>
              </div>
            </div>

            {/* Surrounding Floating Taped Doodle Stickers */}
            <div className="flex flex-wrap gap-2.5 sm:gap-3 items-center my-5 relative z-10">
              {stickers[0] && (
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className="relative bg-yellow-400 text-black border-2 border-black font-brush text-xs tracking-wider px-3 py-1.5 rounded rotate-[-2deg] shadow-[2px_2px_0px_#111111] cursor-pointer"
                >
                  <div className="washi-tape !w-8 !h-2.5"></div>
                  ★ {stickers[0]}
                </motion.div>
              )}

              {stickers[1] && (
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className="relative bg-white dark:bg-[#161622] text-black dark:text-zinc-200 border-2 border-dashed border-black dark:border-zinc-700 font-headline text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded rotate-[1.5deg] shadow-[2px_2px_0px_#FACC15] cursor-pointer"
                >
                  {stickers[1]}
                </motion.div>
              )}

              {stickers[2] && (
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className="relative bg-yellow-300 text-black border-2 border-black font-headline text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded rotate-[-1deg] shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 cursor-pointer"
                >
                  <PenTool className="w-3.5 h-3.5 text-black" />
                  <span>{stickers[2]}</span>
                </motion.div>
              )}

              {stickers[3] && (
                <motion.div
                  whileHover={{ scale: 1.05, rotate: 0 }}
                  className="relative bg-white dark:bg-[#161622] text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-700 font-headline text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded rotate-[2deg] shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 cursor-pointer"
                >
                  <span>{stickers[3]}</span>
                  <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] text-black dark:text-zinc-200" />
                </motion.div>
              )}
            </div>

            {/* Editorial Subheading */}
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-black text-black dark:text-white leading-tight tracking-tight mb-4">
              {content.presentationTitle}
            </h2>

            {/* High-Impact Body Copy */}
            <p className="font-body text-base sm:text-lg text-black/80 dark:text-zinc-300 leading-relaxed max-w-xl mb-6">
              {content.presentationSubtitle}
            </p>

            {/* CTAs */}
            <div className="flex flex-wrap items-center gap-3.5">
              <a
                className="inline-flex items-center gap-2.5 px-6 py-3 bg-yellow-400 hover:bg-yellow-300 text-black font-headline text-sm font-black uppercase tracking-wider rounded-xl border-2 border-black hover-brutal-lift active:scale-95 transition-all shadow-[3px_3px_0px_#111111]"
                href="#matrix"
              >
                <span>{content.primaryCtaText || "EXPLORE OUR SERVICES"}</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>
              <a
                className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#181824] hover:bg-black hover:text-white dark:hover:bg-yellow-400 dark:hover:text-black text-black dark:text-white font-headline text-sm font-bold uppercase tracking-wider rounded-xl border-2 border-black dark:border-zinc-700 hover-brutal-clean active:scale-95 transition-all shadow-[2px_2px_0px_#111111]"
                href="/gallery"
              >
                <span>{content.secondaryCtaText || "VIEW SELECTED PROJECTS"}</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>

            {/* Metric Tick Banner */}
            <div className="mt-8 pt-5 border-t border-black/10 dark:border-zinc-800 flex flex-wrap items-center gap-4 text-xs font-mono text-black/60 dark:text-zinc-400">
              {(content.metrics || DEFAULT_SITE_CONTENT.whyUsPage.metrics).map((m, idx) => (
                <React.Fragment key={`${m.label}-${idx}`}>
                  {idx > 0 && <div>•</div>}
                  <div className="flex items-center gap-2 uppercase">
                    {idx === 0 && <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>}
                    <span>
                      {m.num} {m.label}
                    </span>
                  </div>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* RIGHT COLUMN: CAD Drafting Easel & Real Presentation Blueprint Illustration */}
          <ScrollReveal direction="left" distance={30} className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-[6px_6px_0px_#111111]">
              {/* Top Ribbon */}
              <div className="flex items-center justify-between border-b-2 border-black dark:border-zinc-700 pb-3 mb-4 font-mono text-[11px] text-black dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black inline-block"></span>
                  <span className="font-bold">
                    {content.easelTag || "EASEL BLUEPRINT // STAGE 02"}
                  </span>
                </div>
                <span className="bg-black text-yellow-400 px-2 py-0.5 rounded font-black">
                  {content.statusBadge}
                </span>
              </div>

              {/* Sticky Note Taped on Top Right */}
              <div className="absolute -top-5 right-4 sm:right-6 z-20 rotate-2 hidden sm:block">
                <div className="bg-yellow-300 border-2 border-black p-2.5 rounded-md shadow-[3px_3px_0px_#111111] max-w-[185px]">
                  <div className="washi-tape !w-10 !h-2.5"></div>
                  <p className="font-brush text-[11px] leading-tight text-black">
                    &quot;
                    {content.directorNote ||
                      "DIRECTOR NOTE: Every millimeter stress-tested & drafted custom."}
                    &quot;
                  </p>
                </div>
              </div>

              {/* The Presentation Easel Image */}
              <div className="relative overflow-hidden rounded-xl border-2 border-black dark:border-zinc-700 bg-white dark:bg-zinc-900 group aspect-[4/3]">
                <Image
                  src={content.presentationImage}
                  alt={content.presentationImageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                  unoptimized={
                    content.presentationImage.startsWith("http") ||
                    content.presentationImage.startsWith("data:")
                  }
                />
                <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-[#181824]/95 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono font-bold z-10 shadow-[2px_2px_0px_#111111]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 stroke-[2.5]" />
                  <span>{content.tailoredStamp || "100% TAILORED ENGINEERING"}</span>
                </div>
              </div>

              {/* Lower Drafting Specs Grid */}
              <div className="mt-4 pt-3 border-t border-black/15 dark:border-zinc-800 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-black/70 dark:text-zinc-400">
                <div>
                  PLANNING: <strong className="text-black dark:text-white font-black">COMPREHENSIVE</strong>
                </div>
                <div>
                  PRODUCTION: <strong className="text-black dark:text-white font-black">ON-SITE DELIVERY</strong>
                </div>
                <div>
                  BRANDING: <strong className="text-black dark:text-white font-black">CUSTOM ALIGNED</strong>
                </div>
                <div>
                  COLLABORATION: <strong className="text-black dark:text-white font-black">ONE TEAM</strong>
                </div>
              </div>
            </div>

            {/* Floating Badge: 0% COOKIE CUTTER */}
            <div className="absolute -bottom-4 left-6 z-20 transform -rotate-2">
              <div className="bg-yellow-400 text-black border-2 border-black font-headline text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-[3px_3px_0px_#111111] flex items-center gap-2">
                <XCircle className="w-4 h-4 text-black stroke-[2.5]" />
                <span>{content.zeroTemplatesBadge || "0% COOKIE-CUTTER TEMPLATES"}</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ================= SCENE 2 INTERACTIVE CAPABILITIES & EVENT MATRIX (Bento Grid) ================= */}
        <section className="mb-24" id="matrix">
          <ScrollReveal
            direction="up"
            distance={25}
            className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12"
          >
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-yellow-400 font-mono text-xs font-black rounded mb-3">
                <LayoutDashboard className="w-3.5 h-3.5 text-yellow-400 stroke-[2.5]" />
                {content.matrixBadge || "EXPERIENTIAL MATRIX"}
              </div>
              <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight uppercase">
                {content.matrixHeadlinePrefix || "Core Physical & Experiential"}{" "}
                <KineticBrushWord variant="wave" color="#dcb858" strokeWidth={2.6}>
                  {content.matrixHeadlineHighlight || "Capabilities"}
                </KineticBrushWord>
              </h3>
            </div>
            <p className="font-body text-sm text-black/70 dark:text-zinc-300 max-w-md">
              {content.matrixDescription ||
                "We bring creative development, event planning and production together under one coordinated approach, keeping your brand and audience at the center of every experience."}
            </p>
          </ScrollReveal>

          {/* Dynamic Bento Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {capabilityCards.map((card, idx) => (
              <motion.div
                key={`${card.title}-${idx}`}
                initial={{ opacity: 0, y: 35, scale: 0.96 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.12 }}
                transition={{ duration: 0.5, delay: (idx % 2) * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 rounded-2xl p-8 hover-brutal-lift flex flex-col justify-between relative overflow-hidden group"
              >
                <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-yellow-400/20 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
                <div>
                  <div className="flex items-center justify-between mb-6">
                    {renderCapabilityIcon(card.icon)}
                  </div>
                  <h4 className="font-headline text-2xl font-black text-black dark:text-white mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {card.title}
                  </h4>
                  <p className="font-body text-sm text-black/70 dark:text-zinc-300 mb-6 leading-relaxed">
                    {card.description}
                  </p>
                </div>
                <div className="border-t-2 border-black/10 dark:border-zinc-800 pt-4">
                  <ul className="space-y-2 text-xs font-mono font-bold text-black dark:text-zinc-200">
                    {card.bullets.map((bullet, bIdx) => (
                      <li key={bIdx} className="flex items-center gap-2">
                        <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                        {bullet}
                      </li>
                    ))}
                  </ul>
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= STAGE 02 INTERACTIVE BRIEF CALLOUT ================= */}
        <ScrollReveal direction="pop" distance={30} className="mb-20">
          <section
            className="bg-yellow-400 border-2 border-black rounded-2xl p-6 sm:p-10 shadow-[8px_8px_0px_#111111] relative overflow-hidden"
            id="brief"
          >
            <div className="washi-tape !w-24 !h-5 !bg-black/20"></div>
            <div className="relative z-10 flex flex-col xl:flex-row items-start xl:items-center justify-between gap-6 sm:gap-8">
              <div className="flex-1 max-w-2xl text-left">
                <div className="font-brush text-sm tracking-wider uppercase text-black mb-2">
                  {content.calloutTag || "TELL US WHAT YOU’RE PLANNING"}
                </div>
                <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-black uppercase tracking-tight leading-none mb-3">
                  {content.calloutHeadlinePrefix || "LET'S DRAFT YOUR"}{" "}
                  <KineticBrushWord variant="double" color="#111111" strokeWidth={2.4}>
                    {content.calloutHeadlineHighlight || "NEXT EVENT."}
                  </KineticBrushWord>
                </h3>
                <p className="font-body text-sm sm:text-base font-semibold text-black/80 max-w-xl leading-relaxed">
                  {content.calloutDescription ||
                    "Tell us about your event format, audience and timing. We’ll follow up to discuss the right creative, planning and production support."}
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 shrink-0 w-full sm:w-auto">
                <Link
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 bg-black text-white hover:bg-white hover:text-black font-headline text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl border-2 border-black shadow-[4px_4px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#111111] active:scale-95 transition-all whitespace-nowrap cursor-pointer text-center w-full sm:w-auto"
                  href="/#brief-inquiry"
                >
                  <span>{content.calloutPrimaryCta || "SEND YOUR EVENT BRIEF"}</span>
                  <Send className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 bg-white text-black hover:bg-black hover:text-white font-headline text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl border-2 border-black shadow-[4px_4px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#111111] active:scale-95 transition-all whitespace-nowrap cursor-pointer text-center w-full sm:w-auto"
                  href="/#stage-03"
                >
                  <span>{content.calloutSecondaryCta || "EXPLORE SERVICES"}</span>
                  <Play className="w-4 h-4 fill-current" />
                </Link>
              </div>
            </div>
          </section>
        </ScrollReveal>

        {/* STAGE SCROLL NAVIGATION CONTROLS */}
        <div className="flex items-center justify-between border-t-2 border-black dark:border-zinc-800 pt-6 mb-12">
          <Link
            className="inline-flex items-center gap-2 font-headline text-xs font-black uppercase tracking-wider text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors"
            href="/#stage-01"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>PREV: {layout.navHomeLabel}</span>
          </Link>
          <div className="text-xs font-mono font-bold uppercase bg-yellow-400 text-black px-3 py-1 rounded border border-black">
            {content.sceneBadge} {"// ACTIVE"}
          </div>
          <Link
            className="inline-flex items-center gap-2 font-headline text-xs font-black uppercase tracking-wider text-black dark:text-zinc-200 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
            href="/#stage-03"
          >
            <span>NEXT: {layout.navServicesLabel}</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full py-6 bg-white dark:bg-[#0C0C10] border-t border-black/10 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-4 font-body text-xs tracking-tight text-black dark:text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="font-headline text-base font-bold text-black dark:text-white">
              {layout.footerBrandTitle}
            </span>
            <span className="text-black/40 dark:text-zinc-500">/</span>
            <span className="text-black/70 dark:text-zinc-400">
              {layout.footerBrandSubtitle}
            </span>
          </div>
          <div className="text-black/60 dark:text-zinc-400 text-center">
            {layout.footerCopyright}
          </div>
          <nav className="flex items-center gap-6">
            <Link
              className="text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-150"
              href="/#stage-01"
            >
              {layout.navHomeLabel}
            </Link>
            <Link
              className="text-black dark:text-yellow-400 underline decoration-yellow-400 font-bold transition-colors duration-150"
              href="/why-us"
            >
              {layout.navWhyUsLabel}
            </Link>
            <Link
              className="text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-150"
              href="/#stage-03"
            >
              {layout.navServicesLabel}
            </Link>
            <Link
              className="text-black/80 dark:text-zinc-300 hover:text-black dark:hover:text-white font-bold transition-colors duration-150"
              href="/gallery"
            >
              {layout.navGalleryLabel}
            </Link>
            <Link
              className="text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-150"
              href="/#brief-inquiry"
            >
              {layout.briefCtaText}
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
