"use client";

import React, { useEffect, useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { IntroLoader } from "@/components/cinematic/IntroLoader";
import { KineticDoodlesLayer } from "@/components/cinematic/KineticDoodlesLayer";
import { KineticMotionArrows } from "@/components/cinematic/KineticMotionArrows";
import { KineticPaintPen } from "@/components/cinematic/KineticPaintPen";
import { DeferredKinetic3DBackground } from "@/components/cinematic/DeferredKinetic3DBackground";
import { InteractiveDoodleCanvas } from "@/components/cinematic/InteractiveDoodleCanvas";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { soundFX } from "@/utils/soundFX";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";

import { DEFAULT_SITE_CONTENT } from "@art-work/database/content/default-content";
import {
  type ContactSectionContent,
  type CompanyRecord,
  DEFAULT_COMPANIES,
} from "@art-work/types";

import {
  type StageId,
  STAGE_ORDER,
  resolveHashToStage,
  DEFAULT_HERO_CONTENT,
  DEFAULT_WHY_US_CONTENT,
  StudioHeader,
  StudioFooter,
  ManifestoHero,
  WhyUsTeaser,
  ServicesStage,
  GalleryShowcaseStage,
  ContactSection,
  TheaterStageIndicator,
} from "@/components/home";

export default function Home() {
  const [activeStage, setActiveStage] = useState<StageId>("stage-01");
  const [heroContent, setHeroContent] = useState(DEFAULT_HERO_CONTENT);
  const [whyUsContent, setWhyUsContent] = useState(DEFAULT_WHY_US_CONTENT);
  const [contactContent, setContactContent] = useState(DEFAULT_SITE_CONTENT.contact);
  const [companies, setCompanies] = useState<CompanyRecord[]>(DEFAULT_COMPANIES);

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
          const isLegacy = teaser.bentoCards.some((c: { title?: string }) =>
            c.title?.includes("Arena & Stage") || c.title?.includes("Event Planning & Project") || c.title?.includes("Dynamic Motion")
          );
          setWhyUsContent({
            ...DEFAULT_WHY_US_CONTENT,
            ...teaser,
            bentoCards: isLegacy ? DEFAULT_WHY_US_CONTENT.bentoCards : teaser.bentoCards.slice(0, 3),
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

    fetch("/api/companies")
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json: { ok?: boolean; data?: CompanyRecord[] }) => {
        if (mounted && json?.ok && Array.isArray(json.data) && json.data.length > 0) {
          setCompanies(json.data);
        }
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
      const targetEl =
        document.getElementById(`${stage}-mobile`) ||
        document.getElementById(stage) ||
        (stage === "stage-04" ? document.getElementById("brief-inquiry") : null);
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

  // GLOBAL HASH ROUTER & INTERNAL ANCHOR NAVIGATION SYNCHRONIZER:
  // Handles incoming URL hashes like /#stage-04 or /#brief-inquiry as well as in-page anchor clicks
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const stage = resolveHashToStage(window.location.hash);
      if (stage) {
        scrollToStage(stage);
      }
    };

    // Immediate check on mount
    handleHash();

    // Secondary check once DOM layout and Lenis have hydrated
    const timer = setTimeout(handleHash, 180);

    // Listen for standard hashchange
    window.addEventListener("hashchange", handleHash);

    // Listen for custom navigation events
    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ stage: StageId }>;
      if (customEvent.detail?.stage) {
        scrollToStage(customEvent.detail.stage);
      }
    };
    window.addEventListener("artwork:navigate-stage", handleCustomNav);

    // Global document click delegator for any anchor tags targeting #stage-XX, #brief-inquiry, etc.
    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") || href.startsWith("/#")) {
        const hash = href.startsWith("/#") ? href.slice(2) : href.slice(1);
        const stage = resolveHashToStage(hash);
        if (stage) {
          e.preventDefault();
          if (window.location.hash !== `#${hash}`) {
            window.history.pushState(null, "", `#${hash}`);
          }
          scrollToStage(stage);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("artwork:navigate-stage", handleCustomNav);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [scrollToStage]);

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

      {/* Fixed Top Header (Shared Desktop & Mobile) */}
      <StudioHeader
        activeStage={activeStage}
        scrollToStage={scrollToStage}
        onInkBurst={triggerInkBurst}
      />

      {/* =========================================================================
          MOBILE RESPONSIVE SEQUENTIAL FLOW (Natural Unhindered Scrolling)
          ========================================================================= */}
      <div className="block md:hidden w-full relative z-10 pt-36 sm:pt-40">
        {/* Stage 01 Mobile */}
        <ScrollReveal direction="up" distance={30} viewportAmount={0.08}>
          <section
            id="stage-01-mobile"
            className="w-full min-h-[calc(100vh-8rem)] py-8 px-4 flex flex-col justify-center"
          >
            <ManifestoHero
              content={heroContent}
              companies={companies}
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
            <WhyUsTeaser content={whyUsContent} />
          </section>
        </ScrollReveal>

        {/* Stage 03 Mobile */}
        <ScrollReveal direction="up" distance={30} viewportAmount={0.08}>
          <section
            id="stage-03-mobile"
            className="w-full min-h-screen py-10 px-4 flex flex-col justify-center border-t-2 border-black/10"
          >
            <ServicesStage />
          </section>
        </ScrollReveal>

        {/* Stage Gallery Mobile (Featured Projects Showcase) */}
        <ScrollReveal direction="up" distance={30} viewportAmount={0.08}>
          <section
            id="stage-gallery-mobile"
            className="w-full min-h-screen py-10 px-4 flex flex-col justify-center border-t-2 border-black/10"
          >
            <GalleryShowcaseStage />
          </section>
        </ScrollReveal>

        {/* Stage 04 Mobile */}
        <ScrollReveal direction="up" distance={30} viewportAmount={0.08}>
          <section
            id="stage-04-mobile"
            className="w-full min-h-screen py-10 px-4 flex flex-col justify-center border-t-2 border-black/10"
          >
            <div id="brief-inquiry" className="w-full">
              <ContactSection content={contactContent} />
            </div>
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
        {/* STICKY FIXED VIEWPORT THEATER */}
        <div
          ref={theaterRef}
          className="sticky top-0 h-screen w-full overflow-hidden flex flex-col justify-between z-10 pt-[92px] sm:pt-[102px] lg:pt-[110px] pb-2"
        >
          {/* PINNED SCROLLYTELLING VERTICAL STAGE INDICATOR (Right Dock) */}
          <TheaterStageIndicator
            activeStage={activeStage}
            scrollToStage={scrollToStage}
          />

          {/* MAIN DYNAMIC SCENE CANVAS (Desktop Pinned & Morphing with AnimatePresence) */}
          <main
            ref={mainContainerRef}
            data-lenis-prevent="true"
            style={{ overscrollBehaviorY: "contain" }}
            className="flex-1 w-full min-h-0 relative overflow-y-auto overflow-x-hidden flex flex-col items-center px-4 sm:px-6 lg:px-8 pt-3 sm:pt-5 pb-6 no-scrollbar"
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
                  <ManifestoHero
                    content={heroContent}
                    companies={companies}
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
                  <WhyUsTeaser content={whyUsContent} />
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
                  <ServicesStage />
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
                  <GalleryShowcaseStage />
                </motion.div>
              )}

              {activeStage === "stage-04" && (
                <motion.div
                  key="scene-04"
                  id="stage-04"
                  initial={{ opacity: 0, y: 15, scale: 0.98 }}
                  animate={{ opacity: 1, y: 0, scale: 1 }}
                  exit={{ opacity: 0, y: -15, scale: 0.98 }}
                  transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
                  className="w-full flex-1 flex flex-col items-center justify-start"
                >
                  <div id="brief-inquiry" className="w-full">
                    <ContactSection content={contactContent} />
                  </div>
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
