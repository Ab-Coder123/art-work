import { z } from "zod";
import type { SupabaseClient } from "@supabase/supabase-js";
import {
  type CompanyRecord,
  type DbCompanyRecord,
  mapDbCompanyToRecord,
} from "@art-work/types";
import {
  CompanyCategoryEnum,
  CreateCompanySchema,
  UpdateCompanySchema,
  type CreateCompanyInput,
  type UpdateCompanyInput,
} from "../schemas/company";
import { DEFAULT_COMPANIES } from "./default-companies";

export const CompanyQuerySchema = z.object({
  category: z.union([CompanyCategoryEnum, z.literal("all")]).default("all"),
  activeOnly: z.boolean().default(true),
  q: z.string().trim().max(100).optional().default(""),
});

export type CompanyQuery = z.infer<typeof CompanyQuerySchema>;

// In-memory runtime cache/fallback store
let inMemoryCompanies: CompanyRecord[] = [...DEFAULT_COMPANIES];

export async function listCompanies(
  supabase?: SupabaseClient | null,
  query: Partial<CompanyQuery> = {}
): Promise<{ ok: boolean; data: CompanyRecord[]; error?: string }> {
  const parsed = CompanyQuerySchema.safeParse(query);
  const options = parsed.success ? parsed.data : { category: "all", activeOnly: true, q: "" };

  if (supabase) {
    try {
      let q = supabase
        .from("companies")
        .select("*")
        .order("order_index", { ascending: true });

      if (options.activeOnly) {
        q = q.eq("is_active", true);
      }

      if (options.category && options.category !== "all") {
        q = q.eq("category", options.category);
      }

      const { data, error } = await q;

      if (!error && Array.isArray(data) && data.length > 0) {
        const records = (data as DbCompanyRecord[]).map(mapDbCompanyToRecord);
        if (options.q) {
          const search = options.q.toLowerCase();
          return {
            ok: true,
            data: records.filter(
              (c) =>
                c.name.toLowerCase().includes(search) ||
                c.description.toLowerCase().includes(search) ||
                c.highlight.toLowerCase().includes(search)
            ),
          };
        }
        return { ok: true, data: records };
      }
    } catch {
      // Fallback to in-memory store
    }
  }

  // In-memory fallback
  let filtered = [...inMemoryCompanies];
  if (options.activeOnly) {
    filtered = filtered.filter((c) => c.isActive);
  }
  if (options.category && options.category !== "all") {
    filtered = filtered.filter((c) => c.category === options.category);
  }
  if (options.q) {
    const search = options.q.toLowerCase();
    filtered = filtered.filter(
      (c) =>
        c.name.toLowerCase().includes(search) ||
        c.description.toLowerCase().includes(search) ||
        c.highlight.toLowerCase().includes(search)
    );
  }

  filtered.sort((a, b) => a.order - b.order);
  return { ok: true, data: filtered };
}

export async function getCompany(
  idOrSlug: string,
  supabase?: SupabaseClient | null
): Promise<{ ok: boolean; data?: CompanyRecord; error?: string }> {
  if (supabase) {
    try {
      const { data, error } = await supabase
        .from("companies")
        .select("*")
        .or(`id.eq.${idOrSlug},slug.eq.${idOrSlug}`)
        .maybeSingle();

      if (!error && data) {
        return { ok: true, data: mapDbCompanyToRecord(data as DbCompanyRecord) };
      }
    } catch {
      // Fallback to in-memory
    }
  }

  const found = inMemoryCompanies.find(
    (c) => c.id === idOrSlug || c.slug === idOrSlug
  );

  if (!found) {
    return { ok: false, error: "Company not found" };
  }

  return { ok: true, data: found };
}

