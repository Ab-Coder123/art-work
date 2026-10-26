"use client";

import React, { useState, useEffect } from "react";
import Image from "next/image";
import Link from "next/link";
import { motion, AnimatePresence } from "framer-motion";
import {
  ArrowRight,
  ExternalLink,
  Sparkles,
  Layers,
  ChevronDown,
  ShieldCheck,
  Award,
  Zap,
} from "lucide-react";
import { ThemeToggle } from "@/components/cinematic/ThemeToggle";
import { SoundToggle } from "@/components/cinematic/SoundToggle";
import { MagneticButton } from "@/components/cinematic/MagneticButton";
import { ContactStage } from "@/components/cinematic/ContactStage";
import { type CompanyRecord, type CompanyCategorySlug, DEFAULT_COMPANIES } from "@art-work/types";

const SECTORS: { slug: CompanyCategorySlug; label: string }[] = [
  { slug: "all", label: "All Sectors" },
  { slug: "pharma", label: "Pharma & Health" },
  { slug: "entertainment", label: "Entertainment" },
  { slug: "festivals", label: "Festivals" },
  { slug: "tech", label: "Tech & Telecom" },
  { slug: "real_estate", label: "Real Estate" },
];

export default function CompanyPage() {
  const [companies, setCompanies] = useState<CompanyRecord[]>(DEFAULT_COMPANIES);
  const [selectedSector, setSelectedSector] = useState<CompanyCategorySlug>("all");
  const [isMarqueePaused, setIsMarqueePaused] = useState(false);

  useEffect(() => {
    async function loadCompanies() {
      try {
        const res = await fetch("/api/companies");
        const json = await res.json();
        if (json.ok && Array.isArray(json.data) && json.data.length > 0) {
          setCompanies(json.data);
        }
      } catch {
        // Fallback to default
      }
    }
    loadCompanies();
  }, []);

  const filteredCompanies = companies.filter((c) => {
    if (selectedSector === "all") return true;
    return c.category === selectedSector;
  });

  // Duplicate for seamless infinite marquee loop
  const marqueeRow1 = [...companies, ...companies];
  const marqueeRow2 = [...companies.slice().reverse(), ...companies.slice().reverse()];

  return (
    <div className="min-h-screen bg-white dark:bg-[#0D0D12] text-black dark:text-white selection:bg-yellow-400 selection:text-black overflow-x-hidden transition-colors duration-200">
      {/* Background Dot Grid */}
      <div className="fixed inset-0 bg-dot-grid pointer-events-none z-0"></div>

      {/* ================= HEADER NAVIGATION ================= */}
      <header className="fixed top-0 left-0 w-full z-40 bg-white/95 dark:bg-[#0D0D12]/95 backdrop-blur-md border-b border-black/10 dark:border-white/10 transition-colors duration-200">
        <div className="flex justify-between items-center w-full px-4 sm:px-6 max-w-7xl mx-auto py-1.5 sm:py-2">
          {/* Logo Anchor */}
          <Link
            href="/"
            className="group flex items-center gap-2 cursor-pointer active:scale-95 transition-transform"
            title="Art Work — Home"
          >
            <div className="relative w-12 h-12 sm:w-16 sm:h-16 md:w-[72px] md:h-[72px] lg:w-20 lg:h-20 hover:rotate-3 transition-transform">
              <Image
                src="/assets/images/artwork_logo.png"
                alt="Art Work Logo"
                fill
                sizes="(max-width: 640px) 48px, (max-width: 768px) 64px, 80px"
                priority
                className="object-contain"
              />
            </div>
          </Link>

          {/* Desktop Navigation Links (Sticker Buttons) */}
          <nav className="hidden md:flex items-center gap-2 font-headline text-xs uppercase tracking-wider font-bold">
            <Link
              href="/"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Home
            </Link>

            {/* Active Link: Company */}
            <span className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-yellow-400 text-black border-black comic-shadow-sm rotate-1 scale-105 z-10 font-black">
              Company
            </span>

            <Link
              href="/why-us"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Why Us
            </Link>

            <Link
              href="/#stage-03"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Services
            </Link>

            <Link
              href="/gallery"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 -rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Gallery
            </Link>

            <a
              href="#contact"
              className="inline-flex items-center justify-center px-3 py-1.5 rounded-lg border-2 bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-black/80 dark:border-zinc-500 comic-shadow-sm hover:bg-yellow-200 dark:hover:bg-[#252538] hover:text-black dark:hover:text-yellow-300 hover:-translate-y-0.5 rotate-1 transition-all duration-150 cursor-pointer active:translate-x-0.5 active:translate-y-0.5 active:shadow-none"
            >
              Contact
            </a>

            <Link
              href="/gallery"
              className="inline-flex items-center gap-1 bg-yellow-300 dark:bg-yellow-400 text-black font-headline font-black text-xs uppercase px-3 py-1.5 rounded-lg border-2 border-black comic-shadow-sm hover:bg-yellow-400 hover:-translate-y-0.5 hover:-rotate-1 active:translate-x-0.5 active:translate-y-0.5 active:shadow-none transition-all ml-1 cursor-pointer"
            >
              ★ Full Vault ↗
            </Link>
          </nav>

          {/* Trailing Primary Actions */}
          <div className="flex items-center gap-2 sm:gap-2.5">
            <ThemeToggle />
            <SoundToggle />

            <MagneticButton soundType="pop">
              <a
                href="#contact"
                className="inline-flex items-center gap-1.5 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-bold text-xs px-2.5 sm:px-3.5 py-1.5 rounded-DEFAULT border-2 border-black comic-shadow-sm hover:translate-x-0.5 hover:translate-y-0.5 hover:shadow-none active:scale-95 transition-all duration-150 cursor-pointer"
              >
                <span>Brief Inquiry</span>
                <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
              </a>
            </MagneticButton>
          </div>
        </div>

        {/* Mobile Stage Navigation Pill Strip */}
        <div className="md:hidden flex items-center justify-start gap-2 px-3 py-2 bg-yellow-50/95 dark:bg-[#12121A]/95 border-t border-black/10 dark:border-white/10 overflow-x-auto no-scrollbar">
          <Link
            href="/"
            className="px-3 py-1.5 rounded-lg text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm whitespace-nowrap"
          >
            Home
          </Link>
          <span className="px-3 py-1.5 rounded-lg text-[10px] font-headline font-black uppercase tracking-wider bg-yellow-400 text-black border-2 border-black comic-shadow-sm -rotate-1 whitespace-nowrap">
            Company
          </span>
          <Link
            href="/why-us"
            className="px-3 py-1.5 rounded-lg text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm whitespace-nowrap"
          >
            Why Us
          </Link>
          <Link
            href="/#stage-03"
            className="px-3 py-1.5 rounded-lg text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm whitespace-nowrap"
          >
            Services
          </Link>
          <Link
            href="/gallery"
            className="px-3 py-1.5 rounded-lg text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm whitespace-nowrap"
          >
            Gallery
          </Link>
          <a
            href="#contact"
            className="px-3 py-1.5 rounded-lg text-[10px] font-headline font-bold uppercase tracking-wider bg-white dark:bg-[#181824] text-black dark:text-zinc-200 border-2 border-black/80 dark:border-zinc-600 comic-shadow-sm whitespace-nowrap"
          >
            Contact
          </a>
        </div>
      </header>

      {/* ================= HERO INTRO SECTION ================= */}
      <section className="relative z-10 pt-32 sm:pt-36 pb-12 sm:pb-16 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col items-center text-center space-y-4 max-w-4xl mx-auto">
          {/* Top Badge Sticker */}
          <motion.div
            initial={{ opacity: 0, y: -10 }}
            animate={{ opacity: 1, y: 0 }}
            className="inline-flex items-center gap-2 border-2 border-black bg-yellow-300 dark:bg-yellow-400 text-black px-3.5 py-1 rounded-full comic-shadow-sm font-headline text-xs font-black uppercase tracking-wider -rotate-1"
          >
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>CLIENT NETWORK &amp; GLOBAL PARTNERSHIPS</span>
          </motion.div>

          {/* Main Headline */}
          <motion.h1
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1, duration: 0.5 }}
            className="font-headline font-black text-3xl sm:text-5xl lg:text-6xl text-black dark:text-white uppercase tracking-tight leading-[1.08]"
          >
            TRUSTED BY <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-lg border-2 border-black comic-shadow-sm inline-block -rotate-1">CULTURAL TITANS</span> &amp; INDUSTRY LEADERS.
          </motion.h1>

          {/* Subtitle */}
          <motion.p
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.2, duration: 0.5 }}
            className="font-body text-sm sm:text-base text-black/70 dark:text-zinc-300 max-w-2xl leading-relaxed pt-1"
          >
            From landmark corporate gatherings to international festival arenas and high-voltage product launches, we translate brand prestige into arena-scale kinetic architecture.
          </motion.p>

          {/* CTA Buttons */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3, duration: 0.5 }}
            className="flex flex-wrap items-center justify-center gap-3 pt-4"
          >
            <a
              href="#partners-grid"
              className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-yellow-300 text-black font-headline font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl border-2 border-black comic-shadow active:scale-95 transition-all cursor-pointer"
            >
              <span>EXPLORE ALL PARTNERS</span>
              <ChevronDown className="w-4 h-4" />
            </a>
            <a
              href="#contact"
              className="inline-flex items-center gap-2 bg-white dark:bg-[#181824] hover:bg-black hover:text-white dark:hover:bg-yellow-400 dark:hover:text-black text-black dark:text-white font-headline font-bold text-xs sm:text-sm px-5 py-2.5 rounded-xl border-2 border-black comic-shadow-sm active:scale-95 transition-all cursor-pointer"
            >
              <span>SUBMIT INQUIRY BRIEF</span>
              <ArrowRight className="w-4 h-4" />
            </a>
          </motion.div>
        </div>
      </section>

      {/* ================= DUAL-ROW INFINITE ANIMATED LOGO MARQUEE ================= */}
      <section
        className="relative z-10 py-6 overflow-hidden border-y-2 border-black dark:border-zinc-800 bg-zinc-50 dark:bg-[#12121A]"
        onMouseEnter={() => setIsMarqueePaused(true)}
        onMouseLeave={() => setIsMarqueePaused(false)}
      >
        <div className="max-w-7xl mx-auto px-4 mb-3 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <span className="w-2.5 h-2.5 rounded-full bg-emerald-500 animate-pulse"></span>
            <span className="font-headline font-bold text-xs uppercase tracking-wider text-black/70 dark:text-zinc-400">
              KINETIC CLIENT REEL // 60 FPS TICKER
            </span>
          </div>
          <span className="text-[10px] font-mono text-zinc-400 hidden sm:inline-block">
            {isMarqueePaused ? "PAUSED ON HOVER" : "HOVER TO PAUSE &amp; INSPECT"}
          </span>
        </div>

        {/* Row 1: Left to Right */}
        <div className="flex w-max gap-4 py-2 animate-marquee-left">
          {marqueeRow1.map((comp, idx) => (
            <div
              key={`${comp.id}-row1-${idx}`}
              className="flex items-center gap-3 bg-white dark:bg-[#181824] border-2 border-black dark:border-zinc-700 px-4 py-2 rounded-xl comic-shadow-sm hover:scale-105 hover:-rotate-1 transition-transform cursor-pointer shrink-0"
            >
              <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/10 overflow-hidden flex items-center justify-center p-1 border border-black/20 relative">
                <Image
                  src={comp.logo}
                  alt={comp.name}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover rounded"
                  unoptimized
                />
              </div>
              <div className="text-left">
                <div className="font-headline font-black text-xs text-black dark:text-white uppercase tracking-wider">
                  {comp.name}
                </div>
                <div className="text-[10px] font-mono font-bold text-yellow-600 dark:text-yellow-400 uppercase">
                  {comp.category}
                </div>
              </div>
            </div>
          ))}
        </div>

        {/* Row 2: Right to Left */}
        <div className="flex w-max gap-4 py-2 mt-2 animate-marquee-right">
          {marqueeRow2.map((comp, idx) => (
            <div
              key={`${comp.id}-row2-${idx}`}
              className="flex items-center gap-3 bg-white dark:bg-[#181824] border-2 border-black dark:border-zinc-700 px-4 py-2 rounded-xl comic-shadow-sm hover:scale-105 hover:rotate-1 transition-transform cursor-pointer shrink-0"
            >
              <div className="w-9 h-9 rounded-lg bg-black/5 dark:bg-white/10 overflow-hidden flex items-center justify-center p-1 border border-black/20 relative">
                <Image
                  src={comp.logo}
                  alt={comp.name}
                  width={36}
                  height={36}
                  className="w-full h-full object-cover rounded"
                  unoptimized
                />
              </div>
              <div className="text-left">
                <div className="font-headline font-black text-xs text-black dark:text-white uppercase tracking-wider">
                  {comp.name}
                </div>
                <div className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase">
                  {comp.highlight || comp.category}
                </div>
              </div>
            </div>
          ))}
        </div>
      </section>

      {/* ================= PROOF METRICS BENTO STRIP ================= */}
      <section className="relative z-10 py-12 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="grid grid-cols-2 md:grid-cols-4 gap-3 sm:gap-4">
          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161622] border-2 border-black dark:border-zinc-700 comic-shadow-sm text-center">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black mx-auto mb-2">
              <Award className="w-4 h-4" />
            </div>
            <div className="font-headline font-black text-2xl sm:text-3xl text-black dark:text-white">
              85+
            </div>
            <div className="text-[11px] font-mono uppercase font-bold text-black/60 dark:text-zinc-400 mt-0.5">
              Enterprise Brands
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161622] border-2 border-black dark:border-zinc-700 comic-shadow-sm text-center">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black mx-auto mb-2">
              <Layers className="w-4 h-4" />
            </div>
            <div className="font-headline font-black text-2xl sm:text-3xl text-black dark:text-white">
              450+
            </div>
            <div className="text-[11px] font-mono uppercase font-bold text-black/60 dark:text-zinc-400 mt-0.5">
              Arena Stages Built
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161622] border-2 border-black dark:border-zinc-700 comic-shadow-sm text-center">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black mx-auto mb-2">
              <Zap className="w-4 h-4" />
            </div>
            <div className="font-headline font-black text-2xl sm:text-3xl text-black dark:text-white">
              99.4%
            </div>
            <div className="text-[11px] font-mono uppercase font-bold text-black/60 dark:text-zinc-400 mt-0.5">
              Cue Accuracy Standard
            </div>
          </div>

          <div className="p-4 sm:p-5 rounded-2xl bg-white dark:bg-[#161622] border-2 border-black dark:border-zinc-700 comic-shadow-sm text-center">
            <div className="w-8 h-8 rounded-lg bg-yellow-400 text-black flex items-center justify-center font-black mx-auto mb-2">
              <ShieldCheck className="w-4 h-4" />
            </div>
            <div className="font-headline font-black text-2xl sm:text-3xl text-black dark:text-white">
              1.2M+
            </div>
            <div className="text-[11px] font-mono uppercase font-bold text-black/60 dark:text-zinc-400 mt-0.5">
              Live Footprint Reach
            </div>
          </div>
        </div>
      </section>

      {/* ================= INTERACTIVE SECTOR FILTER & BENTO GRID ================= */}
      <section id="partners-grid" className="relative z-10 py-8 px-4 sm:px-6 max-w-7xl mx-auto">
        <div className="flex flex-col sm:flex-row sm:items-end justify-between gap-4 border-b-2 border-black dark:border-zinc-700 pb-4 mb-8">
          <div>
            <div className="font-mono text-xs font-bold uppercase text-yellow-600 dark:text-yellow-400">
              EXPLORE OUR NETWORK
            </div>
            <h2 className="font-headline font-black text-2xl sm:text-4xl uppercase text-black dark:text-white mt-1">
              PARTNER DIRECTORY &amp; COLLABORATIONS
            </h2>
          </div>

          {/* Sector Filter Strip */}
          <div className="flex items-center gap-1.5 overflow-x-auto pb-1 no-scrollbar">
            {SECTORS.map((sector) => (
              <button
                key={sector.slug}
                onClick={() => setSelectedSector(sector.slug)}
                className={`px-3 py-1.5 rounded-lg text-xs font-headline font-bold uppercase tracking-wider transition-all cursor-pointer whitespace-nowrap border-2 ${
                  selectedSector === sector.slug
                    ? "bg-yellow-400 text-black border-black comic-shadow-sm font-black -rotate-1"
                    : "bg-white dark:bg-[#181824] text-black/70 dark:text-zinc-300 border-black/30 dark:border-zinc-700 hover:border-black dark:hover:border-white"
                }`}
              >
                {sector.label}
              </button>
            ))}
          </div>
        </div>

        {/* Company Cards Grid */}
        <motion.div layout className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
          <AnimatePresence>
            {filteredCompanies.map((comp) => (
              <motion.div
                key={comp.id}
                layout
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                transition={{ duration: 0.25 }}
                className="group bg-white dark:bg-[#161622] border-2 border-black dark:border-zinc-700 rounded-2xl p-5 comic-shadow hover:-translate-y-1 hover:rotate-0.5 transition-all flex flex-col justify-between"
              >
                <div>
                  {/* Card Top: Logo + Badges */}
                  <div className="flex items-start justify-between gap-3 mb-4">
                    <div className="w-14 h-14 rounded-xl bg-black/5 dark:bg-white/10 border-2 border-black dark:border-zinc-600 overflow-hidden flex items-center justify-center p-1.5 shrink-0 group-hover:scale-105 transition-transform relative">
                      <Image
                        src={comp.logo}
                        alt={comp.name}
                        width={56}
                        height={56}
                        className="w-full h-full object-cover rounded-lg"
                        unoptimized
                      />
                    </div>
                    <div className="flex flex-col items-end gap-1">
                      <span className="text-[10px] font-headline font-black uppercase tracking-wider px-2.5 py-0.5 rounded-full bg-yellow-300 dark:bg-yellow-400 text-black border border-black">
                        {comp.category}
                      </span>
                      {comp.featured && (
                        <span className="text-[9px] font-mono uppercase bg-black text-yellow-400 px-1.5 py-0.5 rounded">
                          ★ Key Partner
                        </span>
                      )}
                    </div>
                  </div>

                  {/* Company Name */}
                  <h3 className="font-headline font-black text-lg sm:text-xl uppercase text-black dark:text-white tracking-tight group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
                    {comp.name}
                  </h3>

                  {/* Highlight */}
                  {comp.highlight && (
                    <div className="inline-block mt-1 font-headline font-bold text-xs text-yellow-700 dark:text-yellow-400 bg-yellow-50 dark:bg-yellow-950/40 px-2 py-0.5 rounded border border-yellow-400/40">
                      ⚡ {comp.highlight}
                    </div>
                  )}

                  {/* Description */}
                  <p className="font-body text-xs text-black/70 dark:text-zinc-300 leading-relaxed mt-3">
                    {comp.description}
                  </p>
                </div>

                {/* Card Bottom: Website Link */}
                <div className="pt-4 mt-4 border-t border-black/10 dark:border-zinc-800 flex items-center justify-between">
                  <span className="text-[10px] font-mono text-zinc-400">
                    STAGE_ID: {comp.slug}
                  </span>
                  {comp.websiteUrl ? (
                    <a
                      href={comp.websiteUrl}
                      target="_blank"
                      rel="noreferrer"
                      className="inline-flex items-center gap-1 font-headline font-bold text-xs uppercase text-black dark:text-white hover:text-yellow-600 dark:hover:text-yellow-400 transition-colors"
                    >
                      <span>Visit Site</span>
                      <ExternalLink className="w-3 h-3 stroke-[2.5]" />
                    </a>
                  ) : (
                    <span className="text-[10px] font-mono text-zinc-500">Corporate Account</span>
                  )}
                </div>
              </motion.div>
            ))}
          </AnimatePresence>
        </motion.div>
      </section>

      {/* ================= INTEGRATED CONTACT STAGE COMPONENT ================= */}
      <section className="relative z-10 border-t-2 border-black dark:border-zinc-800 mt-12 bg-yellow-50/40 dark:bg-[#101018]">
        <ContactStage id="contact" />
      </section>

      {/* ================= STUDIO FOOTER ================= */}
      <footer className="w-full py-4 bg-white/95 dark:bg-[#0D0D12]/95 text-black dark:text-white border-t border-black/10 dark:border-white/10 z-30 transition-colors duration-200">
        <div className="flex flex-col sm:flex-row justify-between items-center px-4 sm:px-6 max-w-7xl mx-auto text-[10px] text-black/70 dark:text-zinc-400 font-mono gap-2 sm:gap-0">
          <div>© 2026 Art Work - Marketing Solutions. Client Network &amp; Company Showcase.</div>
          <div className="flex items-center gap-4 font-headline font-bold flex-wrap justify-center">
            <Link href="/" className="hover:text-black dark:hover:text-yellow-400 hover:underline">
              HOME
            </Link>
            <Link href="/company" className="text-yellow-600 dark:text-yellow-400 underline decoration-yellow-400 font-black">
              COMPANY
            </Link>
            <Link href="/why-us" className="hover:text-black dark:hover:text-yellow-400 hover:underline">
              WHY US
            </Link>
            <Link href="/gallery" className="hover:text-black dark:hover:text-yellow-400 hover:underline">
              GALLERY
            </Link>
            <a href="#contact" className="hover:text-black dark:hover:text-yellow-400 hover:underline">
              CONTACT
            </a>
          </div>
        </div>
      </footer>
    </div>
  );
}
