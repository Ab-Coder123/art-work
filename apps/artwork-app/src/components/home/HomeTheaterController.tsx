"use client";

import React, { useEffect, useState } from "react";
import dynamic from "next/dynamic";
import { motion } from "framer-motion";
import { useTheaterStageController } from "@/hooks/useTheaterStageController";

import {
  StudioHeader,
  StudioFooter,
  ManifestoHero,
  WhyUsTeaser,
  FloatingContactFab,
  FeaturedInsightsSection,
  CaseStudiesStatsSection,
  MarketGuidesSection,
  LatestInsightsBlogSection,
  IndustryExpertiseSection,
  FaqAccordionSection,
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
    mainContainerRef,
    triggerInkBurst,
  } = useTheaterStageController();

  const [heroContent, setHeroContent] = useState(initialData.heroContent);
  const [whyUsContent, setWhyUsContent] = useState(initialData.whyUsContent);
  const [servicesContent, setServicesContent] = useState(initialData.servicesContent);
  const [homeShowcaseContent, setHomeShowcaseContent] = useState(initialData.homeShowcaseContent);
  const [contactContent, setContactContent] = useState(initialData.contactContent);
  const [layoutContent, setLayoutContent] = useState(initialData.layoutContent);
  const [companies, setCompanies] = useState(initialData.companies);
  const [projects, setProjects] = useState(initialData.projects);

  // Background content & ★ Starred projects freshness re-synchronization
  useEffect(() => {
    let mounted = true;

    fetch("/api/content", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((siteContent) => {
        if (!mounted || !siteContent) return;
        if (siteContent.manifesto) {
          setHeroContent((prev) => ({ ...prev, ...siteContent.manifesto }));
        }
        if (siteContent.whyUsTeaser) {
          setWhyUsContent((prev) => ({
            ...prev,
            ...siteContent.whyUsTeaser,
            blueprint: { ...prev.blueprint, ...(siteContent.whyUsTeaser.blueprint || {}) },
          }));
        }
        if (siteContent.services) {
          setServicesContent((prev) => ({ ...prev, ...siteContent.services }));
        }
        if (siteContent.homeShowcase) {
          setHomeShowcaseContent((prev) => ({ ...prev, ...siteContent.homeShowcase }));
        }
        if (siteContent.contact) {
          setContactContent((prev) => ({ ...prev, ...siteContent.contact }));
        }
        if (siteContent.layout) {
          setLayoutContent((prev) => ({ ...prev, ...siteContent.layout }));
        }
      })
      .catch(() => {});

    fetch("/api/companies", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        if (mounted && json?.ok && Array.isArray(json.data) && json.data.length > 0) {
          setCompanies(json.data);
        }
      })
      .catch(() => {});

    fetch("/api/projects?limit=24", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : Promise.reject()))
      .then((json) => {
        if (mounted && Array.isArray(json?.items) && json.items.length > 0) {
          setProjects(json.items);
        }
      })
      .catch(() => {});

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
        whatsappPhone={contactContent.phone}
      />

      {/* =========================================================================
          CONTINUOUS ULTRA-MODERN LANDING PAGE (Exact Layout from EKO Screenshot)
          Unlocks full vertical storytelling across both desktop & mobile viewports.
          ========================================================================= */}
      <main
        ref={mainContainerRef}
        className="w-full relative z-10 overflow-x-hidden no-scrollbar flex flex-col items-center bg-transparent"
      >
        {/* 01: HERO & CLIENT NETWORK TICKER & 4 VALUE PILLARS */}
        <section id="stage-01" className="w-full">
          <ManifestoHero
            content={heroContent}
            companies={companies}
            onExploreShowreel={() => scrollToStage("stage-gallery")}
            onViewCapabilities={() => scrollToStage("stage-03")}
          />
        </section>

        {/* 02: FEATURED INSIGHTS (2 Big Cards: Top Event Studios & Top Turnkey) */}
        <motion.section
          id="insights"
          className="w-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <FeaturedInsightsSection />
        </motion.section>

        {/* 03: WHY US & METHODOLOGY STAGE */}
        <motion.section
          id="stage-02"
          className="w-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <WhyUsTeaser content={whyUsContent} />
        </motion.section>

        {/* 04: SERVICES YOU GET (Tabbed Bento Grid & Production Engine Stack) */}
        <motion.section
          id="stage-03"
          className="w-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <ServicesStage content={servicesContent} />
        </motion.section>

        {/* 05: SELECTED WORK (Projects That Deliver Results & Video Theater) */}
        <motion.section
          id="stage-gallery"
          className="w-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <GalleryShowcaseStage
            content={homeShowcaseContent}
            initialProjects={projects}
          />
        </motion.section>

        {/* 06: CASE STUDIES (Real Clients. Measured Results) */}
        <motion.section
          id="case-studies"
          className="w-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <CaseStudiesStatsSection />
        </motion.section>

        {/* 07: MARKET GUIDES (Egypt & Saudi Arabia Expertise) */}
        <motion.section
          id="market-guides"
          className="w-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <MarketGuidesSection />
        </motion.section>

        {/* 08: LATEST FROM ART WORK (Blog / Annual Reports) */}
        <motion.section
          id="blog"
          className="w-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <LatestInsightsBlogSection />
        </motion.section>

        {/* 09: INDUSTRY EXPERTISE & OUR OFFICES */}
        <motion.section
          id="industries"
          className="w-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <IndustryExpertiseSection
            whatsappPhone={contactContent.phone}
            email={contactContent.email}
          />
        </motion.section>

        {/* 10: FREQUENTLY ASKED QUESTIONS (Accordion) */}
        <motion.section
          id="faq"
          className="w-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.12 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <FaqAccordionSection />
        </motion.section>

        {/* 11: GET YOUR CUSTOM EVENT PLAN & DIRECT BRIEF INTAKE */}
        <motion.section
          id="stage-04"
          className="w-full"
          initial={{ opacity: 0, y: 32 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: false, amount: 0.1 }}
          transition={{ duration: 0.55, ease: [0.16, 1, 0.3, 1] }}
        >
          <div id="brief-inquiry" className="w-full">
            <ContactSection content={contactContent} />
          </div>
        </motion.section>

        {/* 12: STUDIO FOOTER */}
        <StudioFooter scrollToStage={scrollToStage} layout={layoutContent} />
      </main>

      {/* Floating EKO-Style Quick Contact Actions (WhatsApp + Brief FABs) */}
      <FloatingContactFab
        whatsappPhone={contactContent.phone}
        onOpenBrief={() => scrollToStage("stage-04")}
      />
    </>
  );
}
