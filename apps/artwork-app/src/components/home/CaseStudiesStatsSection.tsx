"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Sparkles } from "lucide-react";

const CASE_STUDIES = [
  {
    client: "Nile Air",
    metric: "+47%",
    metricLabel: "Audience Engagement",
    description: "Turnkey aviation summit stage & interactive LED installation in Cairo.",
  },
  {
    client: "Miro Architects",
    metric: "+156%",
    metricLabel: "Booth Inquiries",
    description: "Bespoke architectural pavilion with live projection mapping at Cityscape.",
  },
  {
    client: "First Gulf Company",
    metric: "+85%",
    metricLabel: "Executive Recall",
    description: "Multi-tiered corporate gala with 360° synchronized sound & moving lights.",
  },
  {
    client: "Nesma Airlines",
    metric: "+65%",
    metricLabel: "Brand Awareness",
    description: "High-impact brand launch experience across regional MENA airports.",
  },
];

export const CaseStudiesStatsSection = React.memo(function CaseStudiesStatsSection() {
  const handleBookCall = () => {
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("artwork:navigate-stage", { detail: { stage: "stage-04" } })
      );
      const briefSec = document.getElementById("brief-inquiry");
      if (briefSec) briefSec.scrollIntoView({ behavior: "smooth" });
    }
  };

  return (
    <section
      aria-label="Client Case Studies and Results"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
      id="case-studies"
    >
      {/* Header (Matching Image Section 6) */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300 dark:ring-white/10 text-xs font-mono font-bold tracking-wider text-zinc-700 dark:text-zinc-400 uppercase mb-2">
          <Sparkles className="w-3.5 h-3.5 text-[#dcb858]" />
          <span>Case Studies</span>
        </div>
        <h2 className="font-headline font-black text-2xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight leading-tight">
          Real clients.{" "}
          <span className="text-[#dcb858] drop-shadow-[0_2px_20px_rgba(220,184,88,0.25)]">
            Measured results.
          </span>
        </h2>
      </div>

      {/* 4 Case Study Metric Cards */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4 sm:gap-5 mb-8">
        {CASE_STUDIES.map((item, idx) => (
          <motion.div
            key={item.client}
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: false, amount: 0.15 }}
            transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
            className="p-6 rounded-2xl bg-white dark:bg-[#0d0d15]/90 hover:bg-zinc-50 dark:hover:bg-[#13131f]/95 ring-1 ring-black/10 dark:ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg dark:shadow-xl min-h-[190px]"
          >
            <div>
              <div className="text-xs font-mono text-zinc-500 dark:text-zinc-400 uppercase tracking-wider mb-2">
                {item.client}
              </div>
              <div className="font-headline font-black text-2xl sm:text-3xl text-[#dcb858] mb-1">
                {item.metric}
              </div>
              <div className="font-headline font-bold text-sm text-zinc-900 dark:text-white mb-2">
                {item.metricLabel}
              </div>
              <p className="font-body text-xs text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {item.description}
              </p>
            </div>

            <div className="pt-4 mt-4 border-t border-zinc-200 dark:border-white/10">
              <Link
                href="/gallery"
                className="inline-flex items-center gap-1.5 text-xs font-headline font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-[#dcb858] transition-colors uppercase tracking-wider"
              >
                <span>Read case study</span>
                <ArrowRight className="w-3.5 h-3.5 group-hover:translate-x-1 transition-transform" />
              </Link>
            </div>
          </motion.div>
        ))}
      </div>

      {/* Action CTA Button */}
      <div className="flex flex-col items-center justify-center gap-2">
        <button
          onClick={handleBookCall}
          className="inline-flex items-center gap-2 px-7 py-3 rounded-full bg-[#dcb858] hover:bg-yellow-300 text-black font-headline font-bold text-xs sm:text-sm uppercase tracking-wider shadow-[0_8px_24px_rgba(220,184,88,0.3)] hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer"
        >
          <span>Book a Strategy Call</span>
          <ArrowRight className="w-4 h-4 stroke-[2.2]" />
        </button>
        <Link
          href="/gallery"
          className="text-[11px] font-mono text-zinc-400 hover:text-white transition-colors"
        >
          Read client reviews →
        </Link>
      </div>
    </section>
  );
});
