"use client";

import { useEffect, useState, useRef, useCallback } from "react";
import { useSmoothScroll } from "@/hooks/useSmoothScroll";
import { soundFX } from "@/utils/soundFX";
import {
  type StageId,
  STAGE_ORDER,
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
 * Phase 5: High-Performance Scrollytelling Stage Progression & Wheel Engine Hook.
 * Encapsulates all scrollytelling state, wheel thresholds, RAF synchronizers,
 * global hash routing, and keyboard accessibility navigation.
 */
export function useTheaterStageController(): TheaterStageControllerResult {
  const [activeStage, setActiveStage] = useState<StageId>("stage-01");

  const trackRef = useRef<HTMLDivElement | null>(null);
  const theaterRef = useRef<HTMLDivElement | null>(null);
  const mainContainerRef = useRef<HTMLElement | null>(null);

  const isTransitioningRef = useRef(false);
  const accumulatedDeltaRef = useRef(0);
  const boundaryReachedTimeRef = useRef(0);
  const activeStageRef = useRef<StageId>(activeStage);

  useEffect(() => {
    activeStageRef.current = activeStage;
  }, [activeStage]);

  // Activate Lenis luxury virtual smooth scrolling
  useSmoothScroll();

  const scrollToStage = useCallback((stage: StageId) => {
    soundFX.playWhoosh();
    const isMobile = typeof window !== "undefined" && window.innerWidth < 768;

    if (isMobile) {
      const targetEl =
        document.getElementById(`${stage}-mobile`) ||
        document.getElementById(stage) ||
        (stage === "stage-04" ? document.getElementById("brief-inquiry") : null);
      if (targetEl) {
        const headerOffset = 104; // Height of fixed header + mobile pill bar
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
        setActiveStage(stage);
        return;
      }
    }

    // Desktop: Update active stage & reset internal component scroll
    setActiveStage(stage);
    if (mainContainerRef.current) {
      mainContainerRef.current.scrollTop = 0;
    }

    // Sync 3D background / parallax track position
    if (!trackRef.current) return;
    const maxScroll = trackRef.current.scrollHeight - window.innerHeight;
    let target = 0;
    if (stage === "stage-01") target = 0;
    if (stage === "stage-02") target = maxScroll * 0.25;
    if (stage === "stage-03") target = maxScroll * 0.5;
    if (stage === "stage-gallery") target = maxScroll * 0.75;
    if (stage === "stage-04") target = maxScroll * 1.0;

    if (window.__lenis) {
      window.__lenis.scrollTo(target);
    } else {
      window.scrollTo({ top: target, behavior: "smooth" });
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

  // HIGH-PERFORMANCE MOBILE SCROLL SYNCHRONIZER (RAF Throttled)
  useEffect(() => {
    let ticking = false;
    const handleScroll = () => {
      if (window.innerWidth >= 768) return;

      const s2 = document.getElementById("stage-02-mobile");
      const s3 = document.getElementById("stage-03-mobile");
      const sGallery = document.getElementById("stage-gallery-mobile");
      const s4 = document.getElementById("stage-04-mobile");
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

  // DESKTOP INTERNAL SCROLL-Y COMPLETION & PROGRESSION WHEEL ENGINE
  useEffect(() => {
    const theater = theaterRef.current;
    if (!theater) return;

    const handleWheel = (e: WheelEvent) => {
      if (window.innerWidth < 768) return;

      const main = mainContainerRef.current;
      if (!main) return;

      if (isTransitioningRef.current) {
        e.preventDefault();
        return;
      }

      const { scrollTop, scrollHeight, clientHeight } = main;
      const maxScroll = Math.max(0, scrollHeight - clientHeight);
      const isAtBottom = scrollTop >= maxScroll - 6;
      const isAtTop = scrollTop <= 6;
      const now = Date.now();

      // Scrolling downwards
      if (e.deltaY > 0) {
        if (!isAtBottom) {
          accumulatedDeltaRef.current = 0;
          boundaryReachedTimeRef.current = 0;
          return;
        }

        e.preventDefault();

        if (boundaryReachedTimeRef.current === 0) {
          boundaryReachedTimeRef.current = now;
          accumulatedDeltaRef.current = 0;
          return;
        }

        if (maxScroll > 15 && now - boundaryReachedTimeRef.current < 160) {
          return;
        }

        accumulatedDeltaRef.current += e.deltaY;
        if (accumulatedDeltaRef.current >= 45) {
          const currentIndex = STAGE_ORDER.indexOf(activeStageRef.current);
          if (currentIndex < STAGE_ORDER.length - 1) {
            isTransitioningRef.current = true;
            accumulatedDeltaRef.current = 0;
            boundaryReachedTimeRef.current = 0;
            const nextStage = STAGE_ORDER[currentIndex + 1];
            scrollToStage(nextStage);
            setTimeout(() => {
              isTransitioningRef.current = false;
            }, 600);
          }
        }
      }
      // Scrolling upwards
      else if (e.deltaY < 0) {
        if (!isAtTop) {
          accumulatedDeltaRef.current = 0;
          boundaryReachedTimeRef.current = 0;
          return;
        }

        e.preventDefault();

        if (boundaryReachedTimeRef.current === 0) {
          boundaryReachedTimeRef.current = now;
          accumulatedDeltaRef.current = 0;
          return;
        }

        if (maxScroll > 15 && now - boundaryReachedTimeRef.current < 160) {
          return;
        }

        accumulatedDeltaRef.current += e.deltaY;
        if (accumulatedDeltaRef.current <= -45) {
          const currentIndex = STAGE_ORDER.indexOf(activeStageRef.current);
          if (currentIndex > 0) {
            isTransitioningRef.current = true;
            accumulatedDeltaRef.current = 0;
            boundaryReachedTimeRef.current = 0;
            const prevStage = STAGE_ORDER[currentIndex - 1];
            scrollToStage(prevStage);
            setTimeout(() => {
              isTransitioningRef.current = false;
            }, 600);
          }
        }
      }
    };

    theater.addEventListener("wheel", handleWheel, { passive: false });
    return () => {
      theater.removeEventListener("wheel", handleWheel);
    };
  }, [scrollToStage]);

  // KEYBOARD ACCESSIBILITY STAGE NAVIGATION
  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      // Don't intercept when user is typing in form inputs or textareas
      const activeEl = document.activeElement;
      if (
        activeEl &&
        (activeEl.tagName === "INPUT" ||
          activeEl.tagName === "TEXTAREA" ||
          activeEl.tagName === "SELECT")
      ) {
        return;
      }

      if (window.innerWidth < 768) return;

      const currentIndex = STAGE_ORDER.indexOf(activeStageRef.current);

      if (e.key === "ArrowDown" || e.key === "PageDown") {
        const main = mainContainerRef.current;
        if (main) {
          const maxScroll = Math.max(0, main.scrollHeight - main.clientHeight);
          const isAtBottom = main.scrollTop >= maxScroll - 6;
          if (isAtBottom && currentIndex < STAGE_ORDER.length - 1) {
            e.preventDefault();
            scrollToStage(STAGE_ORDER[currentIndex + 1]);
          }
        }
      } else if (e.key === "ArrowUp" || e.key === "PageUp") {
        const main = mainContainerRef.current;
        if (main) {
          const isAtTop = main.scrollTop <= 6;
          if (isAtTop && currentIndex > 0) {
            e.preventDefault();
            scrollToStage(STAGE_ORDER[currentIndex - 1]);
          }
        }
      } else if (e.key === "Home") {
        e.preventDefault();
        scrollToStage("stage-01");
      } else if (e.key === "End") {
        e.preventDefault();
        scrollToStage("stage-04");
      }
    };

    window.addEventListener("keydown", handleKeyDown);
    return () => {
      window.removeEventListener("keydown", handleKeyDown);
    };
  }, [scrollToStage]);

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
