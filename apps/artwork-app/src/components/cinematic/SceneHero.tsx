"use client";

import React from "react";
import Image from "next/image";
import { ArrowRight, ArrowUpRight, Lightbulb } from "lucide-react";

export const SceneHero: React.FC = () => {
  return (
    <div className="w-full h-full flex flex-col justify-center max-w-7xl mx-auto px-4 sm:px-8 py-2 relative">
      {/* Top Banner Tag & Note */}
      <div className="flex flex-wrap items-center justify-between gap-4 mb-4">
        <div className="inline-flex items-center gap-2 border-2 border-black bg-white px-4 py-1.5 rounded-full shadow-[2px_2px_0px_0px_#111111] font-mono text-xs font-black uppercase tracking-wider">
          <span className="text-yellow-500 font-black">★</span>
          <span>MARKETING SOLUTIONS FOR KINETIC BRANDS</span>
          <span className="bg-yellow-400 text-black px-2 py-0.5 rounded-full font-bold ml-1 text-[10px]">
            STAGE 01
          </span>
        </div>

        {/* Taped Sticky Note */}
        <div className="relative -rotate-2 hover:rotate-0 transition-transform duration-200">
          <div className="bg-yellow-200 border-2 border-black px-4 py-1.5 text-xs font-mono font-bold text-black shadow-[2px_2px_0px_0px_#111111] flex items-center gap-2">
            <Lightbulb className="w-3.5 h-3.5 text-black" />
            <span>STICKY_NOTE_01: &quot;Zero cookie-cutter templates.&quot;</span>
          </div>
          <div className="absolute -top-2 left-6 w-8 h-2.5 bg-white/70 border border-black/30 rotate-2"></div>
        </div>
      </div>

      {/* Main Split Grid (Left: Typography & CTAs, Right: Studio Sketchpad & Team) */}
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-center">
        {/* Left Column: Headlines & Action Cluster */}
        <div className="lg:col-span-6 space-y-6">
          <div className="relative">
            <h1 className="font-brush text-5xl sm:text-6xl md:text-7xl lg:text-8xl tracking-tight leading-[0.95] text-black">
              CREATIVE IDEAS. <br />
              <span className="relative inline-block mt-2">
                {/* Yellow Highlighter Swipe */}
                <span className="absolute -inset-2 bg-yellow-400 -rotate-1 rounded-sm -z-10 border-2 border-black shadow-[4px_4px_0px_0px_#111111]"></span>
                <span className="text-black relative z-10 px-2">REAL IMPACT.</span>
                {/* Self-drawing underline SVG */}
                <svg
                  className="absolute -bottom-4 left-0 w-full h-5 text-black pointer-events-none"
                  fill="none"
                  preserveAspectRatio="none"
                  viewBox="0 0 400 20"
                >
                  <path
                    d="M 5,12 Q 100,2 200,14 T 395,8"
                    stroke="currentColor"
                    strokeLinecap="round"
                    strokeWidth="6"
                    className="stroke-[6]"
                  />
                </svg>
              </span>
            </h1>

            {/* Comic Starburst POW Badge */}
            <div className="absolute -top-8 right-0 hidden sm:flex items-center justify-center w-24 h-24">
              <svg
                className="w-full h-full fill-yellow-400 stroke-black stroke-2 drop-shadow-md animate-pulse"
                viewBox="0 0 100 100"
              >
                <polygon points="50,0 63,28 95,20 78,48 100,70 69,76 65,100 45,82 18,95 24,68 0,55 25,36 15,10 44,22" />
              </svg>
              <div className="absolute inset-0 flex flex-col items-center justify-center text-center p-1 text-black font-mono font-black text-[8px] uppercase leading-tight -rotate-6">
                <span>100% RAW</span>
                <span className="bg-black text-white px-1 py-0.2 rounded-xs">CREATIVE</span>
                <span>MAGIC</span>
              </div>
            </div>
          </div>

          <p className="text-base sm:text-lg text-black/80 max-w-lg leading-relaxed font-medium">
            We are <strong className="text-black font-bold underline decoration-yellow-400 decoration-4">Art Work</strong>: an interdisciplinary experiential agency engineering monolithic stages, curved LED spectacles, and viral creative branding.
          </p>

          {/* Primary CTA Buttons */}
          <div className="flex flex-wrap items-center gap-4 pt-1">
            <a
              href="#stage-02"
              className="relative inline-flex items-center gap-2 bg-black text-white hover:bg-yellow-400 hover:text-black font-mono font-bold text-sm md:text-base px-7 py-3.5 rounded-full border-2 border-black shadow-[4px_4px_0px_0px_#111111] hover:translate-x-[2px] hover:translate-y-[2px] hover:shadow-[2px_2px_0px_0px_#111111] transition-all"
            >
              <span>EXPLORE STAGES</span>
              <ArrowRight className="w-5 h-5" />
            </a>
            <a
              href="#collective"
              className="inline-flex items-center gap-2 bg-white text-black hover:bg-neutral-100 font-mono font-bold text-sm md:text-base px-6 py-3.5 rounded-full border-2 border-black shadow-[3px_3px_0px_0px_#111111] transition-all"
            >
              <span>VIEW WHY US</span>
              <ArrowUpRight className="w-5 h-5" />
            </a>
          </div>

          {/* Self-drawing Arrow Annotation */}
          <div className="flex items-center gap-3 pt-2">
            <svg className="w-20 h-10 text-black" fill="none" viewBox="0 0 100 50">
              <path
                d="M 5,40 C 35,45 65,10 90,15"
                stroke="currentColor"
                strokeDasharray="4 2"
                strokeLinecap="round"
                strokeWidth="2.5"
              />
              <polygon fill="currentColor" points="90,10 96,16 88,20" />
            </svg>
            <span className="font-mono font-bold text-xs uppercase tracking-wider text-black bg-yellow-300 px-2.5 py-1 rounded border border-black shadow-[2px_2px_0px_0px_#111111] -rotate-2">
              ⚡ Click here to launch!
            </span>
          </div>

          {/* Milestone Metrics Bento */}
          <div className="grid grid-cols-3 gap-3 pt-2 max-w-md">
            <div className="border-2 border-black bg-white p-2.5 rounded-xl shadow-[3px_3px_0px_0px_#111111] text-center hover:bg-yellow-50 transition-colors">
              <div className="font-brush text-2xl text-black">450+</div>
              <div className="text-[10px] font-mono font-bold text-black/70 uppercase">Arena Shows</div>
            </div>
            <div className="border-2 border-black bg-white p-2.5 rounded-xl shadow-[3px_3px_0px_0px_#111111] text-center hover:bg-yellow-50 transition-colors">
              <div className="font-brush text-2xl text-black">99.4%</div>
              <div className="text-[10px] font-mono font-bold text-black/70 uppercase">Cue Accuracy</div>
            </div>
            <div className="border-2 border-black bg-white p-2.5 rounded-xl shadow-[3px_3px_0px_0px_#111111] text-center hover:bg-yellow-50 transition-colors">
              <div className="font-brush text-2xl text-black">1.2M+</div>
              <div className="text-[10px] font-mono font-bold text-black/70 uppercase">Live Reach</div>
            </div>
          </div>
        </div>

        {/* Right Column: Studio Sketchpad & Team Artwork (Clean, Borderless, No Frame) */}
        <div className="lg:col-span-6 relative">
          <div className="relative overflow-hidden rounded-2xl aspect-[16/10] flex items-center justify-center shadow-2xl">
            <Image
              src="/assets/images/hero_studio_collective.jpg"
              alt="Art Work Creative Collective"
              fill
              priority
              className="object-cover rounded-2xl"
            />
          </div>
        </div>
      </div>
    </div>
  );
};
