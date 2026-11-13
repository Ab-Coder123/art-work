"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, ArrowUpRight, Play, Star, Sparkles } from "lucide-react";
import { KineticBrushWord } from "@/components/cinematic/KineticBrushStroke";
import { YouTubeVideoFacade } from "@/components/cinematic/YouTubeVideoFacade";
import rawProjects from "@/data/projects.json";
import {
  type ProjectRecord,
  resolveSafeYouTubeEmbed,
  getProjectThumbnailUrl,
  resolveHomeShowcaseItems,
} from "@art-work/types";
import { DEFAULT_HOME_SHOWCASE_CONTENT, type GalleryShowcaseStageProps } from "./types";

export const GalleryShowcaseStage = React.memo(function GalleryShowcaseStage({
  content = DEFAULT_HOME_SHOWCASE_CONTENT,
  initialProjects,
}: GalleryShowcaseStageProps) {
  const [projectsList, setProjectsList] = useState<ProjectRecord[]>(
    Array.isArray(initialProjects) && initialProjects.length > 0
      ? initialProjects
      : (rawProjects as ProjectRecord[])
  );
  const [selectedVideoId, setSelectedVideoId] = useState<string | null>(null);

  useEffect(() => {
    if (Array.isArray(initialProjects) && initialProjects.length > 0) {
      setProjectsList(initialProjects);
    }
  }, [initialProjects]);

  useEffect(() => {
    let mounted = true;
    (async () => {
      try {
        const res = await fetch("/api/projects?limit=24", { cache: "no-store" });
        if (res.ok) {
          const data = await res.json();
          if (mounted && Array.isArray(data.items) && data.items.length > 0) {
            setProjectsList(data.items);
          }
        }
      } catch {
        // Fallback to initialProjects / seed data
      }
    })();
    return () => {
      mounted = false;
    };
  }, []);

  const showcase = useMemo(
    () => resolveHomeShowcaseItems(projectsList),
    [projectsList]
  );

  const activeVideo = useMemo(() => {
    if (!showcase.primaryVideo) return null;
    if (selectedVideoId) {
      const matched = showcase.featuredVideos.find((v) => v.id === selectedVideoId);
      if (matched) return matched;
    }
    return showcase.primaryVideo;
  }, [showcase, selectedVideoId]);

  const activeYt = useMemo(
    () => (activeVideo ? resolveSafeYouTubeEmbed(activeVideo) : null),
    [activeVideo]
  );

  const gridItems = useMemo(() => {
    if (!activeVideo) return showcase.showcaseItems;
    return showcase.showcaseItems.filter((item) => item.id !== activeVideo.id);
  }, [showcase, activeVideo]);

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 flex flex-col justify-start">
      {/* ================= SECTION HEADER (Pages 3 & 4 Reference) ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 ring-b-1 ring-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcb858]/15 ring-1 ring-[#dcb858]/40 text-[#dcb858] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <span className="w-2 h-2 rounded-full bg-[#dcb858] animate-pulse"></span>
            <span>{content.badge}</span>
          </div>
          <h2 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase">
            {content.headlinePrefix}{" "}
            <KineticBrushWord
              variant="double"
              color="var(--color-primary-yellow, #dcb858)"
              strokeWidth={2.4}
            >
              {content.headlineHighlight}
            </KineticBrushWord>
          </h2>
          <p className="font-body text-xs sm:text-sm text-zinc-400 mt-1.5 leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/gallery"
            className="group inline-flex items-center gap-2 font-headline font-bold text-xs uppercase px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#dcb858] text-white hover:text-black ring-1 ring-white/15 hover:ring-[#dcb858] transition-all duration-200 cursor-pointer"
          >
            <span>
              {content.viewAllCtaText} ({projectsList.length})
            </span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ★ Star Multi-Video Switcher Strip */}
      {showcase.featuredVideos.length > 1 && (
        <div className="mb-4 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="inline-flex items-center gap-1.5 bg-[#dcb858]/15 ring-1 ring-[#dcb858]/30 text-[#dcb858] text-[11px] font-mono font-bold uppercase px-3 py-1.5 rounded-xl shrink-0">
            <Star className="w-3 h-3 fill-[#dcb858] text-[#dcb858]" />
            <span>HOME VIDEOS ({showcase.featuredVideos.length})</span>
          </span>
          {showcase.featuredVideos.map((vid, idx) => {
            const isCurrent = activeVideo?.id === vid.id;
            return (
              <button
                key={vid.id}
                type="button"
                onClick={() => setSelectedVideoId(vid.id)}
                className={`inline-flex items-center gap-2 px-3.5 py-1.5 rounded-xl font-headline font-bold text-xs uppercase whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isCurrent
                    ? "bg-[#dcb858] text-black font-black shadow-md ring-1 ring-[#dcb858]"
                    : "bg-[#0f0f18] text-zinc-300 hover:text-white hover:bg-[#161624] ring-1 ring-white/10"
                }`}
              >
                <Play className="w-3 h-3 fill-current" />
                <span>
                  {String(idx + 1).padStart(2, "0")}. {vid.title}
                </span>
              </button>
            );
          })}
        </div>
      )}

      {/* Primary Featured Video Cinema Theater */}
      {activeVideo && activeYt && (
        <div className="mb-6 p-5 sm:p-7 rounded-2xl ring-1 ring-white/10 hover:ring-[#dcb858]/40 bg-[#0c0c14] shadow-2xl transition-all duration-300">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            {/* Embedded YouTube Player Facade */}
            <div className="lg:col-span-7">
              <YouTubeVideoFacade
                key={activeVideo.id}
                embedUrl={activeYt.embedUrl}
                title={activeVideo.youtubeTitle || activeVideo.title}
                thumbnailUrl={getProjectThumbnailUrl(activeVideo)}
                videoId={activeYt.videoId}
                isShort={activeYt.isShort}
                sizes="(max-width: 1024px) 100vw, 55vw"
              />
            </div>

            {/* Video Info & Metadata */}
            <div className="lg:col-span-5 flex flex-col justify-between space-y-3">
              <div>
                <div className="flex items-center gap-2 mb-2.5 flex-wrap">
                  <span className="bg-[#dcb858] text-black text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md">
                    {activeVideo.year || 2026}
                  </span>
                  {activeVideo.metaBadge && (
                    <span className="bg-white/10 text-zinc-200 text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md ring-1 ring-white/15">
                      {activeVideo.metaBadge}
                    </span>
                  )}
                  <span className="bg-[#dcb858]/20 text-[#dcb858] text-[10px] font-mono font-bold px-2.5 py-0.5 rounded-md ring-1 ring-[#dcb858]/30">
                    {content.featuredEventBadge}
                  </span>
                  <span className="text-xs font-mono text-zinc-400 uppercase">
                    {activeVideo.client}
                  </span>
                </div>

                <h3 className="font-headline font-black text-xl sm:text-2xl text-white tracking-tight mb-2">
                  {activeVideo.title}
                </h3>

                {activeVideo.youtubeTitle &&
                  activeVideo.youtubeTitle !== activeVideo.title && (
                    <div className="text-xs sm:text-sm font-headline font-bold text-[#dcb858] mb-2">
                      🎬 {activeVideo.youtubeTitle}
                    </div>
                  )}

                <p className="font-body text-xs sm:text-sm text-zinc-300 leading-relaxed line-clamp-4 mb-4">
                  {activeVideo.youtubeDescription || activeVideo.description}
                </p>
              </div>

              <div className="pt-3 ring-t-1 ring-white/10 flex items-center justify-end flex-wrap gap-3">
                <a
                  href={activeYt.canonicalUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                  className="inline-flex items-center gap-1.5 bg-red-600/20 hover:bg-red-600 text-red-400 hover:text-white text-xs font-headline font-bold px-3.5 py-2 rounded-xl ring-1 ring-red-500/30 transition-all"
                >
                  <span>{content.youtubeButtonText}</span>
                  <ArrowUpRight className="w-3.5 h-3.5" />
                </a>
                <Link
                  href="/gallery"
                  className="inline-flex items-center gap-2 bg-[#dcb858] hover:bg-[#e6c975] text-black text-xs font-headline font-black px-4 py-2 rounded-xl transition-all shadow-md"
                >
                  <span>{content.exploreGalleryCtaText}</span>
                  <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                </Link>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Projects Grid (Pages 3 & 4 Reference) */}
      {gridItems.length > 0 && (
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-4 mb-4">
          {gridItems.map((p) => {
            const ytEmbed = resolveSafeYouTubeEmbed(p);
            const cardThumb = getProjectThumbnailUrl(p);

            if (ytEmbed) {
              return (
                <div
                  key={p.id}
                  className="group p-4 rounded-2xl bg-[#0d0d15]/90 hover:bg-[#13131e]/95 ring-1 ring-white/10 hover:ring-[#dcb858]/50 shadow-xl transition-all duration-300 flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-3 rounded-xl overflow-hidden ring-1 ring-white/10">
                      <YouTubeVideoFacade
                        embedUrl={ytEmbed.embedUrl}
                        title={p.youtubeTitle || p.title}
                        thumbnailUrl={cardThumb}
                        videoId={ytEmbed.videoId}
                        isShort={ytEmbed.isShort}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex items-center justify-between mb-1.5">
                      <span className="font-mono text-[10px] text-[#dcb858] uppercase font-bold">
                        {p.category}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-400">
                        {p.year || 2026}
                      </span>
                    </div>
                    <h4 className="font-headline font-black text-sm text-white group-hover:text-[#dcb858] transition-colors line-clamp-1 mb-1">
                      {p.title}
                    </h4>
                    <p className="font-body text-xs text-zinc-400 line-clamp-2">
                      {p.description}
                    </p>
                  </div>

                  <div className="pt-3 mt-3 ring-t-1 ring-white/10 flex items-center justify-between">
                    <span className="text-[11px] font-mono text-zinc-500 uppercase">
                      {p.client}
                    </span>
                    <Link
                      href={`/gallery#project-${p.id}`}
                      className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#dcb858] hover:underline"
                    >
                      <span>Explore</span>
                      <ArrowUpRight className="w-3.5 h-3.5" />
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <div
                key={p.id}
                className="group p-4 rounded-2xl bg-[#0d0d15]/90 hover:bg-[#13131e]/95 ring-1 ring-white/10 hover:ring-[#dcb858]/50 shadow-xl transition-all duration-300 flex flex-col justify-between"
              >
                <div>
                  <div className="mb-3 rounded-xl overflow-hidden aspect-[16/10] bg-[#07070a] ring-1 ring-white/10 relative">
                    <Image
                      src={cardThumb}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover object-center group-hover:scale-105 transition-transform duration-500"
                      unoptimized={cardThumb.startsWith("http") || cardThumb.startsWith("data:")}
                    />
                    <div className="absolute top-2.5 left-2.5 px-2 py-0.5 rounded-md bg-black/80 backdrop-blur-md ring-1 ring-white/20 text-[10px] font-mono font-bold text-[#dcb858] uppercase">
                      {p.category}
                    </div>
                  </div>

                  <div className="flex items-center justify-between mb-1.5">
                    <span className="font-mono text-xs text-zinc-400 uppercase">
                      {p.client}
                    </span>
                    <span className="text-[10px] font-mono text-zinc-500">
                      {p.year || 2026}
                    </span>
                  </div>
                  <h4 className="font-headline font-black text-sm sm:text-base text-white group-hover:text-[#dcb858] transition-colors line-clamp-1 mb-1">
                    {p.title}
                  </h4>
                  <p className="font-body text-xs text-zinc-400 line-clamp-2">
                    {p.description}
                  </p>
                </div>

                <div className="pt-3 mt-3 ring-t-1 ring-white/10 flex items-center justify-between">
                  <span className="text-[11px] font-mono text-emerald-400 flex items-center gap-1">
                    <Sparkles className="w-3 h-3" />
                    <span>Delivered</span>
                  </span>
                  <Link
                    href={`/gallery#project-${p.id}`}
                    className="inline-flex items-center gap-1 text-xs font-mono font-bold text-[#dcb858] hover:underline"
                  >
                    <span>View Project</span>
                    <ArrowUpRight className="w-3.5 h-3.5" />
                  </Link>
                </div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
});
