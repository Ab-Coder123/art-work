"use client";

import React, { useEffect } from "react";
import dynamic from "next/dynamic";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";
import { useTheaterStageController } from "@/hooks/useTheaterStageController";
import { useShowcaseStore } from "@/store/useShowcaseStore";

import {
  StudioHeader,
  StudioFooter,
  ManifestoHero,
  WhyUsTeaser,
  TheaterStageIndicator,
} from "@/components/home";
import { StageLoadingSkeleton } from "./StageLoadingSkeleton";
import type { InitialHomeData } from "./server";

/* =========================================================================
   BUNDLE SLICING VIA NEXT/DYNAMIC
   Heavy stage components & cinematic interactive canvas modules are lazy loaded
   to dramatically reduce the initial bundle size and boost Core Web Vitals (LCP/TBT).
   ========================================================================= */

const ServicesStage = dynamic(
  () => import("./ServicesStage").then((m) => m.ServicesStage),
  {
    ssr: false,
    loading: () => <StageLoadingSkeleton title="SERVICES & CAPABILITIES MATRIX" />,
  }
);

const GalleryShowcaseStage = dynamic(
  () => import("./GalleryShowcaseStage").then((m) => m.GalleryShowcaseStage),
  {
    ssr: true,
    loading: () => <StageLoadingSkeleton title="SELECTED PROJECTS ARCHIVE" />,
  }
);

const ContactSection = dynamic(
  () => import("./ContactSection").then((m) => m.ContactSection),
  {
    ssr: false,
    loading: () => <StageLoadingSkeleton title="PROJECT BRIEF & INTAKE" />,
  }
);

const IntroLoader = dynamic(
  () => import("@/components/cinematic/IntroLoader").then((m) => m.IntroLoader),
  { ssr: false }
);

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

const KineticDoodlesLayer = dynamic(
  () =>
    import("@/components/cinematic/KineticDoodlesLayer").then(
      (m) => m.KineticDoodlesLayer
    ),
  { ssr: false }
);

const KineticMotionArrows = dynamic(
  () =>
    import("@/components/cinematic/KineticMotionArrows").then(
      (m) => m.KineticMotionArrows
    ),
  { ssr: false }
);

const KineticParticleCanvas = dynamic(
  () =>
    import("@/components/cinematic/KineticParticleCanvas").then(
      (m) => m.KineticParticleCanvas
    ),
  { ssr: false }
);

export interface HomeTheaterControllerProps {
  initialData: InitialHomeData;
}

