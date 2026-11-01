"use client";

import React, { useEffect, useMemo, useState } from "react";
import Image from "next/image";
import Link from "next/link";
import { ArrowRight, Play, Star } from "lucide-react";
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
    <div className="w-full max-w-7xl mx-auto pt-2 pb-6 flex flex-col justify-start">
      {/* Comic Section Header */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 mb-2 sm:mb-2.5 pb-1.5 border-b-2 border-black dark:border-zinc-700">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1 border border-black comic-shadow-sm text-xs font-headline font-black uppercase mb-1.5 -rotate-1">
            <span>{content.badge}</span>
          </div>
          <h2 className="font-headline font-black text-xl sm:text-2xl lg:text-3xl text-black dark:text-white tracking-tight uppercase">
            {content.headlinePrefix}{" "}
            <KineticBrushWord
              variant="double"
              color="var(--color-primary-yellow, #dcb858)"
              strokeWidth={2.4}
            >
              {content.headlineHighlight}
            </KineticBrushWord>
          </h2>
          <p className="font-body text-xs sm:text-sm text-black/75 dark:text-zinc-300 mt-1">
            {content.description}
          </p>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/gallery"
            className="inline-flex items-center gap-1.5 font-headline font-black text-xs uppercase bg-yellow-400 hover:bg-yellow-300 text-black px-4 py-2 rounded border-2 border-black comic-shadow-sm transition-all"
          >
            <span>
              {content.viewAllCtaText} ({projectsList.length})
            </span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* ★ Star Multi-Video Switcher Strip (Automatically shown when 2+ videos are starred for Home) */}
      {showcase.featuredVideos.length > 1 && (
        <div className="mb-3 flex items-center gap-2 overflow-x-auto no-scrollbar py-1">
          <span className="inline-flex items-center gap-1 bg-black text-yellow-400 text-[10px] font-headline font-black uppercase px-2.5 py-1.5 rounded-lg border border-black shrink-0">
            <Star className="w-3 h-3 fill-yellow-400 text-yellow-400" />
            <span>HOME VIDEOS ({showcase.featuredVideos.length})</span>
          </span>
          {showcase.featuredVideos.map((vid, idx) => {
            const isCurrent = activeVideo?.id === vid.id;
            return (
              <button
                key={vid.id}
                type="button"
                onClick={() => setSelectedVideoId(vid.id)}
                className={`inline-flex items-center gap-1.5 px-3 py-1.5 rounded-lg border-2 font-headline font-black text-[11px] uppercase whitespace-nowrap transition-all cursor-pointer shrink-0 ${
                  isCurrent
                    ? "bg-yellow-400 text-black border-black comic-shadow-sm -rotate-1"
                    : "bg-white dark:bg-[#181824] text-black/80 dark:text-zinc-200 border-black/40 dark:border-zinc-700 hover:border-black dark:hover:border-yellow-400"
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
        <div className="mb-4 sm:mb-5 p-4 sm:p-6 rounded-2xl border border-black/[0.06] dark:border-white/[0.08] bg-white dark:bg-[#151520] shadow-[0_10px_35px_-5px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.6)]">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-center">
            {/* Responsive Embedded YouTube Player Facade */}
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
                <div className="flex items-center gap-2 mb-2 flex-wrap">
                  <span className="bg-yellow-400 text-black text-[10px] font-headline font-black px-2.5 py-0.5 rounded border border-black comic-shadow-sm font-mono">
                    {activeVideo.year || 2026}
                  </span>
                  {activeVideo.metaBadge && (
                    <span className="bg-yellow-400 text-black text-[10px] font-headline font-black px-2.5 py-0.5 rounded border border-black comic-shadow-sm">
                      {activeVideo.metaBadge}
                    </span>
                  )}
                  <span className="bg-yellow-400 text-black text-[10px] font-headline font-black px-2.5 py-0.5 rounded border border-black comic-shadow-sm">
                    {content.featuredEventBadge}
                  </span>
                  <span className="text-xs font-mono text-black/60 dark:text-zinc-400 uppercase">
                    {activeVideo.client}
                  </span>
                </div>

                <h3 className="font-headline font-black text-xl sm:text-2xl text-black dark:text-white tracking-tight mb-1.5">
                  {activeVideo.title}
                </h3>

                {activeVideo.youtubeTitle &&
                  activeVideo.youtubeTitle !== activeVideo.title && (
                    <div className="text-xs sm:text-sm font-headline font-extrabold text-red-600 dark:text-red-400 mb-1.5">
                      🎬 {activeVideo.youtubeTitle}
                    </div>
                  )}

                <p className="font-body text-xs sm:text-sm text-black/80 dark:text-zinc-300 leading-relaxed line-clamp-4 mb-3">
                  {activeVideo.youtubeDescription || activeVideo.description}
                </p>
              </div>

              <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-end flex-wrap gap-2">
                <div className="flex items-center gap-2.5">
                  <a
                    href={activeYt.canonicalUrl}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="inline-flex items-center gap-1.5 bg-red-600 hover:bg-red-500 text-white text-xs font-headline font-black px-3.5 py-1.5 rounded border-2 border-black comic-shadow-sm transition-all"
                  >
                    <span>{content.youtubeButtonText}</span>
                    <span className="text-[10px]">↗</span>
                  </a>
                  <Link
                    href="/gallery"
                    className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black text-xs font-headline font-black px-4 py-1.5 rounded border-2 border-black comic-shadow-sm transition-all"
                  >
                    <span>{content.exploreGalleryCtaText}</span>
                    <ArrowRight className="w-4 h-4 stroke-[2.5]" />
                  </Link>
                </div>
              </div>
            </div>
          </div>
        </div>
      )}

      {/* Additional ★ Starred Videos & Projects Grid */}
      {gridItems.length > 0 && (
        <div className="grid grid-cols-1 md:grid-cols-3 gap-3 sm:gap-4 mb-3">
          {gridItems.map((p) => {
            const ytEmbed = resolveSafeYouTubeEmbed(p);
            const cardThumb = getProjectThumbnailUrl(p);

            // If this additional ★ Starred item is a YouTube Video, render an inline playable video card!
            if (ytEmbed) {
              return (
                <div
                  key={p.id}
                  className="group border border-black/[0.06] dark:border-white/[0.08] hover:border-black/15 dark:hover:border-yellow-400/30 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#151520] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.03)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7)] transition-all duration-300 ease-out flex flex-col justify-between"
                >
                  <div>
                    <div className="mb-2.5">
                      <YouTubeVideoFacade
                        embedUrl={ytEmbed.embedUrl}
                        title={p.youtubeTitle || p.title}
                        thumbnailUrl={cardThumb}
                        videoId={ytEmbed.videoId}
                        isShort={ytEmbed.isShort}
                        sizes="(max-width: 768px) 100vw, 33vw"
                      />
                    </div>
                    <div className="flex items-center justify-between gap-2 mb-1">
                      <span className="text-[10px] sm:text-xs font-mono text-black/60 dark:text-zinc-400 uppercase truncate">
                        {p.client}
                      </span>
                      <span className="bg-yellow-400 text-black text-[9px] font-headline font-black px-2 py-0.5 rounded border border-black shrink-0">
                        ★ VIDEO
                      </span>
                    </div>
                    <h3 className="font-headline font-black text-sm sm:text-base text-black dark:text-white mb-1 line-clamp-1">
                      {p.title}
                    </h3>
                    <p className="font-body text-xs text-black/70 dark:text-zinc-300 line-clamp-2 leading-relaxed mb-2.5">
                      {p.youtubeDescription || p.description}
                    </p>
                  </div>
                  <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-between gap-2 text-xs font-headline font-bold">
                    <button
                      type="button"
                      onClick={() => setSelectedVideoId(p.id)}
                      className="inline-flex items-center gap-1 text-[11px] bg-yellow-400 hover:bg-yellow-300 text-black font-black px-2.5 py-1 rounded border border-black cursor-pointer transition-colors"
                    >
                      <Play className="w-3 h-3 fill-current" />
                      <span>MAIN STAGE</span>
                    </button>
                    <Link
                      href="/gallery"
                      className="text-black dark:text-yellow-400 hover:underline inline-flex items-center gap-1"
                    >
                      {content.cardExploreText}
                    </Link>
                  </div>
                </div>
              );
            }

            return (
              <Link
                key={p.id}
                href="/gallery"
                className="group border border-black/[0.06] dark:border-white/[0.08] hover:border-black/15 dark:hover:border-yellow-400/30 p-3.5 sm:p-4 rounded-2xl bg-white dark:bg-[#151520] shadow-[0_10px_30px_-5px_rgba(0,0,0,0.08),0_4px_12px_-2px_rgba(0,0,0,0.03)] hover:shadow-[0_24px_48px_-12px_rgba(0,0,0,0.16),0_8px_16px_-4px_rgba(0,0,0,0.06)] dark:shadow-[0_12px_36px_-6px_rgba(0,0,0,0.7),0_2px_8px_-1px_rgba(0,0,0,0.4)] dark:hover:shadow-[0_24px_54px_-8px_rgba(0,0,0,0.9),0_0_28px_-4px_rgba(234,179,8,0.14)] hover:-translate-y-1.5 transition-all duration-300 ease-out flex flex-col justify-between"
              >
                <div>
                  <div className="relative aspect-video rounded-lg overflow-hidden mb-2.5 bg-black shadow-[0_2px_8px_rgba(0,0,0,0.08)]">
                    <Image
                      src={cardThumb}
                      alt={p.title}
                      fill
                      sizes="(max-width: 768px) 100vw, 33vw"
                      className="object-cover group-hover:scale-105 transition-transform duration-300"
                      unoptimized={
                        cardThumb.startsWith("http") || cardThumb.startsWith("data:")
                      }
                    />
                    <span className="absolute top-2 left-2 bg-yellow-400 text-black text-[9px] sm:text-[10px] font-headline font-black px-2 py-0.5 rounded border border-black comic-shadow-sm font-mono">
                      {p.year || 2026}
                    </span>
                    {p.metaBadge && (
                      <span className="absolute top-2 right-2 bg-black/80 backdrop-blur-sm text-white text-[9px] sm:text-[10px] font-mono font-bold px-2 py-0.5 rounded">
                        {p.metaBadge}
                      </span>
                    )}
                  </div>
                  <div className="text-[10px] sm:text-xs font-mono text-black/60 dark:text-zinc-400 mb-1 uppercase">
                    {p.client}
                  </div>
                  <h3 className="font-headline font-black text-sm sm:text-base text-black dark:text-white group-hover:text-yellow-500 transition-colors mb-1 line-clamp-1">
                    {p.title}
                  </h3>
                  <p className="font-body text-xs text-black/70 dark:text-zinc-300 line-clamp-2 leading-relaxed mb-2.5">
                    {p.description}
                  </p>
                </div>
                <div className="pt-2.5 border-t border-black/10 dark:border-white/10 flex items-center justify-end text-xs font-headline font-bold text-black dark:text-yellow-400">
                  <span className="group-hover:translate-x-1 transition-transform inline-flex items-center gap-1">
                    {content.cardExploreText}
                  </span>
                </div>
              </Link>
            );
          })}
        </div>
      )}

      {/* Full Vault CTA Button on Mobile */}
      <div className="text-center pt-1 block md:hidden">
        <Link
          href="/gallery"
          className="w-full inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-black text-xs py-2.5 px-4 rounded-lg border-2 border-black comic-shadow active:scale-95 transition-all"
        >
          <span>
            {content.mobileArchiveCtaText} ({projectsList.length} SHOWCASE
            {projectsList.length === 1 ? "" : "S"})
          </span>
          <ArrowRight className="w-4 h-4 stroke-[2.5]" />
        </Link>
      </div>
    </div>
  );
});
