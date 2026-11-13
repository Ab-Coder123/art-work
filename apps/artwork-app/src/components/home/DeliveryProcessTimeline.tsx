"use client";

import React from "react";
import { motion } from "framer-motion";
import { Compass, Layers, Hammer, Sparkles } from "lucide-react";

const DELIVERY_STEPS = [
  {
    step: "01",
    icon: Compass,
    title: "Concept & Spatial Discovery",
    description: "We analyze brand identity, venue footprint, audience flow, and structural requirements to sculpt a distinct creative vision.",
    tag: "DISCOVERY & BRIEF",
  },
  {
    step: "02",
    icon: Layers,
    title: "3D Engineering & Scenography",
    description: "Photorealistic 3D renders, architectural CAD drafting, load calculations, and full civil defense compliance plans.",
    tag: "3D ARCHITECTURE",
  },
  {
    step: "03",
    icon: Hammer,
    title: "In-House Fabrication & Rigging",
    description: "CNC precision milling, structural carpentry, metal framing, custom acrylics, and rigorous pre-assembly in our production warehouse.",
    tag: "PRECISION BUILD",
  },
  {
    step: "04",
    icon: Sparkles,
    title: "Turnkey On-Site Show Delivery",
    description: "Seamless venue bump-in, 4K LED synchronization, DMX lighting rehearsal, live cue management, and dedicated producer on stage.",
    tag: "LIVE EXECUTION",
  },
];

export const DeliveryProcessTimeline = React.memo(function DeliveryProcessTimeline() {
  return (
    <section
      aria-label="How We Deliver Framework"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
    >
      {/* Section Header (EKO Page 6 Style) */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-2 px-3.5 py-1.5 rounded-full bg-white/5 ring-1 ring-white/15 text-zinc-300 text-xs font-mono font-bold tracking-wider uppercase mb-3">
          <Sparkles className="w-3.5 h-3.5 text-[#dcb858]" />
          <span>Execution Roadmap</span>
        </div>
        <h2 className="font-headline font-black text-2xl sm:text-4xl lg:text-[42px] tracking-tight text-white mb-3 leading-tight">
          How We{" "}
          <span className="text-[#dcb858] drop-shadow-[0_2px_20px_rgba(220,184,88,0.28)]">
            Deliver
          </span>
        </h2>
        <p className="font-body text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-2xl">
          A predictable, zero-downtime framework: concept, 3D engineering, in-house fabrication,
          and turnkey live show calling.
        </p>
      </div>

      {/* 4 Steps Timeline Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 relative">
        {DELIVERY_STEPS.map((item, idx) => {
          const Icon = item.icon;
          return (
            <motion.div
              key={item.step}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="p-6 rounded-2xl bg-[#0d0d15]/90 hover:bg-[#13131f]/95 ring-1 ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl relative"
            >
              <div>
                {/* Step Number Circle (EKO Style Circle Badge) */}
                <div className="flex items-center justify-between mb-4">
                  <div className="w-10 h-10 rounded-full bg-[#dcb858]/15 ring-1 ring-[#dcb858]/40 flex items-center justify-center font-mono font-black text-sm text-[#dcb858] group-hover:bg-[#dcb858] group-hover:text-black transition-colors duration-200">
                    {item.step}
                  </div>
                  <span className="text-[9px] font-mono font-bold tracking-wider uppercase px-2.5 py-1 rounded-full bg-white/5 text-zinc-400 ring-1 ring-white/10">
                    {item.tag}
                  </span>
                </div>

                {/* Icon & Title */}
                <div className="flex items-center gap-2 mb-2">
                  <Icon className="w-4 h-4 text-[#dcb858] shrink-0" />
                  <h3 className="font-headline font-bold text-sm sm:text-base text-white group-hover:text-[#dcb858] transition-colors">
                    {item.title}
                  </h3>
                </div>

                <p className="font-body text-xs text-zinc-400 leading-relaxed">
                  {item.description}
                </p>
              </div>

              <div className="pt-4 mt-4 ring-t-1 ring-white/5 flex items-center justify-between text-[10px] font-mono text-zinc-500">
                <span>PHASE {item.step} OF 04</span>
                <span className="text-[#dcb858] font-semibold">CONFIRMED</span>
              </div>
            </motion.div>
          );
        })}
      </div>
    </section>
  );
});
