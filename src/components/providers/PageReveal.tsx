"use client";

import { gsap, ScrollTrigger, useGSAP, FULL, EASE } from "@/lib/motion";

/**
 * Page-level scroll reveals.
 * - `[data-split]` headings: words rise in sequence once, as they enter.
 * - `[data-reveal]` blocks: fade plus 14px rise (.65s), via ScrollTrigger.batch, once.
 * Reduced motion: nothing is hidden, nothing animates.
 */
export function PageReveal() {
  useGSAP(() => {
    const mm = gsap.matchMedia();
    mm.add(FULL, () => {
      document.querySelectorAll<HTMLElement>("main [data-split]").forEach((h) => {
        const words = h.querySelectorAll<HTMLElement>("[data-word]");
        if (!words.length) return;
        gsap.set(words, { yPercent: 115, rotate: 4 });
        ScrollTrigger.create({
          trigger: h,
          start: "top 90%",
          once: true,
          onEnter: () =>
            gsap.to(words, {
              yPercent: 0,
              rotate: 0,
              duration: 0.9,
              ease: EASE,
              stagger: { each: 0.045, amount: Math.min(words.length * 0.045, 0.6) },
            }),
        });
      });

      const blocks = gsap.utils.toArray<HTMLElement>("main [data-reveal]");
      if (blocks.length) {
        gsap.set(blocks, { opacity: 0, y: 14 });
        ScrollTrigger.batch(blocks, {
          start: "top 90%",
          once: true,
          onEnter: (batch) =>
            gsap.to(batch, {
              opacity: 1,
              y: 0,
              duration: 0.65,
              ease: EASE,
              stagger: 0.08,
              clearProps: "opacity,transform",
            }),
        });
      }
    });
    return () => mm.revert();
  });
  return null;
}
