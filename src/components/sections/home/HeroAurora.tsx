"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { HomeContent } from "@/content/home";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import type { VideoSrc } from "@/content/about";
import { prefersReducedMotion } from "@/lib/motion";
import { HeroRibbons } from "./HeroRibbons";
import styles from "./HeroAurora.module.css";

type Film = VideoSrc & { phone?: { webm: string; mp4: string } };

/**
 * Dark hero over a moving background: a looping film when one is given (it
 * drifts a little toward the pointer, transform only), otherwise flowing plum
 * ribbons (a WebGL field the pointer stirs). Three soft CSS bands stand in
 * until either shows. Headline bottom-left, line and actions bottom-right.
 * The headline rises word by word on load.
 */
export function HeroAurora({
  hero,
  lead,
  film,
}: {
  hero: HomeContent["hero"];
  lead: string;
  film?: Film;
}) {
  const drift = useRef<HTMLDivElement>(null);

  // The film leans gently toward the pointer, eased (fine pointers, motion on).
  useEffect(() => {
    const el = drift.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    const t = { x: 0, y: 0 };
    const c = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      c.x += (t.x - c.x) * 0.04;
      c.y += (t.y - c.y) * 0.04;
      el.style.transform = `translate3d(${c.x.toFixed(2)}%, ${c.y.toFixed(2)}%, 0) scale(1.06)`;
      raf = Math.abs(t.x - c.x) + Math.abs(t.y - c.y) > 0.005 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      t.x = (e.clientX / window.innerWidth - 0.5) * -2;
      t.y = (e.clientY / window.innerHeight - 0.5) * -1.5;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, [film]);

  const { scrollTo } = useSmoothScroll();
  const title = hero.lines.join(" ");
  let i = 0;

  return (
    <section data-screen-label="01 Hero" data-noband="" data-nav-dark="" className={styles.hero}>
      <div aria-hidden="true" className={styles.aurora}>
        {/* Stand-in bands until the ribbons draw (not needed under a film). */}
        {!film && (
          <div className={styles.field}>
            <div className={styles.bandA} />
            <div className={styles.bandB} />
            <div className={styles.bandC} />
          </div>
        )}
        {film ? (
          <div ref={drift} className={styles.drift}>
            <LoopVideo
              src={film}
              eager
              phoneQuery="(max-width: 899px) and (orientation: portrait)"
              className={styles.film}
            />
          </div>
        ) : (
          <HeroRibbons className={styles.ribbons} />
        )}
        {film && <div className={styles.shade} />}
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
