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
 * "Built from the inside out." drawn as an object: an exploded stack of glass.
 * A lit plum sphere holds the values; under it the mission disc carries what
 * we do, and the widest disc (ringed with fine ticks, like a bezel) carries
 * the vision: the products and the two new arms. Labels stand upright at
 * their place on each rim and travel with it as the discs turn, very slowly.
 * On wide screens the screen holds while the discs lift apart one by one and
 * the matching step lights up beside them.
 */
export function MindsetOrbit() {
  const root = useRef<HTMLElement>(null);
  const outer = [
    ...mindset.products.map((name) => ({ name, kind: "product" as const })),
    ...mindset.vision.arms.map((a) => ({ name: a.name, kind: "arm" as const })),
  ];
  const at2 = around(mindset.capabilities.length, 36);
  const at3 = around(outer.length, 30);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      // Where each layer rests in the open stack, as a share of the scene's height.
      const REST = { core: -21, mission: 1, vision: 21 };
      const build = (tl: gsap.core.Timeline, el: HTMLElement, steps: boolean) => {
        const core = el.querySelector("[data-m=core]");
        const mission = el.querySelector("[data-m=mission]");
        const vision = el.querySelector("[data-m=vision]");
        const floor = el.querySelector("[data-m=floor]");
        const l2 = el.querySelectorAll("[data-m=c2]");
        const l3 = el.querySelectorAll("[data-m=c3]");
        const stepEls = el.querySelectorAll<HTMLElement>("[data-m=step]");
        tl.fromTo(core, { yPercent: REST.core + 8, scale: 0.86, opacity: 0 }, { yPercent: REST.core, scale: 1, opacity: 1, duration: 0.7, ease: "psq" }, 0)
          .fromTo(mission, { yPercent: 12, opacity: 0.18 }, { yPercent: 12, opacity: 0.18, duration: 0.01 }, 0)
          .fromTo(vision, { yPercent: 14, opacity: 0.12 }, { yPercent: 14, opacity: 0.12, duration: 0.01 }, 0)
          .fromTo(floor, { opacity: 0.3 }, { opacity: 1, duration: 2.6 }, 0)
          .to(mission, { yPercent: REST.mission, opacity: 1, duration: 0.8, ease: "psq" }, 0.9)
          .fromTo(l2, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06 }, 1.2)
          .to(vision, { yPercent: REST.vision, opacity: 1, duration: 0.8, ease: "psq" }, 1.9)
          .fromTo(l3, { opacity: 0 }, { opacity: 1, duration: 0.3, stagger: 0.06 }, 2.2);
        if (steps) {
          stepEls.forEach((s, i) => {
            const at = [0, 0.9, 1.9][i];
            const body = s.querySelector("[data-m=body]");
            tl.fromTo(s, { opacity: 0.32 }, { opacity: 1, duration: 0.3 }, at).fromTo(
              body,
              { opacity: 0, y: 10 },
              { opacity: 1, y: 0, duration: 0.3 },
              at + 0.1,
            );
            if (i < stepEls.length - 1) {
              const off = [0.9, 1.9][i];
              tl.to(s, { opacity: 0.32, duration: 0.3 }, off).to(body, { opacity: 0, duration: 0.2 }, off);
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
          scrollTrigger: {
            trigger: el.querySelector("[data-m=scene]"),
            start: "top 85%",
            end: "bottom 50%",
            scrub: 0.6,
          },
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

          <div data-m="scene" className={styles.scene} aria-hidden="true">
            <div data-m="floor" className={styles.floor} />
            <div data-m="vision" className={`${styles.layer} ${styles.lVision}`}>
              <div className={`${styles.plane} ${styles.vision}`}>
                <div className={`${styles.spin} ${styles.spinSlow}`}>
                  {outer.map((o, i) => (
                    <span
                      key={o.name}
                      className={styles.node}
                      style={{ "--a": `${at3(i)}deg` } as CSSProperties}
                    >
                      <span data-m="c3" className={styles.tag} data-kind={o.kind}>
                        <span className={styles.dot} />
                        {o.name}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div data-m="mission" className={`${styles.layer} ${styles.lMission}`}>
              <div className={`${styles.plane} ${styles.mission}`}>
                <div className={`${styles.spin} ${styles.spinBack}`}>
                  {mindset.capabilities.map((c, i) => (
                    <span
                      key={c}
                      className={styles.node}
                      style={{ "--a": `${at2(i)}deg` } as CSSProperties}
                    >
                      <span data-m="c2" className={`${styles.tag} ${styles.chip}`}>
                        {c}
                      </span>
                    </span>
                  ))}
                </div>
              </div>
            </div>
            <div data-m="core" className={`${styles.layer} ${styles.lCore}`}>
              <div className={styles.sphere}>
                <span className={styles.coreLabel}>{mindset.steps[0].title}</span>
                <ul className={styles.values}>
                  {mindset.values.map((v) => (
                    <li key={v}>{v}</li>
                  ))}
                </ul>
              </div>
            </div>
          </div>
        </div>
      </div>
    </section>
  );
}
