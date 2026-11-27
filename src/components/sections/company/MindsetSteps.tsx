"use client";

import { useRef, type CSSProperties } from "react";
import { mindset } from "@/content/about";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./MindsetSteps.module.css";

/** Ten columns of light, rising left to right (share of the stage's height). */
const BARS = [3, 5, 8, 12, 16, 21, 27, 33, 40, 48];
/** The column each step stands on (1-based), in step order. */
const ON = [4, 7, 10];

const WIDE = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
const PHONE = "(max-width: 899px) and (prefers-reduced-motion: no-preference)";

/**
 * "Built from the inside out." as a rise: columns of plum light climb across
 * the screen, and each step (values, then mission, then vision) stands on a
 * higher one, joined to it by a thin line. The corner of each card counts
 * what that step holds. The screen holds while the columns rise with the
 * scroll: on wide screens the steps connect in turn and stay; on phones they
 * come one at a time, each on its own column, so the climb stays readable.
 */
export function MindsetSteps() {
  const root = useRef<HTMLElement>(null);
  const meta = [
    `${mindset.values.length} values`,
    `${mindset.capabilities.length} capabilities`,
    `${mindset.products.length} products, ${mindset.vision.arms.length} arms`,
  ];

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const parts = () => {
        const el = root.current!;
        return {
          el,
          bars: gsap.utils.toArray<HTMLElement>("[data-s=bar]", el),
          steps: gsap.utils.toArray<HTMLElement>("[data-s=step]", el).map((s) => ({
            line: s.querySelector("[data-s=line]"),
            card: s.querySelector("[data-s=card]"),
          })),
        };
      };
      const timeline = (el: HTMLElement) =>
        gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top 35%", end: "bottom bottom", scrub: 0.6 },
        });

      // Wide: the columns rise left to right and the three steps connect in turn, all staying.
      mm.add(WIDE, () => {
        const { el, bars, steps } = parts();
        const tl = timeline(el);
        bars.forEach((b, i) => {
          tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.5, ease: "power2.out" }, i * 0.16);
        });
        steps.forEach(({ line, card }, i) => {
          const at = (ON[i] - 1) * 0.16 + 0.35;
          tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 0.25 }, at).fromTo(
            card,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
            at + 0.18,
          );
        });
        tl.to({}, { duration: 0.4 });
      });

      // Phones: the same rise, but one step at a time; each lifts away as the next arrives higher up.
      mm.add(PHONE, () => {
        const { el, bars, steps } = parts();
        const tl = timeline(el);
        const STEP = 0.34;
        // When each step arrives: a long hold on each, a short hand-over between them.
        const ARRIVE = [1.2, 2.6, 4.0];
        bars.forEach((b, i) => {
          tl.fromTo(b, { scaleY: 0 }, { scaleY: 1, duration: 0.6, ease: "power2.out" }, i * STEP);
        });
        steps.forEach(({ line, card }, i) => {
          const at = ARRIVE[i];
          tl.fromTo(line, { scaleY: 0 }, { scaleY: 1, duration: 0.2 }, at).fromTo(
            card,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.3, ease: "power2.out" },
            at + 0.12,
          );
          if (i < steps.length - 1) {
            const out = ARRIVE[i + 1] - 0.28;
            tl.to(card, { opacity: 0, y: -16, duration: 0.25, ease: "power1.in" }, out).to(
              line,
              { opacity: 0, duration: 0.2 },
              out,
            );
          }
        });
        tl.to({}, { duration: 0.6 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-screen-label="04 Mindset"
      data-noband=""
      data-nav-dark=""
      className={styles.section}
    >
      <div className={styles.stick}>
        <div className={styles.inner}>
          <div className={styles.head}>
            <h2 className={styles.h2}>{mindset.title}</h2>
            <p className={styles.lead}>{mindset.lead}</p>
          </div>

          <div className={styles.stage}>
            <div aria-hidden="true" className={styles.bars}>
              {BARS.map((h, i) => (
                <span key={i} className={styles.col} style={{ "--h": `${h}%` } as CSSProperties}>
                  <span data-s="bar" className={styles.bar} />
                </span>
              ))}
            </div>
            <ol className={styles.steps}>
              {mindset.steps.map((s, i) => (
                <li
                  key={s.title}
                  data-s="step"
                  className={styles.step}
                  style={
                    {
                      "--x": `${((ON[i] - 1) / BARS.length) * 100}%`,
                      "--xv": `${((ON[i] - 1) / BARS.length) * 100}vw`,
                      "--h": `${BARS[ON[i] - 1]}%`,
                    } as CSSProperties
                  }
                >
                  <span aria-hidden="true" data-s="line" className={styles.line} />
                  <div data-s="card" className={styles.card}>
                    <p className={styles.top}>
                      <span>Step {i + 1}</span>
                      <span className={styles.meta}>{meta[i]}</span>
                    </p>
                    <h3 className={styles.h3}>{s.title}</h3>
                    <p className={styles.copy}>{s.copy}</p>
                  </div>
                </li>
              ))}
            </ol>
          </div>
        </div>
      </div>
    </section>
  );
}
