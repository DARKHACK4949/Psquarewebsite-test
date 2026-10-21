"use client";

import Image from "next/image";
import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { nextStep } from "@/content/home";
import { CONTACT_EMAIL } from "@/lib/site";
import styles from "./NextStep.module.css";

/** Closing call to action on the dark plum card; a soft glow follows the pointer. */
export function NextStep() {
  const glow = useRef<HTMLDivElement>(null);

  return (
    <section id="start" data-screen-label="09 Next step" className={styles.section}>
      <div
        className={styles.card}
        data-reveal=""
        onMouseMove={(e) => {
          const g = glow.current;
          if (!g) return;
          const r = e.currentTarget.getBoundingClientRect();
          g.style.transform = `translate(${e.clientX - r.left}px,${e.clientY - r.top}px)`;
          g.style.opacity = "1";
        }}
        onMouseLeave={() => {
          if (glow.current) glow.current.style.opacity = "0";
        }}
      >
        <div aria-hidden="true" className={styles.grid} />
        <div aria-hidden="true" className={styles.halo} />
        <div ref={glow} aria-hidden="true" className={styles.glow} />
        <Image
          src="/images/psquare-mark.svg"
          alt=""
          aria-hidden="true"
          width={620}
          height={620}
          className={styles.mark}
        />
        <div className={styles.left}>
          <span className={styles.eyebrow}>{nextStep.eyebrow}</span>
          <h2 className={styles.h2}>
            {nextStep.title[0]}
            <br />
            <span>{nextStep.title[1]}</span>
          </h2>
        </div>
        <div className={styles.right}>
          <p className={styles.lead}>{nextStep.lead}</p>
          <div className={styles.actions}>
            <ButtonLink href={nextStep.cta.href} tone="light" data-track="cta_book_demo_click">
              {nextStep.cta.label}
            </ButtonLink>
            <a href={`mailto:${CONTACT_EMAIL}`} className={styles.email}>
              {CONTACT_EMAIL}
            </a>
          </div>
        </div>
      </div>
    </section>
  );
}
