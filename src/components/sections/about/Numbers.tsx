"use client";

import { useRef } from "react";
import { Words } from "@/components/ui/Words";
import { numbers } from "@/content/about";
import { gsap, useGSAP, FULL, EASE } from "@/lib/motion";
import styles from "./Numbers.module.css";

/** "Five years in." Three stats that count up once as they enter. */
export function Numbers() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const stats = gsap.utils.toArray<HTMLElement>("[data-stat]");
        gsap.from(stats, {
          y: 32,
          opacity: 0,
          duration: 1,
          ease: EASE,
          stagger: 0.1,
          scrollTrigger: { trigger: stats[0], start: "top 85%", once: true },
        });
        stats.forEach((el) => {
          const out = el.querySelector<HTMLElement>("[data-count]")!;
          const end = Number(out.dataset.count);
          const o = { v: 0 };
          out.textContent = "0";
          gsap.to(o, {
            v: end,
            duration: 1.6,
            ease: "power3.out",
            onUpdate: () => {
              out.textContent = String(Math.round(o.v));
            },
            scrollTrigger: { trigger: el, start: "top 90%", once: true },
          });
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section ref={root} data-screen-label="02 Numbers" className={styles.section}>
      <div className={styles.grid}>
        <h2 className={styles.h2} data-split="" aria-label={numbers.title.join(" ")}>
          <Words text={numbers.title[0]} />{" "}
          <span className={styles.accent}>
            <Words text={numbers.title[1]} />
          </span>
        </h2>
        <dl className={styles.stats}>
          {numbers.stats.map((s) => (
            <div key={s.label} data-stat="" className={styles.stat}>
              <dt>{s.label}</dt>
              <dd>
                <span data-count={s.value}>{s.value}</span>
                <span className={styles.accent}>{s.suffix}</span>
              </dd>
            </div>
          ))}
        </dl>
      </div>
    </section>
  );
}
