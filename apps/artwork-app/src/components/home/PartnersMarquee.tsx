"use client";

import React, { useState, useMemo } from "react";
import Image from "next/image";
import { Sparkles, ChevronDown } from "lucide-react";
import { DEFAULT_COMPANIES } from "@art-work/types";
import type { PartnerLogoCardProps, PartnersMarqueeProps } from "./types";

export const PartnerLogoCard = React.memo(function PartnerLogoCard({
  company,
  isSelected,
  onToggle,
}: PartnerLogoCardProps) {
  return (
    <div
      onClick={onToggle}
      className={`group relative flex items-center px-4.5 py-3 rounded-xl bg-white dark:bg-white/[0.03] hover:bg-zinc-50 dark:hover:bg-white/[0.08] ring-1 ring-black/10 dark:ring-white/10 hover:ring-[#dcb858]/50 shadow-sm dark:shadow-none transition-all duration-300 cursor-pointer shrink-0 select-none ${
        isSelected
          ? "scale-105 bg-zinc-100 dark:bg-white/10 ring-1 ring-[#dcb858] shadow-[0_0_20px_rgba(220,184,88,0.25)]"
          : ""
      }`}
    >
      {/* High-Impact Logo Box (+10% scale for higher brand presence) */}
      <div className="w-[54px] h-[45px] sm:w-[72px] sm:h-[54px] relative flex items-center justify-center shrink-0 opacity-80 group-hover:opacity-100 transition-opacity">
        <Image
          src={company.logo}
          alt={company.name}
          width={80}
          height={56}
          className="w-full h-full object-contain filter grayscale group-hover:grayscale-0 transition-all duration-300"
          unoptimized
        />
      </div>

      {/* Revealed on selection or hover */}
      <div
        className={`overflow-hidden transition-all duration-300 ease-out flex flex-col justify-center ${
          isSelected
            ? "max-w-[220px] opacity-100 ml-3 pr-1"
            : "max-w-0 opacity-0 group-hover:max-w-[220px] group-hover:opacity-100 group-hover:ml-3 group-hover:pr-1"
        }`}
      >
        <div className="whitespace-nowrap">
          <div className="font-headline font-bold text-xs text-zinc-900 dark:text-white uppercase tracking-wider">
            {company.name}
          </div>
          <div className="flex items-center gap-1.5 mt-0.5">
            <span className="text-[10px] font-mono text-[#dcb858] font-bold uppercase">
              {company.category}
            </span>
            {company.highlight && (
              <span className="text-[10px] font-mono text-zinc-500 dark:text-zinc-400 uppercase hidden sm:inline-block">
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
  partnersBadge = "PARTNERS",
  partnersHeadlinePrefix = "TRUSTED BY",
  partnersHeadlineHighlight = "INDUSTRY LEADERS",
  starburstText = { top: "TOP TIER", middle: "TRUSTED", bottom: "PARTNERS" },
}: PartnersMarqueeProps) {
  const [activeCompanyId, setActiveCompanyId] = useState<string | null>(null);

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

  return (
    <section
      aria-label="Partner Brand Network"
      className="relative w-full overflow-hidden py-4 sm:py-6"
    >
      {/* EKO-Style Section Header: SELECTED CLIENTS // SCROLL TO DISCOVER */}
      <div className="w-full flex flex-col items-center justify-center text-center mb-6">
        <div className="inline-flex items-center gap-1.5 px-3.5 py-1 rounded-full bg-zinc-100 dark:bg-white/5 ring-1 ring-zinc-300 dark:ring-white/10 text-[11px] font-mono font-bold tracking-widest text-zinc-700 dark:text-zinc-300 uppercase mb-1">
          <Sparkles className="w-3 h-3 text-[#dcb858]" />
          <span>{partnersBadge} • {partnersHeadlinePrefix}</span>{" "}
          <span className="text-[#dcb858] font-black">{partnersHeadlineHighlight}</span>
        </div>
        <div className="flex items-center gap-1 text-[10px] font-mono tracking-widest text-zinc-500 dark:text-zinc-400 uppercase">
          <span>{`${starburstText.top} • SCROLL TO DISCOVER`}</span>
          <ChevronDown className="w-3 h-3 animate-bounce text-[#dcb858]" />
        </div>
      </div>

      {/* Marquee Row 1 */}
      <div className="relative w-full overflow-hidden mask-fade-x py-1.5">
        <div className="flex gap-4 w-max animate-marquee-left hover:[animation-play-state:paused]">
          {marqueeRow1.map((company, index) => (
            <PartnerLogoCard
              key={`row1-${company.id}-${index}`}
              company={company}
              isSelected={activeCompanyId === company.id}
              onToggle={() =>
                setActiveCompanyId((prev) => (prev === company.id ? null : company.id))
              }
            />
          ))}
        </div>
      </div>

      {/* Marquee Row 2 (Reversed) */}
      <div className="relative w-full overflow-hidden mask-fade-x py-1.5 mt-2">
        <div className="flex gap-4 w-max animate-marquee-right hover:[animation-play-state:paused]">
          {marqueeRow2.map((company, index) => (
            <PartnerLogoCard
              key={`row2-${company.id}-${index}`}
              company={company}
              isSelected={activeCompanyId === company.id}
              onToggle={() =>
                setActiveCompanyId((prev) => (prev === company.id ? null : company.id))
              }
            />
          ))}
        </div>
      </div>
    </section>
  );
});
