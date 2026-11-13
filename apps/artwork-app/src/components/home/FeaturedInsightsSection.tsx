"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import { Sparkles, ArrowRight } from "lucide-react";

export const FeaturedInsightsSection = React.memo(function FeaturedInsightsSection() {
  return (
    <section
      aria-label="Featured Industry Insights"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-8 sm:py-12"
      id="insights"
    >
      {/* Eyebrow */}
      <div className="mb-6">
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-zinc-300 text-xs font-mono font-bold tracking-wider uppercase">
          <Sparkles className="w-3.5 h-3.5 text-[#dcb858]" />
          <span>Featured Insights</span>
        </div>
      </div>

      {/* 2 Big Feature Cards (Matching Image Section 3) */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        {/* Card 1 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl p-6 sm:p-7 bg-[#0b0b12] ring-1 ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
        >
          <div>
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-5 relative bg-[#060609] ring-1 ring-white/10">
              <Image
                src="/assets/images/blueprint_stage_scenography.webp"
                alt="Top-Ranked Event Studios in Egypt 2026"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 saturate-125"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md ring-1 ring-[#dcb858]/50 text-[10px] font-mono font-bold text-[#dcb858] uppercase">
                INDUSTRY POWER LIST
              </div>
            </div>

            <h3 className="font-headline font-bold text-lg sm:text-xl text-white mb-2 group-hover:text-[#dcb858] transition-colors leading-snug">
              Top-Ranked Event & Scenography Studios in Egypt 2026
            </h3>
            <p className="font-body text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
              The definitive 2026 power list of Egypt&apos;s premier exhibition, spatial architecture, and
              turnkey event production studios — scored on verified capability depth and zero-delay execution.
            </p>
          </div>

          <Link
            href="/why-us"
            className="inline-flex items-center gap-2 text-xs font-headline font-bold text-[#dcb858] hover:text-yellow-300 transition-colors uppercase tracking-wider group-hover:translate-x-1 duration-200"
          >
            <span>Read the ranking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        {/* Card 2 */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="rounded-2xl p-6 sm:p-7 bg-[#0b0b12] ring-1 ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-xl"
        >
          <div>
            <div className="aspect-[16/9] w-full rounded-xl overflow-hidden mb-5 relative bg-[#060609] ring-1 ring-white/10">
              <Image
                src="/assets/images/creative_chief_intake.webp"
                alt="Top Turnkey & 360° Live Production Agencies 2026"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-500 filter brightness-90 saturate-125"
                unoptimized
              />
              <div className="absolute inset-0 bg-gradient-to-t from-[#0b0b12] via-transparent to-transparent pointer-events-none" />
              <div className="absolute top-3 left-3 px-2.5 py-1 rounded-md bg-black/70 backdrop-blur-md ring-1 ring-[#dcb858]/50 text-[10px] font-mono font-bold text-[#dcb858] uppercase">
                MENA PRODUCTION REPORT
              </div>
            </div>

            <h3 className="font-headline font-bold text-lg sm:text-xl text-white mb-2 group-hover:text-[#dcb858] transition-colors leading-snug">
              Top Digital & 360° Production Agencies 2026
            </h3>
            <p className="font-body text-xs sm:text-sm text-zinc-400 leading-relaxed mb-6">
              MENA&apos;s full-funnel live event benchmark — custom booth engineering, DMX lighting orchestration,
              4K LED show direction, and AI-powered spatial media under one roof.
            </p>
          </div>

          <Link
            href="/gallery"
            className="inline-flex items-center gap-2 text-xs font-headline font-bold text-[#dcb858] hover:text-yellow-300 transition-colors uppercase tracking-wider group-hover:translate-x-1 duration-200"
          >
            <span>Read the ranking</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});
