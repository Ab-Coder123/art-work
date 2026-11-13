"use client";

import React from "react";
import { motion } from "framer-motion";
import { MapPin, Mail, MessageCircle, Phone } from "lucide-react";

const INDUSTRIES = [
  "Aviation & Defense",
  "Real Estate & Construction",
  "Healthcare & Pharma",
  "Banking & FinTech",
  "Automotive & Mobility",
  "Energy & Heavy Industry",
  "Technology & Telecom",
  "Government & Public Sector",
  "Luxury & Retail",
];

interface IndustryExpertiseSectionProps {
  whatsappPhone?: string;
  email?: string;
}

export const IndustryExpertiseSection = React.memo(function IndustryExpertiseSection({
  whatsappPhone = "+20 (2) 2794-0000",
  email = "hello@artwork-adv.com",
}: IndustryExpertiseSectionProps) {
  const whatsappDigits = (whatsappPhone || "+20 (2) 2794-0000").replace(/\D/g, "") || "20227940000";

  return (
    <section
      aria-label="Industry Expertise and Office Locations"
      className="w-full max-w-7xl mx-auto px-4 sm:px-6 py-10 sm:py-14"
      id="industries"
    >
      <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
        {/* Left Column: Industry Expertise Tags */}
        <div className="lg:col-span-7 space-y-4">
          <h2 className="font-headline font-black text-2xl sm:text-4xl text-white tracking-tight leading-tight">
            Industry{" "}
            <span className="text-[#dcb858] drop-shadow-[0_2px_20px_rgba(220,184,88,0.25)]">
              expertise
            </span>
          </h2>
          <p className="font-body text-xs sm:text-sm text-zinc-400 leading-relaxed max-w-xl mb-6">
            We build spatial playbooks and turnkey event architectures that match your industry&apos;s
            specific regulatory standards, audience expectations, and commercial objectives.
          </p>

          <div className="flex flex-wrap gap-2.5 pt-2">
            {INDUSTRIES.map((ind, idx) => (
              <motion.span
                key={ind}
                initial={{ opacity: 0, scale: 0.95 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                transition={{ duration: 0.3, delay: idx * 0.04 }}
                className="px-4 py-2 rounded-xl bg-[#0d0d15] ring-1 ring-white/10 hover:ring-[#dcb858]/50 text-xs font-mono text-zinc-300 hover:text-white transition-all duration-200 select-none"
              >
                {ind}
              </motion.span>
            ))}
          </div>
        </div>

        {/* Right Column: Our Offices Card (Matching Image Section 10) */}
        <motion.div
          initial={{ opacity: 0, y: 20 }}
          whileInView={{ opacity: 1, y: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.16, 1, 0.3, 1] }}
          className="lg:col-span-5 rounded-2xl p-6 sm:p-7 bg-[#0d0d15]/90 ring-1 ring-white/10 shadow-xl space-y-5"
        >
          <div className="font-headline font-bold text-lg text-white">
            Our Offices
          </div>

          <div className="space-y-4 text-xs font-mono">
            {/* Egypt */}
            <div>
              <div className="text-[10px] text-[#dcb858] font-bold uppercase tracking-wider mb-1">
                Egypt Headquarters
              </div>
              <div className="flex items-start gap-2 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-[#dcb858] shrink-0 mt-0.5" />
                <span>1 Falouga Street, Mohandeseen, Giza, Egypt</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 mt-1 pl-5">
                <Phone className="w-3 h-3 text-[#dcb858]" />
                <a href={`tel:${whatsappPhone}`} className="hover:text-white transition-colors">
                  {whatsappPhone}
                </a>
              </div>
            </div>

            {/* KSA / Regional */}
            <div className="pt-2 ring-t-1 ring-white/5">
              <div className="text-[10px] text-[#dcb858] font-bold uppercase tracking-wider mb-1">
                Regional Hubs
              </div>
              <div className="flex items-start gap-2 text-zinc-300">
                <MapPin className="w-3.5 h-3.5 text-[#dcb858] shrink-0 mt-0.5" />
                <span>Riyadh Business Gate, KSA // Business Bay, Dubai, UAE</span>
              </div>
              <div className="flex items-center gap-2 text-zinc-400 mt-1 pl-5">
                <Mail className="w-3 h-3 text-[#dcb858]" />
                <a href={`mailto:${email}`} className="hover:text-white transition-colors">
                  {email}
                </a>
              </div>
            </div>
          </div>

          {/* Wide WhatsApp Button */}
          <a
            href={`https://wa.me/${whatsappDigits}`}
            target="_blank"
            rel="noopener noreferrer"
            className="w-full flex items-center justify-center gap-2 py-3 rounded-xl bg-white/5 hover:bg-[#10b981]/20 text-white hover:text-emerald-300 ring-1 ring-white/10 hover:ring-[#10b981]/50 text-xs font-headline font-bold uppercase tracking-wider transition-all duration-200 cursor-pointer"
          >
            <MessageCircle className="w-4 h-4 text-emerald-400 stroke-[2.2]" />
            <span>Open WhatsApp</span>
          </a>
        </motion.div>
      </div>
    </section>
  );
});
