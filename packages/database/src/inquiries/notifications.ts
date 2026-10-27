import type { InquiryRecord } from "@art-work/types";

export interface NotificationResult {
  success: boolean;
  error?: string;
  attempts?: number;
}

export interface NotificationService {
  sendLeadAlert(inquiry: InquiryRecord): Promise<NotificationResult>;
  sendClientConfirmation(inquiry: InquiryRecord): Promise<NotificationResult>;
  dispatchWebhook(inquiry: InquiryRecord): Promise<NotificationResult>;
}

/**
 * Renders high-fidelity responsive HTML email alerting the agency studio of a new lead.
 * Aesthetic: Art Work Dark Comic Styling with Yellow Accents.
 */
export function renderStudioLeadAlertHtml(inquiry: {
  fullName: string;
  email: string;
  serviceType: string;
  brief: string;
  createdAt: string;
  id: string;
}): string {
  const safeName = escapeHtml(inquiry.fullName);
  const safeEmail = escapeHtml(inquiry.email);
  const safeService = escapeHtml(inquiry.serviceType);
  const safeBrief = escapeHtml(inquiry.brief).replace(/\n/g, "<br/>");
  const safeDate = new Date(inquiry.createdAt).toLocaleString("en-US", {
    timeZone: "UTC",
    dateStyle: "medium",
    timeStyle: "short",
  });

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>New Client Lead Brief // Art Work</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0b10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f3f6; }
    .container { max-width: 600px; margin: 30px auto; background-color: #12121a; border: 2px solid #262638; border-radius: 12px; overflow: hidden; box-shadow: 4px 4px 0px #ffe600; }
    .header { background-color: #1a1a24; padding: 24px 30px; border-bottom: 2px solid #262638; text-align: left; }
    .badge { display: inline-block; background-color: #ffe600; color: #000; font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; border: 1px solid #000; margin-bottom: 10px; }
    .title { font-size: 20px; font-weight: 900; color: #ffffff; margin: 0; letter-spacing: -0.5px; }
    .content { padding: 30px; }
    .meta-table { width: 100%; border-collapse: collapse; margin-bottom: 24px; }
    .meta-label { width: 32%; padding: 8px 12px; font-size: 11px; text-transform: uppercase; letter-spacing: 1px; color: #8d8d9f; font-weight: 700; border-bottom: 1px solid #1f1f2e; }
    .meta-val { padding: 8px 12px; font-size: 13px; color: #ffffff; font-weight: 600; border-bottom: 1px solid #1f1f2e; }
    .brief-card { background-color: #181824; border: 1px solid #2e2e42; border-left: 4px solid #ffe600; border-radius: 6px; padding: 18px; margin: 20px 0; }
    .brief-title { font-size: 11px; font-weight: 800; text-transform: uppercase; letter-spacing: 1.5px; color: #ffe600; margin: 0 0 10px 0; }
    .brief-text { font-size: 14px; line-height: 1.6; color: #e4e4eb; margin: 0; }
    .actions { text-align: center; margin-top: 30px; }
    .button { display: inline-block; background-color: #ffe600; color: #000000; font-weight: 900; font-size: 12px; letter-spacing: 1px; text-decoration: none; padding: 12px 24px; border-radius: 6px; border: 1px solid #000; box-shadow: 2px 2px 0px #ffffff; }
    .footer { background-color: #0d0d14; padding: 16px 30px; text-align: center; font-size: 10px; color: #6b6b7b; border-top: 1px solid #1f1f2e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">STAGE 05 // INTAKE PIPELINE</div>
      <h1 class="title">NEW CLIENT LEAD RECEIVED</h1>
    </div>
    <div class="content">
      <table class="meta-table">
        <tr>
          <td class="meta-label">Client Name</td>
          <td class="meta-val">${safeName}</td>
        </tr>
        <tr>
          <td class="meta-label">Email Address</td>
          <td class="meta-val"><a href="mailto:${safeEmail}" style="color: #ffe600; text-decoration: none;">${safeEmail}</a></td>
        </tr>
        <tr>
          <td class="meta-label">Target Service</td>
          <td class="meta-val">${safeService}</td>
        </tr>
        <tr>
          <td class="meta-label">Received At</td>
          <td class="meta-val">${safeDate} UTC</td>
        </tr>
        <tr>
          <td class="meta-label">Inquiry Ref</td>
          <td class="meta-val" style="font-family: monospace; font-size: 11px;">${escapeHtml(inquiry.id)}</td>
        </tr>
      </table>

      <div class="brief-card">
        <div class="brief-title">THE CORE BRIEF / VISION CONSTRAINTS</div>
        <p class="brief-text">${safeBrief}</p>
      </div>

      <div class="actions">
        <a href="mailto:${safeEmail}?subject=Re:%20Art%20Work%20//%20Project%20Brief%20Response%20(${encodeURIComponent(safeService)})" class="button">
          REPLY TO CLIENT DIRECTLY &rarr;
        </a>
      </div>
    </div>
    <div class="footer">
      ART WORK MARKETING SOLUTIONS // DIRECT INTAKE BOT // PORT 3001 ADMIN CENTER
    </div>
  </div>
</body>
</html>`;
}

/**
 * Renders client auto-reply confirmation email.
 */
export function renderClientConfirmationHtml(clientName: string, serviceType: string): string {
  const safeName = escapeHtml(clientName);
  const safeService = escapeHtml(serviceType);

  return `<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <title>Brief Received // Art Work Marketing Solutions</title>
  <style>
    body { margin: 0; padding: 0; background-color: #0b0b10; font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; color: #f3f3f6; }
    .container { max-width: 600px; margin: 30px auto; background-color: #12121a; border: 2px solid #262638; border-radius: 12px; overflow: hidden; box-shadow: 4px 4px 0px #ffe600; }
    .header { background-color: #1a1a24; padding: 24px 30px; border-bottom: 2px solid #262638; text-align: left; }
    .badge { display: inline-block; background-color: #ffe600; color: #000; font-size: 10px; font-weight: 900; letter-spacing: 2px; text-transform: uppercase; padding: 4px 8px; border-radius: 4px; border: 1px solid #000; margin-bottom: 10px; }
    .title { font-size: 20px; font-weight: 900; color: #ffffff; margin: 0; letter-spacing: -0.5px; }
    .content { padding: 30px; }
    .p { font-size: 14px; line-height: 1.7; color: #d1d1dc; margin-bottom: 16px; }
    .highlight-box { background-color: #181824; border: 1px solid #2e2e42; border-radius: 8px; padding: 16px; margin: 20px 0; }
    .footer { background-color: #0d0d14; padding: 16px 30px; text-align: center; font-size: 11px; color: #6b6b7b; border-top: 1px solid #1f1f2e; }
  </style>
</head>
<body>
  <div class="container">
    <div class="header">
      <div class="badge">ART WORK STUDIO</div>
      <h1 class="title">WE HAVE RECEIVED YOUR BRIEF</h1>
    </div>
    <div class="content">
      <p class="p">Hello <strong>${safeName}</strong>,</p>
      <p class="p">
        Thank you for trusting <strong>Art Work Marketing Solutions</strong> with your vision for <strong>${safeService}</strong>.
      </p>
      <div class="highlight-box">
        <p style="margin: 0; font-size: 13px; color: #ffe600; font-weight: 800;">
          ⚡ 24-HOUR RAPID RESPONSE STANDARD
        </p>
        <p style="margin: 6px 0 0 0; font-size: 12px; color: #a1a1b5;">
          Our creative directors and technical architects are reviewing your specifications. Expect a dedicated response within 24 business hours.
        </p>
      </div>
      <p class="p">
        If you have CAD files, deck links, or immediate schedule adjustments to share, simply reply to this email or reach out to <a href="mailto:ahmed.artwork2026@gmail.com" style="color: #ffe600;">ahmed.artwork2026@gmail.com</a>.
      </p>
    </div>
    <div class="footer">
      Art Work Agency // Kinetic Scenography, Rigging & Brand Engineering
    </div>
  </div>
</body>
</html>`;
}

function escapeHtml(str: string): string {
  return str
    .replace(/&/g, "&amp;")
    .replace(/</g, "&lt;")
    .replace(/>/g, "&gt;")
    .replace(/"/g, "&quot;")
    .replace(/'/g, "&#039;");
}

/**
 * Resilient retry utility with exponential backoff.
 */
export async function retryWithBackoff<T>(
  fn: () => Promise<T>,
  maxRetries = 3,
  initialDelayMs = 500
): Promise<T> {
  let attempt = 0;
  let delay = initialDelayMs;

  while (attempt < maxRetries) {
    try {
      attempt++;
      return await fn();
    } catch (err) {
      if (attempt >= maxRetries) {
        throw err;
      }
      await new Promise((resolve) => setTimeout(resolve, delay));
      delay *= 2;
    }
  }

  throw new Error(`Failed after ${maxRetries} attempts`);
}

/**
 * Production-ready Notifier with Resend API, Webhooks, and automatic retries.
 */
export class EmailAndWebhookNotifier implements NotificationService {
  constructor(
    private options: {
      resendApiKey?: string;
      studioEmail?: string;
      fromEmail?: string;
      webhookUrl?: string;
      fetchFn?: typeof fetch;
    } = {}
  ) {}

  private getFetch(): typeof fetch {
    return this.options.fetchFn || globalThis.fetch;
  }

  async sendLeadAlert(inquiry: InquiryRecord): Promise<NotificationResult> {
    const apiKey = this.options.resendApiKey || process.env.RESEND_API_KEY;
    const to = this.options.studioEmail || process.env.STUDIO_NOTIFICATION_EMAIL || "ahmed.artwork2026@gmail.com";
    const from = this.options.fromEmail || process.env.EMAIL_FROM || "Art Work Leads <ahmed.artwork2026@gmail.com>";

    if (!apiKey) {
      // Graceful no-op in dev/testing environments without API key
      return { success: true };
    }

    const html = renderStudioLeadAlertHtml({
      fullName: inquiry.fullName,
      email: inquiry.email,
      serviceType: inquiry.serviceType,
      brief: inquiry.brief,
      createdAt: inquiry.createdAt,
      id: inquiry.id,
    });

    try {
      return await retryWithBackoff(async () => {
        const fetchFn = this.getFetch();
        const res = await fetchFn("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to,
            reply_to: inquiry.email,
            subject: `[Lead Brief] ${inquiry.fullName} - ${inquiry.serviceType}`,
            html,
          }),
        });

        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Resend API error (${res.status}): ${body}`);
        }

        return { success: true };
      }, 3, 300);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to dispatch studio alert email";
      return { success: false, error: msg };
    }
  }

  async sendClientConfirmation(inquiry: InquiryRecord): Promise<NotificationResult> {
    const apiKey = this.options.resendApiKey || process.env.RESEND_API_KEY;
    const from = this.options.fromEmail || process.env.EMAIL_FROM || "Art Work Agency <ahmed.artwork2026@gmail.com>";

    if (!apiKey) {
      return { success: true };
    }

    const html = renderClientConfirmationHtml(inquiry.fullName, inquiry.serviceType);

    try {
      return await retryWithBackoff(async () => {
        const fetchFn = this.getFetch();
        const res = await fetchFn("https://api.resend.com/emails", {
          method: "POST",
          headers: {
            Authorization: `Bearer ${apiKey}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify({
            from,
            to: inquiry.email,
            subject: `Brief Received // Art Work Marketing Solutions`,
            html,
          }),
        });

        if (!res.ok) {
          const body = await res.text();
          throw new Error(`Resend API error (${res.status}): ${body}`);
        }

        return { success: true };
      }, 3, 300);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to dispatch client confirmation email";
      return { success: false, error: msg };
    }
  }

  async dispatchWebhook(inquiry: InquiryRecord): Promise<NotificationResult> {
    const webhookUrl = this.options.webhookUrl || process.env.LEAD_ALERT_WEBHOOK_URL;
    if (!webhookUrl) {
      return { success: true };
    }

    try {
      return await retryWithBackoff(async () => {
        const fetchFn = this.getFetch();
        const res = await fetchFn(webhookUrl, {
          method: "POST",
          headers: { "Content-Type": "application/json" },
          body: JSON.stringify({
            event: "inquiry.created",
            inquiryId: inquiry.id,
            fullName: inquiry.fullName,
            email: inquiry.email,
            serviceType: inquiry.serviceType,
            brief: inquiry.brief,
            createdAt: inquiry.createdAt,
            status: inquiry.status,
          }),
        });

        if (!res.ok) {
          throw new Error(`Webhook dispatch failed with HTTP ${res.status}`);
        }

        return { success: true };
      }, 3, 300);
    } catch (err) {
      const msg = err instanceof Error ? err.message : "Failed to dispatch lead webhook";
      return { success: false, error: msg };
    }
  }
}

/**
 * In-memory Mock Notifier for deterministic unit tests.
 */
export class MockNotificationService implements NotificationService {
  public studioAlerts: InquiryRecord[] = [];
  public clientConfirmations: InquiryRecord[] = [];
  public webhooks: InquiryRecord[] = [];
  public shouldFail = false;
  public failCount = 0;

  async sendLeadAlert(inquiry: InquiryRecord): Promise<NotificationResult> {
    if (this.shouldFail) {
      return { success: false, error: "Mock alert dispatch error" };
    }
    this.studioAlerts.push(inquiry);
    return { success: true };
  }

  async sendClientConfirmation(inquiry: InquiryRecord): Promise<NotificationResult> {
    if (this.shouldFail) {
      return { success: false, error: "Mock client confirmation error" };
    }
    this.clientConfirmations.push(inquiry);
    return { success: true };
  }

  async dispatchWebhook(inquiry: InquiryRecord): Promise<NotificationResult> {
    if (this.shouldFail) {
      return { success: false, error: "Mock webhook error" };
    }
    this.webhooks.push(inquiry);
    return { success: true };
  }
}
