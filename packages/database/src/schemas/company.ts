import { z } from "zod";

export const COMPANY_CATEGORIES = [
  "all",
  "pharma",
  "entertainment",
  "tech",
  "real_estate",
  "festivals",
  "corporate",
] as const;

export const CompanyCategoryEnum = z.enum([
  "pharma",
  "entertainment",
  "tech",
  "real_estate",
  "festivals",
  "corporate",
]);

export const CompanyRecordSchema = z.object({
  id: z.string().uuid().optional(),
  slug: z
    .string()
    .min(2, "Slug must be at least 2 characters")
    .max(100, "Slug cannot exceed 100 characters")
    .regex(/^[a-z0-9]+(?:-[a-z0-9]+)*$/, "Slug must be lowercase alphanumeric with hyphens"),
  name: z.string().min(2, "Name must be at least 2 characters").max(120),
  logo_url: z.string().min(1, "Logo URL or SVG markup is required"),
  website_url: z.string().url("Must be a valid URL").nullable().optional().or(z.literal("")),
  category: CompanyCategoryEnum.default("corporate"),
  description: z.string().max(500).default(""),
  highlight: z.string().max(100).default(""),
  order_index: z.number().int().min(0).default(0),
  featured: z.boolean().default(false),
  is_active: z.boolean().default(true),
});

export const CreateCompanySchema = CompanyRecordSchema.omit({ id: true });
export const UpdateCompanySchema = CompanyRecordSchema.partial().omit({ id: true });

export type CompanySchemaType = z.infer<typeof CompanyRecordSchema>;
export type CreateCompanyInput = z.input<typeof CreateCompanySchema>;
export type UpdateCompanyInput = z.input<typeof UpdateCompanySchema>;