export function HomeTheaterController({ initialData }: HomeTheaterControllerProps) {
  const {
    activeStage,
    scrollToStage,
    trackRef,
    mainContainerRef,
    triggerInkBurst,
  } = useTheaterStageController();

  const storeSiteContent = useShowcaseStore((s) => s.siteContent);
  const storeCompanies = useShowcaseStore((s) => s.companies);
  const storeProjects = useShowcaseStore((s) => s.projects);
  const hasSyncedLive = useShowcaseStore((s) => s.hasSyncedLive);
  const hasHydratedServerData = useShowcaseStore((s) => s.hasHydratedServerData);
  const hydrateFromServer = useShowcaseStore((s) => s.hydrateFromServer);
  const ensureFreshData = useShowcaseStore((s) => s.ensureFreshData);

  // Hydrate centralized Zustand store from SSR initialData & deduplicate background freshness sync
  useEffect(() => {
    hydrateFromServer(initialData);
    void ensureFreshData();
  }, [initialData, hydrateFromServer, ensureFreshData]);

  // Use SSR props during initial hydration pass to guarantee 0 hydration mismatches, then bind to Zustand store
  const useStoreData = hasSyncedLive || hasHydratedServerData;
  const heroContent = useStoreData ? storeSiteContent.manifesto : initialData.heroContent;
  const whyUsContent = useStoreData ? storeSiteContent.whyUsTeaser : initialData.whyUsContent;
  const servicesContent = useStoreData ? storeSiteContent.services : initialData.servicesContent;
  const homeShowcaseContent = useStoreData
    ? storeSiteContent.homeShowcase
    : initialData.homeShowcaseContent;
  const contactContent = useStoreData ? storeSiteContent.contact : initialData.contactContent;
  const layoutContent = useStoreData ? storeSiteContent.layout : initialData.layoutContent;
  const companies = useStoreData ? storeCompanies : initialData.companies;
  const projects = useStoreData ? storeProjects : initialData.projects;

  const handleExploreShowreel = React.useCallback(() => {
    scrollToStage("stage-gallery");
  }, [scrollToStage]);

  const handleViewCapabilities = React.useCallback(() => {
    scrollToStage("stage-03");
  }, [scrollToStage]);

  return (
    <>
      <IntroLoader />

      {/* Real 3D Kinetic Three.js Background with Auto-Synced Scroll Motion */}
      <DeferredKinetic3DBackground />

      {/* Kinetic Doodles Layer in Safe Margins */}
      <KineticDoodlesLayer />

      {/* Kinetic Motion Arrows Layer in Background */}
      <KineticMotionArrows />

      {/* High-Performance 60FPS Disappearing Ink Doodle Canvas */}
      <InteractiveDoodleCanvas />

      {/* Zero-DOM Pooled 2D Canvas Particle Engine */}
      <KineticParticleCanvas />

      {/* Dot Grid Sketchpad Canvas */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0"></div>

      {/* Fixed Top Header (Shared Desktop & Mobile) */}
      <StudioHeader
        activeStage={activeStage}
        scrollToStage={scrollToStage}
        onInkBurst={triggerInkBurst}
        layout={layoutContent}
        whatsappPhone={contactContent?.phone}
      />

      {/* =========================================================================
          UNIFIED CONTINUOUS SMOOTH SCROLLING FLOW (Desktop & Mobile)
          ========================================================================= */}
      <div
        ref={trackRef}
        id="pinned-stage-track"
        className="w-full relative z-10 pt-[89px] sm:pt-[104px] lg:pt-[119px] no-scrollbar"
      >
        {/* VERTICAL STAGE INDICATOR (Desktop Right Dock) */}
        <div className="hidden md:block">
          <TheaterStageIndicator
            activeStage={activeStage}
            scrollToStage={scrollToStage}
          />
        </div>

        <main
          ref={mainContainerRef}
          className="w-full flex flex-col items-center px-4 sm:px-6 lg:px-8 space-y-12 sm:space-y-16 pb-12 no-scrollbar"
        >
          {/* Stage 01: Hero Manifesto */}
          <ScrollReveal direction="up" distance={30} viewportAmount={0.08} className="w-full">
            <section
              id="stage-01"
              className="w-full min-h-[calc(100vh-7rem)] pt-5 sm:pt-7 pb-6 sm:pb-8 flex flex-col justify-center"
            >
              <ManifestoHero
                content={heroContent}
                companies={companies}
                onExploreShowreel={handleExploreShowreel}
                onViewCapabilities={handleViewCapabilities}
              />
            </section>
          </ScrollReveal>

          {/* Stage 02: Why Us Teaser */}
          <ScrollReveal direction="up" distance={30} viewportAmount={0.08} className="w-full">
            <section
              id="stage-02"
              className="w-full py-10 sm:py-14 flex flex-col justify-center"
            >
              <WhyUsTeaser content={whyUsContent} />
            </section>
          </ScrollReveal>

          {/* Stage 03: Services Matrix */}
          <ScrollReveal direction="up" distance={30} viewportAmount={0.08} className="w-full">
            <section
              id="stage-03"
              className="w-full py-10 sm:py-14 flex flex-col justify-center"
            >
              <ServicesStage content={servicesContent} />
            </section>
          </ScrollReveal>

          {/* Stage Gallery: Featured Projects & Star Videos Showcase */}
          <ScrollReveal direction="up" distance={30} viewportAmount={0.08} className="w-full">
            <section
              id="stage-gallery"
              className="w-full py-10 sm:py-14 flex flex-col justify-center"
            >
              <GalleryShowcaseStage
                content={homeShowcaseContent}
                initialProjects={projects}
              />
            </section>
          </ScrollReveal>

          {/* Stage 04: Brief Intake & Contact */}
          <ScrollReveal direction="up" distance={30} viewportAmount={0.08} className="w-full">
            <section
              id="stage-04"
              className="w-full py-10 sm:py-14 flex flex-col justify-center"
            >
              <div id="brief-inquiry" className="w-full">
                <ContactSection content={contactContent} />
              </div>
            </section>
          </ScrollReveal>
        </main>

        {/* Unified Smooth Page Footer */}
        <StudioFooter scrollToStage={scrollToStage} layout={layoutContent} />
      </div>
    </>
  );
}
