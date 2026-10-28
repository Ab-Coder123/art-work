"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
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
  Pencil,
  CheckCircle2,
  Send,
  Filter,
  Play,
  Smartphone,
} from "lucide-react";
import {
  ProjectCategory,
  ProjectRecord,
  resolveSafeYouTubeEmbed,
  getProjectThumbnailUrl,
} from "@art-work/types";
import { SEED_PROJECTS } from "@/data/seedContent";

export default function GalleryPage() {
  const [projects, setProjects] = useState<ProjectRecord[]>(SEED_PROJECTS);
  const [activeFilter, setActiveFilter] = useState<ProjectCategory>("all");
  const [selectedProject, setSelectedProject] = useState<ProjectRecord | null>(null);
  const toggleDoodle = useDoodleStore((state) => state.toggleDoodle);

  // Activate Lenis luxury virtual smooth scroll
  useSmoothScroll();

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/projects?limit=24");
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data.items) && data.items.length > 0) {
            setProjects(data.items);
          }
        }
      } catch {
        // Fallback to SEED_PROJECTS when offline
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  // Mouse sparkle physics
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

    return () => {
      window.removeEventListener("mousemove", handleMouseMove);
    };
  }, []);

  const handleFilterClick = (cat: ProjectCategory) => {
    soundFX.playClick();
    setActiveFilter(cat);
  };

  const handleInspectClick = (project: ProjectRecord) => {
    soundFX.playPop();
    setSelectedProject(project);
  };

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

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => p.category === activeFilter);

  const selectedYtEmbed = selectedProject
    ? resolveSafeYouTubeEmbed(selectedProject.youtubeVideoId || selectedProject.youtubeUrl)
    : null;

  return (
    <>
      {/* 1. Real 3D Kinetic Three.js Background with characters */}
      <Kinetic3DBackground />

      {/* 2. Kinetic Motion Arrows in background */}
      <KineticMotionArrows />

      {/* 3. Interactive Studio Paint Pen */}
      <KineticPaintPen />

      {/* 4. High-Performance 60FPS Disappearing Ink Doodle Canvas */}
      <InteractiveDoodleCanvas />

      {/* 5. Dot Grid Sketchpad Canvas */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0"></div>

      {/* ================= FIXED TOP HEADER ================= */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/95 dark:bg-[#0D0D12]/95 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors duration-200">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-7xl mx-auto py-2 sm:py-2.5">
          {/* Logo Anchor */}
          <Link
            href="/"
            className="group cursor-pointer active:scale-95 transition-transform flex items-center"
            title="Art Work — Home"
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
              Home
            </Link>
            <Link
              href="/why-us"
              className="inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Why Us
            </Link>
            <Link
              href="/#stage-03"
              className="inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Services
            </Link>
            {/* Active Link: Gallery */}
            <span className="inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 bg-yellow-400 text-black border-black comic-shadow-sm rotate-1 scale-105 z-10 font-black">
              Gallery
            </span>
            <Link
              href="/#stage-04"
              className="inline-flex items-center justify-center px-3 sm:px-3.5 py-1.5 sm:py-2 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Contact
            </Link>
          </nav>

          {/* Trailing Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />
            <SoundToggle />

            <MagneticButton soundType="pop">
              <Link
                href="/#stage-04"
                className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-bold text-xs px-3 sm:px-4 py-1.5 sm:py-2 rounded-DEFAULT border-2 border-black comic-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all duration-150"
              >
                <span>Brief Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </Link>
            </MagneticButton>

            <button
              onClick={(e) => {
                triggerInkBurst(e);
                toggleDoodle();
              }}
              aria-label="Toggle Studio Pen Doodle Mode"
              className="w-8 h-8 sm:w-9 sm:h-9 border-2 border-black dark:border-zinc-400 rounded-DEFAULT bg-white dark:bg-[#181824] hover:bg-yellow-100 dark:hover:bg-[#222232] comic-shadow-sm active:scale-90 transition-transform cursor-pointer flex items-center justify-center text-black dark:text-yellow-400"
              title="Toggle Studio Pen Doodle Mode"
            >
              <Pencil className="w-4 h-4" />
            </button>
          </div>
        </div>

        {/* Mobile Navigation Strip in Gallery */}
        <div className="md:hidden flex items-center justify-start gap-1.5 px-3 py-1.5 bg-yellow-50/95 dark:bg-[#12121A]/95 border-t border-black/10 dark:border-white/10 overflow-x-auto no-scrollbar">
          <Link
            href="/#stage-01"
            className="px-2.5 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black/70 dark:text-zinc-300 border border-black/20 dark:border-zinc-700 whitespace-nowrap"
          >
            ← Home
          </Link>
          <span className="px-2.5 py-1 rounded text-[10px] font-headline font-black uppercase tracking-wider bg-yellow-400 text-black border-2 border-black comic-shadow-sm whitespace-nowrap">
            ★ Gallery Vault
          </span>
          <Link
            href="/why-us"
            className="px-2.5 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black/70 dark:text-zinc-300 border border-black/20 dark:border-zinc-700 whitespace-nowrap"
          >
            Why Us
          </Link>
          <Link
            href="/#stage-04"
            className="px-2.5 py-1 rounded text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black/70 dark:text-zinc-300 border border-black/20 dark:border-zinc-700 whitespace-nowrap"
          >
            Contact
          </Link>
        </div>
      </header>

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 w-full pt-28 sm:pt-28 md:pt-28 pb-20">
        {/* ================= HERO SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10 border-b border-black/10 dark:border-zinc-800">
          {/* Subtitle Tag */}
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 border border-black dark:border-zinc-700 bg-yellow-400 text-black px-3.5 py-1 rounded-full comic-shadow-sm font-headline text-[10px] font-black uppercase tracking-wider -rotate-1">
              <span>★ PROJECT GALLERY</span>
            </div>
          </div>

          {/* Monumental Headline */}
          <div className="max-w-5xl mb-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-headline tracking-tighter uppercase leading-[0.98] text-black dark:text-white">
              <KineticBrushWord variant="wave" color="#dcb858" strokeWidth={2.8} delay={0.1}>
                EVENTS THAT BRING
              </KineticBrushWord>{" "}
              <br />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-1.5 bg-yellow-400 -rotate-1 rounded-DEFAULT -z-10 border-2 border-black comic-shadow"></span>
                <span className="text-black relative z-10 px-2">BRANDS TO LIFE.</span>
                <KineticBrushStroke variant="double" color="#111111" strokeWidth={2.2} delay={0.35} />
              </span>
            </h1>
          </div>

          {/* Hero Subtitle & Taped Paper Callout */}
          <div className="relative p-5 sm:p-6 bg-yellow-50 dark:bg-[#161622] rounded-lg border-2 border-dashed border-yellow-500/70 dark:border-yellow-500/40 comic-shadow-sm max-w-4xl">
            {/* Washi Masking Tape Accents */}
            <div className="washi-tape-yellow absolute -top-3 left-8 w-24 h-5 -rotate-2"></div>
            <div className="washi-tape-yellow absolute -top-3 right-12 w-20 h-5 rotate-3"></div>

            <p className="font-body text-sm sm:text-base text-black/90 dark:text-zinc-200 leading-relaxed font-semibold">
              Explore conferences, exhibitions and brand experiences created for real audiences and real moments.
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-yellow-300 dark:border-zinc-700 font-mono text-xs text-black/70 dark:text-zinc-400">
              <span className="font-bold text-black dark:text-zinc-200">EVENTS</span>
              <span>•</span>
              <span className="font-bold text-black dark:text-zinc-200">EXHIBITIONS</span>
              <span>•</span>
              <span className="font-bold text-black dark:text-zinc-200">CONFERENCES</span>
              <span>•</span>
              <span className="font-bold text-black dark:text-zinc-200">BRAND EXPERIENCES</span>
            </div>
          </div>

          {/* ================= PANTONE-STYLE CATEGORY FILTER CHIPS ================= */}
          <div className="mt-10 flex flex-wrap items-center gap-2 pt-6 border-t border-dashed border-black/20 dark:border-zinc-800">
            <span className="font-mono text-xs font-bold text-black/60 dark:text-zinc-400 uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> FILTERS:
            </span>

            {[
              { key: "all", label: `All Projects (${projects.length})` },
              { key: "conferences", label: "Conferences & Medical Events" },
              { key: "booths", label: "Exhibition Booths" },
              { key: "stage", label: "Stage, Sound & Lighting" },
              { key: "led", label: "LED & Audiovisual" },
              { key: "branding", label: "Branding & Print" },
              { key: "tech", label: "Interactive Experiences" },
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => handleFilterClick(chip.key as ProjectCategory)}
                className={`px-3 py-1.5 font-headline font-bold text-xs uppercase tracking-wider rounded border-2 transition-all cursor-pointer ${
                  activeFilter === chip.key
                    ? "bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black border-black comic-shadow-sm scale-105"
                    : "bg-white dark:bg-[#161622] text-black dark:text-zinc-200 border-black dark:border-zinc-700 hover:bg-yellow-100 dark:hover:bg-[#202030]"
                }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        {/* ================= 6 UNCONVENTIONAL TACTILE PROJECT CARDS ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          {/* Section Sub-heading */}
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <div className="font-mono text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-1">
                SELECTED PROJECTS
              </div>
              <h2 className="text-2xl md:text-4xl font-black font-headline uppercase tracking-tight text-black dark:text-white">
                <KineticBrushWord variant="double" color="#dcb858" strokeWidth={2.4}>
                  THE WORK, IN THE MOMENTS
                </KineticBrushWord>
              </h2>
            </div>
            <p className="font-headline font-bold text-xs md:text-sm text-black/70 dark:text-zinc-400 max-w-sm">
              A look at the events and experiences our team has helped bring to life.
            </p>
          </div>

          {/* Tactile Mounting Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => {
              const tapeRot = index % 2 === 0 ? "-rotate-2" : "rotate-3";
              const ytMedia = resolveSafeYouTubeEmbed(
                project.youtubeVideoId || project.youtubeUrl
              );

              return (
                <motion.article
                  key={project.id}
                  initial={{ opacity: 0, y: 35, scale: 0.96 }}
                  whileInView={{ opacity: 1, y: 0, scale: 1 }}
                  viewport={{ once: true, amount: 0.12 }}
                  transition={{
                    duration: 0.5,
                    delay: (index % 3) * 0.1,
                    ease: [0.22, 1, 0.36, 1],
                  }}
                  className="relative bg-white dark:bg-[#151520] rounded-xl p-5 border-[2.5px] border-black dark:border-zinc-700 comic-shadow group hover:-translate-y-1 transition-transform duration-200 flex flex-col justify-between"
                >
                  {/* Angled Translucent Washi Masking Tape on Corner */}
                  <div
                    className={`washi-tape-yellow absolute -top-3 ${
                      index % 2 === 0 ? "left-6" : "right-6"
                    } w-24 h-5 ${tapeRot} z-20`}
                  ></div>

                  <div>
                    {/* Header Stamp Info */}
                    <div className="flex items-center justify-between pb-2.5 mb-3 border-b-2 border-dashed border-black/10 dark:border-zinc-800 font-mono text-[11px] text-black/70 dark:text-zinc-400">
                      <span className="font-bold text-black bg-yellow-300 px-1.5 py-0.5 border border-black rounded-sm">
                        {project.stamp}
                      </span>
                      <span>{project.metaBadge}</span>
                    </div>

                    {/* Hand-inked framed image */}
                    <div className="relative overflow-hidden rounded-lg border-2 border-black dark:border-zinc-700 mb-4 bg-neutral-100 dark:bg-zinc-800 aspect-[16/10]">
                      <Image
                        src={getProjectThumbnailUrl(project)}
                        alt={project.altText || project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover group-hover:scale-105 transition-transform duration-300"
                      />
                      <div className="absolute bottom-2 left-2 bg-black/90 text-white font-mono text-[10px] px-2 py-0.5 rounded border border-white/20">
                        {project.cadId}
                      </div>

                      {ytMedia && (
                        <button
                          type="button"
                          onClick={() => handleInspectClick(project)}
                          className="absolute top-2 right-2 inline-flex items-center gap-1 bg-red-600 hover:bg-red-500 text-white font-headline font-black text-[10px] uppercase px-2 py-1 rounded border border-black comic-shadow-sm cursor-pointer"
                        >
                          {project.isShort || ytMedia.isShort ? (
                            <>
                              <Smartphone className="w-3 h-3" />
                              <span>REEL 9:16</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>SHOWREEL</span>
                            </>
                          )}
                        </button>
                      )}
                    </div>

                    {/* Project Title */}
                    <h3 className="text-lg sm:text-xl font-black font-headline uppercase tracking-tight text-black dark:text-white mb-2 group-hover:text-yellow-500 transition-colors">
                      {project.title}
                    </h3>

                    {/* Tags */}
                    <div className="flex flex-wrap gap-1.5 mb-3 font-headline text-[10px] font-bold uppercase">
                      {project.tags.map((tag, i) => (
                        <span
                          key={i}
                          className={`border px-2 py-0.5 rounded ${
                            i === 0
                              ? "bg-yellow-200 border-black text-black font-extrabold"
                              : "bg-neutral-100 dark:bg-zinc-800 border-black/30 dark:border-zinc-700 text-black/80 dark:text-zinc-300"
                          }`}
                        >
                          {tag}
                        </span>
                      ))}
                    </div>

                    {/* YouTube Video / Reel Headline & Paragraph Callout */}
                    {ytMedia && (project.youtubeTitle || project.youtubeDescription) && (
                      <div className="mb-3 p-2.5 rounded-lg border-2 border-black dark:border-zinc-700 bg-neutral-50 dark:bg-[#111119] space-y-1">
                        <div className="flex items-center gap-1.5 font-mono text-[10px] font-bold uppercase text-red-600 dark:text-red-400">
                          <Play className="w-3 h-3 fill-current" />
                          <span>
                            {project.isShort || ytMedia.isShort
                              ? "YOUTUBE REEL / SHORT"
                              : "YOUTUBE VIDEO SHOWCASE"}
                          </span>
                        </div>
                        {project.youtubeTitle && (
                          <h4 className="font-headline font-extrabold text-xs text-black dark:text-white leading-snug">
                            {project.youtubeTitle}
                          </h4>
                        )}
                        {project.youtubeDescription && (
                          <p className="font-body text-[11px] text-black/75 dark:text-zinc-300 leading-relaxed line-clamp-2">
                            {project.youtubeDescription}
                          </p>
                        )}
                      </div>
                    )}

                    {/* Architectural Stats Annotation */}
                    <div className="p-2.5 bg-yellow-50/80 dark:bg-[#1a1a26] rounded border border-black/20 dark:border-zinc-700 font-mono text-xs text-black/80 dark:text-zinc-300 space-y-0.5 mb-4">
                      <div className="text-black dark:text-white font-bold flex items-center gap-1.5">
                        {project.stats}
                      </div>
                      <div className="text-[11px] text-black/60 dark:text-zinc-400">
                        {project.statsSub}
                      </div>
                    </div>
                  </div>

                  {/* Action Button: Inspect Blueprint */}
                  <button
                    onClick={() => handleInspectClick(project)}
                    className="w-full py-2.5 px-4 bg-white dark:bg-[#1a1a26] hover:bg-yellow-400 dark:hover:bg-yellow-400 text-black dark:text-white dark:hover:text-black font-headline font-bold text-xs uppercase border-2 border-black dark:border-zinc-700 rounded comic-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all flex items-center justify-center gap-2 cursor-pointer"
                  >
                    {ytMedia ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {project.isShort || ytMedia.isShort
                            ? "WATCH REEL & BLUEPRINT ↗"
                            : "WATCH SHOWREEL & BLUEPRINT ↗"}
                        </span>
                      </>
                    ) : (
                      <>
                        <Pencil className="w-3.5 h-3.5" />
                        <span>INSPECT BLUEPRINT ↗</span>
                      </>
                    )}
                  </button>
                </motion.article>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-black/30 dark:border-zinc-700 rounded-xl bg-white/50 dark:bg-[#151520]/50">
                <p className="font-headline font-bold text-sm text-black dark:text-zinc-200 mb-3">
                  No projects categorized under this filter yet.
                </p>
                <button
                  onClick={() => setActiveFilter("all")}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-black text-xs uppercase rounded border-2 border-black comic-shadow-sm cursor-pointer"
                >
                  VIEW ALL MASTERPIECES ({projects.length})
                </button>
              </div>
            )}
          </div>
        </section>

        {/* ================= SPOTLIGHT: THE BLUEPRINT TO REALITY ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12 border-t-2 border-black dark:border-zinc-800">
          <ScrollReveal direction="up" distance={25} className="flex items-center gap-3 mb-6">
            <span className="w-4 h-4 bg-yellow-400 border border-black"></span>
            <h2 className="text-2xl md:text-3xl font-black font-headline uppercase tracking-tight text-black dark:text-white">
              <KineticBrushWord variant="wave" color="#dcb858" strokeWidth={2.4}>
                THE BLUEPRINT TO REALITY
              </KineticBrushWord>
            </h2>
            <span className="font-mono text-xs text-black/50 dark:text-zinc-400 ml-auto hidden sm:inline">
              DRAFTING TABLE: WORKBENCH 01
            </span>
          </ScrollReveal>

          <ScrollReveal
            direction="pop"
            distance={30}
            delay={0.1}
            className="relative bg-white dark:bg-[#151520] rounded-2xl border-3 border-black dark:border-zinc-700 p-6 md:p-8 comic-shadow overflow-hidden"
          >
            {/* Washi Tape on corners */}
            <div className="washi-tape-yellow absolute top-3 left-10 w-32 h-6 -rotate-2 z-10"></div>
            <div className="washi-tape-yellow absolute top-3 right-10 w-28 h-6 rotate-3 z-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Easel Blueprint Presentation */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative border-2 border-black dark:border-zinc-700 rounded-xl overflow-hidden comic-shadow-sm bg-white dark:bg-zinc-900 aspect-[16/11]">
                  <Image
                    src="/assets/images/gallery/spotlight_blueprint_easel.jpg"
                    alt="Stage Architect presenting hand-sketched blueprints"
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                  />
                  <div className="absolute top-3 right-3 bg-yellow-400 text-black font-mono text-xs px-2.5 py-1 rounded border border-black font-bold comic-shadow-sm">
                    STAGE_SPEC_REV_04
                  </div>
                </div>
                <div className="flex items-center justify-between text-xs font-mono text-black/60 dark:text-zinc-400 px-1">
                  <span>FIG 1.0: PRODUCTION WORKFLOW</span>
                  <span className="text-black dark:text-white font-bold">
                    CONCEPT TO LIVE DELIVERY
                  </span>
                </div>
              </div>

              {/* Right Column: Breakdown */}
              <div className="lg:col-span-5 flex flex-col justify-between h-full space-y-5">
                <div>
                  <div className="inline-block px-2.5 py-0.5 bg-black text-yellow-400 font-mono text-xs font-bold rounded mb-2">
                    OUR APPROACH
                  </div>
                  <h3 className="text-xl md:text-2xl font-black font-headline uppercase tracking-tight text-black dark:text-white">
                    FROM BRIEF TO LIVE EXPERIENCE.
                  </h3>

                  {/* Sticky note quote box */}
                  <div className="my-4 p-3.5 bg-yellow-100 dark:bg-[#1e1e2c] rounded border-2 border-black dark:border-zinc-700 comic-shadow-sm relative">
                    <p className="font-headline font-bold text-xs sm:text-sm text-black dark:text-zinc-100 leading-snug">
                      &quot;From the initial concept to the final execution, we create memorable experiences that bring brands to life.&quot;
                    </p>
                    <div className="mt-2 text-right font-mono text-[10px] text-black/70 dark:text-zinc-400 font-bold">
                      — ART WORK EVENT TEAM
                    </div>
                  </div>

                  {/* Workflow Checklist */}
                  <ul className="space-y-2.5 font-body text-xs sm:text-sm text-black/80 dark:text-zinc-300">
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                        1
                      </span>
                      <span>
                        <strong>Understand:</strong> We learn about your objectives, audience, event format, timing and practical requirements.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                        2
                      </span>
                      <span>
                        <strong>Create:</strong> We develop the concept, creative direction and event experience with your team.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                        3
                      </span>
                      <span>
                        <strong>Plan &amp; Produce:</strong> We coordinate the schedule, suppliers, event branding, equipment and production details.
                      </span>
                    </li>
                    <li className="flex items-start gap-2">
                      <span className="w-5 h-5 rounded bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                        4
                      </span>
                      <span>
                        <strong>Deliver On Site:</strong> We manage event operations and logistics as the experience comes to life.
                      </span>
                    </li>
                  </ul>
                </div>

                <div className="pt-2">
                  <a
                    href="#brief-inquiry"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-black dark:bg-yellow-400 text-white dark:text-black hover:bg-yellow-400 hover:text-black dark:hover:bg-yellow-300 font-headline font-bold text-xs uppercase rounded border-2 border-black comic-shadow-sm transition-colors"
                  >
                    <span>LET’S PLAN YOUR NEXT EVENT</span>
                    <ArrowRight className="w-4 h-4" />
                  </a>
                </div>
              </div>
            </div>
          </ScrollReveal>
        </section>

        {/* ================= CREATIVE BRIEF INTAKE BANNER ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12" id="brief-inquiry">
          <ScrollReveal
            direction="pop"
            distance={35}
            className="bg-yellow-400 rounded-2xl border-3 border-black p-6 sm:p-10 comic-shadow relative overflow-hidden"
          >
            <div className="relative z-10 max-w-3xl">
              <span className="px-3 py-0.5 bg-black text-white font-mono text-xs font-bold uppercase rounded inline-block mb-3">
                TELL US WHAT YOU’RE PLANNING
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-headline uppercase tracking-tight text-black leading-tight mb-3">
                PLANNING AN EVENT OR EXHIBITION?{" "}
                <KineticBrushWord variant="double" color="#111111" strokeWidth={2.4}>
                  LET’S BRING IT TO LIFE.
                </KineticBrushWord>
              </h2>
              <p className="font-body text-sm sm:text-base text-black/90 font-medium leading-relaxed mb-6">
                Tell us about your event format, audience and timing. We’ll follow up to discuss the right creative and production support for your brief.
              </p>

              {/* Action Buttons Cluster */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/#stage-04"
                  className="px-6 py-3 bg-black hover:bg-neutral-800 text-yellow-400 font-headline font-bold text-xs uppercase rounded border-2 border-black comic-shadow-sm flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <Send className="w-4 h-4" />
                  <span>SEND YOUR EVENT BRIEF</span>
                </Link>
                <a
                  href="mailto:ahmed.artwork2026@gmail.com"
                  className="px-6 py-3 bg-white hover:bg-yellow-100 text-black font-headline font-bold text-xs uppercase rounded border-2 border-black comic-shadow-sm flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <span>EMAIL DIRECT: ahmed.artwork2026@gmail.com</span>
                </a>
              </div>

              <div className="mt-6 pt-4 border-t border-black/20 flex flex-wrap items-center gap-4 font-mono text-xs text-black/80">
                <span>★ ONE CONNECTED TEAM</span>
                <span>•</span>
                <span>📍 CAIRO // REGIONAL EVENT DELIVERY</span>
                <span>•</span>
                <span>CREATIVE | PLANNING | PRODUCTION</span>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* ================= INTERACTIVE BLUEPRINT MODAL LIGHTBOX ================= */}
      <AnimatePresence>
        {selectedProject && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/75 backdrop-blur-sm p-4"
            onClick={() => setSelectedProject(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#151520] border-4 border-black dark:border-zinc-700 rounded-2xl p-6 sm:p-8 max-w-2xl w-full comic-shadow relative max-h-[90vh] overflow-y-auto"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedProject(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-yellow-400 hover:bg-black hover:text-white text-black border-2 border-black font-black flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                ✕
              </button>

              <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 border-2 border-black font-mono text-xs font-black uppercase mb-3">
                <span>{selectedProject.stamp}</span>
                <span>•</span>
                <span>{selectedProject.metaBadge}</span>
              </div>

              <h2 className="text-2xl font-black font-headline uppercase text-black dark:text-white mb-2">
                {selectedProject.title}
              </h2>

              <p className="font-body text-sm text-black/80 dark:text-zinc-300 mb-4">
                {selectedProject.description}
              </p>

              {/* YouTube Video or Reel/Short Embed + Headline + Paragraph */}
              {selectedYtEmbed ? (
                <div className="mb-5 p-4 rounded-xl border-2 border-black dark:border-zinc-700 bg-neutral-50 dark:bg-[#0e0e16] space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="inline-flex items-center gap-1.5 bg-red-600 text-white font-mono text-[10px] font-bold uppercase px-2.5 py-0.5 rounded border border-black">
                      <Play className="w-3 h-3 fill-current" />
                      <span>
                        {selectedProject.isShort || selectedYtEmbed.isShort
                          ? "YOUTUBE REEL / SHORT (9:16)"
                          : "YOUTUBE SHOWREEL (16:9)"}
                      </span>
                    </span>
                    <a
                      href={selectedYtEmbed.canonicalUrl}
                      target="_blank"
                      rel="noopener noreferrer"
                      className="inline-flex items-center gap-1 font-headline font-bold text-[11px] text-red-600 dark:text-red-400 hover:underline"
                    >
                      <span>WATCH ON YOUTUBE</span>
                      <span>↗</span>
                    </a>
                  </div>

                  {selectedProject.youtubeTitle && (
                    <h3 className="font-headline font-black text-base text-black dark:text-white">
                      {selectedProject.youtubeTitle}
                    </h3>
                  )}

                  {selectedProject.youtubeDescription && (
                    <p className="font-body text-xs text-black/80 dark:text-zinc-300 leading-relaxed">
                      {selectedProject.youtubeDescription}
                    </p>
                  )}

                  <div
                    className={`relative rounded-lg overflow-hidden border-2 border-black dark:border-zinc-700 bg-black ${
                      selectedProject.isShort || selectedYtEmbed.isShort
                        ? "aspect-[9/16] max-w-[280px] mx-auto"
                        : "aspect-video w-full"
                    }`}
                  >
                    <iframe
                      src={selectedYtEmbed.embedUrl}
                      title={selectedProject.youtubeTitle || selectedProject.title}
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
                      referrerPolicy="strict-origin-when-cross-origin"
                      allowFullScreen
                      className="w-full h-full border-0 pointer-events-auto cursor-pointer relative z-10"
                    />
                  </div>
                </div>
              ) : (
                <div className="relative rounded-lg overflow-hidden border-2 border-black dark:border-zinc-700 aspect-[16/9] mb-4">
                  <Image
                    src={selectedProject.image}
                    alt={selectedProject.altText || selectedProject.title}
                    fill
                    className="object-cover"
                  />
                </div>
              )}

              <div className="mb-4">
                <h4 className="font-headline font-bold text-xs uppercase mb-2 text-black dark:text-white">
                  Technical Specifications &amp; Rigging Deliverables:
                </h4>
                <ul className="space-y-1.5 font-mono text-xs text-black/80 dark:text-zinc-300">
                  {selectedProject.specs.map((spec, i) => (
                    <li key={i} className="flex items-center gap-2">
                      <CheckCircle2 className="w-4 h-4 text-black dark:text-yellow-400 flex-shrink-0" />
                      <span>{spec}</span>
                    </li>
                  ))}
                </ul>
              </div>

              <div className="pt-3 border-t border-black/10 dark:border-zinc-800 flex items-center justify-between">
                <span className="font-mono text-xs font-bold text-yellow-600 dark:text-yellow-400">
                  CLIENT: {selectedProject.client}
                </span>
                <Link
                  href="/#stage-04"
                  className="px-4 py-2 bg-black dark:bg-yellow-400 text-white dark:text-black hover:bg-yellow-400 hover:text-black dark:hover:bg-yellow-300 font-headline font-bold text-xs uppercase rounded border-2 border-black comic-shadow-sm transition-colors"
                >
                  REQUEST SIMILAR STAGE ↗
                </Link>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* ================= FOOTER ================= */}
      <footer className="w-full py-4 bg-white/95 dark:bg-[#0C0C10]/95 text-black dark:text-zinc-300 border-t-2 border-black dark:border-zinc-800 z-30">
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 max-w-7xl mx-auto text-[10px] text-black/70 dark:text-zinc-400 font-mono gap-2 sm:gap-0">
          <div>
            © 2025 Art Work Scenography Collective. All sketchbooks &amp; blueprints reserved.
          </div>
          <div className="flex items-center gap-4 font-headline font-bold">
            <Link href="/" className="hover:text-black dark:hover:text-white hover:underline">
              HOME
            </Link>
            <Link href="/why-us" className="hover:text-black dark:hover:text-white hover:underline">
              WHY US
            </Link>
            <Link
              href="/#stage-03"
              className="hover:text-black dark:hover:text-white hover:underline"
            >
              SERVICES
            </Link>
            <Link
              href="/gallery"
              className="text-black dark:text-yellow-400 underline decoration-yellow-400"
            >
              GALLERY
            </Link>
            <Link
              href="/#stage-04"
              className="hover:text-black dark:hover:text-white hover:underline"
            >
              CONTACT
            </Link>
          </div>
        </div>
      </footer>
    </>
  );
}
