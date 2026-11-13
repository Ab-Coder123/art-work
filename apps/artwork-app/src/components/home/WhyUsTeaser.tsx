"use client";

import React from "react";
import Image from "next/image";
import Link from "next/link";
import { motion } from "framer-motion";
import {
  ArrowUpRight,
  Layers,
  CheckCircle2,
  Sparkles,
  Zap,
  Palette,
  Compass,
  Flame,
  Award,
} from "lucide-react";
import { KineticBrushWord } from "@/components/cinematic/KineticBrushStroke";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";
import { DEFAULT_WHY_US_CONTENT, type WhyUsTeaserProps } from "./types";

const FEATURE_PILLARS = [
  {
    icon: Layers,
    title: "Complete Event Solutions",
    description: "From creative concepts to on-site management, we bring every element together under one connected team.",
    tag: "ONE TEAM",
  },
  {
    icon: Sparkles,
    title: "Custom Booths & Stages",
    description: "3D architectural visualization and turnkey fabrication tailored strictly to your brand presence.",
    tag: "BRAND BUILT",
  },
  {
    icon: Compass,
    title: "Precision in Every Detail",
    description: "Meticulous technical supervision, vendor coordination, and live cue accuracy with zero shortcuts.",
    tag: "METICULOUS",
  },
  {
    icon: Zap,
    title: "360° Live Delivery",
    description: "Flawless on-site execution, LED rigging, lighting synchronization, and guest experience management.",
    tag: "TURNKEY",
  },
];

