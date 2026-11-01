"use client";

import React, { useState, useEffect } from "react";
import Link from "next/link";
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
  Plus,
  Trash2,
  Star,
  ExternalLink,
} from "lucide-react";
import type {
  SiteContent,
  ServiceDisciplineCategory,
  ServiceDisciplineItem,
  WhyUsCapabilityCard,
  GalleryWorkflowStep,
} from "@art-work/types";
import { apiFetchWithCsrf } from "@/lib/csrf";
import {
  DEFAULT_SITE_CONTENT,
  DEFAULT_SERVICE_DISCIPLINES,
} from "@art-work/database/content/default-content";
import { normalizeSiteContent } from "@art-work/database/content/contract";

type EditorSectionKey = Exclude<keyof SiteContent, "version" | "updatedAt">;

interface RevisionItem {
  id: string;
  sectionKey: string;
  action: string;
  actorEmail: string;
  createdAt: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
}

const SECTION_TABS: Array<{
  key: EditorSectionKey;
  label: string;
  targetRoute: string;
}> = [
  { key: "manifesto", label: "01 Home Hero & Partners", targetRoute: "/#stage-01" },
  { key: "whyUsTeaser", label: "02 Home Why-Us", targetRoute: "/#stage-02" },
  { key: "services", label: "03 Home Services", targetRoute: "/#stage-03" },
  { key: "homeShowcase", label: "04 Home Video & Showcase", targetRoute: "/#gallery-showcase" },
  { key: "contact", label: "05 Home Contact & Brief", targetRoute: "/#stage-04" },
  { key: "whyUsPage", label: "06 /why-us Page", targetRoute: "/why-us" },
  { key: "galleryPage", label: "07 /gallery Page", targetRoute: "/gallery" },
  { key: "layout", label: "08 Header & Footer", targetRoute: "Global (All Pages)" },
];

const INPUT_CLS =
  "w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400";
const LABEL_CLS = "block text-xs font-mono text-zinc-400 mb-1";

