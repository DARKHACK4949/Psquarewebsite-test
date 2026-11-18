"use client";

import type { CSSProperties } from "react";
import type { HomeContent } from "@/content/home";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { HeroRibbons } from "./HeroRibbons";
import styles from "./HeroAurora.module.css";

/**
 * Dark hero over a live plum field (WebGL ribbons or an aura fold that the pointer stirs; three
 * soft CSS bands stand in until it draws, or if WebGL is missing). Headline
 * bottom-left, line and actions bottom-right. The headline rises word by word
 * on load.
 */
export function HeroAurora({
  hero,
  lead,
  look = "ribbons",
}: {
  hero: HomeContent["hero"];
  lead: string;
  /** The background field: drifting ribbons, or one large aura fold. */
  look?: "ribbons" | "aura";
}) {
  const { scrollTo } = useSmoothScroll();
  const title = hero.lines.join(" ");
  let i = 0;

  return (
    <section data-screen-label="01 Hero" data-noband="" data-nav-dark="" className={styles.hero}>
      <div aria-hidden="true" className={styles.aurora}>
        <div className={styles.field}>
          <div className={styles.bandA} />
          <div className={styles.bandB} />
          <div className={styles.bandC} />
        </div>
        <HeroRibbons className={styles.ribbons} look={look} />
      </div>

      <div className={styles.inner}>
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
        <div className={styles.side}>
          <p className={styles.lead}>{lead}</p>
          <div className={styles.actions}>
            <ButtonLink href={hero.primary.href} tone="light" data-track="cta_book_demo_click">
              {hero.primary.label}
            </ButtonLink>
            <TextLink
              href={hero.secondary.href}
              className={styles.link}
              onClick={(e) => {
                e.preventDefault();
                scrollTo(hero.secondary.href);
              }}
            >
              {hero.secondary.label}
            </TextLink>
          </div>
        </div>
      </div>
    </section>
  );
}
