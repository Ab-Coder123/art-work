"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, Calendar, Clock } from "lucide-react";

export const LatestInsightsBlogSection = React.memo(function LatestInsightsBlogSection() {
  return (
    <section
      aria-label="Latest Articles and Publications"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
      id="blog"
    >
      {/* Header (Matching Image Section 9) */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-8">
        <div>
          <h2 className="font-headline font-black text-2xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight leading-tight">
            Latest from{" "}
            <span className="text-[#dcb858] drop-shadow-[0_2px_20px_rgba(220,184,88,0.25)]">
              Art Work
            </span>
          </h2>
          <p className="font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 mt-1.5 leading-relaxed">
            Industry insights, production engineering playbooks, and the latest stage innovations from our studio.
          </p>
        </div>

        <Link
          href="/why-us"
          className="inline-flex items-center gap-1.5 text-xs font-headline font-bold text-zinc-700 dark:text-zinc-300 hover:text-[#dcb858] transition-colors uppercase tracking-wider shrink-0"
        >
          <span>View all articles</span>
          <ArrowRight className="w-3.5 h-3.5" />
        </Link>
      </div>

      {/* Grid: 1 Large Left Card + 2 Stacked Right Cards */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 sm:gap-6">
        {/* Big Featured Left Card */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-7 rounded-2xl p-6 sm:p-7 bg-white dark:bg-[#0d0d15]/90 hover:bg-zinc-50 dark:hover:bg-[#13131f]/95 ring-1 ring-black/10 dark:ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg dark:shadow-xl"
        >
          <div>
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-5 relative bg-[#060609] ring-1 ring-white/10">
              <Image
                src="/assets/images/blueprint_stage_scenography.webp"
                alt="Logistics & Mega-Exhibitions in MENA 2026"
                fill
                sizes="(max-width: 1024px) 100vw, 60vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 saturate-125"
                unoptimized
              />
              <div className="absolute top-3 left-3 flex items-center gap-2">
                <span className="px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md ring-1 ring-white/20 text-[10px] font-mono text-zinc-300 uppercase">
                  Featured
                </span>
                <span className="px-2.5 py-1 rounded-md bg-[#dcb858] text-black text-[10px] font-mono font-bold uppercase">
                  ANNUAL REPORT
                </span>
              </div>
            </div>

            <h3 className="font-headline font-bold text-xl sm:text-2xl text-zinc-900 dark:text-white mb-2.5 group-hover:text-[#dcb858] transition-colors leading-snug">
              Logistics, Ports & Mega-Exhibitions in MENA 2026: Visualizing Trade, Capacity & Connectivity
            </h3>
            <p className="font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              How port operators, logistics groups, and free zones design interactive exhibition pavilions
              that make complex supply chains, port depth, and infrastructure expansion immediately obvious.
            </p>
          </div>

          <div className="flex items-center gap-4 text-[11px] font-mono text-zinc-500 dark:text-zinc-400">
            <span className="flex items-center gap-1.5">
              <Calendar className="w-3.5 h-3.5 text-[#dcb858]" />
              <span>Oct 11, 2026</span>
            </span>
            <span className="flex items-center gap-1.5">
              <Clock className="w-3.5 h-3.5 text-[#dcb858]" />
              <span>2 min read</span>
            </span>
          </div>
        </motion.div>

        {/* 2 Stacked Right Cards */}
        <div className="lg:col-span-5 flex flex-col gap-5 sm:gap-6">
          {/* Top Small Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-5 bg-white dark:bg-[#0d0d15]/90 hover:bg-zinc-50 dark:hover:bg-[#13131f]/95 ring-1 ring-black/10 dark:ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg dark:shadow-xl flex-1"
          >
            <div>
              <div className="text-[10px] font-mono text-[#dcb858] uppercase tracking-wider mb-2 font-bold">
                ANNUAL REPORT
              </div>
              <h4 className="font-headline font-bold text-base sm:text-lg text-zinc-900 dark:text-white mb-2 group-hover:text-[#dcb858] transition-colors leading-snug">
                Insurance & Takaful Annual Summit Design in the GCC & Egypt 2026
              </h4>
              <p className="font-body text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                Architecture, guest zoning, and synchronized LED keynote stages designed for major financial summits.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
              <span>Oct 11, 2026</span>
              <span>•</span>
              <span>2 min read</span>
            </div>
          </motion.div>

          {/* Bottom Small Card */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            whileInView={{ opacity: 1, y: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.15, ease: [0.16, 1, 0.3, 1] }}
            className="rounded-2xl p-5 bg-white dark:bg-[#0d0d15]/90 hover:bg-zinc-50 dark:hover:bg-[#13131f]/95 ring-1 ring-black/10 dark:ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg dark:shadow-xl flex-1"
          >
            <div>
              <div className="text-[10px] font-mono text-[#dcb858] uppercase tracking-wider mb-2 font-bold">
                ANNUAL REPORT
              </div>
              <h4 className="font-headline font-bold text-base sm:text-lg text-zinc-900 dark:text-white mb-2 group-hover:text-[#dcb858] transition-colors leading-snug">
                Healthcare & Pharma Congress Production in MENA 2026
              </h4>
              <p className="font-body text-xs text-zinc-600 dark:text-zinc-400 line-clamp-2 leading-relaxed mb-4">
                Specialized compliance, sterile booth fabrication, and clinical breakout AV staging.
              </p>
            </div>
            <div className="flex items-center gap-3 text-[10px] font-mono text-zinc-500 dark:text-zinc-400">
              <span>Oct 11, 2026</span>
              <span>•</span>
              <span>2 min read</span>
            </div>
          </motion.div>
        </div>
      </div>
    </section>
  );
});
