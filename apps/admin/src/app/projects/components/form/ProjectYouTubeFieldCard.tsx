import React from "react";
import { Video, Sparkles, Loader2, Smartphone } from "lucide-react";
import { resolveSafeYouTubeEmbed, type ProjectRecord } from "@art-work/types";
import { YouTubeIcon } from "../Icons";

interface ProjectYouTubeFieldCardProps {
  project: ProjectRecord;
  resolvingYt: boolean;
  ytStatusMessage: string | null;
  onChangeProject: (project: ProjectRecord) => void;
  onYouTubeInputChange: (raw: string) => void;
  onFetchYouTubeMetadata: () => void;
}

export const ProjectYouTubeFieldCard = React.memo(function ProjectYouTubeFieldCard({
  project,
  resolvingYt,
  ytStatusMessage,
  onChangeProject,
  onYouTubeInputChange,
  onFetchYouTubeMetadata,
}: ProjectYouTubeFieldCardProps) {
  const resolvedPreview = resolveSafeYouTubeEmbed(
    project.youtubeVideoId || project.youtubeUrl
  );

  return (
    <div className="p-4 bg-[#0d0d12] border border-[#2b2b3d] rounded-xl space-y-3">
      <div className="flex flex-wrap items-center justify-between gap-2">
        <label className="text-zinc-200 font-bold flex items-center gap-2">
          <YouTubeIcon className="w-4 h-4 text-red-500" />
          <span>YouTube Video / Reel (Shorts) Link</span>
        </label>
        <span className="text-[10px] text-zinc-400">
          Supports youtube.com/watch, youtu.be, and youtube.com/shorts
        </span>
      </div>

      <div className="flex flex-col sm:flex-row gap-2">
        <input
          type="text"
          placeholder="https://www.youtube.com/watch?v=... or https://www.youtube.com/shorts/..."
          value={project.youtubeUrl || ""}
          onChange={(e) => onYouTubeInputChange(e.target.value)}
          className="flex-1 bg-[#151520] border border-[#2b2b3d] rounded-xl px-3 py-2 text-white placeholder:text-zinc-600 focus:outline-none focus:border-yellow-400"
        />
        <button
          type="button"
          onClick={onFetchYouTubeMetadata}
          disabled={!project.youtubeUrl || resolvingYt}
          className="inline-flex items-center justify-center gap-1.5 px-3.5 py-2 rounded-xl bg-yellow-400/15 hover:bg-yellow-400/25 text-yellow-300 border border-yellow-400/30 font-bold text-[11px] disabled:opacity-40 cursor-pointer whitespace-nowrap"
        >
          {resolvingYt ? (
            <Loader2 className="w-3.5 h-3.5 animate-spin" />
          ) : (
            <Sparkles className="w-3.5 h-3.5" />
          )}
          <span>Fetch Thumbnail, Headline &amp; Copy</span>
        </button>
      </div>

      {ytStatusMessage && (
        <div
          className={`text-[11px] font-mono px-3 py-1.5 rounded-lg border flex items-center gap-2 ${
            ytStatusMessage.startsWith("✓")
              ? "text-emerald-300 bg-emerald-500/10 border-emerald-500/30"
              : "text-rose-300 bg-rose-500/10 border-rose-500/30"
          }`}
        >
          <span>{ytStatusMessage}</span>
        </div>
      )}

      {resolvedPreview ? (
        <div className="space-y-3 pt-2 border-t border-[#222232]">
          <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
            <div>
              <label className="block text-[10px] text-zinc-400 mb-1">
                Video / Reel Headline (Displayed on Website)
              </label>
              <input
                type="text"
                placeholder="Headline of the YouTube Video or Reel..."
                value={project.youtubeTitle || ""}
                onChange={(e) =>
                  onChangeProject({
                    ...project,
                    youtubeTitle: e.target.value,
                  })
                }
                className="w-full bg-[#151520] border border-[#2b2b3d] rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-yellow-400"
              />
            </div>

            <div className="flex flex-col justify-between">
              <label className="block text-[10px] text-zinc-400 mb-1">
                Format &amp; Quick Sync
              </label>
              <div className="flex items-center gap-2">
                <label className="inline-flex items-center gap-1.5 text-[11px] text-zinc-300 bg-[#151520] border border-[#2b2b3d] px-2.5 py-1.5 rounded-lg cursor-pointer">
                  <input
                    type="checkbox"
                    checked={Boolean(project.isShort)}
                    onChange={(e) =>
                      onChangeProject({
                        ...project,
                        isShort: e.target.checked,
                      })
                    }
                    className="rounded text-yellow-400"
                  />
                  <Smartphone className="w-3 h-3 text-yellow-400" />
                  <span>9:16 Vertical Reel</span>
                </label>

                {project.youtubeTitle && (
                  <button
                    type="button"
                    onClick={() =>
                      onChangeProject({
                        ...project,
                        title: project.youtubeTitle || project.title,
                        description:
                          project.youtubeDescription || project.description,
                      })
                    }
                    title="نسخ عنوان ووصف اليوتيوب إلى الحقول الأساسية للمشروع"
                    className="px-2.5 py-1.5 rounded-lg bg-zinc-800 hover:bg-yellow-400 hover:text-black text-zinc-200 text-[10px] font-sans border border-zinc-700 transition-colors cursor-pointer"
                  >
                    نسخ للكارد الرئيسي (Apply to Card)
                  </button>
                )}
              </div>
            </div>
          </div>

          <div>
            <label className="block text-[10px] text-zinc-400 mb-1">
              Video / Reel Paragraph (Narrative Summary)
            </label>
            <textarea
              rows={2}
              placeholder="Paragraph describing the YouTube video or Reel..."
              value={project.youtubeDescription || ""}
              onChange={(e) =>
                onChangeProject({
                  ...project,
                  youtubeDescription: e.target.value,
                })
              }
              className="w-full bg-[#151520] border border-[#2b2b3d] rounded-lg px-2.5 py-1.5 text-white focus:outline-none focus:border-yellow-400 font-sans"
            />
          </div>

          <div className="space-y-1.5">
            <div className="text-[10px] font-mono text-emerald-400 flex items-center justify-between">
              <span className="flex items-center gap-1">
                <Video className="w-3 h-3" />
                <span>Sanitized Embed Preview (ID: {resolvedPreview.videoId})</span>
              </span>
              <span>{project.isShort ? "9:16 REEL / SHORT" : "16:9 SHOWREEL"}</span>
            </div>
            <div
              className={`${
                project.isShort
                  ? "aspect-[9/16] max-w-[240px] mx-auto"
                  : "aspect-video w-full"
              } rounded-lg overflow-hidden border border-[#262638] bg-black`}
            >
              <iframe
                src={resolvedPreview.embedUrl}
                title={project.youtubeTitle || "YouTube Video Preview"}
                className="w-full h-full"
                sandbox="allow-scripts allow-same-origin allow-presentation"
                allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                allowFullScreen
              />
            </div>
          </div>
        </div>
      ) : project.youtubeUrl ? (
        <p className="text-[10px] text-amber-400/90 font-mono">
          * Enter a valid YouTube watch, share, or shorts URL (raw &lt;iframe&gt; HTML is
          blocked for security).
        </p>
      ) : null}
    </div>
  );
});
