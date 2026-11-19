"use client";

import { useCallback, useEffect, useRef, useState } from "react";
import { gsap, useGSAP, prefersReducedMotion } from "@/lib/motion";
import type { showreel as ShowreelContent } from "@/content/home/preview";
import { Showreel, reelBoxFrom, type ReelBox } from "./Showreel";
import styles from "./ReelReveal.module.css";

/** Wide screens with motion get the scroll growth; phones and reduced motion a still card. */
const GROW = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";
/** Phones get the lighter cut. */
const PHONE = "(max-width: 899px)";

/**
 * The showreel, right after the hero, as on the old homepage: a rounded 16:9
 * card that grows as it scrolls into view, from about four fifths of the
 * screen to almost all of it (one scale transform, scrubbed with scroll). It
 * loops silently and only while on screen; "Play with sound" in its corner
 * (or a click anywhere on it) opens the cut with music and voice in the
 * player. Phones and reduced motion get the card at its full size.
 */
export function ReelReveal({ reel }: { reel: typeof ShowreelContent }) {
  const root = useRef<HTMLElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const [box, setBox] = useState<ReelBox | null>(null);

  const open = useCallback(() => {
    if (!card.current) return;
    video.current?.pause();
    setBox(reelBoxFrom(card.current));
  }, []);
  const close = useCallback(() => {
    setBox(null);
    if (!prefersReducedMotion()) video.current?.play().catch(() => {});
  }, []);

  // Play only while the reel is on screen (and never under reduced motion).
  useEffect(() => {
    const v = video.current;
    if (!v || prefersReducedMotion()) return;
    const io = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting && !document.hidden) v.play().catch(() => {});
        else v.pause();
      },
      { threshold: 0.15 },
    );
    io.observe(v);
    return () => io.disconnect();
  }, []);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(GROW, () => {
        const el = card.current!;
        // The card is laid out at its full size; it starts scaled down to
        // about 80% of the screen's width and grows into place.
        const start = () => Math.min(1, (window.innerWidth * 0.8) / el.offsetWidth);
        gsap.fromTo(
          el,
          { scale: start },
          {
            scale: 1,
            ease: "power3.inOut",
            scrollTrigger: {
              trigger: el,
              start: "top 92%",
              end: "center center",
              scrub: true,
              invalidateOnRefresh: true,
            },
          },
        );
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-screen-label="02 Showreel"
      data-noband=""
      data-nav-dark=""
      aria-label={reel.eyebrow}
      className={styles.root}
    >
      <div ref={card} className={styles.card}>
        <video
          ref={video}
          muted
          loop
          playsInline
          preload="metadata"
          poster={reel.video.poster}
          aria-label={reel.label}
          className={styles.video}
        >
          <source src={reel.video.phone.webm} type="video/webm" media={PHONE} />
          <source src={reel.video.phone.mp4} type="video/mp4" media={PHONE} />
          <source src={reel.video.webm} type="video/webm" />
          <source src={reel.video.mp4} type="video/mp4" />
        </video>

        {/* The whole card opens the player; the corner button is its visible, focusable handle. */}
        <div aria-hidden="true" className={styles.hit} onClick={open} />
        <div aria-hidden="true" className={styles.shade} />

        <span className={styles.eyebrow}>
          {reel.eyebrow}
          <span className={styles.dur}>{reel.duration}</span>
        </span>
        <button type="button" onClick={open} className={styles.play}>
          <span aria-hidden="true" className={styles.icon} />
          {reel.play}
        </button>
      </div>

      {box && <Showreel box={box} src={reel.sound} poster={reel.video.poster} onClose={close} />}
    </section>
  );
}
