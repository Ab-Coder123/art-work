"use client";

import React from "react";
import { motion, type HTMLMotionProps } from "framer-motion";

export interface ScrollRevealProps extends HTMLMotionProps<"div"> {
  children: React.ReactNode;
  /** Direction from which the element enters */
  direction?: "up" | "down" | "left" | "right" | "pop" | "fade";
  /** Distance in pixels for translation */
  distance?: number;
  /** Delay in seconds */
  delay?: number;
  /** Duration in seconds */
  duration?: number;
  /** Viewport amount required to trigger (0.1 = 10% in view) */
  viewportAmount?: number;
  /** Additional CSS class names */
  className?: string;
}

/**
 * Universal Scroll Reveal Wrapper.
 * Activates an elegant entrance animation exactly when the user scrolls to the component.
 */
export const ScrollReveal: React.FC<ScrollRevealProps> = ({
  children,
  direction = "up",
  distance = 32,
  delay = 0,
  duration = 0.6,
  viewportAmount = 0.15,
  className = "",
  ...rest
}) => {
  let initial = {};
  const animate = { opacity: 1, x: 0, y: 0, scale: 1 };

  switch (direction) {
    case "up":
      initial = { opacity: 0, y: distance };
      break;
    case "down":
      initial = { opacity: 0, y: -distance };
      break;
    case "left":
      initial = { opacity: 0, x: -distance };
      break;
    case "right":
      initial = { opacity: 0, x: distance };
      break;
    case "pop":
      initial = { opacity: 0, scale: 0.94, y: Math.floor(distance * 0.6) };
      break;
    case "fade":
    default:
      initial = { opacity: 0 };
      break;
  }

  return (
    <motion.div
      initial={initial}
      whileInView={animate}
      viewport={{ once: true, amount: viewportAmount }}
      transition={{
        duration,
        delay,
        ease: [0.22, 1, 0.36, 1],
      }}
      className={className}
      {...rest}
    >
      {children}
    </motion.div>
  );
};
