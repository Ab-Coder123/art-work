"use client";

import React, { useState } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { Send, AlertCircle, CheckCircle2, Loader2 } from "lucide-react";
import { MagneticButton } from "@/components/cinematic/MagneticButton";
import type { ContactSectionContent } from "@art-work/types";

export interface ContactStageProps {
  content?: Partial<ContactSectionContent>;
  className?: string;
  id?: string;
}

const SERVICE_OPTIONS: string[] = [
  "Stage Design & Arena Rigging",
  "Conferences & Keynotes",
  "Experiential Brand Activation",
  "Kinetic LED Truss & Automation",
  "Holographic & 3D Mapping",
];

const DEFAULT_CONTACT_CONTENT: ContactSectionContent = {
  stageTag: "STAGE 04: EXECUTION // 24H INTAKE",
  headline: "THE ARENA AWAITS YOUR BRIEF.",
  description:
    "Send your technical constraints, venue capacity, and aesthetic vision. Our senior production team dispatches initial schematics in 24 hours.",
  intakeLabel: "STUDIO_CHIEF_DIRECT_LINE",
  intakeImage: "/assets/images/creative_chief_intake.png",
  intakeImageAlt: "Art Work Studio Chief Intake",
  email: "brief@artwork-marketing.com",
  phone: "+20 (2) 2794-0000",
  studioLocations: "Cairo • Dubai • Riyadh • London",
  submitButtonText: "INITIATE STAGE PROTOCOL",
  formFields: [],
};

