"use client";

import React, { useRef, useEffect } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { useIntroStore } from "@/hooks/useIntroStore";

export const IntroLoader: React.FC = () => {
  const { isIntroActive, completeIntro } = useIntroStore();
  const videoRef = useRef<HTMLVideoElement>(null);

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

  // High performance LCP safety timer: guarantee intro transitions within 2.2s max
  useEffect(() => {
    if (!isIntroActive) return;
    const safetyTimer = setTimeout(() => {
      handleFinish();
    }, 2200);
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
            scale: 1.08,
            transition: { duration: 0.7, ease: [0.76, 0, 0.24, 1] },
          }}
          className="fixed inset-0 z-50 flex items-center justify-center bg-white overflow-hidden select-none"
          role="dialog"
          aria-modal="true"
          aria-label="Welcome cinematic presentation"
        >
          {/* 1080p Intro Video: w-40 compact logo scale, perfectly centered */}
          <div className="flex items-center justify-center -translate-y-4 w">
            <video
              ref={videoRef}
              autoPlay
              muted
              playsInline
              preload="auto"
              onEnded={handleFinish}
              className="w-full object-contain"
            >
              <source src="/assets/video/intro_loader.mp4" type="video/mp4" />
            </video>
          </div>

          {/* Accessible Skip Button (WCAG compliant) */}
          <div className="absolute bottom-8 right-8 z-20">
            <button
              onClick={handleFinish}
              className="px-5 py-2.5 rounded-full bg-white/90 hover:bg-yellow-400 text-black font-mono text-xs uppercase tracking-widest font-bold border-2 border-black/20 shadow-md backdrop-blur-md transition-all duration-200 focus-visible:ring-2 focus-visible:ring-yellow-400 focus-visible:outline-none"
              aria-label="Skip introductory presentation"
            >
              SKIP INTRO ➔
            </button>
          </div>

          {/* Visual Progress Bar Accent */}
          <div className="absolute top-0 left-0 right-0 h-1.5 bg-black/5 z-20">
            <motion.div
              initial={{ scaleX: 0 }}
              animate={{ scaleX: 1 }}
              transition={{ duration: 4.5, ease: "linear" }}
              className="h-full bg-yellow-400 origin-left"
            />
          </div>
        </motion.div>
      )}
    </AnimatePresence>
  );
};
