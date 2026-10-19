"use client";

import React, { useState, useEffect, useRef } from "react";
import { motion, useInView } from "framer-motion";

export interface KineticBrushStrokeProps {
  /** Variant of the slender paintbrush stroke */
  variant?: "wave" | "arc" | "double" | "circle";
  /** Stroke color: defaults to Art Work Artisan Gold (#eab308) */
  color?: string;
  /** Thickness of the slender brush line: defaults to 3px */
  strokeWidth?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Whether to show the miniature animated artist paintbrush tip gliding across */
  showBrushTip?: boolean;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Animated Paintbrush Stroke Component.
 * Features an authentic slender fine-liner brush stroke with a sweeping artist paintbrush tip.
 * Automatically animates when mounted / in-view, and replays on hover.
 */
export const KineticBrushStroke: React.FC<KineticBrushStrokeProps> = ({
  variant = "wave",
  color = "#dcb858",
  strokeWidth = 3,
  delay = 0.15,
  duration = 0.85,
  showBrushTip = true,
  className = "",
}) => {
  const containerRef = useRef<HTMLDivElement>(null);
  const isInView = useInView(containerRef, { once: true, amount: 0.1 });
  const [fallbackTriggered, setFallbackTriggered] = useState(false);
  const [replayKey, setReplayKey] = useState(0);

  // Fallback timer so the stroke is guaranteed to animate even in sticky scrollytelling tracks
  useEffect(() => {
    const timer = setTimeout(() => {
      setFallbackTriggered(true);
    }, 250);
    return () => clearTimeout(timer);
  }, []);

  const isAnimated = isInView || fallbackTriggered;

  const handleMouseEnter = () => {
    setReplayKey((k) => k + 1);
  };

  const isDouble = variant === "double";
  const isArc = variant === "arc";
  const isCircle = variant === "circle";

  return (
    <div
      ref={containerRef}
      onMouseEnter={handleMouseEnter}
      className={`absolute left-0 w-full pointer-events-none select-none z-10 ${
        isCircle ? "-inset-2 h-[calc(100%+16px)]" : "-bottom-3 h-5"
      } ${className}`}
      aria-hidden="true"
    >
      {/* 1. Miniature Artist Paintbrush Tip Sweeping Across */}
      {showBrushTip && isAnimated && !isCircle && (
        <motion.div
          key={`brush-${replayKey}`}
          initial={{ left: "0%", opacity: 0, scale: 0.7 }}
          animate={{
            left: ["0%", "10%", "92%", "100%"],
            opacity: [0, 1, 1, 0],
            scale: [0.7, 1, 1, 0.7],
            rotate: [-18, -12, -22, -10],
          }}
          transition={{
            duration,
            delay,
            times: [0, 0.15, 0.85, 1],
            ease: [0.25, 1, 0.5, 1],
          }}
          className="absolute -top-4 pointer-events-none z-20"
        >
          {/* Miniature Hand-Crafted Studio Paintbrush Graphic */}
          <div className="relative w-7 h-7 -translate-x-3 -translate-y-2 filter drop-shadow-[1px_2px_1px_rgba(0,0,0,0.3)]">
            <svg viewBox="0 0 36 36" className="w-full h-full" fill="none">
              {/* Wooden Pen/Brush Handle */}
              <path
                d="M 28 4 L 32 8 L 18 22 L 14 18 Z"
                fill="#facc15"
                stroke="#111111"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Silver Ferrule Band */}
              <path
                d="M 18 22 L 14 18 L 11 21 L 15 25 Z"
                fill="#ffffff"
                stroke="#111111"
                strokeWidth="1.2"
                strokeLinejoin="round"
              />
              {/* Fine Sable Bristles */}
              <path
                d="M 11 21 L 15 25 L 4 32 Z"
                fill="#111111"
                stroke="#111111"
                strokeWidth="0.8"
                strokeLinejoin="round"
              />
              {/* Wet Gold Paint on Bristle Nib */}
              <circle cx="5" cy="31" r="2.2" fill={color} />
              <circle cx="5" cy="31" r="1.2" fill="#ffffff" />
            </svg>
          </div>
        </motion.div>
      )}

      {/* 2. SVG Hand-Drawn Brush Strokes with Non-Scaling Stroke */}
      <svg
        className="w-full h-full overflow-visible"
        viewBox={isCircle ? "0 0 160 50" : "0 0 300 16"}
        fill="none"
        preserveAspectRatio="none"
      >
        {isCircle ? (
          <motion.path
            key={`circle-${replayKey}`}
            d="M 12 25 C 10 10, 45 4, 85 5 C 130 6, 154 14, 152 28 C 150 42, 115 47, 75 46 C 30 45, 8 36, 14 20"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            strokeLinejoin="round"
            style={{ vectorEffect: "non-scaling-stroke" }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isAnimated ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              duration,
              delay,
              ease: [0.25, 1, 0.5, 1],
            }}
          />
        ) : isDouble ? (
          <>
            {/* Primary Slender Brush Pass */}
            <motion.path
              key={`double-1-${replayKey}`}
              d="M 2 8 C 65 3, 145 13, 220 5 C 255 1, 280 8, 298 6"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ vectorEffect: "non-scaling-stroke" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isAnimated ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                duration,
                delay,
                ease: [0.25, 1, 0.5, 1],
              }}
            />
            {/* Secondary Slender Echo Bristle Line */}
            <motion.path
              key={`double-2-${replayKey}`}
              d="M 12 12 C 75 8, 155 15, 230 9 C 265 6, 285 11, 296 10"
              stroke={color}
              strokeWidth={Math.max(1.5, strokeWidth * 0.65)}
              strokeLinecap="round"
              strokeOpacity={0.8}
              style={{ vectorEffect: "non-scaling-stroke" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isAnimated ? { pathLength: 1, opacity: 0.8 } : {}}
              transition={{
                duration,
                delay: delay + 0.1,
                ease: [0.25, 1, 0.5, 1],
              }}
            />
          </>
        ) : isArc ? (
          <motion.path
            key={`arc-${replayKey}`}
            d="M 3 6 C 75 14, 185 13, 297 4"
            stroke={color}
            strokeWidth={strokeWidth}
            strokeLinecap="round"
            style={{ vectorEffect: "non-scaling-stroke" }}
            initial={{ pathLength: 0, opacity: 0 }}
            animate={isAnimated ? { pathLength: 1, opacity: 1 } : {}}
            transition={{
              duration,
              delay,
              ease: [0.25, 1, 0.5, 1],
            }}
          />
        ) : (
          /* Organic Slender Wave Brush Stroke */
          <>
            <motion.path
              key={`wave-main-${replayKey}`}
              d="M 2 9 C 50 2, 110 13, 175 6 C 225 1, 260 11, 298 5"
              stroke={color}
              strokeWidth={strokeWidth}
              strokeLinecap="round"
              style={{ vectorEffect: "non-scaling-stroke" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isAnimated ? { pathLength: 1, opacity: 1 } : {}}
              transition={{
                duration,
                delay,
                ease: [0.25, 1, 0.5, 1],
              }}
            />
            {/* Delicate entry bristle flick */}
            <motion.path
              key={`wave-bristle-${replayKey}`}
              d="M 6 12 C 40 8, 90 14, 130 9"
              stroke={color}
              strokeWidth={Math.max(1.2, strokeWidth * 0.5)}
              strokeLinecap="round"
              strokeOpacity={0.65}
              style={{ vectorEffect: "non-scaling-stroke" }}
              initial={{ pathLength: 0, opacity: 0 }}
              animate={isAnimated ? { pathLength: 1, opacity: 0.65 } : {}}
              transition={{
                duration: duration * 0.7,
                delay: delay + 0.1,
                ease: [0.25, 1, 0.5, 1],
              }}
            />
          </>
        )}
      </svg>
    </div>
  );
};

export interface KineticBrushWordProps {
  children: React.ReactNode;
  variant?: "wave" | "arc" | "double" | "circle";
  color?: string;
  strokeWidth?: number;
  delay?: number;
  duration?: number;
  showBrushTip?: boolean;
  className?: string;
}

/**
 * Inline wrapper that wraps any word or title with the animated paintbrush stroke & brush tip.
 */
export const KineticBrushWord: React.FC<KineticBrushWordProps> = ({
  children,
  variant = "wave",
  color = "#dcb858",
  strokeWidth = 3,
  delay = 0.15,
  duration = 0.85,
  showBrushTip = true,
  className = "",
}) => {
  return (
    <span className={`relative inline-block cursor-default group ${className}`}>
      {children}
      <KineticBrushStroke
        variant={variant}
        color={color}
        strokeWidth={strokeWidth}
        delay={delay}
        duration={duration}
        showBrushTip={showBrushTip}
      />
    </span>
  );
};
