"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import { careersCta } from "@/content/about";
import { gsap, useGSAP, FULL } from "@/lib/motion";
import { BlurWords, resolveWords } from "./BlurText";
import styles from "./CareersClose.module.css";

/**
 * The close: the team film, deep in the night, behind the invitation. The
 * line resolves as the screen fills; one call to action.
 */
export function CareersClose({ href }: { href: string }) {
  const root = useRef<HTMLElement>(null);
  const title = careersCta.title.join(" ");

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const el = root.current!;
        const h = el.querySelector<HTMLElement>("[data-k=title]")!;
        const after = el.querySelectorAll("[data-k=after]");
        const film = el.querySelector("[data-k=film]");
        gsap.set(h.querySelectorAll("[data-w=sharp]"), { opacity: 0 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top 75%", end: "top 5%", scrub: 0.6 },
        });
        tl.fromTo(film, { scale: 1.12 }, { scale: 1, duration: 1 }, 0);
        const end = resolveWords(tl, h, 0.15, 0.07, 0.22);
        tl.fromTo(after, { opacity: 0, y: 20 }, { opacity: 1, y: 0, duration: 0.25, stagger: 0.06 }, end - 0.1);
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-screen-label="08 Careers"
      data-noband=""
      data-nav-dark=""
      className={styles.section}
    >
      <div aria-hidden="true" data-k="film" className={styles.film}>
        <LoopVideo src={careersCta.video} className={styles.video} />
      </div>
      <div aria-hidden="true" className={styles.scrim} />
      <div className={styles.inner}>
        <h2 data-k="title" className={styles.h2} aria-label={title}>
          <BlurWords text={title} />
        </h2>
        <p data-k="after" className={styles.lead}>
          {careersCta.lead}
        </p>
        <div data-k="after">
          <ButtonLink href={href} tone="light">
            {careersCta.cta}
          </ButtonLink>
        </div>
      </div>
    </section>
  );
}