export async function createCompany(
  input: CreateCompanyInput,
  supabase?: SupabaseClient | null
): Promise<{ ok: boolean; data?: CompanyRecord; error?: string }> {
  const parsed = CreateCompanySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  const validated = parsed.data;
  const newRecord: CompanyRecord = {
    id: `comp-${Date.now()}`,
    slug: validated.slug,
    name: validated.name,
    logo: validated.logo_url,
    websiteUrl: validated.website_url || undefined,
    category: validated.category,
    description: validated.description,
    highlight: validated.highlight,
    order: validated.order_index,
    featured: validated.featured,
    isActive: validated.is_active,
    createdAt: new Date().toISOString(),
    updatedAt: new Date().toISOString(),
  };

  if (supabase) {
    try {
      const dbRow: Partial<DbCompanyRecord> = {
        slug: validated.slug,
        name: validated.name,
        logo_url: validated.logo_url,
        website_url: validated.website_url || null,
        category: validated.category,
        description: validated.description,
        highlight: validated.highlight,
        order_index: validated.order_index,
        featured: validated.featured,
        is_active: validated.is_active,
      };

      const { data, error } = await supabase
        .from("companies")
        .insert(dbRow)
        .select()
        .single();

      if (!error && data) {
        const record = mapDbCompanyToRecord(data as DbCompanyRecord);
        inMemoryCompanies.push(record);
        return { ok: true, data: record };
      }
    } catch {
      // Fallback to memory
    }
  }

  inMemoryCompanies.push(newRecord);
  return { ok: true, data: newRecord };
}

export async function updateCompany(
  id: string,
  input: UpdateCompanyInput,
  supabase?: SupabaseClient | null
): Promise<{ ok: boolean; data?: CompanyRecord; error?: string }> {
  const parsed = UpdateCompanySchema.safeParse(input);
  if (!parsed.success) {
    return { ok: false, error: parsed.error.issues[0]?.message || "Validation failed" };
  }

  const validated = parsed.data;

  if (supabase) {
    try {
      const dbUpdates: Record<string, unknown> = {};
      if (validated.name !== undefined) dbUpdates.name = validated.name;
      if (validated.slug !== undefined) dbUpdates.slug = validated.slug;
      if (validated.logo_url !== undefined) dbUpdates.logo_url = validated.logo_url;
      if (validated.website_url !== undefined) dbUpdates.website_url = validated.website_url;
      if (validated.category !== undefined) dbUpdates.category = validated.category;
      if (validated.description !== undefined) dbUpdates.description = validated.description;
      if (validated.highlight !== undefined) dbUpdates.highlight = validated.highlight;
      if (validated.order_index !== undefined) dbUpdates.order_index = validated.order_index;
      if (validated.featured !== undefined) dbUpdates.featured = validated.featured;
      if (validated.is_active !== undefined) dbUpdates.is_active = validated.is_active;

      const { data, error } = await supabase
        .from("companies")
        .update(dbUpdates)
        .eq("id", id)
        .select()
        .maybeSingle();

      if (!error && data) {
        const updated = mapDbCompanyToRecord(data as DbCompanyRecord);
        inMemoryCompanies = inMemoryCompanies.map((c) => (c.id === id ? updated : c));
        return { ok: true, data: updated };
      }
    } catch {
      // Fallback to memory
    }
  }

  const idx = inMemoryCompanies.findIndex((c) => c.id === id || c.slug === id);
  if (idx === -1) {
    return { ok: false, error: "Company not found" };
  }

  const existing = inMemoryCompanies[idx];
  const updated: CompanyRecord = {
    ...existing,
    slug: validated.slug ?? existing.slug,
    name: validated.name ?? existing.name,
    logo: validated.logo_url ?? existing.logo,
    websiteUrl: validated.website_url !== undefined ? (validated.website_url || undefined) : existing.websiteUrl,
    category: validated.category ?? existing.category,
    description: validated.description ?? existing.description,
    highlight: validated.highlight ?? existing.highlight,
    order: validated.order_index ?? existing.order,
    featured: validated.featured ?? existing.featured,
    isActive: validated.is_active ?? existing.isActive,
    updatedAt: new Date().toISOString(),
  };

  inMemoryCompanies[idx] = updated;
  return { ok: true, data: updated };
}

export async function deleteCompany(
  id: string,
  supabase?: SupabaseClient | null
): Promise<{ ok: boolean; error?: string }> {
  if (supabase) {
    try {
      const { error } = await supabase.from("companies").delete().eq("id", id);
      if (error) {
        return { ok: false, error: error.message };
      }
    } catch {
      // Fallback
    }
  }

  inMemoryCompanies = inMemoryCompanies.filter((c) => c.id !== id && c.slug !== id);
  return { ok: true };
}
