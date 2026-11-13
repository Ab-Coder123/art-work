"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Paintbrush,
  Compass,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Send,
  Layers,
  Monitor,
  Printer,
  Gift,
  Camera,
  Users,
  Truck,
  Building,
  ArrowUpRight,
  X,
} from "lucide-react";
import type { ServicesSectionContent, ServiceDisciplineItem } from "@art-work/types";
import { DEFAULT_SITE_CONTENT } from "@art-work/database/content/default-content";
import { KineticBrushWord } from "@/components/cinematic/KineticBrushStroke";

const renderDisciplineIcon = (icon: string, className = "w-5 h-5 text-[#dcb858]") => {
  switch (icon) {
    case "brush":
      return <Paintbrush className={className} />;
    case "compass":
      return <Compass className={className} />;
    case "architecture":
      return <Building className={className} />;
    case "terminal":
      return <Layers className={className} />;
    case "bolt":
      return <Zap className={className} />;
    case "videocam":
      return <Monitor className={className} />;
    case "campaign":
      return <Printer className={className} />;
    case "sparkles":
      return <Sparkles className={className} />;
    case "gift":
      return <Gift className={className} />;
    case "camera":
      return <Camera className={className} />;
    case "users":
      return <Users className={className} />;
    case "truck":
      return <Truck className={className} />;
    default:
      return <ArrowUpRight className={className} />;
  }
};

export type ServiceCategory = "all" | "creative" | "events" | "production" | "delivery";
export type Discipline = ServiceDisciplineItem;

interface ServiceCardProps {
  discipline: Discipline;
  index: number;
  onSelect: (discipline: Discipline) => void;
}

const ServiceCard: React.FC<ServiceCardProps> = ({
  discipline,
  index,
  onSelect,
}) => {
  return (
    <motion.div
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{ duration: 0.4, delay: (index % 4) * 0.08, ease: [0.16, 1, 0.3, 1] }}
      onClick={() => onSelect(discipline)}
      className="p-6 rounded-2xl bg-[#0d0d15]/90 hover:bg-[#13131f]/95 ring-1 ring-white/10 hover:ring-[#dcb858]/60 transition-all duration-300 group cursor-pointer flex flex-col justify-between shadow-xl min-h-[260px] relative overflow-hidden"
    >
      <div>
        {/* Top Header: Title and Arrow ↗ */}
        <div className="flex items-start justify-between gap-3 mb-3">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-[#dcb858]/10 ring-1 ring-[#dcb858]/30 flex items-center justify-center shrink-0 group-hover:bg-[#dcb858] transition-colors duration-200">
              {renderDisciplineIcon(discipline.icon, "w-5 h-5 text-[#dcb858] group-hover:text-black transition-colors stroke-[2]")}
            </div>
            <div>
              <span className="font-mono text-[10px] text-zinc-500 uppercase tracking-wider block">
                {discipline.tag}
              </span>
              <h3 className="font-headline font-bold text-base sm:text-lg text-white group-hover:text-[#dcb858] transition-colors leading-snug">
                {discipline.title}
              </h3>
            </div>
          </div>
          <div className="w-8 h-8 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center text-zinc-400 group-hover:text-black group-hover:bg-[#dcb858] group-hover:ring-[#dcb858] transition-all duration-200 shrink-0 mt-0.5">
            <ArrowUpRight className="w-4 h-4 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </div>
        </div>

        {/* Middle: Clean Description */}
        <p className="font-body text-xs sm:text-[13px] text-zinc-400 leading-relaxed mb-4 line-clamp-3">
          {discipline.description}
        </p>
      </div>

      {/* Bottom: Spec Pills (Page 2 Reference) */}
      <div>
        <div className="flex flex-wrap gap-1.5 pt-3 ring-t-1 ring-white/10">
          {(discipline.specs || []).slice(0, 3).map((spec, sIdx) => (
            <span
              key={sIdx}
              className="text-[10px] font-mono px-2 py-0.5 rounded-md bg-white/5 ring-1 ring-white/10 text-zinc-300"
            >
              {spec}
            </span>
          ))}
        </div>
      </div>
    </motion.div>
  );
};

export interface Capabilities3DMatrixProps {
  content?: ServicesSectionContent;
}

