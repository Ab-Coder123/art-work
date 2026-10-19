"use client";

import React from "react";
import Link from "next/link";
import { usePathname } from "next/navigation";
import {
  FileText,
  FolderKanban,
  LayoutDashboard,
  ExternalLink,
  ShieldCheck,
  Sparkles,
} from "lucide-react";

export function AdminSidebar() {
  const pathname = usePathname();

  const navItems = [
    {
      label: "Overview",
      href: "/",
      icon: LayoutDashboard,
      active: pathname === "/",
    },
    {
      label: "Website Content",
      href: "/content",
      icon: FileText,
      active: pathname.startsWith("/content"),
      badge: "Core",
    },
    {
      label: "Gallery Projects",
      href: "/projects",
      icon: FolderKanban,
      active: pathname.startsWith("/projects"),
      badge: "6 Items",
    },
  ];

  return (
    <aside className="w-64 bg-[#12121a] border-r border-[#262638] flex flex-col justify-between shrink-0 h-screen sticky top-0">
      <div>
        {/* Brand Banner */}
        <div className="p-6 border-b border-[#262638]">
          <div className="flex items-center gap-3">
            <div className="w-9 h-9 rounded-xl bg-yellow-400 text-black flex items-center justify-center font-black text-sm shadow-[2px_2px_0px_#ffffff]">
              AW
            </div>
            <div>
              <h1 className="font-bold text-sm tracking-wide text-white uppercase flex items-center gap-1.5">
                ART WORK
                <span className="text-[10px] bg-yellow-400/20 text-yellow-400 px-1.5 py-0.5 rounded border border-yellow-400/30">
                  ADMIN
                </span>
              </h1>
              <p className="text-[11px] text-zinc-400 font-mono">Control Center v1.0</p>
            </div>
          </div>
        </div>

        {/* Navigation */}
        <nav className="p-4 space-y-1.5">
          <div className="text-[10px] font-mono uppercase tracking-wider text-zinc-400 px-3 py-1 font-semibold">
            WORKSPACE DESTINATIONS
          </div>
          {navItems.map((item) => {
            const Icon = item.icon;
            return (
              <Link
                key={item.href}
                href={item.href}
                className={`flex items-center justify-between px-3.5 py-2.5 rounded-xl font-medium text-xs transition-all ${
                  item.active
                    ? "bg-yellow-400 text-black font-bold shadow-[2px_2px_0px_#ffffff]"
                    : "text-zinc-300 hover:text-white hover:bg-[#1a1a26]"
                }`}
              >
                <div className="flex items-center gap-2.5">
                  <Icon className={`w-4 h-4 ${item.active ? "text-black" : "text-zinc-400"}`} />
                  <span>{item.label}</span>
                </div>
                {item.badge && (
                  <span
                    className={`text-[10px] px-1.5 py-0.5 rounded font-mono ${
                      item.active
                        ? "bg-black/20 text-black"
                        : "bg-[#262638] text-zinc-300"
                    }`}
                  >
                    {item.badge}
                  </span>
                )}
              </Link>
            );
          })}
        </nav>
      </div>

      {/* Footer System Status */}
      <div className="p-4 border-t border-[#262638] space-y-3">
        <a
          href="http://localhost:3000"
          target="_blank"
          rel="noopener noreferrer"
          className="flex items-center justify-between px-3 py-2 rounded-lg bg-[#181824] hover:bg-[#202030] text-zinc-300 hover:text-white text-xs transition-colors border border-[#2b2b3d]"
        >
          <span className="flex items-center gap-2">
            <ExternalLink className="w-3.5 h-3.5 text-yellow-400" />
            <span>Open Public Site</span>
          </span>
          <span className="text-[10px] font-mono text-zinc-400">:3000</span>
        </a>

        <div className="px-2 flex items-center justify-between text-[11px] font-mono text-zinc-400">
          <span className="flex items-center gap-1.5">
            <span className="w-2 h-2 rounded-full bg-emerald-400 animate-pulse"></span>
            <span>Monorepo Active</span>
          </span>
          <span className="flex items-center gap-1">
            <ShieldCheck className="w-3.5 h-3.5 text-zinc-400" />
            <span>Isolated</span>
          </span>
        </div>
      </div>
    </aside>
  );
}
