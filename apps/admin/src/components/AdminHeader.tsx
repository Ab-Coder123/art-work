"use client";

import React from "react";
import { Sparkles, Activity, Clock } from "lucide-react";

interface AdminHeaderProps {
  title: string;
  subtitle?: string;
  action?: React.ReactNode;
}

export function AdminHeader({ title, subtitle, action }: AdminHeaderProps) {
  return (
    <header className="px-8 py-5 border-b border-[#262638] bg-[#12121a]/80 backdrop-blur-md sticky top-0 z-20 flex items-center justify-between">
      <div>
        <div className="flex items-center gap-2 mb-1">
          <span className="text-[10px] font-mono tracking-widest text-yellow-400 uppercase font-bold bg-yellow-400/10 px-2 py-0.5 rounded border border-yellow-400/20">
            DASHBOARD // STANDALONE APP
          </span>
          <span className="text-[10px] font-mono text-zinc-500">•</span>
          <span className="text-[10px] font-mono text-zinc-400">PORT 3001</span>
        </div>
        <h2 className="text-xl font-bold tracking-tight text-white">{title}</h2>
        {subtitle && <p className="text-xs text-zinc-400 mt-0.5">{subtitle}</p>}
      </div>

      <div className="flex items-center gap-3">
        {action}
      </div>
    </header>
  );
}
