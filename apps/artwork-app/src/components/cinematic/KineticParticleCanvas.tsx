"use client";

import React, { useEffect, useRef } from "react";
import {
  createParticlePool,
  updateParticlePool,
  spawnParticleInPool,
  DEFAULT_PARTICLE_POOL_SIZE,
} from "@art-work/types";

/**
 * Phase 6: Pooled 2D Canvas Particle System (Zero-DOM Garbage Collection Spike).
 * Pre-allocates a fixed-size pool of particle structs and renders onto a single
 * transparent GPU-accelerated canvas, completely eliminating DOM-node thrashing.
 */
export const KineticParticleCanvas = React.memo(function KineticParticleCanvas() {
  const canvasRef = useRef<HTMLCanvasElement | null>(null);

  useEffect(() => {
    const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
    if (prefersReducedMotion) return;

    const canvas = canvasRef.current;
    if (!canvas) return;

    const ctx = canvas.getContext("2d", { alpha: true });
    if (!ctx) return;

    // Pre-allocated particle pool (Zero GC allocation during interaction)
    const pool = createParticlePool(DEFAULT_PARTICLE_POOL_SIZE);

    let nextIndex = 0;
    let animFrameId: number | null = null;

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      const currentlyActive = updateParticlePool(pool);

      if (currentlyActive > 0) {
        for (let i = 0; i < pool.length; i++) {
          const p = pool[i];
          if (!p.active) continue;

          const currentSize = Math.max(0.5, p.size * p.alpha);

          ctx.save();
          ctx.globalAlpha = p.alpha;
          ctx.beginPath();
          ctx.arc(p.x, p.y, currentSize, 0, Math.PI * 2);
          ctx.fillStyle = p.color;
          ctx.fill();
          ctx.lineWidth = 1;
          ctx.strokeStyle = p.borderColor;
          ctx.stroke();
          ctx.restore();
        }

        animFrameId = requestAnimationFrame(render);
      } else {
        animFrameId = null;
        ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);
      }
    };

    const spawnParticle = (
      x: number,
      y: number,
      vx: number,
      vy: number,
      size: number,
      maxLife: number,
      color = "#dcb858",
      borderColor = "#111111"
    ) => {
      nextIndex = spawnParticleInPool(pool, nextIndex, {
        x,
        y,
        vx,
        vy,
        size,
        maxLife,
        color,
        borderColor,
      });

      if (animFrameId === null) {
        animFrameId = requestAnimationFrame(render);
      }
    };

    const handleResize = () => {
      const dpr = Math.min(window.devicePixelRatio || 1, 2);
      canvas.width = window.innerWidth * dpr;
      canvas.height = window.innerHeight * dpr;
      ctx.setTransform(dpr, 0, 0, dpr, 0, 0);
    };

    handleResize();
    window.addEventListener("resize", handleResize, { passive: true });

    let lastMove = 0;
    const handleMouseMove = (e: MouseEvent) => {
      const now = Date.now();
      if (now - lastMove > 90) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 1.5 + 0.5;
        const size = Math.floor(Math.random() * 5) + 4;
        spawnParticle(
          e.clientX,
          e.clientY,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          size,
          24,
          "#dcb858",
          "#111111"
        );
        lastMove = now;
      }
    };

    window.addEventListener("mousemove", handleMouseMove, { passive: true });

    // Custom event listener for particle bursts (Ink Pen, Buttons, etc.)
    const handleBurst = (e: Event) => {
      const customEvent = e as CustomEvent<{ x: number; y: number; count?: number }>;
      const { x, y, count = 20 } = customEvent.detail || {};
      if (typeof x !== "number" || typeof y !== "number") return;

      for (let i = 0; i < count; i++) {
        const angle = Math.random() * Math.PI * 2;
        const speed = Math.random() * 4 + 1.5;
        const size = Math.floor(Math.random() * 6) + 4;
        spawnParticle(
          x,
          y,
          Math.cos(angle) * speed,
          Math.sin(angle) * speed,
          size,
          32,
          "#facc15",
          "#000000"
        );
      }
    };

    window.addEventListener("artwork:particle-burst", handleBurst);

    return () => {
      window.removeEventListener("resize", handleResize);
      window.removeEventListener("mousemove", handleMouseMove);
      window.removeEventListener("artwork:particle-burst", handleBurst);
      if (animFrameId !== null) {
        cancelAnimationFrame(animFrameId);
      }
    };
  }, []);

  return (
    <canvas
      ref={canvasRef}
      className="fixed inset-0 pointer-events-none z-[9999] w-full h-full"
      style={{ touchAction: "none" }}
    />
  );
});
