"use client";

import { useEffect, useState } from "react";
import dynamic from "next/dynamic";

const Kinetic3DBackground = dynamic(
  () => import("./Kinetic3DBackground").then((module) => module.Kinetic3DBackground),
  { ssr: false }
);

type IdleWindow = Window & {
  requestIdleCallback?: (callback: () => void, options?: { timeout: number }) => number;
  cancelIdleCallback?: (handle: number) => void;
};

/** Load the decorative Three.js scene after initial content, and skip it for reduced motion. */
export function DeferredKinetic3DBackground() {
  const [isReady, setIsReady] = useState(false);

  useEffect(() => {
    if (window.matchMedia("(prefers-reduced-motion: reduce)").matches) return;

    const idleWindow = window as IdleWindow;
    if (idleWindow.requestIdleCallback) {
      const handle = idleWindow.requestIdleCallback(() => setIsReady(true), { timeout: 1800 });
      return () => idleWindow.cancelIdleCallback?.(handle);
    }

    const handle = window.setTimeout(() => setIsReady(true), 900);
    return () => window.clearTimeout(handle);
  }, []);

  return isReady ? <Kinetic3DBackground /> : null;
}
