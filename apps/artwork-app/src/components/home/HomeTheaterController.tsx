"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";
import { useTheaterStageController } from "@/hooks/useTheaterStageController";

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

const KineticPaintPen = dynamic(
  () =>
    import("@/components/cinematic/KineticPaintPen").then((m) => m.KineticPaintPen),
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

  const [homeData, setHomeData] = useState<InitialHomeData>(initialData);

  const {
    heroContent,
    whyUsContent,
    servicesContent,
    homeShowcaseContent,
    contactContent,
    layoutContent,
    companies,
    projects,
  } = homeData;

  // Background content & ★ Starred projects freshness re-synchronization in a single parallel batch
  useEffect(() => {
    let mounted = true;

    Promise.allSettled([
      fetch("/api/content", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/companies", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
      fetch("/api/projects?limit=24", { cache: "no-store" }).then((r) => (r.ok ? r.json() : null)),
    ]).then(([contentRes, companiesRes, projectsRes]) => {
      if (!mounted) return;

      const siteContent = contentRes.status === "fulfilled" ? contentRes.value : null;
      const companiesPayload = companiesRes.status === "fulfilled" ? companiesRes.value : null;
      const projectsPayload = projectsRes.status === "fulfilled" ? projectsRes.value : null;

      const newCompanies =
        companiesPayload?.ok && Array.isArray(companiesPayload.data) && companiesPayload.data.length > 0
          ? companiesPayload.data
          : null;
      const newProjects =
        Array.isArray(projectsPayload?.items) && projectsPayload.items.length > 0
          ? projectsPayload.items
          : null;

      if (!siteContent && !newCompanies && !newProjects) return;

      setHomeData((prev) => ({
        ...prev,
        heroContent: siteContent?.manifesto ? { ...prev.heroContent, ...siteContent.manifesto } : prev.heroContent,
        whyUsContent: siteContent?.whyUsTeaser
          ? {
              ...prev.whyUsContent,
              ...siteContent.whyUsTeaser,
              blueprint: {
                ...prev.whyUsContent.blueprint,
                ...(siteContent.whyUsTeaser.blueprint || {}),
              },
            }
          : prev.whyUsContent,
        servicesContent: siteContent?.services ? { ...prev.servicesContent, ...siteContent.services } : prev.servicesContent,
        homeShowcaseContent: siteContent?.homeShowcase ? { ...prev.homeShowcaseContent, ...siteContent.homeShowcase } : prev.homeShowcaseContent,
        contactContent: siteContent?.contact ? { ...prev.contactContent, ...siteContent.contact } : prev.contactContent,
        layoutContent: siteContent?.layout ? { ...prev.layoutContent, ...siteContent.layout } : prev.layoutContent,
        companies: newCompanies || prev.companies,
        projects: newProjects || prev.projects,
      }));
    });

    return () => {
      mounted = false;
    };
  }, []);

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
        className="w-full relative z-10 pt-24 sm:pt-28 lg:pt-32 no-scrollbar"
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
          className="w-full flex flex-col items-center px-3 sm:px-5 lg:px-6 space-y-12 sm:space-y-16 pb-12 no-scrollbar"
        >
          {/* Stage 01: Hero Manifesto */}
          <ScrollReveal direction="up" distance={30} viewportAmount={0.08} className="w-full">
            <section
              id="stage-01"
              className="w-full min-h-[calc(100vh-7rem)] py-6 sm:py-8 flex flex-col justify-center"
            >
              <ManifestoHero
                content={heroContent}
                companies={companies}
                onExploreShowreel={() => scrollToStage("stage-gallery")}
                onViewCapabilities={() => scrollToStage("stage-03")}
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
