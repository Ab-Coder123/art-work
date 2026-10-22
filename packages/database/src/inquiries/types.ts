import { z } from "zod";
import type { InquiryRecord, LeadSubmissionPayload } from "@art-work/types";
import { INQUIRY_STATUSES, InquiryStatusEnum, type InquiryStatus } from "../schemas/inquiry";

export { InquiryRecord, LeadSubmissionPayload, INQUIRY_STATUSES, InquiryStatusEnum, type InquiryStatus };

export const InquiryStatusSchema = InquiryStatusEnum;

/**
 * Raw submission schema accepting both camelCase and snake_case keys,
 * plus honeypot and time-gate metadata.
 */
export const RawLeadSubmissionSchema = z
  .object({
    fullName: z.string().optional(),
    full_name: z.string().optional(),
    email: z.string().trim().email("Please enter a valid email address"),
    serviceType: z.string().optional(),
    service_type: z.string().optional(),
    brief: z
      .string()
      .trim()
      .min(10, "Project brief must be at least 10 characters")
      .max(5000, "Project brief must not exceed 5000 characters"),
    // Honeypot field - must be empty
    _hp: z.string().optional(),
    honeypot: z.string().optional(),
    // Time-gate field - millisecond timestamp when form opened
    _ts: z.union([z.number(), z.string()]).optional(),
    submittedAt: z.union([z.number(), z.string()]).optional(),
  })
  .refine(
    (data) => Boolean((data.fullName && data.fullName.trim().length >= 2) || (data.full_name && data.full_name.trim().length >= 2)),
    {
      message: "Full name must be at least 2 characters",
      path: ["fullName"],
    }
  )
  .refine(
    (data) => Boolean((data.serviceType && data.serviceType.trim().length >= 2) || (data.service_type && data.service_type.trim().length >= 2)),
    {
      message: "Service type is required",
      path: ["serviceType"],
    }
  );

export type RawLeadSubmission = z.infer<typeof RawLeadSubmissionSchema>;

export interface NormalizedLeadPayload {
  fullName: string;
  email: string;
  serviceType: string;
  brief: string;
  honeypot?: string;
  formLoadedAt?: number;
}

/**
 * Normalizes input from web forms into canonical camelCase format
 */
export function normalizeLeadPayload(raw: unknown): {
  success: boolean;
  data?: NormalizedLeadPayload;
  error?: string;
} {
  const parsed = RawLeadSubmissionSchema.safeParse(raw);
  if (!parsed.success) {
    const issue = parsed.error.issues[0];
    return {
      success: false,
      error: issue ? `${issue.message}` : "Invalid lead submission payload",
    };
  }

  const val = parsed.data;
  const fullName = (val.fullName || val.full_name || "").trim();
  const serviceType = (val.serviceType || val.service_type || "").trim();
  const email = val.email.trim().toLowerCase();
  const brief = val.brief.trim();
  const honeypot = (val._hp || val.honeypot || "").trim();

  let formLoadedAt: number | undefined;
  const rawTs = val._ts ?? val.submittedAt;
  if (typeof rawTs === "number" && Number.isFinite(rawTs)) {
    formLoadedAt = rawTs;
  } else if (typeof rawTs === "string" && rawTs.trim().length > 0) {
    const parsedNum = Number(rawTs);
    if (Number.isFinite(parsedNum)) {
      formLoadedAt = parsedNum;
    }
  }

  return {
    success: true,
    data: {
      fullName,
      email,
      serviceType,
      brief,
      honeypot: honeypot.length > 0 ? honeypot : undefined,
      formLoadedAt,
    },
  };
}

export interface InquiryFilter {
  status?: InquiryStatus;
  search?: string;
  limit?: number;
  offset?: number;
}
