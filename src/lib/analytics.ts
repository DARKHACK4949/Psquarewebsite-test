"use client";

export type AnalyticsEvent =
  | "cta_book_demo_click"
  | "contact_type_change"
  | "contact_submit_success"
  | "contact_submit_error"
  | "careers_introduce_click"
  | "careers_role_click"
  | "legal_index_click";

export type Consent = "granted" | "denied";

const KEY = "psq-consent";

declare global {
  interface Window {
    dataLayer?: Record<string, unknown>[];
  }
}

export function getConsent(): Consent | null {
  try {
    const v = localStorage.getItem(KEY);
    return v === "granted" || v === "denied" ? v : null;
  } catch {
    return null;
  }
}

export function setConsent(v: Consent) {
  try {
    localStorage.setItem(KEY, v);
  } catch {}
  window.dispatchEvent(new CustomEvent("psq:consent", { detail: v }));
}

/**
 * Provider-agnostic event sink. Events go to window.dataLayer (GTM, GA4,
 * Plausible-via-GTM and most CRMs read it) only once the visitor has accepted
 * analytics cookies. Swap the body for the provider the client confirms.
 */
export function track(event: AnalyticsEvent, props: Record<string, unknown> = {}) {
  if (typeof window === "undefined" || getConsent() !== "granted") return;
  window.dataLayer = window.dataLayer ?? [];
  window.dataLayer.push({ event, ...props });
}
