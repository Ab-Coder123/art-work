"use client";

import React from "react";
import Link from "next/link";
import { AdminHeader } from "@/components/AdminHeader";
import {
  FileText,
  FolderKanban,
  ArrowRight,
  Layers,
  Sparkles,
  CheckCircle2,
  Box,
} from "lucide-react";

export default function AdminOverviewPage() {
  const stats = [
    { label: "Published Projects", value: "6", change: "100% Live", icon: FolderKanban, color: "text-emerald-400" },
    { label: "Content Sections", value: "4", change: "Home & Why Us", icon: FileText, color: "text-yellow-400" },
    { label: "Monorepo Apps", value: "2", change: "web + admin", icon: Box, color: "text-blue-400" },
    { label: "Build Engine", value: "Turbo", change: "Cached & Fast", icon: Sparkles, color: "text-purple-400" },
  ];

  return (
    <div className="flex-1 flex flex-col">
      <AdminHeader
        title="Studio Control Center"
        subtitle="Monorepo standalone administrative panel for Art Work Marketing Solutions"
      />

      <main className="p-8 space-y-8 max-w-6xl">
        {/* Metric Cards Grid */}
        <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-4 gap-4">
          {stats.map((stat) => {
            const Icon = stat.icon;
            return (
              <div
                key={stat.label}
                className="p-5 rounded-2xl bg-[#151520] border border-[#262638] flex flex-col justify-between"
              >
                <div className="flex items-center justify-between text-zinc-400 mb-3">
                  <span className="text-xs font-mono font-medium">{stat.label}</span>
                  <Icon className={`w-4 h-4 ${stat.color}`} />
                </div>
                <div>
                  <div className="text-3xl font-black text-white font-headline tracking-tight">{stat.value}</div>
                  <div className="text-[11px] font-mono text-zinc-400 mt-1 flex items-center gap-1">
                    <CheckCircle2 className="w-3 h-3 text-emerald-400" />
                    <span>{stat.change}</span>
                  </div>
                </div>
              </div>
            );
          })}
        </div>

        {/* Primary Destination Modules */}
        <div>
          <div className="flex items-center justify-between mb-4">
            <h3 className="text-sm font-bold text-white uppercase tracking-wider font-mono">
              DIRECT MANAGEMENT DESTINATIONS
            </h3>
            <span className="text-xs text-zinc-400 font-mono">2 modules configured</span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
            {/* Card 1: Website Content */}
            <Link
              href="/content"
              className="group p-6 rounded-2xl bg-[#151520] hover:bg-[#1a1a28] border border-[#262638] hover:border-yellow-400/50 transition-all flex flex-col justify-between relative overflow-hidden shadow-lg"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-yellow-400/10 text-yellow-400 flex items-center justify-center border border-yellow-400/20 group-hover:scale-110 transition-transform">
                  <FileText className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <span>Website Content Editor</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Manage headline segments, manifesto intro, proof metrics, Why-Us bento cards, blueprint schematics, and client intake contact copy.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#262638] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Targets: / and /why-us</span>
                <span className="text-yellow-400 font-bold group-hover:underline">Edit Copy →</span>
              </div>
            </Link>

            {/* Card 2: Gallery Projects */}
            <Link
              href="/projects"
              className="group p-6 rounded-2xl bg-[#151520] hover:bg-[#1a1a28] border border-[#262638] hover:border-yellow-400/50 transition-all flex flex-col justify-between relative overflow-hidden shadow-lg"
            >
              <div className="space-y-3">
                <div className="w-12 h-12 rounded-xl bg-blue-500/10 text-blue-400 flex items-center justify-center border border-blue-500/20 group-hover:scale-110 transition-transform">
                  <FolderKanban className="w-6 h-6" />
                </div>
                <h4 className="text-lg font-bold text-white group-hover:text-yellow-400 transition-colors flex items-center gap-2">
                  <span>Gallery Projects Manager</span>
                  <ArrowRight className="w-4 h-4 group-hover:translate-x-1 transition-transform" />
                </h4>
                <p className="text-xs text-zinc-400 leading-relaxed">
                  Full CRUD lifecycle for showcase works. Reorder cards, assign categories (stage, booths, conferences, led), update CAD IDs, stamps, and specs.
                </p>
              </div>

              <div className="mt-6 pt-4 border-t border-[#262638] flex items-center justify-between text-xs font-mono text-zinc-400">
                <span>Targets: /gallery modal & grid</span>
                <span className="text-yellow-400 font-bold group-hover:underline">Manage Works →</span>
              </div>
            </Link>
          </div>
        </div>

        {/* Monorepo Architecture Overview */}
        <div className="p-6 rounded-2xl bg-[#12121a] border border-[#262638] space-y-4">
          <div className="flex items-center justify-between">
            <h4 className="text-xs font-bold uppercase tracking-wider text-zinc-300 font-mono flex items-center gap-2">
              <Layers className="w-4 h-4 text-yellow-400" />
              <span>Turborepo Workspace Architecture</span>
            </h4>
            <span className="text-[11px] font-mono text-emerald-400 bg-emerald-400/10 px-2 py-0.5 rounded border border-emerald-400/20">
              pnpm workspaces
            </span>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-3 gap-3 text-xs font-mono">
            <div className="p-3 rounded-xl bg-[#181824] border border-[#232334]">
              <div className="text-yellow-400 font-bold mb-1">apps/web</div>
              <div className="text-zinc-400 text-[11px]">Next.js 15 Client Marketing Site (Port 3000)</div>
            </div>
            <div className="p-3 rounded-xl bg-[#181824] border border-[#232334]">
              <div className="text-yellow-400 font-bold mb-1">apps/admin</div>
              <div className="text-zinc-400 text-[11px]">Next.js 15 Standalone Dashboard (Port 3001)</div>
            </div>
            <div className="p-3 rounded-xl bg-[#181824] border border-[#232334]">
              <div className="text-yellow-400 font-bold mb-1">packages/types</div>
              <div className="text-zinc-400 text-[11px]">Shared TypeScript Content Schemas</div>
            </div>
          </div>
        </div>
      </main>
    </div>
  );
}
