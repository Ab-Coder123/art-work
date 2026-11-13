"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Layers, Hammer, Sparkles } from "lucide-react";

const DELIVERY_STEPS = [
  {
    step: "01",
    icon: Compass,
    title: "Audit & Strategy",
    description: "We map brand goals, venue constraints, attendee journeys, and technical KPIs. Then define the structural spatial plan and show direction.",
    tag: "DISCOVERY & BRIEF",
    side: "left",
  },
  {
    step: "02",
    icon: Layers,
    title: "3D Scenography & Engineering",
    description: "Photorealistic 3D renders, load-bearing CAD drafting, material selection, and verified civil defense approvals before construction begins.",
    tag: "3D ARCHITECTURE",
    side: "right",
  },
  {
    step: "03",
    icon: Hammer,
    title: "In-House Fabrication & Rigging",
    description: "CNC milling, architectural carpentry, acrylic fabrication, custom steelwork, and full pre-assembly staging in our production warehouse.",
    tag: "PRECISION BUILD",
    side: "left",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "Turnkey On-Site Show Delivery",
    description: "Timed overnight venue bump-in, 4K LED mapping, DMX lighting synchronization, full technical rehearsals, and live stage management.",
    tag: "LIVE EXECUTION",
    side: "right",
  },
];

export const DeliveryProcessTimeline = React.memo(function DeliveryProcessTimeline() {
  return (
    <section
      aria-label="How We Deliver Framework"
      className="w-full max-w-5xl mx-auto px-4 sm:px-6 py-10 sm:py-16"
      id="process"
    >
      {/* Section Header (Matching Image Section 11) */}
      <div className="flex flex-col items-center text-center max-w-2xl mx-auto mb-12 sm:mb-16">
        <h2 className="font-headline font-black text-2xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight leading-tight mb-2">
          How we{" "}
          <span className="text-[#dcb858] drop-shadow-[0_2px_20px_rgba(220,184,88,0.25)]">
            deliver
          </span>
        </h2>
        <p className="font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400">
          A simple system: clarify, create, launch, optimize — then scale.
        </p>
      </div>

      {/* Alternating Timeline (Desktop: Center Line with alternating cards; Mobile: Left Line) */}
      <div className="relative">
        {/* Center Vertical Gradient Line */}
        <div className="absolute left-4 md:left-1/2 top-4 bottom-4 w-0.5 -translate-x-1/2 bg-gradient-to-b from-[#dcb858]/80 via-zinc-300 dark:via-white/20 to-[#dcb858]/80 pointer-events-none" />

        <div className="space-y-8 sm:space-y-12">
          {DELIVERY_STEPS.map((item, idx) => {
            const isLeft = item.side === "left";
            return (
              <div
                key={item.step}
                className={`relative flex flex-col md:flex-row items-center ${
                  isLeft ? "md:flex-row" : "md:flex-row-reverse"
                }`}
              >
                {/* Content Card (Left or Right on desktop) */}
                <div className="w-full md:w-1/2 pl-12 md:pl-0 md:px-8">
                  <motion.div
                    initial={{ opacity: 0, x: isLeft ? -25 : 25 }}
                    whileInView={{ opacity: 1, x: 0 }}
                    viewport={{ once: true, amount: 0.2 }}
                    transition={{ duration: 0.45, delay: idx * 0.05, ease: [0.16, 1, 0.3, 1] }}
                    className="p-6 rounded-2xl bg-white dark:bg-[#0d0d15]/90 hover:bg-zinc-50 dark:hover:bg-[#13131f]/95 ring-1 ring-black/10 dark:ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 shadow-lg dark:shadow-xl group"
                  >
                    <div className="flex items-center justify-between mb-2">
                      <span className="text-[10px] font-mono text-[#dcb858] uppercase font-bold tracking-wider">
                        {item.tag}
                      </span>
                      <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
                        STAGE {item.step}
                      </span>
                    </div>
                    <h3 className="font-headline font-bold text-base sm:text-lg text-zinc-900 dark:text-white group-hover:text-[#dcb858] transition-colors mb-2">
                      {item.title}
                    </h3>
                    <p className="font-body text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                      {item.description}
                    </p>
                  </motion.div>
                </div>

                {/* Number Circle Badge on the Center Line */}
                <div className="absolute left-4 md:left-1/2 -translate-x-1/2 w-9 h-9 sm:w-10 sm:h-10 rounded-full bg-[#0a0a0f] ring-2 ring-[#dcb858] shadow-[0_0_15px_rgba(220,184,88,0.4)] flex items-center justify-center font-mono font-black text-xs text-[#dcb858] z-10 select-none">
                  {item.step}
                </div>

                {/* Empty opposite spacer on desktop */}
                <div className="hidden md:block md:w-1/2" />
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
});
