"use client";

import Image from "next/image";
import { useRef, useState } from "react";
import { Words } from "@/components/ui/Words";
import { journey } from "@/content/about";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { gsap, ScrollTrigger, useGSAP } from "@/lib/motion";
import styles from "./Journey.module.css";

const PIN_MQ = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
const M = journey.milestones;
const N = M.length;

function cx(...c: (string | false | undefined)[]) {
  return c.filter(Boolean).join(" ");
}

/** Placeholder until the milestone photos arrive: a quiet tinted panel with its caption. */
function Photo({ caption }: { caption: string }) {
  return (
    <div className={styles.photo}>
      <Image src="/images/psquare-mark.svg" alt="" width={64} height={64} className={styles.mark} />
      <span className={styles.caption}>{caption}</span>
    </div>
  );
}

/**
 * "How we got here". Desktop: a pinned stage; scrolling moves through the five
 * years (the year digits roll, the photo and copy cross-fade, each year's bar
 * fills). Phones and reduced motion: a plain list.
 */
export function Journey() {
  const pin = useRef<HTMLDivElement>(null);
  const st = useRef<ScrollTrigger | null>(null);
  const [yr, setYr] = useState(0);
  const { scrollTo } = useSmoothScroll();

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PIN_MQ, () => {
        const el = pin.current!;
        const fills = Array.from(el.querySelectorAll<HTMLElement>("[data-jfill]"));
        st.current = ScrollTrigger.create({
          trigger: el,
          start: "top top",
          end: () => "+=" + Math.round(window.innerHeight * 0.7 * N),
          pin: true,
          anticipatePin: 1,
          invalidateOnRefresh: true,
          onUpdate: (self) => {
            const v = self.progress * N;
            fills.forEach((f, i) => {
              f.style.transform = `scaleX(${Math.min(1, Math.max(0, v - i))})`;
            });
            const idx = Math.min(N - 1, Math.floor(v));
            setYr((cur) => (cur === idx ? cur : idx));
          },
        });
        return () => {
          st.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: pin },
  );

  const goYear = (i: number) => {
    const t = st.current;
    if (!t) return setYr(i);
    scrollTo(t.start + ((i + 0.5) / N) * (t.end - t.start), { duration: 1.4 });
  };

  return (
    <section data-screen-label="03 Journey" className={styles.section}>
      <div ref={pin} className={styles.wide}>
        <div className={styles.stage}>
          <h2 className={styles.h2Pinned}>{journey.title}</h2>
          <div className={styles.body}>
            <div className={styles.media}>
              {M.map((m, i) => (
                <div
                  key={m.year}
                  aria-hidden={yr !== i}
                  className={cx(styles.slide, yr === i && styles.on)}
                >
                  <Photo caption={m.photo} />
                </div>
              ))}
            </div>
            <div className={styles.copy}>
              <div aria-hidden="true" className={styles.year}>
                <span>20</span>
                <span className={styles.digits}>
                  <span className={styles.ghost}>00</span>
                  {M.map((m, i) => (
                    <span
                      key={m.year}
                      className={styles.digit}
                      data-pos={i === yr ? "on" : i < yr ? "past" : "next"}
                    >
                      {m.year.slice(2)}
                    </span>
                  ))}
                </span>
              </div>
              <div className={styles.texts} aria-live="polite">
                {M.map((m, i) => (
                  <div
                    key={m.year}
                    aria-hidden={yr !== i}
                    className={styles.text}
                    data-pos={i === yr ? "on" : i < yr ? "past" : "next"}
                  >
                    <h3 className={styles.h3}>{m.title}</h3>
                    <p className={styles.p}>{m.copy}</p>
                  </div>
                ))}
              </div>
            </div>
          </div>
          <nav aria-label="Years" className={styles.years}>
            {M.map((m, i) => (
              <button
                key={m.year}
                type="button"
                aria-current={yr === i ? "step" : undefined}
                onClick={() => goYear(i)}
                className={styles.yearBtn}
              >
                <span className={styles.track}>
                  <span data-jfill="" className={styles.fill} />
                </span>
                <span className={styles.yearLabel}>
                  <span className={styles.yearNum}>{m.year}</span>
                  <span className={styles.yearTitle}>{m.title}</span>
                </span>
              </button>
            ))}
          </nav>
        </div>
      </div>

      <div className={styles.narrow}>
        <h2 className={styles.h2} data-split="" aria-label={journey.title}>
          <Words text={journey.title} />
        </h2>
        <ol className={styles.list}>
          {M.map((m) => (
            <li key={m.year} data-reveal="" className={styles.item}>
              <div className={styles.itemMedia}>
                <Photo caption={m.photo} />
              </div>
              <div className={styles.itemText}>
                <span className={styles.itemYear}>{m.year}</span>
                <h3 className={styles.h3}>{m.title}</h3>
                <p className={styles.itemP}>{m.copy}</p>
              </div>
            </li>
          ))}
        </ol>
      </div>
    </section>
  );
}
