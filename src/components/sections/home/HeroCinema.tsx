"use client";

import { useRef, type CSSProperties } from "react";
import type { HomeContent } from "@/content/home";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import { gsap, useGSAP, FULL } from "@/lib/motion";
import styles from "./HeroCinema.module.css";

/**
 * Dark hero: the promise in display type, then the reel, which tells the
 * scattered-to-simple story on its own. The reel is a rounded frame within
 * the page margin that settles up to full size as it scrolls in (transform
 * only). The headline rises word by word on load; that is the page's one
 * entrance moment.
 */
export function HeroCinema({ hero }: { hero: HomeContent["hero"] }) {
  const root = useRef<HTMLElement>(null);
  const title = hero.lines.join(" ");
  let i = 0;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const frame = root.current!.querySelector<HTMLElement>("[data-h=frame]")!;
        gsap.fromTo(
          frame,
          { scale: 0.94 },
          {
            scale: 1,
            ease: "none",
            scrollTrigger: { trigger: frame, start: "top 95%", end: "top 30%", scrub: true },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-screen-label="01 Hero"
      data-noband=""
      data-nav-dark=""
      className={styles.hero}
    >
      <div className={styles.head}>
        <h1 className={styles.h1} aria-label={title}>
          {title.split(" ").map((w, j, arr) => (
            // The space sits outside the clipping box: inside an inline-block it collapses.
            <span key={j} aria-hidden="true">
              <span className={styles.clip}>
                <span className={styles.word} style={{ "--i": i++ } as CSSProperties}>
                  {w}
                </span>
              </span>
              {j < arr.length - 1 ? " " : null}
            </span>
          ))}
        </h1>
        <div className={styles.aside}>
          <p className={styles.lead}>{hero.lead}</p>
          <div className={styles.actions}>
            <ButtonLink href={hero.primary.href} tone="light" data-track="cta_book_demo_click">
              {hero.primary.label}
            </ButtonLink>
            <TextLink href={hero.secondary.href} className={styles.link}>
              {hero.secondary.label}
            </TextLink>
          </div>
        </div>
      </div>

      <div className={styles.reelWrap}>
        <div data-h="frame" className={styles.frame}>
          <LoopVideo
            src={hero.reel}
            eager
            label="PSQUARE COMPANY reel: scattered work brought into one system"
            className={styles.video}
          />
        </div>
      </div>
    </section>
  );
}
