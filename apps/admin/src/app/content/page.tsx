"use client";

import React, { useState } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import {
  Save,
  RotateCcw,
  CheckCircle2,
  AlertCircle,
  FileText,
  Layers,
  Phone,
  Compass,
  ExternalLink,
} from "lucide-react";
import { SiteContent } from "@art-work/types";

export default function WebsiteContentEditor() {
  const [activeSection, setActiveSection] = useState<"manifesto" | "teaser" | "contact" | "whyUs">("manifesto");
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);

  // Form State
  const [manifesto, setManifesto] = useState({
    announcementBadge: "MARKETING SOLUTIONS FOR KINETIC BRANDS",
    editionBadge: "EDITION 2025",
    headlinePart1: "CREATIVE IDEAS.",
    headlinePart2: "REAL IMPACT.",
    introParagraph: "We are Art Work: an interdisciplinary marketing and experiential design collective translating bold cultural visions into arena-scale reality.",
    primaryCtaText: "EXPLORE SHOWREEL",
    secondaryCtaText: "VIEW CAPABILITIES",
    metric1Num: "450+",
    metric1Label: "Arena Shows",
    metric2Num: "99.4%",
    metric2Label: "Cue Accuracy",
    metric3Num: "1.2M+",
    metric3Label: "Live Reach",
  });

  const [whyUsTeaser, setWhyUsTeaser] = useState({
    eyebrow: "02 WHY ART WORK",
    headline: "ENGINEERED FOR STAGE & SCALE.",
    exploreCtaText: "EXPLORE FULL WHY US",
    blueprintTitle: "FROM SKETCHBOARD TO LIVE VENUE IN 72 HOURS.",
    blueprintDesc: "We prototype spatial structures, truss configurations, projector lines of sight, and booth flows in real-time.",
  });

  const [contact, setContact] = useState({
    stageTag: "STAGE 04 // LAUNCH YOUR CAMPAIGN",
    headline: "LET’S INK SOMETHING HISTORIC.",
    description: "Whether you need a dynamic stage package for an arena tour or an unforgettable brand identity, our sketchpad is open.",
    intakeLabel: "DIRECT INTAKE // CREATIVE CHIEF ON-CALL",
    email: "studio@artwork-solutions.stage",
    phone: "+1 (800) ART-WORK // DMX-EXT: 04",
    studioLocations: "BERLIN // NEW YORK // TOKYO",
    submitButtonText: "TRANSMIT BRIEF // LAUNCH STAGE",
  });

  const [whyUsPage, setWhyUsPage] = useState({
    heroHeadlineRow1: "WHY",
    heroHeadlineRow2: "US?",
    sceneBadge: "SCENE // 02",
    statusBadge: "STATUS: 100% UNAPOLOGETIC",
    roiBadge: "PERFORMANCE MARKETING (+340% ROI)",
    presentationTitle: "CREATIVE CHIEF ON-CALL // CONCEPT INTAKE",
    presentationSubtitle: "From wet fountain pen on raw grid paper to arena execution.",
  });

  const handleFieldChange = () => {
    setIsDirty(true);
    setIsSaved(false);
  };

  const handleSave = () => {
    setIsSaved(true);
    setIsDirty(false);
    setTimeout(() => setIsSaved(false), 3000);
  };

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Website Content Editor"
        subtitle="Manage live copy, headings, and proof metrics across public routes"
        action={
          <div className="flex items-center gap-3">
            {isDirty && (
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Unsaved Edits</span>
              </span>
            )}
            {isSaved && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Changes Published</span>
              </span>
            )}
            <button
              onClick={handleSave}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all shadow-[2px_2px_0px_#ffffff] cursor-pointer"
            >
              <Save className="w-3.5 h-3.5" />
              <span>Save & Publish</span>
            </button>
          </div>
        }
      />

      <main className="p-8 max-w-5xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#151520] rounded-xl border border-[#262638] w-fit">
          <button
            onClick={() => setActiveSection("manifesto")}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              activeSection === "manifesto"
                ? "bg-yellow-400 text-black font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            01 Home Manifesto
          </button>
          <button
            onClick={() => setActiveSection("teaser")}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              activeSection === "teaser"
                ? "bg-yellow-400 text-black font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            02 Why-Us Teaser
          </button>
          <button
            onClick={() => setActiveSection("contact")}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              activeSection === "contact"
                ? "bg-yellow-400 text-black font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            03 Contact Section
          </button>
          <button
            onClick={() => setActiveSection("whyUs")}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all ${
              activeSection === "whyUs"
                ? "bg-yellow-400 text-black font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            04 Why-Us Page
          </button>
        </div>

        {/* Section 1: Home Manifesto */}
        {activeSection === "manifesto" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  SCENE 01: HERO & MANIFESTO COPY
                </h3>
                <p className="text-xs text-zinc-400">Target route: /#stage-01</p>
              </div>
              <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                Primary Hero
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Headline Part 1</label>
                <input
                  type="text"
                  value={manifesto.headlinePart1}
                  onChange={(e) => {
                    setManifesto({ ...manifesto, headlinePart1: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Headline Part 2</label>
                <input
                  type="text"
                  value={manifesto.headlinePart2}
                  onChange={(e) => {
                    setManifesto({ ...manifesto, headlinePart2: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Introduction Paragraph</label>
              <textarea
                rows={3}
                value={manifesto.introParagraph}
                onChange={(e) => {
                  setManifesto({ ...manifesto, introParagraph: e.target.value });
                  handleFieldChange();
                }}
                className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 leading-relaxed"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Primary CTA Label</label>
                <input
                  type="text"
                  value={manifesto.primaryCtaText}
                  onChange={(e) => {
                    setManifesto({ ...manifesto, primaryCtaText: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Secondary CTA Label</label>
                <input
                  type="text"
                  value={manifesto.secondaryCtaText}
                  onChange={(e) => {
                    setManifesto({ ...manifesto, secondaryCtaText: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            {/* Proof Metrics */}
            <div className="pt-3 border-t border-[#262638]">
              <label className="block text-xs font-mono text-zinc-400 mb-3 font-semibold uppercase">
                PROOF METRIC TICKERS (3 UNITS)
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <div className="p-3 bg-[#0d0d12] rounded-xl border border-[#2b2b3d]">
                  <input
                    type="text"
                    value={manifesto.metric1Num}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric1Num: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-sm font-bold text-yellow-400 mb-1 focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    value={manifesto.metric1Label}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric1Label: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-xs text-zinc-400 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-[#0d0d12] rounded-xl border border-[#2b2b3d]">
                  <input
                    type="text"
                    value={manifesto.metric2Num}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric2Num: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-sm font-bold text-yellow-400 mb-1 focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    value={manifesto.metric2Label}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric2Label: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-xs text-zinc-400 focus:outline-none"
                  />
                </div>

                <div className="p-3 bg-[#0d0d12] rounded-xl border border-[#2b2b3d]">
                  <input
                    type="text"
                    value={manifesto.metric3Num}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric3Num: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-sm font-bold text-yellow-400 mb-1 focus:outline-none font-mono"
                  />
                  <input
                    type="text"
                    value={manifesto.metric3Label}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric3Label: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-xs text-zinc-400 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Why Us Teaser */}
        {activeSection === "teaser" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  SCENE 02: WHY-US TEASER & BLUEPRINT
                </h3>
                <p className="text-xs text-zinc-400">Target route: /#stage-02</p>
              </div>
              <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                Bento Cards & Blueprint
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Section Eyebrow</label>
                <input
                  type="text"
                  value={whyUsTeaser.eyebrow}
                  onChange={(e) => {
                    setWhyUsTeaser({ ...whyUsTeaser, eyebrow: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Section Headline</label>
                <input
                  type="text"
                  value={whyUsTeaser.headline}
                  onChange={(e) => {
                    setWhyUsTeaser({ ...whyUsTeaser, headline: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Blueprint Title</label>
              <input
                type="text"
                value={whyUsTeaser.blueprintTitle}
                onChange={(e) => {
                  setWhyUsTeaser({ ...whyUsTeaser, blueprintTitle: e.target.value });
                  handleFieldChange();
                }}
                className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">Blueprint Supporting Paragraph</label>
              <textarea
                rows={2}
                value={whyUsTeaser.blueprintDesc}
                onChange={(e) => {
                  setWhyUsTeaser({ ...whyUsTeaser, blueprintDesc: e.target.value });
                  handleFieldChange();
                }}
                className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 leading-relaxed"
              />
            </div>
          </div>
        )}

        {/* Section 3: Contact */}
        {activeSection === "contact" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  SCENE 04: CLIENT INTAKE & CONTACT
                </h3>
                <p className="text-xs text-zinc-400">Target route: /#stage-04</p>
              </div>
              <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                Lead Intake
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Contact Headline</label>
                <input
                  type="text"
                  value={contact.headline}
                  onChange={(e) => {
                    setContact({ ...contact, headline: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Stage Tag</label>
                <input
                  type="text"
                  value={contact.stageTag}
                  onChange={(e) => {
                    setContact({ ...contact, stageTag: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 sm:grid-cols-3 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Direct Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => {
                    setContact({ ...contact, email: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Studio Phone</label>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) => {
                    setContact({ ...contact, phone: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Studio Hubs</label>
                <input
                  type="text"
                  value={contact.studioLocations}
                  onChange={(e) => {
                    setContact({ ...contact, studioLocations: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 4: Why Us Page */}
        {activeSection === "whyUs" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  STANDALONE WHY-US PROPOSITION
                </h3>
                <p className="text-xs text-zinc-400">Target route: /why-us</p>
              </div>
              <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                Agency Proof
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Hero Title Row 1</label>
                <input
                  type="text"
                  value={whyUsPage.heroHeadlineRow1}
                  onChange={(e) => {
                    setWhyUsPage({ ...whyUsPage, heroHeadlineRow1: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Hero Title Row 2</label>
                <input
                  type="text"
                  value={whyUsPage.heroHeadlineRow2}
                  onChange={(e) => {
                    setWhyUsPage({ ...whyUsPage, heroHeadlineRow2: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Presentation Heading</label>
                <input
                  type="text"
                  value={whyUsPage.presentationTitle}
                  onChange={(e) => {
                    setWhyUsPage({ ...whyUsPage, presentationTitle: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">Presentation Subtitle</label>
                <input
                  type="text"
                  value={whyUsPage.presentationSubtitle}
                  onChange={(e) => {
                    setWhyUsPage({ ...whyUsPage, presentationSubtitle: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>
        )}
      </main>
    </div>
  );
}
