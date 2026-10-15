"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import Image from "next/image";
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
} from "lucide-react";

type StageId = "stage-01" | "stage-02" | "stage-03" | "stage-04";

/* =========================================================================
   SCENE 01: HERO / MANIFESTO COMPONENT
   ========================================================================= */
interface ManifestoContentProps {
  onExploreShowreel: () => void;
  onViewCapabilities: () => void;
}

function ManifestoContent({ onExploreShowreel, onViewCapabilities }: ManifestoContentProps) {
  return (
    <div className="w-full max-w-6xl mx-auto py-2 sm:py-3 flex flex-col justify-center my-auto">
      {/* Top Energy Badge & Comic Stickers */}
      <div className="flex flex-wrap items-center justify-between gap-2 mb-2 sm:mb-3">
        <div className="inline-flex items-center gap-1.5 border border-black bg-white px-3 py-0.5 rounded-full comic-shadow-sm font-headline text-[10px] font-black uppercase tracking-wider">
          <span className="text-yellow-500 font-black">★</span>
          <span>MARKETING SOLUTIONS FOR KINETIC BRANDS</span>
          <span className="bg-yellow-400 text-black px-1.5 py-0.2 rounded-full font-bold ml-1 text-[9px]">
            EDITION 2025
          </span>
        </div>

        {/* Sticky Note Callout 01 */}
        <div className="relative -rotate-2 hover:rotate-0 transition-transform duration-200">
          <div className="bg-yellow-200 border border-black px-2.5 py-0.5 text-[10px] font-headline font-bold text-black comic-shadow-sm flex items-center gap-1.5">
            <Lightbulb className="w-3.5 h-3.5 text-black stroke-[2]" />
            <span>STICKY_NOTE_01.CAD: &quot;Zero cookie-cutter templates.&quot;</span>
          </div>
          <div className="absolute -top-1.5 left-4 w-6 h-2 bg-white/70 border border-black/40 rotate-2"></div>
        </div>
      </div>

      {/* Hero Typography Section */}
      <div className="relative mb-3 sm:mb-4 max-w-4xl">
        <h1 className="font-headline font-black text-3xl sm:text-4xl md:text-5xl lg:text-5xl xl:text-6xl tracking-tight leading-[0.98] text-black">
          CREATIVE IDEAS. <br />
          <span className="relative inline-block mt-1 sm:mt-1.5">
            {/* Canary Yellow Ink Splash Backdrop */}
            <motion.span
              initial={{ scaleX: 0, originX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 0.5, delay: 0.15, ease: "easeOut" }}
              className="absolute -inset-1 sm:-inset-1.5 bg-yellow-400 -rotate-1 rounded-DEFAULT -z-10 border-2 border-black comic-shadow"
            ></motion.span>
            <span className="text-black relative z-10 px-1 sm:px-2">REAL IMPACT.</span>
            {/* Hand-drawn SVG Highlighter Scribble Underline */}
            <svg
              className="absolute -bottom-3 left-0 w-full h-4 text-black pointer-events-none"
              fill="none"
              preserveAspectRatio="none"
              viewBox="0 0 400 20"
            >
              <motion.path
                d="M 5,12 Q 100,2 200,14 T 395,8"
                stroke="currentColor"
                strokeLinecap="round"
                strokeWidth="5"
                initial={{ pathLength: 0 }}
                animate={{ pathLength: 1 }}
                transition={{ duration: 0.8, delay: 0.35, ease: "easeInOut" }}
              />
            </svg>
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
            <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 text-black font-headline font-black text-[7px] uppercase leading-tight -rotate-6">
              <span>100% RAW</span>
              <span className="bg-black text-white px-1 py-0.2 rounded-sm text-[6px]">UNAPOLOGETIC</span>
              <span>CREATIVE</span>
            </div>
          </div>
        </div>
      </div>

      {/* Action Cluster & Team Collective Art with Magnetic Buttons */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 sm:gap-6 items-center">
        <div className="lg:col-span-5 space-y-2.5 sm:space-y-3">
          <p className="font-body text-xs sm:text-sm text-black/80 max-w-sm leading-relaxed">
            We are{" "}
            <strong className="text-black font-bold underline decoration-yellow-400 decoration-2">
              Art Work
            </strong>
            : an interdisciplinary marketing and experiential design collective translating
            bold cultural visions into arena-scale reality.
          </p>

          <div className="flex flex-wrap items-center gap-2.5 pt-0.5">
            <MagneticButton soundType="pop">
              <button
                onClick={onExploreShowreel}
                className="relative group inline-flex items-center gap-1.5 bg-black text-white hover:bg-yellow-400 hover:text-black font-headline font-extrabold text-xs px-4 py-2 rounded-DEFAULT border-2 border-black comic-shadow transition-all duration-200 hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none cursor-pointer"
              >
                <span>EXPLORE SHOWREEL</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </MagneticButton>

            <MagneticButton soundType="click">
              <button
                onClick={onViewCapabilities}
                className="inline-flex items-center gap-1 bg-white text-black hover:bg-black hover:text-white font-headline font-bold text-xs px-3.5 py-2 rounded-DEFAULT border-2 border-black comic-shadow-sm transition-all duration-150 cursor-pointer"
              >
                <span>VIEW CAPABILITIES</span>
                <ArrowDown className="w-3.5 h-3.5 stroke-[2.5]" />
              </button>
            </MagneticButton>
          </div>

          {/* Milestone Badges */}
          <div className="grid grid-cols-3 gap-2 pt-1 max-w-sm">
            <div className="border border-black bg-white p-2 rounded-DEFAULT comic-shadow-sm text-center">
              <div className="font-headline font-black text-base text-black">450+</div>
              <div className="text-[8px] font-headline font-bold text-black/70 uppercase">
                Arena Shows
              </div>
            </div>
            <div className="border border-black bg-white p-2 rounded-DEFAULT comic-shadow-sm text-center">
              <div className="font-headline font-black text-base text-black">99.4%</div>
              <div className="text-[8px] font-headline font-bold text-black/70 uppercase">
                Cue Accuracy
              </div>
            </div>
            <div className="border border-black bg-white p-2 rounded-DEFAULT comic-shadow-sm text-center">
              <div className="font-headline font-black text-base text-black">1.2M+</div>
              <div className="text-[8px] font-headline font-bold text-black/70 uppercase">
                Live Reach
              </div>
            </div>
          </div>
        </div>

        {/* Right Visual: Collective Canvas */}
        <div className="lg:col-span-7 relative">
          <div className="border-3 border-black bg-white rounded-lg p-2.5 comic-shadow relative group">
            <div className="absolute -top-2 left-6 w-10 h-4 bg-yellow-300/80 border border-black/30 -rotate-3 z-30"></div>
            <div className="absolute -top-2 right-6 w-10 h-4 bg-yellow-300/80 border border-black/30 rotate-2 z-30"></div>

            <div className="flex items-center justify-between pb-1.5 mb-1.5 border-b border-black/10 text-[10px] font-headline font-bold">
              <div className="flex items-center gap-1">
                <span className="w-2 h-2 rounded-full bg-red-500 border border-black"></span>
                <span className="w-2 h-2 rounded-full bg-yellow-400 border border-black"></span>
                <span className="w-2 h-2 rounded-full bg-green-500 border border-black"></span>
                <span className="ml-1 text-black/60 font-mono text-[10px]">
                  STUDIO_COLLECTIVE_CANVAS.V4
                </span>
              </div>
              <div className="flex items-center gap-1 text-[10px]">
                <Paintbrush className="w-3.5 h-3.5 text-black" />
                <span>INK_LAYER_ACTIVE</span>
              </div>
            </div>

            <div className="relative overflow-hidden rounded border border-black bg-white aspect-[16/9] max-h-[200px] lg:max-h-[220px] xl:max-h-[260px] flex items-center justify-center">
              <Image
                src="/assets/images/stitch_hero_collective.png"
                alt="Art Work Creative Marketing Studio Collective"
                fill
                priority
                sizes="(max-width: 1024px) 100vw, 45vw"
                className="object-cover"
              />
            </div>
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 02: WHY US / BENTO & BLUEPRINT COMPONENT
   ========================================================================= */
function WhyUsContent() {
  return (
    <div className="w-full max-w-6xl mx-auto py-2 sm:py-3 flex flex-col justify-center my-auto">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2 mb-3 pb-2 border-b-2 border-black">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-black px-2.5 py-0.5 border border-black comic-shadow-sm text-[10px] font-headline font-black uppercase mb-1">
            <span>02 WHY ART WORK</span>
          </div>
          <h2 className="font-headline font-black text-xl sm:text-2xl lg:text-3xl text-black tracking-tight">
            ENGINEERED FOR STAGE &amp; SCALE.
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <a
            href="/why-us"
            className="inline-flex items-center gap-1.5 font-headline font-black text-[11px] uppercase bg-black text-white hover:bg-yellow-400 hover:text-black px-3 py-1.5 rounded border border-black comic-shadow-sm transition-all"
          >
            <span>EXPLORE FULL WHY US</span>
            <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
          </a>
        </div>
      </div>

      {/* 3 Bento Cards (Compact) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-3.5 mb-3">
        <div className="border-2 border-black p-3.5 rounded-lg bg-white comic-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-DEFAULT bg-yellow-400 border border-black flex items-center justify-center font-headline font-black text-xs comic-shadow-sm">
                01
              </span>
              <Layers className="w-5 h-5 text-black stroke-[1.75]" />
            </div>
            <h3 className="font-headline font-black text-sm sm:text-base text-black mb-0.5 uppercase">
              Arena &amp; Stage Scenography
            </h3>
            <p className="font-body text-[11px] text-black/75 leading-snug">
              Stage blueprints, LED mapping rigs, lighting cue choreographies, and large-format structural storytelling.
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-black/10 flex items-center justify-between text-[10px] font-headline font-bold">
            <span className="bg-black text-white px-1.5 py-0.2 rounded">PRODUCTION READY</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-black" />
          </div>
        </div>

        <div className="border-2 border-black p-3.5 rounded-lg bg-yellow-50 comic-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-DEFAULT bg-yellow-400 border border-black flex items-center justify-center font-headline font-black text-xs comic-shadow-sm">
                02
              </span>
              <Sparkles className="w-5 h-5 text-black fill-yellow-400" />
            </div>
            <h3 className="font-headline font-black text-sm sm:text-base text-black mb-0.5 uppercase">
              Dynamic Motion Systems
            </h3>
            <p className="font-body text-[11px] text-black/75 leading-snug">
              Kinetic typography, 3D broadcast packages, real-time reactive shaders, and frame-accurate visual sync.
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-black/10 flex items-center justify-between text-[10px] font-headline font-bold">
            <span className="bg-yellow-400 text-black border border-black px-1.5 py-0.2 rounded">
              60 FPS FIDELITY
            </span>
            <Zap className="w-3.5 h-3.5 text-black fill-yellow-400" />
          </div>
        </div>

        <div className="border-2 border-black p-3.5 rounded-lg bg-white comic-shadow flex flex-col justify-between">
          <div>
            <div className="flex items-center justify-between mb-2">
              <span className="w-6 h-6 rounded-DEFAULT bg-yellow-400 border border-black flex items-center justify-center font-headline font-black text-xs comic-shadow-sm">
                03
              </span>
              <Palette className="w-5 h-5 text-black stroke-[1.75]" />
            </div>
            <h3 className="font-headline font-black text-sm sm:text-base text-black mb-0.5 uppercase">
              Brand Architecture
            </h3>
            <p className="font-body text-[11px] text-black/75 leading-snug">
              Custom hand-drawn vector doodle suites, physical merch design, stage passes, and total campaign cohesion.
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-black/10 flex items-center justify-between text-[10px] font-headline font-bold">
            <span className="bg-black text-white px-1.5 py-0.2 rounded">TACTILE &amp; DIGITAL</span>
            <Paintbrush className="w-3.5 h-3.5 text-black" />
          </div>
        </div>
      </div>

      {/* Blueprint Showcase Card */}
      <div className="border-3 border-black rounded-lg p-3 bg-white comic-shadow relative">
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-3 items-center">
          <div className="lg:col-span-6 space-y-1">
            <div className="inline-flex items-center gap-1 text-[10px] font-headline font-black uppercase text-black bg-yellow-300 px-1.5 py-0.2 rounded border border-black">
              <Compass className="w-3.5 h-3.5 text-black" />
              <span>BLUEPRINT &amp; STAGE PREVIEW</span>
            </div>
            <h3 className="font-headline font-black text-base sm:text-lg text-black">
              FROM SKETCHBOARD TO LIVE VENUE IN 72 HOURS.
            </h3>
            <p className="font-body text-[11px] text-black/80">
              We prototype spatial structures, truss configurations, projector lines of sight, and booth flows in real-time.
            </p>
          </div>
          <div className="lg:col-span-6 border border-black rounded overflow-hidden aspect-[16/7] max-h-[140px] bg-white relative">
            <Image
              src="/assets/images/stitch_blueprint_stage.png"
              alt="Stage Architecture Blueprints and Scenography"
              fill
              sizes="(max-width: 1024px) 100vw, 40vw"
              className="object-cover"
            />
          </div>
        </div>
      </div>
    </div>
  );
}

/* =========================================================================
   SCENE 03: 3D CAPABILITIES MATRIX COMPONENT
   ========================================================================= */
function ServicesContent() {
  return (
    <div className="w-full max-w-6xl mx-auto py-2 flex flex-col justify-center my-auto">
      <Capabilities3DMatrix />
    </div>
  );
}

/* =========================================================================
   SCENE 04: CONTACT & BRIEF INQUIRY COMPONENT
   ========================================================================= */
function ContactContent() {
  return (
    <div className="w-full max-w-6xl mx-auto py-2 sm:py-3 flex flex-col justify-center my-auto">
      <div className="border-3 border-black bg-white rounded-lg p-4 sm:p-5 comic-shadow relative">
        <div className="absolute -top-3 left-1/2 -translate-x-1/2 bg-yellow-300 border border-black px-4 py-0.5 font-headline font-black text-[10px] uppercase tracking-widest comic-shadow-sm -rotate-1 z-20">
          STAGE 04 // LAUNCH YOUR CAMPAIGN
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pt-1">
          <div className="lg:col-span-5 space-y-2.5">
            <h2 className="font-headline font-black text-xl sm:text-2xl text-black tracking-tight leading-none">
              LET’S INK SOMETHING{" "}
              <span className="bg-yellow-400 px-1.5 underline decoration-black">HISTORIC.</span>
            </h2>
            <p className="font-body text-xs text-black/80">
              Whether you need a dynamic stage package for an arena tour or an unforgettable brand identity, our sketchpad is open.
            </p>

            <div className="border border-black rounded p-2 bg-yellow-50 relative">
              <div className="aspect-[16/9] max-h-[130px] rounded overflow-hidden border border-black bg-white relative">
                <Image
                  src="/assets/images/stitch_thinker_intake.png"
                  alt="Creative Chief on call"
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover"
                />
              </div>
              <div className="mt-1 text-center text-[9px] font-headline font-bold text-black/70">
                DIRECT INTAKE // CREATIVE CHIEF ON-CALL
              </div>
            </div>

            <div className="space-y-1 text-[11px] font-headline font-bold">
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-yellow-400 border border-black flex items-center justify-center font-bold text-[10px]">
                  @
                </span>
                <span>studio@artwork-solutions.stage</span>
              </div>
              <div className="flex items-center gap-1.5">
                <span className="w-5 h-5 rounded-full bg-yellow-400 border border-black flex items-center justify-center font-bold text-[10px]">
                  📍
                </span>
                <span>404 Kinetic Way, Arts District</span>
              </div>
            </div>
          </div>

          <div className="lg:col-span-7 bg-white border border-black rounded-lg p-3.5 comic-shadow-sm">
            <form
              className="space-y-2.5"
              onSubmit={(e) => {
                e.preventDefault();
                soundFX.playPop();
                alert("Brief submitted to Art Work! Our stage director will be in touch shortly.");
              }}
            >
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-2.5">
                <div>
                  <label className="block font-headline font-bold text-[10px] uppercase mb-0.5 text-black">
                    Your Name / Title
                  </label>
                  <input
                    className="w-full border border-black rounded p-1.5 font-body text-xs focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="Alex Mercer, Head of Brand"
                    required
                    type="text"
                  />
                </div>
                <div>
                  <label className="block font-headline font-bold text-[10px] uppercase mb-0.5 text-black">
                    Email Address
                  </label>
                  <input
                    className="w-full border border-black rounded p-1.5 font-body text-xs focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                    placeholder="alex@company.com"
                    required
                    type="email"
                  />
                </div>
              </div>

              <div>
                <label className="block font-headline font-bold text-[10px] uppercase mb-0.5 text-black">
                  The Core Brief / Vision Constraints
                </label>
                <textarea
                  className="w-full border border-black rounded p-1.5 font-body text-xs focus:ring-2 focus:ring-yellow-400 focus:outline-none"
                  placeholder="Describe your arena, product launch, or brand evolution requirements..."
                  required
                  rows={2}
                ></textarea>
              </div>

              <div className="flex items-center justify-between pt-0.5">
                <span className="text-[9px] font-body text-black/60">
                  ⚡ 24h rapid response standard
                </span>
                <MagneticButton soundType="pop">
                  <button
                    className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-black hover:text-white text-black font-headline font-black text-xs px-4 py-2 rounded border border-black comic-shadow-sm active:scale-95 transition-all cursor-pointer"
                    type="submit"
                  >
                    <span>DISPATCH BRIEF</span>
                    <Send className="w-3.5 h-3.5 stroke-[2.5]" />
                  </button>
                </MagneticButton>
              </div>
            </form>
          </div>
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
    <footer className="w-full py-2.5 bg-white/95 text-black border-t border-black/10 z-30">
      <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 max-w-7xl mx-auto text-[10px] text-black/70 font-mono gap-2 sm:gap-0">
        <div>© 2025 Art Work - Marketing Solutions. Pinned Kinetic Stage Engine.</div>
        <div className="flex items-center gap-3 font-headline font-bold">
          <button onClick={() => scrollToStage("stage-01")} className="hover:text-black hover:underline cursor-pointer">
            01 MANIFESTO
          </button>
          <button onClick={() => scrollToStage("stage-02")} className="hover:text-black hover:underline cursor-pointer">
            02 WHY US
          </button>
          <button onClick={() => scrollToStage("stage-03")} className="hover:text-black hover:underline cursor-pointer">
            03 SERVICES
          </button>
          <button onClick={() => scrollToStage("stage-04")} className="hover:text-black hover:underline cursor-pointer">
            04 CONTACT
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
  const [scrollProgress, setScrollProgress] = useState(0);
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
      if (now - lastMove > 50) {
        createSparkle(e.clientX, e.clientY);
        lastMove = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove);

    // SCROLL SYNCHRONIZER:
    // Handles Desktop Pinned Scrollytelling & Mobile Continuous Reading
    const handleScroll = () => {
      const isMobile = window.innerWidth < 768;

      if (isMobile) {
        // Mobile: Calculate progress across the entire natural document
        const scrollY = window.scrollY;
        const totalScrollable = document.documentElement.scrollHeight - window.innerHeight;
        const progress = totalScrollable > 0 ? Math.min(1, Math.max(0, scrollY / totalScrollable)) : 0;
        setScrollProgress(progress);

        // Detect active stage based on section bounding boxes
        const s2 = document.getElementById("stage-02-mobile");
        const s3 = document.getElementById("stage-03-mobile");
        const s4 = document.getElementById("stage-04-mobile");
        const threshold = window.innerHeight * 0.38;

        if (s4 && s4.getBoundingClientRect().top <= threshold) {
          setActiveStage("stage-04");
        } else if (s3 && s3.getBoundingClientRect().top <= threshold) {
          setActiveStage("stage-03");
        } else if (s2 && s2.getBoundingClientRect().top <= threshold) {
          setActiveStage("stage-02");
        } else {
          setActiveStage("stage-01");
        }
      } else {
        // Desktop: Calculate progress within pinned scrollytelling track
        if (!trackRef.current) return;
        const scrollY = window.scrollY;
        const maxScroll = trackRef.current.scrollHeight - window.innerHeight;
        if (maxScroll <= 0) return;

        const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
        setScrollProgress(progress);

        if (progress < 0.25) {
          setActiveStage("stage-01");
        } else if (progress >= 0.25 && progress < 0.52) {
          setActiveStage("stage-02");
        } else if (progress >= 0.52 && progress < 0.78) {
          setActiveStage("stage-03");
        } else {
          setActiveStage("stage-04");
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    window.addEventListener("resize", handleScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("scroll", handleScroll);
      window.removeEventListener("resize", handleScroll);
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
        window.scrollTo({
          top: Math.max(0, offsetPosition),
          behavior: "smooth",
        });
        setActiveStage(stage);
        return;
      }
    }

    // Desktop: Scroll to appropriate track percentage
    if (!trackRef.current) return;
    const maxScroll = trackRef.current.scrollHeight - window.innerHeight;
    let target = 0;
    if (stage === "stage-01") target = 0;
    if (stage === "stage-02") target = maxScroll * 0.35;
    if (stage === "stage-03") target = maxScroll * 0.65;
    if (stage === "stage-04") target = maxScroll * 0.95;

    window.scrollTo({ top: target, behavior: "smooth" });
  }, []);

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

      {/* Real 3D Kinetic Three.js Background with Scroll-Driven Motion */}
      <Kinetic3DBackground scrollProgress={scrollProgress} />

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
      <header className="fixed top-0 left-0 w-full z-40 bg-white/95 backdrop-blur-md border-b border-black/10">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-7xl mx-auto py-2 sm:py-2.5">
          {/* Logo Anchor with Transparent Brand Image */}
          <button
            onClick={() => scrollToStage("stage-01")}
            className="group cursor-pointer active:scale-95 transition-transform flex items-center"
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
          </button>

          {/* Desktop Navigation Links */}
          <nav className="hidden md:flex items-center gap-6 font-headline text-xs sm:text-sm uppercase tracking-wider font-bold">
            <button
              onClick={() => scrollToStage("stage-01")}
              className={`${
                activeStage === "stage-01"
                  ? "text-black border-b-2 border-yellow-400 font-bold pb-0.5"
                  : "text-black/60 font-medium hover:text-black pb-0.5"
              } transition-all cursor-pointer`}
            >
              01 Manifesto
            </button>
            <button
              onClick={() => scrollToStage("stage-02")}
              className={`${
                activeStage === "stage-02"
                  ? "text-black border-b-2 border-yellow-400 font-bold pb-0.5"
                  : "text-black/60 font-medium hover:text-black pb-0.5"
              } transition-all cursor-pointer`}
            >
              02 Why Us
            </button>
            <button
              onClick={() => scrollToStage("stage-03")}
              className={`${
                activeStage === "stage-03"
                  ? "text-black border-b-2 border-yellow-400 font-bold pb-0.5"
                  : "text-black/60 font-medium hover:text-black pb-0.5"
              } transition-all cursor-pointer`}
            >
              03 Services
            </button>
            <button
              onClick={() => scrollToStage("stage-04")}
              className={`${
                activeStage === "stage-04"
                  ? "text-black border-b-2 border-yellow-400 font-bold pb-0.5"
                  : "text-black/60 font-medium hover:text-black pb-0.5"
              } transition-all cursor-pointer`}
            >
              04 Contact
            </button>
            <a
              href="/why-us"
              className="text-black/50 hover:text-black font-mono text-[11px] underline decoration-yellow-400 transition-colors ml-1"
            >
              [Stand-alone View ↗]
            </a>
          </nav>

          {/* Trailing Primary Actions: Sound Toggle + Brief Inquiry + Ink Mode */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <SoundToggle />

            <MagneticButton soundType="pop">
              <button
                onClick={() => scrollToStage("stage-04")}
                className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-bold text-xs px-3 sm:px-3.5 py-1.5 rounded-DEFAULT border-2 border-black comic-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all duration-150 cursor-pointer"
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
              className="w-8 h-8 border-2 border-black rounded-DEFAULT bg-white hover:bg-yellow-100 comic-shadow-sm active:scale-90 transition-transform cursor-pointer flex items-center justify-center"
              title="Toggle Studio Pen Doodle Mode"
            >
              <Pencil className="w-4 h-4 text-black" />
            </button>
          </div>
        </div>

        {/* Mobile Stage Navigation Pill Strip (Allows Instant Jumping & Status Indicator) */}
        <div className="md:hidden flex items-center justify-between gap-1 px-3 py-1.5 bg-yellow-50/95 border-t border-black/10 overflow-x-auto">
          <button
            onClick={() => scrollToStage("stage-01")}
            className={`px-2.5 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeStage === "stage-01"
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black"
                : "bg-white text-black/60 border border-black/20 hover:text-black"
            }`}
          >
            01 Manifesto
          </button>
          <button
            onClick={() => scrollToStage("stage-02")}
            className={`px-2.5 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeStage === "stage-02"
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black"
                : "bg-white text-black/60 border border-black/20 hover:text-black"
            }`}
          >
            02 Why Us
          </button>
          <button
            onClick={() => scrollToStage("stage-03")}
            className={`px-2.5 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeStage === "stage-03"
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black"
                : "bg-white text-black/60 border border-black/20 hover:text-black"
            }`}
          >
            03 Services
          </button>
          <button
            onClick={() => scrollToStage("stage-04")}
            className={`px-2.5 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap ${
              activeStage === "stage-04"
                ? "bg-yellow-400 text-black border-2 border-black comic-shadow-sm font-black"
                : "bg-white text-black/60 border border-black/20 hover:text-black"
            }`}
          >
            04 Contact
          </button>
        </div>
      </header>

      {/* =========================================================================
          MOBILE RESPONSIVE SEQUENTIAL FLOW (Natural Unhindered Scrolling)
          ========================================================================= */}
      <div className="block md:hidden w-full relative z-10 pt-28">
        {/* Stage 01 Mobile */}
        <section
          id="stage-01-mobile"
          className="w-full min-h-[calc(100vh-7rem)] py-6 px-4 flex flex-col justify-center"
        >
          <ManifestoContent
            onExploreShowreel={() => scrollToStage("stage-03")}
            onViewCapabilities={() => scrollToStage("stage-02")}
          />
        </section>

        {/* Stage 02 Mobile */}
        <section
          id="stage-02-mobile"
          className="w-full min-h-screen py-10 px-4 flex flex-col justify-center border-t-2 border-black/10"
        >
          <WhyUsContent />
        </section>

        {/* Stage 03 Mobile */}
        <section
          id="stage-03-mobile"
          className="w-full min-h-screen py-10 px-4 flex flex-col justify-center border-t-2 border-black/10"
        >
          <ServicesContent />
        </section>

        {/* Stage 04 Mobile */}
        <section
          id="stage-04-mobile"
          className="w-full min-h-screen py-10 px-4 flex flex-col justify-center border-t-2 border-black/10"
        >
          <ContactContent />
        </section>

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
        {/* STICKY FIXED VIEWPORT THEATER */}
        <div className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between z-10 pt-[68px]">
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
                className={`w-3 h-3 rounded-full border-2 border-black transition-all ${
                  activeStage === "stage-01"
                    ? "bg-yellow-400 ring-4 ring-yellow-400/30 scale-125"
                    : "bg-white group-hover:bg-yellow-400"
                }`}
              ></div>
            </button>
            <button
              onClick={() => scrollToStage("stage-02")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                02 Why Us
              </span>
              <div
                className={`w-3 h-3 rounded-full border-2 border-black transition-all ${
                  activeStage === "stage-02"
                    ? "bg-yellow-400 ring-4 ring-yellow-400/30 scale-125"
                    : "bg-white group-hover:bg-yellow-400"
                }`}
              ></div>
            </button>
            <button
              onClick={() => scrollToStage("stage-03")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                03 Services
              </span>
              <div
                className={`w-3 h-3 rounded-full border-2 border-black transition-all ${
                  activeStage === "stage-03"
                    ? "bg-yellow-400 ring-4 ring-yellow-400/30 scale-125"
                    : "bg-white group-hover:bg-yellow-400"
                }`}
              ></div>
            </button>
            <button
              onClick={() => scrollToStage("stage-04")}
              className="group flex items-center gap-2.5 text-right cursor-pointer"
            >
              <span className="text-[10px] font-headline font-bold uppercase tracking-wider bg-black text-white px-2 py-0.5 rounded opacity-0 group-hover:opacity-100 transition-opacity">
                04 Contact
              </span>
              <div
                className={`w-3 h-3 rounded-full border-2 border-black transition-all ${
                  activeStage === "stage-04"
                    ? "bg-yellow-400 ring-4 ring-yellow-400/30 scale-125"
                    : "bg-white group-hover:bg-yellow-400"
                }`}
              ></div>
            </button>
          </aside>

          {/* MAIN DYNAMIC SCENE CANVAS (Desktop Pinned & Morphing with AnimatePresence) */}
          <main className="flex-1 w-full h-[calc(100vh-6.5rem)] relative overflow-y-auto overflow-x-hidden flex flex-col justify-center px-4 sm:px-6">
            <AnimatePresence mode="wait">
              {activeStage === "stage-01" && (
                <motion.div
                  key="scene-01"
                  initial={{ opacity: 0, y: 25, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -25, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full flex flex-col justify-center"
                >
                  <ManifestoContent
                    onExploreShowreel={() => scrollToStage("stage-03")}
                    onViewCapabilities={() => scrollToStage("stage-02")}
                  />
                </motion.div>
              )}

              {activeStage === "stage-02" && (
                <motion.div
                  key="scene-02"
                  initial={{ opacity: 0, y: 25, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -25, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full flex flex-col justify-center"
                >
                  <WhyUsContent />
                </motion.div>
              )}

              {activeStage === "stage-03" && (
                <motion.div
                  key="scene-03"
                  initial={{ opacity: 0, y: 25, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -25, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full flex flex-col justify-center"
                >
                  <ServicesContent />
                </motion.div>
              )}

              {activeStage === "stage-04" && (
                <motion.div
                  key="scene-04"
                  initial={{ opacity: 0, y: 25, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -25, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full h-full flex flex-col justify-center"
                >
                  <ContactContent />
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
