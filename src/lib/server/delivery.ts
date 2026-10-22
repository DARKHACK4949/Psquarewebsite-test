import "server-only";
import { PutObjectCommand, S3Client } from "@aws-sdk/client-s3";
import { enquiryTypes, products } from "@/content/contact";
import { dialFor } from "@/content/countries";
import type { ContactValues } from "@/lib/contact-schema";

export type StoredFile = { key: string; url: string; name: string; size: number; type: string };

const env = (k: string) => process.env[k]?.trim() || undefined;

export const deliveryConfigured = () => !!(env("RESEND_API_KEY") || env("CONTACT_WEBHOOK_URL"));
export const storageConfigured = () =>
  !!(env("UPLOAD_BUCKET") && env("UPLOAD_ACCESS_KEY_ID") && env("UPLOAD_SECRET_ACCESS_KEY"));

/**
 * Uploads a brief to S3-compatible object storage (AWS S3 or Cloudflare R2 via
 * UPLOAD_ENDPOINT). Files never touch a database.
 */
export async function storeUpload(file: File): Promise<StoredFile> {
  const bucket = env("UPLOAD_BUCKET")!;
  const client = new S3Client({
    region: env("UPLOAD_REGION") ?? "auto",
    endpoint: env("UPLOAD_ENDPOINT"),
    credentials: {
      accessKeyId: env("UPLOAD_ACCESS_KEY_ID")!,
      secretAccessKey: env("UPLOAD_SECRET_ACCESS_KEY")!,
    },
  });
  const safe = file.name.replace(/[^\w.\-]+/g, "_").slice(-120);
  const key = `enquiries/${new Date().toISOString().slice(0, 10)}/${crypto.randomUUID()}-${safe}`;
  await client.send(
    new PutObjectCommand({
      Bucket: bucket,
      Key: key,
      Body: Buffer.from(await file.arrayBuffer()),
      ContentType: file.type || "application/octet-stream",
      ContentDisposition: `attachment; filename="${safe}"`,
    }),
  );
  const base = env("UPLOAD_PUBLIC_BASE_URL");
  return {
    key,
    url: base ? `${base.replace(/\/$/, "")}/${key}` : `s3://${bucket}/${key}`,
    name: file.name,
    size: file.size,
    type: file.type,
  };
}

const esc = (s: string) =>
  s.replace(
    /[&<>"']/g,
    (c) => ({ "&": "&amp;", "<": "&lt;", ">": "&gt;", '"': "&quot;", "'": "&#39;" })[c]!,
  );

function summary(v: ContactValues, file?: StoredFile) {
  const type = enquiryTypes.find((t) => t.k === v.type)?.name ?? v.type;
  const rows: [string, string | undefined][] = [
    ["Enquiry", type],
    ["Industry", v.industry || undefined],
    [
      "Products",
      v.products.map((k) => products.find((p) => p.k === k)?.name ?? k).join(", ") || undefined,
    ],
    ["Team size", v.size || undefined],
    ["Name", v.name],
    ["Email", v.email],
    ["Company", v.company || undefined],
    ["Phone", v.phone ? `${dialFor(v.country)} ${v.phone} (${v.country})` : undefined],
    ["Message", v.message || undefined],
    [
      "Attachment",
      file ? `${file.name} (${Math.round(file.size / 1024)} KB): ${file.url}` : undefined,
    ],
  ];
  return rows.filter((r): r is [string, string] => !!r[1]);
}

/** Sends the enquiry to email (Resend) and/or a CRM webhook. Throws on failure. */
export async function deliver(v: ContactValues, file?: StoredFile) {
  const rows = summary(v, file);
  const jobs: Promise<void>[] = [];

  const resendKey = env("RESEND_API_KEY");
  if (resendKey) {
    const subject = `New enquiry: ${rows[0][1]} from ${v.name}${v.company ? ` (${v.company})` : ""}`;
    const html = `<table cellpadding="6" style="font-family:sans-serif;font-size:14px">${rows
      .map(
        ([k, val]) =>
          `<tr><td style="color:#6a6870;vertical-align:top">${esc(k)}</td><td style="white-space:pre-wrap">${esc(val)}</td></tr>`,
      )
      .join("")}</table>`;
    jobs.push(
      fetch("https://api.resend.com/emails", {
        method: "POST",
        headers: { Authorization: `Bearer ${resendKey}`, "Content-Type": "application/json" },
        body: JSON.stringify({
          from: env("CONTACT_FROM") ?? "PSQUARE COMPANY <website@psquarecompany.com>",
          to: (env("CONTACT_TO") ?? "info@psquarecompany.com").split(","),
          reply_to: v.email,
          subject,
          html,
          text: rows.map(([k, val]) => `${k}: ${val}`).join("\n"),
        }),
      }).then(async (r) => {
        if (!r.ok) throw new Error(`resend ${r.status}: ${await r.text()}`);
      }),
    );
  }

  const hook = env("CONTACT_WEBHOOK_URL");
  if (hook) {
    const { company_website: _hp, ...payload } = v;
    void _hp;
    jobs.push(
      fetch(hook, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          ...(env("CONTACT_WEBHOOK_SECRET")
            ? { Authorization: `Bearer ${env("CONTACT_WEBHOOK_SECRET")}` }
            : {}),
        },
        body: JSON.stringify({
          ...payload,
          file: file ?? null,
          source: "psquare-ca-website",
          submittedAt: new Date().toISOString(),
        }),
      }).then((r) => {
        if (!r.ok) throw new Error(`webhook ${r.status}`);
      }),
    );
  }

  await Promise.all(jobs);
}
