"use client";

import { createContext, useContext, useEffect, useMemo, useRef, type ReactNode } from "react";
import Lenis from "lenis";
import { gsap, ScrollTrigger, prefersReducedMotion } from "@/lib/motion";

type ScrollTarget = number | string | HTMLElement;

type ScrollApi = {
  scrollTo: (target: ScrollTarget, opts?: { duration?: number }) => void;
  /** Reference-counted scroll lock (menus, lightbox, intro). */
  lock: (locked: boolean) => void;
};

const ScrollContext = createContext<ScrollApi>({ scrollTo: () => {}, lock: () => {} });

export const useSmoothScroll = () => useContext(ScrollContext);

/**
 * Lenis smooth scrolling synced to GSAP's ticker, as specified in the handoff:
 * lenis.on('scroll', ScrollTrigger.update) + gsap.ticker driving lenis.raf.
 * Skipped entirely under prefers-reduced-motion.
 */
export function SmoothScroll({ children }: { children: ReactNode }) {
  const lenis = useRef<Lenis | null>(null);
  const locks = useRef(0);

  useEffect(() => {
    if (prefersReducedMotion()) return;
    const l = new Lenis({ lerp: 0.1, smoothWheel: true, anchors: true });
    l.on("scroll", ScrollTrigger.update);
    const tick = (t: number) => l.raf(t * 1000);
    gsap.ticker.add(tick);
    gsap.ticker.lagSmoothing(0);
    lenis.current = l;
    if (locks.current > 0) l.stop();
    return () => {
      gsap.ticker.remove(tick);
      l.destroy();
      lenis.current = null;
    };
  }, []);

  const api = useMemo<ScrollApi>(
    () => ({
      scrollTo: (target, opts) => {
        const l = lenis.current;
        if (l) {
          l.scrollTo(target, { duration: opts?.duration ?? 1.2 });
          return;
        }
        const behavior: ScrollBehavior = prefersReducedMotion() ? "auto" : "smooth";
        if (typeof target === "number") window.scrollTo({ top: target, behavior });
        else {
          const el = typeof target === "string" ? document.querySelector(target) : target;
          el?.scrollIntoView({ behavior });
        }
      },
      lock: (locked) => {
        locks.current = Math.max(0, locks.current + (locked ? 1 : -1));
        const on = locks.current > 0;
        document.documentElement.style.overflow = on ? "hidden" : "";
        const l = lenis.current;
        if (l) {
          if (on) l.stop();
          else l.start();
        }
      },
    }),
    [],
  );

  return <ScrollContext.Provider value={api}>{children}</ScrollContext.Provider>;
}
