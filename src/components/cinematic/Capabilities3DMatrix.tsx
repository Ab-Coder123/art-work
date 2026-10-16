"use client";

import React, { useState, useRef, useCallback } from "react";
import { motion, AnimatePresence } from "framer-motion";
import {
  Zap,
  Paintbrush,
  Megaphone,
  Terminal,
  Compass,
  Video,
  CheckCircle2,
  ArrowRight,
  Sparkles,
  Send,
  ArrowUpRight,
} from "lucide-react";
import { KineticBrushWord } from "@/components/cinematic/KineticBrushStroke";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";

const renderDisciplineIcon = (icon: string) => {
  switch (icon) {
    case "bolt":
      return <Zap className="w-3.5 h-3.5 text-black" />;
    case "brush":
      return <Paintbrush className="w-3.5 h-3.5 text-black" />;
    case "campaign":
      return <Megaphone className="w-3.5 h-3.5 text-black" />;
    case "terminal":
      return <Terminal className="w-3.5 h-3.5 text-black" />;
    case "architecture":
      return <Compass className="w-3.5 h-3.5 text-black" />;
    case "videocam":
      return <Video className="w-3.5 h-3.5 text-black" />;
    default:
      return <ArrowUpRight className="w-3.5 h-3.5 text-black" />;
  }
};

export interface Discipline {
  id: string;
  number: string;
  tag: string;
  title: string;
  icon: string;
  category: "stage" | "motion" | "craft" | "tech";
  specs: string[];
  description: string;
  deliverables: string[];
  metrics: string;
}

const DISCIPLINES: Discipline[] = [
  {
    id: "motion-designer",
    number: "01",
    tag: "01 / STAGE",
    title: "MOTION DESIGNER",
    icon: "bolt",
    category: "motion",
    specs: [
      "3D Stage Animation",
      "Kinetic Type Systems",
      "Showreel Editing",
      "Particle Sim FX",
    ],
    description:
      "Engineers 60 FPS arena-scale motion graphics, realtime reactive Notch shaders, and monolithic LED broadcast packages.",
    deliverables: [
      "Unreal Engine / Notch Live Shaders",
      "4K/8K Pre-rendered Stage Visuals",
      "Dynamic Audio-Reactive Loops",
      "DMX Timecode Synchronized Loops",
    ],
    metrics: "60 FPS Frame-Locked Fidelity",
  },
  {
    id: "graphic-designer",
    number: "02",
    tag: "02 / CRAFT",
    title: "GRAPHIC DESIGNER",
    icon: "brush",
    category: "craft",
    specs: [
      "Visual Architecture",
      "Custom Typography",
      "Vector Doodle Systems",
      "Print Collateral",
    ],
    description:
      "Draws bespoke tactile vector illustrations, marker lettering, VIP pass laminates, and total multi-platform identity systems.",
    deliverables: [
      "Custom Hand-Drawn Doodle Suite",
      "Event Credential & Lanyard Design",
      "OOH Stadium Billboard Packages",
      "Brand Guidelines & Asset Systems",
    ],
    metrics: "100% Custom Non-Stock Vectors",
  },
  {
    id: "content-creator",
    number: "03",
    tag: "03 / STORY",
    title: "CONTENT CREATOR",
    icon: "video_camera_front",
    category: "motion",
    specs: [
      "Viral Social Narratives",
      "High-Contrast Reels",
      "Creator Collaboration",
      "Micro-Docs",
    ],
    description:
      "Captures raw backstage intensity and transforms live events into viral multi-platform social moments with organic reach.",
    deliverables: [
      "Rapid Same-Day Vertical Cuts (9:16)",
      "Cinematic 4K Behind-The-Scenes Docs",
      "High-Engagement Micro-Hooks",
      "Press Release Media Kits",
    ],
    metrics: "+340% Organic Reach Spike",
  },
  {
    id: "art-director",
    number: "04",
    tag: "04 / VISION",
    title: "ART DIRECTOR",
    icon: "visibility",
    category: "stage",
    specs: [
      "Stage Choreography",
      "Visual Symphonies",
      "Moodboard Physics",
      "Style Guides",
    ],
    description:
      "Unifies scenography, lighting palettes, talent wardrobe, and spatial staging into an iconic, cohesive visual spectacle.",
    deliverables: [
      "Comprehensive Scenography Moodboards",
      "Lighting & Palette Show Books",
      "Spatial Layout & Sightline Guides",
      "Creative Brief Directives",
    ],
    metrics: "Zero Aesthetic Compromise",
  },
  {
    id: "experiential-led",
    number: "05",
    tag: "05 / TECH",
    title: "EXPERIENTIAL & LED",
    icon: "tune",
    category: "tech",
    specs: [
      "Curved LED Walls",
      "Holographic Mesh",
      "CNC Fabrication",
      "Sensor Interactivity",
    ],
    description:
      "Builds physical-digital hybrid architecture: transparent LED stages, LiDAR sensor interactivity, and bespoke booth structures.",
    deliverables: [
      "1.5mm Pixel-Pitch Curved Walls",
      "Holographic Gauze 3D Projections",
      "LiDAR Audience Tracking Systems",
      "German-Spec CNC Millwork Rigs",
    ],
    metrics: "7680Hz Broadcast-Safe Refresh",
  },
];

