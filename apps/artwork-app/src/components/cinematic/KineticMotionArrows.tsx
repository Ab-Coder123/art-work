"use client";

import React from "react";
import { motion, useScroll, useTransform } from "framer-motion";

export const KineticMotionArrows: React.FC = () => {
  const { scrollYProgress } = useScroll();

  // Subtle parallax shifts
  const yArrowLeft = useTransform(scrollYProgress, [0, 1], [0, -100]);
  const yArrowRight = useTransform(scrollYProgress, [0, 1], [0, -140]);
  const rotateSwoop = useTransform(scrollYProgress, [0, 1], [-3, 5]);
  const yArrowBottom = useTransform(scrollYProgress, [0, 1], [0, -80]);
  const rotateArrowBottom = useTransform(scrollYProgress, [0, 1], [0, -10]);

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. TOP-LEFT BACKGROUND SWOOP ARROW (Outer gutter, very low opacity, no overlapping badge) */}
      <motion.div
        style={{ y: yArrowLeft, rotate: rotateSwoop }}
        className="absolute top-[8%] left-2 2xl:left-8 hidden 2xl:block opacity-20"
      >
        <svg
          className="w-32 h-32"
          viewBox="0 0 160 160"
          fill="none"
        >
          {/* Subtle Canary Glow Underlay */}
          <path
            d="M 20 25 C 70 15, 125 45, 130 115"
            stroke="var(--color-primary-yellow, #facc15)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          {/* Animated Black Ink Dashed Line */}
          <path
            d="M 20 25 C 70 15, 125 45, 130 115"
            stroke="#111111"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="6 4"
            className="animate-flow-dash"
          />
          {/* Arrowhead */}
          <path
            d="M 115 102 L 132 118 L 138 96"
            stroke="#111111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="var(--color-primary-yellow, #facc15)"
          />
        </svg>
      </motion.div>

      {/* 2. RIGHT-SIDE BACKGROUND S-CURVE ARROW (Far outer gutter, low opacity) */}
      <motion.div
        style={{ y: yArrowRight }}
        className="absolute top-[28%] right-2 2xl:right-8 hidden 2xl:block opacity-20"
      >
        <svg
          className="w-16 h-36"
          viewBox="0 0 80 180"
          fill="none"
        >
          {/* Delicate Stroke S-Curve */}
          <path
            d="M 60 10 C 15 50, 75 90, 30 145"
            stroke="var(--color-primary-yellow, #facc15)"
            strokeWidth="4"
            strokeLinecap="round"
          />
          <path
            d="M 60 10 C 15 50, 75 90, 30 145"
            stroke="#111111"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="6 5"
            className="animate-flow-dash-reverse"
          />
          {/* Downward Arrowhead */}
          <path
            d="M 18 135 L 30 152 L 42 138"
            stroke="#111111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="var(--color-primary-yellow, #facc15)"
          />
        </svg>
      </motion.div>

      {/* 3. LOWER-LEFT CORKSCREW LOOP ARROW (Safe bottom margin, low opacity) */}
      <motion.div
        style={{
          y: yArrowBottom,
          rotate: rotateArrowBottom,
        }}
        className="absolute bottom-[6%] left-4 2xl:left-12 hidden 2xl:block opacity-20"
      >
        <svg
          className="w-24 h-24"
          viewBox="0 0 120 120"
          fill="none"
        >
          <path
            d="M 20 80 C 15 30, 85 20, 80 65 C 75 95, 35 90, 50 60 C 65 30, 105 50, 110 85"
            stroke="#111111"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="5 4"
            className="animate-flow-dash"
          />
          <path
            d="M 98 78 L 112 88 L 115 72"
            stroke="#111111"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            fill="var(--color-primary-yellow, #facc15)"
          />
        </svg>
      </motion.div>
    </div>
  );
};
