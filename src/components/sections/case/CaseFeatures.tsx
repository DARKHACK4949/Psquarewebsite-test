"use client";

import { useEffect, useRef, useState } from "react";
import { CaseShot } from "./CaseShot";
import type { CaseStudy } from "@/content/case-studies";
import styles from "./CaseStudy.module.css";

/**
 * Three features of the product. Wide screens: the screen holds on the left
 * while the features scroll past on the right; the one crossing the middle of
 * the screen comes forward and its screen takes the frame. Phones and reduced
 * motion: each feature stacks with its own screen.
 */
export function CaseFeatures({ features }: { features: CaseStudy["features"] }) {
  const [active, setActive] = useState(0);
  const list = useRef<HTMLOListElement>(null);

  useEffect(() => {
    const items = Array.from(list.current?.querySelectorAll<HTMLElement>("[data-i]") ?? []);
    const io = new IntersectionObserver(
      (entries) => {
        for (const e of entries) {
          if (e.isIntersecting) setActive(Number((e.target as HTMLElement).dataset.i));
        }
      },
      { rootMargin: "-50% 0px -50% 0px" },
    );
    items.forEach((it) => io.observe(it));
    return () => io.disconnect();
  }, []);

  return (
    <section data-screen-label="07 Features" className={styles.features}>
      <div className={styles.fStage} aria-hidden="true">
        <div className={styles.fFrame}>
          {features.map((f, i) => (
            <div key={f.title} className={styles.fShot} data-on={active === i || undefined}>
              <CaseShot img={f.img} sizes="(min-width: 900px) 50vw, 1px" />
            </div>
          ))}
        </div>
      </div>
      <ol ref={list} className={styles.fList}>
        {features.map((f, i) => (
          <li key={f.title} data-i={i} className={styles.fItem} data-on={active === i || undefined}>
            <div className={styles.fStill}>
              <CaseShot img={f.img} sizes="(min-width: 900px) 1px, 92vw" />
            </div>
            <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
            <h3 className={styles.fTitle}>{f.title}</h3>
            <p className={styles.fBody}>{f.body}</p>
          </li>
        ))}
      </ol>
    </section>
  );
}
