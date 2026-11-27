"use client";

import { useRef, type CSSProperties } from "react";
import { mindset } from "@/content/about";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./MindsetOrbit.module.css";

const WIDE = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
const NARROW = "(max-width: 899px) and (prefers-reduced-motion: no-preference)";

/** Spread n labels around a ring, starting at `from` degrees (0 = top). */
const around = (n: number, from: number) => (i: number) => from + (360 / n) * i;

/**
 * "Built from the inside out." drawn literally. A plum core holds the values;
 * the mission ring opens around it carrying what we do; the vision ring opens
 * last, carrying the products and the two new arms, and turns very slowly.
 * On wide screens the screen holds while each ring opens with the scroll and
 * the matching step lights up beside it.
 */
export function MindsetOrbit() {
  const root = useRef<HTMLElement>(null);
  const [values, mission, vision] = mindset.steps;
  const outer = [
    ...mindset.products.map((name) => ({ name, kind: "product" as const })),
    ...mindset.vision.arms.map((a) => ({ name: a.name, kind: "arm" as const })),
  ];
  const at2 = around(mindset.capabilities.length, 36);
  const at3 = around(outer.length, 30);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const build = (tl: gsap.core.Timeline, el: HTMLElement, steps: boolean) => {
        const core = el.querySelector("[data-m=core]");
        const r2 = el.querySelector("[data-m=r2]");
        const r3 = el.querySelector("[data-m=r3]");
        const chips2 = el.querySelectorAll("[data-m=c2]");
        const chips3 = el.querySelectorAll("[data-m=c3]");
        const stepEls = el.querySelectorAll<HTMLElement>("[data-m=step]");
        tl.fromTo(core, { scale: 0.7, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.6, ease: "psq" }, 0)
          .fromTo(r2, { scale: 0.62, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "psq" }, 0.9)
          .fromTo(chips2, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06 }, 1.2)
          .fromTo(r3, { scale: 0.72, opacity: 0 }, { scale: 1, opacity: 1, duration: 0.7, ease: "psq" }, 1.9)
          .fromTo(chips3, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06 }, 2.2);
        if (steps) {
          stepEls.forEach((s, i) => {
            const at = [0, 0.9, 1.9][i];
            tl.fromTo(s, { opacity: 0.28 }, { opacity: 1, duration: 0.3 }, at);
            const body = s.querySelector("[data-m=body]");
            tl.fromTo(body, { opacity: 0, y: 10 }, { opacity: 1, y: 0, duration: 0.3 }, at + 0.1);
            if (i < stepEls.length - 1) {
              tl.to(s, { opacity: 0.28, duration: 0.3 }, [0.9, 1.9][i])
                .to(body, { opacity: 0, duration: 0.2 }, [0.9, 1.9][i]);
            }
          });
        }
        tl.to({}, { duration: 0.6 });
      };
      mm.add(WIDE, () => {
        const el = root.current!;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top 20%", end: "bottom bottom", scrub: 0.6 },
        });
        build(tl, el, true);
      });
      mm.add(NARROW, () => {
        const el = root.current!;
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el.querySelector("[data-m=orbit]"), start: "top 80%", end: "bottom 45%", scrub: 0.6 },
        });
        build(tl, el, false);
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
      <div className={styles.stage}>
        <div className={styles.inner}>
          <div className={styles.copy}>
            <h2 className={styles.h2}>{mindset.title}</h2>
            <p className={styles.lead}>{mindset.lead}</p>
            <ol className={styles.steps}>
              {mindset.steps.map((s) => (
                <li key={s.title} data-m="step" className={styles.step}>
                  <h3 className={styles.stepTitle}>{s.title}</h3>
                  <p data-m="body" className={styles.stepBody}>
                    {s.copy}
                  </p>
                </li>
              ))}
            </ol>
          </div>

          <div data-m="orbit" className={styles.orbit} aria-hidden="true">
            <div data-m="r3" className={`${styles.ring} ${styles.r3}`}>
              <span className={styles.ringLabel}>{vision.title}</span>
              <div className={styles.spin}>
                {outer.map((o, i) => (
                  <span
                    key={o.name}
                    data-m="c3"
                    className={styles.node}
                    data-kind={o.kind}
                    style={{ "--a": `${at3(i)}deg` } as CSSProperties}
                  >
                    <span className={styles.counter}>
                      <span className={styles.dot} />
                      {o.name}
                    </span>
                  </span>
                ))}
              </div>
            </div>
            <div data-m="r2" className={`${styles.ring} ${styles.r2}`}>
              <span className={styles.ringLabel}>{mission.title}</span>
              {mindset.capabilities.map((c, i) => (
                <span
                  key={c}
                  data-m="c2"
                  className={styles.node}
                  style={{ "--a": `${at2(i)}deg` } as CSSProperties}
                >
                  <span className={styles.chip}>{c}</span>
                </span>
              ))}
            </div>
            <div data-m="core" className={styles.core}>
              <span className={styles.coreLabel}>{values.title}</span>
              <ul className={styles.values}>
                {mindset.values.map((v) => (
                  <li key={v}>{v}</li>
                ))}
              </ul>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
