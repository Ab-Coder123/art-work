"use client";

import React, { useSyncExternalStore } from "react";
import { motion, useScroll, useTransform } from "framer-motion";
import { Lightbulb } from "lucide-react";

function subscribe() {
  return () => {};
}

export const KineticDoodlesLayer: React.FC = () => {
  const { scrollYProgress } = useScroll();
  const mounted = useSyncExternalStore(
    subscribe,
    () => true,
    () => false
  );

  // Gentle Parallax transforms based on scroll
  const yPlane = useTransform(scrollYProgress, [0, 1], [0, -250]);
  const yBulb = useTransform(scrollYProgress, [0, 1], [0, -200]);
  const rotateStar = useTransform(scrollYProgress, [0, 1], [0, 360]);
  const yBadge = useTransform(scrollYProgress, [0, 1], [0, -150]);

  if (!mounted) return null;

  return (
    <div className="fixed inset-0 pointer-events-none z-0 overflow-hidden select-none">
      {/* 1. Paper Airplane floating exclusively in safe outer margins on wide 2xl screens */}
      <motion.div
        style={{ y: yPlane }}
        className="absolute top-[18%] left-3 2xl:left-6 hidden 2xl:block text-black/20 hover:text-black/50 transition-colors"
      >
        <div className="animate-plane">
          <svg
            className="w-8 h-8"
            fill="none"
            stroke="currentColor"
            strokeWidth="1.8"
            viewBox="0 0 24 24"
          >
            <path
              strokeLinecap="round"
              strokeLinejoin="round"
              d="M12 19l9 2-9-18-9 18 9-2zm0 0v-8"
            />
          </svg>
        </div>
      </motion.div>

      {/* 2. Comic Starburst floating in safe far-right gutter with subtle opacity */}
      <motion.div
        style={{ rotate: rotateStar }}
        className="absolute top-[32%] right-3 2xl:right-6 hidden 2xl:block text-yellow-400 opacity-25"
      >
        <svg
          className="w-8 h-8"
          fill="currentColor"
          stroke="#111111"
          strokeWidth="1.2"
          viewBox="0 0 24 24"
        >
          <path d="M12 2l2.4 7.4h7.6l-6.2 4.5 2.4 7.4-6.2-4.5-6.2 4.5 2.4-7.4-6.2-4.5h7.6z" />
        </svg>
      </motion.div>

      {/* 3. Floating Idea Lightbulb in safe far-left margin */}
      <motion.div
        style={{ y: yBulb }}
        className="absolute top-[68%] left-3 2xl:left-6 hidden 2xl:block opacity-25"
      >
        <div className="bg-white border border-black/40 rounded-full p-1.5 shadow-[2px_2px_0px_rgba(0,0,0,0.15)] flex items-center justify-center">
          <Lightbulb className="w-4 h-4 text-yellow-500 fill-yellow-400 stroke-black" />
        </div>
      </motion.div>

      {/* 4. Subtle Arena Badge in far right gutter */}
      <motion.div
        style={{ y: yBadge }}
        className="absolute top-[82%] right-3 2xl:right-6 hidden 2xl:block opacity-25"
      >
        <div className="bg-yellow-300 border border-black/30 rounded px-2 py-0.5 shadow-sm rotate-6 flex items-center gap-1 text-[9px] font-mono font-bold text-black/70">
          <span>⚡ 60FPS</span>
        </div>
      </motion.div>
    </div>
  );
};
