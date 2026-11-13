"use client";

import React from "react";
import { motion } from "framer-motion";
import {
  Layers,
  Zap,
  Compass,
  CheckCircle2,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

const CAPABILITY_METRICS = [
  {
    icon: Compass,
    title: "3D Scenography & CAD",
    badge: "SMART DRAFTING",
    stat1: { num: "48h", label: "3D Render Delivery" },
    stat2: { num: "100%", label: "Working Drawings" },
    description: "Full photorealistic pre-visualization and engineering blueprints before cutting any wood or steel.",
  },
  {
    icon: Layers,
    title: "Structural Fabrication",
    badge: "PRECISION ENGINEERING",
    stat1: { num: "99.8%", label: "Spec Accuracy" },
    stat2: { num: "0", label: "Structural Delays" },
    description: "CNC milling, metal framing, premium acrylics, and structural pre-assembly in our production warehouse.",
  },
  {
    icon: Zap,
    title: "Live Show & AV Control",
    badge: "REAL-TIME SYNC",
    stat1: { num: "<1ms", label: "DMX Latency" },
    stat2: { num: "360°", label: "Synchronized Cues" },
    description: "4K LED video processors, synchronized moving lights, acoustic optimization, and live stage show-calling.",
  },
  {
    icon: CheckCircle2,
    title: "Turnkey Project Delivery",
    badge: "SINGLE SOURCE",
    stat1: { num: "1", label: "Dedicated Producer" },
    stat2: { num: "100%", label: "In-House Assembly" },
    description: "A single accountable team handling permits, freight, build, live show calling, and post-event teardown.",
  },
  {
    icon: Sparkles,
    title: "Bespoke Exhibition Booths",
    badge: "BRAND BUILT",
    stat1: { num: "100+", label: "Custom Pavilions" },
    stat2: { num: "0", label: "Generic Templates" },
    description: "Turnkey brand environments engineered to capture high visitor traffic and generate qualified leads.",
  },
  {
    icon: ShieldCheck,
    title: "Civil Defense & VIP Safety",
    badge: "FULL COMPLIANCE",
    stat1: { num: "100%", label: "Certified Compliance" },
    stat2: { num: "0", label: "Safety Incidents" },
    description: "Fire-rated materials, certified load-bearing rigging calculations, and verified venue approvals.",
  },
];

export const ProductionMetricsStack = React.memo(function ProductionMetricsStack() {
  return (
    <section
      aria-label="Art Work Production Technology and Metrics"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
    >
      {/* Section Header (EKO Page 3 Layout) */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300 dark:ring-white/15 text-zinc-700 dark:text-zinc-300 text-xs font-mono font-bold tracking-wider uppercase mb-3">
          <Zap className="w-3.5 h-3.5 text-[#dcb858]" />
          <span>Our Production Stack</span>
        </div>
        <h2 className="font-headline font-black text-2xl sm:text-4xl lg:text-[42px] tracking-tight text-zinc-900 dark:text-white mb-3 leading-tight">
          The Engineering Behind{" "}
          <span className="text-[#dcb858] drop-shadow-[0_2px_20px_rgba(220,184,88,0.28)]">
            Memorable Experiences
          </span>
        </h2>
        <p className="font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          Six interconnected capabilities engineered to eliminate risk, accelerate turnaround,
          and ensure flawless live show delivery across Egypt & Saudi Arabia.
        </p>
      </div>

      {/* 6 Bento Metric Cards Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4 sm:gap-5">
        {CAPABILITY_METRICS.map((cap, idx) => {
          const Icon = cap.icon;
          return (
            <motion.div
              key={cap.title}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-2xl bg-white dark:bg-[#0d0d15]/90 hover:bg-zinc-50 dark:hover:bg-[#13131f]/95 ring-1 ring-black/10 dark:ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg dark:shadow-xl"
            >
              <div>
                {/* Header: Icon + Badge */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-xl bg-[#dcb858]/10 ring-1 ring-[#dcb858]/30 flex items-center justify-center text-[#dcb858] group-hover:bg-[#dcb858] group-hover:text-black transition-colors duration-200">
                    <Icon className="w-5 h-5 stroke-[2]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-zinc-100 dark:bg-white/5 text-zinc-600 dark:text-zinc-400 ring-1 ring-zinc-200 dark:ring-white/10">
                    {cap.badge}
                  </span>
                </div>

                {/* Title & Description */}
                <h3 className="font-headline font-bold text-base sm:text-lg text-zinc-900 dark:text-white mb-2 group-hover:text-[#dcb858] transition-colors">
                  {cap.title}
                </h3>
                <p className="font-body text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
                  {cap.description}
                </p>
              </div>

              {/* Two Prominent Metric Counters (EKO Style) */}
              <div className="pt-4 border-t border-zinc-200 dark:border-white/10 grid grid-cols-2 gap-3">
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] ring-1 ring-zinc-200 dark:ring-white/5 text-left">
                  <div className="font-headline font-black text-lg sm:text-xl text-[#dcb858]">
                    {cap.stat1.num}
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
                    {cap.stat1.label}
                  </div>
                </div>
                <div className="p-2.5 rounded-xl bg-zinc-50 dark:bg-white/[0.03] ring-1 ring-zinc-200 dark:ring-white/5 text-left">
                  <div className="font-headline font-black text-lg sm:text-xl text-zinc-900 dark:text-white">
                    {cap.stat2.num}
                  </div>
                  <div className="text-[9px] font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mt-0.5">
                    {cap.stat2.label}
                  </div>
                </div>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
});
