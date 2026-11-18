import React, { useState, useRef } from "react";
import { Sparkles, Loader2, UploadCloud } from "lucide-react";
import type { ProjectRecord } from "@art-work/types";

interface ProjectCoverUploadCardProps {
  project: ProjectRecord;
  fbThumbnailUrl: string | null;
  isUploadingCover: boolean;
  onChangeProject: (project: ProjectRecord) => void;
  onUploadCoverFile: (file: File) => void;
  onSetManualCover: (url: string) => void;
  onApplyThumbnailAsCover: (url: string) => void;
  onResolveFacebookMetadata: () => void;
  onSetYtStatusMessage: (msg: string) => void;
}

export const ProjectCoverUploadCard = React.memo(function ProjectCoverUploadCard({
  project,
  fbThumbnailUrl,
  isUploadingCover,
  onChangeProject,
  onUploadCoverFile,
  onSetManualCover,
  onApplyThumbnailAsCover,
  onResolveFacebookMetadata,
  onSetYtStatusMessage,
}: ProjectCoverUploadCardProps) {
  const [isCoverDragging, setIsCoverDragging] = useState(false);
  const [manualCoverUrl, setManualCoverUrl] = useState("");
  const coverInputRef = useRef<HTMLInputElement | null>(null);

  return (
    <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-3">
      <div className="flex items-center justify-between flex-wrap gap-2">
        <label className="text-zinc-200 font-bold flex items-center gap-2">
          <Sparkles className="w-4 h-4 text-yellow-400" />
          <span>Card Thumbnail &amp; Cover Image (Main Website)</span>
        </label>
        <div className="flex items-center gap-2">
          {project.youtubeVideoId && (
            <button
              type="button"
              onClick={() => {
                const ytThumb = `https://img.youtube.com/vi/${project.youtubeVideoId}/hqdefault.jpg`;
                onChangeProject({ ...project, image: ytThumb });
                onSetYtStatusMessage("✓ Synced thumbnail directly from YouTube video");
              }}
              className="px-2.5 py-1 rounded-lg bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 text-[10px] font-bold border border-yellow-400/30 cursor-pointer transition-colors"
            >
              Sync Thumbnail from YouTube
            </button>
          )}
          {project.facebookUrl && (
            <button
              type="button"
              onClick={() => {
                if (fbThumbnailUrl) {
                  onApplyThumbnailAsCover(fbThumbnailUrl);
                } else {
                  onResolveFacebookMetadata();
                }
              }}
              className="px-2.5 py-1 rounded-lg bg-blue-600/20 hover:bg-blue-600/30 text-blue-300 text-[10px] font-bold border border-blue-500/30 cursor-pointer transition-colors"
            >
              Sync Thumbnail from Facebook
            </button>
          )}
          {project.image && (
            <button
              type="button"
              onClick={() => onChangeProject({ ...project, image: "" })}
              className="px-2 py-1 text-[10px] text-zinc-400 hover:text-red-400 cursor-pointer transition-colors"
            >
              Clear
            </button>
          )}
        </div>
      </div>

      {/* Drag & Drop Upload Zone + Preview */}
      <div className="grid grid-cols-1 sm:grid-cols-12 gap-3 items-stretch">
        <div className="sm:col-span-4 aspect-[16/10] sm:aspect-auto sm:h-28 rounded-xl overflow-hidden border border-[#2b2b3d] bg-black relative flex items-center justify-center">
          {project.image ? (
            <>
              {/* eslint-disable-next-line @next/next/no-img-element */}
              <img
                src={project.image}
                alt="Project Card Thumbnail"
                className="w-full h-full object-cover"
                onError={(e) => {
                  (e.currentTarget as HTMLImageElement).src =
                    "/assets/images/gallery/project_01_neon_horizon.jpg";
                }}
              />
              <div className="absolute top-1 left-1 bg-yellow-400 text-black font-black text-[9px] uppercase px-1.5 py-0.5 rounded shadow">
                Active Cover
              </div>
            </>
          ) : (
            <div className="flex flex-col items-center justify-center text-zinc-600 gap-1 p-2 text-center">
              <Sparkles className="w-5 h-5 text-zinc-700" />
              <span className="text-[10px] font-mono">No Cover Image</span>
            </div>
          )}
        </div>

        <div
          onDragOver={(e) => {
            e.preventDefault();
            setIsCoverDragging(true);
          }}
          onDragLeave={() => setIsCoverDragging(false)}
          onDrop={(e) => {
            e.preventDefault();
            setIsCoverDragging(false);
            const file = e.dataTransfer.files?.[0];
            if (file) onUploadCoverFile(file);
          }}
          onClick={() => !isUploadingCover && coverInputRef.current?.click()}
          className={`sm:col-span-8 border-2 border-dashed rounded-xl p-4 text-center cursor-pointer transition-all flex flex-col items-center justify-center gap-1.5 ${
            isCoverDragging
              ? "border-yellow-400 bg-yellow-400/10 scale-[1.01]"
              : "border-[#2b2b3d] bg-[#12121c] hover:border-yellow-400/60 hover:bg-[#151522]"
          }`}
        >
          <input
            ref={coverInputRef}
            type="file"
            accept="image/png, image/jpeg, image/webp"
            disabled={isUploadingCover}
            onChange={(e) => {
              const file = e.target.files?.[0];
              if (file) onUploadCoverFile(file);
              e.target.value = "";
            }}
            className="hidden"
          />
          {isUploadingCover ? (
            <div className="py-2 flex flex-col items-center gap-2">
              <Loader2 className="w-5 h-5 text-yellow-400 animate-spin" />
              <span className="font-mono text-zinc-400 text-[11px]">
                Uploading image...
              </span>
            </div>
          ) : (
            <>
              <div className="w-8 h-8 rounded-full bg-yellow-400/10 border border-yellow-400/20 flex items-center justify-center text-yellow-400">
                <UploadCloud className="w-4 h-4" />
              </div>
              <div>
                <p className="text-white text-xs font-bold">
                  Drag &amp; drop cover image here, or{" "}
                  <span className="text-yellow-400 underline">browse</span>
                </p>
                <p className="text-[10px] text-zinc-400 font-mono mt-0.5">
                  PNG, JPG, WebP (drag from desktop or click to upload)
                </p>
              </div>
            </>
          )}
        </div>
      </div>

      {/* Direct URL input for Cover Image */}
      <div className="flex flex-col sm:flex-row gap-2 pt-2 border-t border-[#1e1e2d]">
        <input
          type="url"
          placeholder="Or paste direct image URL (e.g. /assets/images/... or https://...)..."
          value={manualCoverUrl}
          onChange={(e) => setManualCoverUrl(e.target.value)}
          className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-1.5 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400 text-xs font-mono"
        />
        <button
          type="button"
          onClick={() => {
            onSetManualCover(manualCoverUrl);
            setManualCoverUrl("");
          }}
          disabled={!manualCoverUrl.trim()}
          className="px-3.5 py-1.5 rounded-xl bg-yellow-400/20 hover:bg-yellow-400/30 text-yellow-300 border border-yellow-400/30 text-xs font-bold disabled:opacity-40 cursor-pointer whitespace-nowrap"
        >
          + Set Cover Image
        </button>
      </div>
    </div>
  );
});