export const WhyUsTeaser = React.memo(function WhyUsTeaser({
  content = DEFAULT_WHY_US_CONTENT,
}: WhyUsTeaserProps) {
  const cards =
    Array.isArray(content.bentoCards) && content.bentoCards.length > 0
      ? content.bentoCards
      : DEFAULT_WHY_US_CONTENT.bentoCards;

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 flex flex-col justify-start">
      {/* ================= SECTION HEADER ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 ring-b-1 ring-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcb858]/15 ring-1 ring-[#dcb858]/40 text-[#dcb858] text-[11px] font-mono font-bold uppercase tracking-wider mb-2.5">
            <Sparkles className="w-3 h-3 text-[#dcb858] fill-[#dcb858]" />
            <span>{content.eyebrow}</span>
          </div>
          <h2 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase">
            <KineticBrushWord variant="double" color="var(--color-primary-yellow, #dcb858)" strokeWidth={2.4}>
              {content.headline}
            </KineticBrushWord>
          </h2>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <Link
            href="/why-us"
            className="group inline-flex items-center gap-2 font-headline font-bold text-xs uppercase px-4 py-2.5 rounded-xl bg-white/5 hover:bg-[#dcb858] text-white hover:text-black ring-1 ring-white/15 hover:ring-[#dcb858] transition-all duration-200 cursor-pointer"
          >
            <span>{content.exploreCtaText}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </Link>
        </div>
      </div>

      {/* ================= 4-COLUMN SLEEK FEATURE STRIP (Page 1 Reference) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-3.5 sm:gap-4 mb-6">
        {FEATURE_PILLARS.map((pillar, idx) => {
          const Icon = pillar.icon;
          return (
            <motion.div
              key={pillar.title}
              initial={{ opacity: 0, y: 18 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.15 }}
              transition={{ duration: 0.4, delay: idx * 0.08, ease: [0.16, 1, 0.3, 1] }}
              className="p-5 rounded-2xl bg-[#0d0d15]/90 hover:bg-[#13131e]/90 ring-1 ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between group shadow-lg"
            >
              <div>
                <div className="flex items-center justify-between mb-3.5">
                  <div className="w-10 h-10 rounded-xl bg-[#dcb858]/10 ring-1 ring-[#dcb858]/30 flex items-center justify-center text-[#dcb858] group-hover:bg-[#dcb858] group-hover:text-black transition-colors duration-200">
                    <Icon className="w-5 h-5 stroke-[2.2]" />
                  </div>
                  <span className="text-[10px] font-mono font-bold tracking-wider uppercase px-2 py-0.5 rounded-full bg-white/5 text-zinc-400 ring-1 ring-white/10">
                    {pillar.tag}
                  </span>
                </div>
                <h3 className="font-headline font-bold text-sm sm:text-[15px] text-white mb-1.5 group-hover:text-[#dcb858] transition-colors">
                  {pillar.title}
                </h3>
                <p className="font-body text-xs text-zinc-400 leading-relaxed">
                  {pillar.description}
                </p>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================= BENTO CAPABILITIES & METHODOLOGY (Page 3 Reference) ================= */}
      <div className="grid grid-cols-1 md:grid-cols-3 gap-4 mb-6">
        {cards.map((card, idx) => {
          return (
            <motion.div
              key={`${card.number}-${idx}`}
              initial={{ opacity: 0, y: 20 }}
              whileInView={{ opacity: 1, y: 0 }}
              viewport={{ once: true, amount: 0.12 }}
              transition={{ duration: 0.45, delay: idx * 0.1, ease: [0.22, 1, 0.36, 1] }}
              className="p-5 sm:p-6 rounded-2xl bg-[#0e0e17]/80 hover:bg-[#141421]/90 ring-1 ring-white/10 hover:ring-[#dcb858]/50 transition-all duration-300 flex flex-col justify-between min-h-[190px] group shadow-xl"
            >
              <div>
                <div className="flex items-center justify-between mb-3">
                  <div className="flex items-center gap-2">
                    <span className="w-6 h-6 rounded-lg bg-[#dcb858] text-black font-mono font-black text-xs flex items-center justify-center">
                      {card.number}
                    </span>
                    <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-white/5 text-zinc-300 ring-1 ring-white/10">
                      {card.badge}
                    </span>
                  </div>
                  {idx === 0 ? (
                    <Layers className="w-4 h-4 text-[#dcb858] stroke-[2]" />
                  ) : idx === 1 ? (
                    <Sparkles className="w-4 h-4 text-[#dcb858] fill-[#dcb858]" />
                  ) : (
                    <Palette className="w-4 h-4 text-[#dcb858] stroke-[2]" />
                  )}
                </div>

                <h3 className="font-headline font-black text-sm sm:text-base text-white mb-2 uppercase group-hover:text-[#dcb858] transition-colors">
                  {card.title}
                </h3>
                <p className="font-body text-xs sm:text-[13px] text-zinc-400 leading-relaxed">
                  {card.description}
                </p>
              </div>

              <div className="pt-3 mt-3 ring-t-1 ring-white/10 flex items-center justify-between text-[11px] font-mono text-zinc-400">
                <span className="flex items-center gap-1.5 text-emerald-400">
                  <CheckCircle2 className="w-3.5 h-3.5 stroke-[2.5]" />
                  <span>Verified Execution</span>
                </span>
                <span className="text-[#dcb858] font-bold">STAGE 02</span>
              </div>
            </motion.div>
          );
        })}
      </div>

      {/* ================= BLUEPRINT ARCHITECTURE SHOWCASE (Page 3 Reference) ================= */}
      <ScrollReveal direction="up" distance={20}>
        <div className="rounded-2xl p-5 sm:p-7 bg-[#0b0b12] ring-1 ring-white/10 hover:ring-[#dcb858]/40 transition-all duration-300 shadow-2xl relative overflow-hidden">
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-center">
            <div className="lg:col-span-5 space-y-3">
              <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcb858]/15 ring-1 ring-[#dcb858]/40 text-[#dcb858] text-[11px] font-mono font-bold uppercase tracking-wider">
                <Compass className="w-3.5 h-3.5 text-[#dcb858]" />
                <span>{content.blueprint.badge}</span>
              </div>
              <h3 className="font-headline font-black text-lg sm:text-xl lg:text-2xl text-white tracking-tight leading-snug">
                {content.blueprint.title}
              </h3>
              <p className="font-body text-xs sm:text-sm text-zinc-300 leading-relaxed">
                {content.blueprint.description}
              </p>

              <div className="pt-2 flex flex-wrap items-center gap-3 text-xs font-mono text-zinc-400">
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Award className="w-3.5 h-3.5 text-[#dcb858]" />
                  <span>100% Tailored CAD</span>
                </div>
                <div className="flex items-center gap-1.5 px-2.5 py-1 rounded-lg bg-white/5 ring-1 ring-white/10">
                  <Flame className="w-3.5 h-3.5 text-[#dcb858]" />
                  <span>Rapid 72h Scenography</span>
                </div>
              </div>
            </div>

            <div className="lg:col-span-7 rounded-xl overflow-hidden aspect-[16/9] min-h-[200px] sm:min-h-[240px] lg:min-h-[280px] bg-[#07070a] ring-1 ring-white/15 relative group">
              <Image
                src={content.blueprint.image}
                alt={content.blueprint.altText}
                fill
                sizes="(max-width: 1024px) 100vw, 55vw"
                className="object-cover object-center group-hover:scale-105 transition-transform duration-700"
                unoptimized={
                  content.blueprint.image.startsWith("http") ||
                  content.blueprint.image.startsWith("data:")
                }
              />
              <div className="absolute inset-0 bg-gradient-to-t from-black/80 via-transparent to-transparent pointer-events-none"></div>
              <div className="absolute bottom-3 left-3 px-3 py-1.5 rounded-lg bg-black/80 backdrop-blur-md ring-1 ring-[#dcb858]/60 text-xs font-mono font-bold text-[#dcb858] flex items-center gap-2">
                <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse"></span>
                <span>ARCHITECTURAL PROJECTION ACTIVE</span>
              </div>
            </div>
          </div>
        </div>
      </ScrollReveal>
    </div>
  );
});
