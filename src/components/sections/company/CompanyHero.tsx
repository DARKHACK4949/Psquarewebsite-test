"use client";

import Image from "next/image";
import { useRef } from "react";
import { TextLink } from "@/components/ui/Button";
import { aboutHero } from "@/content/about";
import { heroWall } from "@/content/company-preview";
import { gsap, useGSAP, FULL } from "@/lib/motion";
import { BlurWords, dissolveWords, resolveWords } from "./BlurText";
import styles from "./CompanyHero.module.css";

/**
 * The opening. A wall of real team photos drifts slowly behind the night.
 * "PSQUARE is not a company." resolves out of a blur on arrival; as the page
 * scrolls, those words melt away and "It’s a mindset." resolves in their
 * place, then the lead and the link settle in under it.
 */
export function CompanyHero() {
  const root = useRef<HTMLElement>(null);
  const [a, b] = aboutHero.title;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const el = root.current!;
        const lineA = el.querySelector<HTMLElement>("[data-h=a]")!;
        const lineB = el.querySelector<HTMLElement>("[data-h=b]")!;
        const after = el.querySelectorAll<HTMLElement>("[data-h=after]");
        const wall = el.querySelector<HTMLElement>("[data-h=wall]")!;
        const dim = el.querySelector<HTMLElement>("[data-h=dim]")!;

        // Arrival: the first line resolves on its own clock.
        const intro = gsap.timeline({ delay: 0.25 });
        gsap.set(lineA.querySelectorAll("[data-w=sharp]"), { opacity: 0 });
        intro.fromTo(wall, { opacity: 0, scale: 1.08 }, { opacity: 1, scale: 1, duration: 2.4, ease: "psq" }, 0);
        resolveWords(intro, lineA, 0.35, 0.11, 0.6);

        // Scroll: line one melts, line two resolves, the wall dims behind it.
        gsap.set(lineB.querySelectorAll("[data-w=sharp]"), { opacity: 0 });
        gsap.set(after, { opacity: 0, y: 24 });
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: el, start: "top top", end: "bottom bottom", scrub: 0.6 },
        });
        tl.to({}, { duration: 0.12 });
        const t1 = dissolveWords(tl, lineA, 0.12, 0.06, 0.2);
        const t2 = resolveWords(tl, lineB, t1 - 0.12, 0.08, 0.22);
        tl.to(dim, { opacity: 1, duration: t2 }, 0);
        tl.to(after, { opacity: 1, y: 0, duration: 0.3, stagger: 0.08, ease: "power2.out" }, t2 - 0.05);
        tl.to({}, { duration: 0.35 });
        return () => intro.kill();
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-screen-label="01 Company hero"
      data-noband=""
      data-nav-dark=""
      className={styles.section}
    >
      <div className={styles.stage}>
        <div aria-hidden="true" data-h="wall" className={styles.wall}>
          <div className={styles.tilt}>
          {heroWall.map((col, i) => (
            <div key={i} className={styles.col} data-dir={i % 2 ? "down" : "up"}>
              {/* Two copies of the column, so the drift loops without a seam. */}
              {[0, 1].map((copy) => (
                <div key={copy} className={styles.strip}>
                  {col.map((p) => (
                    <div key={p.src} className={styles.photo}>
                      <Image
                        src={p.src}
                        alt=""
                        fill
                        sizes="(min-width: 900px) 25vw, 50vw"
                        className={styles.img}
                        priority={copy === 0 && i < 2}
                      />
                    </div>
                  ))}
                </div>
              ))}
            </div>
          ))}
          </div>
        </div>
        <div aria-hidden="true" className={styles.scrim} />
        <div aria-hidden="true" data-h="dim" className={styles.dim} />

        <div className={styles.inner}>
          <h1 className={styles.title} aria-label={`${a} ${b}`}>
            <span data-h="a" className={styles.lineA}>
              <BlurWords text={a} />
            </span>
            <span data-h="b" className={styles.lineB}>
              <BlurWords text={b} />
            </span>
          </h1>
          <p data-h="after" className={styles.lead}>
            {aboutHero.lead}
          </p>
          <div data-h="after">
            <TextLink href={aboutHero.link.href} className={styles.link}>
              {aboutHero.link.label}
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
