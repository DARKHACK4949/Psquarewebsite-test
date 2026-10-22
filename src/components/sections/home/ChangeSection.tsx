"use client";

import { useRef } from "react";
import type { HomeContent } from "@/content/home";
import { gsap, ScrollTrigger, useGSAP, prefersReducedMotion } from "@/lib/motion";
import styles from "./ChangeSection.module.css";

// Scattered resting spots for the fragments: [x, y] as fractions of the stage, plus tilt.
const SCATTER: [number, number, number][] = [
  [0, 0.03, -5],
  [0.94, 0, 4],
  [0.46, 0.44, -2],
  [1, 0.7, 6],
  [0.05, 0.97, -4],
];
const OUTCOME_AT = [0.3, 0.55, 0.8];

const clamp = (v: number) => Math.max(0, Math.min(1, v));
const eio = (x: number) => (x < 0.5 ? 4 * x * x * x : 1 - Math.pow(-2 * x + 2, 3) / 2);

/**
 * "The change we build": scattered work fragments (chat, spreadsheet, email
 * thread, sticky note, missed call) collapse into "One view of the work" as the
 * stage scrolls through the viewport. Progress is scrubbed by ScrollTrigger.
 */
export function ChangeSection({ change }: { change: HomeContent["change"] }) {
  const root = useRef<HTMLElement>(null);
  const stage = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const st = stage.current!;
      const el = root.current!;
      const panel = st.querySelector<HTMLElement>("[data-c=panel]")!;
      const frags = Array.from(st.querySelectorAll<HTMLElement>("[data-c=frag]"));
      const rows = Array.from(st.querySelectorAll<HTMLElement>("[data-c=row]"));
      const fills = Array.from(el.querySelectorAll<HTMLElement>("[data-c=ofill]"));
      const reduced = prefersReducedMotion();

      const apply = (p: number) => {
        const W = st.offsetWidth,
          H = st.offsetHeight;
        const pa = eio(clamp((p - 0.1) / 0.3));
        panel.style.opacity = String(pa);
        panel.style.transform = `scale(${0.965 + 0.035 * pa})`;
        frags.forEach((f, i) => {
          const r = rows[i];
          if (!r) return;
          const fw = f.offsetWidth,
            fh = f.offsetHeight,
            s = SCATTER[i];
          const rx = panel.offsetLeft + r.offsetLeft + 16,
            ry = panel.offsetTop + r.offsetTop + (r.offsetHeight - fh) / 2;
          const sx = s[0] * Math.max(0, W - fw),
            sy = s[1] * Math.max(0, H - fh);
          const a = clamp((p - (0.14 + i * 0.08)) / 0.32),
            e = eio(a),
            k = 1 - e,
            fade = clamp((a - 0.5) / 0.35);
          const drift = k * (i % 2 ? 1 : -1) * 18 * clamp(p / 0.2);
          f.style.transform = `translate(${rx + (sx - rx) * k}px,${ry + (sy - ry) * k + drift}px) rotate(${s[2] * k}deg) scale(${1 - 0.04 * e})`;
          f.style.opacity = String(1 - fade);
          r.style.opacity = String(fade);
          r.style.transform = `translateY(${(1 - fade) * 6}px)`;
        });
        fills.forEach(
          (f, i) => (f.style.transform = `scaleX(${eio(clamp((p - OUTCOME_AT[i]) / 0.16))})`),
        );
      };

      if (reduced) {
        apply(1);
        const onR = () => apply(1);
        window.addEventListener("resize", onR);
        return () => window.removeEventListener("resize", onR);
      }

      const o = { p: 0 };
      const to = gsap.quickTo(o, "p", {
        duration: 0.6,
        ease: "power3.out",
        onUpdate: () => apply(o.p),
      });
      const abs = (n: HTMLElement) => n.getBoundingClientRect().top + window.scrollY;
      ScrollTrigger.create({
        trigger: st,
        invalidateOnRefresh: true,
        start: () => abs(st) - window.innerHeight * 0.85,
        end: () => abs(st) - window.innerHeight * 0.2,
        onUpdate: (s) => to(s.progress),
        onRefresh: (s) => {
          o.p = s.progress;
          apply(o.p);
        },
      });
      apply(0);

      // Heading lines and copy rise in, scrubbed.
      const q = (s: string) => el.querySelectorAll(`[data-c=${s}]`);
      gsap
        .timeline({ scrollTrigger: { trigger: el, start: "top 85%", end: "top 30%", scrub: 1 } })
        .from(q("line"), { yPercent: 105, ease: "power3.out", duration: 1, stagger: 0.18 }, 0.1)
        .from(
          q("lede"),
          { y: 28, opacity: 0, ease: "power2.out", duration: 0.8, stagger: 0.12 },
          0.45,
        );
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      id="change"
      data-screen-label="02 The change we build"
      className={styles.section}
    >
      <div className={styles.inner}>
        <div className={styles.grid}>
          <div className={styles.copy}>
            <h2 className={styles.h2} aria-label={change.lines.join(" ")}>
              {change.lines.map((l) => (
                <span key={l} className={styles.lineClip} aria-hidden="true">
                  <span data-c="line">{l}</span>
                </span>
              ))}
            </h2>
            <p data-c="lede" className={styles.lead}>
              {change.lead}
            </p>
            <div data-c="lede" role="list" className={styles.outcomes}>
              {change.outcomes.map((o) => (
                <div role="listitem" key={o} className={styles.outcome}>
                  <span aria-hidden="true" className={styles.track}>
                    <span data-c="ofill" />
                  </span>
                  <span className={styles.outcomeText}>{o}</span>
                </div>
              ))}
            </div>
          </div>

          <div ref={stage} aria-hidden="true" className={styles.stage}>
            <div data-c="panel" className={styles.panel}>
              <div className={styles.phead}>
                <span>One view of the work</span>
              </div>
              {change.rows.map((r) => (
                <div data-c="row" key={r.title} className={styles.row}>
                  <span className={styles.rowText}>
                    <span className={styles.rowTitle}>{r.title}</span>
                    <span className={styles.rowMeta}>{r.meta}</span>
                  </span>
                  <span className={styles.avatar}>{r.who}</span>
                  <span
                    className={
                      "idle" in r && r.idle
                        ? `${styles.status} ${styles.statusIdle}`
                        : styles.status
                    }
                  >
                    {r.status}
                  </span>
                </div>
              ))}
            </div>

            <div data-c="frag" className={`${styles.frag} ${styles.fragChat}`}>
              <span className={styles.chatMeta}>Message · 9:42</span>
              <span className={styles.chatText}>Any update on the Tower B service call?</span>
            </div>
            <div data-c="frag" className={`${styles.frag} ${styles.fragFile}`}>
              <span className={styles.fileIcon}>XLS</span>
              <span className={styles.fragStack}>
                <span className={styles.fragTitle}>approvals_v4_FINAL.xlsx</span>
                <span className={styles.fragMeta}>Edited by 4 people</span>
              </span>
            </div>
            <div data-c="frag" className={`${styles.frag} ${styles.fragMail}`}>
              <span className={styles.mailTitle}>Re: Fwd: Re: Invoice #2041</span>
              <span className={styles.fragMeta}>11 replies across 3 threads</span>
            </div>
            <div data-c="frag" className={`${styles.frag} ${styles.fragNote}`}>
              Who’s handling the new joiner?
            </div>
            <div data-c="frag" className={`${styles.frag} ${styles.fragCall}`}>
              <span className={styles.callCount}>3</span>
              <span className={styles.fragStack}>
                <span className={styles.fragTitle}>Missed call</span>
                <span className={styles.fragMeta}>Site office</span>
              </span>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
