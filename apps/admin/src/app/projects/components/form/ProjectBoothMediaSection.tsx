import React, { useState, useRef } from "react";
import {
  Sparkles,
  Loader2,
  UploadCloud,
  FileText,
  Trash2,
  Video,
  X,
} from "lucide-react";
import { resolveSafeYouTubeEmbed, type ProjectRecord } from "@art-work/types";
import { BehanceIcon } from "../Icons";
import { FacebookVideoFieldCard } from "../FacebookVideoFieldCard";

interface ProjectBoothMediaSectionProps {
  project: ProjectRecord;
  isResolvingBehance: boolean;
  behanceStatusMessage: string | null;
  isUploadingImages: boolean;
  isUploadingPdf: boolean;
  resolvingFb: boolean;
  fbStatusMessage: string | null;
  fbThumbnailUrl: string | null;
  onChangeProject: (project: ProjectRecord) => void;
  onClearBehanceStatus: () => void;
  onFetchBehanceMetadata: () => void;
  onAddManualImage: (url: string) => void;
  onUploadImages: (files: FileList | null) => void;
  onUploadPdf: (file: File) => void;
  onYouTubeInputChange: (raw: string) => void;
  onFacebookInputChange: (raw: string) => void;
  onResolveFacebookMetadata: () => void;
  onApplyThumbnailAsCover: (url: string) => void;
  onToggleFbShort: (short: boolean) => void;
}

