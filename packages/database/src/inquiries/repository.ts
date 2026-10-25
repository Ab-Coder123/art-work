import type { SupabaseClient } from "@supabase/supabase-js";
import type { InquiryRecord, InquiryStatus } from "@art-work/types";
import type { InquiryFilter } from "./types";

export interface InquiryRepository {
  create(data: {
    fullName: string;
    email: string;
    serviceType: string;
    brief: string;
    status?: InquiryStatus;
    ipHash?: string;
  }): Promise<InquiryRecord>;

  list(filter?: InquiryFilter): Promise<{ items: InquiryRecord[]; total: number }>;

  findById(id: string): Promise<InquiryRecord | null>;

  updateStatus(id: string, status: InquiryStatus): Promise<InquiryRecord | null>;

  delete(id: string): Promise<boolean>;
}

/**
 * In-memory repository for deterministic unit testing.
 */
export class InMemoryInquiryRepository implements InquiryRepository {
  private inquiries: InquiryRecord[] = [];

  constructor(initialData: InquiryRecord[] = []) {
    this.inquiries = [...initialData];
  }

  async create(data: {
    fullName: string;
    email: string;
    serviceType: string;
    brief: string;
    status?: InquiryStatus;
    ipHash?: string;
  }): Promise<InquiryRecord> {
    const record: InquiryRecord = {
      id: `inq-${Date.now()}-${Math.random().toString(36).slice(2, 8)}`,
      fullName: data.fullName,
      email: data.email,
      serviceType: data.serviceType,
      brief: data.brief,
      status: data.status || "pending",
      ipHash: data.ipHash,
      createdAt: new Date().toISOString(),
    };
    this.inquiries.unshift(record);
    return { ...record };
  }

  async list(filter?: InquiryFilter): Promise<{ items: InquiryRecord[]; total: number }> {
    let result = [...this.inquiries];

    if (filter?.status) {
      result = result.filter((i) => i.status === filter.status);
    }

    if (filter?.search) {
      const q = filter.search.toLowerCase();
      result = result.filter(
        (i) =>
          i.fullName.toLowerCase().includes(q) ||
          i.email.toLowerCase().includes(q) ||
          i.serviceType.toLowerCase().includes(q) ||
          i.brief.toLowerCase().includes(q)
      );
    }

    const total = result.length;
    const offset = filter?.offset || 0;
    const limit = filter?.limit || 50;

    return {
      items: result.slice(offset, offset + limit),
      total,
    };
  }

  async findById(id: string): Promise<InquiryRecord | null> {
    const found = this.inquiries.find((i) => i.id === id);
    return found ? { ...found } : null;
  }

  async updateStatus(id: string, status: InquiryStatus): Promise<InquiryRecord | null> {
    const index = this.inquiries.findIndex((i) => i.id === id);
    if (index === -1) {
      return null;
    }
    this.inquiries[index] = {
      ...this.inquiries[index],
      status,
    };
    return { ...this.inquiries[index] };
  }

  async delete(id: string): Promise<boolean> {
    const index = this.inquiries.findIndex((i) => i.id === id);
    if (index === -1) {
      return false;
    }
    this.inquiries.splice(index, 1);
    return true;
  }
}

/**
 * Production Supabase-backed repository querying public.inquiries.
 */
export class SupabaseInquiryRepository implements InquiryRepository {
  constructor(private client: SupabaseClient) {}

  async create(data: {
    fullName: string;
    email: string;
    serviceType: string;
    brief: string;
    status?: InquiryStatus;
    ipHash?: string;
  }): Promise<InquiryRecord> {
    // Anonymous clients are intentionally allowed to INSERT inquiries but not
    // SELECT them. Avoid PostgREST's returning representation (`.select()`),
    // which would require granting anonymous read access.
    const record: InquiryRecord = {
      id: crypto.randomUUID(),
      fullName: data.fullName,
      email: data.email,
      serviceType: data.serviceType,
      brief: data.brief,
      status: data.status || "pending",
      ipHash: data.ipHash,
      createdAt: new Date().toISOString(),
    };
    const { error } = await this.client
      .from("inquiries")
      .insert({
        id: record.id,
        full_name: data.fullName,
        email: data.email,
        service_type: data.serviceType,
        brief: data.brief,
        status: record.status,
        ip_hash: data.ipHash || null,
      });

    if (error) {
      throw new Error(`Failed to insert inquiry: ${error?.message || "Unknown error"}`);
    }

    return record;
  }

  async list(filter?: InquiryFilter): Promise<{ items: InquiryRecord[]; total: number }> {
    let query = this.client
      .from("inquiries")
      .select("*", { count: "exact" })
      .order("created_at", { ascending: false });

    if (filter?.status) {
      query = query.eq("status", filter.status);
    }

    if (filter?.search) {
      const q = `%${filter.search}%`;
      query = query.or(`full_name.ilike.${q},email.ilike.${q},service_type.ilike.${q},brief.ilike.${q}`);
    }

    const limit = filter?.limit || 50;
    const offset = filter?.offset || 0;
    query = query.range(offset, offset + limit - 1);

    const { data, count, error } = await query;
    if (error) {
      throw new Error(`Failed to list inquiries: ${error.message}`);
    }

    return {
      items: (data || []).map((row) => this.mapRowToRecord(row)),
      total: count || 0,
    };
  }

  async findById(id: string): Promise<InquiryRecord | null> {
    const { data, error } = await this.client
      .from("inquiries")
      .select("*")
      .eq("id", id)
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return this.mapRowToRecord(data);
  }

  async updateStatus(id: string, status: InquiryStatus): Promise<InquiryRecord | null> {
    const { data, error } = await this.client
      .from("inquiries")
      .update({ status })
      .eq("id", id)
      .select()
      .maybeSingle();

    if (error || !data) {
      return null;
    }

    return this.mapRowToRecord(data);
  }

  async delete(id: string): Promise<boolean> {
    const { error } = await this.client
      .from("inquiries")
      .delete()
      .eq("id", id);

    return !error;
  }

  private mapRowToRecord(row: Record<string, unknown>): InquiryRecord {
    return {
      id: String(row.id),
      fullName: String(row.full_name || ""),
      email: String(row.email || ""),
      serviceType: String(row.service_type || ""),
      brief: String(row.brief || ""),
      status: (row.status as InquiryStatus) || "pending",
      ipHash: row.ip_hash ? String(row.ip_hash) : undefined,
      createdAt: String(row.created_at || new Date().toISOString()),
    };
  }
}

export function createSupabaseInquiryRepository(client: SupabaseClient): InquiryRepository {
  return new SupabaseInquiryRepository(client);
}
