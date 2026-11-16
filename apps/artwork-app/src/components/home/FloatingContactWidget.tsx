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

  const effectivePhone =
    !phone ||
    phone.includes("2794") ||
    phone.includes("ART-WORK") ||
    phone.includes("1800") ||
    phone.includes("DMX-EXT")
      ? "01092611230"
      : phone;

  const rawDigits = effectivePhone.replace(/\D/g, "");
  const phoneClean =
    rawDigits.length < 9
      ? "201092611230"
      : rawDigits.startsWith("01") && rawDigits.length === 11
      ? `2${rawDigits}`
      : rawDigits.startsWith("201") && rawDigits.length === 12
      ? rawDigits
      : rawDigits.startsWith("1") && rawDigits.length === 10
      ? `20${rawDigits}`
      : "201092611230";

  const whatsappUrl = `https://wa.me/${phoneClean}`;

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
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
      >
        <svg
          className="w-5 h-5 fill-current text-white"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M17.472 14.382c-.297-.149-1.758-.867-2.03-.967-.273-.099-.471-.148-.67.15-.197.297-.767.966-.94 1.164-.173.199-.347.223-.644.075-.297-.15-1.255-.463-2.39-1.475-.883-.788-1.48-1.761-1.653-2.059-.173-.297-.018-.458.13-.606.134-.133.298-.347.446-.52.149-.174.198-.298.298-.497.099-.198.05-.371-.025-.52-.075-.149-.669-1.612-.916-2.207-.242-.579-.487-.5-.669-.51-.173-.008-.371-.01-.57-.01-.198 0-.52.074-.792.372-.272.297-1.04 1.016-1.04 2.479 0 1.462 1.065 2.875 1.213 3.074.149.198 2.096 3.2 5.077 4.487.709.306 1.262.489 1.694.625.712.227 1.36.195 1.871.118.571-.085 1.758-.719 2.006-1.413.248-.694.248-1.289.173-1.413-.074-.124-.272-.198-.57-.347m-5.421 7.403h-.004a9.87 9.87 0 01-5.031-1.378l-.361-.214-3.741.982.998-3.648-.235-.374a9.86 9.86 0 01-1.51-5.26c.001-5.45 4.436-9.884 9.888-9.884 2.64 0 5.122 1.03 6.988 2.898a9.825 9.825 0 012.893 6.994c-.003 5.45-4.437 9.884-9.885 9.884m8.413-18.297A11.815 11.815 0 0012.05 0C5.495 0 .16 5.335.157 11.892c0 2.096.547 4.142 1.588 5.945L.057 24l6.305-1.654a11.882 11.882 0 005.683 1.448h.005c6.554 0 11.89-5.335 11.893-11.893a11.821 11.821 0 00-3.48-8.413Z" />
        </svg>
      </a>
    </div>
  );
}
