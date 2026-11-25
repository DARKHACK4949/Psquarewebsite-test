"use client";

import type { CSSProperties } from "react";
import type { HomeContent } from "@/content/home";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { HeroRibbons } from "./HeroRibbons";
import { HeroFilm } from "./HeroFilm";
import type { VideoSrc } from "@/content/about";

type Film = VideoSrc & { phone?: { webm: string; mp4: string } };
import styles from "./HeroAurora.module.css";

/**
 * Dark hero over a live background (WebGL ribbons, or the aura film, that the pointer stirs; three
 * soft CSS bands stand in until it draws, or if WebGL is missing). Headline
 * bottom-left, line and actions bottom-right. The headline resolves from blur
 * word by word on load.
 */
export function HeroAurora({
  hero,
  lead,
  look = "ribbons",
  film,
}: {
  hero: HomeContent["hero"];
  lead: string;
  /** The background: drifting plum ribbons (a shader), or a film. */
  look?: "ribbons" | "film";
  /** The film, when look is "film". */
  film?: Film;
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
        {look === "film" && film ? (
          <HeroFilm
            film={film}
            videoClassName={styles.filmVideo}
            canvasClassName={styles.ribbons}
          />
        ) : (
          <HeroRibbons className={styles.ribbons} />
        )}
      </div>

      <div className={styles.inner}>
        <h1 className={styles.h1} aria-label={title}>
          {title.split(" ").map((w, j, arr) => (
            // The space sits outside the word box: inside an inline-block it collapses.
            // Each word is a sharp copy over a pre-blurred one; they cross-fade, so the
            // word resolves from blur while only opacity animates.
            <span key={j} aria-hidden="true">
              <span className={styles.word} style={{ "--i": i++ } as CSSProperties}>
                <span className={styles.sharp}>{w}</span>
                <span className={styles.soft}>{w}</span>
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
