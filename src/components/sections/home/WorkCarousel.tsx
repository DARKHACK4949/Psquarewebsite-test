"use client";

import { useEffect, useRef, useState } from "react";
import { AccentLink } from "@/components/ui/Button";
import { Words } from "@/components/ui/Words";
import type { HomeContent } from "@/content/home";
import { prefersReducedMotion } from "@/lib/motion";
import styles from "./WorkCarousel.module.css";

/**
 * Phone layout of "Selected work": brand chips over a swipeable, snapping row
 * of project cards, sized to fit one screen. Chips and swipes stay in sync and
 * only the card in view plays its video.
 */
export function WorkCarousel({ work }: { work: HomeContent["work"] }) {
  const [active, setActive] = useState(0);
  const track = useRef<HTMLDivElement>(null);
  const chips = useRef<(HTMLButtonElement | null)[]>([]);
  const inView = useRef(false);

  const cards = () => Array.from(track.current?.children ?? []) as HTMLElement[];

  const syncVideos = (i: number) => {
    cards().forEach((card, j) => {
      const v = card.querySelector("video");
      if (!v) return;
      if (Math.abs(j - i) <= 1 && v.preload !== "auto") v.preload = "auto";
      const on = inView.current && j === i && !prefersReducedMotion();
      if (on && v.paused) v.play().catch(() => {});
      else if (!on && !v.paused) v.pause();
    });
  };

  // Swiping: the card closest to the start edge is active.
  const count = work.items.length;
  useEffect(() => {
    const t = track.current!;
    let raf = 0;
    const onScroll = () => {
      cancelAnimationFrame(raf);
      raf = requestAnimationFrame(() => {
        const w = t.firstElementChild?.getBoundingClientRect().width ?? t.clientWidth;
        const gap = parseFloat(getComputedStyle(t).columnGap) || 0;
        const i = Math.max(0, Math.min(count - 1, Math.round(t.scrollLeft / (w + gap))));
        setActive((cur) => (cur === i ? cur : i));
      });
    };
    t.addEventListener("scroll", onScroll, { passive: true });
    return () => {
      t.removeEventListener("scroll", onScroll);
      cancelAnimationFrame(raf);
    };
  }, [count]);

  // Only play while the carousel is on screen.
  useEffect(() => {
    const io = new IntersectionObserver(
      ([e]) => {
        inView.current = e.isIntersecting;
        syncVideos(active);
      },
      { threshold: 0.35 },
    );
    io.observe(track.current!);
    return () => io.disconnect();
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, []);

  // Follow the active card: play its video, keep its chip visible.
  useEffect(() => {
    syncVideos(active);
    const chip = chips.current[active];
    const row = chip?.parentElement;
    if (chip && row) {
      const left = chip.offsetLeft - (row.clientWidth - chip.offsetWidth) / 2;
      row.scrollTo({ left, behavior: prefersReducedMotion() ? "auto" : "smooth" });
    }
    // eslint-disable-next-line react-hooks/exhaustive-deps
  }, [active]);

  const goTo = (i: number) => {
    const card = cards()[i];
    if (!card || !track.current) return;
    track.current.scrollTo({
      left:
        card.offsetLeft -
        track.current.offsetLeft -
        parseFloat(getComputedStyle(track.current).paddingLeft),
      behavior: prefersReducedMotion() ? "auto" : "smooth",
    });
    setActive(i);
  };

  const onKey = (e: React.KeyboardEvent) => {
    const d = e.key === "ArrowRight" ? 1 : e.key === "ArrowLeft" ? -1 : 0;
    if (!d) return;
    e.preventDefault();
    const n = (active + d + work.items.length) % work.items.length;
    goTo(n);
    chips.current[n]?.focus();
  };

  return (
    <div className={styles.root}>
      <div className={styles.head}>
        <h2 className={styles.h2} data-split="" aria-label={work.title}>
          <Words text={work.title} />
        </h2>
      </div>

      <div role="tablist" aria-label="Projects" className={styles.chips} onKeyDown={onKey}>
        {work.items.map((it, i) => (
          <button
            key={it.key}
            ref={(el) => {
              chips.current[i] = el;
            }}
            type="button"
            role="tab"
            id={`work-chip-${it.key}`}
            aria-selected={active === i}
            aria-controls={`work-card-${it.key}`}
            tabIndex={active === i ? 0 : -1}
            onClick={() => goTo(i)}
            className={styles.chip}
          >
            {it.name}
          </button>
        ))}
      </div>

      <div ref={track} className={styles.track}>
        {work.items.map((it, i) => (
          <article
            key={it.key}
            id={`work-card-${it.key}`}
            role="tabpanel"
            aria-labelledby={`work-chip-${it.key}`}
            aria-roledescription="slide"
            aria-label={`${i + 1} of ${work.items.length}: ${it.name}`}
            className={styles.card}
          >
            <div className={styles.media} style={{ background: it.bg }}>
              <video
                muted
                loop
                playsInline
                preload="none"
                poster={it.video.poster}
                aria-hidden="true"
                className={styles.video}
              >
                <source src={it.video.webm} type="video/webm" />
                <source src={it.video.mp4} type="video/mp4" />
              </video>
              <span className={styles.tag}>{it.sector}</span>
            </div>
            <div className={styles.body}>
              <h3 className={styles.h3}>
                {it.title[0]} {it.title[1]} <span className={styles.accent}>{it.title[2]}</span>
              </h3>
              <p className={styles.text}>{it.copy}</p>
              <AccentLink href={it.href} size="sm">
                Explore {it.name}
              </AccentLink>
            </div>
          </article>
        ))}
      </div>

      <div className={styles.foot}>
        <div className={styles.dots} aria-hidden="true">
          {work.items.map((it, i) => (
            <span key={it.key} data-on={active === i || undefined} />
          ))}
        </div>
        <AccentLink href={work.all.href}>{work.all.label}</AccentLink>
      </div>
    </div>
  );
}
