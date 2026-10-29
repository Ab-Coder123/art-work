"use client";

import React, { useEffect, useRef } from "react";

interface Particle {
  active: boolean;
  x: number;
  y: number;
  vx: number;
  vy: number;
  size: number;
  color: string;
  borderColor: string;
  alpha: number;
  life: number;
  maxLife: number;
}

const POOL_SIZE = 120;

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
    const pool: Particle[] = Array.from({ length: POOL_SIZE }, () => ({
      active: false,
      x: 0,
      y: 0,
      vx: 0,
      vy: 0,
      size: 6,
      color: "#dcb858",
      borderColor: "#111111",
      alpha: 1,
      life: 0,
      maxLife: 24,
    }));

    let nextIndex = 0;
    let animFrameId: number | null = null;

    const render = () => {
      ctx.clearRect(0, 0, window.innerWidth, window.innerHeight);

      let currentlyActive = 0;

      for (let i = 0; i < POOL_SIZE; i++) {
        const p = pool[i];
        if (!p.active) continue;

        p.life++;
        if (p.life >= p.maxLife) {
          p.active = false;
          continue;
        }

        currentlyActive++;
        p.x += p.vx;
        p.y += p.vy;
        p.alpha = Math.max(0, 1 - p.life / p.maxLife);
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

      if (currentlyActive > 0) {
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
      const p = pool[nextIndex];
      p.active = true;
      p.x = x;
      p.y = y;
      p.vx = vx;
      p.vy = vy;
      p.size = size;
      p.alpha = 1;
      p.life = 0;
      p.maxLife = maxLife;
      p.color = color;
      p.borderColor = borderColor;

      nextIndex = (nextIndex + 1) % POOL_SIZE;

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
