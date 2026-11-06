"use client";

import { useRef } from "react";
import { AccentLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import type { HomeContent } from "@/content/home";
import { gsap, useGSAP, FULL } from "@/lib/motion";
import styles from "./SelectedWorkDark.module.css";

/**
 * "Selected work": the page's second dark chapter. Each product gets a fold of
 * its own: a large film, then its name, sector and one line. It scrolls at the
 * page's own pace (no pinning), the same on every screen size. The page dims
 * into it and back out of it through a fixed night layer, as with the device
 * wall, and each film eases up to full size as it enters.
 */
export function SelectedWorkDark({ work }: { work: HomeContent["work"] }) {
  const root = useRef<HTMLElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const el = root.current!;
        const night = el.querySelector<HTMLElement>("[data-w=night]")!;
        // The page dims as the section arrives and brightens as it leaves.
        gsap.fromTo(
          night,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "sine.inOut",
            immediateRender: false,
            scrollTrigger: { trigger: el, start: "top 90%", end: "top 40%", scrub: true },
          },
        );
        gsap.fromTo(
          night,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "sine.inOut",
            immediateRender: false,
            scrollTrigger: { trigger: el, start: "bottom 70%", end: "bottom 20%", scrub: true },
          },
        );
        // Each film settles from slightly smaller as it scrolls into view.
        el.querySelectorAll<HTMLElement>("[data-w=media]").forEach((m) => {
          gsap.fromTo(
            m,
            { scale: 0.92 },
            {
              scale: 1,
              ease: "none",
              scrollTrigger: { trigger: m, start: "top bottom", end: "top 35%", scrub: true },
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
      id="work"
      data-screen-label="04 Selected work"
      data-noband=""
      className={styles.section}
    >
      {/* Fixed night layer: this section's dark chapter. */}
      <div data-w="night" aria-hidden="true" className={styles.night} />
      {/* Spans the dark part so the nav switches to light ink over it. */}
      <div data-nav-dark="" aria-hidden="true" className={styles.navDark} />

      <div className={styles.inner}>
        <header className={styles.head}>
          <h2 className={styles.h2} data-split="" aria-label={work.title}>
            <Words text={work.title} />
          </h2>
          <p className={styles.lead} data-reveal="">
            {work.lead}
          </p>
        </header>

        <div className={styles.list}>
          {work.items.map((it) => (
            <article key={it.key} className={styles.item} aria-labelledby={`work-${it.key}`}>
              <a
                href={it.href}
                className={styles.mediaLink}
                tabIndex={-1}
                aria-hidden="true"
                style={{ background: it.bg }}
              >
                <div data-w="media" className={styles.media}>
                  <LoopVideo src={it.video} className={styles.video} />
                </div>
              </a>
              <div className={styles.caption} data-reveal="">
                <h3 id={`work-${it.key}`} className={styles.name}>
                  {it.name}
                </h3>
                <div className={styles.meta}>
                  <span className={styles.sector}>{it.sector}</span>
                  <p className={styles.copy}>{it.copy}</p>
                  <AccentLink href={it.href} size="sm" className={styles.link}>
                    Explore {it.name}
                  </AccentLink>
                </div>
              </div>
            </article>
          ))}
        </div>

        <div className={styles.foot}>
          <AccentLink href={work.all.href} className={styles.link}>
            {work.all.label}
          </AccentLink>
        </div>
      </div>
    </section>
  );
}
