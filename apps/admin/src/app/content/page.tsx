"use client";

import React, { useState, useEffect, useRef } from "react";
import { AdminHeader } from "@/components/AdminHeader";
import {
  Save,
  CheckCircle2,
  AlertCircle,
  History,
  RotateCcw,
  Clock,
  User,
  X,
  Loader2,
} from "lucide-react";
import type { SiteContent } from "@art-work/types";
import { apiFetchWithCsrf } from "@/lib/csrf";
import { DEFAULT_SITE_CONTENT } from "@art-work/database/content/default-content";

interface RevisionItem {
  id: string;
  sectionKey: string;
  action: string;
  actorEmail: string;
  createdAt: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
}

export default function WebsiteContentEditor() {
  const loadedContentRef = useRef<SiteContent>(DEFAULT_SITE_CONTENT);
  const [activeSection, setActiveSection] = useState<
    "manifesto" | "teaser" | "contact" | "whyUs"
  >("manifesto");
  const [isSaved, setIsSaved] = useState(false);
  const [isDirty, setIsDirty] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [isSaving, setIsSaving] = useState(false);
  const [errorMessage, setErrorMessage] = useState<string | null>(null);

  // Revision History State
  const [isHistoryOpen, setIsHistoryOpen] = useState(false);
  const [revisions, setRevisions] = useState<RevisionItem[]>([]);
  const [isLoadingHistory, setIsLoadingHistory] = useState(false);
  const [rollingBackId, setRollingBackId] = useState<string | null>(null);

  // Form State
  const [manifesto, setManifesto] = useState({
    announcementBadge: "MARKETING SOLUTIONS FOR KINETIC BRANDS",
    editionBadge: "EDITION 2026",
    headlinePart1: "CREATIVE IDEAS.",
    headlinePart2: "REAL IMPACT.",
    introParagraph:
      "We are Art Work: an interdisciplinary marketing and experiential design collective translating bold cultural visions into arena-scale reality.",
    primaryCtaText: "EXPLORE SHOWREEL",
    secondaryCtaText: "VIEW CAPABILITIES",
    metric1Num: "450+",
    metric1Label: "Arena Shows",
    metric2Num: "99.4%",
    metric2Label: "Cue Accuracy",
    metric3Num: "1.2M+",
    metric3Label: "Live Reach",
    stickyNote: "DIRECTOR NOTE: UNCONVENTIONAL EXPERIENCES ONLY",
  });

  const [whyUsTeaser, setWhyUsTeaser] = useState({
    eyebrow: "02 WHY ART WORK",
    headline: "ENGINEERED FOR STAGE & SCALE.",
    exploreCtaText: "EXPLORE FULL WHY US",
    blueprintTitle: "FROM SKETCHBOARD TO LIVE VENUE IN 72 HOURS.",
    blueprintDesc:
      "We prototype spatial structures, truss configurations, projector lines of sight, and booth flows in real-time.",
  });

  const [contact, setContact] = useState({
    stageTag: "STAGE 04 // LAUNCH YOUR CAMPAIGN",
    headline: "LET’S INK SOMETHING HISTORIC.",
    description:
      "Whether you need a dynamic stage package for an arena tour or an unforgettable brand identity, our sketchpad is open.",
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
    presentationSubtitle:
      "From wet fountain pen on raw grid paper to arena execution.",
  });

  // Populate from Backend on initial mount
  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/content", { cache: "no-store" });
        if (!res.ok) throw new Error(`HTTP ${res.status}`);
        const data: SiteContent = await res.json();
        if (!mounted) return;
        loadedContentRef.current = data;

        if (data.manifesto) {
          setManifesto({
            announcementBadge: data.manifesto.announcementBadge || "",
            editionBadge: data.manifesto.editionBadge || "",
            headlinePart1: data.manifesto.headlinePart1 || "",
            headlinePart2: data.manifesto.headlinePart2 || "",
            introParagraph: data.manifesto.introParagraph || "",
            primaryCtaText: data.manifesto.primaryCtaText || "",
            secondaryCtaText: data.manifesto.secondaryCtaText || "",
            metric1Num: data.manifesto.metrics?.[0]?.num || "450+",
            metric1Label: data.manifesto.metrics?.[0]?.label || "Arena Shows",
            metric2Num: data.manifesto.metrics?.[1]?.num || "99.4%",
            metric2Label: data.manifesto.metrics?.[1]?.label || "Cue Accuracy",
            metric3Num: data.manifesto.metrics?.[2]?.num || "1.2M+",
            metric3Label: data.manifesto.metrics?.[2]?.label || "Live Reach",
            stickyNote: data.manifesto.stickyNote || "",
          });
        }

        if (data.whyUsTeaser) {
          setWhyUsTeaser({
            eyebrow: data.whyUsTeaser.eyebrow || "",
            headline: data.whyUsTeaser.headline || "",
            exploreCtaText: data.whyUsTeaser.exploreCtaText || "",
            blueprintTitle: data.whyUsTeaser.blueprint?.title || "",
            blueprintDesc: data.whyUsTeaser.blueprint?.description || "",
          });
        }

        if (data.contact) {
          setContact({
            stageTag: data.contact.stageTag || "",
            headline: data.contact.headline || "",
            description: data.contact.description || "",
            intakeLabel: data.contact.intakeLabel || "",
            email: data.contact.email || "",
            phone: data.contact.phone || "",
            studioLocations: data.contact.studioLocations || "",
            submitButtonText: data.contact.submitButtonText || "",
          });
        }

        if (data.whyUsPage) {
          setWhyUsPage({
            heroHeadlineRow1: data.whyUsPage.heroHeadlineRow1 || "",
            heroHeadlineRow2: data.whyUsPage.heroHeadlineRow2 || "",
            sceneBadge: data.whyUsPage.sceneBadge || "",
            statusBadge: data.whyUsPage.statusBadge || "",
            roiBadge: data.whyUsPage.roiBadge || "",
            presentationTitle: data.whyUsPage.presentationTitle || "",
            presentationSubtitle: data.whyUsPage.presentationSubtitle || "",
          });
        }
      } catch (err) {
        console.error("Failed to load content:", err);
        if (mounted) {
          setErrorMessage("Could not connect to live content API. Showing cached defaults.");
        }
      } finally {
        if (mounted) {
          setIsLoading(false);
        }
      }
    })();

    return () => {
      mounted = false;
    };
  }, []);

  const refreshContent = async () => {
    try {
      const res = await fetch("/api/content", { cache: "no-store" });
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data: SiteContent = await res.json();
      loadedContentRef.current = data;

      if (data.manifesto) {
        setManifesto({
          announcementBadge: data.manifesto.announcementBadge || "",
          editionBadge: data.manifesto.editionBadge || "",
          headlinePart1: data.manifesto.headlinePart1 || "",
          headlinePart2: data.manifesto.headlinePart2 || "",
          introParagraph: data.manifesto.introParagraph || "",
          primaryCtaText: data.manifesto.primaryCtaText || "",
          secondaryCtaText: data.manifesto.secondaryCtaText || "",
          metric1Num: data.manifesto.metrics?.[0]?.num || "450+",
          metric1Label: data.manifesto.metrics?.[0]?.label || "Arena Shows",
          metric2Num: data.manifesto.metrics?.[1]?.num || "99.4%",
          metric2Label: data.manifesto.metrics?.[1]?.label || "Cue Accuracy",
          metric3Num: data.manifesto.metrics?.[2]?.num || "1.2M+",
          metric3Label: data.manifesto.metrics?.[2]?.label || "Live Reach",
          stickyNote: data.manifesto.stickyNote || "",
        });
      }

      if (data.whyUsTeaser) {
        setWhyUsTeaser({
          eyebrow: data.whyUsTeaser.eyebrow || "",
          headline: data.whyUsTeaser.headline || "",
          exploreCtaText: data.whyUsTeaser.exploreCtaText || "",
          blueprintTitle: data.whyUsTeaser.blueprint?.title || "",
          blueprintDesc: data.whyUsTeaser.blueprint?.description || "",
        });
      }

      if (data.contact) {
        setContact({
          stageTag: data.contact.stageTag || "",
          headline: data.contact.headline || "",
          description: data.contact.description || "",
          intakeLabel: data.contact.intakeLabel || "",
          email: data.contact.email || "",
          phone: data.contact.phone || "",
          studioLocations: data.contact.studioLocations || "",
          submitButtonText: data.contact.submitButtonText || "",
        });
      }

      if (data.whyUsPage) {
        setWhyUsPage({
          heroHeadlineRow1: data.whyUsPage.heroHeadlineRow1 || "",
          heroHeadlineRow2: data.whyUsPage.heroHeadlineRow2 || "",
          sceneBadge: data.whyUsPage.sceneBadge || "",
          statusBadge: data.whyUsPage.statusBadge || "",
          roiBadge: data.whyUsPage.roiBadge || "",
          presentationTitle: data.whyUsPage.presentationTitle || "",
          presentationSubtitle: data.whyUsPage.presentationSubtitle || "",
        });
      }
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to refresh content:", err);
    }
  };

  const handleFieldChange = () => {
    setIsDirty(true);
    setIsSaved(false);
  };


  // Save handler for active section
  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    let targetSection: "manifesto" | "whyUsTeaser" | "contact" | "whyUsPage" = "manifesto";
    let payload: Record<string, unknown> = {};
    const savedContent = loadedContentRef.current;

    if (activeSection === "manifesto") {
      targetSection = "manifesto";
      payload = {
        ...savedContent.manifesto,
        announcementBadge: manifesto.announcementBadge,
        editionBadge: manifesto.editionBadge,
        stickyNote: manifesto.stickyNote,
        headlinePart1: manifesto.headlinePart1,
        headlinePart2: manifesto.headlinePart2,
        introParagraph: manifesto.introParagraph,
        primaryCtaText: manifesto.primaryCtaText,
        secondaryCtaText: manifesto.secondaryCtaText,
        metrics: [
          { num: manifesto.metric1Num, label: manifesto.metric1Label },
          { num: manifesto.metric2Num, label: manifesto.metric2Label },
          { num: manifesto.metric3Num, label: manifesto.metric3Label },
        ],
      };
    } else if (activeSection === "teaser") {
      targetSection = "whyUsTeaser";
      payload = {
        ...savedContent.whyUsTeaser,
        eyebrow: whyUsTeaser.eyebrow,
        headline: whyUsTeaser.headline,
        exploreCtaText: whyUsTeaser.exploreCtaText,
        blueprint: {
          ...savedContent.whyUsTeaser.blueprint,
          title: whyUsTeaser.blueprintTitle,
          description: whyUsTeaser.blueprintDesc,
        },
      };
    } else if (activeSection === "contact") {
      targetSection = "contact";
      payload = {
        ...savedContent.contact,
        stageTag: contact.stageTag,
        headline: contact.headline,
        description: contact.description,
        intakeLabel: contact.intakeLabel,
        email: contact.email,
        phone: contact.phone,
        studioLocations: contact.studioLocations,
        submitButtonText: contact.submitButtonText,
      };
    } else if (activeSection === "whyUs") {
      targetSection = "whyUsPage";
      payload = {
        ...savedContent.whyUsPage,
        sceneBadge: whyUsPage.sceneBadge,
        statusBadge: whyUsPage.statusBadge,
        heroHeadlineRow1: whyUsPage.heroHeadlineRow1,
        heroHeadlineRow2: whyUsPage.heroHeadlineRow2,
        roiBadge: whyUsPage.roiBadge,
        presentationTitle: whyUsPage.presentationTitle,
        presentationSubtitle: whyUsPage.presentationSubtitle,
      };
    }

    try {
      const res = await apiFetchWithCsrf(`/api/content/${targetSection}`, {
        method: "PUT",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(payload),
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }

      loadedContentRef.current = {
        ...loadedContentRef.current,
        [targetSection]: payload,
      } as SiteContent;

      setIsSaved(true);
      setIsDirty(false);
      setTimeout(() => setIsSaved(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Failed to publish changes";
      setErrorMessage(msg);
    } finally {
      setIsSaving(false);
    }
  };

  // Open Revision History
  const handleOpenHistory = async () => {
    setIsHistoryOpen(true);
    setIsLoadingHistory(true);
    try {
      const res = await fetch("/api/content/history?limit=30");
      if (!res.ok) throw new Error(`HTTP ${res.status}`);
      const data = await res.json();
      setRevisions(data.revisions || []);
    } catch (err) {
      console.error("Failed to load revisions:", err);
    } finally {
      setIsLoadingHistory(false);
    }
  };

  // Rollback Action
  const handleRollback = async (revisionId: string) => {
    if (!confirm("Are you sure you want to rollback to this snapshot?")) return;
    setRollingBackId(revisionId);
    try {
      const res = await apiFetchWithCsrf(`/api/content/rollback/${revisionId}`, {
        method: "POST",
      });

      if (!res.ok) {
        const errJson = await res.json().catch(() => ({}));
        throw new Error(errJson.error || `HTTP ${res.status}`);
      }

      // Reload live content into form
      await refreshContent();
      setIsHistoryOpen(false);
      setIsSaved(true);
      setTimeout(() => setIsSaved(false), 3500);
    } catch (err: unknown) {
      const msg = err instanceof Error ? err.message : "Rollback failed";
      alert(msg);
    } finally {
      setRollingBackId(null);
    }
  };

  return (
    <div className="flex-1 flex flex-col relative">
      <AdminHeader
        title="Website Content Editor"
        subtitle="Manage live copy, headings, and proof metrics across public routes (Phase 07 Versioning)"
        action={
          <div className="flex items-center gap-2.5">
            {isDirty && (
              <span className="text-xs font-mono text-amber-400 bg-amber-400/10 px-2.5 py-1 rounded-lg border border-amber-400/20 flex items-center gap-1.5">
                <AlertCircle className="w-3.5 h-3.5" />
                <span>Unsaved Edits</span>
              </span>
            )}
            {isSaved && (
              <span className="text-xs font-mono text-emerald-400 bg-emerald-400/10 px-2.5 py-1 rounded-lg border border-emerald-400/20 flex items-center gap-1.5">
                <CheckCircle2 className="w-3.5 h-3.5" />
                <span>Changes Published &amp; Synced</span>
              </span>
            )}
            <button
              onClick={handleOpenHistory}
              type="button"
              className="flex items-center gap-1.5 px-3 py-2 bg-[#181824] hover:bg-[#222234] text-zinc-300 hover:text-white text-xs font-mono rounded-xl border border-[#2b2b3d] transition-all cursor-pointer"
              title="View Revision History & Rollbacks"
            >
              <History className="w-3.5 h-3.5" />
              <span>History</span>
            </button>
            <button
              onClick={handleSave}
              disabled={isSaving || isLoading}
              className="flex items-center gap-2 px-4 py-2 bg-yellow-400 hover:bg-yellow-300 disabled:opacity-50 text-black text-xs font-bold font-mono uppercase tracking-wider rounded-xl transition-all shadow-[2px_2px_0px_#ffffff] cursor-pointer"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>{isSaving ? "Publishing..." : "Save & Publish"}</span>
            </button>
          </div>
        }
      />

      {errorMessage && (
        <div className="mx-8 mt-4 p-3 bg-red-950/40 border border-red-500/40 text-red-300 text-xs font-mono rounded-xl flex items-center gap-2">
          <AlertCircle className="w-4 h-4 shrink-0 text-red-400" />
          <span>{errorMessage}</span>
        </div>
      )}

      <main className="p-8 max-w-5xl space-y-6">
        {/* Navigation Tabs */}
        <div className="flex items-center gap-2 p-1.5 bg-[#151520] rounded-xl border border-[#262638] w-fit">
          <button
            onClick={() => setActiveSection("manifesto")}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              activeSection === "manifesto"
                ? "bg-yellow-400 text-black font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            01 Home Manifesto
          </button>
          <button
            onClick={() => setActiveSection("teaser")}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              activeSection === "teaser"
                ? "bg-yellow-400 text-black font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            02 Why-Us Teaser
          </button>
          <button
            onClick={() => setActiveSection("contact")}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
              activeSection === "contact"
                ? "bg-yellow-400 text-black font-bold"
                : "text-zinc-400 hover:text-white"
            }`}
          >
            03 Contact Section
          </button>
          <button
            onClick={() => setActiveSection("whyUs")}
            className={`px-3.5 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
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
                  HERO MANIFESTO &amp; POSITIONING
                </h3>
                <p className="text-xs text-zinc-400">Target scene: /#stage-01</p>
              </div>
              <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                Above-the-Fold
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Announcement Tag
                </label>
                <input
                  type="text"
                  value={manifesto.announcementBadge}
                  onChange={(e) => {
                    setManifesto({ ...manifesto, announcementBadge: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Edition Badge
                </label>
                <input
                  type="text"
                  value={manifesto.editionBadge}
                  onChange={(e) => {
                    setManifesto({ ...manifesto, editionBadge: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Headline Primary
                </label>
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
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Headline Kinetic Accent
                </label>
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
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Intro Statement
              </label>
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

            {/* Proof Metrics */}
            <div className="pt-2 border-t border-[#262638]">
              <h4 className="text-xs font-bold text-white uppercase font-mono mb-3">
                Proof Metrics (3-Column Strip)
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                <div className="bg-[#0d0d12] p-3 rounded-xl border border-[#2b2b3d]">
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    METRIC 01 VALUE
                  </label>
                  <input
                    type="text"
                    value={manifesto.metric1Num}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric1Num: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-sm font-bold text-yellow-400 mb-2 focus:outline-none"
                  />
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    LABEL
                  </label>
                  <input
                    type="text"
                    value={manifesto.metric1Label}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric1Label: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none"
                  />
                </div>

                <div className="bg-[#0d0d12] p-3 rounded-xl border border-[#2b2b3d]">
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    METRIC 02 VALUE
                  </label>
                  <input
                    type="text"
                    value={manifesto.metric2Num}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric2Num: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-sm font-bold text-yellow-400 mb-2 focus:outline-none"
                  />
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    LABEL
                  </label>
                  <input
                    type="text"
                    value={manifesto.metric2Label}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric2Label: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none"
                  />
                </div>

                <div className="bg-[#0d0d12] p-3 rounded-xl border border-[#2b2b3d]">
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    METRIC 03 VALUE
                  </label>
                  <input
                    type="text"
                    value={manifesto.metric3Num}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric3Num: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-sm font-bold text-yellow-400 mb-2 focus:outline-none"
                  />
                  <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                    LABEL
                  </label>
                  <input
                    type="text"
                    value={manifesto.metric3Label}
                    onChange={(e) => {
                      setManifesto({ ...manifesto, metric3Label: e.target.value });
                      handleFieldChange();
                    }}
                    className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none"
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* Section 2: Why-Us Teaser */}
        {activeSection === "teaser" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  HOMEPAGE WHY-US TEASER &amp; BLUEPRINT
                </h3>
                <p className="text-xs text-zinc-400">Target scene: /#stage-02</p>
              </div>
              <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                Stage 02
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Eyebrow Tag
                </label>
                <input
                  type="text"
                  value={whyUsTeaser.eyebrow}
                  onChange={(e) => {
                    setWhyUsTeaser({ ...whyUsTeaser, eyebrow: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Explore CTA Text
                </label>
                <input
                  type="text"
                  value={whyUsTeaser.exploreCtaText}
                  onChange={(e) => {
                    setWhyUsTeaser({ ...whyUsTeaser, exploreCtaText: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-bold"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Main Headline
              </label>
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

            <div className="pt-2 border-t border-[#262638] space-y-4">
              <h4 className="text-xs font-bold text-white uppercase font-mono">
                Blueprint Callout Card
              </h4>
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Blueprint Headline
                </label>
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
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Blueprint Paragraph
                </label>
                <textarea
                  rows={2}
                  value={whyUsTeaser.blueprintDesc}
                  onChange={(e) => {
                    setWhyUsTeaser({ ...whyUsTeaser, blueprintDesc: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>
        )}

        {/* Section 3: Contact */}
        {activeSection === "contact" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-5">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  CONTACT INTAKE &amp; DISPATCH
                </h3>
                <p className="text-xs text-zinc-400">Target scene: /#stage-04</p>
              </div>
              <span className="text-xs font-mono text-yellow-400 bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
                Lead Intake
              </span>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Section Stage Tag
                </label>
                <input
                  type="text"
                  value={contact.stageTag}
                  onChange={(e) => {
                    setContact({ ...contact, stageTag: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Headline
                </label>
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
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Description
              </label>
              <textarea
                rows={2}
                value={contact.description}
                onChange={(e) => {
                  setContact({ ...contact, description: e.target.value });
                  handleFieldChange();
                }}
                className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4 pt-2 border-t border-[#262638]">
              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Studio Email
                </label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) => {
                    setContact({ ...contact, email: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Hotline / Ext
                </label>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) => {
                    setContact({ ...contact, phone: e.target.value });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400 font-mono"
                />
              </div>
            </div>

            <div>
              <label className="block text-xs font-mono text-zinc-400 mb-1">
                Locations Strip
              </label>
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
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Hero Title Row 1
                </label>
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
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Hero Title Row 2
                </label>
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
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Presentation Heading
                </label>
                <input
                  type="text"
                  value={whyUsPage.presentationTitle}
                  onChange={(e) => {
                    setWhyUsPage({
                      ...whyUsPage,
                      presentationTitle: e.target.value,
                    });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>

              <div>
                <label className="block text-xs font-mono text-zinc-400 mb-1">
                  Presentation Subtitle
                </label>
                <input
                  type="text"
                  value={whyUsPage.presentationSubtitle}
                  onChange={(e) => {
                    setWhyUsPage({
                      ...whyUsPage,
                      presentationSubtitle: e.target.value,
                    });
                    handleFieldChange();
                  }}
                  className="w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400"
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* REVISION HISTORY MODAL / DRAWER */}
      {isHistoryOpen && (
        <div className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-sm p-4">
          <div className="bg-[#151520] border-2 border-[#2b2b3d] rounded-2xl p-6 max-w-2xl w-full max-h-[85vh] overflow-y-auto space-y-4 shadow-2xl">
            <div className="flex items-center justify-between pb-3 border-b border-[#2b2b3d]">
              <div className="flex items-center gap-2">
                <History className="w-4 h-4 text-yellow-400" />
                <h3 className="font-mono font-bold text-sm text-white uppercase">
                  Content Revision History &amp; Rollback
                </h3>
              </div>
              <button
                onClick={() => setIsHistoryOpen(false)}
                className="w-7 h-7 rounded-lg bg-[#222234] hover:bg-yellow-400 hover:text-black text-zinc-400 flex items-center justify-center transition-colors cursor-pointer"
              >
                <X className="w-4 h-4" />
              </button>
            </div>

            {isLoadingHistory ? (
              <div className="py-12 flex flex-col items-center justify-center text-zinc-400 gap-2 font-mono text-xs">
                <Loader2 className="w-6 h-6 animate-spin text-yellow-400" />
                <span>Loading PostgreSQL audit logs...</span>
              </div>
            ) : revisions.length === 0 ? (
              <div className="py-12 text-center text-zinc-400 font-mono text-xs">
                No revisions recorded yet. Revisions are created automatically upon saving changes.
              </div>
            ) : (
              <div className="space-y-3">
                {revisions.map((rev) => (
                  <div
                    key={rev.id}
                    className="p-3.5 rounded-xl bg-[#0e0e16] border border-[#262638] flex flex-col sm:flex-row items-start sm:items-center justify-between gap-3"
                  >
                    <div className="space-y-1">
                      <div className="flex items-center gap-2">
                        <span className="px-2 py-0.5 rounded bg-yellow-400/10 text-yellow-400 font-mono text-[10px] uppercase font-bold border border-yellow-400/20">
                          {rev.sectionKey}
                        </span>
                        <span className="text-[10px] font-mono text-zinc-400 uppercase">
                          Action: {rev.action}
                        </span>
                      </div>
                      <div className="flex items-center gap-3 text-[11px] font-mono text-zinc-400">
                        <span className="flex items-center gap-1">
                          <User className="w-3 h-3 text-zinc-500" />
                          <span>{rev.actorEmail}</span>
                        </span>
                        <span className="flex items-center gap-1">
                          <Clock className="w-3 h-3 text-zinc-500" />
                          <span>{new Date(rev.createdAt).toLocaleString()}</span>
                        </span>
                      </div>
                    </div>

                    <button
                      onClick={() => handleRollback(rev.id)}
                      disabled={rollingBackId === rev.id || !rev.beforeState}
                      className="px-3 py-1.5 rounded-lg bg-yellow-400/10 hover:bg-yellow-400 text-yellow-400 hover:text-black border border-yellow-400/30 text-xs font-mono font-bold flex items-center gap-1.5 transition-all disabled:opacity-40 cursor-pointer shrink-0"
                    >
                      {rollingBackId === rev.id ? (
                        <Loader2 className="w-3 h-3 animate-spin" />
                      ) : (
                        <RotateCcw className="w-3 h-3" />
                      )}
                      <span>Restore Snapshot</span>
                    </button>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  );
}
