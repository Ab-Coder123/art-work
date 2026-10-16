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
  onSelect: (d: Discipline) => void;
}> = ({ discipline, onSelect }) => {
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
    <div
      ref={cardRef}
      onMouseMove={handleMouseMove}
      onMouseLeave={handleMouseLeave}
      onClick={() => onSelect(discipline)}
      style={{
        transform: `perspective(1000px) rotateX(${rotateX}deg) rotateY(${rotateY}deg)`,
        transition: "transform 0.15s cubic-bezier(0.16, 1, 0.3, 1)",
      }}
      className="relative border-2 border-black p-3.5 rounded-lg bg-white comic-shadow hover:comic-shadow-yellow hover:bg-yellow-50 transition-colors duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group select-none"
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
        <div className="flex items-center justify-between mb-1.5">
          <span className="font-headline font-black text-[10px] text-black/50">
            {discipline.tag}
          </span>
          <span className="w-5 h-5 rounded-full bg-black text-yellow-400 font-mono text-[9px] font-black flex items-center justify-center">
            {discipline.number}
          </span>
        </div>

        <div className="font-headline font-black text-sm sm:text-base text-black mb-2 group-hover:text-yellow-600 transition-colors">
          {discipline.title}
        </div>

        <ul className="text-[11px] font-body text-black/80 space-y-1 list-disc list-inside">
          {discipline.specs.map((spec, i) => (
            <li key={i}>{spec}</li>
          ))}
        </ul>
      </div>

      <div className="relative z-10 mt-3 pt-2 border-t border-black/20 font-headline font-black text-[10px] text-black flex items-center justify-between">
        <span className="group-hover:underline decoration-yellow-400 decoration-2">
          ENGAGE TOOLKIT
        </span>
        <span className="group-hover:translate-x-1 group-hover:scale-125 transition-transform text-black flex items-center justify-center">
          {renderDisciplineIcon(discipline.icon)}
        </span>
      </div>
    </div>
  );
};

export const Capabilities3DMatrix: React.FC = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [activeFilter, setActiveFilter] = useState<"all" | "stage" | "motion" | "craft" | "tech">("all");

  const filteredDisciplines = DISCIPLINES.filter((d) =>
    activeFilter === "all" ? true : d.category === activeFilter
  );

  return (
    <section className="max-w-7xl mx-auto px-4 sm:px-6 py-2 relative" id="stage-03">
      {/* Section Header */}
      <div className="text-center max-w-2xl mx-auto mb-3">
        <div className="inline-block bg-yellow-400 text-black px-3 py-0.5 border-2 border-black comic-shadow-sm font-headline text-[10px] font-black uppercase mb-1.5 -rotate-1">
          03 CAPABILITIES &amp; 3D MATRIX
        </div>
        <h2 className="font-headline font-black text-2xl sm:text-3xl text-black tracking-tight mb-1 uppercase">
          Interactive Discipline{" "}
          <KineticBrushWord variant="double" color="#dcb858" strokeWidth={2.4}>
            Roster.
          </KineticBrushWord>
        </h2>
        <p className="font-body text-xs text-black/70">
          Tilt in 3D or click any discipline card below to inspect technical delivery specs and arena toolkits.
        </p>
      </div>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-1.5 mb-3.5">
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
            className={`px-3 py-1 rounded-full font-headline text-[10px] font-bold uppercase tracking-wider border border-black transition-all ${
              activeFilter === tab.key
                ? "bg-yellow-400 text-black comic-shadow-sm scale-105"
                : "bg-white text-black/70 hover:bg-yellow-100"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3D Tilt Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-5 gap-3">
        {filteredDisciplines.map((d) => (
          <TiltCard
            key={d.id}
            discipline={d}
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
              className="bg-white border-4 border-black rounded-2xl p-6 sm:p-8 max-w-2xl w-full comic-shadow relative"
            >
              {/* Close Button */}
              <button
                onClick={() => setSelectedDiscipline(null)}
                className="absolute top-4 right-4 w-9 h-9 rounded-full bg-yellow-400 hover:bg-black hover:text-white text-black border-2 border-black font-black flex items-center justify-center transition-colors"
                aria-label="Close dialog"
              >
                ✕
              </button>

              <div className="inline-flex items-center gap-2 bg-yellow-400 text-black px-3 py-1 border-2 border-black font-mono text-xs font-black uppercase mb-4">
                <span>{selectedDiscipline.tag}</span>
                <span>•</span>
                <span>{selectedDiscipline.metrics}</span>
              </div>

              <h3 className="font-headline font-black text-2xl sm:text-3xl text-black mb-3">
                {selectedDiscipline.title}
              </h3>

              <p className="font-body text-sm sm:text-base text-black/80 mb-6 leading-relaxed">
                {selectedDiscipline.description}
              </p>

              <div className="border-t-2 border-black/10 pt-4 mb-6">
                <h4 className="font-headline font-bold text-xs uppercase text-black/60 tracking-wider mb-3">
                  Production Deliverables &amp; Formats
                </h4>
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-2">
                  {selectedDiscipline.deliverables.map((item, idx) => (
                    <div
                      key={idx}
                      className="flex items-center gap-2 text-xs font-mono font-bold text-black bg-yellow-50 border border-black/20 p-2 rounded"
                    >
                      <CheckCircle2 className="w-3.5 h-3.5 text-yellow-600 fill-yellow-400/20 stroke-black shrink-0" />
                      <span>{item}</span>
                    </div>
                  ))}
                </div>
              </div>

              <div className="flex items-center justify-between pt-2">
                <span className="text-xs font-mono text-black/60">
                  Ready for live arena integration
                </span>
                <a
                  href="#brief-inquiry"
                  onClick={() => setSelectedDiscipline(null)}
                  className="inline-flex items-center gap-2 bg-black text-white hover:bg-yellow-400 hover:text-black font-headline font-bold text-xs px-5 py-2.5 rounded-lg border-2 border-black comic-shadow-sm transition-all"
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
      <div className="mt-16 bg-black text-white p-8 rounded-lg border-2 border-black comic-shadow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-6">
        <div className="relative z-10 max-w-xl">
          <div className="flex items-center gap-2 mb-2 text-yellow-400 font-headline font-black text-xs tracking-wider uppercase">
            <Sparkles className="w-4 h-4 text-yellow-400" />
            <span>PROPRIETARY KINETIC STAGE WORKFLOW</span>
          </div>
          <h3 className="font-headline font-black text-2xl sm:text-3xl tracking-tight mb-2">
            HAVE A TOUGH{" "}
            <KineticBrushWord variant="wave" color="#facc15" strokeWidth={2.4}>
              CREATIVE CHALLENGE?
            </KineticBrushWord>
          </h3>
          <p className="font-body text-sm text-white/80">
            Submit your core constraints. Our team responds within 24 hours with an annotated
            kinetic sketch proposal.
          </p>
        </div>
        <div className="relative z-10 flex-shrink-0">
          <a
            className="inline-flex items-center gap-2 bg-yellow-400 text-black hover:bg-white font-headline font-black text-sm px-6 py-3.5 rounded-DEFAULT border-2 border-black comic-shadow-sm active:scale-95 transition-all"
            href="#brief-inquiry"
          >
            <span>SEND RAPID BRIEF</span>
            <Send className="w-4 h-4 stroke-[2.5]" />
          </a>
        </div>
        <div className="absolute -right-8 -top-8 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>
      </div>
    </section>
  );
};
