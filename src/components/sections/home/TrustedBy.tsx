"use client";

import Image from "next/image";
import { useRef } from "react";
import { AccentLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import { trusted } from "@/content/home";
import { gsap, ScrollTrigger, useGSAP, FULL } from "@/lib/motion";
import styles from "./TrustedBy.module.css";

function LogoSet({ hidden }: { hidden?: boolean }) {
  return (
    <div className={styles.set} aria-hidden={hidden || undefined}>
      {trusted.logos.map((l) => (
        <div key={l.src} className={styles.cell}>
          <Image
            src={l.src}
            alt={hidden ? "" : l.alt}
            width={l.w}
            height={l.h}
            sizes="160px"
            className={styles.logo}
            style={{ height: l.size }}
          />
        </div>
      ))}
    </div>
  );
}

/** Client logo marquee: a GSAP loop over a duplicated track; eases to a stop on hover. */
export function TrustedBy() {
  const stage = useRef<HTMLDivElement>(null);
  const tween = useRef<gsap.core.Tween | null>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const track = stage.current!.querySelector("[data-co=track]");
        const t = gsap.to(track, { xPercent: -50, duration: 48, ease: "none", repeat: -1 });
        tween.current = t;
        ScrollTrigger.create({
          trigger: stage.current,
          start: "top bottom",
          end: "bottom top",
          onToggle: (s) => (s.isActive ? t.play() : t.pause()),
        });
        return () => {
          tween.current = null;
        };
      });
      return () => mm.revert();
    },
    { scope: stage },
  );

  const setSpeed = (timeScale: number) => {
    if (tween.current)
      gsap.to(tween.current, { timeScale, duration: 0.6, ease: "power2.out", overwrite: true });
  };

  return (
    <section id="company" data-screen-label="07 Trusted by" className={styles.section}>
      <div className={styles.head}>
        <div className={styles.titleWrap}>
          <span className={styles.eyebrow}>{trusted.eyebrowShort}</span>
          <h2 className={`${styles.h2} ${styles.long}`} data-split="" aria-label={trusted.title}>
            <Words text={trusted.title} />
          </h2>
          <h2
            className={`${styles.h2} ${styles.short}`}
            data-split=""
            aria-label={trusted.titleShort}
          >
            <Words text={trusted.titleShort} />
          </h2>
        </div>
        <AccentLink href={trusted.link.href}>{trusted.link.label}</AccentLink>
      </div>
      <div
        ref={stage}
        className={styles.stage}
        data-reveal=""
        // Hover pause is for mice only: touch "hover" would stop the marquee until the next tap.
        onPointerEnter={(e) => e.pointerType === "mouse" && setSpeed(0)}
        onPointerLeave={(e) => e.pointerType === "mouse" && setSpeed(1)}
      >
        <div data-co="track" className={styles.track}>
          <LogoSet />
          <LogoSet hidden />
        </div>
      </div>
    </section>
  );
}
