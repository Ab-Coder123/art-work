"use client";

import React, { useSyncExternalStore } from "react";
import { useTheme } from "@/components/theme/ThemeProvider";
import { Sun, Moon } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";

const emptySubscribe = () => () => {};

export function ThemeToggle() {
  const { resolvedTheme, toggleTheme } = useTheme();
  const mounted = useSyncExternalStore(
    emptySubscribe,
    () => true,
    () => false
  );

  if (!mounted) {
    return (
      <div
        className="w-8 h-8 rounded-DEFAULT border-2 border-black bg-white comic-shadow-sm opacity-60"
        aria-hidden="true"
      />
    );
  }

  const isDark = resolvedTheme === "dark";

  return (
    <button
      onClick={toggleTheme}
      type="button"
      aria-label={isDark ? "Switch to Day Studio Mode" : "Switch to Night Ink Stage Mode"}
      title={isDark ? "Day Studio Mode (Light)" : "Night Ink Stage Mode (Dark)"}
      className="relative w-8 h-8 rounded-DEFAULT border-2 border-black dark:border-zinc-300 bg-white dark:bg-[#181820] hover:bg-yellow-100 dark:hover:bg-[#22222e] comic-shadow-sm dark:shadow-[3px_3px_0px_#DCB858] active:scale-90 transition-all duration-150 cursor-pointer flex items-center justify-center overflow-hidden"
    >
      <AnimatePresence mode="wait" initial={false}>
        {isDark ? (
          <motion.div
            key="sun"
            initial={{ scale: 0, rotate: -90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <Sun className="w-4 h-4 text-yellow-400 stroke-[2.5]" />
          </motion.div>
        ) : (
          <motion.div
            key="moon"
            initial={{ scale: 0, rotate: 90, opacity: 0 }}
            animate={{ scale: 1, rotate: 0, opacity: 1 }}
            exit={{ scale: 0, rotate: 90, opacity: 0 }}
            transition={{ duration: 0.2, ease: "easeInOut" }}
            className="flex items-center justify-center"
          >
            <Moon className="w-4 h-4 text-black stroke-[2.5]" />
          </motion.div>
        )}
      </AnimatePresence>
    </button>
  );
}
