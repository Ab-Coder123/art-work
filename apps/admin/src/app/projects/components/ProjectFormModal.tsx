import React from "react";
import { X, Save, Loader2, Star, AlertTriangle } from "lucide-react";
import type { ProjectRecord } from "@art-work/types";
import { BehanceIcon } from "./Icons";
import { FacebookVideoFieldCard } from "./FacebookVideoFieldCard";
import { useProjectFormMedia } from "../hooks/useProjectFormMedia";
import { ProjectBasicDetailsFields } from "./form/ProjectBasicDetailsFields";
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

  return (
    <div className="fixed inset-0 bg-black/85 backdrop-blur-md z-50 flex items-center justify-center p-3 sm:p-6 overflow-hidden">
      <form
        onSubmit={handleSubmit}
        className="bg-[#151520] border border-[#2b2b3d] rounded-2xl max-w-3xl w-full max-h-[92vh] flex flex-col shadow-2xl overflow-hidden"
      >
        {/* Sticky Top Header */}
        <div className="flex items-center justify-between px-6 py-4 border-b border-[#262638] bg-[#171724] shrink-0">
          <div className="flex items-center gap-3">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black text-xs shadow-[2px_2px_0px_#ffffff]">
              AW
            </div>
            <div>
              <h3 className="text-sm font-bold text-white font-mono uppercase">
                {editingProject.id.startsWith("project-")
                  ? "New Showcase Project"
                  : "Edit Project Record"}
              </h3>
              <p className="text-[10px] text-zinc-400 font-mono">
                Scroll Y active • Configuring media, copy &amp; YouTube synchronization
              </p>
            </div>
          </div>
          <button
            type="button"
            onClick={onClose}
            className="p-1.5 text-zinc-400 hover:text-white rounded-lg hover:bg-[#20202e] cursor-pointer transition-colors"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Scrollable Form Body */}
        <div className="flex-1 overflow-y-auto px-6 py-5 space-y-5 text-xs font-mono overscroll-contain">
          <ProjectBasicDetailsFields
            project={editingProject}
            onChange={setEditingProject}
          />

          {/* Global Media Upload Error */}
          {uploadError && (
            <div className="p-3.5 bg-red-950/60 border-2 border-red-500/60 rounded-xl text-red-200 text-xs flex items-center justify-between gap-3 shadow-lg shadow-red-950/30">
              <div className="flex items-center gap-2">
                <span className="font-bold">⚠️ Upload Error:</span>
                <span>{uploadError}</span>
              </div>
              <button
                type="button"
                onClick={() => setUploadError(null)}
                className="p-1 text-red-400 hover:text-white hover:bg-red-900/40 rounded-lg cursor-pointer transition-colors"
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
              <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-2">
                <div className="flex items-center justify-between">
                  <label className="text-zinc-200 font-bold flex items-center gap-2 text-xs">
                    <BehanceIcon className="w-4 h-4 text-blue-400" />
                    <span>Attach Behance Project Link</span>
                  </label>
                  <span className="text-[10px] text-zinc-400 font-mono">
                    Optional link to Behance portfolio
                  </span>
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
                  className="w-full bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-400 text-xs font-mono"
                />
              </div>
            </div>
          )}
        </div>

        {/* Validation / Error banner */}
        {modalError && (
          <div className="mx-6 my-2.5 p-3 rounded-xl bg-rose-950/80 border border-rose-500/50 text-rose-200 text-xs flex items-start justify-between gap-2.5 shrink-0">
            <div className="flex items-start gap-2.5">
              <AlertTriangle className="w-4 h-4 shrink-0 text-rose-400 mt-0.5" />
              <div>
                <span className="font-bold block mb-0.5 font-sans">
                  تنبيه التحقق من البيانات:
                </span>
                <p className="leading-relaxed opacity-90 font-sans">{modalError}</p>
              </div>
            </div>
            <button
              type="button"
              onClick={() => setModalError(null)}
              className="text-rose-400 hover:text-white cursor-pointer text-sm shrink-0"
              aria-label="Dismiss error"
            >
              <X className="w-4 h-4" />
            </button>
          </div>
        )}

        {/* Sticky Bottom Actions Footer */}
        <div className="px-6 py-3.5 border-t border-[#262638] bg-[#12121a] flex items-center justify-between shrink-0">
          <div className="flex flex-wrap items-center gap-4">
            <div className="flex items-center gap-2">
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
                className="w-4 h-4 rounded bg-[#0d0d12] border-[#2b2b3d] text-yellow-400 focus:ring-0 cursor-pointer"
              />
              <label htmlFor="statusCheck" className="text-zinc-300 cursor-pointer select-none">
                Publish to live /gallery view
              </label>
            </div>

            <div className="flex items-center gap-2 px-2.5 py-1 rounded-lg bg-yellow-400/10 border border-yellow-400/30">
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
                className="w-4 h-4 rounded bg-[#0d0d12] border-[#2b2b3d] text-yellow-400 focus:ring-0 cursor-pointer"
              />
              <label
                htmlFor="featuredHomeCheck"
                className="text-yellow-300 font-bold cursor-pointer select-none flex items-center gap-1"
              >
                <Star className="w-3.5 h-3.5 fill-yellow-400 text-yellow-400" />
                <span>★ Show on Home Page (Video / Showcase)</span>
              </label>
            </div>
          </div>

          <div className="flex items-center gap-3">
            <button
              type="button"
              onClick={onClose}
              className="px-4 py-2 rounded-xl text-zinc-400 hover:text-white border border-[#2b2b3d] hover:bg-[#20202e] cursor-pointer transition-colors"
            >
              Cancel
            </button>
            <button
              type="submit"
              disabled={isSaving}
              className="flex items-center gap-2 px-5 py-2 bg-yellow-400 hover:bg-yellow-300 text-black font-bold rounded-xl cursor-pointer transition-all shadow-[2px_2px_0px_#ffffff] disabled:opacity-50"
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
