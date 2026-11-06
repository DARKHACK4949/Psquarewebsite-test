"use client";

import { useRef } from "react";
import type { HomeContent } from "@/content/home";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import { gsap, ScrollTrigger, useGSAP, FULL } from "@/lib/motion";
import styles from "./DeviceWall.module.css";

const RATIO = {
  portrait: styles.rPortrait,
  "43": styles.r43,
  "45": styles.r45,
  "916": styles.r916,
};

/**
 * Device wall: a full-bleed bento of product clips that scrolls at the page's
 * own pace (no pinning), under a headline held in place with CSS sticky.
 * Scroll only drives fades: the page goes dark as the wall arrives, the
 * headline resolves word by word as it settles mid-screen, and a
 * light fog block after the tiles rises with the scroll and returns the page
 * to light for the next section (or, with exit="dark", a dark fade dissolves
 * the wall into the dark section that follows).
 *
 * Only opacity animates: the dark page is a fixed night layer, and each word's
 * blur is a pre-blurred copy cross-fading with the sharp one.
 */
export function DeviceWall({
  wall,
  exit = "light",
}: {
  wall: HomeContent["wall"];
  /**
   * How the wall ends. "light": a light fog returns the page to light.
   * "dark": the tiles dissolve into the dark and hand it to a dark section
   * that follows (the dark-chapter preview).
   */
  exit?: "light" | "dark";
}) {
  const root = useRef<HTMLElement>(null);
  const words = wall.title.split(" ");
  const accentFrom = words.length - wall.accent;

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      mm.add(FULL, () => {
        const el = root.current!;
        const q = <T extends Element = HTMLElement>(s: string) =>
          Array.from(el.querySelectorAll<T & HTMLElement>(s));
        const stage = el.querySelector<HTMLElement>("[data-w=stage]")!;
        const night = el.querySelector<HTMLElement>("[data-w=night]")!;
        const veil = el.querySelector<HTMLElement>("[data-w=veil]")!;
        const fog = el.querySelector<HTMLElement>("[data-w=fog]")!;
        const bento = el.querySelector<HTMLElement>("[data-w=bento]")!;
        const cols = q("[data-w=col]");
        const sharp = q("[data-w=sharp]");
        const soft = q("[data-w=soft]");

        // 1) As the wall arrives, the page goes dark and the columns fade in.
        gsap
          .timeline({
            scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: true },
          })
          .fromTo(night, { opacity: 0 }, { opacity: 1, ease: "sine.inOut", duration: 1 }, 0)
          .fromTo(
            cols,
            { opacity: 0 },
            { opacity: 1, ease: "power2.out", duration: 0.6, stagger: 0.2 },
            0.1,
          );

        // 2) The headline resolves word by word as it rises into the middle of the
        //    screen and settles there (the stage top passing 25% to -30%), so the
        //    reveal plays where it can be seen.
        const reveal = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: stage, start: "top 25%", end: "top -30%", scrub: true },
        });
        reveal.fromTo(veil, { opacity: 0 }, { opacity: 1, duration: 0.5 }, 0);
        sharp.forEach((s, i) => {
          const at = i * 0.1;
          reveal
            .fromTo(soft[i], { opacity: 0 }, { opacity: 1, duration: 0.12 }, at)
            .to(soft[i], { opacity: 0, duration: 0.2 }, at + 0.12)
            .fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.2 }, at + 0.08);
        });

        // 3) The fog takes over: the headline blurs out, then the page turns light.
        const out = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: fog, start: "top 70%", end: "top 40%", scrub: true },
        });
        out.to(veil, { opacity: 0, duration: 1 }, 0);
        sharp.forEach((s, i) => {
          const at = i * 0.05;
          out
            .to(soft[i], { opacity: 0.9, duration: 0.15 }, at)
            .to(s, { opacity: 0, duration: 0.2 }, at)
            .to(soft[i], { opacity: 0, duration: 0.3 }, at + 0.15);
        });
        if (exit === "dark") {
          // The tiles above the fade dissolve (on the bento, so it never fights the
          // columns' fade-in) and the page stays dark.
          gsap.fromTo(
            bento,
            { opacity: 0.8 },
            {
              opacity: 0,
              ease: "sine.inOut",
              immediateRender: false,
              scrollTrigger: { trigger: fog, start: "top 50%", end: "top 0%", scrub: true },
            },
          );
          // Hand the dark to the next section: its own night layer is fully on by
          // the time this one fades, so the page never brightens in between.
          gsap.fromTo(
            night,
            { opacity: 1 },
            {
              opacity: 0,
              ease: "none",
              immediateRender: false,
              scrollTrigger: { trigger: el, start: "bottom 30%", end: "bottom top", scrub: true },
            },
          );
        } else {
          // The page turns light, and the tiles still above the fog fade a little ahead
          // of the dark (on the bento, so it never fights the columns' fade-in).
          gsap
            .timeline({
              scrollTrigger: { trigger: fog, start: "top 65%", end: "top 20%", scrub: true },
            })
            .fromTo(
              night,
              { opacity: 1 },
              { opacity: 0, ease: "sine.inOut", immediateRender: false, duration: 1 },
              0,
            )
            .fromTo(
              bento,
              { opacity: 0.8 },
              { opacity: 0, ease: "sine.inOut", immediateRender: false, duration: 0.7 },
              0,
            );
        }

        // Once the fog covers the wall, stop decoding its clips.
        const videos = q<HTMLVideoElement>("video");
        ScrollTrigger.create({
          trigger: fog,
          start: "top 20%",
          onEnter: () => videos.forEach((v) => v.pause()),
          onLeaveBack: () => videos.forEach((v) => v.play().catch(() => {})),
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [exit] },
  );

  return (
    <section
      ref={root}
      data-screen-label="01b Device wall"
      data-noband=""
      aria-label={wall.title}
      className={exit === "dark" ? `${styles.wall} ${styles.dark}` : styles.wall}
    >
      {/* Fixed night layer: the page's dark phase. */}
      <div data-w="night" aria-hidden="true" className={styles.night} />
      {/* Spans the dark phase so the nav switches to light ink over it. */}
      <div data-nav-dark="" aria-hidden="true" className={styles.navDark} />

      {/* The stage bounds the sticky headline, so it leaves with the last tiles. */}
      <div data-w="stage" className={styles.stage}>
        {/* Held mid-screen by CSS sticky while the tiles scroll past beneath it. */}
        <div className={styles.stick}>
          <div data-w="veil" aria-hidden="true" className={styles.veil} />
          <div className={styles.head}>
            <h2 className={styles.h2} aria-label={wall.title}>
              {words.map((w, i) => (
                <span key={i} aria-hidden="true">
                  <span
                    className={i >= accentFrom ? `${styles.word} ${styles.accent}` : styles.word}
                  >
                    <span data-w="sharp" className={styles.sharp}>
                      {w}
                    </span>
                    <span data-w="soft" className={styles.soft}>
                      {w}
                    </span>
                  </span>
                  {i < words.length - 1 ? " " : null}
                </span>
              ))}
            </h2>
          </div>
        </div>

        <div data-w="bento" aria-hidden="true" className={styles.bento}>
          {wall.tiles.map((col, c) => (
            <div key={c} data-w="col" className={`${styles.col} ${styles[`col${c + 1}`]}`}>
              {col.map((tile, i) => (
                <div
                  key={i}
                  data-w={tile.hero ? "hero" : undefined}
                  className={`${styles.tile} ${RATIO[tile.ratio]} ${tile.cover ? styles.cover : ""}`}
                >
                  <LoopVideo src={tile.src} />
                </div>
              ))}
            </div>
          ))}
        </div>
      </div>

      {/* The fog: a gradient block after the tiles that rises with the scroll. */}
      <div data-w="fog" aria-hidden="true" className={exit === "dark" ? styles.fade : styles.fog}>
        {exit === "light" && (
          <>
            <div className={styles.fogA} />
            <div className={styles.fogB} />
            <div className={styles.fogC} />
          </>
        )}
      </div>
    </section>
  );
}
