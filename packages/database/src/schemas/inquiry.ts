import { z } from "zod";

export const INQUIRY_STATUSES = ["pending", "reviewed", "contacted", "archived"] as const;

export const InquiryStatusEnum = z.enum(INQUIRY_STATUSES);
export type InquiryStatus = z.infer<typeof InquiryStatusEnum>;

/**
 * Zod schema for client intake form submissions.
 */
export const InquiryInputSchema = z.object({
  full_name: z.string().min(2, "Name must be at least 2 characters").max(100),
  email: z.string().email("Please provide a valid email address"),
  service_type: z.string().min(2, "Service type is required").max(100),
  brief: z.string().min(10, "Project brief must be at least 10 characters").max(5000),
  status: InquiryStatusEnum.default("pending"),
  ip_hash: z.string().optional(),
});

export type InquiryInput = z.infer<typeof InquiryInputSchema>;

export interface InquiryRow extends InquiryInput {
  id: string; // UUID
  created_at: string;
}
