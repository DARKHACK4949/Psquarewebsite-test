"use client";

import Image from "next/image";
import { useRef } from "react";
import { team } from "@/content/about";
import { companyPreview } from "@/content/company-preview";
import { gsap, useGSAP, FULL } from "@/lib/motion";
import styles from "./Leaders.module.css";

/**
 * The people who lead the work: one exact grid. Manisha's note on culture
 * takes a large tile; the eight leads fill the rest, in quiet monochrome
 * that warms to colour when you point at them.
 */
export function Leaders() {
  const root = useRef<HTMLElement>(null);
  const c = team.culture;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const tiles = gsap.utils.toArray<HTMLElement>("[data-l=tile]", root.current!);
        gsap.fromTo(
          tiles,
          { opacity: 0, y: 40 },
          {
            opacity: 1,
            y: 0,
            duration: 1.1,
            ease: "psq",
            stagger: { each: 0.06, grid: "auto", from: "start" },
            scrollTrigger: { trigger: root.current!.querySelector("[data-l=grid]"), start: "top 80%", once: true },
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
      data-screen-label="06 Leaders"
      data-noband=""
      data-nav-dark=""
      className={styles.section}
    >
      <div className={styles.inner}>
        <div className={styles.head}>
          <h2 className={styles.h2}>
            {companyPreview.leaders.title.map((t) => (
              <span key={t} className={styles.line}>
                {t}
              </span>
            ))}
          </h2>
          <p className={styles.lead}>{team.lead}</p>
        </div>

        <ul data-l="grid" className={styles.grid}>
          <li data-l="tile" className={`${styles.tile} ${styles.feature}`}>
            <figure className={styles.featureFig}>
              <Image
                src={c.photo}
                alt={`${c.name}, ${c.role}`}
                fill
                sizes="(min-width: 900px) 50vw, 100vw"
                className={styles.featureImg}
              />
              <figcaption className={styles.note}>
                <blockquote className={styles.noteQuote}>
                  <p>“{c.quote}”</p>
                </blockquote>
                <span className={styles.name}>{c.name}</span>
                <span className={styles.role}>{c.role}</span>
              </figcaption>
            </figure>
          </li>
          {team.leads.people.map((p) => (
            <li key={p.name} data-l="tile" className={styles.tile}>
              <div className={styles.photo}>
                <Image src={p.photo} alt="" fill sizes="(min-width: 900px) 25vw, 50vw" className={styles.mono} />
                <Image src={p.photo} alt="" fill sizes="(min-width: 900px) 25vw, 50vw" className={styles.colour} />
              </div>
              <span className={styles.name}>{p.name}</span>
              <span className={styles.role}>{p.role}</span>
            </li>
          ))}
        </ul>
      </div>
    </section>
  );
}
