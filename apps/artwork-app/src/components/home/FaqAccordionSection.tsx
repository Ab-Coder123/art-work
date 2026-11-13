"use client";

import React, { useState } from "react";
import { motion, AnimatePresence } from "framer-motion";
import { Plus, Minus, HelpCircle } from "lucide-react";

const FAQ_ITEMS = [
  {
    q: "What is the typical lead time for custom exhibition booth design and fabrication?",
    a: "Our rapid 3D scenography and preliminary working drawings are delivered within 48 to 72 hours. Complete CNC fabrication, custom carpentry, acrylic framing, and pre-rigging typically take 2 to 3 weeks depending on pavilion square footage.",
  },
  {
    q: "Do you handle Civil Defense, structural safety calculations, and venue permits?",
    a: "Yes, 100%. Our in-house engineering team prepares stamped load-bearing calculations, electrical single-line diagrams, fire-retardant material certificates, and submits all required filings to Cairo, Riyadh, and regional exhibition authorities.",
  },
  {
    q: "Can you execute turnkey productions across both Egypt and Saudi Arabia?",
    a: "Absolutely. Art Work operates dedicated fabrication resources and on-site project crews stationed in Cairo and Riyadh, giving multinational clients a single accountable partner across both primary MENA business centers.",
  },
  {
    q: "What AV technologies, LED screen pitches, and lighting rigs do you deploy?",
    a: "We maintain our own inventory of high-refresh P1.9 to P2.9 indoor LED walls, outdoor IP65 LED displays, 4K Novastar processors, GrandMA lighting consoles, motorized moving heads, and synchronized Dante audio networks.",
  },
  {
    q: "How does your team guarantee zero downtime during overnight venue bump-in?",
    a: "Every structural component is 100% pre-assembled and dry-fitted in our production warehouse prior to transport. On site, our shift-based installation teams execute timed checklists under a dedicated stage director with zero improvisations.",
  },
];

export const FaqAccordionSection = React.memo(function FaqAccordionSection() {
  const [openIndex, setOpenIndex] = useState<number | null>(0);

  const toggleIndex = (idx: number) => {
    setOpenIndex((prev) => (prev === idx ? null : idx));
  };

  return (
    <section
      aria-label="Frequently Asked Questions"
      className="w-full max-w-4xl mx-auto px-4 sm:px-6 py-10 sm:py-16"
      id="faq"
    >
      {/* Header */}
      <div className="flex flex-col items-center text-center mb-8 sm:mb-12">
        <div className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full bg-white/5 ring-1 ring-white/10 text-xs font-mono font-bold tracking-wider text-zinc-400 uppercase mb-2">
          <HelpCircle className="w-3.5 h-3.5 text-[#dcb858]" />
          <span>FAQ</span>
        </div>
        <h2 className="font-headline font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight mb-2">
          Frequently Asked{" "}
          <span className="text-[#dcb858] drop-shadow-[0_2px_20px_rgba(220,184,88,0.25)]">
            Questions
          </span>
        </h2>
        <p className="font-body text-xs sm:text-sm text-zinc-400">
          Everything you need to know about partnering with our studio.
        </p>
      </div>

      {/* Accordion List */}
      <div className="space-y-3">
        {FAQ_ITEMS.map((item, idx) => {
          const isOpen = openIndex === idx;
          return (
            <div
              key={idx}
              className="rounded-2xl bg-[#0d0d15]/90 ring-1 ring-white/10 hover:ring-[#dcb858]/40 transition-all duration-200 overflow-hidden"
            >
              <button
                type="button"
                onClick={() => toggleIndex(idx)}
                className="w-full p-5 text-left flex items-center justify-between gap-4 cursor-pointer select-none"
              >
                <span className="font-headline font-bold text-sm sm:text-base text-white hover:text-[#dcb858] transition-colors leading-snug">
                  {item.q}
                </span>
                <div className="w-7 h-7 rounded-full bg-white/5 ring-1 ring-white/10 flex items-center justify-center shrink-0 text-zinc-400">
                  {isOpen ? (
                    <Minus className="w-4 h-4 text-[#dcb858]" />
                  ) : (
                    <Plus className="w-4 h-4" />
                  )}
                </div>
              </button>

              <AnimatePresence initial={false}>
                {isOpen && (
                  <motion.div
                    initial={{ height: 0, opacity: 0 }}
                    animate={{ height: "auto", opacity: 1 }}
                    exit={{ height: 0, opacity: 0 }}
                    transition={{ duration: 0.25, ease: [0.16, 1, 0.3, 1] }}
                    className="overflow-hidden"
                  >
                    <div className="px-5 pb-5 pt-1 font-body text-xs sm:text-sm text-zinc-400 leading-relaxed ring-t-1 ring-white/5">
                      {item.a}
                    </div>
                  </motion.div>
                )}
              </AnimatePresence>
            </div>
          );
        })}
      </div>
    </section>
  );
});
