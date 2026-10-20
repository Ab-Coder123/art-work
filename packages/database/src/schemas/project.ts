import { z } from "zod";
import { parseYouTubeInput } from "../media/youtube";

export const PROJECT_CATEGORIES = [
  "stage",
  "conferences",
  "booths",
  "branding",
  "tech",
  "led",
] as const;

export const CONTENT_STATUSES = ["draft", "published", "archived"] as const;

export const ProjectCategoryEnum = z.enum(PROJECT_CATEGORIES);
export type ProjectCategory = z.infer<typeof ProjectCategoryEnum>;

export const ContentStatusEnum = z.enum(CONTENT_STATUSES);
export type ContentStatus = z.infer<typeof ContentStatusEnum>;

/**
 * Validates canonical 11-character YouTube video ID.
 * Strictly prevents storing raw iframe HTML snippets.
 */
export const YouTubeVideoIdSchema = z
  .string()
  .regex(/^[a-zA-Z0-9_-]{11}$/, "YouTube video ID must be an exact 11-character identifier")
  .nullable()
  .optional();

/**
 * Validates URL format for optional YouTube links.
 */
export const YouTubeUrlSchema = z
  .string()
  .url("YouTube URL must be a valid URL")
  .refine(
    (url) => parseYouTubeInput(url).ok,
    "URL must be a valid link on an approved YouTube host with an 11-character video ID"
  )
  .nullable()
  .optional();

/**
 * Validates slug format: lowercase kebab-case (e.g. "neon-horizon-stage").
 */
export const SlugSchema = z
  .string()
  .min(2, "Slug must contain at least 2 characters")
  .max(100, "Slug cannot exceed 100 characters")
  .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens (e.g. 'project-slug')");

/**
 * Zod schema for project creation / update payloads.
 */
export const ProjectInputSchema = z.object({
  slug: SlugSchema,
  title: z.string().min(2, "Title must be at least 2 characters").max(200),
  client: z.string().min(2, "Client name must be at least 2 characters").max(150),
  category: ProjectCategoryEnum,
  year: z
    .number()
    .int("Year must be an integer")
    .min(2020, "Year must be 2020 or later")
    .max(2035, "Year cannot exceed 2035"),
  description: z.string().min(10, "Description must be at least 10 characters"),
  tags: z.array(z.string().min(1)).default([]),
  stamp: z.string().min(2, "Stamp is required (e.g. 'ARENA // 2026')"),
  meta_badge: z.string().min(2, "Meta badge is required (e.g. 'IMMERSIVE LED')"),
  cad_id: z.string().min(2, "CAD ID is required (e.g. 'CAD-REV-04')"),
  cover_image_url: z.string().min(1, "Cover image URL is required"),
  cover_image_alt: z.string().min(2, "Cover image alt text is required"),
  stats_primary: z.string().min(1, "Primary stat is required (e.g. '12,000+')"),
  stats_secondary: z.string().min(1, "Secondary stat label is required (e.g. 'ATTENDEES')"),
  specs: z.array(z.string().min(1)).default([]),
  youtube_video_id: YouTubeVideoIdSchema,
  youtube_url: YouTubeUrlSchema,
  youtube_title: z.string().max(300).nullable().optional(),
  youtube_description: z.string().max(2000).nullable().optional(),
  youtube_is_short: z.boolean().default(false),
  status: ContentStatusEnum.default("draft"),
  order_index: z.number().int().default(0),
  featured: z.boolean().default(false),
});

export type ProjectInput = z.infer<typeof ProjectInputSchema>;

/**
 * Database representation of a Project row.
 */
export interface ProjectRow extends ProjectInput {
  id: string; // UUID
  created_by?: string | null;
  updated_by?: string | null;
  created_at: string;
  updated_at: string;
}
