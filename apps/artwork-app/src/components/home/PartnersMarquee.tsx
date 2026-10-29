"use client";

import React, { useState, useMemo, useCallback } from "react";
import Image from "next/image";
import { Sparkles } from "lucide-react";
import { DEFAULT_COMPANIES } from "@art-work/types";
import type { PartnerLogoCardProps, PartnersMarqueeProps } from "./types";

export const PartnerLogoCard = React.memo(function PartnerLogoCard({
  company,
  isSelected,
  onToggle,
  tiltDirection = "left",
}: PartnerLogoCardProps) {
  const hoverTilt = tiltDirection === "left" ? "hover:-rotate-1" : "hover:rotate-1";

  return (
    <div
      onClick={onToggle}
      className={`group relative flex items-center bg-white dark:bg-[#181824] border-2 border-black dark:border-zinc-700 p-1.5 rounded-2xl comic-shadow-sm transition-all duration-300 cursor-pointer shrink-0 select-none ${hoverTilt} ${
        isSelected
          ? "scale-105 -rotate-1 bg-yellow-50 dark:bg-[#222234] ring-2 ring-yellow-400 border-black dark:border-yellow-400 comic-shadow"
          : "hover:scale-105"
      }`}
    >
      {/* Tape decoration on selected / hover */}
      <div
        className={`absolute -top-2 left-3 w-8 h-3.5 bg-yellow-300/80 border border-black/30 -rotate-6 transition-opacity duration-200 pointer-events-none ${
          isSelected ? "opacity-100" : "opacity-0 group-hover:opacity-100"
        }`}
      ></div>

      {/* High-Impact Large Logo Box */}
      <div className="w-14 h-14 sm:w-16 sm:h-16 md:w-20 md:h-20 rounded-xl bg-white dark:bg-[#101018] overflow-hidden flex items-center justify-center p-1 border border-black/15 dark:border-white/10 shrink-0 shadow-inner">
        <Image
          src={company.logo}
          alt={company.name}
          width={80}
          height={80}
          className="w-full h-full object-contain transition-transform duration-300 group-hover:scale-110"
          unoptimized
        />
      </div>

      {/* Hidden by default -> Revealed smoothly on hover or click */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out flex flex-col justify-center ${
          isSelected
            ? "max-w-[260px] opacity-100 ml-2.5 sm:ml-3 pr-2"
            : "max-w-0 opacity-0 group-hover:max-w-[260px] group-hover:opacity-100 group-hover:ml-2.5 sm:group-hover:ml-3 group-hover:pr-2"
        }`}
      >
        <div className="whitespace-nowrap">
          <div className="font-headline font-black text-xs sm:text-sm text-black dark:text-white uppercase tracking-wider">
            {company.name}
          </div>
          <div className="flex items-center gap-1.5 mt-1">
            <span className="inline-block bg-yellow-400 text-black text-[9px] sm:text-[10px] font-headline font-black px-2 py-0.5 rounded border border-black comic-shadow-sm uppercase">
              {company.category}
            </span>
            {company.highlight && (
              <span className="text-[10px] font-mono text-black/60 dark:text-zinc-400 uppercase hidden sm:inline-block">
                • {company.highlight}
              </span>
            )}
          </div>
        </div>
      </div>
    </div>
  );
});

export const PartnersMarquee = React.memo(function PartnersMarquee({
  companies = DEFAULT_COMPANIES,
}: PartnersMarqueeProps) {
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);
  // In-Memory calculation memoization: divide and duplicate partner arrays exactly once per dataset
  const { marqueeRow1, marqueeRow2 } = useMemo(() => {
    const active = companies.filter((c) => c.isActive !== false);
    const row1Base = active.filter((_, idx) => idx % 2 === 0);
    const row2Base = active.filter((_, idx) => idx % 2 !== 0);

    const r1 = row1Base.length > 0 ? row1Base : active;
    const r2 = row2Base.length > 0 ? row2Base : active;

    const rep1 = Math.max(2, Math.ceil(8 / Math.max(1, r1.length)));
    const rep2 = Math.max(2, Math.ceil(8 / Math.max(1, r2.length)));

    const row1Half = Array.from({ length: rep1 }, () => r1).flat();
    const row2Half = Array.from({ length: rep2 }, () => r2).flat();

    return {
      marqueeRow1: [...row1Half, ...row1Half],
      marqueeRow2: [...row2Half, ...row2Half],
    };
  }, [companies]);

  const handleToggle = useCallback((id: string) => {
    setActiveCompanyId((prev) => (prev === id ? null : id));
  }, []);

  return (
    <div className="w-full mt-8 sm:mt-10 pt-6 sm:pt-8 border-t-2 border-black/10 dark:border-zinc-800">
      {/* Section Definition & Header */}
      <div className="relative flex flex-col sm:flex-row sm:items-center justify-between gap-3 mb-4 sm:mb-5">
        <div>
          <div className="inline-flex items-center gap-2 border-2 border-black bg-yellow-300 dark:bg-yellow-400 text-black px-3 py-1 rounded-full comic-shadow-sm font-headline text-[10px] sm:text-xs font-black uppercase tracking-wider -rotate-1 mb-2">
            <Sparkles className="w-3.5 h-3.5 fill-current" />
            <span>PARTNERS // TRUSTED ECOSYSTEM</span>
          </div>
          <h2 className="font-headline font-black text-lg sm:text-2xl lg:text-3xl text-black dark:text-white uppercase tracking-tight">
            TRUSTED BY <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-lg border-2 border-black comic-shadow-sm inline-block -rotate-1">CULTURAL TITANS</span> &amp; INDUSTRY LEADERS
          </h2>
        </div>

        {/* Comic Starburst with Scaling Pulse Animation */}
        <div className="flex items-center shrink-0">
          <div className="animate-star-pulse hidden sm:block">
            <div className="relative w-16 h-16 sm:w-20 sm:h-20 flex items-center justify-center">
              <svg
                className="w-full h-full fill-yellow-400 stroke-black stroke-2 drop-shadow-md"
                viewBox="0 0 100 100"
              >
                <polygon points="50,0 63,28 95,20 78,48 100,70 69,76 65,100 45,82 18,95 24,68 0,55 25,36 15,10 44,22"></polygon>
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 text-black font-headline font-black text-[8px] sm:text-[9px] uppercase leading-tight -rotate-6">
                <span>TOP TIER</span>
                <span className="bg-black text-white px-1 py-0.2 rounded-sm text-[7px]">TRUSTED</span>
                <span>PARTNERS</span>
              </div>
            </div>
          </div>
        </div>
      </div>

      {/* Dual Row Infinite Marquee Reel */}
      <div className="relative overflow-hidden rounded-2xl border-2 border-black dark:border-zinc-700 bg-zinc-50/70 dark:bg-[#12121A]/70 py-4 sm:py-5 backdrop-blur-sm">
        {/* Row 1: Left */}
        <div className="flex w-max gap-4 sm:gap-5 py-1 animate-marquee-left">
          {marqueeRow1.map((comp, idx) => (
            <PartnerLogoCard
              key={`${comp.id}-row1-${idx}`}
              company={comp}
              isSelected={activeCompanyId === comp.id}
              onToggle={() => handleToggle(comp.id)}
              tiltDirection="left"
            />
          ))}
        </div>

        {/* Row 2: Right */}
        <div className="flex w-max gap-4 sm:gap-5 py-1 mt-3 sm:mt-4 animate-marquee-right">
          {marqueeRow2.map((comp, idx) => (
            <PartnerLogoCard
              key={`${comp.id}-row2-${idx}`}
              company={comp}
              isSelected={activeCompanyId === comp.id}
              onToggle={() => handleToggle(comp.id)}
              tiltDirection="right"
            />
          ))}
        </div>
      </div>
    </div>
  );
});
