"use client";

import React, { useState, useRef, useCallback } from "react";
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
} from "lucide-react";
import { KineticBrushWord } from "@/components/cinematic/KineticBrushStroke";
import { ScrollReveal } from "@/components/cinematic/ScrollReveal";

const renderDisciplineIcon = (icon: string) => {
  switch (icon) {
    case "brush":
      return <Paintbrush className="w-4 h-4 text-black" />;
    case "compass":
      return <Compass className="w-4 h-4 text-black" />;
    case "architecture":
      return <Building className="w-4 h-4 text-black" />;
    case "terminal":
      return <Layers className="w-4 h-4 text-black" />;
    case "bolt":
      return <Zap className="w-4 h-4 text-black" />;
    case "videocam":
      return <Monitor className="w-4 h-4 text-black" />;
    case "campaign":
      return <Printer className="w-4 h-4 text-black" />;
    case "sparkles":
      return <Sparkles className="w-4 h-4 text-black" />;
    case "gift":
      return <Gift className="w-4 h-4 text-black" />;
    case "camera":
      return <Camera className="w-4 h-4 text-black" />;
    case "users":
      return <Users className="w-4 h-4 text-black" />;
    case "truck":
      return <Truck className="w-4 h-4 text-black" />;
    default:
      return <ArrowUpRight className="w-4 h-4 text-black" />;
  }
};

export type ServiceCategory = "all" | "creative" | "events" | "production" | "delivery";

export interface Discipline {
  id: string;
  number: string;
  tag: string;
  title: string;
  icon: string;
  category: "creative" | "events" | "production" | "delivery";
  specs: string[];
  description: string;
  deliverables: string[];
  metrics: string;
}

