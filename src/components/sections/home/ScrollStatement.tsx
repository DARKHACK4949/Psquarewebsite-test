"use client";

import { useRef, type ReactNode } from "react";
import { gsap, useGSAP, FULL } from "@/lib/motion";
import styles from "./ScrollStatement.module.css";

/**
 * One sentence on night, held mid-screen while the page scrolls past it. Its
 * words resolve from a blur in reading order as the scroll moves through: a sharp
 * copy of each word cross-fades with a pre-blurred one (opacity only). Anything
 * passed as children settles in under the line once it has resolved.
 */
export function ScrollStatement({
  text,
  label,
  children,
}: {
  text: string;
  label: string;
  children?: ReactNode;
}) {
  const root = useRef<HTMLElement>(null);
  const words = text.split(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const el = root.current!;
        const sharp = gsap.utils.toArray<HTMLElement>("[data-w=sharp]", el);
        const soft = gsap.utils.toArray<HTMLElement>("[data-w=soft]", el);
        const after = el.querySelector<HTMLElement>("[data-w=after]");
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top 40%", end: "bottom bottom", scrub: true },
        });
        sharp.forEach((s, i) => {
          const at = i * 0.08;
          tl.fromTo(soft[i], { opacity: 0 }, { opacity: 1, duration: 0.14 }, at)
            .to(soft[i], { opacity: 0, duration: 0.2 }, at + 0.14)
            .fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.22 }, at + 0.1);
        });
        if (after) {
          tl.fromTo(
            after,
            { opacity: 0, y: 24 },
            { opacity: 1, y: 0, duration: 0.4, ease: "power2.out" },
            ">-0.05",
          );
        }
        tl.to({}, { duration: 0.3 });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-screen-label={label}
      data-noband=""
      data-nav-dark=""
      className={styles.section}
    >
      <div className={styles.stick}>
        <h2 className={styles.line} aria-label={text}>
          {words.map((w, i) => (
            <span key={i} aria-hidden="true">
              <span className={styles.word}>
                <span data-w="sharp">{w}</span>
                <span data-w="soft" className={styles.soft}>
                  {w}
                </span>
              </span>
              {i < words.length - 1 ? " " : null}
            </span>
          ))}
        </h2>
        {children && (
          <div data-w="after" className={styles.after}>
            {children}
          </div>
        )}
      </div>
    </section>
  );
}
