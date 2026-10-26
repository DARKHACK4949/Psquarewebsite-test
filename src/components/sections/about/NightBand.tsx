"use client";

import { useRef, type ReactNode } from "react";
import { gsap, ScrollTrigger, useGSAP, FULL } from "@/lib/motion";
import styles from "./NightBand.module.css";

/**
 * The dark stretch of the Company page (team and culture). Its background
 * starts inset like a card and opens to full width as it scrolls in, then
 * closes again on the way out.
 */
export function NightBand({ children }: { children: ReactNode }) {
  const root = useRef<HTMLDivElement>(null);
  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const el = root.current!;
        const bg = el.querySelector<HTMLElement>("[data-night-bg]")!;
        const out = (x: number) => 1 - Math.pow(1 - x, 3);
        let a = 0,
          b = 0;
        const set = () => {
          const k = Math.min(out(a), out(1 - b));
          bg.style.transform = `scaleX(${(0.94 + 0.06 * k).toFixed(4)})`;
        };
        ScrollTrigger.create({
          trigger: el,
          start: "top bottom",
          end: "top 10%",
          onUpdate: (s) => {
            a = s.progress;
            set();
          },
          onRefresh: (s) => {
            a = s.progress;
            set();
          },
        });
        ScrollTrigger.create({
          trigger: el,
          start: "bottom 90%",
          end: "bottom top",
          onUpdate: (s) => {
            b = s.progress;
            set();
          },
          onRefresh: (s) => {
            b = s.progress;
            set();
          },
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );
  return (
    <div ref={root} className={styles.band}>
      <div aria-hidden="true" data-night-bg="" data-nav-dark="" className={styles.bg} />
      {children}
    </div>
  );
}
