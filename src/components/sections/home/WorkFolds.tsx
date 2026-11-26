"use client";

import { useRef } from "react";
import { ButtonLink } from "@/components/ui/Button";
import { LoopVideo } from "@/components/sections/about/LoopVideo";
import type { HomeContent } from "@/content/home";
import { gsap, ScrollTrigger, useGSAP, FULL } from "@/lib/motion";
import styles from "./WorkFolds.module.css";

/** Wide screens with motion: each project fills the screen behind its copy. */
const IMMERSIVE = "(min-width: 900px) and (prefers-reduced-motion: no-preference)";

/** A word as a sharp copy over a pre-blurred one; the reveal crossfades them (opacity only). */
function BlurWords({ text }: { text: string }) {
  const words = text.split(" ");
  return words.map((w, i) => (
    <span key={i} aria-hidden="true">
      <span className={styles.word}>
        <span data-w="sharp" className={styles.sharp}>
          {w}
        </span>
        <span data-w="soft" className={styles.soft}>
          {w}
        </span>
      </span>
      {i < words.length - 1 ? " " : null}
    </span>
  ));
}

/**
 * Selected work. "Built for real work." resolves out of the dark in the middle
 * of the screen (held there with CSS sticky while scroll crossfades each word
 * from blurred to sharp), then gives way to the projects.
 *
 * On wide screens each project is a scene: its film fills the screen behind
 * the copy (fixed layers, crossfaded through the dark between projects), and
 * the copy is held in place with CSS sticky while the film plays. The next
 * project's name rises from the bottom of the screen, resolving from a blur as
 * it climbs to the top-left. On phones, tablets and under reduced motion each
 * project stacks name, film and line over its own background colour.
 */
