"use client";

import { useEffect, useState } from "react";
import { getConsent, setConsent, track, type AnalyticsEvent } from "@/lib/analytics";
import { PRIVACY_URL } from "@/lib/site";
import styles from "./Analytics.module.css";

/**
 * Wires declarative tracking (`data-track="cta_book_demo_click"` on any link)
 * and shows the cookie consent prompt until the visitor answers.
 */
export function Analytics() {
  const [ask, setAsk] = useState(false);

  useEffect(() => {
    // Read consent after mount so the server render never depends on storage.
    const t = setTimeout(() => setAsk(getConsent() === null), 1500);
    const onClick = (e: MouseEvent) => {
      const el = (e.target as Element | null)?.closest<HTMLElement>("[data-track]");
      if (el) track(el.dataset.track as AnalyticsEvent, { label: el.textContent?.trim() });
    };
    document.addEventListener("click", onClick);
    return () => {
      clearTimeout(t);
      document.removeEventListener("click", onClick);
    };
  }, []);

  if (!ask) return null;
  const answer = (v: "granted" | "denied") => {
    setConsent(v);
    setAsk(false);
  };

  return (
    <div role="dialog" aria-label="Cookie preferences" className={styles.banner}>
      <p className={styles.text}>
        We use analytics cookies to understand how the site is used.{" "}
        <a href={PRIVACY_URL}>Privacy policy</a>
      </p>
      <div className={styles.actions}>
        <button type="button" className={styles.decline} onClick={() => answer("denied")}>
          Decline
        </button>
        <button type="button" className={styles.accept} onClick={() => answer("granted")}>
          Accept
        </button>
      </div>
    </div>
  );
}
