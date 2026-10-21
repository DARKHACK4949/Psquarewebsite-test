"use client";

import { useRef, useState, type CSSProperties } from "react";
import { AccentLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import { industries } from "@/content/home";
import styles from "./Industries.module.css";

export function Industries() {
  const [active, setActive] = useState(0);
  const tabs = useRef<(HTMLButtonElement | null)[]>([]);
  const n = industries.tabs.length;

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    let next = -1;
    if (d) next = (active + d + n) % n;
    else if (e.key === "Home") next = 0;
    else if (e.key === "End") next = n - 1;
    if (next < 0) return;
    e.preventDefault();
    setActive(next);
    tabs.current[next]?.focus();
  };

  return (
    <section id="business" data-screen-label="06 Industries" className={styles.section}>
      <div className={styles.head}>
        <span className={styles.eyebrow}>{industries.eyebrow}</span>
        <h2 className={styles.h2} data-split="" aria-label={industries.title}>
          <Words text={industries.title} />
        </h2>
      </div>
      <div className={styles.body}>
        <div
          role="tablist"
          aria-label="Industries"
          className={styles.tablist}
          onKeyDown={onKey}
          data-reveal=""
        >
          {industries.tabs.map((t, i) => (
            <button
              key={t.label}
              ref={(el) => {
                tabs.current[i] = el;
              }}
              type="button"
              role="tab"
              id={`ind-tab-${i}`}
              aria-selected={active === i}
              aria-controls={`ind-panel-${i}`}
              tabIndex={active === i ? 0 : -1}
              onClick={() => setActive(i)}
              className={styles.tab}
            >
              {t.label}
            </button>
          ))}
        </div>
        <div className={styles.panels} data-reveal="">
          {industries.tabs.map((t, i) => {
            const on = active === i;
            return (
              <div
                key={t.label}
                role="tabpanel"
                id={`ind-panel-${i}`}
                aria-labelledby={`ind-tab-${i}`}
                aria-hidden={!on}
                inert={!on}
                className={on ? `${styles.panel} ${styles.on}` : styles.panel}
              >
                <h3 className={styles.h3} style={{ "--d": "0ms" } as CSSProperties}>
                  {t.title[0]}
                  <br />
                  {t.title[1]}
                </h3>
                <ol className={styles.steps}>
                  {t.steps.map(([title, line], j) => (
                    <li key={title} style={{ "--d": `${(j + 1) * 60}ms` } as CSSProperties}>
                      <span className={styles.num}>{String(j + 1).padStart(2, "0")}</span>
                      <span className={styles.stepText}>
                        <span className={styles.stepTitle}>{title}</span>
                        <span className={styles.stepLine}>{line}</span>
                      </span>
                    </li>
                  ))}
                </ol>
              </div>
            );
          })}
        </div>
      </div>
      <div className={styles.foot} data-reveal="">
        <span>{industries.footer}</span>
        <AccentLink href={industries.all.href}>{industries.all.label}</AccentLink>
      </div>
    </section>
  );
}
