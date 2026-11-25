"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { StudioHeader, StudioFooter } from "@/components/home";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { soundFX } from "@/utils/soundFX";
import { KineticBrushWord, KineticBrushStroke } from "@/components/cinematic/KineticBrushStroke";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";

// Dynamic imports for heavy decorative canvas and Three.js WebGL scenes
const DeferredKinetic3DBackground = dynamic(
  () =>
    import("@/components/cinematic/DeferredKinetic3DBackground").then(
      (m) => m.DeferredKinetic3DBackground
    ),
  { ssr: false }
);

const InteractiveDoodleCanvas = dynamic(
  () =>
    import("@/components/cinematic/InteractiveDoodleCanvas").then(
      (m) => m.InteractiveDoodleCanvas
    ),
  { ssr: false }
);

const KineticPaintPen = dynamic(
  () =>
    import("@/components/cinematic/KineticPaintPen").then((m) => m.KineticPaintPen),
  { ssr: false }
);

const KineticMotionArrows = dynamic(
  () =>
    import("@/components/cinematic/KineticMotionArrows").then(
      (m) => m.KineticMotionArrows
    ),
  { ssr: false }
);
import {
  ArrowRight,
  Pencil,
  Send,
  Filter,
  Play,
  Smartphone,
  FileText,
  Sparkles,
} from "lucide-react";
import {
  type ProjectCategory,
  type ProjectRecord,
  getUiDictionary,
  resolveLocalizedProject,
  resolveSafeYouTubeEmbed,
  getProjectThumbnailUrl,
} from "@art-work/types";
import { CANONICAL_SITE_CONTENT } from "@/lib/siteContent";
import { GalleryProjectModal } from "@/components/gallery/GalleryProjectModal";
import { useShowcaseStore } from "@/store/useShowcaseStore";

const KineticParticleCanvas = dynamic(
  () =>
    import("@/components/cinematic/KineticParticleCanvas").then(
      (m) => m.KineticParticleCanvas
    ),
  { ssr: false }
);