export default function WebsiteContentEditor() {
  const [content, setContent] = useState<SiteContent>(() =>
    normalizeSiteContent(DEFAULT_SITE_CONTENT)
  );
  const [activeSection, setActiveSection] = useState<EditorSectionKey>("manifesto");
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

  const loadContentFromApi = async () => {
    const res = await fetch("/api/content", { cache: "no-store" });
    if (!res.ok) throw new Error(`HTTP ${res.status}`);
    const data = await res.json();
    return normalizeSiteContent(data);
  };

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const normalized = await loadContentFromApi();
        if (!mounted) return;
        setContent(normalized);
      } catch (err) {
        console.error("Failed to load content:", err);
        if (mounted) {
          setErrorMessage(
            "Could not connect to live content API. Showing cached defaults."
          );
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
      const normalized = await loadContentFromApi();
      setContent(normalized);
      setIsDirty(false);
    } catch (err) {
      console.error("Failed to refresh content:", err);
    }
  };

  const updateSection = <K extends EditorSectionKey>(
    section: K,
    updater: (prev: SiteContent[K]) => SiteContent[K]
  ) => {
    setContent((prev) => ({
      ...prev,
      [section]: updater(prev[section]),
    }));
    setIsDirty(true);
    setIsSaved(false);
  };

  const handleSave = async () => {
    setIsSaving(true);
    setErrorMessage(null);

    const payload = content[activeSection];

    try {
      const res = await apiFetchWithCsrf(`/api/content/${activeSection}`, {
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

  const manifesto = content.manifesto;
  const whyUsTeaser = content.whyUsTeaser;
  const services = content.services;
  const homeShowcase = content.homeShowcase;
  const contact = content.contact;
  const whyUsPage = content.whyUsPage;
  const galleryPage = content.galleryPage;
  const layout = content.layout;

  return (
    <div className="flex-1 flex flex-col relative">
      <AdminHeader
        title="Website Content Editor"
        subtitle="Full-site CMS control across all 8 Home, /why-us, /gallery & Global Layout sections"
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
                <span>Changes Published &amp; Synced (200 OK)</span>
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

      <main className="p-8 max-w-6xl space-y-6">
        {/* 8-Section Navigation Tabs */}
        <div className="flex flex-wrap items-center gap-2 p-2 bg-[#151520] rounded-xl border border-[#262638]">
          {SECTION_TABS.map((tab) => (
            <button
              key={tab.key}
              type="button"
              onClick={() => setActiveSection(tab.key)}
              className={`px-3 py-2 rounded-lg text-xs font-mono font-medium transition-all cursor-pointer ${
                activeSection === tab.key
                  ? "bg-yellow-400 text-black font-bold shadow-sm"
                  : "text-zinc-400 hover:text-white hover:bg-[#1d1d2c]"
              }`}
            >
              {tab.label}
            </button>
          ))}
        </div>

        {/* ================= SECTION 1: HOME HERO & PARTNERS ================= */}
        {activeSection === "manifesto" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  HOME HERO MANIFESTO &amp; PARTNERS MARQUEE
                </h3>
                <p className="text-xs text-zinc-400">Target scene: /#stage-01</p>
              </div>
              <Link
                href="/companies"
                className="text-xs font-mono text-yellow-400 hover:underline flex items-center gap-1"
              >
                <span>Manage Partner Logos</span>
                <ExternalLink className="w-3.5 h-3.5" />
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Announcement Badge</label>
                <input
                  type="text"
                  value={manifesto.announcementBadge}
                  onChange={(e) =>
                    updateSection("manifesto", (p) => ({
                      ...p,
                      announcementBadge: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Edition Badge</label>
                <input
                  type="text"
                  value={manifesto.editionBadge}
                  onChange={(e) =>
                    updateSection("manifesto", (p) => ({
                      ...p,
                      editionBadge: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Sticky Note</label>
                <input
                  type="text"
                  value={manifesto.stickyNote}
                  onChange={(e) =>
                    updateSection("manifesto", (p) => ({
                      ...p,
                      stickyNote: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Headline Primary</label>
                <input
                  type="text"
                  value={manifesto.headlinePart1}
                  onChange={(e) =>
                    updateSection("manifesto", (p) => ({
                      ...p,
                      headlinePart1: e.target.value,
                    }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Headline Kinetic Highlight</label>
                <input
                  type="text"
                  value={manifesto.headlinePart2}
                  onChange={(e) =>
                    updateSection("manifesto", (p) => ({
                      ...p,
                      headlinePart2: e.target.value,
                    }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Intro Paragraph</label>
              <textarea
                rows={3}
                value={manifesto.introParagraph}
                onChange={(e) =>
                  updateSection("manifesto", (p) => ({
                    ...p,
                    introParagraph: e.target.value,
                  }))
                }
                className={INPUT_CLS}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Primary CTA Button</label>
                <input
                  type="text"
                  value={manifesto.primaryCtaText}
                  onChange={(e) =>
                    updateSection("manifesto", (p) => ({
                      ...p,
                      primaryCtaText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Secondary CTA Button</label>
                <input
                  type="text"
                  value={manifesto.secondaryCtaText}
                  onChange={(e) =>
                    updateSection("manifesto", (p) => ({
                      ...p,
                      secondaryCtaText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Proof Tagline</label>
                <input
                  type="text"
                  value={manifesto.proofTagline || ""}
                  onChange={(e) =>
                    updateSection("manifesto", (p) => ({
                      ...p,
                      proofTagline: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Performance Badge</label>
                <input
                  type="text"
                  value={manifesto.performanceBadge || ""}
                  onChange={(e) =>
                    updateSection("manifesto", (p) => ({
                      ...p,
                      performanceBadge: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Hero Illustration URL</label>
                <input
                  type="text"
                  value={manifesto.heroImage || ""}
                  onChange={(e) =>
                    updateSection("manifesto", (p) => ({
                      ...p,
                      heroImage: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            {/* Proof Metrics */}
            <div className="pt-4 border-t border-[#262638]">
              <h4 className="text-xs font-bold text-white uppercase font-mono mb-3">
                Hero Proof Metrics Strip
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-3">
                {manifesto.metrics.map((metric, idx) => (
                  <div
                    key={idx}
                    className="bg-[#0d0d12] p-3 rounded-xl border border-[#2b2b3d]"
                  >
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                      METRIC 0{idx + 1} VALUE
                    </label>
                    <input
                      type="text"
                      value={metric.num}
                      onChange={(e) =>
                        updateSection("manifesto", (p) => {
                          const next = [...p.metrics];
                          next[idx] = { ...next[idx], num: e.target.value };
                          return { ...p, metrics: next };
                        })
                      }
                      className="w-full bg-transparent text-sm font-bold text-yellow-400 mb-2 focus:outline-none"
                    />
                    <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                      LABEL
                    </label>
                    <input
                      type="text"
                      value={metric.label}
                      onChange={(e) =>
                        updateSection("manifesto", (p) => {
                          const next = [...p.metrics];
                          next[idx] = { ...next[idx], label: e.target.value };
                          return { ...p, metrics: next };
                        })
                      }
                      className="w-full bg-transparent text-xs text-zinc-300 focus:outline-none"
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Partners Marquee */}
            <div className="pt-4 border-t border-[#262638] space-y-4">
              <h4 className="text-xs font-bold text-white uppercase font-mono">
                Partners Marquee &amp; Starburst Stamp
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={LABEL_CLS}>Partners Badge</label>
                  <input
                    type="text"
                    value={manifesto.partnersBadge || ""}
                    onChange={(e) =>
                      updateSection("manifesto", (p) => ({
                        ...p,
                        partnersBadge: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Partners Headline Prefix</label>
                  <input
                    type="text"
                    value={manifesto.partnersHeadlinePrefix || ""}
                    onChange={(e) =>
                      updateSection("manifesto", (p) => ({
                        ...p,
                        partnersHeadlinePrefix: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Partners Headline Highlight</label>
                  <input
                    type="text"
                    value={manifesto.partnersHeadlineHighlight || ""}
                    onChange={(e) =>
                      updateSection("manifesto", (p) => ({
                        ...p,
                        partnersHeadlineHighlight: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={LABEL_CLS}>Starburst Line 1 (Top)</label>
                  <input
                    type="text"
                    value={manifesto.starburstText.top}
                    onChange={(e) =>
                      updateSection("manifesto", (p) => ({
                        ...p,
                        starburstText: { ...p.starburstText, top: e.target.value },
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Starburst Line 2 (Middle)</label>
                  <input
                    type="text"
                    value={manifesto.starburstText.middle}
                    onChange={(e) =>
                      updateSection("manifesto", (p) => ({
                        ...p,
                        starburstText: { ...p.starburstText, middle: e.target.value },
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Starburst Line 3 (Bottom)</label>
                  <input
                    type="text"
                    value={manifesto.starburstText.bottom}
                    onChange={(e) =>
                      updateSection("manifesto", (p) => ({
                        ...p,
                        starburstText: { ...p.starburstText, bottom: e.target.value },
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 2: HOME WHY-US TEASER ================= */}
        {activeSection === "whyUsTeaser" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  HOMEPAGE WHY-US TEASER, BENTO CARDS &amp; BLUEPRINT
                </h3>
                <p className="text-xs text-zinc-400">Target scene: /#stage-02</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Eyebrow Tag</label>
                <input
                  type="text"
                  value={whyUsTeaser.eyebrow}
                  onChange={(e) =>
                    updateSection("whyUsTeaser", (p) => ({
                      ...p,
                      eyebrow: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Explore CTA Text</label>
                <input
                  type="text"
                  value={whyUsTeaser.exploreCtaText}
                  onChange={(e) =>
                    updateSection("whyUsTeaser", (p) => ({
                      ...p,
                      exploreCtaText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Main Headline</label>
              <input
                type="text"
                value={whyUsTeaser.headline}
                onChange={(e) =>
                  updateSection("whyUsTeaser", (p) => ({
                    ...p,
                    headline: e.target.value,
                  }))
                }
                className={`${INPUT_CLS} font-bold`}
              />
            </div>

            {/* Bento Cards */}
            <div className="pt-4 border-t border-[#262638] space-y-3">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase font-mono">
                  Why-Us Bento Cards ({whyUsTeaser.bentoCards.length})
                </h4>
                <button
                  type="button"
                  onClick={() =>
                    updateSection("whyUsTeaser", (p) => ({
                      ...p,
                      bentoCards: [
                        ...p.bentoCards,
                        {
                          number: `0${p.bentoCards.length + 1}`,
                          badge: "NEW PILLAR",
                          title: "New Studio Advantage",
                          description:
                            "Describe this pillar of Art Work's creative and production workflow.",
                        },
                      ],
                    }))
                  }
                  className="px-3 py-1.5 rounded-lg bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Bento Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {whyUsTeaser.bentoCards.map((card, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0d0d12] border border-[#2b2b3d] space-y-3"
                  >
                    <div className="flex items-center justify-between gap-2">
                      <span className="text-[11px] font-mono text-yellow-400 font-bold">
                        CARD #{idx + 1}
                      </span>
                      {whyUsTeaser.bentoCards.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateSection("whyUsTeaser", (p) => ({
                              ...p,
                              bentoCards: p.bentoCards.filter((_, i) => i !== idx),
                            }))
                          }
                          className="text-zinc-500 hover:text-red-400 cursor-pointer"
                          title="Remove Bento Card"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <div className="grid grid-cols-3 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                          NUM
                        </label>
                        <input
                          type="text"
                          value={card.number}
                          onChange={(e) =>
                            updateSection("whyUsTeaser", (p) => {
                              const next = [...p.bentoCards];
                              next[idx] = { ...next[idx], number: e.target.value };
                              return { ...p, bentoCards: next };
                            })
                          }
                          className={INPUT_CLS}
                        />
                      </div>
                      <div className="col-span-2">
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                          BADGE
                        </label>
                        <input
                          type="text"
                          value={card.badge}
                          onChange={(e) =>
                            updateSection("whyUsTeaser", (p) => {
                              const next = [...p.bentoCards];
                              next[idx] = { ...next[idx], badge: e.target.value };
                              return { ...p, bentoCards: next };
                            })
                          }
                          className={INPUT_CLS}
                        />
                      </div>
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                        CARD TITLE
                      </label>
                      <input
                        type="text"
                        value={card.title}
                        onChange={(e) =>
                          updateSection("whyUsTeaser", (p) => {
                            const next = [...p.bentoCards];
                            next[idx] = { ...next[idx], title: e.target.value };
                            return { ...p, bentoCards: next };
                          })
                        }
                        className={`${INPUT_CLS} font-bold`}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                        DESCRIPTION
                      </label>
                      <textarea
                        rows={2}
                        value={card.description}
                        onChange={(e) =>
                          updateSection("whyUsTeaser", (p) => {
                            const next = [...p.bentoCards];
                            next[idx] = { ...next[idx], description: e.target.value };
                            return { ...p, bentoCards: next };
                          })
                        }
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Blueprint Card */}
            <div className="pt-4 border-t border-[#262638] space-y-4">
              <h4 className="text-xs font-bold text-white uppercase font-mono">
                Blueprint Callout Card
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Blueprint Badge</label>
                  <input
                    type="text"
                    value={whyUsTeaser.blueprint.badge}
                    onChange={(e) =>
                      updateSection("whyUsTeaser", (p) => ({
                        ...p,
                        blueprint: { ...p.blueprint, badge: e.target.value },
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Blueprint Image URL</label>
                  <input
                    type="text"
                    value={whyUsTeaser.blueprint.image}
                    onChange={(e) =>
                      updateSection("whyUsTeaser", (p) => ({
                        ...p,
                        blueprint: { ...p.blueprint, image: e.target.value },
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>
              <div>
                <label className={LABEL_CLS}>Blueprint Headline</label>
                <input
                  type="text"
                  value={whyUsTeaser.blueprint.title}
                  onChange={(e) =>
                    updateSection("whyUsTeaser", (p) => ({
                      ...p,
                      blueprint: { ...p.blueprint, title: e.target.value },
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Blueprint Paragraph</label>
                <textarea
                  rows={2}
                  value={whyUsTeaser.blueprint.description}
                  onChange={(e) =>
                    updateSection("whyUsTeaser", (p) => ({
                      ...p,
                      blueprint: { ...p.blueprint, description: e.target.value },
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 3: HOME SERVICES MATRIX ================= */}
        {activeSection === "services" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  HOME SERVICES &amp; 3D CAPABILITIES MATRIX
                </h3>
                <p className="text-xs text-zinc-400">
                  Target scene: /#stage-03 ({services.disciplines.length} active services)
                </p>
              </div>
              <button
                type="button"
                onClick={() =>
                  updateSection("services", (p) => ({
                    ...p,
                    disciplines: DEFAULT_SERVICE_DISCIPLINES,
                  }))
                }
                className="text-xs font-mono text-zinc-400 hover:text-yellow-400 cursor-pointer"
              >
                Reset Default 12 Services
              </button>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Section Eyebrow</label>
                <input
                  type="text"
                  value={services.eyebrow}
                  onChange={(e) =>
                    updateSection("services", (p) => ({ ...p, eyebrow: e.target.value }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Headline Prefix</label>
                <input
                  type="text"
                  value={services.headlinePrefix}
                  onChange={(e) =>
                    updateSection("services", (p) => ({
                      ...p,
                      headlinePrefix: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Headline Highlight</label>
                <input
                  type="text"
                  value={services.headlineHighlight}
                  onChange={(e) =>
                    updateSection("services", (p) => ({
                      ...p,
                      headlineHighlight: e.target.value,
                    }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Section Description</label>
              <textarea
                rows={2}
                value={services.description}
                onChange={(e) =>
                  updateSection("services", (p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                className={INPUT_CLS}
              />
            </div>

            {/* Filter Labels */}
            <div className="grid grid-cols-2 md:grid-cols-5 gap-3">
              <div>
                <label className={LABEL_CLS}>Filter: All</label>
                <input
                  type="text"
                  value={services.filterAllLabel}
                  onChange={(e) =>
                    updateSection("services", (p) => ({
                      ...p,
                      filterAllLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Filter: Creative</label>
                <input
                  type="text"
                  value={services.filterCreativeLabel}
                  onChange={(e) =>
                    updateSection("services", (p) => ({
                      ...p,
                      filterCreativeLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Filter: Events</label>
                <input
                  type="text"
                  value={services.filterEventsLabel}
                  onChange={(e) =>
                    updateSection("services", (p) => ({
                      ...p,
                      filterEventsLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Filter: Production</label>
                <input
                  type="text"
                  value={services.filterProductionLabel}
                  onChange={(e) =>
                    updateSection("services", (p) => ({
                      ...p,
                      filterProductionLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Filter: Delivery</label>
                <input
                  type="text"
                  value={services.filterDeliveryLabel}
                  onChange={(e) =>
                    updateSection("services", (p) => ({
                      ...p,
                      filterDeliveryLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            {/* Service Disciplines List */}
            <div className="pt-4 border-t border-[#262638] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase font-mono">
                  Editable Service Cards ({services.disciplines.length})
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const newItem: ServiceDisciplineItem = {
                      id: `service-${Date.now()}`,
                      number: `0${services.disciplines.length + 1}`,
                      title: "New Studio Service",
                      tag: "CUSTOM SERVICE",
                      icon: "sparkles",
                      category: "production",
                      description:
                        "End-to-end creative direction and physical production tailored for your event.",
                      deliverables: [
                        "Custom Spatial Design",
                        "On-Site Production Supervision",
                      ],
                      specs: ["Turnkey Delivery", "Brand-Aligned Execution"],
                      metrics: "100% Custom",
                    };
                    updateSection("services", (p) => ({
                      ...p,
                      disciplines: [...p.disciplines, newItem],
                    }));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Service Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {services.disciplines.map((item, idx) => (
                  <div
                    key={item.id || idx}
                    className="p-4 rounded-xl bg-[#0d0d12] border border-[#2b2b3d] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-yellow-400 font-bold">
                        SERVICE #{idx + 1} ({item.number})
                      </span>
                      {services.disciplines.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateSection("services", (p) => ({
                              ...p,
                              disciplines: p.disciplines.filter((_, i) => i !== idx),
                            }))
                          }
                          className="text-zinc-500 hover:text-red-400 cursor-pointer"
                          title="Delete Service"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>

                    <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                          TITLE
                        </label>
                        <input
                          type="text"
                          value={item.title}
                          onChange={(e) =>
                            updateSection("services", (p) => {
                              const next = [...p.disciplines];
                              next[idx] = { ...next[idx], title: e.target.value };
                              return { ...p, disciplines: next };
                            })
                          }
                          className={`${INPUT_CLS} font-bold`}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                          CATEGORY
                        </label>
                        <select
                          value={item.category}
                          onChange={(e) =>
                            updateSection("services", (p) => {
                              const next = [...p.disciplines];
                              next[idx] = {
                                ...next[idx],
                                category: e.target.value as ServiceDisciplineCategory,
                              };
                              return { ...p, disciplines: next };
                            })
                          }
                          className={INPUT_CLS}
                        >
                          <option value="creative">Creative</option>
                          <option value="events">Events</option>
                          <option value="production">Production</option>
                          <option value="delivery">Delivery</option>
                        </select>
                      </div>
                    </div>

                    <div className="grid grid-cols-2 gap-2">
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                          TAG BADGE
                        </label>
                        <input
                          type="text"
                          value={item.tag}
                          onChange={(e) =>
                            updateSection("services", (p) => {
                              const next = [...p.disciplines];
                              next[idx] = { ...next[idx], tag: e.target.value };
                              return { ...p, disciplines: next };
                            })
                          }
                          className={INPUT_CLS}
                        />
                      </div>
                      <div>
                        <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                          METRIC PILL
                        </label>
                        <input
                          type="text"
                          value={item.metrics}
                          onChange={(e) =>
                            updateSection("services", (p) => {
                              const next = [...p.disciplines];
                              next[idx] = { ...next[idx], metrics: e.target.value };
                              return { ...p, disciplines: next };
                            })
                          }
                          className={INPUT_CLS}
                        />
                      </div>
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                        DESCRIPTION
                      </label>
                      <textarea
                        rows={2}
                        value={item.description}
                        onChange={(e) =>
                          updateSection("services", (p) => {
                            const next = [...p.disciplines];
                            next[idx] = { ...next[idx], description: e.target.value };
                            return { ...p, disciplines: next };
                          })
                        }
                        className={INPUT_CLS}
                      />
                    </div>

                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                        DELIVERABLES (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={item.deliverables.join("\n")}
                        onChange={(e) =>
                          updateSection("services", (p) => {
                            const next = [...p.disciplines];
                            const lines = e.target.value
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean);
                            next[idx] = {
                              ...next[idx],
                              deliverables: lines.length > 0 ? lines : ["Custom Scope"],
                            };
                            return { ...p, disciplines: next };
                          })
                        }
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Banner */}
            <div className="pt-4 border-t border-[#262638] space-y-4">
              <h4 className="text-xs font-bold text-white uppercase font-mono">
                Services Bottom Callout Banner
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div>
                  <label className={LABEL_CLS}>Banner Eyebrow</label>
                  <input
                    type="text"
                    value={services.bannerEyebrow}
                    onChange={(e) =>
                      updateSection("services", (p) => ({
                        ...p,
                        bannerEyebrow: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Banner Headline Prefix</label>
                  <input
                    type="text"
                    value={services.bannerHeadlinePrefix}
                    onChange={(e) =>
                      updateSection("services", (p) => ({
                        ...p,
                        bannerHeadlinePrefix: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Banner Headline Highlight</label>
                  <input
                    type="text"
                    value={services.bannerHeadlineHighlight}
                    onChange={(e) =>
                      updateSection("services", (p) => ({
                        ...p,
                        bannerHeadlineHighlight: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                <div className="md:col-span-2">
                  <label className={LABEL_CLS}>Banner Description</label>
                  <input
                    type="text"
                    value={services.bannerDescription}
                    onChange={(e) =>
                      updateSection("services", (p) => ({
                        ...p,
                        bannerDescription: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Banner CTA Button</label>
                  <input
                    type="text"
                    value={services.bannerCtaText}
                    onChange={(e) =>
                      updateSection("services", (p) => ({
                        ...p,
                        bannerCtaText: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 4: HOME VIDEO & SHOWCASE STAGE ================= */}
        {activeSection === "homeShowcase" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
            {/* ★ Star Home Video Shortcut Banner */}
            <div className="p-4 rounded-xl bg-yellow-400/10 border border-yellow-400/40 flex flex-col sm:flex-row items-start sm:items-center justify-between gap-4">
              <div className="flex items-start gap-3">
                <div className="w-9 h-9 rounded-xl bg-yellow-400 text-black flex items-center justify-center shrink-0">
                  <Star className="w-5 h-5 fill-current" />
                </div>
                <div>
                  <h4 className="text-xs font-bold font-mono uppercase text-yellow-400">
                    ★ Change or Add Multiple Home Page Videos
                  </h4>
                  <p className="text-xs text-zinc-300 mt-0.5 leading-relaxed">
                    Click the <strong>★ On Home</strong> star toggle on any YouTube video or
                    project in <strong>Projects Manager</strong> to control which video plays
                    first on Home — or star multiple videos to enable the multi-video switcher
                    &amp; inline video cards on Home!
                  </p>
                </div>
              </div>
              <Link
                href="/projects"
                className="px-4 py-2 rounded-xl bg-yellow-400 hover:bg-yellow-300 text-black font-mono font-bold text-xs uppercase flex items-center gap-1.5 shrink-0 transition-all"
              >
                <Star className="w-3.5 h-3.5 fill-current" />
                <span>Manage ★ Home Videos</span>
              </Link>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Section Badge</label>
                <input
                  type="text"
                  value={homeShowcase.badge}
                  onChange={(e) =>
                    updateSection("homeShowcase", (p) => ({ ...p, badge: e.target.value }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Headline Prefix</label>
                <input
                  type="text"
                  value={homeShowcase.headlinePrefix}
                  onChange={(e) =>
                    updateSection("homeShowcase", (p) => ({
                      ...p,
                      headlinePrefix: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Headline Highlight</label>
                <input
                  type="text"
                  value={homeShowcase.headlineHighlight}
                  onChange={(e) =>
                    updateSection("homeShowcase", (p) => ({
                      ...p,
                      headlineHighlight: e.target.value,
                    }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Section Description</label>
              <textarea
                rows={2}
                value={homeShowcase.description}
                onChange={(e) =>
                  updateSection("homeShowcase", (p) => ({
                    ...p,
                    description: e.target.value,
                  }))
                }
                className={INPUT_CLS}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Top View All CTA</label>
                <input
                  type="text"
                  value={homeShowcase.viewAllCtaText}
                  onChange={(e) =>
                    updateSection("homeShowcase", (p) => ({
                      ...p,
                      viewAllCtaText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Featured Video Badge</label>
                <input
                  type="text"
                  value={homeShowcase.featuredEventBadge}
                  onChange={(e) =>
                    updateSection("homeShowcase", (p) => ({
                      ...p,
                      featuredEventBadge: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Watch on YouTube Button</label>
                <input
                  type="text"
                  value={homeShowcase.youtubeButtonText}
                  onChange={(e) =>
                    updateSection("homeShowcase", (p) => ({
                      ...p,
                      youtubeButtonText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Explore Gallery Button</label>
                <input
                  type="text"
                  value={homeShowcase.exploreGalleryCtaText}
                  onChange={(e) =>
                    updateSection("homeShowcase", (p) => ({
                      ...p,
                      exploreGalleryCtaText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Project Card Action Text</label>
                <input
                  type="text"
                  value={homeShowcase.cardExploreText}
                  onChange={(e) =>
                    updateSection("homeShowcase", (p) => ({
                      ...p,
                      cardExploreText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Mobile Archive CTA</label>
                <input
                  type="text"
                  value={homeShowcase.mobileArchiveCtaText}
                  onChange={(e) =>
                    updateSection("homeShowcase", (p) => ({
                      ...p,
                      mobileArchiveCtaText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 5: HOME CONTACT & BRIEF FORM ================= */}
        {activeSection === "contact" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  CONTACT INTAKE, ADDRESS &amp; BRIEF FORM FIELDS
                </h3>
                <p className="text-xs text-zinc-400">Target scene: /#stage-04</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Section Stage Tag</label>
                <input
                  type="text"
                  value={contact.stageTag}
                  onChange={(e) =>
                    updateSection("contact", (p) => ({ ...p, stageTag: e.target.value }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Headline</label>
                <input
                  type="text"
                  value={contact.headline}
                  onChange={(e) =>
                    updateSection("contact", (p) => ({ ...p, headline: e.target.value }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Description</label>
              <textarea
                rows={2}
                value={contact.description}
                onChange={(e) =>
                  updateSection("contact", (p) => ({ ...p, description: e.target.value }))
                }
                className={INPUT_CLS}
              />
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4 pt-2 border-t border-[#262638]">
              <div>
                <label className={LABEL_CLS}>Studio Email</label>
                <input
                  type="email"
                  value={contact.email}
                  onChange={(e) =>
                    updateSection("contact", (p) => ({ ...p, email: e.target.value }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Studio Phone</label>
                <input
                  type="text"
                  value={contact.phone}
                  onChange={(e) =>
                    updateSection("contact", (p) => ({ ...p, phone: e.target.value }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Submit Button Text</label>
                <input
                  type="text"
                  value={contact.submitButtonText}
                  onChange={(e) =>
                    updateSection("contact", (p) => ({
                      ...p,
                      submitButtonText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Studio Address / Locations</label>
                <input
                  type="text"
                  value={contact.studioLocations}
                  onChange={(e) =>
                    updateSection("contact", (p) => ({
                      ...p,
                      studioLocations: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Intake Card Label</label>
                <input
                  type="text"
                  value={contact.intakeLabel}
                  onChange={(e) =>
                    updateSection("contact", (p) => ({
                      ...p,
                      intakeLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            {/* Editable Service Checkboxes */}
            <div className="pt-4 border-t border-[#262638]">
              <label className={LABEL_CLS}>
                Selectable Service Pills in Contact Form (One per line)
              </label>
              <textarea
                rows={4}
                value={(contact.serviceOptions || []).join("\n")}
                onChange={(e) =>
                  updateSection("contact", (p) => ({
                    ...p,
                    serviceOptions: e.target.value
                      .split("\n")
                      .map((s) => s.trim())
                      .filter(Boolean),
                  }))
                }
                className={INPUT_CLS}
              />
            </div>

            {/* Form Fields */}
            <div className="pt-4 border-t border-[#262638] space-y-3">
              <h4 className="text-xs font-bold text-white uppercase font-mono">
                Brief Form Field Labels &amp; Placeholders
              </h4>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {contact.formFields.map((field, idx) => (
                  <div
                    key={field.name}
                    className="p-3.5 rounded-xl bg-[#0d0d12] border border-[#2b2b3d] space-y-2"
                  >
                    <div className="text-[10px] font-mono text-yellow-400 uppercase font-bold">
                      FIELD: {field.name}
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                        LABEL
                      </label>
                      <input
                        type="text"
                        value={field.label}
                        onChange={(e) =>
                          updateSection("contact", (p) => {
                            const next = [...p.formFields];
                            next[idx] = { ...next[idx], label: e.target.value };
                            return { ...p, formFields: next };
                          })
                        }
                        className={INPUT_CLS}
                      />
                    </div>
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                        PLACEHOLDER
                      </label>
                      <input
                        type="text"
                        value={field.placeholder}
                        onChange={(e) =>
                          updateSection("contact", (p) => {
                            const next = [...p.formFields];
                            next[idx] = { ...next[idx], placeholder: e.target.value };
                            return { ...p, formFields: next };
                          })
                        }
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 6: /WHY-US STANDALONE PAGE ================= */}
        {activeSection === "whyUsPage" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  STANDALONE /WHY-US PAGE &amp; CAPABILITY CARDS
                </h3>
                <p className="text-xs text-zinc-400">Target route: /why-us</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Scene Badge</label>
                <input
                  type="text"
                  value={whyUsPage.sceneBadge}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      sceneBadge: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Hero Title Row 1</label>
                <input
                  type="text"
                  value={whyUsPage.heroHeadlineRow1}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      heroHeadlineRow1: e.target.value,
                    }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Hero Title Row 2</label>
                <input
                  type="text"
                  value={whyUsPage.heroHeadlineRow2}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      heroHeadlineRow2: e.target.value,
                    }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Presentation Heading</label>
                <input
                  type="text"
                  value={whyUsPage.presentationTitle}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      presentationTitle: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Presentation Subtitle</label>
                <input
                  type="text"
                  value={whyUsPage.presentationSubtitle}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      presentationSubtitle: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Director Note</label>
                <input
                  type="text"
                  value={whyUsPage.directorNote || ""}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      directorNote: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Tailored Engineering Stamp</label>
                <input
                  type="text"
                  value={whyUsPage.tailoredStamp || ""}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      tailoredStamp: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Zero Templates Badge</label>
                <input
                  type="text"
                  value={whyUsPage.zeroTemplatesBadge || ""}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      zeroTemplatesBadge: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            {/* Capability Cards */}
            <div className="pt-4 border-t border-[#262638] space-y-4">
              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase font-mono">
                  Experiential Capability Bento Cards (
                  {(whyUsPage.capabilityCards || []).length})
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const nextCard: WhyUsCapabilityCard = {
                      title: "New Capability Pillar",
                      description:
                        "Integrated planning and execution tailored around your brand.",
                      bullets: ["Custom Strategy", "Full On-Site Delivery"],
                      icon: "layers",
                    };
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      capabilityCards: [...(p.capabilityCards || []), nextCard],
                    }));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Capability Card</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {(whyUsPage.capabilityCards || []).map((card, idx) => (
                  <div
                    key={idx}
                    className="p-4 rounded-xl bg-[#0d0d12] border border-[#2b2b3d] space-y-3"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[11px] font-mono text-yellow-400 font-bold">
                        CAPABILITY #{idx + 1}
                      </span>
                      {(whyUsPage.capabilityCards || []).length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateSection("whyUsPage", (p) => ({
                              ...p,
                              capabilityCards: (p.capabilityCards || []).filter(
                                (_, i) => i !== idx
                              ),
                            }))
                          }
                          className="text-zinc-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={card.title}
                      onChange={(e) =>
                        updateSection("whyUsPage", (p) => {
                          const next = [...(p.capabilityCards || [])];
                          next[idx] = { ...next[idx], title: e.target.value };
                          return { ...p, capabilityCards: next };
                        })
                      }
                      className={`${INPUT_CLS} font-bold`}
                    />
                    <textarea
                      rows={2}
                      value={card.description}
                      onChange={(e) =>
                        updateSection("whyUsPage", (p) => {
                          const next = [...(p.capabilityCards || [])];
                          next[idx] = { ...next[idx], description: e.target.value };
                          return { ...p, capabilityCards: next };
                        })
                      }
                      className={INPUT_CLS}
                    />
                    <div>
                      <label className="block text-[10px] font-mono text-zinc-500 mb-1">
                        BULLETS (One per line)
                      </label>
                      <textarea
                        rows={3}
                        value={card.bullets.join("\n")}
                        onChange={(e) =>
                          updateSection("whyUsPage", (p) => {
                            const next = [...(p.capabilityCards || [])];
                            const bullets = e.target.value
                              .split("\n")
                              .map((s) => s.trim())
                              .filter(Boolean);
                            next[idx] = {
                              ...next[idx],
                              bullets: bullets.length > 0 ? bullets : ["Key Deliverable"],
                            };
                            return { ...p, capabilityCards: next };
                          })
                        }
                        className={INPUT_CLS}
                      />
                    </div>
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom Callout */}
            <div className="pt-4 border-t border-[#262638] grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Callout Prefix</label>
                <input
                  type="text"
                  value={whyUsPage.calloutHeadlinePrefix || ""}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      calloutHeadlinePrefix: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Callout Highlight</label>
                <input
                  type="text"
                  value={whyUsPage.calloutHeadlineHighlight || ""}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      calloutHeadlineHighlight: e.target.value,
                    }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Callout Primary Button</label>
                <input
                  type="text"
                  value={whyUsPage.calloutPrimaryCta || ""}
                  onChange={(e) =>
                    updateSection("whyUsPage", (p) => ({
                      ...p,
                      calloutPrimaryCta: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 7: /GALLERY PAGE ================= */}
        {activeSection === "galleryPage" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  /GALLERY ARCHIVE HERO, FILTER CHIPS &amp; WORKFLOW
                </h3>
                <p className="text-xs text-zinc-400">Target route: /gallery</p>
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Hero Badge</label>
                <input
                  type="text"
                  value={galleryPage.heroBadge}
                  onChange={(e) =>
                    updateSection("galleryPage", (p) => ({
                      ...p,
                      heroBadge: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Headline Part 1</label>
                <input
                  type="text"
                  value={galleryPage.headlinePart1}
                  onChange={(e) =>
                    updateSection("galleryPage", (p) => ({
                      ...p,
                      headlinePart1: e.target.value,
                    }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Headline Part 2</label>
                <input
                  type="text"
                  value={galleryPage.headlinePart2}
                  onChange={(e) =>
                    updateSection("galleryPage", (p) => ({
                      ...p,
                      headlinePart2: e.target.value,
                    }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
            </div>

            <div>
              <label className={LABEL_CLS}>Hero Description</label>
              <textarea
                rows={2}
                value={galleryPage.heroDescription}
                onChange={(e) =>
                  updateSection("galleryPage", (p) => ({
                    ...p,
                    heroDescription: e.target.value,
                  }))
                }
                className={INPUT_CLS}
              />
            </div>

            {/* 4 Filter Chip Labels */}
            <div className="pt-4 border-t border-[#262638]">
              <h4 className="text-xs font-bold text-white uppercase font-mono mb-3">
                Gallery Filter Chip Labels
              </h4>
              <div className="grid grid-cols-1 sm:grid-cols-2 md:grid-cols-4 gap-3">
                <div>
                  <label className={LABEL_CLS}>All Filter</label>
                  <input
                    type="text"
                    value={galleryPage.filterAllLabel}
                    onChange={(e) =>
                      updateSection("galleryPage", (p) => ({
                        ...p,
                        filterAllLabel: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Conferences Filter</label>
                  <input
                    type="text"
                    value={galleryPage.filterConferencesLabel}
                    onChange={(e) =>
                      updateSection("galleryPage", (p) => ({
                        ...p,
                        filterConferencesLabel: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Booths Filter</label>
                  <input
                    type="text"
                    value={galleryPage.filterBoothsLabel}
                    onChange={(e) =>
                      updateSection("galleryPage", (p) => ({
                        ...p,
                        filterBoothsLabel: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Branding Filter</label>
                  <input
                    type="text"
                    value={galleryPage.filterBrandingLabel}
                    onChange={(e) =>
                      updateSection("galleryPage", (p) => ({
                        ...p,
                        filterBrandingLabel: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>
            </div>

            {/* Quote & Workflow Steps */}
            <div className="pt-4 border-t border-[#262638] space-y-4">
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                <div>
                  <label className={LABEL_CLS}>Spotlight Quote</label>
                  <input
                    type="text"
                    value={galleryPage.quoteText}
                    onChange={(e) =>
                      updateSection("galleryPage", (p) => ({
                        ...p,
                        quoteText: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
                <div>
                  <label className={LABEL_CLS}>Quote Attribution</label>
                  <input
                    type="text"
                    value={galleryPage.quoteAuthor}
                    onChange={(e) =>
                      updateSection("galleryPage", (p) => ({
                        ...p,
                        quoteAuthor: e.target.value,
                      }))
                    }
                    className={INPUT_CLS}
                  />
                </div>
              </div>

              <div className="flex items-center justify-between">
                <h4 className="text-xs font-bold text-white uppercase font-mono">
                  Production Workflow Steps ({galleryPage.workflowSteps.length})
                </h4>
                <button
                  type="button"
                  onClick={() => {
                    const nextStep: GalleryWorkflowStep = {
                      stepNumber: `0${galleryPage.workflowSteps.length + 1}`,
                      title: "New Stage",
                      description: "Describe this milestone in the event production workflow.",
                    };
                    updateSection("galleryPage", (p) => ({
                      ...p,
                      workflowSteps: [...p.workflowSteps, nextStep],
                    }));
                  }}
                  className="px-3 py-1.5 rounded-lg bg-yellow-400/15 hover:bg-yellow-400 text-yellow-400 hover:text-black text-xs font-mono font-bold flex items-center gap-1.5 transition-all cursor-pointer"
                >
                  <Plus className="w-3.5 h-3.5" />
                  <span>Add Step</span>
                </button>
              </div>

              <div className="grid grid-cols-1 md:grid-cols-2 gap-3">
                {galleryPage.workflowSteps.map((step, idx) => (
                  <div
                    key={idx}
                    className="p-3.5 rounded-xl bg-[#0d0d12] border border-[#2b2b3d] space-y-2"
                  >
                    <div className="flex items-center justify-between">
                      <span className="text-[10px] font-mono text-yellow-400 font-bold">
                        STEP #{step.stepNumber}
                      </span>
                      {galleryPage.workflowSteps.length > 1 && (
                        <button
                          type="button"
                          onClick={() =>
                            updateSection("galleryPage", (p) => ({
                              ...p,
                              workflowSteps: p.workflowSteps.filter((_, i) => i !== idx),
                            }))
                          }
                          className="text-zinc-500 hover:text-red-400 cursor-pointer"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      )}
                    </div>
                    <input
                      type="text"
                      value={step.title}
                      onChange={(e) =>
                        updateSection("galleryPage", (p) => {
                          const next = [...p.workflowSteps];
                          next[idx] = { ...next[idx], title: e.target.value };
                          return { ...p, workflowSteps: next };
                        })
                      }
                      className={`${INPUT_CLS} font-bold`}
                    />
                    <input
                      type="text"
                      value={step.description}
                      onChange={(e) =>
                        updateSection("galleryPage", (p) => {
                          const next = [...p.workflowSteps];
                          next[idx] = { ...next[idx], description: e.target.value };
                          return { ...p, workflowSteps: next };
                        })
                      }
                      className={INPUT_CLS}
                    />
                  </div>
                ))}
              </div>
            </div>

            {/* Bottom CTA */}
            <div className="pt-4 border-t border-[#262638] grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Bottom CTA Prefix</label>
                <input
                  type="text"
                  value={galleryPage.ctaHeadlinePrefix}
                  onChange={(e) =>
                    updateSection("galleryPage", (p) => ({
                      ...p,
                      ctaHeadlinePrefix: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Bottom CTA Highlight</label>
                <input
                  type="text"
                  value={galleryPage.ctaHeadlineHighlight}
                  onChange={(e) =>
                    updateSection("galleryPage", (p) => ({
                      ...p,
                      ctaHeadlineHighlight: e.target.value,
                    }))
                  }
                  className={`${INPUT_CLS} font-bold`}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Bottom CTA Button</label>
                <input
                  type="text"
                  value={galleryPage.ctaPrimaryButtonText}
                  onChange={(e) =>
                    updateSection("galleryPage", (p) => ({
                      ...p,
                      ctaPrimaryButtonText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </div>
        )}

        {/* ================= SECTION 8: GLOBAL HEADER & FOOTER LAYOUT ================= */}
        {activeSection === "layout" && (
          <div className="p-6 rounded-2xl bg-[#151520] border border-[#262638] space-y-6">
            <div className="flex items-center justify-between pb-4 border-b border-[#262638]">
              <div>
                <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
                  GLOBAL NAVIGATION BAR &amp; FOOTER LABELS
                </h3>
                <p className="text-xs text-zinc-400">
                  Synced across /, /why-us, and /gallery
                </p>
              </div>
            </div>

            <div className="grid grid-cols-2 md:grid-cols-5 gap-4">
              <div>
                <label className={LABEL_CLS}>Nav: Home</label>
                <input
                  type="text"
                  value={layout.navHomeLabel}
                  onChange={(e) =>
                    updateSection("layout", (p) => ({
                      ...p,
                      navHomeLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Nav: Why Us</label>
                <input
                  type="text"
                  value={layout.navWhyUsLabel}
                  onChange={(e) =>
                    updateSection("layout", (p) => ({
                      ...p,
                      navWhyUsLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Nav: Services</label>
                <input
                  type="text"
                  value={layout.navServicesLabel}
                  onChange={(e) =>
                    updateSection("layout", (p) => ({
                      ...p,
                      navServicesLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Nav: Gallery</label>
                <input
                  type="text"
                  value={layout.navGalleryLabel}
                  onChange={(e) =>
                    updateSection("layout", (p) => ({
                      ...p,
                      navGalleryLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Nav: Contact</label>
                <input
                  type="text"
                  value={layout.navContactLabel}
                  onChange={(e) =>
                    updateSection("layout", (p) => ({
                      ...p,
                      navContactLabel: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className={LABEL_CLS}>Header Vault CTA Button</label>
                <input
                  type="text"
                  value={layout.fullVaultCtaText}
                  onChange={(e) =>
                    updateSection("layout", (p) => ({
                      ...p,
                      fullVaultCtaText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Header Brief CTA Button</label>
                <input
                  type="text"
                  value={layout.briefCtaText}
                  onChange={(e) =>
                    updateSection("layout", (p) => ({
                      ...p,
                      briefCtaText: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>

            <div className="pt-4 border-t border-[#262638] grid grid-cols-1 md:grid-cols-3 gap-4">
              <div>
                <label className={LABEL_CLS}>Footer Brand Title</label>
                <input
                  type="text"
                  value={layout.footerBrandTitle}
                  onChange={(e) =>
                    updateSection("layout", (p) => ({
                      ...p,
                      footerBrandTitle: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Footer Brand Subtitle</label>
                <input
                  type="text"
                  value={layout.footerBrandSubtitle}
                  onChange={(e) =>
                    updateSection("layout", (p) => ({
                      ...p,
                      footerBrandSubtitle: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
              <div>
                <label className={LABEL_CLS}>Footer Copyright</label>
                <input
                  type="text"
                  value={layout.footerCopyright}
                  onChange={(e) =>
                    updateSection("layout", (p) => ({
                      ...p,
                      footerCopyright: e.target.value,
                    }))
                  }
                  className={INPUT_CLS}
                />
              </div>
            </div>
          </div>
        )}
      </main>

      {/* REVISION HISTORY MODAL */}
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
