"use client";

import React, { useState, useRef, useEffect } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import { CheckCircle2, AlertCircle, Loader2, Send } from "lucide-react";
import { soundFX } from "@/utils/soundFX";
import { MagneticButton } from "@/components/cinematic/MagneticButton";
import type { ContactSectionProps } from "./types";

export const ContactSection = React.memo(function ContactSection({ content }: ContactSectionProps) {
  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    serviceType: "Stage Design & Arena Rigging",
    brief: "",
    attachmentUrl: "",
    _hp: "",
  });
  const formLoadedAtRef = useRef<number | null>(null);
  const [isSubmitting, setIsSubmitting] = useState(false);
  const [submitStatus, setSubmitStatus] = useState<{
    type: "success" | "error" | null;
    message: string;
  }>({ type: null, message: "" });

  useEffect(() => {
    formLoadedAtRef.current = Date.now();
  }, []);

  const serviceOptions = [
    "Stage Design & Arena Rigging",
    "Conferences & Keynote LED",
    "Exhibition Booths",
    "Brand Architecture",
    "Custom Rigging & Tech",
  ];

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    soundFX.playPop();
    setIsSubmitting(true);
    setSubmitStatus({ type: null, message: "" });

    try {
      const finalBrief = formData.attachmentUrl
        ? `${formData.brief}\n\n[Attached Booth Reference / PDF / Image]: ${formData.attachmentUrl}`
        : formData.brief;

      const response = await fetch("/api/contact/brief", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({
          fullName: formData.fullName,
          email: formData.email,
          serviceType: formData.serviceType,
          brief: finalBrief,
          _hp: formData._hp,
          _ts: formLoadedAtRef.current,
        }),
      });

      const data = await response.json();

      if (!response.ok || !data.ok) {
        setSubmitStatus({
          type: "error",
          message: data.error || "Failed to submit project brief. Please check your information.",
        });
      } else {
        setSubmitStatus({
          type: "success",
          message: "⚡ Brief dispatched! Our stage director has received your specifications and will respond within 24 hours.",
        });
        setFormData({
          fullName: "",
          email: "",
          serviceType: "Stage Design & Arena Rigging",
          brief: "",
          attachmentUrl: "",
          _hp: "",
        });
        formLoadedAtRef.current = Date.now();
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message: "Network error occurred while sending your brief. Please verify your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto pt-3 sm:pt-6 pb-6 flex flex-col justify-start">
      <div className="border-3 border-black dark:border-zinc-700 bg-white dark:bg-[#151520] rounded-2xl p-3.5 sm:p-4 lg:p-5 comic-shadow relative mt-1.5">
        <div className="absolute -top-3.5 left-1/2 -translate-x-1/2 bg-yellow-300 text-black border-2 border-black px-4 py-1 font-headline font-black text-[10px] sm:text-xs uppercase tracking-widest comic-shadow-sm -rotate-1 z-20">
          {content.stageTag}
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-5 items-start pt-2">
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-3"
          >
            <h2 className="font-headline font-black text-xl sm:text-2xl lg:text-3xl text-black dark:text-white tracking-tight leading-tight">
              {content.headline}
            </h2>
            <p className="font-body text-xs sm:text-sm text-black/80 dark:text-zinc-300 leading-relaxed">
              {content.description}
            </p>

            <div className="border-2 border-black dark:border-zinc-700 rounded-xl p-2 bg-yellow-50 dark:bg-[#1C1C28] relative">
              <div className="aspect-[16/9] min-h-[170px] sm:min-h-[200px] lg:min-h-[220px] rounded-lg overflow-hidden border border-black dark:border-zinc-700 bg-white dark:bg-[#0E0E14] relative">
                <Image
                  src={content.intakeImage}
                  alt={content.intakeImageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover object-center"
                />
              </div>
              <div className="mt-1.5 text-center text-[10px] sm:text-xs font-headline font-bold text-black/70 dark:text-zinc-400">
                {content.intakeLabel}
              </div>
            </div>

            <div className="space-y-1.5 text-xs font-headline font-bold text-black dark:text-zinc-200">
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-black border border-black flex items-center justify-center font-bold text-[10px]">
                  @
                </span>
                <a href={`mailto:${content.email}`} className="hover:underline">{content.email}</a>
              </div>
              <div className="flex items-center gap-2">
                <span className="w-5 h-5 rounded-full bg-yellow-400 text-black border border-black flex items-center justify-center font-bold text-[10px]">
                  📍
                </span>
                <span>{content.studioLocations}</span>
              </div>
            </div>
          </motion.div>

          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white dark:bg-[#181824] border-2 border-black dark:border-zinc-700 rounded-xl p-4 sm:p-5 comic-shadow-sm"
          >
            {submitStatus.type === "success" && (
              <div className="mb-2.5 p-2.5 bg-emerald-50 dark:bg-emerald-950/40 border border-emerald-500 rounded text-emerald-800 dark:text-emerald-300 text-xs flex items-center gap-2">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-500" />
                <p className="font-body">{submitStatus.message}</p>
              </div>
            )}

            {submitStatus.type === "error" && (
              <div className="mb-2.5 p-2.5 bg-rose-50 dark:bg-rose-950/40 border border-rose-500 rounded text-rose-800 dark:text-rose-300 text-xs flex items-center gap-2">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-500" />
                <p className="font-body">{submitStatus.message}</p>
              </div>
            )}

            <form className="space-y-2" onSubmit={handleSubmit}>
              {/* Invisible Honeypot field for bot deterrence */}
              <div
                style={{
                  position: "absolute",
                  left: "-9999px",
                  top: "-9999px",
                  opacity: 0,
                  pointerEvents: "none",
                }}
                aria-hidden="true"
              >
                <input
                  type="text"
                  name="_hp"
                  tabIndex={-1}
                  value={formData._hp}
                  onChange={(e) => setFormData({ ...formData, _hp: e.target.value })}
                  autoComplete="off"
                />
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block font-headline font-bold text-xs uppercase mb-1 text-black dark:text-zinc-300">
                    Your Name / Title
                  </label>
                  <input
                    className="w-full border-2 border-black dark:border-zinc-700 rounded-xl p-2.5 sm:p-3 font-body text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                    placeholder="Alex Mercer, Head of Brand"
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) => setFormData({ ...formData, fullName: e.target.value })}
                  />
                </div>
                <div>
                  <label className="block font-headline font-bold text-xs uppercase mb-1 text-black dark:text-zinc-300">
                    Email Address
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
                  Target Service
                </label>
                <div className="flex flex-wrap gap-1.5">
                  {serviceOptions.map((opt) => (
                    <button
                      key={opt}
                      type="button"
                      onClick={() => setFormData({ ...formData, serviceType: opt })}
                      className={`text-[10px] sm:text-xs font-headline font-bold px-3 py-1 rounded-lg border transition-all cursor-pointer ${
                        formData.serviceType === opt
                          ? "bg-yellow-400 text-black border-black shadow-[2px_2px_0px_#000]"
                          : "bg-zinc-100 dark:bg-zinc-800 text-black/70 dark:text-zinc-300 border-zinc-300 dark:border-zinc-700 hover:border-black dark:hover:border-white"
                      }`}
                    >
                      {opt}
                    </button>
                  ))}
                </div>
              </div>

              <div>
                <label className="block font-headline font-bold text-xs uppercase mb-1 text-black dark:text-zinc-300">
                  {formData.serviceType === "Exhibition Booths"
                    ? "Booth Space Dimensions, Design Brief & Spatial Vision"
                    : "The Core Brief / Vision Constraints"}
                </label>
                <textarea
                  className="w-full border-2 border-black dark:border-zinc-700 rounded-xl p-2.5 sm:p-3 font-body text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                  placeholder={
                    formData.serviceType === "Exhibition Booths"
                      ? "Specify stand dimensions (e.g. 6x6m island), height limits, custom CNC woodwork, and 3D render needs (min 10 characters)..."
                      : "Describe your arena, product launch, or brand evolution requirements (min 10 characters)..."
                  }
                  required
                  rows={3}
                  value={formData.brief}
                  onChange={(e) => setFormData({ ...formData, brief: e.target.value })}
                ></textarea>
              </div>

              {formData.serviceType === "Exhibition Booths" && (
                <div>
                  <label className="block font-headline font-bold text-xs uppercase mb-1 text-black dark:text-zinc-300 flex items-center justify-between">
                    <span>Attach Floorplan / 3D Reference (PDF or Image URL)</span>
                    <span className="text-[10px] text-black/50 dark:text-zinc-500 font-normal lowercase">(optional)</span>
                  </label>
                  <input
                    type="url"
                    placeholder="https://... (Link to your booth floorplan PDF, Google Drive, or render image)"
                    value={formData.attachmentUrl}
                    onChange={(e) => setFormData({ ...formData, attachmentUrl: e.target.value })}
                    className="w-full border-2 border-black dark:border-zinc-700 rounded-xl p-2.5 sm:p-3 font-body text-xs sm:text-sm focus:ring-2 focus:ring-yellow-400 focus:outline-none bg-white dark:bg-[#12121A] text-black dark:text-white placeholder:text-black/40 dark:placeholder:text-zinc-500"
                  />
                </div>
              )}

              <div className="flex items-center justify-between pt-1">
                <span className="text-[10px] sm:text-xs font-body text-black/60 dark:text-zinc-400">
                  ⚡ 24h rapid response standard
                </span>
                <MagneticButton soundType="pop">
                  <button
                    className="inline-flex items-center gap-2 bg-yellow-400 hover:bg-black hover:text-white dark:hover:bg-yellow-300 dark:hover:text-black text-black font-headline font-black text-xs sm:text-sm px-5 py-2.5 rounded-xl border-2 border-black comic-shadow-sm active:scale-95 transition-all cursor-pointer disabled:opacity-50"
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
    </div>
  );
});
