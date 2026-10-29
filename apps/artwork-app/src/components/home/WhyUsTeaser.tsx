"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowRight,
  Layers,
  CheckCircle2,
  Sparkles,
  Zap,
  Palette,
  Paintbrush,
  Compass,
} from "lucide-react";
import { KineticBrushWord } from "@/components/cinematic/KineticBrushStroke";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";
import { DEFAULT_WHY_US_CONTENT, type WhyUsTeaserProps } from "./types";

export const WhyUsTeaser = React.memo(function WhyUsTeaser({ content = DEFAULT_WHY_US_CONTENT }: WhyUsTeaserProps) {
  return (
    <div className="w-full max-w-7xl mx-auto pt-3 sm:pt-6 pb-6 flex flex-col justify-start">
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-2.5 mb-2.5 pb-1.5 border-b-2 border-black dark:border-zinc-700">
        <div>
          <div className="inline-flex items-center gap-1.5 bg-yellow-400 text-black px-3 py-1 border border-black comic-shadow-sm text-xs font-headline font-black uppercase mb-1">
            <span>{content.eyebrow}</span>
          </div>
          <h2 className="font-headline font-black text-xl sm:text-2xl lg:text-3xl text-black dark:text-white tracking-tight">
            <KineticBrushWord variant="double" color="var(--color-primary-yellow, #dcb858)" strokeWidth={2.4}>
              {content.headline}
            </KineticBrushWord>
          </h2>
        </div>
        <div className="flex items-center gap-2">
          <Link
            href="/why-us"
            className="inline-flex items-center gap-1.5 font-headline font-black text-xs uppercase bg-black dark:bg-yellow-400 text-white dark:text-black hover:bg-yellow-400 dark:hover:bg-yellow-300 hover:text-black px-4 py-2 rounded border border-black comic-shadow-sm transition-all"
          >
            <span>{content.exploreCtaText}</span>
            <ArrowRight className="w-4 h-4 stroke-[2.5]" />
          </Link>
        </div>
      </div>

      {/* 3 Bento Cards (Scaled ~5% for 15-inch Laptops) */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-2.5 sm:gap-3 mb-2.5 sm:mb-3">
        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, delay: 0, ease: [0.22, 1, 0.36, 1] }}
          className="border-2 border-black dark:border-zinc-700 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#151520] comic-shadow flex flex-col justify-between min-h-[175px] sm:min-h-[195px]"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-5 h-5 rounded-DEFAULT bg-yellow-400 text-black border border-black flex items-center justify-center font-headline font-black text-[11px] comic-shadow-sm">
                {content.bentoCards[0].number}
              </span>
              <Layers className="w-4 h-4 text-black dark:text-yellow-400 stroke-[1.75]" />
            </div>
            <h3 className="font-headline font-black text-sm sm:text-base text-black dark:text-white mb-1 uppercase">
              {content.bentoCards[0].title}
            </h3>
            <p className="font-body text-xs text-black/75 dark:text-zinc-300 leading-relaxed">
              {content.bentoCards[0].description}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-headline font-bold">
            <span className="bg-black text-white px-2 py-0.5 rounded">{content.bentoCards[0].badge}</span>
            <CheckCircle2 className="w-3.5 h-3.5 text-black dark:text-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="border-2 border-black dark:border-zinc-700 p-3.5 sm:p-4 rounded-xl bg-yellow-50 dark:bg-[#1B1B28] comic-shadow flex flex-col justify-between min-h-[175px] sm:min-h-[195px]"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-5 h-5 rounded-DEFAULT bg-yellow-400 text-black border border-black flex items-center justify-center font-headline font-black text-[11px] comic-shadow-sm">
                {content.bentoCards[1].number}
              </span>
              <Sparkles className="w-4 h-4 text-black dark:text-yellow-400 fill-yellow-400" />
            </div>
            <h3 className="font-headline font-black text-sm sm:text-base text-black dark:text-white mb-1 uppercase">
              {content.bentoCards[1].title}
            </h3>
            <p className="font-body text-xs text-black/75 dark:text-zinc-300 leading-relaxed">
              {content.bentoCards[1].description}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-headline font-bold">
            <span className="bg-yellow-400 text-black border border-black px-2 py-0.5 rounded">
              {content.bentoCards[1].badge}
            </span>
            <Zap className="w-3.5 h-3.5 text-black dark:text-yellow-400 fill-yellow-400" />
          </div>
        </motion.div>

        <motion.div
          initial={{ opacity: 0, y: 22, scale: 0.97 }}
          whileInView={{ opacity: 1, y: 0, scale: 1 }}
          viewport={{ once: true, amount: 0.12 }}
          transition={{ duration: 0.45, delay: 0.2, ease: [0.22, 1, 0.36, 1] }}
          className="border-2 border-black dark:border-zinc-700 p-3.5 sm:p-4 rounded-xl bg-white dark:bg-[#151520] comic-shadow flex flex-col justify-between min-h-[175px] sm:min-h-[195px]"
        >
          <div>
            <div className="flex items-center justify-between mb-1.5">
              <span className="w-5 h-5 rounded-DEFAULT bg-yellow-400 text-black border border-black flex items-center justify-center font-headline font-black text-[11px] comic-shadow-sm">
                {content.bentoCards[2].number}
              </span>
              <Palette className="w-4 h-4 text-black dark:text-yellow-400 stroke-[1.75]" />
            </div>
            <h3 className="font-headline font-black text-sm sm:text-base text-black dark:text-white mb-1 uppercase">
              {content.bentoCards[2].title}
            </h3>
            <p className="font-body text-xs text-black/75 dark:text-zinc-300 leading-relaxed">
              {content.bentoCards[2].description}
            </p>
          </div>
          <div className="pt-2 mt-2 border-t border-black/10 dark:border-white/10 flex items-center justify-between text-[10px] font-headline font-bold">
            <span className="bg-black text-white px-2 py-0.5 rounded">{content.bentoCards[2].badge}</span>
            <Paintbrush className="w-3.5 h-3.5 text-black dark:text-yellow-400" />
          </div>
        </motion.div>
      </div>

      {/* Blueprint Showcase Card */}
      <ScrollReveal direction="up" distance={20}>
        <div className="border-2 sm:border-3 border-black dark:border-zinc-700 rounded-xl p-3.5 sm:p-5 bg-white dark:bg-[#151520] comic-shadow relative">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-4 items-center">
            <div className="lg:col-span-6 space-y-1.5">
              <div className="inline-flex items-center gap-1.5 text-[11px] font-headline font-black uppercase text-black bg-yellow-300 px-2 py-0.5 rounded border border-black">
                <Compass className="w-3 h-3 text-black" />
                <span>{content.blueprint.badge}</span>
              </div>
              <h3 className="font-headline font-black text-base sm:text-lg text-black dark:text-white">
                {content.blueprint.title}
              </h3>
              <p className="font-body text-xs text-black/80 dark:text-zinc-300 leading-relaxed">
                {content.blueprint.description}
              </p>
            </div>
            <div className="lg:col-span-6 border-2 border-black dark:border-zinc-700 rounded-lg overflow-hidden aspect-[16/9] min-h-[160px] sm:min-h-[190px] lg:min-h-[220px] bg-white dark:bg-[#0E0E14] relative">
              <Image
                src={content.blueprint.image}
                alt={content.blueprint.altText}
                fill
                sizes="(max-width: 1024px) 100vw, 40vw"
                className="object-cover object-center"
              />
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
});