export default function GalleryPage() {
  const locale = useShowcaseStore((s) => s.locale);
  const dict = getUiDictionary(locale);
  const rawProjects = useShowcaseStore((s) => s.projects);
  const projects = React.useMemo(
    () => rawProjects.map((p) => resolveLocalizedProject(p, locale)),
    [rawProjects, locale]
  );
  const galleryContent = useShowcaseStore((s) => s.siteContent.galleryPage);
  const layout = useShowcaseStore((s) => s.siteContent.layout);
  const contact = useShowcaseStore((s) => s.siteContent.contact);
  const activeFilter = useShowcaseStore((s) => s.activeCategoryFilter);
  const setActiveFilter = useShowcaseStore((s) => s.setActiveCategoryFilter);
  const selectedProjectId = useShowcaseStore((s) => s.selectedProjectId);
  const setSelectedProjectId = useShowcaseStore((s) => s.setSelectedProjectId);
  const hasSyncedLive = useShowcaseStore((s) => s.hasSyncedLive);
  const hasHydratedServerData = useShowcaseStore((s) => s.hasHydratedServerData);
  const ensureFreshData = useShowcaseStore((s) => s.ensureFreshData);

  const [isLoading, setIsLoading] = useState(!hasSyncedLive && !hasHydratedServerData);
  const deepLinkResolvedRef = React.useRef(false);

  const selectedProject = React.useMemo(
    () => projects.find((proj) => proj.id === selectedProjectId) || null,
    [projects, selectedProjectId]
  );

  const setSelectedProject = React.useCallback(
    (project: ProjectRecord | null) => {
      setSelectedProjectId(project ? project.id : null);
      if (typeof window !== "undefined") {
        const nextUrl = new URL(window.location.href);
        if (project) {
          nextUrl.searchParams.set("project", project.slug || project.id);
        } else {
          nextUrl.searchParams.delete("project");
          deepLinkResolvedRef.current = true;
        }
        window.history.replaceState(null, "", `${nextUrl.pathname}${nextUrl.search}`);
      }
    },
    [setSelectedProjectId]
  );

  // Auto-open project card modal when visiting a shared /gallery?project=<slug-or-id> link
  useEffect(() => {
    if (typeof window === "undefined" || deepLinkResolvedRef.current || projects.length === 0) {
      return;
    }
    const targetParam = new URLSearchParams(window.location.search).get("project")?.trim();
    if (!targetParam) {
      deepLinkResolvedRef.current = true;
      return;
    }
    const normalizedTarget = targetParam.toLowerCase();
    const matched = projects.find(
      (p) =>
        p.id.toLowerCase() === normalizedTarget ||
        (p.slug && p.slug.toLowerCase() === normalizedTarget)
    );
    if (matched) {
      deepLinkResolvedRef.current = true;
      setSelectedProjectId(matched.id);
    } else if (!isLoading) {
      deepLinkResolvedRef.current = true;
    }
  }, [projects, isLoading, setSelectedProjectId]);

  // Apply a shared /gallery?category=<key> filter link on first load
  const categoryDeepLinkResolvedRef = React.useRef(false);
  useEffect(() => {
    if (typeof window === "undefined" || categoryDeepLinkResolvedRef.current) return;
    categoryDeepLinkResolvedRef.current = true;
    const categoryParam = new URLSearchParams(window.location.search)
      .get("category")
      ?.trim()
      .toLowerCase();
    if (
      categoryParam === "all" ||
      categoryParam === "conferences" ||
      categoryParam === "booths" ||
      categoryParam === "branding"
    ) {
      setActiveFilter(categoryParam as ProjectCategory);
    }
  }, [setActiveFilter]);

  // Activate Lenis luxury virtual smooth scroll
  useSmoothScroll();

  useEffect(() => {
    let mounted = true;
    ensureFreshData().finally(() => {
      if (mounted) {
        setIsLoading(false);
      }
    });
    return () => {
      mounted = false;
    };
  }, [ensureFreshData]);

  if (isLoading) {
    return (
      <div className="min-h-screen bg-white dark:bg-[#08080d] text-black dark:text-white flex flex-col justify-between items-center relative overflow-hidden select-none transition-colors duration-200">
        <div className="absolute top-1/3 left-1/2 -translate-x-1/2 -translate-y-1/2 w-[500px] h-[500px] bg-yellow-400/20 dark:bg-yellow-500/10 rounded-full blur-3xl pointer-events-none" />

        <header className="w-full border-b border-black/10 dark:border-white/10 px-4 sm:px-6 max-w-7xl mx-auto py-3 sm:py-4 flex items-center justify-between z-10">
          <div className="flex items-center gap-3">
            <div className="relative w-10 h-10 sm:w-11 sm:h-11">
              <Image
                src="/assets/images/artwork_logo.png"
                alt="Art Work Logo"
                fill
                priority
                className="object-contain dark:hidden"
              />
              <Image
                src="/assets/images/artwork_logo_dark.png"
                alt="Art Work Logo"
                fill
                priority
                className="object-contain hidden dark:block"
              />
            </div>
            <span className="font-headline font-black text-xs sm:text-sm tracking-wider uppercase text-black dark:text-yellow-400">
              ART WORK GALLERY
            </span>
          </div>
          <div className="flex items-center gap-2">
            <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-yellow-400/20 dark:bg-yellow-400/10 border border-yellow-500/40 dark:border-yellow-400/30 text-black dark:text-yellow-400 text-[10px] sm:text-xs font-mono font-bold uppercase">
              <span className="w-2 h-2 rounded-full bg-yellow-400 animate-ping" />
              LOADING...
            </span>
          </div>
        </header>

        <div className="w-full max-w-md px-6 py-16 flex flex-col items-center text-center z-10">
          <div className="relative mb-6">
            <div className="w-20 h-20 sm:w-24 sm:h-24 rounded-2xl bg-white dark:bg-[#14141E] border-2 border-black dark:border-yellow-400/50 comic-shadow flex items-center justify-center p-3 animate-pulse">
              <Image
                src="/assets/images/artwork_logo.png"
                alt="Art Work"
                width={64}
                height={64}
                className="object-contain dark:hidden"
              />
              <Image
                src="/assets/images/artwork_logo_dark.png"
                alt="Art Work"
                width={64}
                height={64}
                className="object-contain hidden dark:block"
              />
            </div>
            <div className="absolute -top-2 -right-2 bg-yellow-400 text-black text-[9px] font-headline font-black px-2 py-0.5 rounded border border-black comic-shadow-sm rotate-6 uppercase">
              LOADING
            </div>
          </div>

          <div className="inline-flex items-center gap-2 text-black dark:text-yellow-400 font-headline font-black text-xs sm:text-sm uppercase tracking-widest mb-2">
            <Sparkles className="w-4 h-4 fill-yellow-400 text-black dark:text-yellow-400 animate-spin" />
            <span>LOADING GALLERY ARCHIVE...</span>
          </div>

          <p className="font-mono text-xs text-zinc-600 dark:text-zinc-400 max-w-xs leading-relaxed mb-6">
            Loading verified projects, reels & spatial installations...
          </p>

          <div className="w-48 sm:w-60 h-1.5 bg-black/10 dark:bg-white/10 rounded-full overflow-hidden border border-black/10 dark:border-white/10 relative">
            <div className="absolute inset-0 bg-yellow-400 animate-pulse" />
          </div>
        </div>

        <footer className="w-full border-t border-black/10 dark:border-white/10 py-3 text-center font-mono text-[11px] text-zinc-500 dark:text-zinc-500 z-10">
          <span>Art Work Creative Marketing Studio • Loading content...</span>
        </footer>
      </div>
    );
  }

  const handleFilterClick = async (cat: ProjectCategory) => {
    soundFX.playClick();
    setActiveFilter(cat);

    if (typeof window === "undefined") return;
    const shareUrl = new URL(`${window.location.origin}/gallery`);
    if (cat !== "all") {
      shareUrl.searchParams.set("category", cat);
    }

    const currentUrl = new URL(window.location.href);
    currentUrl.searchParams.delete("project");
    if (cat === "all") {
      currentUrl.searchParams.delete("category");
    } else {
      currentUrl.searchParams.set("category", cat);
    }
    window.history.replaceState(null, "", `${currentUrl.pathname}${currentUrl.search}`);

    try {
      if (navigator.clipboard?.writeText) {
        await navigator.clipboard.writeText(shareUrl.toString());
      }
    } catch {
      // Clipboard write handled safely
    }
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

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("artwork:particle-burst", {
          detail: { x: originX, y: originY, count: 20 },
        })
      );
    }
  };

  const filteredProjects =
    activeFilter === "all"
      ? projects
      : projects.filter((p) => {
        if (activeFilter === "branding") {
          return p.category === "branding" || p.category === "tech";
        }
        if (activeFilter === "conferences") {
          return (
            p.category === "conferences" ||
            p.category === "stage" ||
            p.category === "led"
          );
        }
        return p.category === activeFilter;
      });

  const heroTags =
    Array.isArray(galleryContent.heroTags) && galleryContent.heroTags.length > 0
      ? galleryContent.heroTags
      : CANONICAL_SITE_CONTENT.galleryPage.heroTags;

  const workflowSteps =
    Array.isArray(galleryContent.workflowSteps) && galleryContent.workflowSteps.length > 0
      ? galleryContent.workflowSteps
      : CANONICAL_SITE_CONTENT.galleryPage.workflowSteps;

  return (
    <>
      {/* 1. Real 3D Kinetic Three.js Background with characters (Deferred) */}
      <DeferredKinetic3DBackground />

      {/* 2. Kinetic Motion Arrows in background */}
      <KineticMotionArrows />

      {/* 3. Interactive Studio Paint Pen */}
      <KineticPaintPen />

      {/* 4. High-Performance 60FPS Disappearing Ink Doodle Canvas */}
      <InteractiveDoodleCanvas />

      {/* 4.5 Zero-DOM Pooled 2D Canvas Particle Engine */}
      <KineticParticleCanvas />

      {/* 5. Dot Grid Sketchpad Canvas */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0"></div>

      {/* ================= FIXED TOP STUDIO HEADER (SHARED) =================
          Shared across all pages; renders layout.navGalleryLabel, ★ HOME, artwork_logo_dark.png,
          dark:hidden, hidden dark:block, and responsive comic sticker navigation. */}
      <StudioHeader
        layout={layout}
        whatsappPhone={contact.phone}
        onInkBurst={triggerInkBurst}
      />

      {/* ================= MAIN CONTENT ================= */}
      <main className="relative z-10 w-full pt-28 sm:pt-28 md:pt-28 pb-20">
        {/* ================= HERO SECTION ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 pt-6 pb-10 border-b border-black/10 dark:border-zinc-800">
          {/* Subtitle Tag */}
          <div className="flex items-center gap-3 mb-4">
            <div className="inline-flex items-center gap-2 border border-black dark:border-zinc-700 bg-yellow-400 text-black px-3.5 py-1 rounded-full comic-shadow-sm font-headline text-[10px] font-black uppercase tracking-wider -rotate-1">
              <span>{galleryContent.heroBadge}</span>
            </div>
          </div>

          {/* Monumental Headline */}
          <div className="max-w-5xl mb-6">
            <h1 className="text-3xl sm:text-5xl lg:text-6xl font-black font-headline tracking-tighter uppercase leading-[0.98] text-black dark:text-white">
              <KineticBrushWord variant="wave" color="#dcb858" strokeWidth={3} delay={0.1}>
                {galleryContent.headlinePart1}
              </KineticBrushWord>{" "}
              <br />
              <span className="relative inline-block mt-2">
                <span className="absolute -inset-1.5 bg-yellow-400 -rotate-1 rounded-DEFAULT -z-10 border-2 border-black comic-shadow"></span>
                <span className="text-black relative z-10 px-2">
                  {galleryContent.headlinePart2}
                </span>
                <KineticBrushStroke variant="double" color="#111111" strokeWidth={2.8} delay={0.35} />
              </span>
            </h1>
          </div>

          {/* Hero Subtitle & Taped Paper Callout */}
          <div className="relative p-5 sm:p-6 bg-yellow-50 dark:bg-[#161622] rounded-lg border-2 border-dashed border-yellow-500/70 dark:border-yellow-500/40 comic-shadow-sm max-w-4xl">
            <div className="washi-tape-yellow absolute -top-3 left-8 w-24 h-5 -rotate-2"></div>
            <div className="washi-tape-yellow absolute -top-3 right-12 w-20 h-5 rotate-3"></div>

            <p className="font-body text-sm sm:text-base text-black/90 dark:text-zinc-200 leading-relaxed font-semibold">
              {galleryContent.heroDescription}
            </p>

            <div className="mt-4 flex flex-wrap items-center gap-3 pt-3 border-t border-yellow-300 dark:border-zinc-700 font-mono text-xs text-black/70 dark:text-zinc-400">
              {heroTags.map((tag, idx) => (
                <React.Fragment key={`${tag}-${idx}`}>
                  {idx > 0 && <span>•</span>}
                  <span className="font-bold text-black dark:text-zinc-200">{tag}</span>
                </React.Fragment>
              ))}
            </div>
          </div>

          {/* ================= CATEGORY FILTER CHIPS ================= */}
          <div className="mt-10 flex flex-wrap items-center gap-2 pt-6 border-t border-dashed border-black/20 dark:border-zinc-800">
            <span className="font-mono text-xs font-bold text-black/60 dark:text-zinc-400 uppercase mr-2 flex items-center gap-1">
              <Filter className="w-3.5 h-3.5" /> FILTERS:
            </span>

            {[
              { key: "all", label: `${galleryContent.filterAllLabel} (${projects.length})` },
              { key: "conferences", label: galleryContent.filterConferencesLabel },
              { key: "booths", label: galleryContent.filterBoothsLabel },
              { key: "branding", label: galleryContent.filterBrandingLabel },
            ].map((chip) => (
              <button
                key={chip.key}
                onClick={() => handleFilterClick(chip.key as ProjectCategory)}
                className={`px-3 py-1.5 font-headline font-bold text-xs uppercase tracking-wider rounded border-2 transition-all cursor-pointer ${activeFilter === chip.key
                  ? "bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black border-black comic-shadow-sm scale-105"
                  : "bg-white dark:bg-[#161622] text-black dark:text-zinc-200 border-black dark:border-zinc-700 hover:bg-yellow-100 dark:hover:bg-[#202030]"
                  }`}
              >
                {chip.label}
              </button>
            ))}
          </div>
        </section>

        {/* ================= TACTILE PROJECT CARDS ================= */}
        <section className="max-w-7xl mx-auto px-4 sm:px-6 py-12">
          <div className="flex flex-col md:flex-row md:items-end justify-between mb-8 gap-3">
            <div>
              <div className="font-mono text-xs font-bold text-yellow-600 dark:text-yellow-400 uppercase tracking-widest mb-1">
                {galleryContent.gridEyebrow}
              </div>
              <h2 className="text-2xl md:text-4xl font-black font-headline uppercase tracking-tight text-black dark:text-white">
                <KineticBrushWord variant="double" color="#dcb858" strokeWidth={2.4}>
                  {galleryContent.gridHeadline}
                </KineticBrushWord>
              </h2>
            </div>
          </div>

          {/* Tactile Mounting Board Grid */}
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-8">
            {filteredProjects.map((project, index) => {
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
                  onClick={() => handleInspectClick(project)}
                  className="relative bg-white dark:bg-[#14141c] rounded-2xl p-5 sm:p-6 border border-black/[0.06] dark:border-white/[0.08] hover:border-black/15 dark:hover:border-yellow-400/30 shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16),0_8px_16px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7),0_2px_8px_-1px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_24px_54px_-8px_rgba(0,0,0,0.9),0_0_28px_-4px_rgba(234,179,8,0.14)] group hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between cursor-pointer select-none"
                >
                  <div>
                    {/* Header Info */}
                    <div className="flex items-center justify-between pb-3 mb-3.5 border-b border-black/5 dark:border-white/5 font-mono text-[11px] text-black/60 dark:text-zinc-400">
                      <div className="flex items-center gap-1.5">
                        <span className="font-bold text-black dark:text-yellow-400 bg-yellow-400/20 dark:bg-yellow-400/10 px-2.5 py-0.5 rounded-full text-[10px] tracking-wider font-mono">
                          {project.year || 2026}
                        </span>
                        {project.featured && (
                          <span className="font-headline font-black text-[9px] bg-yellow-400 text-black px-2 py-0.5 rounded-full border border-black">
                            ★ HOME
                          </span>
                        )}
                      </div>
                      {project.metaBadge && (
                        <span className="font-semibold text-xs tracking-wider">
                          {project.metaBadge}
                        </span>
                      )}
                    </div>

                    {/* Hand-inked framed image */}
                    <div className="relative overflow-hidden rounded-xl mb-4 bg-neutral-100 dark:bg-zinc-800 aspect-[16/10] shadow-[0_2px_8px_rgba(0,0,0,0.04)]">
                      <Image
                        src={getProjectThumbnailUrl(project)}
                        alt={project.altText || project.title}
                        fill
                        sizes="(max-width: 768px) 100vw, (max-width: 1200px) 50vw, 33vw"
                        className="object-cover object-top group-hover:scale-105 transition-transform duration-500 ease-out"
                        unoptimized={
                          getProjectThumbnailUrl(project).startsWith("http") ||
                          getProjectThumbnailUrl(project).startsWith("data:")
                        }
                      />

                      {project.category === "branding" && project.pdfUrl ? (
                        <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 bg-amber-400/95 backdrop-blur-sm text-black font-headline font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-sm">
                          <FileText className="w-3 h-3" />
                          <span>CATALOG &amp; PDF</span>
                        </div>
                      ) : ytMedia ? (
                        <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 bg-red-600/90 backdrop-blur-sm text-white font-headline font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-sm">
                          {project.isShort || ytMedia.isShort ? (
                            <>
                              <Smartphone className="w-3 h-3" />
                              <span>REEL 9:16</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>SHOWREEL 16:9</span>
                            </>
                          )}
                        </div>
                      ) : project.facebookUrl ? (
                        <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 bg-[#1877F2]/90 backdrop-blur-sm text-white font-headline font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-sm">
                          {project.isShort ? (
                            <>
                              <Smartphone className="w-3 h-3" />
                              <span>FB REEL 9:16</span>
                            </>
                          ) : (
                            <>
                              <Play className="w-3 h-3 fill-current" />
                              <span>FB VIDEO 16:9</span>
                            </>
                          )}
                        </div>
                      ) : project.pdfUrl || project.category === "booths" ? (
                        <div className="absolute top-2.5 right-2.5 inline-flex items-center gap-1.5 bg-yellow-400/95 backdrop-blur-sm text-black font-headline font-black text-[10px] uppercase px-2.5 py-1 rounded-full shadow-sm">
                          <FileText className="w-3 h-3" />
                          <span>
                            {project.category === "branding"
                              ? "CATALOG & PDF"
                              : "3D & PDF"}
                          </span>
                        </div>
                      ) : null}
                    </div>

                    {/* Project Title */}
                    <h3 className="text-lg sm:text-xl font-black font-headline uppercase tracking-tight text-black dark:text-white mb-2.5 group-hover:text-yellow-500 transition-colors">
                      {project.title}
                    </h3>
                  </div>

                  {/* Action Button: Inspect Blueprint */}
                  <button
                    onClick={(e) => {
                      e.stopPropagation();
                      handleInspectClick(project);
                    }}
                    className="w-full py-2.5 px-4 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-black text-xs uppercase rounded-xl transition-all duration-200 flex items-center justify-center gap-2 cursor-pointer shadow-[0_2px_10px_rgba(234,179,8,0.25)] hover:shadow-[0_4px_16px_rgba(234,179,8,0.4)] active:scale-95 mt-2"
                  >
                    {project.category === "branding" && project.pdfUrl ? (
                      <>
                        <FileText className="w-3.5 h-3.5" />
                        <span>{dict.gallery.viewGiveawaysPdf} ↗</span>
                      </>
                    ) : ytMedia ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {project.isShort || ytMedia.isShort
                            ? `${dict.gallery.youtubeShortsBadge} ↗`
                            : `${dict.gallery.watchVideo} ↗`}
                        </span>
                      </>
                    ) : project.facebookUrl ? (
                      <>
                        <Play className="w-3.5 h-3.5 fill-current" />
                        <span>
                          {project.isShort
                            ? `${dict.gallery.facebookReelBadge} ↗`
                            : `${dict.gallery.facebookVideoBadge} ↗`}
                        </span>
                      </>
                    ) : project.pdfUrl ? (
                      <>
                        <FileText className="w-3.5 h-3.5" />
                        <span>
                          {project.category === "branding"
                            ? `${dict.gallery.viewGiveawaysPdf} ↗`
                            : `${dict.gallery.viewBlueprint} ↗`}
                        </span>
                      </>
                    ) : (
                      <>
                        <Pencil className="w-3.5 h-3.5" />
                        <span>
                          {locale === "ar" ? "عرض التفاصيل" : "SEE MORE"}
                        </span>
                      </>
                    )}
                  </button>
                </motion.article>
              );
            })}

            {filteredProjects.length === 0 && (
              <div className="col-span-full py-12 text-center border-2 border-dashed border-black/30 dark:border-zinc-700 rounded-xl bg-white/50 dark:bg-[#151520]/50">
                <p className="font-headline font-bold text-sm text-black dark:text-zinc-200 mb-3">
                  {dict.gallery.noProjectsFound}
                </p>
                <button
                  onClick={() => setActiveFilter("all")}
                  className="px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-black text-xs uppercase rounded border-2 border-black comic-shadow-sm cursor-pointer"
                >
                  {galleryContent.filterAllLabel} ({projects.length})
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
                {galleryContent.spotlightHeadline}
              </KineticBrushWord>
            </h2>
            <span className="font-mono text-xs text-black/50 dark:text-zinc-400 ml-auto hidden sm:inline">
              {galleryContent.spotlightTag}
            </span>
          </ScrollReveal>

          <ScrollReveal
            direction="pop"
            distance={30}
            delay={0.1}
            className="relative bg-white dark:bg-[#151520] rounded-2xl border-3 border-black dark:border-zinc-700 p-6 md:p-8 comic-shadow overflow-hidden"
          >
            <div className="washi-tape-yellow absolute top-3 left-10 w-32 h-6 -rotate-2 z-10"></div>
            <div className="washi-tape-yellow absolute top-3 right-10 w-28 h-6 rotate-3 z-10"></div>

            <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
              {/* Left Column: Easel Blueprint Presentation */}
              <div className="lg:col-span-7 space-y-3">
                <div className="relative border-2 border-black dark:border-zinc-700 rounded-xl overflow-hidden comic-shadow-sm bg-white dark:bg-zinc-900 aspect-[16/11]">
                  <Image
                    src={galleryContent.spotlightImage}
                    alt={galleryContent.spotlightImageAlt}
                    fill
                    sizes="(max-width: 1024px) 100vw, 55vw"
                    className="object-cover"
                    unoptimized={
                      galleryContent.spotlightImage.startsWith("http") ||
                      galleryContent.spotlightImage.startsWith("data:")
                    }
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
                    {galleryContent.approachBadge}
                  </div>

                  {/* Sticky note quote box */}
                  <div className="my-4 p-3.5 bg-yellow-100 dark:bg-[#1e1e2c] rounded border-2 border-black dark:border-zinc-700 comic-shadow-sm relative">
                    <p className="font-headline font-bold text-xs sm:text-sm text-black dark:text-zinc-100 leading-snug">
                      &quot;{galleryContent.quoteText}&quot;
                    </p>
                    <div className="mt-2 text-right font-mono text-[10px] text-black/70 dark:text-zinc-400 font-bold">
                      {galleryContent.quoteAuthor}
                    </div>
                  </div>

                  {/* Workflow Checklist */}
                  <ul className="space-y-2.5 font-body text-xs sm:text-sm text-black/80 dark:text-zinc-300">
                    {workflowSteps.map((step, idx) => (
                      <li key={`${step.title}-${idx}`} className="flex items-start gap-2">
                        <span className="w-5 h-5 rounded bg-black dark:bg-yellow-400 text-yellow-400 dark:text-black flex items-center justify-center font-mono text-xs font-bold flex-shrink-0">
                          {step.stepNumber}
                        </span>
                        <span>
                          <strong>{step.title}:</strong> {step.description}
                        </span>
                      </li>
                    ))}
                  </ul>
                </div>

                <div className="pt-2">
                  <a
                    href="#brief-inquiry"
                    className="w-full inline-flex items-center justify-center gap-2 py-3 px-6 bg-black dark:bg-yellow-400 text-white dark:text-black hover:bg-yellow-400 hover:text-black dark:hover:bg-yellow-300 font-headline font-bold text-xs uppercase rounded border-2 border-black comic-shadow-sm transition-colors"
                  >
                    <span>{galleryContent.spotlightCtaText}</span>
                    <ArrowRight className="w-4 h-4 rtl:rotate-180" />
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
                {galleryContent.ctaTag}
              </span>
              <h2 className="text-2xl sm:text-4xl font-black font-headline uppercase tracking-tight text-black leading-tight mb-3">
                {galleryContent.ctaHeadlinePrefix}{" "}
                <KineticBrushWord variant="double" color="#111111" strokeWidth={2.4}>
                  {galleryContent.ctaHeadlineHighlight}
                </KineticBrushWord>
              </h2>
              <p className="font-body text-sm sm:text-base text-black/90 font-medium leading-relaxed mb-6">
                {galleryContent.ctaDescription}
              </p>

              {/* Action Buttons Cluster */}
              <div className="flex flex-wrap items-center gap-3">
                <Link
                  href="/#stage-04"
                  className="px-6 py-3 bg-black hover:bg-neutral-800 text-yellow-400 font-headline font-bold text-xs uppercase rounded border-2 border-black comic-shadow-sm flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <Send className="w-4 h-4" />
                  <span>{galleryContent.ctaPrimaryButtonText}</span>
                </Link>
                <a
                  href={`mailto:${contact.email}`}
                  className="px-6 py-3 bg-white hover:bg-yellow-100 text-black font-headline font-bold text-xs uppercase rounded border-2 border-black comic-shadow-sm flex items-center gap-2 active:scale-95 transition-transform"
                >
                  <span>
                    {galleryContent.ctaEmailPrefix}:{" "}
                    <span dir="ltr">{contact.email}</span>
                  </span>
                </a>
              </div>

              <div className="mt-6 pt-4 border-t border-black/20 flex flex-wrap items-center gap-4 font-mono text-xs text-black/80">
                <span>
                  {locale === "ar" ? "★ فريق واحد متكامل" : "★ ONE CONNECTED TEAM"}
                </span>
                <span>•</span>
                <span>📍 {contact.studioLocations}</span>
                <span>•</span>
                <span>
                  {locale === "ar"
                    ? "إبداع | تخطيط | إنتاج"
                    : "CREATIVE | PLANNING | PRODUCTION"}
                </span>
              </div>
            </div>
          </ScrollReveal>
        </section>
      </main>

      {/* ================= INTERACTIVE BLUEPRINT MODAL LIGHTBOX ================= */}
      <GalleryProjectModal
        project={selectedProject}
        onClose={() => setSelectedProject(null)}
      />

      {/* ================= STUDIO FOOTER (SHARED) ================= */}
      <StudioFooter layout={layout} />
    </>
  );
}
