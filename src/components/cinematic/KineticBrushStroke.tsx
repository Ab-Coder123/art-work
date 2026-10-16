"use client";

import React from "react";
import { motion, type Transition } from "framer-motion";

export interface KineticBrushStrokeProps {
  /** Variant of the slender paintbrush stroke */
  variant?: "wave" | "arc" | "double" | "circle";
  /** Stroke color: defaults to Art Work Artisan Gold (#dcb858) */
  color?: string;
  /** Thickness of the slender brush line: defaults to 2.5px */
  strokeWidth?: number;
  /** Animation delay in seconds */
  delay?: number;
  /** Animation duration in seconds */
  duration?: number;
  /** Additional CSS classes */
  className?: string;
}

/**
 * Slender, hand-drawn animated paintbrush stroke for major headings.
 * Triggers an authentic fine-liner ink stroke when scrolled into view.
 */
export const KineticBrushStroke: React.FC<KineticBrushStrokeProps> = ({
  variant = "wave",
  color = "#dcb858",
  strokeWidth = 2.5,
  delay = 0.2,
  duration = 0.75,
  className = "",
}) => {
  const transition: Transition = {
    duration,
    delay,
    ease: [0.65, 0, 0.35, 1],
  };

  if (variant === "circle") {
    return (
      <svg
        className={`absolute -inset-x-2 -inset-y-1.5 w-[calc(100%+16px)] h-[calc(100%+12px)] pointer-events-none select-none overflow-visible ${className}`}
        viewBox="0 0 160 50"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 12 25 C 10 10, 45 4, 85 5 C 130 6, 154 14, 152 28 C 150 42, 115 47, 75 46 C 30 45, 8 36, 14 20"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          strokeLinejoin="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={transition}
        />
      </svg>
    );
  }

  if (variant === "double") {
    return (
      <svg
        className={`absolute -bottom-2.5 left-0 w-full h-3.5 pointer-events-none select-none overflow-visible ${className}`}
        viewBox="0 0 300 16"
        fill="none"
        preserveAspectRatio="none"
      >
        {/* Primary Slender Brush Pass */}
        <motion.path
          d="M 2 8 C 65 3, 145 13, 220 5 C 255 1, 280 8, 298 6"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={transition}
        />
        {/* Secondary Delicate Echo Line */}
        <motion.path
          d="M 15 12 C 80 8, 160 15, 235 9 C 265 6, 285 10, 295 10"
          stroke={color}
          strokeWidth={Math.max(1.2, strokeWidth * 0.6)}
          strokeLinecap="round"
          strokeOpacity={0.65}
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 0.65 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={{ ...transition, delay: delay + 0.12 }}
        />
      </svg>
    );
  }

  if (variant === "arc") {
    return (
      <svg
        className={`absolute -bottom-2.5 left-0 w-full h-3 pointer-events-none select-none overflow-visible ${className}`}
        viewBox="0 0 300 14"
        fill="none"
        preserveAspectRatio="none"
      >
        <motion.path
          d="M 3 6 C 75 14, 185 13, 297 4"
          stroke={color}
          strokeWidth={strokeWidth}
          strokeLinecap="round"
          initial={{ pathLength: 0, opacity: 0 }}
          whileInView={{ pathLength: 1, opacity: 1 }}
          viewport={{ once: true, margin: "-30px" }}
          transition={transition}
        />
      </svg>
    );
  }

  // Default: Organic Wavy Slender Underline
  return (
    <svg
      className={`absolute -bottom-2 left-0 w-full h-3 pointer-events-none select-none overflow-visible ${className}`}
      viewBox="0 0 300 14"
      fill="none"
      preserveAspectRatio="none"
    >
      <motion.path
        d="M 2 9 C 50 3, 110 13, 175 6 C 225 1, 260 10, 298 5"
        stroke={color}
        strokeWidth={strokeWidth}
        strokeLinecap="round"
        initial={{ pathLength: 0, opacity: 0 }}
        whileInView={{ pathLength: 1, opacity: 1 }}
        viewport={{ once: true, margin: "-30px" }}
        transition={transition}
      />
    </svg>
  );
};

export interface KineticBrushWordProps {
  children: React.ReactNode;
  variant?: "wave" | "arc" | "double" | "circle";
  color?: string;
  strokeWidth?: number;
  delay?: number;
  className?: string;
}

/**
 * Convenience wrapper to apply a slender brush stroke around or beneath any specific phrase.
 */
export const KineticBrushWord: React.FC<KineticBrushWordProps> = ({
  children,
  variant = "wave",
  color = "#dcb858",
  strokeWidth = 2.5,
  delay = 0.2,
  className = "",
}) => {
  return (
    <span className={`relative inline-block ${className}`}>
      {children}
      <KineticBrushStroke
        variant={variant}
        color={color}
        strokeWidth={strokeWidth}
        delay={delay}
      />
    </span>
  );
};
