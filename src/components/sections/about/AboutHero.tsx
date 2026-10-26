"use client";

import { useRef, type CSSProperties } from "react";
import { aboutHero } from "@/content/about";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { gsap, useGSAP, FULL } from "@/lib/motion";
import { LoopVideo } from "./LoopVideo";
import styles from "./AboutHero.module.css";

/**
 * Company hero: a night band behind the headline that ends halfway down the
 * reel. The headline and lead enter with CSS; the reel opens to full width
 * and settles its zoom as it scrolls into view.
 */
export function AboutHero() {
  const reel = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();
  let i = 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const box = reel.current!;
        gsap.fromTo(
          box,
          { scale: 0.9 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: box, start: "top 80%", end: "center 45%", scrub: true },
          },
        );
        gsap.fromTo(
          box.firstElementChild,
          { scale: 1.12 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: box, start: "top bottom", end: "bottom top", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: reel },
  );

  return (
    <section data-screen-label="01 Company hero" className={styles.hero}>
      <div aria-hidden="true" data-nav-dark="" className={styles.night}>
        <div className={styles.glow} />
      </div>
      <div className={styles.grid}>
        <h1 className={styles.h1} aria-label={aboutHero.title.join(" ")}>
          {aboutHero.title.map((part, p) => (
            <span key={part} aria-hidden="true" className={p > 0 ? styles.accent : undefined}>
              {part.split(" ").map((w, j, arr) => (
                <span key={j}>
                  <span className={styles.word} style={{ "--i": i++ } as CSSProperties}>
                    {w}
                  </span>
                  {j < arr.length - 1 ? " " : null}
                </span>
              ))}
              {p < aboutHero.title.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <div className={styles.right}>
          <p className={styles.lead}>{aboutHero.lead}</p>
          <a
            href={aboutHero.link.href}
            className={styles.link}
            onClick={(e) => {
              e.preventDefault();
              scrollTo(aboutHero.link.href);
            }}
          >
            {aboutHero.link.label} <span aria-hidden="true">↓</span>
          </a>
        </div>
      </div>
      <div className={styles.reelWrap}>
        <div ref={reel} className={styles.reel}>
          <div className={styles.reelIn}>
            <LoopVideo
              src={aboutHero.reel}
              eager
              label="PSQUARE company reel"
              className={styles.video}
            />
          </div>
        </div>
      </div>
    </section>
  );
}