export const Capabilities3DMatrix: React.FC<Capabilities3DMatrixProps> = ({
  content = DEFAULT_SITE_CONTENT.services,
}) => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [activeFilter, setActiveFilter] = useState<ServiceCategory>("all");

  const disciplines =
    Array.isArray(content.disciplines) && content.disciplines.length > 0
      ? content.disciplines
      : DEFAULT_SITE_CONTENT.services.disciplines;

  const navigateToBrief = (e: React.MouseEvent) => {
    e.preventDefault();
    setSelectedDiscipline(null);
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("artwork:navigate-stage", { detail: { stage: "stage-04" } })
      );
      if (window.location.hash !== "#stage-04") {
        window.history.pushState(null, "", "#stage-04");
      }
    }
  };

  const filteredDisciplines = disciplines.filter((d) =>
    activeFilter === "all" ? true : d.category === activeFilter
  );

  const getCategoryCount = (cat: ServiceCategory) => {
    if (cat === "all") return disciplines.length;
    return disciplines.filter((d) => d.category === cat).length;
  };

  const filterTabs: { key: ServiceCategory; label: string }[] = [
    { key: "all", label: `${content.filterAllLabel} (${getCategoryCount("all")})` },
    { key: "creative", label: `${content.filterCreativeLabel} (${getCategoryCount("creative")})` },
    { key: "events", label: `${content.filterEventsLabel} (${getCategoryCount("events")})` },
    { key: "production", label: `${content.filterProductionLabel} (${getCategoryCount("production")})` },
    { key: "delivery", label: `${content.filterDeliveryLabel} (${getCategoryCount("delivery")})` },
  ];

  return (
    <section
      className="w-full max-w-[1480px] mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 relative"
      id="stage-03"
    >
      {/* ================= SECTION HEADER (Page 2 Reference) ================= */}
      <div className="flex flex-col md:flex-row md:items-end justify-between gap-4 mb-6 pb-4 ring-b-1 ring-white/10">
        <div>
          <div className="inline-flex items-center gap-2 px-3 py-1 rounded-full bg-[#dcb858]/15 ring-1 ring-[#dcb858]/40 text-[#dcb858] text-[11px] font-mono font-bold uppercase tracking-wider mb-2">
            <Compass className="w-3 h-3 text-[#dcb858]" />
            <span>{content.eyebrow}</span>
          </div>
          <h2 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-white tracking-tight uppercase">
            {content.headlinePrefix}{" "}
            <KineticBrushWord variant="double" color="var(--color-primary-yellow, #dcb858)" strokeWidth={2.4}>
              {content.headlineHighlight}
            </KineticBrushWord>
          </h2>
          <p className="font-body text-xs sm:text-sm text-zinc-400 max-w-2xl mt-1.5 leading-relaxed">
            {content.description}
          </p>
        </div>

        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={navigateToBrief}
            className="group inline-flex items-center gap-2 font-headline font-bold text-xs uppercase px-4 py-2.5 rounded-xl bg-[#dcb858] text-black hover:bg-[#e6c975] transition-all duration-200 cursor-pointer shadow-md"
          >
            <span>{content.cardCtaText || "VIEW DELIVERABLES"}</span>
            <ArrowUpRight className="w-3.5 h-3.5 group-hover:translate-x-0.5 group-hover:-translate-y-0.5 transition-transform" />
          </button>
        </div>
      </div>

      {/* ================= FILTER PILLS (Page 2 Reference) ================= */}
      <div className="flex flex-wrap items-center gap-2 mb-6">
        {filterTabs.map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-4 py-2 rounded-xl font-headline text-xs font-bold tracking-wider transition-all cursor-pointer ${
              activeFilter === tab.key
                ? "bg-[#dcb858] text-black font-black shadow-md ring-1 ring-[#dcb858]"
                : "bg-[#0f0f18] text-zinc-300 hover:text-white hover:bg-[#161622] ring-1 ring-white/10"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* ================= SERVICE CARDS GRID (Page 2 Reference) ================= */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-8">
        {filteredDisciplines.map((d, index) => (
          <ServiceCard
            key={d.id}
            discipline={d}
            index={index}
            onSelect={(discipline) => setSelectedDiscipline(discipline)}
          />
        ))}
      </div>

      {/* ================= HIGHLIGHT BANNER (Page 2 Reference Bottom) ================= */}
      <div className="rounded-2xl p-6 sm:p-8 bg-[#0a0a10] ring-1 ring-white/10 hover:ring-[#dcb858]/40 transition-all duration-300 relative overflow-hidden flex flex-col sm:flex-row sm:items-center justify-between gap-5">
        <div className="space-y-1.5 max-w-2xl">
          <span className="font-mono text-[10px] tracking-wider uppercase px-2 py-0.5 rounded bg-[#dcb858]/15 text-[#dcb858] ring-1 ring-[#dcb858]/30 font-bold">
            {content.bannerEyebrow || "PLANNING A BRAND EVENT OR EXHIBITION?"}
          </span>
          <h3 className="font-headline font-black text-lg sm:text-xl text-white tracking-tight">
            {content.bannerHeadlinePrefix || "BRING YOUR STAGE VISION TO"}{" "}
            <span className="text-[#dcb858]">
              {content.bannerHeadlineHighlight || "LIFE."}
            </span>
          </h3>
          <p className="font-body text-xs text-zinc-400">
            {content.bannerDescription || "We coordinate 3D booth fabrication, LED screens, sound systems, and on-site operations under one connected team."}
          </p>
        </div>

        <button
          onClick={navigateToBrief}
          className="group inline-flex items-center gap-2 px-5 py-3 rounded-xl bg-white/5 hover:bg-[#dcb858] text-white hover:text-black ring-1 ring-white/20 hover:ring-[#dcb858] font-headline font-black text-xs uppercase tracking-wider transition-all duration-200 cursor-pointer shrink-0"
        >
          <span>{content.bannerCtaText || "START EVENT BRIEF"}</span>
          <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
        </button>
      </div>

      {/* ================= INSPECTOR MODAL ================= */}
      <AnimatePresence>
        {selectedDiscipline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/80 backdrop-blur-md p-4"
            onClick={() => setSelectedDiscipline(null)}
          >
            <motion.div
              initial={{ scale: 0.94, y: 15 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.94, y: 15 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              className="bg-[#0f0f18] ring-1 ring-white/20 rounded-2xl max-w-2xl w-full p-6 sm:p-7 shadow-2xl relative"
              onClick={(e) => e.stopPropagation()}
            >
              <div className="flex items-start justify-between mb-4">
                <div className="flex items-center gap-3">
                  <div className="w-12 h-12 rounded-xl bg-[#dcb858]/15 ring-1 ring-[#dcb858]/40 flex items-center justify-center text-[#dcb858]">
                    {renderDisciplineIcon(selectedDiscipline.icon, "w-6 h-6 text-[#dcb858] stroke-[2.2]")}
                  </div>
                  <div>
                    <span className="font-mono text-xs text-[#dcb858] uppercase font-bold tracking-wider">
                      {selectedDiscipline.tag}
                    </span>
                    <h3 className="font-headline font-black text-xl text-white">
                      {selectedDiscipline.title}
                    </h3>
                  </div>
                </div>
                <button
                  onClick={() => setSelectedDiscipline(null)}
                  className="w-8 h-8 rounded-full bg-white/5 hover:bg-white/10 ring-1 ring-white/10 flex items-center justify-center text-zinc-400 hover:text-white transition-colors cursor-pointer"
                >
                  <X className="w-4 h-4" />
                </button>
              </div>

              <p className="font-body text-xs sm:text-sm text-zinc-300 mb-5 leading-relaxed">
                {selectedDiscipline.description}
              </p>

              {/* Deliverables List */}
              <div className="space-y-3 mb-6">
                <h4 className="font-mono text-xs font-bold text-zinc-400 uppercase tracking-wider">
                  Verified Deliverables &amp; Specifications
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {(selectedDiscipline.deliverables || selectedDiscipline.specs || []).map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 p-2.5 rounded-lg bg-white/5 ring-1 ring-white/10 text-xs font-mono text-zinc-200"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-emerald-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              {/* Metric & CTA Footer */}
              <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-4 ring-t-1 ring-white/10">
                <div className="text-xs font-mono text-zinc-400">
                  Turnaround: <strong className="text-[#dcb858]">{selectedDiscipline.metrics || "Concept to Delivery"}</strong>
                </div>
                <button
                  onClick={navigateToBrief}
                  className="inline-flex items-center justify-center gap-2 px-5 py-2.5 rounded-xl bg-[#dcb858] text-black font-headline font-black text-xs uppercase tracking-wider hover:bg-[#e6c975] transition-all cursor-pointer shadow-md"
                >
                  <span>{content.modalSelectCtaText || "Select in Brief"}</span>
                  <Send className="w-3.5 h-3.5" />
                </button>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>
    </section>
  );
};
