"use client";

import { useRef } from "react";
import { numbers } from "@/content/about";
import { companyPreview } from "@/content/company-preview";
import { gsap, useGSAP, FULL } from "@/lib/motion";
import { BlurWords, resolveWords } from "./BlurText";
import styles from "./CountStage.module.css";

/**
 * The numbers, one at a time. The screen holds while each figure counts up
 * as the page scrolls, then softens away as the next one rises into its
 * place. Three short bars mark where you are.
 */
export function CountStage() {
  const root = useRef<HTMLElement>(null);
  const title = numbers.title.join(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const el = root.current!;
        const head = el.querySelector<HTMLElement>("[data-c=head]")!;
        const stats = gsap.utils.toArray<HTMLElement>("[data-c=stat]", el);
        const bars = gsap.utils.toArray<HTMLElement>("[data-c=bar]", el);

        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top 60%", end: "bottom bottom", scrub: 0.6 },
        });
        gsap.set(head.querySelectorAll("[data-w=sharp]"), { opacity: 0 });
        resolveWords(tl, head, 0, 0.05, 0.16);

        stats.forEach((s, i) => {
          const at = 0.4 + i * 1.7;
          const figs = s.querySelectorAll<HTMLElement>("[data-c=n]");
          const value = Number(s.dataset.value);
          const count = { v: 0 };
          const write = () => {
            const t = String(Math.round(count.v));
            figs.forEach((f) => (f.textContent = t));
          };
          write();
          const sharp = s.querySelector<HTMLElement>("[data-c=sharp]")!;
          const soft = s.querySelector<HTMLElement>("[data-c=soft]")!;
          const label = s.querySelector<HTMLElement>("[data-c=label]")!;

          // In: rises from below, out of a blur, counting as it comes.
          tl.fromTo(s, { opacity: 0, y: "14%" }, { opacity: 1, y: "0%", duration: 0.45, ease: "power2.out" }, at)
            .fromTo(soft, { opacity: 1 }, { opacity: 0, duration: 0.45 }, at)
            .fromTo(sharp, { opacity: 0 }, { opacity: 1, duration: 0.35 }, at + 0.1)
            .to(count, { v: value, duration: 0.7, ease: "power2.out", onUpdate: write }, at)
            .fromTo(label, { opacity: 0, y: 12 }, { opacity: 1, y: 0, duration: 0.25 }, at + 0.3)
            .fromTo(bars[i], { scaleX: 0 }, { scaleX: 1, duration: 1.7 }, at);
          // Out: lifts and melts back into a blur (the last one stays).
          if (i < stats.length - 1) {
            tl.to(s, { opacity: 0, y: "-10%", duration: 0.35, ease: "power1.in" }, at + 1.35)
              .to(soft, { opacity: 1, duration: 0.2 }, at + 1.35)
              .to(sharp, { opacity: 0, duration: 0.25 }, at + 1.35);
          }
        });
        tl.to({}, { duration: 0.5 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-screen-label="02 Numbers"
      data-noband=""
      data-nav-dark=""
      className={styles.section}
    >
      <div className={styles.stage}>
        <div className={styles.inner}>
          <div className={styles.top}>
            <h2 data-c="head" className={styles.h2} aria-label={title}>
              <BlurWords text={title} />
            </h2>
            <p className={styles.lead}>{companyPreview.numbersLead}</p>
          </div>

          <ul className={styles.stats}>
            {numbers.stats.map((s) => (
              <li key={s.label} data-c="stat" data-value={s.value} className={styles.stat}>
                <p className={styles.figure} aria-label={`${s.value}${s.suffix}`}>
                  <span aria-hidden="true" className={styles.num}>
                    <span data-c="sharp" className={styles.sharp}>
                      <span data-c="n">{s.value}</span>
                      <span className={styles.suffix}>{s.suffix}</span>
                    </span>
                    <span data-c="soft" className={styles.soft}>
                      <span data-c="n">{s.value}</span>
                      <span className={styles.suffix}>{s.suffix}</span>
                    </span>
                  </span>
                </p>
                <p data-c="label" className={styles.label}>
                  {s.label}
                </p>
              </li>
            ))}
          </ul>

          <div aria-hidden="true" className={styles.bars}>
            {numbers.stats.map((s) => (
              <span key={s.label} className={styles.track}>
                <span data-c="bar" className={styles.fill} />
              </span>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
