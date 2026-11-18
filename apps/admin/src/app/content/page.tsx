"use client";

import React from "react";
import { AdminHeader } from "@/components/AdminHeader";
import { Save, CheckCircle2, AlertCircle, History, Loader2 } from "lucide-react";
import { SECTION_TABS } from "./types";
import { useContentEditor } from "./hooks/useContentEditor";
import { ContentRevisionsModal } from "./components/ContentRevisionsModal";
import { HeroSectionForm } from "./components/sections/HeroSectionForm";
import { WhyUsTeaserForm } from "./components/sections/WhyUsTeaserForm";
import { ServicesSectionForm } from "./components/sections/ServicesSectionForm";
import { HomeShowcaseForm } from "./components/sections/HomeShowcaseForm";
import { ContactSectionForm } from "./components/sections/ContactSectionForm";
import { WhyUsPageForm } from "./components/sections/WhyUsPageForm";
import { GalleryPageForm } from "./components/sections/GalleryPageForm";
import { LayoutSectionForm } from "./components/sections/LayoutSectionForm";

export default function WebsiteContentEditor() {
  const {
    content,
    activeSection,
    setActiveSection,
    isSaved,
    isDirty,
    isLoading,
    isSaving,
    errorMessage,
    isHistoryOpen,
    setIsHistoryOpen,
    revisions,
    isLoadingHistory,
    rollingBackId,
    updateSection,
    handleSave,
    handleOpenHistory,
    handleRollback,
  } = useContentEditor();

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

        {/* Active CMS Section Form */}
        {activeSection === "manifesto" && (
          <HeroSectionForm manifesto={content.manifesto} updateSection={updateSection} />
        )}
        {activeSection === "whyUsTeaser" && (
          <WhyUsTeaserForm whyUsTeaser={content.whyUsTeaser} updateSection={updateSection} />
        )}
        {activeSection === "services" && (
          <ServicesSectionForm services={content.services} updateSection={updateSection} />
        )}
        {activeSection === "homeShowcase" && (
          <HomeShowcaseForm homeShowcase={content.homeShowcase} updateSection={updateSection} />
        )}
        {activeSection === "contact" && (
          <ContactSectionForm contact={content.contact} updateSection={updateSection} />
        )}
        {activeSection === "whyUsPage" && (
          <WhyUsPageForm whyUsPage={content.whyUsPage} updateSection={updateSection} />
        )}
        {activeSection === "galleryPage" && (
          <GalleryPageForm galleryPage={content.galleryPage} updateSection={updateSection} />
        )}
        {activeSection === "layout" && (
          <LayoutSectionForm layout={content.layout} updateSection={updateSection} />
        )}
      </main>

      <ContentRevisionsModal
        isOpen={isHistoryOpen}
        isLoading={isLoadingHistory}
        revisions={revisions}
        rollingBackId={rollingBackId}
        onClose={() => setIsHistoryOpen(false)}
        onRollback={handleRollback}
      />
    </div>
  );
}
