"use client";

import React from "react";
import { Languages } from "lucide-react";
import { useShowcaseStore } from "@/store/useShowcaseStore";
import { getUiDictionary } from "@art-work/types";
import { soundFX } from "@/utils/soundFX";

export function LanguageToggle() {
  const locale = useShowcaseStore((s) => s.locale);
  const setLocale = useShowcaseStore((s) => s.setLocale);

  const nextLocale = locale === "ar" ? "en" : "ar";
  const dict = getUiDictionary(locale);

  const handleToggle = () => {
    soundFX.playClick();
    setLocale(nextLocale);
  };

  return (
    <button
      type="button"
      onClick={handleToggle}
      aria-label={dict.switchLanguageAria}
      title={dict.switchLanguageAria}
      data-testid="language-toggle"
      className="inline-flex items-center gap-1.5 h-8 sm:h-9 px-2.5 sm:px-3 rounded-DEFAULT border-2 border-black dark:border-zinc-400 bg-white dark:bg-[#181824] hover:bg-yellow-300 dark:hover:bg-yellow-400 text-black dark:text-zinc-100 hover:text-black dark:hover:text-black font-headline font-black text-[11px] sm:text-xs comic-shadow-sm active:scale-95 transition-all duration-150 cursor-pointer select-none"
    >
      <Languages className="w-3.5 h-3.5 shrink-0" />
      <span>{locale === "ar" ? "EN" : "عربي"}</span>
    </button>
  );
}
