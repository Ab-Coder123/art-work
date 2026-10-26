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
import type { WhyUsPageContent } from "@art-work/types";
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

export default function WhyUsPage() {
  const [content, setContent] = React.useState<WhyUsPageContent>(DEFAULT_SITE_CONTENT.whyUsPage);

  // Activate Lenis luxury virtual smooth scroll
  useSmoothScroll();

  useEffect(() => {
    let mounted = true;
    fetch("/api/content", { cache: "no-store" })
      .then((response) => (response.ok ? response.json() : Promise.reject()))
      .then((siteContent: { whyUsPage?: WhyUsPageContent }) => {
        if (mounted && siteContent.whyUsPage) {
          setContent({ ...DEFAULT_SITE_CONTENT.whyUsPage, ...siteContent.whyUsPage });
        }
      })
      .catch(() => {
        // Keep the complete local defaults available when the content API is offline.
      });
    return () => { mounted = false; };
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

  return (
    <div className="bg-drafting-grid dark:bg-[#0C0C10] text-black dark:text-[#F3F3F5] font-body antialiased min-h-screen selection:bg-yellow-400 selection:text-black relative overflow-x-hidden transition-colors duration-200">
      {/* Real 3D Kinetic Three.js Background with Scroll-Driven Motion (opacity-25) */}
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
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 dark:bg-[#0C0C10]/90 backdrop-blur-md border-b border-black/10 dark:border-zinc-800">
        <div className="flex justify-between items-center w-full px-6 py-2 sm:py-2.5 max-w-7xl mx-auto">
          {/* Logo Anchor with Transparent Brand Image */}
          <Link
            href="/"
            className="group active:scale-95 transition-transform flex items-center"
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
          </Link>

          {/* Desktop Navigation Links (Sticker Buttons) */}
          <nav className="hidden md:flex items-center gap-2 font-headline text-xs uppercase tracking-wider font-bold">
            <Link
              href="/#stage-01"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Home
            </Link>
            <Link
              href="/company"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Partner&apos;s
            </Link>
            {/* Active Link: Why Us */}
            <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-yellow-400 text-black border-black comic-shadow-sm rotate-1 scale-105 z-10 font-black">
              Why Us
            </span>
            <Link
              href="/#stage-03"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Services
            </Link>
            <Link
              href="/gallery"
              className="inline-flex items-center gap-1 bg-yellow-300 dark:bg-yellow-400 text-black font-headline font-black text-xs uppercase px-3 py-1.5 rounded-lg border-2 border-black comic-shadow-sm hover:bg-yellow-400 hover:-translate-y-0.5 hover:rotate-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all cursor-pointer"
            >
              ★ Gallery
            </Link>
            <Link
              href="/#stage-04"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Contact
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
              <span>Brief Inquiry</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= VERTICAL STAGE SCROLLYTELLING INDICATOR (Fixed Right) ================= */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4">
        <div className="text-[9px] font-bold uppercase tracking-widest text-black/40 dark:text-zinc-500 rotate-90 origin-bottom mb-4">
          Stage Cue
        </div>
        <Link className="group flex items-center justify-end w-28 gap-2" href="/#stage-01" title="Scene 01">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-headline text-[10px] font-extrabold tracking-wider uppercase text-black/60 dark:text-zinc-400">
            HOME
          </span>
          <span className="w-7 h-7 rounded-full bg-white dark:bg-[#151520] border border-black/30 dark:border-zinc-700 flex items-center justify-center text-[10px] font-black text-black/60 dark:text-zinc-400 group-hover:border-black dark:group-hover:border-zinc-500">
            01
          </span>
        </Link>
        <div className="w-0.5 h-6 bg-black/20 dark:bg-zinc-700"></div>
        <div className="group flex items-center justify-end w-36 gap-2" title="Scene 02 Active">
          <span className="font-headline text-[10px] font-black tracking-wider uppercase text-black bg-yellow-400 px-2 py-0.5 rounded border border-black">
            WHY US
          </span>
          <span className="w-9 h-9 rounded-full bg-black dark:bg-[#181824] text-yellow-400 border-2 border-yellow-400 ring-4 ring-yellow-400/40 flex items-center justify-center text-xs font-black shadow-md">
            02
          </span>
        </div>
        <div className="w-0.5 h-6 bg-black/20 dark:bg-zinc-700"></div>
        <Link className="group flex items-center justify-end w-28 gap-2" href="/#stage-03" title="Scene 03">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-headline text-[10px] font-extrabold tracking-wider uppercase text-black/60 dark:text-zinc-400">
            SERVICES
          </span>
          <span className="w-7 h-7 rounded-full bg-white dark:bg-[#151520] border border-black/30 dark:border-zinc-700 flex items-center justify-center text-[10px] font-black text-black/60 dark:text-zinc-400 group-hover:border-black dark:group-hover:border-zinc-500">
            03
          </span>
        </Link>
        <div className="w-0.5 h-6 bg-black/20 dark:bg-zinc-700"></div>
        <Link className="group flex items-center justify-end w-28 gap-2" href="/#brief-inquiry" title="Scene 04">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-headline text-[10px] font-extrabold tracking-wider uppercase text-black/60 dark:text-zinc-400">
            CONTACT
          </span>
          <span className="w-7 h-7 rounded-full bg-white dark:bg-[#151520] border border-black/30 dark:border-zinc-700 flex items-center justify-center text-[10px] font-black text-black/60 dark:text-zinc-400 group-hover:border-black dark:group-hover:border-zinc-500">
            04
          </span>
        </Link>
      </aside>

      {/* ================= MAIN VIEWPORT STAGE ================= */}
      <main className="relative z-10 pt-24 sm:pt-28 pb-20 max-w-6xl mx-auto px-6 sm:px-8 xl:pr-14">
        {/* Technical Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black dark:border-zinc-800 pb-3 mb-8 text-xs font-mono uppercase tracking-widest text-black/70 dark:text-zinc-400">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-black text-white font-black text-[10px]">{content.sceneBadge}</span>
            <span className="font-bold">{content.sceneTitle}</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>CAD: REV-2025.02</span>
            <span>•</span>
            <span>STAGE: PINNED PERSPECTIVE</span>
            <span>•</span>
            <span className="text-black dark:text-white font-extrabold">{content.statusBadge}</span>
          </div>
        </div>

        {/* HERO SECTION: Interactive Sticky Board & Architectural Easel */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 lg:gap-10 items-start mb-20">
          {/* LEFT COLUMN: Centerpiece Marker Typography & Surrounding Doodle Stickers */}
          <div className="lg:col-span-7 relative pt-2">
            {/* Top Floating Badges (Fluid Flex Alignment with Zero Collision) */}
            <div className="flex flex-wrap items-center gap-2.5 sm:gap-3 mb-3">
              <motion.div
                initial={{ opacity: 0, y: -10, rotate: -4 }}
                animate={{ opacity: 1, y: 0, rotate: -3 }}
                transition={{ duration: 0.4, delay: 0.15 }}
                className="relative bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 px-3 py-1 rounded-lg shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 text-[11px] font-bold tracking-tight text-black dark:text-zinc-200"
              >
                <div className="washi-tape"></div>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 dark:text-emerald-400 stroke-[2.5]" />
                <span>
                  {content.roiBadge}
                </span>
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

            {/* ICONIC DRY-BRUSH MARKER CENTERPIECE: "WHY US?" */}
            <div className="relative my-3 inline-block select-none">
              {/* Hand-drawn Crown Doodle Floating over letter 'Y' */}
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

              {/* Row 1: "WHY" */}
              <div className="font-brush text-7xl sm:text-8xl md:text-9xl text-black dark:text-white leading-none tracking-tight">
                {content.heroHeadlineRow1}
              </div>

              {/* Row 2: "US?" with Canary Yellow highlighter swipe backing */}
              <div className="relative inline-block mt-1 font-brush text-7xl sm:text-8xl md:text-9xl text-black leading-none brush-swipe-bg">
                <span className="relative z-10 drop-shadow-[2px_3px_0px_rgba(255,255,255,0.8)]">
                  {content.heroHeadlineRow2}
                </span>
              </div>

              {/* Hand-drawn curved doodle arrows pointing to the headline */}
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
              {/* Sticker: BRANDING */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="relative bg-yellow-400 text-black border-2 border-black font-brush text-xs tracking-wider px-3 py-1.5 rounded rotate-[-2deg] shadow-[2px_2px_0px_#111111] cursor-pointer"
              >
                <div className="washi-tape !w-8 !h-2.5"></div>
              ★ {content.doodleStickers[0]}
              </motion.div>

              {/* Sticker: CONTENT STRATEGY */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="relative bg-white dark:bg-[#161622] text-black dark:text-zinc-200 border-2 border-dashed border-black dark:border-zinc-700 font-headline text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded rotate-[1.5deg] shadow-[2px_2px_0px_#FACC15] cursor-pointer"
              >
              {content.doodleStickers[1]}
              </motion.div>

              {/* Sticker: DESIGNING */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="relative bg-yellow-300 text-black border-2 border-black font-headline text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded rotate-[-1deg] shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-black" />
                <span>{content.doodleStickers[2]}</span>
              </motion.div>

              {/* Sticker: WEB DEVELOPMENT */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="relative bg-white dark:bg-[#161622] text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-700 font-headline text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded rotate-[2deg] shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 cursor-pointer"
              >
                <span>{content.doodleStickers[3]}</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] text-black dark:text-zinc-200" />
              </motion.div>
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
                <span>Explore Our Proposition</span>
                <ArrowRight className="w-4 h-4 stroke-[2.5]" />
              </a>
              <a
                className="inline-flex items-center gap-2 px-5 py-3 bg-white dark:bg-[#181824] hover:bg-black hover:text-white dark:hover:bg-yellow-400 dark:hover:text-black text-black dark:text-white font-headline text-sm font-bold uppercase tracking-wider rounded-xl border-2 border-black dark:border-zinc-700 hover-brutal-clean active:scale-95 transition-all shadow-[2px_2px_0px_#111111]"
                href="#matrix"
              >
                <span>View Live Capabilities</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>

            {/* Metric Tick Banner */}
            <div className="mt-8 pt-5 border-t border-black/10 dark:border-zinc-800 flex items-center gap-6 text-xs font-mono text-black/60 dark:text-zinc-400">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span>450+ ARENA STAGES STAGED</span>
              </div>
              <div>•</div>
              <div>99.4% DMX CUE ACCURACY</div>
            </div>
          </div>

          {/* RIGHT COLUMN: CAD Drafting Easel & Real Presentation Blueprint Illustration */}
          <ScrollReveal direction="left" distance={30} className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 rounded-2xl p-4 sm:p-5 shadow-[6px_6px_0px_#111111]">
              {/* Top Technical Ribbon */}
              <div className="flex items-center justify-between border-b-2 border-black dark:border-zinc-700 pb-3 mb-4 font-mono text-[11px] text-black dark:text-zinc-300">
                <div className="flex items-center gap-2">
                  <span className="w-3 h-3 rounded-full bg-yellow-400 border border-black inline-block"></span>
                  <span className="font-bold">EASEL BLUEPRINT // STAGE 02</span>
                </div>
                <span className="bg-black text-yellow-400 px-2 py-0.5 rounded font-black">
                  PLOT: ACTIVE
                </span>
              </div>

              {/* Sticky Note Taped on Top Right — Positioned cleanly inside card bounds */}
              <div className="absolute -top-5 right-4 sm:right-6 z-20 rotate-2 hidden sm:block">
                <div className="bg-yellow-300 border-2 border-black p-2.5 rounded-md shadow-[3px_3px_0px_#111111] max-w-[185px]">
                  <div className="washi-tape !w-10 !h-2.5"></div>
                  <p className="font-brush text-[11px] leading-tight text-black">
                    &quot;DIRECTOR NOTE: Every millimeter stress-tested &amp; drafted custom.&quot;
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
                />
                {/* Live Viewport Overlay Stamp */}
                <div className="absolute bottom-3 left-3 bg-white/95 dark:bg-[#181824]/95 text-black dark:text-zinc-200 border-2 border-black dark:border-zinc-700 px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono font-bold z-10 shadow-[2px_2px_0px_#111111]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 stroke-[2.5]" />
                  <span>100% TAILORED ENGINEERING</span>
                </div>
              </div>

              {/* Lower Drafting Specs Grid */}
              <div className="mt-4 pt-3 border-t border-black/15 dark:border-zinc-800 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-black/70 dark:text-zinc-400">
                <div>
                  RIGGING TOLERANCE: <strong className="text-black dark:text-white font-black">0.05 MM</strong>
                </div>
                <div>
                  CNC FABRICATION: <strong className="text-black dark:text-white font-black">GERMAN SPEC</strong>
                </div>
                <div>
                  COLOR ACCURACY: <strong className="text-black dark:text-white font-black">PANTONE 100%</strong>
                </div>
                <div>
                  STATUS: <strong className="text-black dark:text-white font-black">READY FOR CUE</strong>
                </div>
              </div>
            </div>

            {/* Floating Badge: 0% COOKIE CUTTER */}
            <div className="absolute -bottom-4 left-6 z-20 transform -rotate-2">
              <div className="bg-yellow-400 text-black border-2 border-black font-headline text-xs font-black uppercase tracking-wider px-3.5 py-1.5 rounded-xl shadow-[3px_3px_0px_#111111] flex items-center gap-2">
                <XCircle className="w-4 h-4 text-black stroke-[2.5]" />
                <span>0% COOKIE-CUTTER TEMPLATES</span>
              </div>
            </div>
          </ScrollReveal>
        </div>

        {/* ================= PROOF & METRICS TICKER ================= */}
        <section className="mb-24 py-6 border-y-2 border-black dark:border-zinc-800 bg-yellow-400/20 dark:bg-yellow-400/10 rounded-2xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            {[
              ...content.metrics,
              { num: "0%", label: "Generic Templates" },
            ].slice(0, 4).map((stat, i) => (
              <motion.div
                key={stat.label}
                initial={{ opacity: 0, y: 25, scale: 0.95 }}
                whileInView={{ opacity: 1, y: 0, scale: 1 }}
                viewport={{ once: true, amount: 0.15 }}
                transition={{ duration: 0.45, delay: i * 0.1, ease: [0.22, 1, 0.36, 1] }}
                className="p-4 bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 rounded-xl shadow-[4px_4px_0px_#111111]"
              >
                <div className="font-brush text-3xl md:text-4xl text-black dark:text-yellow-400">{stat.num}</div>
                <div className="font-headline text-xs font-black uppercase tracking-wider text-black/70 dark:text-zinc-400 mt-1">
                  {stat.label}
                </div>
              </motion.div>
            ))}
          </div>
        </section>

        {/* ================= SCENE 2 INTERACTIVE CAPABILITIES & EVENT MATRIX (Bento Grid) ================= */}
        <section className="mb-24" id="matrix">
          <ScrollReveal direction="up" distance={25} className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-yellow-400 font-mono text-xs font-black rounded mb-3">
                <LayoutDashboard className="w-3.5 h-3.5 text-yellow-400 stroke-[2.5]" />
                EXPERIENTIAL MATRIX // STAGE 02
              </div>
              <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-black dark:text-white tracking-tight uppercase">
                Core Physical &amp; Experiential{" "}
                <KineticBrushWord variant="wave" color="#dcb858" strokeWidth={2.6}>
                  Capabilities
                </KineticBrushWord>
              </h3>
            </div>
            <p className="font-body text-sm text-black/70 dark:text-zinc-300 max-w-md">
              Every discipline is owned in-house. From acoustic calculations to millimetric CNC stage
              craft, we merge brutal strategic clarity with theater-grade engineering.
            </p>
          </ScrollReveal>

          {/* Bento Grid (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD 01 */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.5, delay: 0, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 rounded-2xl p-8 hover-brutal-lift flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-yellow-400/20 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-black text-white font-mono text-xs font-black rounded">
                    SPEC // 01
                  </span>
                  <Lightbulb className="w-7 h-7 text-black dark:text-yellow-400 stroke-[1.75]" />
                </div>
                <h4 className="font-headline text-2xl font-black text-black dark:text-white mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  0% Cookie-Cutter Posts — 100% Unapologetic Strategy
                </h4>
                <p className="font-body text-sm text-black/70 dark:text-zinc-300 mb-6 leading-relaxed">
                  We eliminate fluff content and vanity metrics. We construct foundational brand
                  positioning, narrative hooks, and commercial distribution pipelines that force your
                  market to pay attention.
                </p>
              </div>
              <div className="border-t-2 border-black/10 dark:border-zinc-800 pt-4">
                <ul className="space-y-2 text-xs font-mono font-bold text-black dark:text-zinc-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    Brand Positioning &amp; Kinetic Narrative Architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    Multi-Channel Commercial Go-to-Market Masterplans
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    High-Conversion Acquisition &amp; Retention Modeling
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* CARD 02 */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.5, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 rounded-2xl p-8 hover-brutal-lift flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-yellow-400/20 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-black text-white font-mono text-xs font-black rounded">
                    SPEC // 02
                  </span>
                  <Store className="w-7 h-7 text-black dark:text-yellow-400 stroke-[1.75]" />
                </div>
                <h4 className="font-headline text-2xl font-black text-black dark:text-white mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  Exhibitions &amp; Bespoke Booth Architecture
                </h4>
                <p className="font-body text-sm text-black/70 dark:text-zinc-300 mb-6 leading-relaxed">
                  Grade-A exhibition dominance for global conventions like CES, Gitex, Arab Health,
                  and MWC. Custom millwork, double-decker cantilever VIP meeting lounges, and
                  optimized foot-traffic routing.
                </p>
              </div>
              <div className="border-t-2 border-black/10 dark:border-zinc-800 pt-4">
                <ul className="space-y-2 text-xs font-mono font-bold text-black dark:text-zinc-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    Custom German-Spec CNC Millwork &amp; Structural Fabrication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    Double-Decker VIP Suites with Acoustic Sound Dampening
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    Interactive Tactile Product Demonstration Islands
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* CARD 03 */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.5, delay: 0.05, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 rounded-2xl p-8 hover-brutal-lift flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-yellow-400/20 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-black text-white font-mono text-xs font-black rounded">
                    SPEC // 03
                  </span>
                  <Layers className="w-7 h-7 text-black dark:text-yellow-400 stroke-[1.75]" />
                </div>
                <h4 className="font-headline text-2xl font-black text-black dark:text-white mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  Massive Touring Stages &amp; Sound Engineering
                </h4>
                <p className="font-body text-sm text-black/70 dark:text-zinc-300 mb-6 leading-relaxed">
                  Stadium and arena caliber temporary architecture. Certified load-bearing trusses,
                  moving head fixture plots, sub-bass phased arrays, and synchronized DMX kinetic
                  hoists built for touring stamina.
                </p>
              </div>
              <div className="border-t-2 border-black/10 dark:border-zinc-800 pt-4">
                <ul className="space-y-2 text-xs font-mono font-bold text-black dark:text-zinc-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    DMX Automated Kinetic Light Rigs &amp; Laser Vector Systems
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    Line-Array Line-of-Sight Acoustic Engineering
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    Redundant Arena-Grade Power Distribution &amp; Backup Generators
                  </li>
                </ul>
              </div>
            </motion.div>

            {/* CARD 04 */}
            <motion.div
              initial={{ opacity: 0, y: 35, scale: 0.96 }}
              whileInView={{ opacity: 1, y: 0, scale: 1 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.5, delay: 0.15, ease: [0.22, 1, 0.36, 1] }}
              className="bg-white dark:bg-[#151520] border-2 border-black dark:border-zinc-700 rounded-2xl p-8 hover-brutal-lift flex flex-col justify-between relative overflow-hidden group"
            >
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-yellow-400/20 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-black text-white font-mono text-xs font-black rounded">
                    SPEC // 04
                  </span>
                  <Monitor className="w-7 h-7 text-black dark:text-yellow-400 stroke-[1.75]" />
                </div>
                <h4 className="font-headline text-2xl font-black text-black dark:text-white mb-3 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                  Ultra-High Refresh LED &amp; Audiovisual Mastery
                </h4>
                <p className="font-body text-sm text-black/70 dark:text-zinc-300 mb-6 leading-relaxed">
                  Zero-latency visual immersion. Seamless 1.5mm pixel pitch curved video walls,
                  transparent holographic mesh panels, and disguise media server clusters for
                  real-time generative stage graphics.
                </p>
              </div>
              <div className="border-t-2 border-black/10 dark:border-zinc-800 pt-4">
                <ul className="space-y-2 text-xs font-mono font-bold text-black dark:text-zinc-200">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    7680Hz Ultra-High Refresh Rates (Broadcast &amp; Camera Safe)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    Real-Time Notch / TouchDesigner Generative Visual Pipelines
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                    Holographic Transparent Mesh Stages for 3D Illusions
                  </li>
                </ul>
              </div>
            </motion.div>
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
                  Ready to blow your competition out of the water?
                </div>
                <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-black uppercase tracking-tight leading-none mb-3">
                  LET&apos;S DRAFT YOUR{" "}
                  <KineticBrushWord variant="double" color="#111111" strokeWidth={2.4}>
                    MASTERSTAGE BRIEF.
                  </KineticBrushWord>
                </h3>
                <p className="font-body text-sm sm:text-base font-semibold text-black/80 max-w-xl leading-relaxed">
                  Tell us your target milestone, space dimensions, or commercial goals. We return with a
                  fully costed 3D structural preview within 72 hours.
                </p>
              </div>
              <div className="flex flex-wrap sm:flex-nowrap items-center gap-3.5 shrink-0 w-full sm:w-auto">
                <Link
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 bg-black text-white hover:bg-white hover:text-black font-headline text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl border-2 border-black shadow-[4px_4px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#111111] active:scale-95 transition-all whitespace-nowrap cursor-pointer text-center w-full sm:w-auto"
                  href="/#brief-inquiry"
                >
                  <span>SUBMIT BRIEF SPEC</span>
                  <Send className="w-4 h-4 stroke-[2.5]" />
                </Link>
                <Link
                  className="inline-flex items-center justify-center gap-2.5 px-6 sm:px-7 py-3.5 bg-white text-black hover:bg-black hover:text-white font-headline text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl border-2 border-black shadow-[4px_4px_0px_#111111] hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-[2px_2px_0px_#111111] active:scale-95 transition-all whitespace-nowrap cursor-pointer text-center w-full sm:w-auto"
                  href="/#stage-01"
                >
                  <span>VIEW SHOWREEL</span>
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
            <span>PREV: HOME</span>
          </Link>
          <div className="text-xs font-mono font-bold uppercase bg-yellow-400 text-black px-3 py-1 rounded border border-black">
            SCENE 2 // ACTIVE
          </div>
          <Link
            className="inline-flex items-center gap-2 font-headline text-xs font-black uppercase tracking-wider text-black dark:text-zinc-200 hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
            href="/#stage-03"
          >
            <span>NEXT: SERVICES</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full py-6 bg-white dark:bg-[#0C0C10] border-t border-black/10 dark:border-zinc-800">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-4 font-body text-xs tracking-tight text-black dark:text-zinc-300">
          <div className="flex items-center gap-2">
            <span className="font-headline text-base font-bold text-black dark:text-white">ART WORK</span>
            <span className="text-black/40 dark:text-zinc-500">/</span>
            <span className="text-black/70 dark:text-zinc-400">Marketing Solutions</span>
          </div>
          <div className="text-black/60 dark:text-zinc-400 text-center">
            © 2025 Art Work - Marketing Solutions. Kinetic Stage Edition.
          </div>
          <nav className="flex items-center gap-6">
            <Link className="text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-150" href="/#stage-01">Home</Link>
            <Link className="text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-150" href="/company">Partner&apos;s</Link>
            <Link className="text-black dark:text-yellow-400 underline decoration-yellow-400 font-bold transition-colors duration-150" href="/why-us">
              Why Us
            </Link>
            <Link className="text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-150" href="/#stage-03">
              Services
            </Link>
            <Link className="text-black/80 dark:text-zinc-300 hover:text-black dark:hover:text-white font-bold transition-colors duration-150" href="/gallery">
              Gallery
            </Link>
            <Link className="text-black/60 dark:text-zinc-400 hover:text-black dark:hover:text-white transition-colors duration-150" href="/#brief-inquiry">
              Start a Brief
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
