"use client";

import React, { useState, useCallback } from "react";
import Image from "next/image";
import { Play } from "lucide-react";

export interface YouTubeVideoFacadeProps {
  embedUrl: string;
  title: string;
  thumbnailUrl?: string;
  videoId?: string;
  isShort?: boolean;
  className?: string;
  sizes?: string;
  priority?: boolean;
}

export const YouTubeVideoFacade = React.memo(function YouTubeVideoFacade({
  embedUrl,
  title,
  thumbnailUrl,
  videoId,
  isShort = false,
  className = "",
  sizes = "(max-width: 1024px) 100vw, 60vw",
  priority = false,
}: YouTubeVideoFacadeProps) {
  const [isPlaying, setIsPlaying] = useState(false);
  const [isWarmed, setIsWarmed] = useState(false);

  // Compute fallback poster image
  const resolvedPoster =
    thumbnailUrl ||
    (videoId
      ? `https://img.youtube.com/vi/${videoId}/hqdefault.jpg`
      : "/assets/images/hero_studio_collective.jpg");

  // Format autoplay URL on demand
  const activeAutoplayUrl = React.useMemo(() => {
    const separator = embedUrl.includes("?") ? "&" : "?";
    return `${embedUrl}${separator}autoplay=1&mute=0&rel=0`;
  }, [embedUrl]);

  // Warm up DNS/SSL handshakes to YouTube upon first hover or touch
  const handleWarmup = useCallback(() => {
    if (!isWarmed && !isPlaying) {
      setIsWarmed(true);
    }
  }, [isWarmed, isPlaying]);

  const handleStartPlayback = useCallback(() => {
    setIsPlaying(true);
  }, []);

  const handleKeyDown = useCallback(
    (e: React.KeyboardEvent<HTMLDivElement>) => {
      if (e.key === "Enter" || e.key === " ") {
        e.preventDefault();
        setIsPlaying(true);
      }
    },
    []
  );

  return (
    <div
      className={`relative w-full rounded-xl overflow-hidden bg-black shadow-[0_4px_20px_rgba(0,0,0,0.3)] group ${
        isShort ? "aspect-[9/16] max-w-[340px] mx-auto" : "aspect-video"
      } ${className}`}
      onMouseEnter={handleWarmup}
      onTouchStart={handleWarmup}
    >
      {/* DNS / Preconnect Hints on Pointer Hover */}
      {isWarmed && !isPlaying && (
        <>
          <link rel="preconnect" href="https://www.youtube-nocookie.com" />
          <link rel="preconnect" href="https://i.ytimg.com" />
          <link rel="preconnect" href="https://www.google.com" />
        </>
      )}

      {isPlaying ? (
        <iframe
          src={activeAutoplayUrl}
          title={title}
          className="w-full h-full border-0 pointer-events-auto cursor-pointer relative z-10"
          allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; web-share"
          referrerPolicy="strict-origin-when-cross-origin"
          allowFullScreen
        />
      ) : (
        <div
          role="button"
          tabIndex={0}
          aria-label={`Play video: ${title}`}
          onClick={handleStartPlayback}
          onKeyDown={handleKeyDown}
          className="relative w-full h-full cursor-pointer focus:outline-none focus-visible:ring-4 focus-visible:ring-yellow-400 select-none overflow-hidden"
        >
          {/* High-Resolution Poster Image */}
          <Image
            src={resolvedPoster}
            alt={title}
            fill
            sizes={sizes}
            priority={priority}
            className="object-cover object-center group-hover:scale-105 transition-transform duration-700 ease-out"
          />

          {/* Cinematic Vignette Overlay */}
          <div className="absolute inset-0 bg-gradient-to-t from-black/85 via-black/35 to-black/30 group-hover:from-black/75 group-hover:via-black/25 transition-colors duration-300 pointer-events-none" />

          {/* Interactive Comic Play Badge */}
          <div className="absolute inset-0 flex flex-col items-center justify-center p-4">
            <div className="relative flex items-center justify-center">
              {/* Pulsing ring on hover */}
              <div className="absolute w-20 h-20 sm:w-24 sm:h-24 rounded-full bg-red-600/30 group-hover:scale-125 group-hover:opacity-100 opacity-0 transition-all duration-500 blur-md pointer-events-none" />

              {/* Central Play Trigger Button */}
              <div className="relative w-14 h-14 sm:w-18 sm:h-18 rounded-full bg-red-600 group-hover:bg-red-500 border-2 sm:border-3 border-black text-white flex items-center justify-center comic-shadow group-hover:scale-110 active:scale-95 transition-all duration-300">
                <Play className="w-6 h-6 sm:w-8 sm:h-8 fill-white translate-x-0.5" />
              </div>
            </div>

            {/* Micro Badge */}
            <div className="mt-3.5 inline-flex items-center gap-1.5 bg-yellow-400 text-black text-[10px] sm:text-xs font-headline font-black uppercase px-3 py-1 rounded border border-black comic-shadow-sm tracking-wider group-hover:bg-yellow-300 transition-colors">
              <span>★ CLICK TO PLAY REEL</span>
            </div>
          </div>
        </div>
      )}
    </div>
  );
});