const DISCIPLINES: Discipline[] = [
  {
    id: "concept-creation",
    number: "01",
    tag: "01 / CREATIVE",
    title: "Concept Creation & Creative Development",
    icon: "brush",
    category: "creative",
    specs: [
      "Event Concept & Theme Design",
      "Creative Direction & Narrative",
      "Brand Environment Concept",
      "Guest Journey Mapping",
    ],
    description:
      "We shape the event idea, creative direction and experience around your objectives, audience and brand.",
    deliverables: [
      "Creative Direction Moodboards",
      "Event Identity & Theme Deck",
      "Spatial Narrative Guidelines",
      "Experience Journey Blueprint",
    ],
    metrics: "Concept to Delivery",
  },
  {
    id: "event-planning",
    number: "02",
    tag: "02 / PLANNING",
    title: "Event Planning & Project Management",
    icon: "compass",
    category: "creative",
    specs: [
      "Master Event Schedule & Milestones",
      "Vendor & Supplier Coordination",
      "Budget & Resource Tracking",
      "Stakeholder Communication",
    ],
    description:
      "We coordinate the schedule, teams, suppliers and moving parts that take an event from brief to delivery.",
    deliverables: [
      "Critical Path Project Timeline",
      "Supplier Procurement Alignment",
      "On-Site Operational Run Sheets",
      "Contingency & Risk Management",
    ],
    metrics: "Full Coordination",
  },
  {
    id: "exhibition-booths",
    number: "03",
    tag: "03 / EXHIBITIONS",
    title: "Exhibition Booth Design & Production",
    icon: "architecture",
    category: "events",
    specs: [
      "Custom 3D Booth Layouts",
      "Structural Fabrication & Build",
      "Branded Visitor Engagement Zones",
      "Turnkey On-Site Assembly",
    ],
    description:
      "We design and produce branded exhibition spaces that welcome visitors and support meaningful conversations.",
    deliverables: [
      "Detailed 3D Spatial Renders",
      "Structural Fabrication Packages",
      "Exhibition Hall Permit Liaison",
      "On-Site Installation & Handover",
    ],
    metrics: "Turnkey Production",
  },
  {
    id: "conferences-medical",
    number: "04",
    tag: "04 / CONFERENCES",
    title: "Conference & Medical Event Management",
    icon: "terminal",
    category: "events",
    specs: [
      "Plenary & Breakout Room Staging",
      "Speaker & Delegate Flow Management",
      "Scientific & Corporate Program Alignment",
      "On-Site Hospitality & Protocol",
    ],
    description:
      "We coordinate conferences and medical events, from the attendee journey and programme logistics to on-site delivery.",
    deliverables: [
      "Speaker Staging & Briefing System",
      "Delegate Flow & Seating Plans",
      "Live Session AV Timecoding",
      "Post-Conference Recap Reporting",
    ],
    metrics: "Medical & Corporate",
  },
  {
    id: "stage-sound-lighting",
    number: "05",
    tag: "05 / STAGE",
    title: "Stage, Sound & Lighting Solutions",
    icon: "bolt",
    category: "production",
    specs: [
      "Custom Stage Architecture",
      "Acoustic Engineering & Clear Sound",
      "Dynamic Stage & Ambient Lighting",
      "Coordinated Cue Execution",
    ],
    description:
      "We plan stage environments and coordinate sound and lighting for a clear, engaging live experience.",
    deliverables: [
      "Stage Rigging & Truss Schematics",
      "Professional Sound Reinforcement",
      "Intelligent Lighting Programming",
      "Live Show Cue Direction",
    ],
    metrics: "Live Show Production",
  },
  {
    id: "led-audiovisual",
    number: "06",
    tag: "06 / AV",
    title: "LED Screens & Audiovisual Equipment",
    icon: "videocam",
    category: "production",
    specs: [
      "High-Resolution Indoor & Outdoor LED",
      "Multi-Input Video Switching",
      "Presentation & Media Playout",
      "Dedicated Technical AV Engineers",
    ],
    description:
      "We provide and coordinate LED screens and audiovisual equipment to support presentations, content and live moments.",
    deliverables: [
      "Ultra-HD LED Screen Rigs",
      "Seamless Live Vision Mixing",
      "Audio-Visual Playback Systems",
      "On-Site Technical AV Operation",
    ],
    metrics: "High-Definition AV",
  },
  {
    id: "branding-printing",
    number: "07",
    tag: "07 / BRANDING",
    title: "Branding, Printing & Event Branding",
    icon: "campaign",
    category: "production",
    specs: [
      "Venue Backdrop & Wall Graphics",
      "Directional Signage & Flags",
      "Delegate Lanyards & Badges",
      "High-Fidelity Event Collateral",
    ],
    description:
      "We carry your brand across event graphics, printed materials, venue touchpoints and production assets.",
    deliverables: [
      "Large-Format Print Production",
      "Wayfinding & Entrance Signage",
      "Personalized Delegate Packs",
      "Branded Stage Fascias & Podiums",
    ],
    metrics: "Consistent Identity",
  },
  {
    id: "interactive-activities",
    number: "08",
    tag: "08 / ENGAGEMENT",
    title: "Interactive Activities & Engagement Solutions",
    icon: "sparkles",
    category: "delivery",
    specs: [
      "Interactive Experiential Stations",
      "Digital Photo & Video Activations",
      "Audience Participation Moments",
      "Social Sharing Touchpoints",
    ],
    description:
      "We create participation moments that invite guests to connect, explore and engage with your brand.",
    deliverables: [
      "Custom Activation Hardware",
      "Interactive Digital Software",
      "Branded Social Photo Outputs",
      "Engagement Analytics & Feedback",
    ],
    metrics: "Audience Engagement",
  },
  {
    id: "promotional-merchandise",
    number: "09",
    tag: "09 / MERCH",
    title: "Promotional Giveaways & Merchandise",
    icon: "gift",
    category: "delivery",
    specs: [
      "Curated Corporate Gifts & Giveaways",
      "Custom Packaging & Presentation",
      "Premium Quality Sourcing",
      "Timely Event Delivery & Staging",
    ],
    description:
      "We help select and prepare branded merchandise and giveaways that fit the event and audience.",
    deliverables: [
      "Branded VIP Gift Sets",
      "Attendee Swag Bags & Items",
      "Sustainable Merchandise Options",
      "Delivered Ready for Handout",
    ],
    metrics: "Curated Merchandise",
  },
  {
    id: "photography-videography",
    number: "10",
    tag: "10 / MEDIA",
    title: "Photography & Videography",
    icon: "camera",
    category: "delivery",
    specs: [
      "High-Resolution Event Photography",
      "Cinematic Highlight Reels",
      "Keynote & Session Recording",
      "Fast-Turnaround Social Recaps",
    ],
    description:
      "We capture the event with photography and video for documentation, recap and future communications.",
    deliverables: [
      "Edited High-Res Photo Gallery",
      "Full Event Highlight Video",
      "Social-Ready Vertical Cuts (9:16)",
      "Archival Event Footage",
    ],
    metrics: "Full Event Coverage",
  },
  {
    id: "registration-staffing",
    number: "11",
    tag: "11 / STAFFING",
    title: "Registration & Event Staffing",
    icon: "users",
    category: "delivery",
    specs: [
      "Fast Guest Registration & Badging",
      "Trained Hostesses & Event Ushers",
      "VIP Protocol & Hospitality Staff",
      "Front-of-House Coordination",
    ],
    description:
      "We coordinate registration support and event staff to welcome, guide and assist attendees.",
    deliverables: [
      "Smooth On-Site Check-In Flow",
      "Uniformed & Briefed Event Hosts",
      "VIP Welcome & Escort Service",
      "Information Desk Management",
    ],
    metrics: "Hospitality & Flow",
  },
  {
    id: "onsite-logistics",
    number: "12",
    tag: "12 / LOGISTICS",
    title: "On-Site Event Management & Logistics",
    icon: "truck",
    category: "delivery",
    specs: [
      "Live Event Day Direction & Run-of-Show",
      "Vendor & Supplier Load-In Management",
      "Timeline & Schedule Control",
      "Safe Breakdown & Handover",
    ],
    description:
      "We manage on-site coordination, timing and logistics so teams and suppliers stay aligned during delivery.",
    deliverables: [
      "Real-Time Event Control & Run-Sheet",
      "Supplier Load-In / Load-Out Schedules",
      "Venue Liaison & Facility Protocol",
      "Post-Event Site Inspection",
    ],
    metrics: "Seamless Live Delivery",
  },
];

