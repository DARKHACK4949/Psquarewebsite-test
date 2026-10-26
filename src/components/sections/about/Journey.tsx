"use client";

import { useEffect, useRef, useState, type CSSProperties } from "react";
import { Words } from "@/components/ui/Words";
import { journey } from "@/content/about";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./Journey.module.css";

const WIDE_MQ = "(min-width: 1100px)";

/**
 * "Five years. One idea, kept simple." The five milestones on one timeline:
 * a row of columns on desktop (hovering one dims the rest), a vertical rail
 * on tablets and phones. When the list enters, each rail draws in and its
 * milestone rises, one after another.
 */
export function Journey() {
  const list = useRef<HTMLOListElement>(null);
  const [shown, setShown] = useState(false);
  const [hov, setHov] = useState(-1);

  useEffect(() => {
    // Reduced motion: the CSS shows every milestone at once, nothing to observe.
    if (prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      (es) => {
        if (es.some((e) => e.isIntersecting)) {
          setShown(true);
          io.disconnect();
        }
      },
      { threshold: 0.25 },
    );
    io.observe(list.current!);
    return () => io.disconnect();
  }, []);

  const enter = (i: number) => {
    if (window.matchMedia(WIDE_MQ).matches) setHov(i);
  };

  return (
    <section data-screen-label="03 Journey" className={styles.section}>
      <div aria-hidden="true" className={styles.glow} />
      <div className={styles.inner}>
        <div className={styles.head}>
          <div className={styles.titleCol}>
            <span className={styles.eyebrow}>{journey.eyebrow}</span>
            <h2 className={styles.h2} data-split="" aria-label={journey.title.join(" ")}>
              <Words text={journey.title[0]} />{" "}
              <span className={styles.accent}>
                <Words text={journey.title[1]} />
              </span>
            </h2>
          </div>
          <p className={styles.lead} data-reveal="">
            {journey.lead}
          </p>
        </div>
        <ol
          ref={list}
          aria-label="Milestones"
          onMouseLeave={() => setHov(-1)}
          className={styles.list}
          data-shown={shown || undefined}
          data-hov={hov !== -1 || undefined}
        >
          {journey.milestones.map((m, i) => (
            <li
              key={m.year}
              tabIndex={0}
              onMouseEnter={() => enter(i)}
              onFocus={() => enter(i)}
              data-on={hov === i || undefined}
              className={styles.item}
              style={{ "--d": `${i * 0.14}s` } as CSSProperties}
            >
              <div aria-hidden="true" className={styles.rail}>
                <span className={styles.fill} />
              </div>
              <div className={styles.body}>
                <span className={styles.year}>
                  <span className={styles.pre}>20</span>
                  <span className={styles.accent}>{m.year.slice(2)}</span>
                </span>
                <h3 className={styles.h3}>{m.title}</h3>
                <p className={styles.p}>{m.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
