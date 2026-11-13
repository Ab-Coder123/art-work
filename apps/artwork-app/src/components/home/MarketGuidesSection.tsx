"use client";

import React from "react";
import Link from "next/link";
import { motion } from "framer-motion";
import { ArrowRight, MapPin } from "lucide-react";

export const MarketGuidesSection = React.memo(function MarketGuidesSection() {
  return (
    <section
      aria-label="Regional Market Guides"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
      id="market-guides"
    >
      {/* Header (Matching Image Section 8) */}
      <div className="flex flex-col items-center text-center max-w-3xl mx-auto mb-8 sm:mb-12">
        <h2 className="font-headline font-black text-2xl sm:text-4xl text-zinc-900 dark:text-white tracking-tight leading-tight mb-3">
          Event & Production Agency in{" "}
          <span className="text-[#dcb858] drop-shadow-[0_2px_20px_rgba(220,184,88,0.25)]">
            Egypt & Saudi Arabia
          </span>
        </h2>
        <p className="font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed max-w-2xl">
          Art Work runs turnkey production, custom booth fabrication, and live stage execution
          for brands in Cairo, Riyadh, and across MENA. Start with our market playbooks.
        </p>
      </div>

      {/* 2 Regional Guide Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 gap-5 sm:gap-6">
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0d0d15]/90 hover:bg-zinc-50 dark:hover:bg-[#13131f]/95 ring-1 ring-black/10 dark:ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg dark:shadow-xl"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcb858]/15 ring-1 ring-[#dcb858]/30 text-[#dcb858] text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
              <MapPin className="w-3 h-3" />
              <span>Egypt</span>
            </div>
            <h3 className="font-headline font-bold text-lg sm:text-xl text-zinc-900 dark:text-white mb-2 group-hover:text-[#dcb858] transition-colors">
              Best Event & Exhibition Agencies in Egypt (2026)
            </h3>
            <p className="font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              How to evaluate turnkey production partners in Cairo and Giza: engineering specs,
              fabrication quality, load-bearing rigging calculations, and verified venue licensing.
            </p>
          </div>

          <Link
            href="/why-us"
            className="inline-flex items-center gap-2 text-xs font-headline font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-[#dcb858] transition-colors uppercase tracking-wider group-hover:translate-x-1 duration-200"
          >
            <span>Read the guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.16, 1, 0.3, 1] }}
          className="p-6 sm:p-7 rounded-2xl bg-white dark:bg-[#0d0d15]/90 hover:bg-zinc-50 dark:hover:bg-[#13131f]/95 ring-1 ring-black/10 dark:ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg dark:shadow-xl"
        >
          <div>
            <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-[#dcb858]/15 ring-1 ring-[#dcb858]/30 text-[#dcb858] text-[10px] font-mono font-bold uppercase tracking-wider mb-4">
              <MapPin className="w-3 h-3" />
              <span>Saudi Arabia</span>
            </div>
            <h3 className="font-headline font-bold text-lg sm:text-xl text-zinc-900 dark:text-white mb-2 group-hover:text-[#dcb858] transition-colors">
              Exhibition Booth & Stage Costs in Saudi Arabia (2026)
            </h3>
            <p className="font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed mb-6">
              What custom pavilion fabrication and synchronized AV staging cost across Riyadh,
              Jeddah, and Dammam, and how to optimize your regional event budget.
            </p>
          </div>

          <Link
            href="/why-us"
            className="inline-flex items-center gap-2 text-xs font-headline font-bold text-zinc-700 dark:text-zinc-300 group-hover:text-[#dcb858] transition-colors uppercase tracking-wider group-hover:translate-x-1 duration-200"
          >
            <span>Read the guide</span>
            <ArrowRight className="w-3.5 h-3.5" />
          </Link>
        </motion.div>
      </div>
    </section>
  );
});
