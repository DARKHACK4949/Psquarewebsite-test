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

/** Scroll per pixel the bento travels: 1 moves the tiles with the finger, like the rest of the page. */
const PACE = 1.15;

/**
 * Share of the track the scene takes. The next section overlaps the last
 * 42% of the scroll (48% on desktop) and arrives over the fog as the scene ends.
 * Keep in step with --scene in DeviceWall.module.css.
 */
const SCENE = 0.766;

/**
 * Device wall: a pinned, full-bleed bento of product clips that glides up as
 * one block while the page goes dark and the headline resolves word by word.
 * Light fog then rises and the next section scrolls in over it.
 * The track's length is fitted to the bento's travel (see PACE), so the
 * tiles move with the scroll at the same pace as the rest of the page.
 *
 * Only transform and opacity animate: the dark page is a fixed night layer
 * fading in and out, and each word's blur is a pre-blurred copy cross-fading
 * with the sharp one.
 */
export function DeviceWall({ wall }: { wall: HomeContent["wall"] }) {
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
        const track = el.querySelector<HTMLElement>("[data-w=track]")!;
        const pin = el.querySelector<HTMLElement>("[data-w=pin]")!;
        const bento = el.querySelector<HTMLElement>("[data-w=bento]")!;
        const hero = el.querySelector<HTMLElement>("[data-w=hero]")!;
        const night = el.querySelector<HTMLElement>("[data-w=night]")!;
        const veil = el.querySelector<HTMLElement>("[data-w=veil]")!;
        const fog = el.querySelector<HTMLElement>("[data-w=fog]")!;
        const cols = q("[data-w=col]");
        const word = q("[data-w=word]");
        const vh = () => pin.clientHeight;

        // 1) The page goes dark as the section arrives.
        gsap.fromTo(
          night,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "sine.inOut",
            immediateRender: false,
            scrollTrigger: { trigger: el, start: "top 95%", end: "top 35%", scrub: true },
          },
        );

        // The bento rises as one block at a constant speed, timed so the hero tile is centred at .44.
        const T_CENTER = 0.44;
        const T_END = 0.82;
        const y0 = () => vh() * 0.55;
        const midY = () => {
          const b = bento.getBoundingClientRect();
          const h = hero.getBoundingClientRect();
          return vh() / 2 - (h.top - b.top + h.height / 2);
        };
        // Fit the track to the bento's travel, so the tiles keep pace with the scroll.
        const fit = () => {
          const travel = Math.abs(midY() - y0()) * (T_END / T_CENTER);
          const scroll = (travel * PACE) / (T_END * SCENE);
          el.style.setProperty("--track", `${Math.round(scroll + vh())}px`);
        };
        fit();
        ScrollTrigger.addEventListener("refreshInit", fit);

        let hidden = false;
        const videos = q<HTMLVideoElement>("video");

        // 2) The pinned scene, progress 0 → 1 across the track.
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: {
            trigger: track,
            start: "top top",
            end: "bottom bottom",
            scrub: true,
            invalidateOnRefresh: true,
            // Once the fog covers the wall, stop decoding its clips.
            onUpdate: (st) => {
              const covered = st.progress > SCENE * 0.88;
              if (covered === hidden) return;
              hidden = covered;
              videos.forEach((v) => (covered ? v.pause() : v.play().catch(() => {})));
            },
          },
        });

        tl.fromTo(
          bento,
          { y: y0 },
          { y: () => y0() + (midY() - y0()) * (T_END / T_CENTER), duration: T_END },
          0,
        );

        // Columns fade in one after another, resting at 80% so the headline reads.
        tl.set(bento, { opacity: 0.8 }, 0);
        tl.fromTo(
          cols,
          { opacity: 0 },
          { opacity: 1, ease: "power2.out", duration: 0.16, stagger: 0.03 },
          0.02,
        );

        // Soft dark glow behind the headline.
        tl.fromTo(veil, { opacity: 0 }, { opacity: 1, ease: "power2.out", duration: 0.16 }, 0.02);
        tl.to(veil, { opacity: 0, ease: "power1.in", duration: 0.1 }, 0.72);

        // Headline: each word drifts in out of a blur, then blurs out.
        const d = 0.1;
        const step = (0.3 - d) / Math.max(1, word.length - 1);
        word.forEach((w, i) => {
          const sharp = w.querySelector("[data-w=sharp]");
          const soft = w.querySelector("[data-w=soft]");
          const tIn = 0.22 + i * step;
          const tOut = 0.7 + i * 0.012;
          tl.fromTo(w, { x: -22, y: 22 }, { x: 0, y: 0, ease: "power2.out", duration: d }, tIn);
          tl.fromTo(
            soft,
            { opacity: 0 },
            { opacity: 1, ease: "power2.out", duration: d * 0.4 },
            tIn,
          );
          tl.to(soft, { opacity: 0, ease: "power1.in", duration: d * 0.6 }, tIn + d * 0.4);
          tl.fromTo(
            sharp,
            { opacity: 0 },
            { opacity: 1, ease: "power2.out", duration: d * 0.7 },
            tIn + d * 0.3,
          );
          tl.to(w, { x: 22, y: -22, ease: "power2.in", duration: 0.08 }, tOut);
          tl.to(sharp, { opacity: 0, ease: "power2.in", duration: 0.05 }, tOut);
          tl.to(soft, { opacity: 0.9, ease: "power1.out", duration: 0.03 }, tOut);
          tl.to(soft, { opacity: 0, ease: "power1.in", duration: 0.05 }, tOut + 0.03);
        });

        // Fog rises, the grid fades, the page returns to light.
        tl.fromTo(
          fog,
          { y: () => vh() },
          { y: () => -vh() * 0.92, ease: "power1.inOut", duration: 0.36 },
          0.64,
        );
        tl.to(bento, { opacity: 0, ease: "power1.in", duration: 0.14 }, 0.74);
        tl.fromTo(
          night,
          { opacity: 1 },
          { opacity: 0, immediateRender: false, ease: "power1.inOut", duration: 0.14 },
          0.8,
        );

        // The scene above runs on a 0–1 clock; an empty tail squeezes it into the
        // first SCENE of the track, leaving the rest for the next section to
        // scroll in over the fog (see the margin in the CSS).
        tl.set({}, {}, 1 / SCENE);

        return () => {
          ScrollTrigger.removeEventListener("refreshInit", fit);
          el.style.removeProperty("--track");
        };
      });
      return () => mm.revert();
    },
    { scope: root },
  );

  return (
    <section
      ref={root}
      data-screen-label="01b Device wall"
      data-noband=""
      aria-label={wall.title}
      className={styles.wall}
    >
      {/* Fixed night layer: the page's dark phase. */}
      <div data-w="night" aria-hidden="true" className={styles.night} />
      {/* Spans the dark phase so the nav switches to light ink over it. */}
      <div data-nav-dark="" aria-hidden="true" className={styles.navDark} />
      <div data-w="track" className={styles.track}>
        <div data-w="pin" className={styles.pin}>
          <div aria-hidden="true" className={styles.stage}>
            <div data-w="bento" className={styles.bento}>
              {wall.tiles.map((col, c) => (
                <div key={c} data-w="col" className={`${styles.col} ${styles[`col${c + 1}`]}`}>
                  {col.map((tile) => (
                    <div
                      key={tile.src.webm}
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

          <div data-w="fog" aria-hidden="true" className={styles.fog}>
            <div className={styles.fogBase} />
            <div className={styles.fogA} />
            <div className={styles.fogB} />
            <div className={styles.fogC} />
          </div>

          <div data-w="veil" aria-hidden="true" className={styles.veil} />

          <div className={styles.head}>
            <h2 className={styles.h2} aria-label={wall.title}>
              {words.map((w, i) => (
                <span key={i} aria-hidden="true">
                  <span
                    data-w="word"
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
      </div>
    </section>
  );
}
