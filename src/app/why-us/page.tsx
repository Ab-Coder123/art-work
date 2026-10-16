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
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { KineticBrushWord } from "@/components/cinematic/KineticBrushStroke";
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
  // Activate Lenis luxury virtual smooth scroll
  useSmoothScroll();

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
    <div className="bg-drafting-grid text-black font-body antialiased min-h-screen selection:bg-yellow-400 selection:text-black relative overflow-x-hidden">
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
      <header className="fixed top-0 left-0 w-full z-50 bg-white/90 backdrop-blur-md border-b border-black/10">
        <div className="flex justify-between items-center w-full px-6 py-3.5 max-w-7xl mx-auto">
          {/* Logo Anchor with Transparent Brand Image */}
          <Link
            href="/"
            className="group active:scale-95 transition-transform flex items-center"
            title="Art Work — Home"
            aria-label="Art Work — Home"
          >
            <div className="relative w-12 h-12 sm:w-14 sm:h-14 md:w-16 md:h-16 hover:rotate-3 transition-transform">
              <Image
                src="/assets/images/artwork_logo.png"
                alt="Art Work Logo"
                fill
                sizes="(max-width: 640px) 48px, (max-width: 768px) 56px, 64px"
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center space-x-8 font-headline text-sm uppercase tracking-wider font-bold">
            <Link
              href="/#stage-01"
              className="text-black/60 font-medium hover:text-black pb-1 transition-opacity duration-150 active:scale-95"
            >
              01 Manifesto
            </Link>
            <span className="text-black border-b-2 border-yellow-400 font-bold pb-1">
              02 Why Us
            </span>
            <Link
              href="/#stage-03"
              className="text-black/60 font-medium hover:text-black pb-1 transition-opacity duration-150 active:scale-95"
            >
              03 Services
            </Link>
            <Link
              href="/gallery"
              className="text-black hover:text-black font-headline font-black text-xs uppercase px-2 py-0.5 rounded bg-yellow-300 border border-black comic-shadow-sm hover:bg-yellow-400 transition-all active:scale-95"
            >
              ★ Gallery
            </Link>
            <Link
              href="/#stage-04"
              className="text-black/60 font-medium hover:text-black pb-1 transition-opacity duration-150 active:scale-95"
            >
              05 Contact
            </Link>
          </nav>

          {/* Trailing Action Button + Sound FX Controller */}
          <div className="flex items-center gap-3">
            <SoundToggle />
            <Link
              href="/#stage-04"
              className="inline-flex items-center gap-1.5 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-headline text-xs md:text-sm font-extrabold uppercase tracking-wider rounded-DEFAULT border-2 border-black comic-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all duration-150"
            >
              <span>Brief Inquiry</span>
              <ArrowRight className="w-4 h-4 stroke-[2.5]" />
            </Link>
          </div>
        </div>
      </header>

      {/* ================= VERTICAL STAGE SCROLLYTELLING INDICATOR (Fixed Right) ================= */}
      <aside className="fixed right-6 top-1/2 -translate-y-1/2 z-40 hidden lg:flex flex-col items-center gap-4">
        <div className="text-[9px] font-bold uppercase tracking-widest text-black/40 rotate-90 origin-bottom mb-4">
          Stage Cue
        </div>
        <Link className="group flex items-center justify-end w-28 gap-2" href="/#stage-01" title="Scene 01">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-headline text-[10px] font-extrabold tracking-wider uppercase text-black/60">
            01 MANIFESTO
          </span>
          <span className="w-7 h-7 rounded-full bg-white border border-black/30 flex items-center justify-center text-[10px] font-black text-black/60 group-hover:border-black">
            01
          </span>
        </Link>
        <div className="w-0.5 h-6 bg-black/20"></div>
        <div className="group flex items-center justify-end w-36 gap-2" title="Scene 02 Active">
          <span className="font-headline text-[10px] font-black tracking-wider uppercase text-black bg-yellow-400 px-2 py-0.5 rounded border border-black">
            02 WHY US
          </span>
          <span className="w-9 h-9 rounded-full bg-black text-yellow-400 border-2 border-yellow-400 ring-4 ring-yellow-400/40 flex items-center justify-center text-xs font-black shadow-md">
            02
          </span>
        </div>
        <div className="w-0.5 h-6 bg-black/20"></div>
        <Link className="group flex items-center justify-end w-28 gap-2" href="/#stage-03" title="Scene 03">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-headline text-[10px] font-extrabold tracking-wider uppercase text-black/60">
            03 SERVICES
          </span>
          <span className="w-7 h-7 rounded-full bg-white border border-black/30 flex items-center justify-center text-[10px] font-black text-black/60 group-hover:border-black">
            03
          </span>
        </Link>
        <div className="w-0.5 h-6 bg-black/20"></div>
        <Link className="group flex items-center justify-end w-28 gap-2" href="/#brief-inquiry" title="Scene 04">
          <span className="opacity-0 group-hover:opacity-100 transition-opacity font-headline text-[10px] font-extrabold tracking-wider uppercase text-black/60">
            04 CONTACT
          </span>
          <span className="w-7 h-7 rounded-full bg-white border border-black/30 flex items-center justify-center text-[10px] font-black text-black/60 group-hover:border-black">
            04
          </span>
        </Link>
      </aside>

      {/* ================= MAIN VIEWPORT STAGE ================= */}
      <main className="relative z-10 pt-24 pb-20 max-w-6xl mx-auto px-6 sm:px-8 xl:pr-14">
        {/* Technical Header Ribbon */}
        <div className="flex flex-wrap items-center justify-between border-b-2 border-black pb-3 mb-8 text-xs font-mono uppercase tracking-widest text-black/70">
          <div className="flex items-center gap-3">
            <span className="px-2 py-0.5 bg-black text-white font-black text-[10px]">SCENE // 02</span>
            <span className="font-bold">AGENCY PROPOSITION &amp; EXPERIENTIAL PROOF</span>
          </div>
          <div className="hidden sm:flex items-center gap-4">
            <span>CAD: REV-2025.02</span>
            <span>•</span>
            <span>STAGE: PINNED PERSPECTIVE</span>
            <span>•</span>
            <span className="text-black font-extrabold">STATUS: 100% UNAPOLOGETIC</span>
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
                className="relative bg-white border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 text-[11px] font-bold tracking-tight"
              >
                <div className="washi-tape"></div>
                <TrendingUp className="w-3.5 h-3.5 text-emerald-600 stroke-[2.5]" />
                <span>
                  PERFORMANCE MARKETING{" "}
                  <strong className="bg-yellow-300 px-1 rounded">(+340% ROI)</strong>
                </span>
              </motion.div>

              <motion.div
                initial={{ opacity: 0, y: -10, rotate: 4 }}
                animate={{ opacity: 1, y: 0, rotate: 2 }}
                transition={{ duration: 0.4, delay: 0.25 }}
                className="bg-yellow-300 border-2 border-black px-3 py-1 rounded-lg shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 text-[11px] font-extrabold uppercase"
              >
                <Sparkles className="w-3.5 h-3.5 text-black fill-yellow-500" />
                <span>CONTENT CREATION</span>
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
              <div className="font-brush text-7xl sm:text-8xl md:text-9xl text-black leading-none tracking-tight">
                WHY
              </div>

              {/* Row 2: "US?" with Canary Yellow highlighter swipe backing */}
              <div className="relative inline-block mt-1 font-brush text-7xl sm:text-8xl md:text-9xl text-black leading-none brush-swipe-bg">
                <span className="relative z-10 drop-shadow-[2px_3px_0px_rgba(255,255,255,0.8)]">
                  US?
                </span>
              </div>

              {/* Hand-drawn curved doodle arrows pointing to the headline */}
              <div className="absolute -bottom-6 right-0 transform translate-x-12 translate-y-2 pointer-events-none hidden sm:block">
                <svg
                  className="w-16 h-14 text-black"
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
                ★ BRANDING
              </motion.div>

              {/* Sticker: CONTENT STRATEGY */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="relative bg-white text-black border-2 border-dashed border-black font-headline text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded rotate-[1.5deg] shadow-[2px_2px_0px_#FACC15] cursor-pointer"
              >
                CONTENT STRATEGY // 360°
              </motion.div>

              {/* Sticker: DESIGNING */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="relative bg-yellow-300 text-black border-2 border-black font-headline text-xs font-black uppercase tracking-wide px-3 py-1.5 rounded rotate-[-1deg] shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 cursor-pointer"
              >
                <PenTool className="w-3.5 h-3.5 text-black" />
                <span>DESIGNING</span>
              </motion.div>

              {/* Sticker: WEB DEVELOPMENT */}
              <motion.div
                whileHover={{ scale: 1.05, rotate: 0 }}
                className="relative bg-white text-black border-2 border-black font-headline text-xs font-bold uppercase tracking-wider px-3 py-1.5 rounded rotate-[2deg] shadow-[2px_2px_0px_#111111] flex items-center gap-1.5 cursor-pointer"
              >
                <span>WEB DEV</span>
                <ArrowUpRight className="w-3.5 h-3.5 stroke-[2.5] text-black" />
              </motion.div>
            </div>

            {/* Editorial Subheading */}
            <h2 className="font-headline text-2xl sm:text-3xl md:text-4xl font-black text-black leading-tight tracking-tight mb-4">
              Because your brand deserves more than just posts,{" "}
              <KineticBrushWord variant="double" color="#dcb858" strokeWidth={2.4}>
                it deserves a strategy.
              </KineticBrushWord>
            </h2>

            {/* High-Impact Body Copy */}
            <p className="font-body text-base sm:text-lg text-black/80 leading-relaxed max-w-xl mb-6">
              From monumental stadium touring architecture and bespoke exhibition booths to viral
              kinetic content, we engineer experiential marketing that leaves competitors invisible.
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
                className="inline-flex items-center gap-2 px-5 py-3 bg-white hover:bg-black hover:text-white text-black font-headline text-sm font-bold uppercase tracking-wider rounded-xl border-2 border-black hover-brutal-clean active:scale-95 transition-all shadow-[2px_2px_0px_#111111]"
                href="#matrix"
              >
                <span>View Live Capabilities</span>
                <ArrowUpRight className="w-4 h-4 stroke-[2.5]" />
              </a>
            </div>

            {/* Metric Tick Banner */}
            <div className="mt-8 pt-5 border-t border-black/10 flex items-center gap-6 text-xs font-mono text-black/60">
              <div className="flex items-center gap-2">
                <span className="w-2.5 h-2.5 rounded-full bg-green-500"></span>
                <span>450+ ARENA STAGES STAGED</span>
              </div>
              <div>•</div>
              <div>99.4% DMX CUE ACCURACY</div>
            </div>
          </div>

          {/* RIGHT COLUMN: CAD Drafting Easel & Real Presentation Blueprint Illustration */}
          <div className="lg:col-span-5 relative mt-4 lg:mt-0">
            <div className="relative bg-white border-2 border-black rounded-2xl p-4 sm:p-5 shadow-[6px_6px_0px_#111111]">
              {/* Top Technical Ribbon */}
              <div className="flex items-center justify-between border-b-2 border-black pb-3 mb-4 font-mono text-[11px] text-black">
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
              <div className="relative overflow-hidden rounded-xl border-2 border-black bg-white group aspect-[4/3]">
                <Image
                  src="/assets/images/stitch_why_us_easel.png"
                  alt="Art Work Stage 02 architectural presentation easel illustration with kinetic lighting rigs, custom exhibition booth structures, and creative director blueprint"
                  fill
                  sizes="(max-width: 1024px) 100vw, 40vw"
                  className="object-cover transform group-hover:scale-105 transition-transform duration-500"
                />
                {/* Live Viewport Overlay Stamp */}
                <div className="absolute bottom-3 left-3 bg-white/95 backdrop-blur-sm border-2 border-black px-3 py-1.5 rounded-lg flex items-center gap-2 text-xs font-mono font-bold z-10 shadow-[2px_2px_0px_#111111]">
                  <CheckCircle2 className="w-4 h-4 text-emerald-600 fill-emerald-100 stroke-[2.5]" />
                  <span>100% TAILORED ENGINEERING</span>
                </div>
              </div>

              {/* Lower Drafting Specs Grid */}
              <div className="mt-4 pt-3 border-t border-black/15 grid grid-cols-2 gap-2 text-[10px] font-mono uppercase text-black/70">
                <div>
                  RIGGING TOLERANCE: <strong className="text-black font-black">0.05 MM</strong>
                </div>
                <div>
                  CNC FABRICATION: <strong className="text-black font-black">GERMAN SPEC</strong>
                </div>
                <div>
                  COLOR ACCURACY: <strong className="text-black font-black">PANTONE 100%</strong>
                </div>
                <div>
                  STATUS: <strong className="text-black font-black">READY FOR CUE</strong>
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
          </div>
        </div>

        {/* ================= PROOF & METRICS TICKER ================= */}
        <section className="mb-24 py-6 border-y-2 border-black bg-yellow-400/20 rounded-2xl px-6">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-6 text-center">
            <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#111111]">
              <div className="font-brush text-3xl md:text-4xl text-black">450+</div>
              <div className="font-headline text-xs font-black uppercase tracking-wider text-black/70 mt-1">
                Arena Stages Delivered
              </div>
            </div>
            <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#111111]">
              <div className="font-brush text-3xl md:text-4xl text-black">1.2M+</div>
              <div className="font-headline text-xs font-black uppercase tracking-wider text-black/70 mt-1">
                Live Spectators Reached
              </div>
            </div>
            <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#111111]">
              <div className="font-brush text-3xl md:text-4xl text-black">99.4%</div>
              <div className="font-headline text-xs font-black uppercase tracking-wider text-black/70 mt-1">
                Live Cue Accuracy
              </div>
            </div>
            <div className="p-4 bg-white border-2 border-black rounded-xl shadow-[4px_4px_0px_#111111]">
              <div className="font-brush text-3xl md:text-4xl text-black">0%</div>
              <div className="font-headline text-xs font-black uppercase tracking-wider text-black/70 mt-1">
                Generic Templates
              </div>
            </div>
          </div>
        </section>

        {/* ================= SCENE 2 INTERACTIVE CAPABILITIES & EVENT MATRIX (Bento Grid) ================= */}
        <section className="mb-24" id="matrix">
          <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-12">
            <div>
              <div className="inline-flex items-center gap-2 px-3 py-1 bg-black text-yellow-400 font-mono text-xs font-black rounded mb-3">
                <LayoutDashboard className="w-3.5 h-3.5 text-yellow-400 stroke-[2.5]" />
                EXPERIENTIAL MATRIX // STAGE 02
              </div>
              <h3 className="font-headline text-3xl sm:text-4xl md:text-5xl font-black text-black tracking-tight uppercase">
                Core Physical &amp; Experiential{" "}
                <KineticBrushWord variant="wave" color="#dcb858" strokeWidth={2.6}>
                  Capabilities
                </KineticBrushWord>
              </h3>
            </div>
            <p className="font-body text-sm text-black/70 max-w-md">
              Every discipline is owned in-house. From acoustic calculations to millimetric CNC stage
              craft, we merge brutal strategic clarity with theater-grade engineering.
            </p>
          </div>

          {/* Bento Grid (4 Cards) */}
          <div className="grid grid-cols-1 md:grid-cols-2 gap-8">
            {/* CARD 01 */}
            <div className="bg-white border-2 border-black rounded-2xl p-8 hover-brutal-lift flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-yellow-400/20 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-black text-white font-mono text-xs font-black rounded">
                    SPEC // 01
                  </span>
                  <Lightbulb className="w-7 h-7 text-black stroke-[1.75]" />
                </div>
                <h4 className="font-headline text-2xl font-black text-black mb-3 group-hover:text-yellow-600 transition-colors">
                  0% Cookie-Cutter Posts — 100% Unapologetic Strategy
                </h4>
                <p className="font-body text-sm text-black/70 mb-6 leading-relaxed">
                  We eliminate fluff content and vanity metrics. We construct foundational brand
                  positioning, narrative hooks, and commercial distribution pipelines that force your
                  market to pay attention.
                </p>
              </div>
              <div className="border-t-2 border-black/10 pt-4">
                <ul className="space-y-2 text-xs font-mono font-bold text-black">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    Brand Positioning &amp; Kinetic Narrative Architecture
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    Multi-Channel Commercial Go-to-Market Masterplans
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    High-Conversion Acquisition &amp; Retention Modeling
                  </li>
                </ul>
              </div>
            </div>

            {/* CARD 02 */}
            <div className="bg-white border-2 border-black rounded-2xl p-8 hover-brutal-lift flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-yellow-400/20 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-black text-white font-mono text-xs font-black rounded">
                    SPEC // 02
                  </span>
                  <Store className="w-7 h-7 text-black stroke-[1.75]" />
                </div>
                <h4 className="font-headline text-2xl font-black text-black mb-3 group-hover:text-yellow-600 transition-colors">
                  Exhibitions &amp; Bespoke Booth Architecture
                </h4>
                <p className="font-body text-sm text-black/70 mb-6 leading-relaxed">
                  Grade-A exhibition dominance for global conventions like CES, Gitex, Arab Health,
                  and MWC. Custom millwork, double-decker cantilever VIP meeting lounges, and
                  optimized foot-traffic routing.
                </p>
              </div>
              <div className="border-t-2 border-black/10 pt-4">
                <ul className="space-y-2 text-xs font-mono font-bold text-black">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    Custom German-Spec CNC Millwork &amp; Structural Fabrication
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    Double-Decker VIP Suites with Acoustic Sound Dampening
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    Interactive Tactile Product Demonstration Islands
                  </li>
                </ul>
              </div>
            </div>

            {/* CARD 03 */}
            <div className="bg-white border-2 border-black rounded-2xl p-8 hover-brutal-lift flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-yellow-400/20 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-black text-white font-mono text-xs font-black rounded">
                    SPEC // 03
                  </span>
                  <Layers className="w-7 h-7 text-black stroke-[1.75]" />
                </div>
                <h4 className="font-headline text-2xl font-black text-black mb-3 group-hover:text-yellow-600 transition-colors">
                  Massive Touring Stages &amp; Sound Engineering
                </h4>
                <p className="font-body text-sm text-black/70 mb-6 leading-relaxed">
                  Stadium and arena caliber temporary architecture. Certified load-bearing trusses,
                  moving head fixture plots, sub-bass phased arrays, and synchronized DMX kinetic
                  hoists built for touring stamina.
                </p>
              </div>
              <div className="border-t-2 border-black/10 pt-4">
                <ul className="space-y-2 text-xs font-mono font-bold text-black">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    DMX Automated Kinetic Light Rigs &amp; Laser Vector Systems
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    Line-Array Line-of-Sight Acoustic Engineering
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    Redundant Arena-Grade Power Distribution &amp; Backup Generators
                  </li>
                </ul>
              </div>
            </div>

            {/* CARD 04 */}
            <div className="bg-white border-2 border-black rounded-2xl p-8 hover-brutal-lift flex flex-col justify-between relative overflow-hidden group">
              <div className="absolute -right-10 -bottom-10 w-36 h-36 bg-yellow-400/20 rounded-full group-hover:scale-150 transition-transform duration-500 pointer-events-none"></div>
              <div>
                <div className="flex items-center justify-between mb-6">
                  <span className="px-3 py-1 bg-black text-white font-mono text-xs font-black rounded">
                    SPEC // 04
                  </span>
                  <Monitor className="w-7 h-7 text-black stroke-[1.75]" />
                </div>
                <h4 className="font-headline text-2xl font-black text-black mb-3 group-hover:text-yellow-600 transition-colors">
                  Ultra-High Refresh LED &amp; Audiovisual Mastery
                </h4>
                <p className="font-body text-sm text-black/70 mb-6 leading-relaxed">
                  Zero-latency visual immersion. Seamless 1.5mm pixel pitch curved video walls,
                  transparent holographic mesh panels, and disguise media server clusters for
                  real-time generative stage graphics.
                </p>
              </div>
              <div className="border-t-2 border-black/10 pt-4">
                <ul className="space-y-2 text-xs font-mono font-bold text-black">
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    7680Hz Ultra-High Refresh Rates (Broadcast &amp; Camera Safe)
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    Real-Time Notch / TouchDesigner Generative Visual Pipelines
                  </li>
                  <li className="flex items-center gap-2">
                    <CheckCircle2 className="w-3.5 h-3.5 text-yellow-500 fill-yellow-400/20 stroke-black shrink-0" />
                    Holographic Transparent Mesh Stages for 3D Illusions
                  </li>
                </ul>
              </div>
            </div>
          </div>
        </section>

        {/* ================= STAGE 02 INTERACTIVE BRIEF CALLOUT ================= */}
        <section
          className="mb-20 bg-yellow-400 border-2 border-black rounded-2xl p-6 sm:p-10 shadow-[8px_8px_0px_#111111] relative overflow-hidden"
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

        {/* STAGE SCROLL NAVIGATION CONTROLS */}
        <div className="flex items-center justify-between border-t-2 border-black pt-6 mb-12">
          <Link
            className="inline-flex items-center gap-2 font-headline text-xs font-black uppercase tracking-wider text-black/60 hover:text-black transition-colors"
            href="/#stage-01"
          >
            <ArrowLeft className="w-3.5 h-3.5 stroke-[2.5]" />
            <span>PREV: 01 MANIFESTO</span>
          </Link>
          <div className="text-xs font-mono font-bold uppercase bg-yellow-400 px-3 py-1 rounded border border-black">
            SCENE 2 // ACTIVE
          </div>
          <Link
            className="inline-flex items-center gap-2 font-headline text-xs font-black uppercase tracking-wider text-black hover:text-yellow-600 transition-colors"
            href="/#stage-03"
          >
            <span>NEXT: 03 SERVICES</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </Link>
        </div>
      </main>

      {/* ================= FOOTER ================= */}
      <footer className="w-full py-6 bg-white border-t border-black/10">
        <div className="flex flex-col md:flex-row justify-between items-center px-6 max-w-7xl mx-auto gap-4 font-body text-xs tracking-tight text-black">
          <div className="flex items-center gap-2">
            <span className="font-headline text-base font-bold text-black">ART WORK</span>
            <span className="text-black/40">/</span>
            <span className="text-black/70">Marketing Solutions</span>
          </div>
          <div className="text-black/60 text-center">
            © 2025 Art Work - Marketing Solutions. Kinetic Stage Edition.
          </div>
          <nav className="flex items-center gap-6">
            <Link className="text-black/60 hover:text-black transition-colors duration-150" href="/#stage-01">
              Manifesto
            </Link>
            <Link className="text-black underline decoration-yellow-400 font-bold transition-colors duration-150" href="/why-us">
              Why Us
            </Link>
            <Link className="text-black/60 hover:text-black transition-colors duration-150" href="/#stage-03">
              Services
            </Link>
            <Link className="text-black/80 hover:text-black font-bold transition-colors duration-150" href="/gallery">
              Gallery
            </Link>
            <Link className="text-black/60 hover:text-black transition-colors duration-150" href="/#brief-inquiry">
              Start a Brief
            </Link>
          </nav>
        </div>
      </footer>
    </div>
  );
}