export function WorkFolds({
  work,
  intro,
  themes,
  exit = "light",
}: {
  work: HomeContent["work"];
  intro: string;
  themes: Record<string, string>;
  /**
   * "light": the colours hand back to the light page as the last project leaves.
   * "dark": a night section follows, so the colours stay until it covers the
   * screen and only then switch off, with no light band in between.
   */
  exit?: "light" | "dark";
}) {
  const root = useRef<HTMLDivElement>(null);

  useGSAP(
    () => {
      const mm = gsap.matchMedia();
      const el = root.current!;
      const set = el.querySelector<HTMLElement>("[data-w=themes]")!;
      const introEl = el.querySelector<HTMLElement>("[data-w=intro]")!;
      const layers = gsap.utils.toArray<HTMLElement>("[data-w=theme]", el);
      const folds = gsap.utils.toArray<HTMLElement>("[data-w=fold]", el);
      const last = folds[folds.length - 1];

      mm.add(FULL, () => {
        // The intro line: words resolve from a blur as the line settles in the
        // middle of the screen, hold, then soften and fade as the work arrives.
        const line = introEl.querySelector<HTMLElement>("[data-w=line]")!;
        const sharp = gsap.utils.toArray<HTMLElement>("[data-w=sharp]", line);
        const soft = gsap.utils.toArray<HTMLElement>("[data-w=soft]", line);
        const tl = gsap.timeline({
          defaults: { ease: "none" },
          scrollTrigger: { trigger: introEl, start: "top 30%", end: "bottom bottom", scrub: true },
        });
        tl.fromTo(line, { scale: 1.12 }, { scale: 1, duration: 0.5, ease: "power2.out" }, 0);
        sharp.forEach((s, i) => {
          const at = 0.05 + i * 0.08;
          tl.fromTo(soft[i], { opacity: 0 }, { opacity: 1, duration: 0.14 }, at)
            .to(soft[i], { opacity: 0, duration: 0.2 }, at + 0.14)
            .fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.22 }, at + 0.1);
        });
        tl.to({}, { duration: 0.25 });
        const outAt = tl.duration();
        tl.to(line, { scale: 1.05, duration: 0.3 }, outAt);
        sharp.forEach((s, i) => {
          tl.to(soft[i], { opacity: 0.8, duration: 0.1 }, outAt + i * 0.03)
            .to(s, { opacity: 0, duration: 0.14 }, outAt + i * 0.03)
            .to(soft[i], { opacity: 0, duration: 0.18 }, outAt + 0.1 + i * 0.03);
        });

        // The set (with its night base) switches on while the solid night intro
        // covers the screen, so the change is never seen; it hands back to the
        // light page as the last project leaves.
        gsap.fromTo(
          set,
          { opacity: 0 },
          {
            opacity: 1,
            ease: "none",
            scrollTrigger: { trigger: introEl, start: "top 20%", end: "top top", scrub: true },
          },
        );
        gsap.fromTo(
          set,
          { opacity: 1 },
          {
            opacity: 0,
            ease: "none",
            immediateRender: false,
            scrollTrigger:
              exit === "dark"
                ? { trigger: last, start: "bottom top", end: "bottom -20%", scrub: true }
                : { trigger: last, start: "bottom 70%", end: "bottom 20%", scrub: true },
          },
        );
      });

      // Phones, tablets: each project's colour crossfades in over the last.
      mm.add("(max-width: 899px) and (prefers-reduced-motion: no-preference)", () => {
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
      });

      // Wide screens: the scenes.
      mm.add(IMMERSIVE, () => {
        folds.forEach((fold, i) => {
          const layer = layers[i];
          const media = layer.querySelector<HTMLElement>("[data-w=media]");
          const video = layer.querySelector<HTMLVideoElement>("video");
          const name = fold.querySelector<HTMLElement>("[data-w=name]")!;
          const nSharp = gsap.utils.toArray<HTMLElement>("[data-w=sharp]", name);
          const nSoft = gsap.utils.toArray<HTMLElement>("[data-w=soft]", name);
          const meta = fold.querySelectorAll<HTMLElement>("[data-w=meta]");

          // The film comes up out of the dark as its copy rises into place,
          // easing back from a slight zoom.
          gsap
            .timeline({
              defaults: { ease: "none" },
              scrollTrigger: { trigger: fold, start: "top 55%", end: "top top", scrub: true },
            })
            .fromTo(layer, { opacity: 0 }, { opacity: 1, duration: 1 }, 0)
            .fromTo(media, { scale: 1.08 }, { scale: 1, duration: 1, ease: "power1.out" }, 0);
          // ...and sinks back into the dark before the next one, except the last,
          // which the whole set carries out.
          if (i < folds.length - 1)
            gsap.fromTo(
              layer,
              { opacity: 1 },
              {
                opacity: 0,
                ease: "none",
                immediateRender: false,
                scrollTrigger: {
                  trigger: fold,
                  start: "bottom 95%",
                  end: "bottom 55%",
                  scrub: true,
                },
              },
            );

          // The name resolves from a blur while it climbs from the bottom of the
          // screen to the top-left; its line and link follow once it lands.
          const enter = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: fold, start: "top 95%", end: "top top", scrub: true },
          });
          nSharp.forEach((s, j) => {
            const at = j * 0.12;
            enter
              .fromTo(nSoft[j], { opacity: 0 }, { opacity: 1, duration: 0.25 }, at)
              .to(nSoft[j], { opacity: 0, duration: 0.35 }, at + 0.45)
              .fromTo(s, { opacity: 0 }, { opacity: 1, duration: 0.4 }, at + 0.4);
          });
          enter.fromTo(
            meta,
            { opacity: 0, y: 16 },
            { opacity: 1, y: 0, duration: 0.3, stagger: 0.08 },
            Math.max(0.6, enter.duration() - 0.25),
          );

          // On the way out the name softens and goes first, then the line.
          const leave = gsap.timeline({
            defaults: { ease: "none" },
            scrollTrigger: { trigger: fold, start: "bottom 120%", end: "bottom 60%", scrub: true },
          });
          nSharp.forEach((s, j) => {
            const at = j * 0.06;
            // Explicit start values: the enter timeline owns the same properties.
            leave
              .fromTo(
                nSoft[j],
                { opacity: 0 },
                { opacity: 0.8, duration: 0.15, immediateRender: false },
                at,
              )
              .fromTo(s, { opacity: 1 }, { opacity: 0, duration: 0.2, immediateRender: false }, at)
              .to(nSoft[j], { opacity: 0, duration: 0.3 }, at + 0.15);
          });
          leave.fromTo(
            meta,
            { opacity: 1 },
            { opacity: 0, duration: 0.35, immediateRender: false },
            0.3,
          );

          // Only the film in view plays (they sit in fixed layers, always "on screen").
          if (video)
            ScrollTrigger.create({
              trigger: fold,
              start: "top bottom",
              end: "bottom top",
              onToggle: (self) => {
                if (self.isActive) {
                  if (video.preload !== "auto") video.preload = "auto";
                  video.play().catch(() => {});
                } else video.pause();
              },
            });
        });
      });
      return () => mm.revert();
    },
    { scope: root, dependencies: [exit] },
  );

  return (
    <div ref={root} className={styles.root}>
      {/* Fixed layers, one per project, stacked in order over a night base. */}
      <div data-w="themes" aria-hidden="true" className={styles.themes}>
        <div className={styles.base} />
        {work.items.map((it) => (
          <div
            key={it.key}
            data-w="theme"
            className={styles.theme}
            style={{ background: themes[it.key] ?? "var(--night)" }}
          >
            <div data-w="media" className={styles.media}>
              {it.placeholder ? (
                <div className={styles.hold}>
                  <span>Project film</span>
                </div>
              ) : (
                <video
                  muted
                  loop
                  playsInline
                  preload="none"
                  poster={it.video.poster}
                  className={styles.film}
                >
                  <source src={it.video.webm} type="video/webm" />
                  <source src={it.video.mp4} type="video/mp4" />
                </video>
              )}
            </div>
            <div className={styles.scrim} />
          </div>
        ))}
      </div>

      <section
        data-w="intro"
        data-screen-label="03 Work intro"
        data-noband=""
        data-nav-dark=""
        className={styles.intro}
      >
        <div className={styles.introStick}>
          <h2 data-w="line" className={styles.introLine} aria-label={intro}>
            <BlurWords text={intro} />
          </h2>
        </div>
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
                <span data-w="meta" className={styles.n}>
                  {String(i + 1).padStart(2, "0")}
                </span>
                <h3
                  id={`fold-${it.key}`}
                  data-w="name"
                  className={styles.name}
                  aria-label={it.name}
                >
                  <BlurWords text={it.name} />
                </h3>
              </div>
              <div data-w="meta" className={styles.bottom}>
                <p className={styles.line}>{it.copy}</p>
                {it.placeholder ? (
                  <span className={styles.soon}>Case study coming soon</span>
                ) : (
                  <ButtonLink href={it.href} tone="light" size="nav" arrow>
                    Explore
                  </ButtonLink>
                )}
              </div>
            </div>
            <div className={styles.stage}>
              {it.placeholder ? (
                <div className={`${styles.video} ${styles.hold}`}>
                  <span>Project film</span>
                </div>
              ) : (
                <LoopVideo src={it.video} className={styles.video} label={`${it.name} in use`} />
              )}
            </div>
          </article>
        ))}
      </section>
    </div>
  );
}
