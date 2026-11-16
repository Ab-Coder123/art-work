"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { soundFX } from "@/utils/soundFX";
import {
  type StageId,
  resolveHashToStage,
  getNextStage,
  getPrevStage,
  calculateActiveStageFromTops,
} from "@/components/home/types";

export interface TheaterStageControllerResult {
  activeStage: StageId;
  scrollToStage: (stage: StageId) => void;
  nextStage: () => void;
  prevStage: () => void;
  trackRef: React.RefObject<HTMLDivElement | null>;
  theaterRef: React.RefObject<HTMLDivElement | null>;
  mainContainerRef: React.RefObject<HTMLElement | null>;
  triggerInkBurst: (e: React.MouseEvent<HTMLButtonElement>) => void;
}

/**
 * Continuous Smooth Scrollytelling Hook.
 * Pairs Lenis virtual smooth scroll with RAF scroll-spy stage tracking,
 * global hash routing, and Home/End accessibility navigation across all viewports.
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
    if (typeof window === "undefined") return;

    const targetEl =
      document.getElementById(stage) ||
      document.getElementById(`${stage}-mobile`) ||
      (stage === "stage-04" ? document.getElementById("brief-inquiry") : null);

    if (targetEl) {
      const elementPosition = targetEl.getBoundingClientRect().top;
      const targetTop = Math.max(0, elementPosition + window.scrollY - 96);

      if (window.__lenis) {
        window.__lenis.scrollTo(targetTop, { duration: 1.1 });
      } else {
        window.scrollTo({
          top: targetTop,
          behavior: "smooth",
        });
      }
    }

    setActiveStage(stage);
  }, []);

  const nextStage = useCallback(() => {
    setActiveStage((current) => {
      const next = getNextStage(current);
      scrollToStage(next);
      return next;
    });
  }, [scrollToStage]);

  const prevStage = useCallback(() => {
    setActiveStage((current) => {
      const prev = getPrevStage(current);
      scrollToStage(prev);
      return prev;
    });
  }, [scrollToStage]);

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

  // HIGH-PERFORMANCE UNIFIED SCROLL-SPY SYNCHRONIZER (RAF Throttled, All Viewports)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      const sectionTops: { id: StageId; top: number }[] = [];
      const s1 =
        document.getElementById("stage-01") ||
        document.getElementById("stage-01-mobile");
      if (s1) sectionTops.push({ id: "stage-01", top: s1.getBoundingClientRect().top });

      const s2 =
        document.getElementById("stage-02") ||
        document.getElementById("stage-02-mobile");
      if (s2) sectionTops.push({ id: "stage-02", top: s2.getBoundingClientRect().top });

      const s3 =
        document.getElementById("stage-03") ||
        document.getElementById("stage-03-mobile");
      if (s3) sectionTops.push({ id: "stage-03", top: s3.getBoundingClientRect().top });

      const sGallery =
        document.getElementById("stage-gallery") ||
        document.getElementById("stage-gallery-mobile");
      if (sGallery) sectionTops.push({ id: "stage-gallery", top: sGallery.getBoundingClientRect().top });

      const s4 =
        document.getElementById("stage-04") ||
        document.getElementById("stage-04-mobile");
      if (s4) sectionTops.push({ id: "stage-04", top: s4.getBoundingClientRect().top });

      const threshold = window.innerHeight * 0.4;
      const nextStage = calculateActiveStageFromTops(sectionTops, threshold);

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

  // KEYBOARD ACCESSIBILITY HOME/END & PAGING JUMP NAVIGATION
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT")
      ) {
        return;
      }

      if (e.key === "Home") {
        e.preventDefault();
        scrollToStage("stage-01");
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToStage("stage-04");
      } else if (e.key === "PageDown" || (e.altKey && e.key === "ArrowDown")) {
        e.preventDefault();
        nextStage();
      } else if (e.key === "PageUp" || (e.altKey && e.key === "ArrowUp")) {
        e.preventDefault();
        prevStage();
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scrollToStage, nextStage, prevStage]);

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
    nextStage,
    prevStage,
    trackRef,
    theaterRef,
    mainContainerRef,
    triggerInkBurst,
  };
}
