"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { soundFX } from "@/utils/soundFX";
import {
  type StageId,
  resolveHashToStage,
} from "@/components/home/types";

export interface TheaterStageControllerResult {
  activeStage: StageId;
  scrollToStage: (stage: StageId) => void;
  trackRef: React.RefObject<HTMLDivElement | null>;
  theaterRef: React.RefObject<HTMLDivElement | null>;
  mainContainerRef: React.RefObject<HTMLElement | null>;
  triggerInkBurst: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * High-Performance EKO-Style Continuous Scroll Controller.
 * Provides smooth virtual scrolling, natural section tracking,
 * hash routing, and header stage synchronization across all devices.
 */
export function useTheaterStageController(): TheaterStageControllerResult {
  const [activeStage, setActiveStage] = useState<StageId>("stage-01");

  const trackRef = useRef<HTMLDivElement | null>(null);
  const theaterRef = useRef<HTMLDivElement | null>(null);
  const mainContainerRef = useRef<HTMLElement | null>(null);

  // Activate Lenis luxury virtual smooth scrolling
  useSmoothScroll();

  const scrollToStage = useCallback((stage: StageId) => {
    soundFX.playWhoosh();
    setActiveStage(stage);

    if (typeof window === "undefined") return;

    const targetEl =
      document.getElementById(stage) ||
      document.getElementById(`${stage}-mobile`) ||
      (stage === "stage-04" ? document.getElementById("brief-inquiry") : null);

    if (targetEl) {
      const headerOffset = 76;
      const elementPosition = targetEl.getBoundingClientRect().top;
      const offsetPosition = elementPosition + window.pageYOffset - headerOffset;
      const targetTop = Math.max(0, offsetPosition);

      if (window.__lenis) {
        window.__lenis.scrollTo(targetTop);
      } else {
        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      }
    }
  }, []);

  // GLOBAL HASH ROUTER & INTERNAL ANCHOR NAVIGATION SYNCHRONIZER
  useEffect(() => {
    const handleHash = () => {
      if (typeof window === "undefined") return;
      const stage = resolveHashToStage(window.location.hash);
      if (stage) {
        scrollToStage(stage);
      }
    };

    handleHash();
    const timer = setTimeout(handleHash, 180);
    window.addEventListener("hashchange", handleHash);

    const handleCustomNav = (e: Event) => {
      const customEvent = e as CustomEvent<{ stage: StageId }>;
      if (customEvent.detail?.stage) {
        scrollToStage(customEvent.detail.stage);
      }
    };
    window.addEventListener("artwork:navigate-stage", handleCustomNav);

    const handleAnchorClick = (e: MouseEvent) => {
      const target = (e.target as HTMLElement).closest("a");
      if (!target) return;
      const href = target.getAttribute("href");
      if (!href) return;

      if (href.startsWith("#") || href.startsWith("/#")) {
        const hash = href.startsWith("/#") ? href.slice(2) : href.slice(1);
        const stage = resolveHashToStage(hash);
        if (stage) {
          e.preventDefault();
          if (window.location.hash !== `#${hash}`) {
            window.history.pushState(null, "", `#${hash}`);
          }
          scrollToStage(stage);
        }
      }
    };

    document.addEventListener("click", handleAnchorClick);

    return () => {
      clearTimeout(timer);
      window.removeEventListener("hashchange", handleHash);
      window.removeEventListener("artwork:navigate-stage", handleCustomNav);
      document.removeEventListener("click", handleAnchorClick);
    };
  }, [scrollToStage]);

  // UNIFIED NATURAL SCROLL SYNCHRONIZER (RAF Throttled for Desktop & Mobile)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const s2 = document.getElementById("stage-02") || document.getElementById("stage-02-mobile");
      const s3 = document.getElementById("stage-03") || document.getElementById("stage-03-mobile");
      const sGallery = document.getElementById("stage-gallery") || document.getElementById("stage-gallery-mobile");
      const s4 = document.getElementById("stage-04") || document.getElementById("stage-04-mobile");
      const threshold = window.innerHeight * 0.38;

      let nextStage: StageId = "stage-01";
      if (s4 && s4.getBoundingClientRect().top <= threshold) {
        nextStage = "stage-04";
      } else if (sGallery && sGallery.getBoundingClientRect().top <= threshold) {
        nextStage = "stage-gallery";
      } else if (s3 && s3.getBoundingClientRect().top <= threshold) {
        nextStage = "stage-03";
      } else if (s2 && s2.getBoundingClientRect().top <= threshold) {
        nextStage = "stage-02";
      }

      setActiveStage((prev) => (prev === nextStage ? prev : nextStage));
    };

    const onScroll = () => {
      if (!ticking) {
        requestAnimationFrame(() => {
          handleScroll();
          ticking = false;
        });
        ticking = true;
      }
    };

    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll, { passive: true });
    handleScroll();

    return () => {
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
    };
  }, []);

  const triggerInkBurst = useCallback((e: React.MouseEvent<HTMLButtonElement>) => {
    soundFX.playPop();
    const rect = e.currentTarget.getBoundingClientRect();
    const originX = rect.left + rect.width / 2;
    const originY = rect.top + rect.height / 2;

    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("artwork:particle-burst", {
          detail: { x: originX, y: originY, count: 20 },
        })
      );
    }
  }, []);

  return {
    activeStage,
    scrollToStage,
    trackRef,
    theaterRef,
    mainContainerRef,
    triggerInkBurst,
  };
}
