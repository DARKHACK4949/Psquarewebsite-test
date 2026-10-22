"use client";

import { useEffect, useRef } from "react";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { INTRO_DONE, INTRO_REVEAL } from "@/lib/intro";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import styles from "./IntroLoader.module.css";

const WORD = "PSQUARE COMPANY";

/**
 * Brand intro (once per session): the mark grows into a tile, the wordmark
 * types out, then the lock-up opens into a window that expands to reveal the
 * page. Any pointer down or Escape skips it.
 */
export function IntroLoader({ introKey }: { introKey: string }) {
  const bg = useRef<HTMLDivElement>(null);
  const ring = useRef<HTMLDivElement>(null);
  const fill = useRef<HTMLDivElement>(null);
  const fg = useRef<HTMLDivElement>(null);
  const lock = useRef<HTMLDivElement>(null);
  const tile = useRef<HTMLDivElement>(null);
  const mark = useRef<HTMLImageElement>(null);
  const word = useRef<HTMLDivElement>(null);
  const { lock: lockScroll } = useSmoothScroll();

  useEffect(() => {
    const html = document.documentElement;
    let mode = html.dataset.intro;
    if (mode !== "run") {
      // Soft navigation onto the homepage: decide here instead of the inline script.
      try {
        if (!sessionStorage.getItem(introKey)) {
          html.dataset.intro = "run";
          mode = "run";
        }
      } catch {}
    }
    if (mode !== "run") return;
    try {
      sessionStorage.setItem(introKey, "1");
    } catch {}

    const page = document.getElementById("psq-page");
    const hero = document.querySelector<HTMLElement>("[data-hero]");
    const timers: number[] = [];
    let tl: gsap.core.Timeline | null = null;
    let done = false;
    let revealed = false;

    try {
      history.scrollRestoration = "manual";
    } catch {}
    window.scrollTo(0, 0);
    lockScroll(true);

    const reveal = () => {
      if (revealed) return;
      revealed = true;
      html.dataset.intro = "reveal";
      window.dispatchEvent(new Event(INTRO_REVEAL));
    };
    const finish = () => {
      if (done) return;
      done = true;
      reveal();
      window.removeEventListener("pointerdown", onSkip);
      window.removeEventListener("keydown", onSkip);
      if (page) {
        page.style.clipPath = "";
        page.style.zIndex = "";
        page.style.opacity = "";
        page.style.willChange = "";
        page.style.transition = "";
      }
      if (hero) {
        hero.style.transform = "";
        hero.style.willChange = "";
      }
      lockScroll(false);
      window.scrollTo(0, 0);
      delete html.dataset.intro;
      window.dispatchEvent(new Event(INTRO_DONE));
    };
    const skip = () => {
      if (done) return;
      timers.forEach(clearTimeout);
      tl?.kill();
      if (page) {
        page.style.clipPath = "";
        page.style.opacity = "";
      }
      if (hero) hero.style.transform = "";
      [bg, ring, fill, fg].forEach((r) => {
        if (!r.current) return;
        r.current.style.transition = "opacity .2s ease";
        r.current.style.opacity = "0";
      });
      reveal();
      timers.push(window.setTimeout(finish, 220));
    };
    const onSkip = (e: Event) => {
      if (e instanceof KeyboardEvent && e.key !== "Escape") return;
      skip();
    };
    window.addEventListener("pointerdown", onSkip);
    window.addEventListener("keydown", onSkip);

    const runReduced = () => {
      const f = fg.current;
      if (!f) return finish();
      if (tile.current) tile.current.style.transform = "none";
      if (mark.current) mark.current.style.opacity = "1";
      f.querySelectorAll<HTMLElement>("[data-l]").forEach((el) => (el.style.transform = "none"));
      timers.push(
        window.setTimeout(() => {
          reveal();
          if (page) {
            page.style.opacity = "0";
            page.style.zIndex = "101";
            page.style.transition = "opacity .4s ease";
            requestAnimationFrame(() => (page.style.opacity = "1"));
          }
          f.style.transition = "opacity .4s ease";
          f.style.opacity = "0";
        }, 600),
      );
      timers.push(window.setTimeout(finish, 1050));
    };

    const runIntro = () => {
      const lk = lock.current!,
        tl0 = tile.current!,
        mk = mark.current!,
        wd = word.current!,
        rg = ring.current!,
        fl = fill.current!;
      if (!page) return runReduced();
      const letters = wd.querySelectorAll("[data-l]");
      const vw = window.innerWidth,
        vh = window.innerHeight;
      const TW = tl0.offsetWidth,
        H = lk.offsetHeight,
        L = lk.offsetLeft,
        T = lk.offsetTop,
        W = lk.offsetWidth;
      const RAD = Math.round(TW * 0.2);
      const box = { l: L, t: T, r: L + TW, b: T + H, rad: RAD };
      let uncovering = false;
      const R = Math.round;
      const ins = (i: number, rad: number) =>
        `inset(${R(box.t) + i}px ${vw - R(box.r) + i}px ${vh - R(box.b) + i}px ${R(box.l) + i}px round ${R(rad)}px)`;
      const apply = () => {
        rg.style.clipPath = ins(0, box.rad);
        const inner = ins(2, Math.max(0, box.rad - 2));
        fl.style.clipPath = inner;
        if (uncovering) page.style.clipPath = inner;
      };
      apply();
      const ow = Math.min(vw - 40, W - TW + TW * 1.6),
        oh = H * 2.1;
      const cx = L + W / 2,
        cy = T + H / 2;
      if (hero) gsap.set(hero, { scale: 1.15, transformOrigin: "50% 40%", force3D: true });
      page.style.willChange = "clip-path";
      if (hero) hero.style.willChange = "transform";

      tl = gsap.timeline({ onComplete: finish });
      tl.fromTo(
        tl0,
        { scale: 2 / 28, borderRadius: "50%" },
        { scale: 10 / 28, duration: 0.35, ease: "power3.out" },
        0,
      )
        .to(tl0, { scale: 1, borderRadius: RAD, duration: 0.6, ease: "expo.out" }, 0.25)
        .fromTo(
          mk,
          { scale: 0.6, opacity: 0 },
          { scale: 1, opacity: 1, duration: 0.6, ease: "expo.out" },
          0.3,
        )
        .set(rg, { opacity: 1 }, 1.0)
        .to(box, { r: L + W, duration: 0.8, ease: "power3.inOut", onUpdate: apply }, 1.0)
        .to(letters, { yPercent: 0, y: 0, duration: 0.7, ease: "power3.out", stagger: 0.03 }, 1.05)
        .set(tl0, { transformOrigin: "0% 50%" }, 2.15)
        .to(tl0, { scaleX: 0, duration: 0.45, ease: "power3.inOut" }, 2.15)
        .to(lk, { x: -TW / 2, duration: 0.45, ease: "power3.inOut" }, 2.15)
        .to(
          box,
          {
            l: L + TW / 2,
            r: L + W - TW / 2,
            duration: 0.45,
            ease: "power3.inOut",
            onUpdate: apply,
          },
          2.15,
        )
        .call(
          () => {
            uncovering = true;
            page.style.zIndex = "104";
            fl.style.opacity = "0";
            apply();
          },
          undefined,
          2.55,
        )
        .to(
          box,
          {
            l: cx - ow / 2,
            r: cx + ow / 2,
            t: cy - oh / 2,
            b: cy + oh / 2,
            duration: 0.55,
            ease: "power3.inOut",
            onUpdate: apply,
          },
          2.55,
        )
        .to(rg, { backgroundColor: "#fafaf8", duration: 0.3, ease: "none" }, 2.55)
        .call(reveal, undefined, 3.05)
        .to(
          box,
          { l: 0, t: 0, r: vw, b: vh, rad: 0, duration: 1.15, ease: "expo.inOut", onUpdate: apply },
          3.0,
        )
        .to(hero, { scale: 1, duration: 1.3, ease: "expo.inOut" }, 3.0)
        .to(wd, { opacity: 0, y: -8, duration: 0.45, ease: "power2.out" }, 3.35)
        .to(rg, { opacity: 0, duration: 0.35, ease: "power1.out" }, 3.95)
        .set({}, {}, 4.3);
    };

    const fonts = document.fonts?.ready ?? Promise.resolve();
    Promise.race([fonts, new Promise((r) => setTimeout(r, 1200))]).then(() => {
      if (done) return;
      requestAnimationFrame(() => (prefersReducedMotion() ? runReduced() : runIntro()));
    });

    return () => {
      timers.forEach(clearTimeout);
      tl?.kill();
      window.removeEventListener("pointerdown", onSkip);
      window.removeEventListener("keydown", onSkip);
      if (!done) {
        lockScroll(false);
        delete html.dataset.intro;
      }
    };
  }, [lockScroll, introKey]);

  return (
    <div className={styles.root}>
      <div ref={bg} aria-hidden="true" className={styles.bg} />
      <div ref={ring} aria-hidden="true" className={styles.ring} />
      <div ref={fill} aria-hidden="true" className={styles.fill} />
      <div ref={fg} role="status" aria-label="Loading PSQUARE COMPANY" className={styles.fg}>
        <div ref={lock} className={styles.lock}>
          <div ref={tile} className={styles.tile}>
            {/* eslint-disable-next-line @next/next/no-img-element */}
            <img ref={mark} src="/images/psquare-mark.svg" alt="" />
          </div>
          <div ref={word} className={styles.word}>
            {WORD.split("").map((ch, i) =>
              ch === " " ? (
                <span key={i} className={styles.gap} />
              ) : (
                <span key={i} className={styles.clip}>
                  <span data-l="">{ch}</span>
                </span>
              ),
            )}
          </div>
        </div>
      </div>
    </div>
  );
}
