import { z } from "zod";

export const AUDIT_ACTIONS = ["create", "update", "delete", "publish", "archive"] as const;
export const AUDIT_ENTITIES = ["project", "site_content"] as const;

export const AuditActionEnum = z.enum(AUDIT_ACTIONS);
export type AuditAction = z.infer<typeof AuditActionEnum>;

export const AuditEntityEnum = z.enum(AUDIT_ENTITIES);
export type AuditEntity = z.infer<typeof AuditEntityEnum>;

/**
 * Zod schema for content audit log records.
 */
export const ContentAuditLogSchema = z.object({
  entity_type: AuditEntityEnum,
  entity_id: z.string().min(1),
  action: AuditActionEnum,
  actor_id: z.string().uuid().nullable().optional(),
  actor_email: z.string().email(),
  before_state: z.record(z.string(), z.any()).nullable().optional(),
  after_state: z.record(z.string(), z.any()).nullable().optional(),
});

export type ContentAuditLogInput = z.infer<typeof ContentAuditLogSchema>;

export interface ContentAuditLogRow extends ContentAuditLogInput {
  id: string; // UUID
  created_at: string;
}
