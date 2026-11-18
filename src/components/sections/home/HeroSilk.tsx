"use client";

import { useEffect, useRef } from "react";
import { prefersReducedMotion } from "@/lib/motion";
import type { SilkColors } from "./silkScene";

/**
 * The hero's silk background (see silkScene.ts). three.js is fetched only
 * after the page has painted and the browser is idle, so the headline never
 * waits for it; the canvas fades in on its first frame. It pauses off screen
 * and in background tabs, and under reduced motion draws one still frame.
 * Without WebGL the canvas never shows and the CSS bands beneath stay.
 */
export function HeroSilk({ className }: { className?: string }) {
  const ref = useRef<HTMLCanvasElement>(null);

  useEffect(() => {
    const canvas = ref.current;
    if (!canvas) return;
    let disposed = false;
    let cleanup = () => {};

    const start = async () => {
      const { createSilk } = await import("./silkScene");
      if (disposed) return;
      const css = getComputedStyle(canvas);
      const tok = (n: string) => css.getPropertyValue(n).trim();
      const colors: SilkColors = {
        bg: tok("--night"),
        silk: tok("--silk"),
        sheen: tok("--silk-sheen"),
        key: tok("--silk-key"),
        rim: tok("--silk-rim"),
        shade: tok("--silk-shade"),
      };
      let silk: ReturnType<typeof createSilk>;
      try {
        silk = createSilk(canvas, colors);
      } catch {
        return; // No WebGL: the CSS bands stay.
      }
      const size = () => silk.resize(canvas.clientWidth || 1, canvas.clientHeight || 1);
      size();
      const t0 = performance.now();
      // Start part-way into the swing, where the composition is settled.
      const offset = 4;
      const reduced = prefersReducedMotion();

      const ro = new ResizeObserver(() => {
        size();
        if (reduced) silk.render(offset);
      });
      ro.observe(canvas);

      silk.render(offset);
      canvas.dataset.ready = "";

      if (reduced) {
        cleanup = () => {
          ro.disconnect();
          silk.dispose();
        };
        return;
      }

      let raf = 0;
      let visible = true;
      const loop = (now: number) => {
        silk.render(offset + (now - t0) / 1000);
        raf = requestAnimationFrame(loop);
      };
      const run = () => {
        if (!raf && visible && !document.hidden) raf = requestAnimationFrame(loop);
      };
      const stop = () => {
        cancelAnimationFrame(raf);
        raf = 0;
      };
      const io = new IntersectionObserver(([e]) => {
        visible = e.isIntersecting;
        if (visible) run();
        else stop();
      });
      io.observe(canvas);
      const onVis = () => (document.hidden ? stop() : run());
      document.addEventListener("visibilitychange", onVis);

      const fine = window.matchMedia("(hover: hover) and (pointer: fine)").matches;
      const onMove = (e: PointerEvent) => {
        const r = canvas.getBoundingClientRect();
        if (e.clientY < r.top || e.clientY > r.bottom) return;
        silk.pointer(e.clientX - r.left, e.clientY - r.top);
      };
      if (fine) window.addEventListener("pointermove", onMove, { passive: true });
      run();

      cleanup = () => {
        stop();
        io.disconnect();
        ro.disconnect();
        document.removeEventListener("visibilitychange", onVis);
        window.removeEventListener("pointermove", onMove);
        silk.dispose();
      };
    };

    // Wait for the page to paint and settle before fetching three.js.
    const ric = typeof window.requestIdleCallback === "function";
    const idle = ric
      ? window.requestIdleCallback(() => void start(), { timeout: 1500 })
      : window.setTimeout(() => void start(), 300);

    return () => {
      disposed = true;
      if (ric) window.cancelIdleCallback(idle);
      else window.clearTimeout(idle);
      cleanup();
    };
  }, []);

  return <canvas ref={ref} aria-hidden="true" className={className} />;
}