// Interactive 3D Tilt Card Component with Specular Light Beam
const TiltCard: React.FC<{
  discipline: Discipline;
  index: number;
  onSelect: (d: Discipline) => void;
}> = ({ discipline, index, onSelect }) => {
  const cardRef = useRef<HTMLDivElement>(null);
  const [rotateX, setRotateX] = useState(0);
  const [rotateY, setRotateY] = useState(0);
  const [glarePos, setGlarePos] = useState({ x: 50, y: 50, opacity: 0 });

  const handleMouseMove = useCallback((e: React.MouseEvent<HTMLDivElement>) => {
    if (!cardRef.current) return;
    const rect = cardRef.current.getBoundingClientRect();
    const x = e.clientX - rect.left;
    const y = e.clientY - rect.top;

    const centerX = rect.width / 2;
    const centerY = rect.height / 2;

    const rX = ((y - centerY) / centerY) * -10;
    const rY = ((x - centerX) / centerX) * 10;

    setRotateX(rX);
    setRotateY(rY);
    setGlarePos({
      x: (x / rect.width) * 100,
      y: (y / rect.height) * 100,
      opacity: 0.25,
    });
  }, []);

  const handleMouseLeave = useCallback(() => {
    setRotateX(0);
    setRotateY(0);
    setGlarePos((prev) => ({ ...prev, opacity: 0 }));
  }, []);

  return (
    <motion.div
      initial={{ opacity: 0, y: 24, scale: 0.96 }}
      whileInView={{ opacity: 1, y: 0, scale: 1 }}
      viewport={{ once: true, amount: 0.12 }}
      transition={{
        duration: 0.45,
        delay: (index % 5) * 0.08,
        ease: [0.22, 1, 0.36, 1],
      }}
      className="h-full flex flex-col"
    >
      <div
        ref={cardRef}
        onMouseMove={handleMouseMove}
        onMouseLeave={handleMouseLeave}
        onClick={() => onSelect(discipline)}
        style={{
          transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
          transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
        }}
        className="relative border-2 border-black dark:border-zinc-700 p-2.5 sm:p-3 rounded-lg bg-white dark:bg-[#15151F] comic-shadow dark:shadow-[4px_4px_0px_#000000] hover:comic-shadow-yellow hover:bg-yellow-50 dark:hover:bg-[#1D1D2B] transition-colors duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group select-none flex-1"
      >
        {/* Dynamic Specular Glare Overlay */}
        <div
          className="pointer-events-none absolute inset-0 transition-opacity duration-300"
          style={{
            background: `radial-gradient(circle at ${glarePos.x}% ${glarePos.y}%, rgba(250, 204, 21, 0.45) 0%, transparent 60%)`,
            opacity: glarePos.opacity,
          }}
        />

        <div className="relative z-10">
          <div className="flex items-center justify-between mb-1">
            <span className="font-headline font-black text-[9px] text-black/50 dark:text-zinc-400">
              {discipline.tag}
            </span>
            <span className="w-4 h-4 rounded-full bg-black text-yellow-400 font-mono text-[8px] font-black flex items-center justify-center">
              {discipline.number}
            </span>
          </div>

          <div className="font-headline font-black text-xs sm:text-sm text-black dark:text-white mb-1 group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
            {discipline.title}
          </div>

          <ul className="text-[10px] font-body text-black/80 dark:text-zinc-300 space-y-0.5 list-disc list-inside">
            {discipline.specs.map((spec, i) => (
              <li key={i}>{spec}</li>
            ))}
          </ul>
        </div>

        <div className="relative z-10 mt-2 pt-1.5 border-t border-black/20 dark:border-zinc-700 font-headline font-black text-[9px] text-black dark:text-zinc-200 flex items-center justify-between">
          <span className="group-hover:underline decoration-yellow-400 decoration-2">
            ENGAGE TOOLKIT
          </span>
          <span className="group-hover:translate-x-1 group-hover:scale-125 transition-transform text-black dark:text-yellow-400 flex items-center justify-center">
            {renderDisciplineIcon(discipline.icon)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const Capabilities3DMatrix: React.FC = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "stage" | "motion" | "craft" | "tech">("all");

  const filteredDisciplines = DISCIPLINES.filter((d) =>
    activeFilter === "all" ? true : d.category === activeFilter
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-1 relative" id="stage-03">
      {/* Section Header */}
      <ScrollReveal direction="up" distance={15} className="text-center max-w-2xl mx-auto mb-2">
        <div className="inline-block bg-yellow-400 text-black px-2.5 py-0.5 border border-black comic-shadow-sm font-headline text-[9px] font-black uppercase mb-1 -rotate-1">
          03 CAPABILITIES &amp; 3D MATRIX
        </div>
        <h2 className="font-headline font-black text-xl sm:text-2xl text-black dark:text-white tracking-tight mb-0.5 uppercase">
          Interactive Discipline{" "}
          <KineticBrushWord variant="double" color="#dcb858" strokeWidth={2.2}>
            Roster.
          </KineticBrushWord>
        </h2>
        <p className="font-body text-[11px] text-black/70 dark:text-zinc-400">
          Tilt in 3D or click any discipline card below to inspect technical delivery specs and arena toolkits.
        </p>
      </ScrollReveal>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-2.5">
        {(
          [
            { key: "all", label: "ALL DISCIPLINES" },
            { key: "stage", label: "ARENA & STAGE" },
            { key: "motion", label: "KINETIC MOTION" },
            { key: "craft", label: "BRAND CRAFT" },
            { key: "tech", label: "EXPERIENTIAL TECH" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-2.5 py-0.5 rounded-full font-headline text-[9px] font-bold uppercase tracking-wider border border-black dark:border-zinc-700 transition-all cursor-pointer ${
              activeFilter === tab.key
                ? "bg-yellow-400 text-black comic-shadow-sm scale-105 font-black"
                : "bg-white dark:bg-[#15151F] text-black/70 dark:text-zinc-300 hover:bg-yellow-100 dark:hover:bg-[#1E1E2C]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3D Tilt Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-2.5">
        {filteredDisciplines.map((d, index) => (
          <TiltCard
            key={d.id}
            discipline={d}
            index={index}
            onSelect={(discipline) => setSelectedDiscipline(discipline)}
          />
        ))}
      </div>

      {/* Expanded Toolkit Inspector Modal / Lightbox */}
      <AnimatePresence>
        {selectedDiscipline && (
          <motion.div
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            exit={{ opacity: 0 }}
            className="fixed inset-0 z-50 flex items-center justify-center bg-black/60 backdrop-blur-sm p-4"
            onClick={() => setSelectedDiscipline(null)}
          >
            <motion.div
              initial={{ scale: 0.9, y: 20 }}
              animate={{ scale: 1, y: 0 }}
              exit={{ scale: 0.9, y: 20 }}
              transition={{ type: "spring", stiffness: 350, damping: 25 }}
              onClick={(e) => e.stopPropagation()}
              className="bg-white dark:bg-[#15151F] border-4 border-black dark:border-zinc-600 rounded-2xl p-6 sm:p-8 max-w-2xl w-full comic-shadow dark:shadow-[8px_8px_0px_#000000] relative text-black dark:text-white"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDiscipline(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-yellow-400 hover:bg-black hover:text-white dark:hover:bg-yellow-300 dark:hover:text-black text-black border-2 border-black font-black flex items-center justify-center transition-colors cursor-pointer"
                aria-label="Close dialog"
              >
                ✕
              </button>

              <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 border-2 border-black font-mono text-xs font-black uppercase mb-4">
                <span>{selectedDiscipline.tag}</span>
                <span>•</span>
                <span>{selectedDiscipline.metrics}</span>
              </div>

              <h3 className="font-headline font-black text-2xl sm:text-3xl text-black dark:text-white mb-3">
                {selectedDiscipline.title}
              </h3>

              <p className="font-body text-sm sm:text-base text-black/80 dark:text-zinc-300 mb-6 leading-relaxed">
                {selectedDiscipline.description}
              </p>

              <div className="border-t-2 border-black/10 dark:border-white/10 pt-4 mb-6">
                <h4 className="font-headline font-bold text-xs uppercase text-black/60 dark:text-zinc-400 tracking-wider mb-3">
                  Production Deliverables &amp; Formats
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDiscipline.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-mono font-bold text-black dark:text-zinc-200 bg-yellow-50 dark:bg-[#1B1B26] border border-black/20 dark:border-zinc-700 p-2 rounded"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-yellow-600 dark:text-yellow-400 fill-yellow-400/20 stroke-black dark:stroke-yellow-400 shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-black/60 dark:text-zinc-400">
                  Ready for live arena integration
                </span>
                <a
                  href="#brief-inquiry"
                  onClick={() => setSelectedDiscipline(null)}
                  className="inline-flex items-center gap-2 bg-black dark:bg-yellow-400 text-white dark:text-black hover:bg-yellow-400 dark:hover:bg-yellow-300 hover:text-black font-headline font-bold text-xs px-5 py-2.5 rounded-lg border-2 border-black comic-shadow-sm transition-all"
                >
                  <span>Request Spec in Brief</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Live Idea Generation Banner Showcase */}
      <ScrollReveal direction="pop" distance={20} className="mt-3 sm:mt-4">
        <div className="bg-black dark:bg-[#14141E] text-white px-5 py-3 sm:py-3.5 rounded-lg border-2 border-black dark:border-zinc-700 comic-shadow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-3 sm:gap-4">
          <div className="relative z-10 max-w-xl text-left">
            <div className="flex items-center gap-1.5 mb-0.5 text-yellow-400 font-headline font-black text-[9px] tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>PROPRIETARY KINETIC STAGE WORKFLOW</span>
            </div>
            <h3 className="font-headline font-black text-base sm:text-lg tracking-tight mb-0.5">
              HAVE A TOUGH{" "}
              <KineticBrushWord variant="wave" color="#facc15" strokeWidth={2.2}>
                CREATIVE CHALLENGE?
              </KineticBrushWord>
            </h3>
            <p className="font-body text-xs text-white/80 line-clamp-1 sm:line-clamp-none">
              Submit your core constraints. Our team responds within 24 hours with an annotated
              kinetic sketch proposal.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <a
              className="inline-flex items-center gap-2 bg-yellow-400 text-black hover:bg-white font-headline font-black text-xs px-4 py-2 rounded-DEFAULT border border-black comic-shadow-sm active:scale-95 transition-all whitespace-nowrap"
              href="#brief-inquiry"
            >
              <span>SEND RAPID BRIEF</span>
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      </ScrollReveal>
    </section>
  );
};
