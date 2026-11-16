"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";

export function FloatingContactWidget() {
  const pathname = usePathname();
  const [phone, setPhone] = useState<string>("01092611230");

  useEffect(() => {
    let mounted = true;
    fetch("/api/content", { cache: "no-store" })
      .then((res) => (res.ok ? res.json() : null))
      .then((data) => {
        if (!mounted || !data) return;
        if (data.contact?.phone) {
          setPhone(data.contact.phone);
        }
      })
      .catch(() => {});
    return () => {
      mounted = false;
    };
  }, []);

  const phoneClean = phone.replace(/[^0-9]/g, "");
  const normalizedPhone = phoneClean.startsWith("0")
    ? `20${phoneClean.slice(1)}`
    : phoneClean.startsWith("20")
    ? phoneClean
    : `20${phoneClean || "201092611230"}`;
  const whatsappUrl = `https://wa.me/${normalizedPhone}`;

  const handleEmailClick = (e: React.MouseEvent<HTMLAnchorElement>) => {
    if (pathname === "/") {
      e.preventDefault();
      const target =
        document.getElementById("stage-04") ||
        document.getElementById("brief-inquiry");
      if (target) {
        target.scrollIntoView({ behavior: "smooth" });
        return;
      }
    }
  };

  return (
    <div
      aria-label="Floating Action Dock"
      className="fixed right-4 sm:right-6 bottom-6 sm:bottom-8 z-50 flex flex-col items-center gap-3 select-none pointer-events-auto"
    >
      {/* 1. BLUE ACTION BUTTON: Email / Direct Brief Spec */}
      <Link
        href="/#stage-04"
        onClick={handleEmailClick}
        aria-label="Send Project Brief / Email Inquiry"
        title="Send Project Brief / Email Inquiry"
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(29,78,216,0.4)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.6)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
      >
        <Mail className="w-5 h-5 text-white stroke-[2.2]" />
      </Link>

      {/* 2. GREEN ACTION BUTTON: Direct WhatsApp Chat Bubble */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label="Direct WhatsApp Chat"
        title="Direct WhatsApp Chat"
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#10B981] hover:bg-[#059669] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(16,185,129,0.4)] hover:shadow-[0_6px_20px_rgba(16,185,129,0.6)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
      >
        <svg
          className="w-5 h-5 fill-white text-white"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M12 2C6.477 2 2 6.477 2 12c0 1.821.487 3.53 1.338 5L2.5 21.5l4.646-.824A9.956 9.956 0 0 0 12 22c5.523 0 10-4.477 10-10S17.523 2 12 2Z" />
        </svg>
      </a>
    </div>
  );
}
