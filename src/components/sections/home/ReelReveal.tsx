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
        // The section holds the reel on screen (CSS sticky) while the scroll
        // passes through it: the reel starts as a small card in the middle of
        // the dark and opens out to fill the screen edge to edge, the footage
        // inside settling a touch slower so the frame reads as a window opening.
        const el = card.current!;
        const film = video.current!;
        gsap
          .timeline({
            defaults: { ease: "power2.inOut" },
            scrollTrigger: {
              trigger: root.current,
              start: "top top",
              end: "bottom bottom",
              scrub: true,
            },
          })
          .fromTo(el, { scale: 0.46 }, { scale: 1, duration: 1 }, 0)
          .fromTo(film, { scale: 1.18 }, { scale: 1, duration: 1 }, 0)
          .to({}, { duration: 0.25 });
      });
      // Phones: a gentle rise and fade as the card comes into view.
      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
        gsap.fromTo(
          card.current,
          { y: 40, opacity: 0.4 },
          {
            y: 0,
            opacity: 1,
            ease: "power2.out",
            scrollTrigger: {
              trigger: card.current,
              start: "top bottom",
              end: "top 60%",
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
    <section
      ref={root}
      data-screen-label="02 Showreel"
      data-noband=""
      data-nav-dark=""
      aria-label={reel.eyebrow}
      className={styles.root}
    >
      <div className={styles.stick}>
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
          <button type="button" onClick={open} className={styles.play}>
            <span aria-hidden="true" className={styles.icon} />
            {reel.play}
          </button>
        </div>
      </div>

      {box && <Showreel box={box} src={reel.sound} poster={reel.video.poster} onClose={close} />}
    </section>
  );
}
