"use client";

import React from "react";
import { MessageCircle, Mail } from "lucide-react";

interface FloatingContactFabProps {
  whatsappPhone?: string;
  onOpenBrief?: () => void;
}

export const FloatingContactFab = React.memo(function FloatingContactFab({
  whatsappPhone = "+20 (2) 2794-0000",
  onOpenBrief,
}: FloatingContactFabProps) {
  const whatsappDigits = (whatsappPhone || "+20 (2) 2794-0000").replace(/\D/g, "") || "20227940000";

  const handleEmailClick = () => {
    if (onOpenBrief) {
      onOpenBrief();
      return;
    }
    if (typeof window !== "undefined") {
      window.dispatchEvent(
        new CustomEvent("artwork:navigate-stage", { detail: { stage: "stage-04" } })
      );
      const briefEl = document.getElementById("brief-inquiry");
      if (briefEl) {
        briefEl.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  return (
    <aside
      aria-label="Direct Quick Contact Channels"
      className="fixed bottom-5 right-5 sm:bottom-6 sm:right-6 z-50 flex flex-col items-center gap-2.5 pointer-events-auto"
    >
      {/* Email / Brief Inquiry Floating Button (EKO Style Blue/Accent Pill) */}
      <button
        onClick={handleEmailClick}
        title="Send a Project Brief"
        aria-label="Send a Project Brief"
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1e40af] hover:bg-[#2563eb] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(30,64,175,0.45)] ring-1 ring-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
      >
        <Mail className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[2.2]" />
      </button>

      {/* WhatsApp Floating Button (EKO Style Emerald Green) */}
      <a
        href={`https://wa.me/${whatsappDigits}`}
        target="_blank"
        rel="noopener noreferrer"
        title={`Chat on WhatsApp (${whatsappPhone})`}
        aria-label={`Chat on WhatsApp (${whatsappPhone})`}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#10b981] hover:bg-[#059669] text-white flex items-center justify-center shadow-[0_8px_24px_rgba(16,185,129,0.45)] ring-1 ring-white/20 hover:scale-105 active:scale-95 transition-all duration-200 cursor-pointer group"
      >
        <MessageCircle className="w-5 h-5 group-hover:scale-110 transition-transform stroke-[2.2] fill-current" />
      </a>
    </aside>
  );
});
