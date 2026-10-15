"use client";

import React, { useEffect, useRef } from "react";
import gsap from "gsap";
import { ScrollTrigger } from "gsap/ScrollTrigger";
import { useScrollytellingStore } from "@/hooks/useScrollytellingStore";
import { StageIndicator } from "./StageIndicator";

if (typeof window !== "undefined") {
  gsap.registerPlugin(ScrollTrigger);
}

interface CinematicStageProps {
  children: React.ReactNode;
}

export const CinematicStage: React.FC<CinematicStageProps> = ({ children }) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const viewportRef = useRef<HTMLDivElement>(null);
  const { setCurrentScene, setScrollProgress } = useScrollytellingStore();

  useEffect(() => {
    const container = containerRef.current;
    const viewport = viewportRef.current;
    if (!container || !viewport) return;

    const handleScroll = () => {
      const scrollY = window.scrollY;
      const maxScroll = 3000;
      const progress = Math.min(1, Math.max(0, scrollY / maxScroll));
      setScrollProgress(progress);

      if (progress < 0.25) {
        setCurrentScene("hero");
      } else if (progress >= 0.25 && progress < 0.6) {
        setCurrentScene("why-us");
      } else if (progress >= 0.6 && progress < 0.85) {
        setCurrentScene("capabilities");
      } else {
        setCurrentScene("contact");
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });

    // Also link with GSAP ScrollTrigger for hardware accelerated scrub
    const trigger = ScrollTrigger.create({
      trigger: container,
      start: "top top",
      end: "+=3000",
      pin: viewport,
      pinSpacing: true,
      scrub: 0.5,
      onUpdate: () => {
        handleScroll();
      },
    });

    ScrollTrigger.refresh();

    return () => {
      window.removeEventListener("scroll", handleScroll);
      trigger.kill();
    };
  }, [setCurrentScene, setScrollProgress]);

  return (
    <div ref={containerRef} className="relative w-full h-[400vh]">
      {/* Locked Fixed Viewport Theater */}
      <div
        ref={viewportRef}
        className="w-screen h-screen overflow-hidden flex flex-col justify-between bg-white bg-sketchpad-grid"
      >
        <StageIndicator />
        {children}
      </div>
    </div>
  );
};