interface TiltCardProps {
  discipline: Discipline;
  index: number;
  onSelect: (discipline: Discipline) => void;
}

const TiltCard: React.FC<TiltCardProps> = ({ discipline, index, onSelect }) => {
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
      initial={{ opacity: 0, y: 20 }}
      whileInView={{ opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.1 }}
      transition={{
        duration: 0.4,
        delay: (index % 4) * 0.05,
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
        className="relative border-2 border-black dark:border-zinc-700 p-4 rounded-xl bg-white dark:bg-[#15151F] comic-shadow-sm hover:comic-shadow-yellow hover:bg-yellow-50 dark:hover:bg-[#1D1D2B] transition-all duration-200 cursor-pointer flex flex-col justify-between overflow-hidden group select-none flex-1 min-h-[220px]"
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
          <div className="flex items-center justify-between mb-2">
            <span className="font-headline font-black text-[10px] text-black/60 dark:text-zinc-400 tracking-wider">
              {discipline.tag}
            </span>
            <span className="w-5 h-5 rounded-full bg-black text-yellow-400 font-mono text-[9px] font-black flex items-center justify-center">
              {discipline.number}
            </span>
          </div>

          <div className="font-headline font-black text-sm lg:text-[15px] text-black dark:text-white mb-2 leading-snug group-hover:text-yellow-600 dark:group-hover:text-yellow-400 transition-colors">
            {discipline.title}
          </div>

          <p className="text-xs font-body text-black/75 dark:text-zinc-300 leading-relaxed mb-3">
            {discipline.description}
          </p>
        </div>

        <div className="relative z-10 pt-2.5 border-t border-black/15 dark:border-zinc-800 font-headline font-black text-[10px] text-black dark:text-zinc-200 flex items-center justify-between tracking-wider">
          <span className="group-hover:underline decoration-yellow-400 decoration-2">
            VIEW DELIVERABLES
          </span>
          <span className="group-hover:translate-x-1 transition-transform text-black dark:text-yellow-400 flex items-center justify-center">
            {renderDisciplineIcon(discipline.icon)}
          </span>
        </div>
      </div>
    </motion.div>
  );
};

export const Capabilities3DMatrix: React.FC = () => {
  const [selectedDiscipline, setSelectedDiscipline] = useState<Discipline | null>(null);
  const [activeFilter, setActiveFilter] = useState<ServiceCategory>("all");

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

  const filteredDisciplines = DISCIPLINES.filter((d) =>
    activeFilter === "all" ? true : d.category === activeFilter
  );

  return (
    <section className="w-full max-w-[1480px] mx-auto px-3 sm:px-4 lg:px-6 py-6 sm:py-8 relative" id="stage-03">
      {/* Section Header */}
      <ScrollReveal direction="up" distance={15} className="text-center max-w-3xl mx-auto mb-6">
        <div className="inline-block bg-yellow-400 text-black px-3 py-1 border-2 border-black comic-shadow-sm font-headline text-xs font-black uppercase mb-2 -rotate-1">
          OUR SERVICES
        </div>
        <h2 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-black dark:text-white tracking-tight mb-2 uppercase">
          EVERY DETAIL, FROM FIRST IDEA TO{" "}
          <KineticBrushWord variant="double" color="#dcb858" strokeWidth={2.4}>
            EVENT DAY.
          </KineticBrushWord>
        </h2>
        <p className="font-body text-xs sm:text-sm text-black/75 dark:text-zinc-400 max-w-2xl mx-auto">
          Creative, planning and production support for events that bring brands to life.
        </p>
      </ScrollReveal>

      {/* Filter Tabs */}
      <div className="flex flex-wrap items-center justify-center gap-2 mb-6">
        {(
          [
            { key: "all", label: "ALL SERVICES (12)" },
            { key: "creative", label: "CREATIVE & PLANNING" },
            { key: "events", label: "EVENTS & EXHIBITIONS" },
            { key: "production", label: "PRODUCTION & BRANDING" },
            { key: "delivery", label: "GUEST EXPERIENCE & DELIVERY" },
          ] as const
        ).map((tab) => (
          <button
            key={tab.key}
            onClick={() => setActiveFilter(tab.key)}
            className={`px-3.5 py-1.5 rounded-full font-headline text-xs font-bold uppercase tracking-wider border-2 border-black dark:border-zinc-700 transition-all cursor-pointer ${
              activeFilter === tab.key
                ? "bg-yellow-400 text-black comic-shadow-sm scale-105 font-black -rotate-1"
                : "bg-white dark:bg-[#15151F] text-black/70 dark:text-zinc-300 hover:bg-yellow-100 dark:hover:bg-[#1E1E2C]"
            }`}
          >
            {tab.label}
          </button>
        ))}
      </div>

      {/* 3D Tilt Cards Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-4 mb-6">
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

              <h3 className="font-headline font-black text-xl sm:text-2xl text-black dark:text-white mb-2">
                {selectedDiscipline.title}
              </h3>

              <p className="font-body text-sm text-black/80 dark:text-zinc-300 mb-5 leading-relaxed">
                {selectedDiscipline.description}
              </p>

              <div className="border-t-2 border-black/10 dark:border-white/10 pt-4 mb-6">
                <h4 className="font-headline font-bold text-xs uppercase text-black/60 dark:text-zinc-400 tracking-wider mb-3">
                  Scope &amp; Deliverables
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
                  CREATIVE • PLANNING • PRODUCTION • LIVE DELIVERY
                </span>
                <a
                  href="#stage-04"
                  onClick={navigateToBrief}
                  className="inline-flex items-center gap-2 bg-black dark:bg-yellow-400 text-white dark:text-black hover:bg-yellow-400 dark:hover:bg-yellow-300 hover:text-black font-headline font-bold text-xs px-5 py-2.5 rounded-lg border-2 border-black comic-shadow-sm transition-all cursor-pointer"
                >
                  <span>Select in Brief</span>
                  <ArrowRight className="w-3.5 h-3.5 stroke-[2.5]" />
                </a>
              </div>
            </motion.div>
          </motion.div>
        )}
      </AnimatePresence>

      {/* Event Planning Banner */}
      <ScrollReveal direction="pop" distance={20} className="mt-4 sm:mt-6">
        <div className="bg-black dark:bg-[#14141E] text-white px-5 py-4 sm:py-5 rounded-2xl border-2 border-black dark:border-zinc-700 comic-shadow relative overflow-hidden flex flex-col md:flex-row items-center justify-between gap-4">
          <div className="relative z-10 max-w-xl text-left">
            <div className="flex items-center gap-1.5 mb-1 text-yellow-400 font-headline font-black text-xs tracking-wider uppercase">
              <Sparkles className="w-3.5 h-3.5 text-yellow-400" />
              <span>PLANNING A BRAND EVENT OR EXHIBITION?</span>
            </div>
            <h3 className="font-headline font-black text-lg sm:text-xl tracking-tight mb-1">
              ONE CONNECTED TEAM FROM{" "}
              <KineticBrushWord variant="wave" color="#facc15" strokeWidth={2.2}>
                FIRST IDEA TO EVENT DAY.
              </KineticBrushWord>
            </h3>
            <p className="font-body text-xs text-white/80">
              Tell us about your event format, audience and timing. We’ll follow up to discuss the right creative and production support.
            </p>
          </div>
          <div className="relative z-10 flex-shrink-0">
            <a
              className="inline-flex items-center gap-2 bg-yellow-400 text-black hover:bg-white font-headline font-black text-xs px-5 py-2.5 rounded-xl border-2 border-black comic-shadow-sm active:scale-95 transition-all whitespace-nowrap cursor-pointer"
              href="#stage-04"
              onClick={navigateToBrief}
            >
              <span>PLAN YOUR EVENT</span>
              <Send className="w-3.5 h-3.5 stroke-[2.5]" />
            </a>
          </div>
          <div className="absolute -right-8 -top-8 w-48 h-48 bg-yellow-400/10 rounded-full blur-2xl pointer-events-none"></div>
        </div>
      </ScrollReveal>
    </section>
  );
};