export const ContactStage: React.FC<ContactStageProps> = ({
  content: propContent,
  className = "",
  id = "brief-inquiry",
}) => {
  const content: ContactSectionContent = { ...DEFAULT_CONTACT_CONTENT, ...propContent };

  const formLoadedAtRef = React.useRef(0);
  React.useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    serviceType: SERVICE_OPTIONS[0],
    brief: "",
    _hp: "",
  });

  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "idle" | "success" | "error";
    message: string;
  }>({ type: "idle", message: "" });

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (formData.brief.trim().length < 10) {
      setSubmitStatus({
        type: "error",
        message: "Brief must be at least 10 characters long.",
      });
      return;
    }

    setIsSubmitting(true);
    setSubmitStatus({ type: "idle", message: "" });

    try {
      const payload = {
        ...formData,
        _ts: formLoadedAtRef.current || Date.now(),
      };
      const res = await fetch("/api/contact/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });

      const data = await res.json();

      if (res.ok && data.ok) {
        setSubmitStatus({
          type: "success",
          message: "Stage brief received! Our technical directors will respond within 24 hours.",
        });
        setFormData({
          fullName: "",
          email: "",
          serviceType: SERVICE_OPTIONS[0],
          brief: "",
          _hp: "",
        });
        formLoadedAtRef.current = Date.now();
      } else {
        setSubmitStatus({
          type: "error",
          message: data.error || "Submission failed. Please try again or email us directly.",
        });
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error occurred. Please contact us at " + content.email,
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div id={id} className={`w-full max-w-5xl mx-auto py-8 sm:py-12 px-4 sm:px-6 ${className}`}>
      {/* Top Pill Header */}
      <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b-2 border-black dark:border-zinc-700 pb-3 mb-6">
        <div className="inline-flex items-center gap-2">
          <span className="w-2.5 h-2.5 rounded-full bg-yellow-400 border border-black animate-pulse"></span>
          <span className="font-headline font-black text-xs uppercase tracking-wider text-black dark:text-zinc-200">
            {content.stageTag}
          </span>
        </div>
        <div className="text-[10px] font-mono font-bold uppercase text-black/50 dark:text-zinc-400">
          TRANSLATE VISION INTO HARDWARE
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-12 gap-6 items-start">
        {/* Left Col: Contact Info & Chief Card */}
        <motion.div
          initial={{ opacity: 0, x: -20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-5 space-y-4"
        >
          <h2 className="font-headline font-black text-xl sm:text-2xl lg:text-3xl text-black dark:text-white tracking-tight leading-tight">
            {content.headline}
          </h2>
          <p className="font-body text-xs sm:text-sm text-black/80 dark:text-zinc-300 leading-relaxed">
            {content.description}
          </p>

          <div className="border-2 border-black dark:border-zinc-700 rounded-xl p-2.5 bg-yellow-50 dark:bg-[#1C1C28] relative comic-shadow-sm">
            <div className="aspect-[16/9] min-h-[170px] sm:min-h-[200px] rounded-lg overflow-hidden border border-black dark:border-zinc-700 bg-white dark:bg-[#0E0E14] relative">
              <Image
                src={content.intakeImage}
                alt={content.intakeImageAlt}
                fill
                sizes="(max-width: 1024px) 100vw, 30vw"
                className="object-cover object-center"
              />
            </div>
            <div className="mt-2 text-center text-[10px] sm:text-xs font-headline font-bold text-black/80 dark:text-zinc-300">
              {content.intakeLabel}
            </div>
          </div>

          <div className="space-y-2 text-xs font-headline font-bold text-black dark:text-zinc-200">
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-yellow-400 text-black border border-black flex items-center justify-center font-bold text-[10px]">
                @
              </span>
              <a href={`mailto:${content.email}`} className="hover:underline">
                {content.email}
              </a>
            </div>
            <div className="flex items-center gap-2">
              <span className="w-5 h-5 rounded-full bg-yellow-400 text-black border border-black flex items-center justify-center font-bold text-[10px]">
                📍
              </span>
              <span>{content.studioLocations}</span>
            </div>
          </div>
        </motion.div>

        {/* Right Col: Interactive Inquiry Form */}
        <motion.div
          initial={{ opacity: 0, x: 20 }}
          whileInView={{ opacity: 1, x: 0 }}
          viewport={{ once: true, amount: 0.15 }}
          transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
          className="lg:col-span-7 bg-white dark:bg-[#181824] border-2 border-black dark:border-zinc-700 rounded-xl p-4 sm:p-6 comic-shadow"
        >
          {submitStatus.type === "success" && (
            <div className="mb-4 p-3 bg-emerald-50 dark:bg-emerald-950/40 border-2 border-emerald-500 rounded-xl text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
              <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
              <p className="font-body font-bold">{submitStatus.message}</p>
            </div>
          )}

          {submitStatus.type === "error" && (
            <div className="mb-4 p-3 bg-rose-50 dark:bg-rose-950/40 border-2 border-rose-500 rounded-xl text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
              <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
              <p className="font-body font-bold">{submitStatus.message}</p>
            </div>
          )}

          <form onSubmit={handleSubmit} className="space-y-4">
            {/* Honeypot anti-spam */}
            <input
              type="text"
              name="_hp"
              value={formData._hp}
              onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
              style={{ display: "none" }}
              tabIndex={-1}
              autoComplete="off"
            />

            <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
              <div>
                <label className="block font-headline font-bold text-xs uppercase mb-1.5 text-black dark:text-zinc-300">
                  Full Name / Organization *
                </label>
                <input
                  className="w-full border-2 border-black dark:border-zinc-700 rounded-xl p-2.5 sm:p-3 font-body text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                  placeholder="e.g. Alex Vance, Production Director"
                  required
                  type="text"
                  value={formData.fullName}
                  onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                />
              </div>
              <div>
                <label className="block font-headline font-bold text-xs uppercase mb-1.5 text-black dark:text-zinc-300">
                  Official Email Address *
                </label>
                <input
                  className="w-full border-2 border-black dark:border-zinc-700 rounded-xl p-2.5 sm:p-3 font-body text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                  placeholder="alex@company.com"
                  required
                  type="email"
                  value={formData.email}
                  onChange={(e) => setFormData({ ...formData, email: e.target.value })}
                />
              </div>
            </div>

            <div>
              <label className="block font-headline font-bold text-xs uppercase mb-1.5 text-black dark:text-zinc-300">
                Target Stage / Service Solution
              </label>
              <div className="flex flex-wrap gap-1.5">
                {SERVICE_OPTIONS.map((opt: string) => (
                  <button
                    key={opt}
                    type="button"
                    onClick={() => setFormData({ ...formData, serviceType: opt })}
                    className={`text-[10px] sm:text-xs font-headline font-bold px-3 py-1.5 rounded-lg border-2 transition-all cursor-pointer ${
                      formData.serviceType === opt
                        ? "bg-yellow-400 text-black border-black shadow-[2px_2px_0px_#000] -rotate-1 font-black"
                        : "bg-zinc-100 dark:bg-zinc-800 text-black/70 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white"
                    }`}
                  >
                    {opt}
                  </button>
                ))}
              </div>
            </div>

            <div>
              <label className="block font-headline font-bold text-xs uppercase mb-1.5 text-black dark:text-zinc-300">
                The Core Brief / Vision Constraints *
              </label>
              <textarea
                className="w-full border-2 border-black dark:border-zinc-700 rounded-xl p-2.5 sm:p-3 font-body text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                placeholder="Describe your arena, product launch, or brand evolution requirements (min 10 characters)..."
                required
                rows={3}
                value={formData.brief}
                onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
              ></textarea>
            </div>

            <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-3 pt-2">
              <span className="text-[10px] sm:text-xs font-body font-mono text-black/60 dark:text-zinc-400">
                ⚡ 24h rapid response standard • Direct technical intake
              </span>
              <MagneticButton soundType="pop">
                <button
                  className="inline-flex items-center justify-center gap-2 bg-yellow-400 hover:bg-black hover:text-white dark:hover:bg-yellow-300 dark:hover:text-black text-black font-headline font-black text-xs sm:text-sm px-6 py-2.5 rounded-xl border-2 border-black comic-shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
                  type="submit"
                  disabled={isSubmitting}
                >
                  {isSubmitting ? (
                    <>
                      <Loader2 className="w-4 h-4 animate-spin" />
                      <span>DISPATCHING...</span>
                    </>
                  ) : (
                    <>
                      <span>{content.submitButtonText}</span>
                      <Send className="w-4 h-4 stroke-[2.5]" />
                    </>
                  )}
                </button>
              </MagneticButton>
            </div>
          </form>
        </motion.div>
      </div>
    </div>
  );
};
