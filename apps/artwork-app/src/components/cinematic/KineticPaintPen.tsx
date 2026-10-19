"use client";

import React, { useState, useEffect } from "react";
import { motion, useSpring, useMotionValue } from "framer-motion";
import { soundFX } from "@/utils/soundFX";
import { useDoodleStore } from "@/store/useDoodleStore";

export const KineticPaintPen: React.FC = () => {
  const [isHovered, setIsHovered] = useState(false);
  const isDoodleActive = useDoodleStore((state) => state.isDoodleActive);
  const toggleDoodle = useDoodleStore((state) => state.toggleDoodle);

  // Subtle mouse parallax motion
  const mouseX = useMotionValue(0);
  const mouseY = useMotionValue(0);

  const springX = useSpring(mouseX, { stiffness: 45, damping: 20 });
  const springY = useSpring(mouseY, { stiffness: 45, damping: 20 });

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      const offsetX = (e.clientX - window.innerWidth / 2) * 0.015;
      const offsetY = (e.clientY - window.innerHeight / 2) * 0.015;
      mouseX.set(offsetX);
      mouseY.set(offsetY);
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });
    return () => window.removeEventListener("mousemove", handleMouseMove);
  }, [mouseX, mouseY]);

  const handlePenClick = () => {
    soundFX.playPop();
    toggleDoodle();
  };

  return (
    <div className="fixed bottom-2 right-2 sm:bottom-3 sm:right-4 z-50 pointer-events-auto select-none scale-75 sm:scale-80 origin-bottom-right hidden md:block">
      <motion.div
        style={{ x: springX, y: springY }}
        className={`relative cursor-pointer group transition-all duration-300 ${
          isDoodleActive
            ? "opacity-100 filter drop-shadow-[0_0_12px_rgba(250,204,21,0.8)]"
            : "opacity-35 hover:opacity-100"
        }`}
        onMouseEnter={() => {
          setIsHovered(true);
          soundFX.playClick();
        }}
        onMouseLeave={() => setIsHovered(false)}
        onClick={handlePenClick}
        whileTap={{ scale: 0.9 }}
      >
        {/* Comic Tooltip: Shows on Hover or while active */}
        <motion.div
          initial={{ opacity: 0, y: 6, scale: 0.8 }}
          animate={{
            opacity: isHovered || isDoodleActive ? 1 : 0,
            y: isHovered || isDoodleActive ? -6 : 6,
            scale: isHovered || isDoodleActive ? 1 : 0.8,
          }}
          transition={{ duration: 0.15 }}
          className={`absolute -top-9 -left-20 border rounded-md px-2.5 py-0.5 shadow-[2px_2px_0px_#111111] pointer-events-none flex items-center gap-1.5 whitespace-nowrap ${
            isDoodleActive
              ? "bg-yellow-400 border-black text-black font-extrabold"
              : "bg-white border-black text-black"
          }`}
        >
          <span className="w-1.5 h-1.5 rounded-full bg-black animate-ping"></span>
          <span className="font-mono text-[9px] font-black uppercase tracking-wider">
            {isDoodleActive ? "DOODLING ACTIVE! ⚡ (CLICK TO STOP)" : "CLICK TO DOODLE! ✍️"}
          </span>
          <div className="absolute -bottom-1 right-5 w-2 h-2 bg-inherit border-r border-b border-black rotate-45"></div>
        </motion.div>

        {/* Compact, gentle paint sweep (Kept tucked under the pen, not stretching over cards) */}
        <svg
          className="absolute -bottom-2 -left-10 w-24 h-16 pointer-events-none overflow-visible opacity-60"
          viewBox="0 0 100 60"
          fill="none"
        >
          {/* Yellow brush stroke tucked neatly under nib */}
          <motion.path
            d="M 10 45 C 30 50, 60 38, 85 36"
            stroke="#facc15"
            strokeWidth="8"
            strokeLinecap="round"
            initial={{ pathLength: 0.3 }}
            animate={{
              pathLength: isHovered ? [0.3, 0.95, 0.3] : 0.5,
              strokeWidth: isHovered ? [6, 10, 6] : 7,
            }}
            transition={{
              duration: 2.4,
              repeat: Infinity,
              ease: "easeInOut",
            }}
          />
          {/* Subtle ink dash line */}
          <path
            d="M 12 45 C 32 50, 60 38, 85 36"
            stroke="#111111"
            strokeWidth="1.8"
            strokeLinecap="round"
            strokeDasharray="5 3"
            className="animate-flow-dash"
          />
        </svg>

        {/* The Art Work Studio Pen Graphic */}
        <motion.div
          animate={{
            rotate: isHovered ? [-24, -18, -24] : -22,
            y: isHovered ? [0, -4, 0] : 0,
          }}
          transition={{
            duration: 2,
            repeat: Infinity,
            ease: "easeInOut",
          }}
          className="w-12 h-22 relative filter drop-shadow-[2px_3px_0px_rgba(17,17,17,0.6)]"
        >
          <svg viewBox="0 0 70 120" className="w-full h-full" fill="none">
            {/* Pen Barrel Body (Iconic Canary Yellow) */}
            <path
              d="M 28 20 L 42 20 L 40 80 L 30 80 Z"
              fill="#facc15"
              stroke="#111111"
              strokeWidth="2.2"
              strokeLinejoin="round"
            />

            {/* Pen Top Cap */}
            <rect
              x="27"
              y="12"
              width="16"
              height="8"
              rx="2"
              fill="#111111"
              stroke="#111111"
              strokeWidth="1.5"
            />

            {/* Metallic Clip */}
            <path
              d="M 42 16 L 46 22 L 45 52 L 41 50"
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinecap="round"
              fill="#ffffff"
            />

            {/* Ink Reservoir Window */}
            <rect
              x="32"
              y="34"
              width="6"
              height="20"
              rx="3"
              fill="#ffffff"
              stroke="#111111"
              strokeWidth="1.2"
            />
            <rect
              x="33"
              y="42"
              width="4"
              height="10"
              rx="2"
              fill="#111111"
            />

            {/* Pen Grip Section */}
            <path
              d="M 30 80 L 40 80 L 38 96 L 32 96 Z"
              fill="#111111"
              stroke="#111111"
              strokeWidth="1.8"
            />
            <line x1="31" y1="84" x2="39" y2="84" stroke="#ffffff" strokeWidth="0.8" />
            <line x1="31" y1="88" x2="39" y2="88" stroke="#ffffff" strokeWidth="0.8" />
            <line x1="32" y1="92" x2="38" y2="92" stroke="#ffffff" strokeWidth="0.8" />

            {/* Metallic Nib */}
            <path
              d="M 32 96 L 38 96 L 35 112 Z"
              fill="#facc15"
              stroke="#111111"
              strokeWidth="1.8"
              strokeLinejoin="round"
            />
            <line x1="35" y1="98" x2="35" y2="108" stroke="#111111" strokeWidth="0.8" />
            <circle cx="35" cy="102" r="1" fill="#111111" />

            {/* Nib Tip Ink Drop */}
            <motion.circle
              cx="35"
              cy="113"
              r="2"
              fill="#111111"
              animate={{
                scale: isHovered ? [1, 1.4, 1] : 1,
              }}
              transition={{ duration: 1, repeat: Infinity }}
            />
          </svg>
        </motion.div>
      </motion.div>
    </div>
  );
};
