"use client";

import Image from "next/image";
import { useRef } from "react";
import { journey } from "@/content/about";
import { journeyPhotos } from "@/content/company-preview";
import { gsap, useGSAP } from "@/lib/motion";
import styles from "./JourneyPan.module.css";

/** Wide screens with motion: the years pan sideways while the screen is pinned. */
const PAN = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

/**
 * The journey, 2022 to 2026. On wide screens the chapter pins and the years
 * travel sideways with the scroll: each year a huge numeral, a photo from
 * that time and a short line. A rule along the bottom fills as you go.
 * Phones and reduced motion read it as a simple vertical list.
 */
export function JourneyPan() {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(PAN, () => {
        const el = root.current!;
        const track = el.querySelector<HTMLElement>("[data-j=track]")!;
        const fill = el.querySelector<HTMLElement>("[data-j=fill]")!;
        const distance = () => track.scrollWidth - window.innerWidth;

        const pan = gsap.to(track, {
          x: () => -distance(),
          ease: "none",
          scrollTrigger: {
            trigger: el,
            start: "top top",
            end: () => `+=${distance()}`,
            pin: true,
            scrub: 0.8,
            invalidateOnRefresh: true,
          },
        });
        gsap.fromTo(
          fill,
          { scaleX: 0 },
          {
            scaleX: 1,
            ease: "none",
            scrollTrigger: {
              trigger: el,
              start: "top top",
              end: () => `+=${distance()}`,
              scrub: 0.8,
              invalidateOnRefresh: true,
            },
          },
        );

        // Inside each frame the photo drifts against the pan, so it reads as a window.
        gsap.utils.toArray<HTMLElement>("[data-j=img]", el).forEach((img) => {
          gsap.fromTo(
            img,
            { xPercent: -8 },
            {
              xPercent: 8,
              ease: "none",
              scrollTrigger: {
                trigger: img.parentElement!,
                containerAnimation: pan,
                start: "left right",
                end: "right left",
                scrub: true,
              },
            },
          );
        });
        // Each year's numeral and words settle in as its panel arrives.
        gsap.utils.toArray<HTMLElement>("[data-j=year]", el).forEach((y) => {
          const parts = y.querySelectorAll("[data-j=rise]");
          gsap.fromTo(
            parts,
            { opacity: 0, y: 32 },
            {
              opacity: 1,
              y: 0,
              stagger: 0.06,
              ease: "power2.out",
              scrollTrigger: {
                trigger: y,
                containerAnimation: pan,
                start: "left 85%",
                end: "left 45%",
                scrub: true,
              },
            },
          );
        });
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-screen-label="03 Journey"
      data-noband=""
      data-nav-dark=""
      className={styles.section}
    >
      <div className={styles.viewport}>
        <ol data-j="track" className={styles.track}>
          <li className={styles.intro}>
            <h2 className={styles.h2}>
              {journey.title.map((t) => (
                <span key={t} className={styles.line}>
                  {t}
                </span>
              ))}
            </h2>
            <p className={styles.lead}>{journey.lead}</p>
          </li>
          {journey.milestones.map((m, i) => {
            const photo = journeyPhotos[i];
            return (
              <li key={m.year} data-j="year" className={styles.year}>
                <p data-j="rise" aria-hidden="true" className={styles.numeral}>
                  {m.year}
                </p>
                <div className={styles.frame}>
                  <div data-j="img" className={styles.imgWrap}>
                    <Image
                      src={photo.src}
                      alt={photo.alt}
                      fill
                      sizes="(min-width: 900px) 40vw, 100vw"
                      className={styles.img}
                      style={{ objectPosition: photo.pos }}
                    />
                  </div>
                </div>
                <div className={styles.text}>
                  <h3 data-j="rise" className={styles.h3}>
                    <span className={styles.sr}>{m.year}: </span>
                    {m.title}
                  </h3>
                  <p data-j="rise" className={styles.copy}>
                    {m.copy}
                  </p>
                </div>
              </li>
            );
          })}
        </ol>
        <div aria-hidden="true" className={styles.rule}>
          <span data-j="fill" className={styles.fill} />
        </div>
      </div>
    </section>
  );
}
