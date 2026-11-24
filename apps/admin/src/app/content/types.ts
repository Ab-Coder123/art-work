import type { Locale, SiteContent } from "@art-work/types";

export type EditorSectionKey = Exclude<keyof SiteContent, "version" | "updatedAt">;

export type UpdateSectionFn = <K extends EditorSectionKey>(
  section: K,
  updater: (prev: SiteContent[K]) => SiteContent[K]
) => void;

export interface RevisionItem {
  id: string;
  sectionKey: string;
  locale?: Locale;
  action: string;
  actorEmail: string;
  createdAt: string;
  beforeState: Record<string, unknown> | null;
  afterState: Record<string, unknown> | null;
}

export const SECTION_TABS: Array<{
  key: EditorSectionKey;
  label: string;
  targetRoute: string;
}> = [
  { key: "manifesto", label: "01 Home Hero & Partners", targetRoute: "/#stage-01" },
  { key: "whyUsTeaser", label: "02 Home Why-Us", targetRoute: "/#stage-02" },
  { key: "services", label: "03 Home Services", targetRoute: "/#stage-03" },
  { key: "homeShowcase", label: "04 Home Video & Showcase", targetRoute: "/#gallery-showcase" },
  { key: "contact", label: "05 Home Contact & Brief", targetRoute: "/#stage-04" },
  { key: "whyUsPage", label: "06 /why-us Page", targetRoute: "/why-us" },
  { key: "galleryPage", label: "07 /gallery Page", targetRoute: "/gallery" },
  { key: "layout", label: "08 Header & Footer", targetRoute: "Global (All Pages)" },
];

export const INPUT_CLS =
  "w-full bg-[#0d0d12] border border-[#2b2b3d] rounded-xl px-3.5 py-2.5 text-xs text-white focus:outline-none focus:border-yellow-400";

export const LABEL_CLS = "block text-xs font-mono text-zinc-400 mb-1";
