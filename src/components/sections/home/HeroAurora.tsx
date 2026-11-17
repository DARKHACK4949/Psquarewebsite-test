"use client";

import { useEffect, useRef, type CSSProperties } from "react";
import type { HomeContent } from "@/content/home";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./HeroAurora.module.css";

/**
 * Dark hero over a living plum aurora: three soft bands drift on their own
 * (CSS), and the whole field leans toward the pointer with an eased follow
 * (transform only, outside React state). Headline bottom-left, line and
 * actions bottom-right. The headline rises word by word on load.
 */
export function HeroAurora({ hero, lead }: { hero: HomeContent["hero"]; lead: string }) {
  const field = useRef<HTMLDivElement>(null);
  const { scrollTo } = useSmoothScroll();
  const title = hero.lines.join(" ");
  let i = 0;

  useEffect(() => {
    const el = field.current;
    if (!el || prefersReducedMotion()) return;
    if (!window.matchMedia("(hover: hover) and (pointer: fine)").matches) return;
    // Target and current offset, in px; eased toward the pointer each frame.
    const t = { x: 0, y: 0 };
    const c = { x: 0, y: 0 };
    let raf = 0;
    const tick = () => {
      c.x += (t.x - c.x) * 0.06;
      c.y += (t.y - c.y) * 0.06;
      el.style.transform = `translate3d(${c.x.toFixed(1)}px, ${c.y.toFixed(1)}px, 0)`;
      raf = Math.abs(t.x - c.x) + Math.abs(t.y - c.y) > 0.1 ? requestAnimationFrame(tick) : 0;
    };
    const onMove = (e: PointerEvent) => {
      t.x = (e.clientX / window.innerWidth - 0.5) * 120;
      t.y = (e.clientY / window.innerHeight - 0.5) * 80;
      if (!raf) raf = requestAnimationFrame(tick);
    };
    window.addEventListener("pointermove", onMove, { passive: true });
    return () => {
      window.removeEventListener("pointermove", onMove);
      cancelAnimationFrame(raf);
    };
  }, []);

  return (
    <section data-screen-label="01 Hero" data-noband="" data-nav-dark="" className={styles.hero}>
      <div aria-hidden="true" className={styles.aurora}>
        <div ref={field} className={styles.field}>
          <div className={styles.bandA} />
          <div className={styles.bandB} />
          <div className={styles.bandC} />
        </div>
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
