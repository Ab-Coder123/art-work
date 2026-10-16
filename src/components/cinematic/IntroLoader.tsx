"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntroStore } from "@/hooks/useIntroStore";

export const IntroLoader: React.FC = () => {
  const { isIntroActive, completeIntro } = useIntroStore();
  const videoRef = useRef<HTMLVideoElement>(null);
  const [videoProgress, setVideoProgress] = React.useState(0);

  // Check if user has already seen intro in this browser session
  useEffect(() => {
    if (typeof window !== "undefined") {
      const alreadySeen = sessionStorage.getItem("artwork_intro_seen");
      if (alreadySeen === "true") {
        completeIntro();
      }
    }
  }, [completeIntro]);

  // Lock scroll completely on body while IntroLoader is active
  useEffect(() => {
    if (isIntroActive) {
      document.body.style.overflow = "hidden";
      document.documentElement.style.overflow = "hidden";
    } else {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    }
    return () => {
      document.body.style.overflow = "";
      document.documentElement.style.overflow = "";
    };
  }, [isIntroActive]);

  // Handle completion and store session flag
  const handleFinish = React.useCallback(() => {
    if (typeof window !== "undefined") {
      sessionStorage.setItem("artwork_intro_seen", "true");
    }
    completeIntro();
  }, [completeIntro]);

  // Real-time video progress tracker
  const handleTimeUpdate = () => {
    if (videoRef.current && videoRef.current.duration) {
      const pct = (videoRef.current.currentTime / videoRef.current.duration) * 100;
      setVideoProgress(Math.min(100, Math.max(0, pct)));
    }
  };

  // Autoplay handler with graceful fallback if browser policy blocks autoplay
  useEffect(() => {
    if (!isIntroActive) return;
    if (videoRef.current) {
      videoRef.current.play().catch(() => {
        // If browser blocks unmuted/video playback, gracefully exit
        handleFinish();
      });
    }
  }, [isIntroActive, handleFinish]);

  // Keyboard accessibility: Escape to skip
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isIntroActive) {
        handleFinish();
      }
    };
    window.addEventListener("keydown", handleKeyDown);
    return () => window.removeEventListener("keydown", handleKeyDown);
  }, [isIntroActive, handleFinish]);

  // Fail-safe safety timer (12s maximum) so the user is never stuck if video fails or buffers
  useEffect(() => {
    if (!isIntroActive) return;
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 12000);
    return () => clearTimeout(safetyTimer);
  }, [isIntroActive, handleFinish]);

  return (
    <AnimatePresence>
      {isIntroActive && (
        <motion.div
          key="intro-splash-screen"
          initial={{ opacity: 1 }}
          exit={{
            opacity: 0,
            scale: 1.04,
            transition: { duration: 0.6, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white dark:bg-[#0C0C10] overflow-hidden select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome cinematic presentation"
        >
          {/* Video Player: enlarged for cinematic immersion, plays until last frame */}
          <div className="flex items-center justify-center -translate-y-2 max-w-2xl sm:max-w-3xl lg:max-w-4xl w-full px-4 sm:px-8">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              onTimeUpdate={handleTimeUpdate}
              onEnded={handleFinish}
              onError={handleFinish}
              className="w-full object-contain filter drop-shadow-2xl"
            >
              <source src="/assets/video/intro_loader.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Accessible Skip Button */}
          <div className="absolute bottom-8 right-8 z-20">
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-full bg-white/90 dark:bg-[#151520]/90 hover:bg-yellow-400 dark:hover:bg-yellow-400 text-black dark:text-white dark:hover:text-black font-mono text-xs uppercase tracking-widest font-bold border-2 border-black/20 dark:border-zinc-700 shadow-md backdrop-blur-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none cursor-pointer"
              aria-label="Skip introductory presentation"
            >
              SKIP INTRO ➔
            </button>
          </div>

          {/* Dynamic Progress Bar: perfectly synced with actual video duration */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/10 dark:bg-white/10 z-20">
            <div
              className="h-full bg-yellow-400 origin-left transition-all duration-75 ease-linear"
              style={{ width: `${videoProgress}%` }}
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
