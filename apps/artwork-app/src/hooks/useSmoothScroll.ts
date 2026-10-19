"use client";

import { useEffect } from "react";
import Lenis from "@studio-freight/lenis";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";

declare global {
  interface Window {
    __lenis?: Lenis;
  }
}

// Register ScrollTrigger plugin safely on client-side
if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

/**
 * Custom hook to initialize Lenis smooth virtual scroll with zero sluggishness.
 * Uses lerp: 0.12 for instantaneous wheel response and silky deceleration.
 */
export function useSmoothScroll() {
  useEffect(() => {
    // Respect user's motion preferences
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
      return;
    }

    const lenis = new Lenis({
      lerp: 0.12, // Responsive & agile: no sluggish 1s drag
      wheelMultiplier: 1.15, // Natural travel distance per wheel notch
      touchMultiplier: 1.4,
      smoothWheel: true,
      infinite: false,
    });

    window.__lenis = lenis;

    // Update GSAP ScrollTrigger ONLY when Lenis actually scrolls
    lenis.on("scroll", ScrollTrigger.update);

    // Sync Lenis with GSAP's high-precision ticker
    const tickerHandler = (time: number) => {
      lenis.raf(time * 1000);
    };

    gsap.ticker.add(tickerHandler);
    gsap.ticker.lagSmoothing(0);

    return () => {
      gsap.ticker.remove(tickerHandler);
      lenis.destroy();
      window.__lenis = undefined;
    };
  }, []);
}
