"use client";

import React, { useState, useRef, useEffect, useMemo } from "react";
import Image from "next/image";
import { motion } from "framer-motion";
import {
  CheckCircle2,
  AlertCircle,
  Loader2,
  Send,
  MessageCircle,
  Mail,
  MapPin,
  Sparkles,
} from "lucide-react";
import { soundFX } from "@/utils/soundFX";
import { MagneticButton } from "@/components/cinematic/MagneticButton";
import { DeliveryProcessTimeline } from "./DeliveryProcessTimeline";
import type { ContactSectionProps } from "./types";

const DEFAULT_SERVICE_OPTIONS = [
  "Stage Design & Arena Rigging",
  "Conferences & Keynote LED",
  "Exhibition Booths",
  "Brand Architecture",
  "Custom Rigging & Tech",
];

export const ContactSection = React.memo(function ContactSection({
  content,
}: ContactSectionProps) {
  const serviceOptions = useMemo(
    () =>
      Array.isArray(content.serviceOptions) && content.serviceOptions.length > 0
        ? content.serviceOptions
        : DEFAULT_SERVICE_OPTIONS,
    [content.serviceOptions]
  );

  const fieldMap = useMemo(() => {
    const fields = Array.isArray(content.formFields) ? content.formFields : [];
    const findField = (name: string) => fields.find((f) => f.name === name);
    return {
      fullName: findField("fullName"),
      email: findField("email"),
      serviceType: findField("serviceType"),
      brief: findField("brief"),
    };
  }, [content.formFields]);

  const [formData, setFormData] = useState({
    fullName: "",
    email: "",
    serviceType: serviceOptions[0] || "Stage Design & Arena Rigging",
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

    const handleQuickIntake = (e: Event) => {
      const customEvent = e as CustomEvent<{ fullName?: string; contact?: string }>;
      if (customEvent.detail) {
        setFormData((prev) => ({
          ...prev,
          fullName: customEvent.detail.fullName || prev.fullName,
          email: customEvent.detail.contact?.includes("@")
            ? customEvent.detail.contact
            : prev.email,
          brief:
            !customEvent.detail.contact?.includes("@") && customEvent.detail.contact
              ? `[Quick WhatsApp / Contact]: ${customEvent.detail.contact}\n${prev.brief}`
              : prev.brief,
        }));
      }
    };

    if (typeof window !== "undefined") {
      window.addEventListener("artwork:quick-intake", handleQuickIntake);
    }

    return () => {
      if (typeof window !== "undefined") {
        window.removeEventListener("artwork:quick-intake", handleQuickIntake);
      }
    };
  }, []);

  useEffect(() => {
    if (serviceOptions.length > 0 && !serviceOptions.includes(formData.serviceType)) {
      setFormData((prev) => ({ ...prev, serviceType: serviceOptions[0] }));
    }
  }, [serviceOptions, formData.serviceType]);

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
          message:
            data.error ||
            "Failed to submit project brief. Please check your information.",
        });
      } else {
        setSubmitStatus({
          type: "success",
          message:
            "⚡ Brief dispatched! Our stage director has received your specifications and will respond within 24 hours.",
        });
        setFormData({
          fullName: "",
          email: "",
          serviceType: serviceOptions[0] || "Stage Design & Arena Rigging",
          brief: "",
          attachmentUrl: "",
          _hp: "",
        });
        formLoadedAtRef.current = Date.now();
      }
    } catch {
      setSubmitStatus({
        type: "error",
        message:
          "Network error occurred while sending your brief. Please verify your connection.",
      });
    } finally {
      setIsSubmitting(false);
    }
  };

  return (
    <div className="w-full max-w-7xl mx-auto py-4 sm:py-6 flex flex-col justify-start">
      {/* EKO-Style How We Deliver Framework */}
      <DeliveryProcessTimeline />

      <div className="rounded-2xl p-6 sm:p-8 lg:p-10 bg-[#0a0a12] ring-1 ring-white/10 hover:ring-[#dcb858]/30 transition-all duration-300 shadow-2xl relative mt-4">
        {/* Stage Eyebrow Pill */}
        <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-[#dcb858]/15 ring-1 ring-[#dcb858]/40 text-[#dcb858] text-[11px] font-mono font-bold uppercase tracking-wider mb-6">
          <Sparkles className="w-3.5 h-3.5 text-[#dcb858]" />
          <span>{content.stageTag}</span>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-12 gap-8 items-start">
          {/* Left Column: Direct Consultation Details (Pages 4 & 5 Reference) */}
          <motion.div
            initial={{ opacity: 0, x: -20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-5 space-y-5"
          >
            <div>
              <h2 className="font-headline font-black text-2xl sm:text-3xl lg:text-4xl text-zinc-900 dark:text-white tracking-tight leading-tight mb-2.5">
                {content.headline}
              </h2>
              <p className="font-body text-xs sm:text-sm text-zinc-600 dark:text-zinc-400 leading-relaxed">
                {content.description}
              </p>
            </div>

            {/* Creative Director / Intake Visual */}
            <div className="rounded-xl overflow-hidden p-2 bg-zinc-100 dark:bg-[#060609] ring-1 ring-black/10 dark:ring-white/10">
              <div className="aspect-[16/9] min-h-[160px] sm:min-h-[190px] rounded-lg overflow-hidden bg-zinc-200 dark:bg-[#0a0a0f] ring-1 ring-black/10 dark:ring-white/10 relative">
                <Image
                  src={content.intakeImage}
                  alt={content.intakeImageAlt}
                  fill
                  sizes="(max-width: 1024px) 100vw, 30vw"
                  className="object-cover object-center"
                  unoptimized={
                    content.intakeImage.startsWith("http") ||
                    content.intakeImage.startsWith("data:")
                  }
                />
              </div>
              <div className="mt-2 text-center text-[11px] font-mono font-bold text-zinc-600 dark:text-zinc-400">
                {content.intakeLabel}
              </div>
            </div>

            {/* Direct Studio Contacts & WhatsApp (Page 5 Reference) */}
            <div className="space-y-2.5 text-xs font-mono text-zinc-700 dark:text-zinc-300">
              <div className="flex items-center gap-3 p-3 rounded-xl bg-white dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 shadow-sm dark:shadow-none">
                <div className="w-8 h-8 rounded-lg bg-[#dcb858]/15 ring-1 ring-[#dcb858]/30 flex items-center justify-center text-[#dcb858] shrink-0">
                  <Mail className="w-4 h-4" />
                </div>
                <div className="overflow-hidden">
                  <span className="text-[10px] text-zinc-500 uppercase block">Direct Inbox</span>
                  <a href={`mailto:${content.email}`} className="text-zinc-900 dark:text-white hover:text-[#dcb858] transition-colors truncate block font-bold">
                    {content.email}
                  </a>
                </div>
              </div>

              {content.phone && (
                <div className="flex items-center justify-between p-3 rounded-xl bg-white dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 shadow-sm dark:shadow-none">
                  <div className="flex items-center gap-3">
                    <div className="w-8 h-8 rounded-lg bg-emerald-500/15 ring-1 ring-emerald-500/30 flex items-center justify-center text-emerald-500 dark:text-emerald-400 shrink-0">
                      <MessageCircle className="w-4 h-4" />
                    </div>
                    <div>
                      <span className="text-[10px] text-zinc-500 uppercase block">WhatsApp Direct</span>
                      <a href={`tel:${content.phone}`} className="text-zinc-900 dark:text-white hover:text-emerald-500 transition-colors font-bold">
                        {content.phone}
                      </a>
                    </div>
                  </div>
                  <a
                    href={`https://wa.me/${content.phone.replace(/\D/g, "") || "20227940000"}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="px-3 py-1.5 rounded-lg bg-emerald-500/20 hover:bg-emerald-500 text-emerald-700 dark:text-emerald-300 hover:text-white dark:hover:text-black ring-1 ring-emerald-500/40 text-[11px] font-bold transition-all"
                  >
                    Open Chat ↗
                  </a>
                </div>
              )}

              <div className="flex items-start gap-3 p-3 rounded-xl bg-white dark:bg-white/5 ring-1 ring-black/10 dark:ring-white/10 shadow-sm dark:shadow-none">
                <div className="w-8 h-8 rounded-lg bg-[#dcb858]/15 ring-1 ring-[#dcb858]/30 flex items-center justify-center text-[#dcb858] shrink-0 mt-0.5">
                  <MapPin className="w-4 h-4" />
                </div>
                <div>
                  <span className="text-[10px] text-zinc-500 uppercase block">Studio Headquarters</span>
                  <a
                    href={`https://maps.google.com/?q=${encodeURIComponent(content.studioLocations)}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="text-zinc-900 dark:text-white hover:text-[#dcb858] transition-colors text-xs leading-relaxed block"
                    title="View on Google Maps"
                  >
                    {content.studioLocations}
                  </a>
                </div>
              </div>
            </div>
          </motion.div>

          {/* Right Column: Brief Intake Form (Page 1 & 4 Reference) */}
          <motion.div
            initial={{ opacity: 0, x: 20 }}
            whileInView={{ opacity: 1, x: 0 }}
            viewport={{ once: true, amount: 0.15 }}
            transition={{ duration: 0.45, delay: 0.1, ease: [0.22, 1, 0.36, 1] }}
            className="lg:col-span-7 bg-white dark:bg-[#0f0f18] ring-1 ring-black/10 dark:ring-white/10 rounded-2xl p-6 sm:p-7 shadow-xl"
          >
            {submitStatus.type === "success" && (
              <div className="mb-4 p-3 bg-emerald-500/10 ring-1 ring-emerald-500/30 rounded-xl text-emerald-400 text-xs flex items-center gap-2.5">
                <CheckCircle2 className="w-4 h-4 shrink-0 text-emerald-400" />
                <p className="font-body">{submitStatus.message}</p>
              </div>
            )}

            {submitStatus.type === "error" && (
              <div className="mb-4 p-3 bg-rose-500/10 ring-1 ring-rose-500/30 rounded-xl text-rose-400 text-xs flex items-center gap-2.5">
                <AlertCircle className="w-4 h-4 shrink-0 text-rose-400" />
                <p className="font-body">{submitStatus.message}</p>
              </div>
            )}

            <form className="space-y-4" onSubmit={handleSubmit}>
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

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-4">
                <div>
                  <label className="block font-mono text-xs uppercase mb-1.5 text-zinc-700 dark:text-zinc-300">
                    {fieldMap.fullName?.label || "Your Name / Title"}
                  </label>
                  <input
                    className="w-full rounded-xl p-3 font-body text-xs sm:text-sm bg-zinc-50 dark:bg-[#08080d] ring-1 ring-zinc-300 dark:ring-white/15 focus:ring-[#dcb858] focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all"
                    placeholder={
                      fieldMap.fullName?.placeholder || "Alex Mercer, Head of Brand"
                    }
                    required
                    type="text"
                    value={formData.fullName}
                    onChange={(e) =>
                      setFormData({ ...formData, fullName: e.target.value })
                    }
                  />
                </div>

                <div>
                  <label className="block font-mono text-xs uppercase mb-1.5 text-zinc-700 dark:text-zinc-300">
                    {fieldMap.email?.label || "Direct Inbox"}
                  </label>
                  <input
                    className="w-full rounded-xl p-3 font-body text-xs sm:text-sm bg-zinc-50 dark:bg-[#08080d] ring-1 ring-zinc-300 dark:ring-white/15 focus:ring-[#dcb858] focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all"
                    placeholder={
                      fieldMap.email?.placeholder || "director@brand.com"
                    }
                    required
                    type="email"
                    value={formData.email}
                    onChange={(e) =>
                      setFormData({ ...formData, email: e.target.value })
                    }
                  />
                </div>
              </div>

              {/* Target Service Selection Pills (Page 2 Reference) */}
              <div>
                <label className="block font-mono text-xs uppercase mb-1.5 text-zinc-700 dark:text-zinc-300">
                  {fieldMap.serviceType?.label || "Target Discipline"}
                </label>
                <div className="flex flex-wrap gap-2">
                  {content.serviceOptions && content.serviceOptions.length > 0 ? (
                    content.serviceOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setFormData({ ...formData, serviceType: opt })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          formData.serviceType === opt
                            ? "bg-[#dcb858] text-black font-bold ring-1 ring-[#dcb858] shadow-sm"
                            : "bg-zinc-100 dark:bg-[#08080d] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white ring-1 ring-zinc-200 dark:ring-white/10"
                        }`}
                      >
                        {opt}
                      </button>
                    ))
                  ) : (
                    serviceOptions.map((opt) => (
                      <button
                        type="button"
                        key={opt}
                        onClick={() => setFormData({ ...formData, serviceType: opt })}
                        className={`px-3 py-1.5 rounded-lg text-xs font-mono transition-all cursor-pointer ${
                          formData.serviceType === opt
                            ? "bg-[#dcb858] text-black font-bold ring-1 ring-[#dcb858] shadow-sm"
                            : "bg-zinc-100 dark:bg-[#08080d] text-zinc-600 dark:text-zinc-400 hover:text-black dark:hover:text-white ring-1 ring-zinc-200 dark:ring-white/10"
                        }`}
                      >
                        {opt}
                      </button>
                    ))
                  )}
                </div>
              </div>

              {/* Brief Parameters Textarea */}
              <div>
                <label className="block font-mono text-xs uppercase mb-1.5 text-zinc-700 dark:text-zinc-300">
                  {fieldMap.brief?.label || "Event Parameters & Vision"}
                </label>
                <textarea
                  className="w-full rounded-xl p-3 font-body text-xs sm:text-sm bg-zinc-50 dark:bg-[#08080d] ring-1 ring-zinc-300 dark:ring-white/15 focus:ring-[#dcb858] focus:outline-none text-zinc-900 dark:text-white placeholder:text-zinc-400 dark:placeholder:text-zinc-600 transition-all min-h-[90px]"
                  placeholder={
                    fieldMap.brief?.placeholder ||
                    "Brief your event format, dates, venue specs, or booth vision..."
                  }
                  required
                  rows={3}
                  value={formData.brief}
                  onChange={(e) =>
                    setFormData({ ...formData, brief: e.target.value })
                  }
                ></textarea>
              </div>

              {/* Submit Button */}
              <div className="pt-2">
                <MagneticButton className="w-full">
                  <button
                    className="w-full flex items-center justify-center gap-2 px-6 py-3.5 bg-[#dcb858] hover:bg-[#e6c975] active:scale-[0.99] text-black font-headline text-xs sm:text-sm font-black uppercase tracking-wider rounded-xl transition-all cursor-pointer shadow-lg disabled:opacity-50"
                    disabled={isSubmitting}
                    type="submit"
                  >
                    {isSubmitting ? (
                      <>
                        <Loader2 className="w-4 h-4 animate-spin" />
                        <span>DISPATCHING EVENT BRIEF...</span>
                      </>
                    ) : (
                      <>
                        <span>{content.submitButtonText || "TRANSMIT EVENT BRIEF"}</span>
                        <Send className="w-4 h-4" />
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
