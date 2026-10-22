"use client";

import { useEffect, useRef, useState } from "react";
import { Words } from "@/components/ui/Words";
import type { HomeContent } from "@/content/home";
import { CONTACT_EMAIL } from "@/lib/site";
import styles from "./Faq.module.css";

/** "Questions, answered." Accordion with one item open at a time. */
export function Faq({ faq }: { faq: HomeContent["faq"] }) {
  const [open, setOpen] = useState(-1);
  const [side, setSide] = useState(false);
  const head = useRef<HTMLDivElement>(null);
  const list = useRef<HTMLDivElement>(null);

  // The heading sticks only while it sits beside the list.
  useEffect(() => {
    const check = () => {
      const h = head.current,
        l = list.current;
      setSide(!!(h && l && l.offsetLeft > h.offsetLeft + h.offsetWidth));
    };
    const ro = new ResizeObserver(check);
    if (list.current) ro.observe(list.current);
    check();
    return () => ro.disconnect();
  }, []);

  return (
    <section data-screen-label="08 Questions" className={styles.section}>
      <div className={styles.wrap}>
        <div ref={head} className={side ? `${styles.head} ${styles.sticky}` : styles.head}>
          <h2 className={styles.h2} data-split="" aria-label={faq.title}>
            <Words text={faq.title} />
          </h2>
          <p className={styles.note} data-reveal="">
            Something else on your mind? Write to{" "}
            <a href={`mailto:${CONTACT_EMAIL}`}>{CONTACT_EMAIL}</a>
          </p>
        </div>
        <div ref={list} className={styles.list} data-reveal="">
          {faq.items.map((it, i) => {
            const on = open === i;
            return (
              <div
                key={it.q}
                className={styles.item}
                data-on={on || undefined}
                data-dim={(open !== -1 && !on) || undefined}
              >
                <span aria-hidden="true" className={styles.bar} />
                <h3 className={styles.qWrap}>
                  <button
                    type="button"
                    id={`faq-q-${i}`}
                    aria-expanded={on}
                    aria-controls={`faq-a-${i}`}
                    onClick={() => setOpen(on ? -1 : i)}
                    className={styles.q}
                  >
                    <span className={styles.num}>{String(i + 1).padStart(2, "0")}</span>
                    <span className={styles.qText}>{it.q}</span>
                    <span aria-hidden="true" className={styles.plus}>
                      <span />
                      <span />
                    </span>
                  </button>
                </h3>
                <div
                  id={`faq-a-${i}`}
                  role="region"
                  aria-labelledby={`faq-q-${i}`}
                  className={styles.a}
                  inert={!on}
                >
                  <div>
                    <p>{it.a}</p>
                  </div>
                </div>
              </div>
            );
          })}
        </div>
      </div>
    </section>
  );
}
