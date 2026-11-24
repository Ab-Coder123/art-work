import React, { useState } from "react";
import { X, Save, Loader2, Star, AlertTriangle, Layers, Languages } from "lucide-react";
import type { Locale, ProjectRecord } from "@art-work/types";
import { BehanceIcon } from "./Icons";
import { FacebookVideoFieldCard } from "./FacebookVideoFieldCard";
import { useProjectFormMedia } from "../hooks/useProjectFormMedia";
import { ProjectBasicDetailsFields } from "./form/ProjectBasicDetailsFields";
import { ProjectArabicFieldsCard } from "./form/ProjectArabicFieldsCard";
import { ProjectBoothMediaSection } from "./form/ProjectBoothMediaSection";
import { ProjectCoverUploadCard } from "./form/ProjectCoverUploadCard";
import { ProjectGiveawaysPdfCard } from "./form/ProjectGiveawaysPdfCard";
import { ProjectYouTubeFieldCard } from "./form/ProjectYouTubeFieldCard";

export interface ProjectFormModalProps {
  project: ProjectRecord;
  isCreatingNew: boolean;
  isSaving: boolean;
  modalError: string | null;
  onClose: () => void;
  onSave: (project: ProjectRecord) => void;
  setModalError: (err: string | null) => void;
}

export function ProjectFormModal({
  project,
  isSaving,
  modalError,
  onClose,
  onSave,
  setModalError,
}: ProjectFormModalProps) {
  const {
    editingProject,
    setEditingProject,
    resolvingYt,
    ytStatusMessage,
    setYtStatusMessage,
    resolvingFb,
    fbStatusMessage,
    setFbStatusMessage,
    fbThumbnailUrl,
    isResolvingBehance,
    behanceStatusMessage,
    setBehanceStatusMessage,
    uploadError,
    setUploadError,
    isUploadingCover,
    isUploadingImages,
    isUploadingPdf,
    applyThumbnailAsCover,
    addManualImageUrl,
    setManualCover,
    setManualPdf,
    handleFetchBehanceMetadata,
    handleUploadCoverFile,
    handleUploadImages,
    handleUploadPdf,
    handleYouTubeInputChange,
    handleFacebookInputChange,
    handleResolveFacebookMetadata,
    handleFetchYouTubeMetadata,
  } = useProjectFormMedia(project);

  const [modalLocale, setModalLocale] = useState<Locale>("en");
  const hasArabicTranslation = Boolean(editingProject.translations?.ar?.title?.trim());

  const handleToggleFbShort = (short: boolean) => {
    setEditingProject((prev) => ({ ...prev, isShort: short }));
    setFbStatusMessage(
      short
        ? "تم ضبط المشغل على 9:16 رأسي (Vertical Reel)"
        : "تم ضبط المشغل على 16:9 أفقي (Horizontal Video)"
    );
  };

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSave(editingProject);
  };

  const isNew = editingProject.id.startsWith("project-");

  return (
    <div
      className="fixed inset-0 bg-black/75 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden"
      onClick={onClose}
    >
      <form
        onSubmit={handleSubmit}
        onClick={(e) => e.stopPropagation()}
        className="bg-[#121318] border border-white/10 rounded-2xl max-w-3xl w-full max-h-[90vh] flex flex-col shadow-[0_24px_64px_rgba(0,0,0,0.75)] overflow-hidden"
      >
        {/* Sticky Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-white/[0.08] bg-[#16171e] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-xl bg-amber-400/10 border border-amber-400/20 text-amber-400 flex items-center justify-center">
              <Layers className="w-4 h-4" />
            </div>
            <div>
              <h3 className="text-sm font-semibold text-white tracking-tight">
                {isNew ? "Create New Project" : "Edit Project"}
              </h3>
              <p className="text-xs text-zinc-400">
                Configure showcase details, media assets, and live visibility
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="w-8 h-8 rounded-lg text-zinc-400 hover:text-white hover:bg-white/[0.06] flex items-center justify-center cursor-pointer transition-colors"
            aria-label="Close modal"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Bilingual Language Switcher Bar */}
        <div className="px-6 py-2.5 border-b border-white/[0.06] bg-[#13141b] flex items-center justify-between gap-3 shrink-0">
          <div className="flex items-center gap-2 text-xs text-zinc-400">
            <Languages className="w-3.5 h-3.5 text-amber-400" />
            <span>
              {modalLocale === "ar"
                ? "Arabic Translation Fields (RTL)"
                : "English Details & Shared Media"}
            </span>
          </div>
          <div className="inline-flex items-center gap-1 p-0.5 rounded-lg bg-[#0b0c10] border border-white/10">
            <button
              type="button"
              onClick={() => setModalLocale("en")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer ${
                modalLocale === "en"
                  ? "bg-amber-400 text-zinc-950 font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              English (EN)
            </button>
            <button
              type="button"
              onClick={() => setModalLocale("ar")}
              className={`px-3 py-1 rounded-md text-xs font-medium transition-all cursor-pointer flex items-center gap-1.5 ${
                modalLocale === "ar"
                  ? "bg-amber-400 text-zinc-950 font-semibold"
                  : "text-zinc-400 hover:text-white"
              }`}
            >
              <span>العربية (AR)</span>
              {hasArabicTranslation && (
                <span className="w-1.5 h-1.5 rounded-full bg-emerald-400" title="Arabic translation saved" />
              )}
            </button>
          </div>
        </div>

        {/* Dedicated Scrollable Y Body */}
        <div className="flex-1 overflow-y-auto overscroll-contain px-6 py-5 space-y-5 text-sm">
          {modalLocale === "ar" ? (
            <ProjectArabicFieldsCard
              project={editingProject}
              onChange={setEditingProject}
            />
          ) : (
            <>
              <ProjectBasicDetailsFields
                project={editingProject}
                onChange={setEditingProject}
              />

              {/* Global Media Upload Error */}
              {uploadError && (
                <div className="p-3.5 bg-rose-950/50 border border-rose-500/40 rounded-xl text-rose-200 text-xs flex items-center justify-between gap-3">
                  <div className="flex items-center gap-2">
                    <AlertTriangle className="w-4 h-4 text-rose-400 shrink-0" />
                    <span>{uploadError}</span>
                  </div>
                  <button
                    type="button"
                    onClick={() => setUploadError(null)}
                    className="p-1 text-rose-400 hover:text-white hover:bg-rose-900/40 rounded-lg cursor-pointer transition-colors"
                    title="Dismiss error"
                  >
                    <X className="w-4 h-4" />
                  </button>
                </div>
              )}

              {/* Dynamic Media Engine: Exhibition Booths vs Conferences/Branding */}
              {editingProject.category === "booths" ? (
                <ProjectBoothMediaSection
                  project={editingProject}
                  isResolvingBehance={isResolvingBehance}
                  behanceStatusMessage={behanceStatusMessage}
                  isUploadingImages={isUploadingImages}
                  isUploadingPdf={isUploadingPdf}
                  resolvingFb={resolvingFb}
                  fbStatusMessage={fbStatusMessage}
                  fbThumbnailUrl={fbThumbnailUrl}
                  onChangeProject={setEditingProject}
                  onClearBehanceStatus={() => setBehanceStatusMessage(null)}
                  onFetchBehanceMetadata={handleFetchBehanceMetadata}
                  onAddManualImage={addManualImageUrl}
                  onUploadImages={handleUploadImages}
                  onUploadPdf={handleUploadPdf}
                  onYouTubeInputChange={handleYouTubeInputChange}
                  onFacebookInputChange={handleFacebookInputChange}
                  onResolveFacebookMetadata={handleResolveFacebookMetadata}
                  onApplyThumbnailAsCover={applyThumbnailAsCover}
                  onToggleFbShort={handleToggleFbShort}
                />
              ) : (
                <div className="space-y-4">
                  <ProjectCoverUploadCard
                    project={editingProject}
                    fbThumbnailUrl={fbThumbnailUrl}
                    isUploadingCover={isUploadingCover}
                    onChangeProject={setEditingProject}
                    onUploadCoverFile={handleUploadCoverFile}
                    onSetManualCover={setManualCover}
                    onApplyThumbnailAsCover={applyThumbnailAsCover}
                    onResolveFacebookMetadata={handleResolveFacebookMetadata}
                    onSetYtStatusMessage={setYtStatusMessage}
                  />

                  {editingProject.category === "branding" && (
                    <ProjectGiveawaysPdfCard
                      project={editingProject}
                      isUploadingPdf={isUploadingPdf}
                      onChangeProject={setEditingProject}
                      onUploadPdf={handleUploadPdf}
                      onSetManualPdf={setManualPdf}
                    />
                  )}

                  <ProjectYouTubeFieldCard
                    project={editingProject}
                    resolvingYt={resolvingYt}
                    ytStatusMessage={ytStatusMessage}
                    onChangeProject={setEditingProject}
                    onYouTubeInputChange={handleYouTubeInputChange}
                    onFetchYouTubeMetadata={handleFetchYouTubeMetadata}
                  />

                  <FacebookVideoFieldCard
                    facebookUrl={editingProject.facebookUrl}
                    isShort={Boolean(editingProject.isShort)}
                    onToggleShort={handleToggleFbShort}
                    thumbnailUrl={fbThumbnailUrl}
                    onApplyThumbnailAsCover={applyThumbnailAsCover}
                    onChange={handleFacebookInputChange}
                    onVerify={handleResolveFacebookMetadata}
                    isVerifying={resolvingFb}
                    statusMessage={fbStatusMessage}
                    variant="standard"
                  />

                  {/* Optional Behance Link */}
                  <div className="p-4 bg-[#0b0c10] border border-white/10 rounded-xl space-y-2">
                    <div className="flex items-center justify-between">
                      <label className="text-zinc-200 font-medium flex items-center gap-2 text-xs">
                        <BehanceIcon className="w-4 h-4 text-blue-400" />
                        <span>Behance Portfolio Link</span>
                      </label>
                      <span className="text-[11px] text-zinc-500">Optional</span>
                    </div>
                    <input
                      type="text"
                      placeholder="https://www.behance.net/gallery/12345678/..."
                      value={editingProject.behanceUrl || ""}
                      onChange={(e) =>
                        setEditingProject({
                          ...editingProject,
                          behanceUrl: e.target.value,
                        })
                      }
                      className="w-full bg-[#121318] border border-white/10 rounded-xl px-3.5 py-2 text-xs text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-400/80 transition-all"
                    />
                  </div>
                </div>
              )}
            </>
          )}
        </div>

        {/* Validation / Error banner */}
        {modalError && (
          <div className="mx-6 my-2.5 p-3 rounded-xl bg-rose-950/70 border border-rose-500/40 text-rose-200 text-xs flex items-start justify-between gap-2.5 shrink-0">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <span className="font-semibold block mb-0.5">تنبيه التحقق من البيانات:</span>
                <p className="leading-relaxed opacity-90">{modalError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalError(null)}
              className="text-rose-400 hover:text-white cursor-pointer shrink-0"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sticky Bottom Actions Footer */}
        <div className="px-6 py-4 border-t border-white/[0.08] bg-[#16171e] flex flex-wrap items-center justify-between gap-3 shrink-0">
          <div className="flex flex-wrap items-center gap-4 text-xs">
            <label className="flex items-center gap-2 text-zinc-300 cursor-pointer select-none">
              <input
                type="checkbox"
                id="statusCheck"
                checked={editingProject.status === "published"}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    status: e.target.checked ? "published" : "draft",
                  })
                }
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
              <span>Publish to gallery</span>
            </label>

            <label className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-amber-400/10 border border-amber-400/20 text-amber-300 font-medium cursor-pointer select-none">
              <input
                type="checkbox"
                id="featuredHomeCheck"
                checked={Boolean(editingProject.featured)}
                onChange={(e) =>
                  setEditingProject({
                    ...editingProject,
                    featured: e.target.checked,
                    status: e.target.checked ? "published" : editingProject.status,
                  })
                }
                className="w-4 h-4 rounded accent-amber-400 cursor-pointer"
              />
              <Star className="w-3.5 h-3.5 fill-amber-400 text-amber-400" />
              <span>★ Show on Home Page (Video / Showcase)</span>
            </label>
          </div>

          <div className="flex items-center gap-2.5 ml-auto">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-xs font-medium text-zinc-300 hover:text-white bg-white/[0.05] hover:bg-white/[0.1] border border-white/10 cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-1.5 px-5 py-2 bg-amber-400 hover:bg-amber-300 text-zinc-950 text-xs font-semibold rounded-xl cursor-pointer transition-all disabled:opacity-50"
            >
              {isSaving ? (
                <Loader2 className="w-3.5 h-3.5 animate-spin" />
              ) : (
                <Save className="w-3.5 h-3.5" />
              )}
              <span>Save Project</span>
            </button>
          </div>
        </div>
      </form>
    </div>
  );
}
