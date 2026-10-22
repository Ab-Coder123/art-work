import type { InquiryRecord, InquiryStatus } from "@art-work/types";
import {
  normalizeLeadPayload,
  InquiryFilter,
  InquiryStatusSchema,
} from "./types";
import { checkSpam, hashIp } from "./spam-filter";
import {
  NotificationService,
  EmailAndWebhookNotifier,
} from "./notifications";
import { InquiryRepository } from "./repository";

export interface SubmitLeadOptions {
  ip?: string | null;
  notifier?: NotificationService;
  waitForNotifications?: boolean;
  minFillTimeMs?: number;
}

export interface ServiceResult<T> {
  ok: boolean;
  data?: T;
  error?: string;
  status: number;
}

/**
 * End-to-end Lead Brief Intake Handler (Phase 08 Pipeline):
 * 1. Zod payload validation (accepts camelCase and snake_case)
 * 2. Honeypot & time-gate bot spam rejection (< 1.5s)
 * 3. IP anonymization with SHA-256
 * 4. Database persistence in `inquiries` table with 'pending' status
 * 5. Async notifications (Studio lead alert, Client confirmation, Webhook alert)
 */
export async function submitLeadBrief(
  rawInput: unknown,
  repo: InquiryRepository,
  options: SubmitLeadOptions = {}
): Promise<ServiceResult<InquiryRecord>> {
  // 1. Payload validation & normalization
  const normalized = normalizeLeadPayload(rawInput);
  if (!normalized.success || !normalized.data) {
    return {
      ok: false,
      error: normalized.error || "Invalid form submission",
      status: 400,
    };
  }

  const { fullName, email, serviceType, brief, honeypot, formLoadedAt } =
    normalized.data;

  // 2. Spam filter inspection
  const spamCheck = checkSpam({
    honeypot,
    formLoadedAt,
    minFillTimeMs: options.minFillTimeMs,
  });

  if (spamCheck.isSpam) {
    return {
      ok: false,
      error: spamCheck.reason || "Submission rejected by automated security filter",
      status: 422,
    };
  }

  // 3. Compute hashed IP for abuse defense
  const ipHash = hashIp(options.ip);

  // 4. Persist to repository
  let record: InquiryRecord;
  try {
    record = await repo.create({
      fullName,
      email,
      serviceType,
      brief,
      status: "pending",
      ipHash,
    });
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to record inquiry";
    return {
      ok: false,
      error: message,
      status: 500,
    };
  }

  // 5. Transactional email & webhook dispatch
  const notifier = options.notifier || new EmailAndWebhookNotifier();

  const dispatchNotifications = async () => {
    try {
      await Promise.allSettled([
        notifier.sendLeadAlert(record),
        notifier.sendClientConfirmation(record),
        notifier.dispatchWebhook(record),
      ]);
    } catch {
      // Background notifications must never crash or block
    }
  };

  if (options.waitForNotifications) {
    await dispatchNotifications();
  } else {
    // Fire-and-forget in background
    dispatchNotifications().catch(() => {});
  }

  return {
    ok: true,
    data: record,
    status: 201,
  };
}

/**
 * Lists inquiries with pagination and filtering for administrative oversight.
 */
export async function fetchInquiries(
  repo: InquiryRepository,
  filter?: InquiryFilter
): Promise<ServiceResult<{ items: InquiryRecord[]; total: number }>> {
  try {
    const result = await repo.list(filter);
    return {
      ok: true,
      data: result,
      status: 200,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : "Failed to list inquiries";
    return {
      ok: false,
      error: message,
      status: 500,
    };
  }
}

/**
 * Retrieves a single inquiry record by its unique ID.
 */
export async function fetchInquiryById(
  id: string,
  repo: InquiryRepository
): Promise<ServiceResult<InquiryRecord>> {
  try {
    const item = await repo.findById(id);
    if (!item) {
      return {
        ok: false,
        error: `Inquiry ${id} not found`,
        status: 404,
      };
    }
    return {
      ok: true,
      data: item,
      status: 200,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : `Failed to get inquiry ${id}`;
    return {
      ok: false,
      error: message,
      status: 500,
    };
  }
}

/**
 * Updates the lifecycle status of an inquiry (e.g. pending -> reviewed -> contacted -> archived).
 */
export async function updateInquiryStatus(
  id: string,
  rawStatus: unknown,
  repo: InquiryRepository
): Promise<ServiceResult<InquiryRecord>> {
  const parsed = InquiryStatusSchema.safeParse(rawStatus);
  if (!parsed.success) {
    return {
      ok: false,
      error: "Invalid status. Must be one of: pending, reviewed, contacted, archived",
      status: 400,
    };
  }

  try {
    const updated = await repo.updateStatus(id, parsed.data);
    if (!updated) {
      return {
        ok: false,
        error: `Inquiry ${id} not found`,
        status: 404,
      };
    }
    return {
      ok: true,
      data: updated,
      status: 200,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : `Failed to update status for ${id}`;
    return {
      ok: false,
      error: message,
      status: 500,
    };
  }
}

/**
 * Deletes an inquiry record permanently.
 */
export async function removeInquiry(
  id: string,
  repo: InquiryRepository
): Promise<ServiceResult<boolean>> {
  try {
    const success = await repo.delete(id);
    if (!success) {
      return {
        ok: false,
        error: `Inquiry ${id} not found`,
        status: 404,
      };
    }
    return {
      ok: true,
      data: true,
      status: 200,
    };
  } catch (err) {
    const message = err instanceof Error ? err.message : `Failed to delete inquiry ${id}`;
    return {
      ok: false,
      error: message,
      status: 500,
    };
  }
}
