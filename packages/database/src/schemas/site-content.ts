import { z } from "zod";
import { ContentStatusEnum, type ContentStatus } from "./project.js";

export const SITE_SECTION_KEYS = [
  "hero",
  "manifesto",
  "capabilities",
  "why_us",
  "scrollytelling",
  "contact",
] as const;

export const SiteSectionKeyEnum = z.enum(SITE_SECTION_KEYS);
export type SiteSectionKey = z.infer<typeof SiteSectionKeyEnum>;

// 1. Hero Section Data Schema
export const HeroSectionDataSchema = z.object({
  headline_highlight: z.string().min(1),
  headline_suffix: z.string().min(1),
  subheadline: z.string().min(5),
  tags: z.array(z.string()).default([]),
  cta_primary_text: z.string().min(1),
  cta_primary_href: z.string().min(1),
  cta_secondary_text: z.string().min(1),
  cta_secondary_href: z.string().min(1),
  banner_badge: z.string().min(1),
});

// 2. Capabilities Section Data Schema
export const CapabilityCardSchema = z.object({
  id: z.string().min(1),
  title: z.string().min(1),
  category: z.string().min(1),
  description: z.string().min(5),
  icon_name: z.string().min(1),
  order_index: z.number().int().default(0),
});

export const CapabilitiesSectionDataSchema = z.object({
  heading: z.string().min(1),
  subheading: z.string().min(1),
  cards: z.array(CapabilityCardSchema),
});

// 3. Why Us Section Data Schema
export const MetricItemSchema = z.object({
  label: z.string().min(1),
  value: z.string().min(1),
  caption: z.string().optional(),
});

export const WhyUsSectionDataSchema = z.object({
  heading: z.string().min(1),
  manifesto_lead: z.string().min(1),
  paragraphs: z.array(z.string()).min(1),
  metrics: z.array(MetricItemSchema).default([]),
});

// 4. Scrollytelling Section Data Schema
export const ScrollytellingSectionDataSchema = z.object({
  stage_01_label: z.string().min(1),
  stage_02_label: z.string().min(1),
  stage_03_label: z.string().min(1),
  sound_fx_default: z.boolean().default(true),
});

// 5. Contact Section Data Schema
export const ContactSectionDataSchema = z.object({
  email: z.string().email(),
  phone: z.string().min(5),
  address: z.string().min(5),
  office_hours: z.string().min(2),
});

// Generic Site Content Data Schema (permits any valid JSON object matching the section structure)
export const SiteContentDataSchema = z.union([
  HeroSectionDataSchema,
  CapabilitiesSectionDataSchema,
  WhyUsSectionDataSchema,
  ScrollytellingSectionDataSchema,
  ContactSectionDataSchema,
  z.record(z.any()), // Fallback for customized CMS dynamic blocks
]);

/**
 * Zod schema for updating a site content section.
 */
export const SiteContentInputSchema = z.object({
  section_key: SiteSectionKeyEnum,
  data: SiteContentDataSchema,
  status: ContentStatusEnum.default("published"),
  version: z.number().int().min(1).default(1),
});

export type SiteContentInput = z.infer<typeof SiteContentInputSchema>;

export interface SiteContentRow {
  section_key: string;
  data: Record<string, any>;
  status: ContentStatus;
  version: number;
  updated_by?: string | null;
  updated_at: string;
}
