"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
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

export const WhyUsStage: React.FC = () => {
  return (
    <section className="relative w-full max-w-6xl mx-auto px-6 sm:px-8 py-16" id="stage-02">
      

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
                <path d="M 4,36 L 50,36 L 46,14 L 32,24 L 27,6 L 22,24 L 8,14 Z" fill="var(--color-primary-yellow, #dcb858)"></path>
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
              className="relative bg-white text-black border-2 border-dashed border-black font-headline text-xs font-black uppercase tracking-wider px-3 py-1.5 rounded rotate-[1.5deg] shadow-[2px_2px_0px_var(--color-primary-yellow,#dcb858)] cursor-pointer"
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
            <span className="highlighter-yellow font-black">it deserves a strategy.</span>
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

            {/* Sticky Note Taped on Top Right */}
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
              <span className="highlighter-yellow">Capabilities</span>
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
              LET&apos;S DRAFT YOUR MASTERSTAGE BRIEF.
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
          <span>PREV: HOME</span>
        </Link>
        <div className="text-xs font-mono font-bold uppercase bg-yellow-400 px-3 py-1 rounded border border-black">
          SCENE 2 // ACTIVE
        </div>
        <Link
          className="inline-flex items-center gap-2 font-headline text-xs font-black uppercase tracking-wider text-black hover:text-yellow-600 transition-colors"
          href="/#stage-03"
        >
          <span>NEXT: SERVICES</span>
          <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
        </Link>
      </div>
    </section>
  );
};
