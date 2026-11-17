"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import type { HomeContent } from "@/content/home";
import { gsap, useGSAP, FULL } from "@/lib/motion";
import styles from "./WorkFolds.module.css";

/**
 * Selected work, one screen per project. "Built for real work." opens it on
 * night; then each project: number and name top-left, its line and link
 * bottom-left, its film filling the right. Behind the folds, one fixed colour
 * layer per project crossfades in as that project scrolls into view, so the
 * page takes on each product's colour (opacity only). The last layer fades
 * out as the section leaves, handing back to the light page.
 */
export function WorkFolds({
  work,
  intro,
  themes,
}: {
  work: HomeContent["work"];
  intro: string;
  themes: Record<string, string>;
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const el = root.current!;
        const layers = gsap.utils.toArray<HTMLElement>("[data-w=theme]", el);
        const folds = gsap.utils.toArray<HTMLElement>("[data-w=fold]", el);
        const set = el.querySelector<HTMLElement>("[data-w=themes]")!;
        const intro = el.querySelector<HTMLElement>("[data-w=intro]")!;
        // The set (with its night base) switches on while the solid night intro
        // covers the screen, so the change is never seen.
        gsap.fromTo(
          set,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: intro, start: "top 20%", end: "top top", scrub: true },
          },
        );
        folds.forEach((fold, i) => {
          gsap.fromTo(
            layers[i],
            { opacity: 0 },
            {
              opacity: 1,
              ease: "none",
              scrollTrigger: { trigger: fold, start: "top 75%", end: "top 25%", scrub: true },
            },
          );
        });
        // Hand back to the light page as the last project leaves.
        gsap.fromTo(
          set,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger: {
              trigger: folds[folds.length - 1],
              start: "bottom 70%",
              end: "bottom 20%",
              scrub: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <div ref={root} className={styles.root}>
      {/* Fixed colour layers, one per project, stacked in order. */}
      <div data-w="themes" aria-hidden="true" className={styles.themes}>
        <div className={styles.base} />
        {work.items.map((it) => (
          <div
            key={it.key}
            data-w="theme"
            className={styles.theme}
            style={{ background: themes[it.key] ?? "var(--night)" }}
          />
        ))}
      </div>

      <section
        data-w="intro"
        data-screen-label="03 Work intro"
        data-noband=""
        data-nav-dark=""
        className={styles.intro}
      >
        <h2 className={styles.introLine} data-split="" aria-label={intro}>
          <Words text={intro} />
        </h2>
      </section>

      <section
        id="work"
        data-screen-label="04 Selected work"
        data-noband=""
        data-nav-dark=""
        aria-label={work.title}
        className={styles.work}
      >
        {work.items.map((it, i) => (
          <article
            key={it.key}
            data-w="fold"
            className={styles.fold}
            aria-labelledby={`fold-${it.key}`}
          >
            <div className={styles.copy}>
              <div className={styles.top}>
                <span className={styles.n}>{String(i + 1).padStart(2, "0")}</span>
                <h3 id={`fold-${it.key}`} className={styles.name}>
                  {it.name}
                </h3>
              </div>
              <div className={styles.bottom}>
                <p className={styles.line}>{it.copy}</p>
                <ButtonLink href={it.href} tone="light" size="nav" arrow>
                  Explore
                </ButtonLink>
              </div>
            </div>
            <div className={styles.stage}>
              <LoopVideo src={it.video} className={styles.video} label={`${it.name} in use`} />
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
