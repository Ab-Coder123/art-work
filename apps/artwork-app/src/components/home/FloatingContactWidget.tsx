"use client";

import React, { useEffect, useState } from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import { Mail } from "lucide-react";
import { getUiDictionary } from "@art-work/types";
import { useShowcaseStore } from "@/store/useShowcaseStore";

export function FloatingContactWidget() {
  const pathname = usePathname();
  const locale = useShowcaseStore((s) => s.locale);
  const storePhone = useShowcaseStore((s) => s.siteContent.contact.phone);
  const dict = getUiDictionary(locale);
  const [phone, setPhone] = useState<string>(storePhone || "01092611230");

  useEffect(() => {
    if (storePhone) {
      setPhone(storePhone);
    }
  }, [storePhone]);

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
      aria-label={dict.floatingDock.ariaLabel}
      className="fixed end-4 sm:end-6 bottom-6 sm:bottom-8 z-50 flex flex-col items-center gap-3 select-none pointer-events-auto"
    >
      {/* 1. BLUE ACTION BUTTON: Email / Direct Brief Spec */}
      <Link
        href="/#stage-04"
        onClick={handleEmailClick}
        aria-label={dict.floatingDock.emailTooltip}
        title={dict.floatingDock.emailTooltip}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#1D4ED8] hover:bg-[#1E40AF] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(29,78,216,0.4)] hover:shadow-[0_6px_20px_rgba(29,78,216,0.6)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
      >
        <Mail className="w-5 h-5 text-white stroke-[2.2]" />
      </Link>

      {/* 2. GREEN ACTION BUTTON: Direct WhatsApp Chat Bubble */}
      <a
        href={whatsappUrl}
        target="_blank"
        rel="noopener noreferrer"
        aria-label={dict.floatingDock.whatsappTooltip}
        title={dict.floatingDock.whatsappTooltip}
        className="w-11 h-11 sm:w-12 sm:h-12 rounded-full bg-[#25D366] hover:bg-[#20bd5a] text-white flex items-center justify-center shadow-[0_4px_14px_rgba(37,211,102,0.4)] hover:shadow-[0_6px_20px_rgba(37,211,102,0.6)] hover:scale-110 active:scale-95 transition-all duration-200 cursor-pointer border border-white/20"
      >
        <svg
          className="w-5 h-5 fill-white"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path
            fillRule="evenodd"
            clipRule="evenodd"
            d="M12.04 2C6.58 2 2.13 6.45 2.13 11.91C2.13 13.66 2.59 15.36 3.45 16.86L2.05 22L7.3 20.62C8.75 21.41 10.38 21.83 12.04 21.83C17.5 21.83 21.95 17.38 21.95 11.92C21.95 9.27 20.92 6.78 19.05 4.91C17.18 3.04 14.69 2 12.04 2ZM12.04 20.15C10.56 20.15 9.11 19.75 7.84 19L7.54 18.82L4.42 19.64L5.25 16.6L5.05 16.29C4.24 15 3.81 13.48 3.81 11.91C3.81 7.37 7.51 3.67 12.05 3.67C14.25 3.67 16.32 4.53 17.87 6.09C19.42 7.64 20.28 9.72 20.28 11.92C20.28 16.46 16.58 20.15 12.04 20.15ZM16.56 13.99C16.31 13.87 15.09 13.27 14.86 13.18C14.63 13.1 14.47 13.06 14.3 13.3C14.13 13.55 13.66 14.11 13.51 14.27C13.37 14.44 13.22 14.46 12.97 14.33C12.72 14.21 11.92 13.94 10.97 13.1C10.23 12.44 9.73 11.63 9.58 11.38C9.44 11.13 9.56 11 9.69 10.87C9.8 10.76 9.94 10.58 10.06 10.44C10.18 10.3 10.23 10.19 10.31 10.03C10.39 9.86 10.35 9.72 10.29 9.6C10.23 9.48 9.67 8.14 9.47 7.64C9.27 7.16 9.06 7.22 8.91 7.21H8.43C8.26 7.21 8 7.27 7.77 7.52C7.55 7.77 6.91 8.36 6.91 9.57C6.91 10.79 7.79 11.96 7.92 12.13C8.05 12.3 9.67 14.79 12.15 15.86C12.74 16.11 13.2 16.27 13.56 16.38C14.15 16.57 14.69 16.54 15.12 16.48C15.6 16.41 16.59 15.88 16.8 15.3C17.01 14.72 17.01 14.23 16.95 14.12C16.89 14 16.73 13.93 16.48 13.8L16.56 13.99Z"
          />
        </svg>
      </a>
    </div>
  );
}
