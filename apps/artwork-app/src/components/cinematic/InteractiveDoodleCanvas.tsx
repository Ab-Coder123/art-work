"use client";

import React, { useEffect, useRef, useState } from "react";
import { useDoodleStore } from "@/store/useDoodleStore";
import { soundFX } from "@/utils/soundFX";

interface Point {
  x: number;
  y: number;
  time: number;
}

const STROKE_LIFETIME = 800; // 0.8 seconds (between 1/4 second and 1 second)

export const InteractiveDoodleCanvas: React.FC = () => {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const isDoodleActive = useDoodleStore((state) => state.isDoodleActive);
  const setDoodleActive = useDoodleStore((state) => state.setDoodleActive);

  // Pen cursor position
  const [penPos, setPenPos] = useState({ x: -100, y: -100, isPressing: false });

  const strokesRef = useRef<Point[][]>([]);
  const isDrawingRef = useRef(false);
  const animFrameIdRef = useRef<number | null>(null);
  const lastSoundTimeRef = useRef(0);

  useEffect(() => {
    const canvas = canvasRef.current;
    if (!canvas) return;
    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Handle high DPI Retina Displays properly
    const resizeCanvas = () => {
      const dpr = window.devicePixelRatio || 1;
      canvas.width = Math.floor(window.innerWidth * dpr);
      canvas.height = Math.floor(window.innerHeight * dpr);
      canvas.style.width = `${window.innerWidth}px`;
      canvas.style.height = `${window.innerHeight}px`;
    };

    resizeCanvas();
    window.addEventListener("resize", resizeCanvas);

    // High-performance RAF Render Loop
    const render = () => {
      const now = performance.now();
      const dpr = window.devicePixelRatio || 1;

      // Always reset transform matrix before clear
      ctx.setTransform(1, 0, 0, 1, 0, 0);
      ctx.clearRect(0, 0, canvas.width, canvas.height);
      ctx.scale(dpr, dpr);

      let totalActivePoints = 0;

      // Filter and prune expired strokes
      strokesRef.current = strokesRef.current
        .map((stroke) => stroke.filter((p) => now - p.time < STROKE_LIFETIME))
        .filter((stroke) => stroke.length > 0);

      // Render each active scribble stroke
      for (const stroke of strokesRef.current) {
        if (stroke.length === 0) continue;
        totalActivePoints += stroke.length;

        // If single tap dot
        if (stroke.length === 1) {
          const p = stroke[0];
          const age = now - p.time;
          const alpha = Math.max(0, Math.pow(1 - age / STROKE_LIFETIME, 1.2));

          ctx.beginPath();
          ctx.arc(p.x, p.y, 5, 0, Math.PI * 2);
          ctx.fillStyle = `rgba(220, 184, 88, ${alpha})`;
          ctx.shadowColor = `rgba(17, 17, 17, ${alpha * 0.4})`;
          ctx.shadowBlur = 3;
          ctx.shadowOffsetX = 1;
          ctx.shadowOffsetY = 1;
          ctx.fill();
          continue;
        }

        // Draw smooth interpolated path
        for (let i = 1; i < stroke.length; i++) {
          const p1 = stroke[i - 1];
          const p2 = stroke[i];

          const age = now - p2.time;
          const alpha = Math.max(0, Math.pow(1 - age / STROKE_LIFETIME, 1.2));

          ctx.beginPath();
          ctx.moveTo(p1.x, p1.y);
          ctx.lineTo(p2.x, p2.y);

          // Art Work Logo Artisan Gold (#DCB858) with comic shadow
          ctx.strokeStyle = `rgba(220, 184, 88, ${alpha})`;
          ctx.lineWidth = 8;
          ctx.lineCap = "round";
          ctx.lineJoin = "round";

          ctx.shadowColor = `rgba(17, 17, 17, ${alpha * 0.45})`;
          ctx.shadowBlur = 4;
          ctx.shadowOffsetX = 2;
          ctx.shadowOffsetY = 2;

          ctx.stroke();
        }
      }

      // If active strokes remain or currently drawing, keep 60fps loop running
      if (totalActivePoints > 0 || isDrawingRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
      } else {
        animFrameIdRef.current = null;
      }
    };

    const startLoopIfNeeded = () => {
      if (!animFrameIdRef.current) {
        animFrameIdRef.current = requestAnimationFrame(render);
      }
    };

    // Canvas Pointer Event Listeners (Direct Pointer Capture)
    const onPointerDown = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDoodleActive) return;
      e.preventDefault();
      try {
        canvas.setPointerCapture(e.pointerId);
      } catch {
        // Fallback for browsers that don't support capture
      }

      isDrawingRef.current = true;
      setPenPos({ x: e.clientX, y: e.clientY, isPressing: true });

      strokesRef.current.push([
        { x: e.clientX, y: e.clientY, time: performance.now() },
      ]);
      soundFX.playPop();
      startLoopIfNeeded();
    };

    const onPointerMove = (e: React.PointerEvent<HTMLCanvasElement>) => {
      if (!isDoodleActive) return;
      setPenPos((prev) => ({ ...prev, x: e.clientX, y: e.clientY }));

      if (!isDrawingRef.current) return;

      const now = performance.now();
      const currentStroke = strokesRef.current[strokesRef.current.length - 1];
      if (currentStroke) {
        currentStroke.push({ x: e.clientX, y: e.clientY, time: now });

        // Throttle tactile sound effect while scribbling
        if (now - lastSoundTimeRef.current > 110) {
          soundFX.playTape();
          lastSoundTimeRef.current = now;
        }

        startLoopIfNeeded();
      }
    };

    const onPointerUp = (e: React.PointerEvent<HTMLCanvasElement>) => {
      isDrawingRef.current = false;
      setPenPos((prev) => ({ ...prev, isPressing: false }));
      try {
        if (canvas.hasPointerCapture(e.pointerId)) {
          canvas.releasePointerCapture(e.pointerId);
        }
      } catch {
        // Ignore
      }
    };

    // Attach to canvas DOM
    canvas.onpointerdown = onPointerDown as unknown as (ev: PointerEvent) => void;
    canvas.onpointermove = onPointerMove as unknown as (ev: PointerEvent) => void;
    canvas.onpointerup = onPointerUp as unknown as (ev: PointerEvent) => void;
    canvas.onpointercancel = onPointerUp as unknown as (ev: PointerEvent) => void;

    // Keyboard shortcut: ESC to deactivate doodle mode
    const handleKeyDown = (e: KeyboardEvent) => {
      if (e.key === "Escape" && isDoodleActive) {
        setDoodleActive(false);
        soundFX.playClick();
      }
    };
    window.addEventListener("keydown", handleKeyDown);

    return () => {
      window.removeEventListener("resize", resizeCanvas);
      window.removeEventListener("keydown", handleKeyDown);
      if (animFrameIdRef.current) {
        cancelAnimationFrame(animFrameIdRef.current);
      }
    };
  }, [isDoodleActive, setDoodleActive]);

  return (
    <>
      {/* 60FPS Hardware Accelerated Doodle Canvas */}
      <canvas
        ref={canvasRef}
        style={{
          touchAction: "none",
          userSelect: "none",
        }}
        className={`fixed inset-0 z-40 transition-opacity duration-200 ${
          isDoodleActive
            ? "pointer-events-auto cursor-crosshair opacity-100"
            : "pointer-events-none opacity-0"
        }`}
      />

      {/* Live Floating Studio Pen Following the Mouse Cursor */}
      {isDoodleActive && penPos.x > 0 && (
        <div
          className="fixed pointer-events-none z-50 transition-transform duration-75"
          style={{
            left: `${penPos.x}px`,
            top: `${penPos.y}px`,
            transform: `translate(-12px, -88px) rotate(${penPos.isPressing ? "-18deg" : "-26deg"}) scale(${
              penPos.isPressing ? 0.88 : 0.82
            })`,
          }}
        >
          <div className="relative w-12 h-22 filter drop-shadow-[2px_4px_0px_#111111]">
            <svg viewBox="0 0 70 120" className="w-full h-full" fill="none">
              {/* Pen Barrel Body (Iconic Canary Yellow) */}
              <path
                d="M 28 20 L 42 20 L 40 80 L 30 80 Z"
                fill="#facc15"
                stroke="#111111"
                strokeWidth="2.5"
                strokeLinejoin="round"
              />
              {/* Pen Top Cap */}
              <rect x="27" y="12" width="16" height="8" rx="2" fill="#111111" stroke="#111111" strokeWidth="1.5" />
              {/* Clip */}
              <path d="M 42 16 L 46 22 L 45 52 L 41 50" stroke="#111111" strokeWidth="2" strokeLinecap="round" fill="#ffffff" />
              {/* Window */}
              <rect x="32" y="34" width="6" height="20" rx="3" fill="#ffffff" stroke="#111111" strokeWidth="1.2" />
              <rect x="33" y="42" width="4" height="10" rx="2" fill="#111111" />
              {/* Grip */}
              <path d="M 30 80 L 40 80 L 38 96 L 32 96 Z" fill="#111111" stroke="#111111" strokeWidth="2" />
              {/* Nib */}
              <path d="M 32 96 L 38 96 L 35 112 Z" fill="#dcb858" stroke="#111111" strokeWidth="2" strokeLinejoin="round" />
              <circle cx="35" cy="102" r="1.2" fill="#111111" />
              {/* Nib Fresh Ink */}
              <circle cx="35" cy="113" r="2.5" fill="#dcb858" stroke="#111111" strokeWidth="1" />
            </svg>
          </div>
        </div>
      )}

      {/* Floating Active Status Banner */}
      {isDoodleActive && (
        <div className="fixed top-16 left-1/2 -translate-x-1/2 z-50 pointer-events-auto select-none">
          <div className="bg-yellow-400 text-black border-2 border-black rounded-full px-4 py-1.5 comic-shadow flex items-center gap-2.5 text-xs font-headline font-black">
            <span className="w-2.5 h-2.5 rounded-full bg-black animate-ping"></span>
            <span>DOODLE MODE ACTIVE: Click &amp; drag anywhere to scribble!</span>
            <span className="text-[10px] font-mono bg-black text-white px-2 py-0.5 rounded-full">
              FADES IN 0.8s
            </span>
            <button
              onClick={() => {
                setDoodleActive(false);
                soundFX.playClick();
              }}
              className="bg-white hover:bg-black hover:text-white text-black border border-black rounded-full w-5 h-5 flex items-center justify-center text-[10px] font-black cursor-pointer transition-colors ml-1"
              title="Close Doodle Mode (ESC)"
            >
              ✕
            </button>
          </div>
        </div>
      )}
    </>
  );
};
