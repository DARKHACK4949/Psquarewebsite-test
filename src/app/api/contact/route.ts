import { NextResponse, type NextRequest } from "next/server";
import { FILE_ACCEPT, FILE_MAX_BYTES } from "@/content/contact";
import { contactSchema } from "@/lib/contact-schema";
import { rateLimit } from "@/lib/server/rate-limit";
import {
  deliver,
  deliveryConfigured,
  storageConfigured,
  storeUpload,
  type StoredFile,
} from "@/lib/server/delivery";

export const runtime = "nodejs";

const ALLOWED_EXT = new Set(FILE_ACCEPT.split(",").map((e) => e.trim().toLowerCase()));

const json = (status: number, body: Record<string, unknown>, headers?: HeadersInit) =>
  NextResponse.json(body, { status, headers });

/**
 * POST /api/contact — multipart form: `payload` (JSON, see contactSchema) and
 * optional `file`. Responds 200 only once the enquiry has been delivered.
 */
export async function POST(req: NextRequest) {
  const ip =
    req.headers.get("x-forwarded-for")?.split(",")[0]?.trim() ||
    req.headers.get("x-real-ip") ||
    "unknown";
  const rl = rateLimit(`contact:${ip}`);
  if (!rl.ok) return json(429, { error: "rate_limited" }, { "Retry-After": String(rl.retryAfter) });

  let form: FormData;
  try {
    form = await req.formData();
  } catch {
    return json(400, { error: "bad_request" });
  }

  let raw: unknown;
  try {
    raw = JSON.parse(String(form.get("payload") ?? ""));
  } catch {
    return json(400, { error: "bad_request" });
  }

  const parsed = contactSchema.safeParse(raw);
  if (!parsed.success) {
    return json(422, {
      error: "invalid",
      issues: parsed.error.issues.map((i) => ({ path: i.path.join("."), message: i.message })),
    });
  }
  const values = parsed.data;

  // Honeypot: pretend success, drop silently.
  if (values.company_website) return json(200, { ok: true });

  const file = form.get("file");
  let stored: StoredFile | undefined;
  if (file instanceof File && file.size > 0) {
    if (values.type === "products")
      return json(422, {
        error: "invalid",
        issues: [{ path: "file", message: "No attachment for demos." }],
      });
    const ext = `.${file.name.split(".").pop()?.toLowerCase() ?? ""}`;
    if (file.size > FILE_MAX_BYTES || !ALLOWED_EXT.has(ext)) {
      return json(422, {
        error: "invalid",
        issues: [
          {
            path: "file",
            message: "That file is over 10 MB. Try a smaller one or email it to us.",
          },
        ],
      });
    }
    if (storageConfigured()) {
      try {
        stored = await storeUpload(file);
      } catch (e) {
        console.error("[contact] upload failed", e);
        return json(502, { error: "upload_failed" });
      }
    }
  }

  if (!deliveryConfigured()) {
    if (process.env.NODE_ENV === "production") {
      console.error("[contact] no delivery configured (RESEND_API_KEY or CONTACT_WEBHOOK_URL)");
      return json(503, { error: "not_configured" });
    }
    console.info("[contact] dev enquiry (no delivery configured):", {
      ...values,
      file: stored ?? (file instanceof File ? file.name : null),
    });
    return json(200, { ok: true });
  }

  try {
    await deliver(values, stored);
  } catch (e) {
    console.error("[contact] delivery failed", e);
    return json(502, { error: "delivery_failed" });
  }
  return json(200, { ok: true });
}