export const ProjectBoothMediaSection = React.memo(function ProjectBoothMediaSection({
  project,
  isResolvingBehance,
  behanceStatusMessage,
  isUploadingImages,
  isUploadingPdf,
  resolvingFb,
  fbStatusMessage,
  fbThumbnailUrl,
  onChangeProject,
  onClearBehanceStatus,
  onFetchBehanceMetadata,
  onAddManualImage,
  onUploadImages,
  onUploadPdf,
  onYouTubeInputChange,
  onFacebookInputChange,
  onResolveFacebookMetadata,
  onApplyThumbnailAsCover,
  onToggleFbShort,
}: ProjectBoothMediaSectionProps) {
  const [mediaSourceTab, setMediaSourceTab] = useState<"behance" | "upload">(
    project.behanceUrl ? "behance" : "upload"
  );
  const [manualImageUrl, setManualImageUrl] = useState("");
  const [isBoothImagesDragging, setIsBoothImagesDragging] = useState(false);
  const [isBoothPdfDragging, setIsBoothPdfDragging] = useState(false);

  const boothImagesInputRef = useRef<HTMLInputElement | null>(null);
  const boothPdfInputRef = useRef<HTMLInputElement | null>(null);

  const imagesList =
    project.images && project.images.length > 0
      ? project.images
      : project.image
      ? [project.image]
      : [];

  return (
    <div className="space-y-4">
      {/* SELECT MEDIA SOURCE TABS */}
      <div className="p-1 bg-[#101018] border border-[#2b2b3d] rounded-2xl flex items-center gap-1.5 shadow-inner">
        <button
          type="button"
          onClick={() => setMediaSourceTab("behance")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mediaSourceTab === "behance"
              ? "bg-blue-600 text-white shadow-lg shadow-blue-600/30 font-black"
              : "text-zinc-400 hover:text-white hover:bg-[#181824]"
          }`}
        >
          <BehanceIcon className="w-4 h-4" />
          <span>Behance 3D Project Sync</span>
          {project.behanceUrl && (
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse ml-0.5" />
          )}
        </button>

        <button
          type="button"
          onClick={() => setMediaSourceTab("upload")}
          className={`flex-1 py-2.5 px-3 rounded-xl font-bold text-xs flex items-center justify-center gap-2 transition-all cursor-pointer ${
            mediaSourceTab === "upload"
              ? "bg-yellow-400 text-black shadow-lg shadow-yellow-400/20 font-black"
              : "text-zinc-400 hover:text-white hover:bg-[#181824]"
          }`}
        >
          <UploadCloud className="w-4 h-4" />
          <span>Manual 3D Renders &amp; File Upload</span>
          {project.images?.length || project.image ? (
            <span className="text-[10px] bg-black/40 text-yellow-300 px-1.5 py-0.5 rounded-full ml-0.5">
              {project.images?.length || 1}
            </span>
          ) : null}
        </button>
      </div>

      {mediaSourceTab === "behance" ? (
        /* BEHANCE 3D INTEGRATION TAB */
        <div className="p-5 bg-gradient-to-br from-blue-950/40 via-[#0e1424] to-[#0d0d12] border-2 border-blue-500/50 rounded-2xl space-y-4 shadow-xl shadow-blue-950/30">
          <div className="flex items-center justify-between flex-wrap gap-2">
            <div className="flex items-center gap-2.5">
              <div className="w-8 h-8 rounded-xl bg-blue-600/30 border border-blue-400/40 flex items-center justify-center text-blue-400 shrink-0">
                <BehanceIcon className="w-4 h-4" />
              </div>
              <div>
                <div className="flex items-center gap-2">
                  <span className="text-white font-bold text-xs uppercase tracking-wider font-mono">
                    Behance 3D Project Sync
                  </span>
                  <span className="text-[9px] bg-blue-500/20 text-blue-300 border border-blue-500/30 px-1.5 py-0.5 rounded font-mono font-bold">
                    AUTO-IMPORT
                  </span>
                </div>
                <span className="text-[10px] text-blue-200/70 font-mono">
                  Paste Behance project URL to auto-extract high-res 3D perspective &amp;
                  portfolio link
                </span>
              </div>
            </div>
          </div>

          <div className="flex flex-col sm:flex-row gap-2">
            <div className="relative flex-1">
              <input
                type="text"
                placeholder="https://www.behance.net/gallery/12345678/Booth-Design..."
                value={project.behanceUrl || ""}
                onChange={(e) => {
                  onChangeProject({
                    ...project,
                    behanceUrl: e.target.value,
                  });
                  onClearBehanceStatus();
                }}
                className="w-full bg-[#151520] border border-blue-500/40 focus:border-blue-400 rounded-xl px-3.5 py-2.5 text-white placeholder:text-zinc-600 focus:outline-none text-xs font-mono pr-8"
              />
              {project.behanceUrl && (
                <button
                  type="button"
                  onClick={() => {
                    onChangeProject({ ...project, behanceUrl: null });
                    onClearBehanceStatus();
                  }}
                  className="absolute right-2.5 top-1/2 -translate-y-1/2 text-zinc-500 hover:text-red-400 cursor-pointer"
                  title="Clear URL"
                >
                  <X className="w-3.5 h-3.5" />
                </button>
              )}
            </div>
            <button
              type="button"
              onClick={onFetchBehanceMetadata}
              disabled={!project.behanceUrl || isResolvingBehance}
              className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white font-bold text-xs disabled:opacity-40 cursor-pointer shadow-lg shadow-blue-600/30 transition-all whitespace-nowrap active:scale-95"
            >
              {isResolvingBehance ? (
                <Loader2 className="w-4 h-4 animate-spin" />
              ) : (
                <Sparkles className="w-4 h-4" />
              )}
              <span>Auto-Fetch 3D Render</span>
            </button>
          </div>

          {behanceStatusMessage && (
            <div
              className={`text-xs font-mono px-3.5 py-2 rounded-xl border flex items-center gap-2 ${
                behanceStatusMessage.startsWith("✓")
                  ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
                  : "text-rose-300 bg-rose-500/10 border-rose-500/30"
              }`}
            >
              <span>{behanceStatusMessage}</span>
            </div>
          )}

          {project.image && !project.image.includes("project_01_neon_horizon.jpg") ? (
            <div className="pt-2 border-t border-blue-500/20 space-y-3">
              <div className="text-[10px] text-blue-300/80 font-mono flex items-center justify-between">
                <span>ACTIVE 3D PERSPECTIVE (EXTRACTED FROM BEHANCE)</span>
                <a
                  href={project.behanceUrl || undefined}
                  target="_blank"
                  rel="noreferrer"
                  className="text-blue-400 hover:underline flex items-center gap-1 font-bold"
                >
                  <span>Open Project on Behance ↗</span>
                </a>
              </div>
              <div className="relative aspect-[16/9] max-w-md mx-auto rounded-xl overflow-hidden border-2 border-blue-400/40 bg-black shadow-lg">
                {/* eslint-disable-next-line @next/next/no-img-element */}
                <img
                  src={project.image}
                  alt="Behance 3D Booth Preview"
                  referrerPolicy="no-referrer"
                  crossOrigin="anonymous"
                  className="w-full h-full object-cover"
                />
                <div className="absolute top-2 left-2 bg-blue-600 text-white text-[10px] font-black px-2 py-0.5 rounded shadow uppercase">
                  ★ BEHANCE 3D COVER
                </div>
              </div>

              <div className="pt-2 border-t border-blue-500/10 space-y-2">
                <label className="text-[11px] text-blue-200/90 font-mono block">
                  Add more 3D render angles from this Behance project (Copy image address
                  &amp; paste here):
                </label>
                <div className="flex flex-col sm:flex-row gap-2">
                  <input
                    type="url"
                    placeholder="https://mir-s3-cdn-cf.behance.net/..."
                    value={manualImageUrl}
                    onChange={(e) => setManualImageUrl(e.target.value)}
                    className="flex-1 bg-[#151520] border border-blue-500/30 rounded-xl px-3 py-1.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-blue-400 text-xs font-mono"
                  />
                  <button
                    type="button"
                    onClick={() => {
                      onAddManualImage(manualImageUrl);
                      setManualImageUrl("");
                    }}
                    disabled={!manualImageUrl.trim()}
                    className="px-3.5 py-1.5 rounded-xl bg-blue-600 hover:bg-blue-500 text-white text-xs font-bold disabled:opacity-40 cursor-pointer shadow whitespace-nowrap"
                  >
                    + Add Angle
                  </button>
                </div>

                {project.images && project.images.length > 1 && (
                  <div className="grid grid-cols-3 sm:grid-cols-4 gap-2 pt-1">
                    {project.images.map((img, idx) => {
                      const isCover = img === project.image;
                      return (
                        <div
                          key={idx}
                          className={`relative aspect-[16/10] rounded-lg overflow-hidden border p-0.5 bg-black cursor-pointer group ${
                            isCover ? "border-blue-400 ring-1 ring-blue-400" : "border-[#2b2b3d]"
                          }`}
                          onClick={() => onChangeProject({ ...project, image: img })}
                        >
                          {/* eslint-disable-next-line @next/next/no-img-element */}
                          <img
                            src={img}
                            alt={`Angle ${idx + 1}`}
                            referrerPolicy="no-referrer"
                            crossOrigin="anonymous"
                            className="w-full h-full object-cover"
                          />
                          {isCover && (
                            <span className="absolute top-1 left-1 bg-blue-600 text-white font-black text-[8px] px-1 py-0.2 rounded shadow">
                              Cover
                            </span>
                          )}
                        </div>
                      );
                    })}
                  </div>
                )}
              </div>
            </div>
          ) : (
            <div className="p-4 rounded-xl border border-dashed border-blue-500/30 bg-blue-500/5 text-center space-y-1.5 mt-2">
              <p className="text-xs text-blue-300 font-mono">
                ✦ جاهز لسحب صورة الغلاف من مشروع Behance
              </p>
              <p className="text-[11px] text-zinc-400">
                اضغط على{" "}
                <span className="text-blue-400 font-bold">
                  &ldquo;Auto-Fetch 3D Render&rdquo;
                </span>{" "}
                بالأعلى وسيتم جلب وتعيين صورة الرندر الحقيقية للمشروع تلقائياً.
              </p>
            </div>
          )}
        </div>
      ) : (
        /* MANUAL UPLOAD TAB */
        <div className="space-y-4">
          <div className="p-4 bg-[#0d0d14] border border-[#262638] rounded-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-yellow-400/20 text-yellow-400 border border-yellow-400/30 flex items-center justify-center">
                  <Sparkles className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Manual 3D Spatial Renders &amp; Photos
                  </span>
                  <span className="text-[10px] text-zinc-500 block font-mono">
                    Upload 3D perspectives, elevations or paste direct image links
                  </span>
                </div>
              </div>
              {project.images?.length || project.image ? (
                <span className="text-[10px] text-yellow-300 bg-yellow-400/10 border border-yellow-400/30 px-2 py-0.5 rounded-full font-mono">
                  {project.images?.length || 1} Renders Attached
                </span>
              ) : null}
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsBoothImagesDragging(true);
              }}
              onDragLeave={() => setIsBoothImagesDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsBoothImagesDragging(false);
                if (e.dataTransfer.files) onUploadImages(e.dataTransfer.files);
              }}
              onClick={() => !isUploadingImages && boothImagesInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-6 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-2 ${
                isBoothImagesDragging
                  ? "border-yellow-400 bg-yellow-400/10 scale-[1.01]"
                  : "border-[#2b2b3d] bg-[#12121c] hover:border-yellow-400/60 hover:bg-[#151522]"
              }`}
            >
              <input
                ref={boothImagesInputRef}
                type="file"
                accept="image/png, image/jpeg, image/webp"
                multiple
                disabled={isUploadingImages}
                onChange={(e) => {
                  onUploadImages(e.target.files);
                  e.target.value = "";
                }}
                className="hidden"
              />
              {isUploadingImages ? (
                <div className="py-2 flex flex-col items-center gap-2">
                  <Loader2 className="w-6 h-6 text-yellow-400 animate-spin" />
                  <span className="font-mono text-zinc-400 text-xs">
                    Uploading spatial renders to Supabase...
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-10 h-10 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400 shadow-[0_0_15px_rgba(250,204,21,0.15)]">
                    <UploadCloud className="w-5 h-5" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">
                      Drag &amp; drop booth images here, or{" "}
                      <span className="text-yellow-400 underline">browse</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      Select single or multiple perspectives (PNG, JPG, WebP)
                    </p>
                  </div>
                </>
              )}
            </div>

            <div className="flex flex-col sm:flex-row gap-2 pt-1 border-t border-[#1e1e2d]">
              <input
                type="url"
                placeholder="Or paste direct image URL (e.g. Behance CDN link, Unsplash, etc.)..."
                value={manualImageUrl}
                onChange={(e) => setManualImageUrl(e.target.value)}
                className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-1.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400 text-xs font-mono"
              />
              <button
                type="button"
                onClick={() => {
                  onAddManualImage(manualImageUrl);
                  setManualImageUrl("");
                }}
                disabled={!manualImageUrl.trim()}
                className="px-3.5 py-1.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-400/30 text-xs font-bold disabled:opacity-40 cursor-pointer whitespace-nowrap"
              >
                + Add Image URL
              </button>
            </div>

            {imagesList.length > 0 ? (
              <div className="grid grid-cols-2 sm:grid-cols-3 gap-3 pt-2">
                {imagesList.map((img, idx) => {
                  const isCover = img === project.image;
                  return (
                    <div
                      key={idx}
                      className={`relative rounded-xl border p-1.5 bg-[#151520] flex flex-col gap-1.5 ${
                        isCover ? "border-yellow-400 ring-1 ring-yellow-400" : "border-[#2b2b3d]"
                      }`}
                    >
                      <div className="relative aspect-[16/10] rounded-lg overflow-hidden bg-black">
                        {/* eslint-disable-next-line @next/next/no-img-element */}
                        <img
                          src={img}
                          alt={`Booth preview ${idx + 1}`}
                          className="w-full h-full object-cover"
                        />
                        {isCover && (
                          <span className="absolute top-1 left-1 bg-yellow-400 text-black font-black text-[9px] uppercase px-1.5 py-0.5 rounded shadow">
                            ★ Cover
                          </span>
                        )}
                      </div>
                      <div className="flex items-center justify-between gap-1 text-[10px]">
                        <button
                          type="button"
                          onClick={() => onChangeProject({ ...project, image: img })}
                          className={`px-2 py-0.5 rounded text-[10px] font-bold cursor-pointer transition-colors ${
                            isCover
                              ? "bg-yellow-400 text-black"
                              : "text-zinc-400 hover:text-white bg-[#20202e]"
                          }`}
                        >
                          {isCover ? "Primary Cover" : "Set as Cover"}
                        </button>
                        <button
                          type="button"
                          onClick={() => {
                            const filtered = imagesList.filter((_, i) => i !== idx);
                            const nextCover = isCover ? filtered[0] || "" : project.image;
                            onChangeProject({
                              ...project,
                              images: filtered,
                              image: nextCover,
                            });
                          }}
                          className="text-zinc-500 hover:text-red-400 p-1 cursor-pointer"
                          title="Remove Image"
                        >
                          <Trash2 className="w-3.5 h-3.5" />
                        </button>
                      </div>
                    </div>
                  );
                })}
              </div>
            ) : (
              <p className="text-[11px] text-zinc-500 italic">
                No images attached yet. Add at least 1 image.
              </p>
            )}
          </div>

          {/* ARCHITECTURAL BLUEPRINT & TECHNICAL SPEC (PDF) */}
          <div className="p-4 bg-[#0d0d14] border border-[#262638] rounded-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center">
                  <FileText className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Architectural Blueprint &amp; Specs (PDF)
                  </span>
                  <span className="text-[10px] text-zinc-500 block font-mono">
                    Floor plans, 3D technical elevation &amp; spatial layout sheets
                  </span>
                </div>
              </div>
              {project.pdfUrl && (
                <span className="text-[10px] text-emerald-400 font-mono bg-emerald-500/10 border border-emerald-500/30 px-2 py-0.5 rounded-full">
                  ✓ Blueprint Attached
                </span>
              )}
            </div>

            <div
              onDragOver={(e) => {
                e.preventDefault();
                setIsBoothPdfDragging(true);
              }}
              onDragLeave={() => setIsBoothPdfDragging(false)}
              onDrop={(e) => {
                e.preventDefault();
                setIsBoothPdfDragging(false);
                const file = e.dataTransfer.files?.[0];
                if (file) onUploadPdf(file);
              }}
              onClick={() => !isUploadingPdf && boothPdfInputRef.current?.click()}
              className={`border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
                isBoothPdfDragging
                  ? "border-amber-400 bg-amber-400/10 scale-[1.01]"
                  : "border-[#2b2b3d] bg-[#12121c] hover:border-amber-400/50 hover:bg-[#141420]"
              }`}
            >
              <input
                ref={boothPdfInputRef}
                type="file"
                accept="application/pdf,.pdf"
                disabled={isUploadingPdf}
                onChange={(e) => {
                  const file = e.target.files?.[0];
                  if (file) onUploadPdf(file);
                  e.target.value = "";
                }}
                className="hidden"
              />
              {isUploadingPdf ? (
                <div className="py-2 flex flex-col items-center gap-2">
                  <Loader2 className="w-5 h-5 text-amber-400 animate-spin" />
                  <span className="font-mono text-zinc-400 text-[11px]">
                    Uploading PDF blueprint...
                  </span>
                </div>
              ) : (
                <>
                  <div className="w-8 h-8 rounded-full bg-amber-500/10 border border-amber-500/20 flex items-center justify-center text-amber-400">
                    <FileText className="w-4 h-4" />
                  </div>
                  <div>
                    <p className="text-white text-xs font-bold">
                      Drag &amp; drop architectural PDF here, or{" "}
                      <span className="text-amber-400 underline">browse</span>
                    </p>
                    <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                      CAD drawings, spatial specs &amp; 3D axonometric sheets (Max 50MB)
                    </p>
                  </div>
                </>
              )}
            </div>

            {project.pdfUrl && (
              <div className="p-3 bg-amber-950/20 border border-amber-500/30 rounded-xl flex flex-wrap items-center justify-between gap-3">
                <div className="flex items-center gap-2.5 min-w-0">
                  <div className="w-9 h-9 rounded-lg bg-amber-500/20 text-amber-400 border border-amber-500/30 flex items-center justify-center shrink-0">
                    <FileText className="w-5 h-5" />
                  </div>
                  <div className="min-w-0">
                    <div className="font-bold text-white text-xs truncate">
                      {project.pdfTitle || "Architectural Blueprint (PDF)"}
                    </div>
                    <div className="text-[10px] text-zinc-400 font-mono truncate">
                      {project.pdfUrl}
                    </div>
                  </div>
                </div>
                <div className="flex items-center gap-2 shrink-0 ml-auto">
                  <a
                    href={project.pdfUrl}
                    target="_blank"
                    rel="noreferrer"
                    className="px-2.5 py-1 text-[11px] bg-amber-500/20 hover:bg-amber-500/30 text-amber-300 border border-amber-500/30 rounded-lg flex items-center gap-1 font-bold"
                  >
                    <span>View Blueprint ↗</span>
                  </a>
                  <button
                    type="button"
                    onClick={() => {
                      onChangeProject({ ...project, pdfUrl: null, pdfTitle: null });
                      if (boothPdfInputRef.current) boothPdfInputRef.current.value = "";
                    }}
                    className="px-2.5 py-1 text-[11px] bg-red-600/20 hover:bg-red-600/40 text-red-300 border border-red-500/40 rounded-lg flex items-center gap-1 font-bold cursor-pointer transition-colors"
                    title="Delete Attached PDF"
                  >
                    <Trash2 className="w-3.5 h-3.5" />
                    <span>Remove</span>
                  </button>
                </div>
              </div>
            )}
          </div>

          {/* VIDEO & WALKTHROUGH HUB */}
          <div className="p-4 bg-[#0d0d14] border border-[#262638] rounded-xl space-y-3">
            <div className="flex items-center justify-between flex-wrap gap-2">
              <div className="flex items-center gap-2">
                <div className="w-6 h-6 rounded-md bg-red-600/20 text-red-400 border border-red-500/30 flex items-center justify-center">
                  <Video className="w-3.5 h-3.5" />
                </div>
                <div>
                  <span className="text-xs font-bold text-white uppercase tracking-wider font-mono">
                    Booth Walkthrough &amp; Video Tour
                  </span>
                  <span className="text-[10px] text-zinc-500 block font-mono">
                    Optional YouTube showreel, spatial animation or vertical short
                  </span>
                </div>
              </div>

              <div className="flex items-center gap-1 bg-[#161622] p-1 rounded-lg border border-[#262638]">
                <button
                  type="button"
                  onClick={() => onChangeProject({ ...project, isShort: false })}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                    !project.isShort
                      ? "bg-red-500 text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  16:9 Showcase
                </button>
                <button
                  type="button"
                  onClick={() => onChangeProject({ ...project, isShort: true })}
                  className={`px-2 py-0.5 rounded text-[10px] font-mono cursor-pointer transition-colors ${
                    project.isShort
                      ? "bg-red-500 text-white font-bold"
                      : "text-zinc-400 hover:text-white"
                  }`}
                >
                  9:16 Reel/Shorts
                </button>
              </div>
            </div>

            <div className="flex flex-col sm:flex-row gap-2">
              <input
                type="text"
                placeholder="Paste YouTube video or Shorts link (e.g. youtube.com/watch?v=... or shorts/...)"
                value={project.youtubeUrl || ""}
                onChange={(e) => onYouTubeInputChange(e.target.value)}
                className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-red-500/60 text-xs font-mono"
              />
              {project.youtubeUrl && (
                <button
                  type="button"
                  onClick={() => onYouTubeInputChange("")}
                  className="px-3 py-2 rounded-xl bg-red-600/10 hover:bg-red-600/20 text-red-400 border border-red-500/20 text-xs font-bold cursor-pointer"
                >
                  Clear
                </button>
              )}
            </div>

            {(() => {
              const resolved = project.youtubeUrl
                ? resolveSafeYouTubeEmbed(project.youtubeUrl)
                : null;
              if (!resolved) return null;
              return (
                <div className="mt-2 pt-2 border-t border-[#1e1e2d] space-y-2">
                  <div className="flex items-center justify-between text-[10px] text-zinc-400 font-mono">
                    <span className="flex items-center gap-1.5 text-emerald-400">
                      <span className="w-1.5 h-1.5 rounded-full bg-emerald-400 animate-ping" />
                      Valid YouTube Embed (ID: {resolved.videoId})
                    </span>
                    <span>{project.isShort ? "9:16 Vertical Reel" : "16:9 Cinematic Video"}</span>
                  </div>
                  <div
                    className={`rounded-xl overflow-hidden border border-[#2b2b3d] bg-black ${
                      project.isShort
                        ? "aspect-[9/16] max-w-[220px] mx-auto"
                        : "aspect-video w-full max-w-md mx-auto"
                    }`}
                  >
                    <iframe
                      src={resolved.embedUrl}
                      title="Booth Video Walkthrough"
                      className="w-full h-full"
                      allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                      allowFullScreen
                    />
                  </div>
                </div>
              );
            })()}
          </div>

          {/* Facebook Video / Reel for Booth */}
          <FacebookVideoFieldCard
            facebookUrl={project.facebookUrl}
            isShort={Boolean(project.isShort)}
            onToggleShort={onToggleFbShort}
            thumbnailUrl={fbThumbnailUrl}
            onApplyThumbnailAsCover={onApplyThumbnailAsCover}
            onChange={onFacebookInputChange}
            onVerify={onResolveFacebookMetadata}
            isVerifying={resolvingFb}
            statusMessage={fbStatusMessage}
            variant="booth"
          />
        </div>
      )}
    </div>
  );
});
