"use client";

import { useCallback, useEffect, useRef, useState, type CSSProperties } from "react";
import { ButtonLink, TextLink } from "@/components/ui/Button";
import { useSmoothScroll } from "@/components/providers/SmoothScroll";
import { hero } from "@/content/home";
import { mountFog } from "@/lib/fog";
import { whenIntroDone } from "@/lib/intro";
import { gsap, prefersReducedMotion } from "@/lib/motion";
import { Showreel, reelBoxFrom, type ReelBox } from "./Showreel";
import styles from "./Hero.module.css";

export function Hero() {
  const root = useRef<HTMLElement>(null);
  const glow = useRef<HTMLDivElement>(null);
  const card = useRef<HTMLDivElement>(null);
  const video = useRef<HTMLVideoElement>(null);
  const cursor = useRef<HTMLDivElement>(null);
  const [cursorOn, setCursorOn] = useState(false);
  const [reel, setReel] = useState<ReelBox | null>(null);
  const reelOpen = !!reel;
  const spring = useRef({ x: 0, y: 0, vx: 0, vy: 0, tx: 0, ty: 0 });
  const { scrollTo } = useSmoothScroll();

  // The entrance (word reveal, lead/CTA fade, reel rise, aurora) is pure CSS so the
  // server-rendered headline paints without waiting for JS; it holds while the intro runs.
  let wordIndex = 0;

  // Cursor fog: hero only, once the intro has finished and the page has loaded.
  useEffect(() => {
    const el = root.current;
    if (!el) return;
    let kill: (() => void) | null = null;
    let t = 0;
    const offDone = whenIntroDone(() => {
      const go = () => {
        t = window.setTimeout(() => {
          kill = mountFog(el);
        }, 400);
      };
      if (document.readyState === "complete") requestAnimationFrame(go);
      else window.addEventListener("load", go, { once: true });
    });
    return () => {
      offDone();
      clearTimeout(t);
      kill?.();
    };
  }, []);

  // Hero reel loads after first paint (poster first); stays paused under reduced motion.
  useEffect(() => {
    const v = video.current;
    if (!v) return;
    const load = () => {
      if (v.dataset.loaded) return;
      v.dataset.loaded = "1";
      const canWebm = v.canPlayType('video/webm; codecs="vp9"') !== "";
      v.src = canWebm ? hero.reel.webm : hero.reel.mp4;
      v.muted = true;
      if (!prefersReducedMotion()) v.play().catch(() => {});
    };
    const idle = () =>
      "requestIdleCallback" in window
        ? requestIdleCallback(load, { timeout: 1500 })
        : setTimeout(load, 300);
    if (document.readyState === "complete") idle();
    else window.addEventListener("load", idle, { once: true });
    return () => window.removeEventListener("load", idle);
  }, []);

  // Pause the background reel while the full showreel plays.
  useEffect(() => {
    const v = video.current;
    if (!v || !v.dataset.loaded) return;
    if (reelOpen) v.pause();
    else if (!prefersReducedMotion()) v.play().catch(() => {});
  }, [reelOpen]);

  // Slow aurora drift + scroll-linked reel growth.
  useEffect(() => {
    const el = root.current!;
    const c = card.current!;
    const reduced = prefersReducedMotion();
    const t0 = performance.now();
    const s = spring.current;

    const setVw = () => {
      el.style.setProperty("--vw", `${document.documentElement.clientWidth}px`);
      el.style.setProperty("--vh", `${window.innerHeight}px`);
    };
    const onScroll = () => {
      const vh = window.innerHeight;
      const r = c.getBoundingClientRect();
      let q = Math.min(1, Math.max(0, (vh * 0.86 - r.top) / (vh * 0.66)));
      if (reduced) q = 1;
      const k = q < 0.5 ? 4 * q * q * q : 1 - Math.pow(-2 * q + 2, 3) / 2;
      el.style.setProperty("--k", k.toFixed(4));
    };
    const tick = () => {
      if (window.scrollY > window.innerHeight * 1.6) return;
      const now = performance.now();
      if (!reduced && glow.current) {
        const t = (now - t0) / 1000;
        glow.current.style.transform = `translate3d(${(Math.sin(t * 0.03) * 4).toFixed(3)}%,${(Math.cos(t * 0.024) * 3).toFixed(3)}%,0) scale(${(1 + Math.sin(t * 0.02) * 0.03).toFixed(4)})`;
      }
      const cur = cursor.current;
      if (cur) {
        if (reduced) {
          s.x = s.tx;
          s.y = s.ty;
        } else {
          s.vx = (s.vx + (s.tx - s.x) * 0.16) * 0.64;
          s.vy = (s.vy + (s.ty - s.y) * 0.16) * 0.64;
          s.x += s.vx;
          s.y += s.vy;
        }
        cur.style.transform = `translate3d(${s.x.toFixed(2)}px,${s.y.toFixed(2)}px,0)`;
      }
    };
    setVw();
    onScroll();
    window.addEventListener("resize", setVw);
    window.addEventListener("scroll", onScroll, { passive: true });
    window.addEventListener("resize", onScroll);
    gsap.ticker.add(tick);
    return () => {
      window.removeEventListener("resize", setVw);
      window.removeEventListener("scroll", onScroll);
      window.removeEventListener("resize", onScroll);
      gsap.ticker.remove(tick);
    };
  }, []);

  const openReel = () => {
    setCursorOn(false);
    setReel(reelBoxFrom(card.current!));
  };
  const closeReel = useCallback(() => {
    setReel(null);
    card.current?.querySelector<HTMLElement>('[role="button"]')?.focus({ preventScroll: true });
  }, []);

  const finePointer = () => window.matchMedia("(hover: hover) and (pointer: fine)").matches;
  const onReelMove = (e: React.MouseEvent) => {
    const s = spring.current;
    s.tx = e.clientX;
    s.ty = e.clientY;
    if (!cursorOn) {
      s.x = e.clientX;
      s.y = e.clientY;
      s.vx = s.vy = 0;
      if (finePointer()) setCursorOn(true);
    }
  };

  return (
    <section ref={root} data-hero="" data-screen-label="01 Hero" className={styles.hero}>
      <div aria-hidden="true" data-aurora="" className={styles.aurora}>
        <div ref={glow} className={styles.glowWrap}>
          <div className={styles.glow} />
        </div>
        <div className={styles.ambient}>
          <div data-bg-blob="" className={styles.blobA} />
          <div data-bg-blob="" className={styles.blobB} />
          <div data-bg-blob="" className={styles.blobC} />
        </div>
      </div>
      <div data-fog-fallback="" aria-hidden="true" className={styles.fogFallback} />
      <canvas data-fog-canvas="" aria-hidden="true" className={styles.fog} />

      <div className={styles.inner}>
        <div className={styles.grid}>
          <h1 className={styles.h1} aria-label={hero.lines.join(" ")}>
            {hero.lines.map((line, i) => (
              <span
                key={line}
                aria-hidden="true"
                className={
                  i === hero.lines.length - 1 ? `${styles.line} ${styles.accent}` : styles.line
                }
              >
                {line.split(" ").map((w, j, arr) => (
                  <span key={j}>
                    <span data-hero-word="" style={{ "--i": wordIndex++ } as CSSProperties}>
                      {w}
                    </span>
                    {j < arr.length - 1 ? " " : null}
                  </span>
                ))}{" "}
              </span>
            ))}
          </h1>
          <div className={styles.right}>
            <p data-hero-fade="" className={styles.lead}>
              {hero.lead}
            </p>
            <div data-hero-fade="" className={styles.ctas}>
              <ButtonLink href={hero.primary.href} data-track="cta_book_demo_click">
                {hero.primary.label}
              </ButtonLink>
              <TextLink
                href={hero.secondary.href}
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

        <div ref={card} className={styles.reel}>
          <div
            role="button"
            tabIndex={0}
            aria-label="Play the PSQUARE COMPANY showreel"
            className={styles.reelBtn}
            onClick={openReel}
            onKeyDown={(e) => {
              if (e.key === "Enter" || e.key === " ") {
                e.preventDefault();
                openReel();
              }
            }}
            onMouseEnter={onReelMove}
            onMouseMove={onReelMove}
            onMouseLeave={() => setCursorOn(false)}
          >
            <video
              ref={video}
              className={styles.video}
              muted
              loop
              playsInline
              preload="none"
              poster={hero.reel.poster}
              aria-hidden="true"
            />
            <div aria-hidden="true" className={styles.shade} />
          </div>
        </div>
      </div>

      <div ref={cursor} aria-hidden="true" className={styles.cursor}>
        <div
          className={
            cursorOn && !reelOpen ? `${styles.cursorPill} ${styles.cursorOn}` : styles.cursorPill
          }
        >
          <span className={styles.cursorPlay}>
            <span />
          </span>
          <span>Play showreel</span>
        </div>
      </div>

      {reel && <Showreel box={reel} src={hero.reel.mp4} onClose={closeReel} />}
    </section>
  );
}
